import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  Divider,
  Button,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import notificationStore from '../utils/notificationStore';

function NotificationIcon({ onNavigateToTask }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Subscribe to notification store changes
  useEffect(() => {
    const updateNotifications = () => {
      setNotifications(notificationStore.getNotifications());
      setUnreadCount(notificationStore.getUnreadCount());
    };

    // Initial load
    updateNotifications();

    // Subscribe to changes
    const unsubscribe = notificationStore.subscribe(updateNotifications);

    return unsubscribe;
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Mark all notifications as read when opening
    notificationStore.markAllAsRead();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    if (notification.taskId && onNavigateToTask) {
      onNavigateToTask(notification.taskId);
    }
    handleClose();
  };

  const handleClearAll = () => {
    notificationStore.clearAll();
    handleClose();
  };

  const getNotificationIcon = (notification) => {
    switch (notification.type) {
      case 'task-overdue':
        return <WarningIcon sx={{ color: 'error.main' }} />;
      case 'task-due':
        return <ScheduleIcon sx={{ color: 'warning.main' }} />;
      case 'task-completed':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'error':
        return <WarningIcon sx={{ color: 'error.main' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      case 'duty-status':
        return <CheckCircleIcon sx={{ color: 'info.main' }} />;
      default:
        return <InfoIcon sx={{ color: 'info.main' }} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleClick}
          sx={{ 
            ml: 1,
            minWidth: { xs: 48, sm: 40 },
            minHeight: { xs: 48, sm: 40 },
          }}
          aria-label="notifications"
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                right: -3,
                top: -3,
                fontSize: '0.75rem',
                minWidth: unreadCount > 9 ? 20 : 16,
                height: unreadCount > 9 ? 20 : 16,
              }
            }}
          >
            <NotificationsIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.2rem' } }} />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: { xs: '90vw', sm: 380 },
            maxWidth: 400,
            maxHeight: { xs: '70vh', sm: 500 },
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Notifications
            </Typography>
            {notifications.length > 0 && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={handleClearAll}
                sx={{ minWidth: 'auto' }}
              >
                Clear All
              </Button>
            )}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {notifications.length === 0 
              ? 'No notifications' 
              : `${notifications.length} notification${notifications.length !== 1 ? 's' : ''}`
            }
          </Typography>
        </Box>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
            <Typography variant="caption" color="text.secondary">
              You'll see task reminders and system updates here
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: { xs: '50vh', sm: 360 }, overflow: 'auto' }}>
            {notifications.map((notification, index) => (
              <MenuItem
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  px: 2,
                  py: 1.5,
                  borderBottom: index === notifications.length - 1 ? 'none' : 1,
                  borderColor: 'divider',
                  alignItems: 'flex-start',
                  minHeight: 'auto',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  cursor: notification.taskId ? 'pointer' : 'default',
                }}
                disabled={!notification.taskId}
              >
                <ListItemIcon sx={{ mt: 0.5, minWidth: 36 }}>
                  {getNotificationIcon(notification)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 'medium', flex: 1 }}>
                        {notification.title}
                      </Typography>
                      <Chip
                        label={notification.priority}
                        size="small"
                        color={getPriorityColor(notification.priority)}
                        variant="outlined"
                        sx={{ 
                          height: 18, 
                          fontSize: '0.6rem',
                          '& .MuiChip-label': { px: 0.5 }
                        }}
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {notification.message}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatTime(notification.timestamp)}
                        </Typography>
                        {notification.dueTime && (
                          <Typography variant="caption" color="text.secondary">
                            Due: {notification.dueTime}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  }
                />
              </MenuItem>
            ))}
          </Box>
        )}

        {/* Footer hint for task notifications */}
        {notifications.some(n => n.taskId) && (
          <>
            <Divider />
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                💡 Click task notifications to jump to the checklist item
              </Typography>
            </Box>
          </>
        )}
      </Menu>
    </>
  );
}

export default NotificationIcon;
