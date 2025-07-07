// Notification store for managing app notifications
class NotificationStore {
  constructor() {
    this.notifications = [];
    this.listeners = [];
    this.nextId = 1;
    
    // Load notifications from localStorage on init
    this.loadNotifications();
  }

  // Add a new notification
  addNotification(notification) {
    const newNotification = {
      id: this.nextId++,
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    this.notifications.unshift(newNotification); // Add to beginning
    this.saveNotifications();
    this.notifyListeners();
    
    return newNotification;
  }

  // Mark notification as read
  markAsRead(id) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
      this.notifyListeners();
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Remove a notification
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.saveNotifications();
    this.notifyListeners();
  }

  // Clear all notifications
  clearAll() {
    this.notifications = [];
    this.saveNotifications();
    this.notifyListeners();
  }

  // Get all notifications
  getNotifications() {
    return [...this.notifications];
  }

  // Get unread count
  getUnreadCount() {
    return this.notifications.filter(n => !n.read).length;
  }

  // Subscribe to changes
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notify all listeners
  notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Save to localStorage
  saveNotifications() {
    try {
      // Only keep last 50 notifications to prevent localStorage bloat
      const toSave = this.notifications.slice(0, 50);
      localStorage.setItem('app-notifications', JSON.stringify(toSave));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  // Load from localStorage
  loadNotifications() {
    try {
      const saved = localStorage.getItem('app-notifications');
      if (saved) {
        this.notifications = JSON.parse(saved);
        // Find the highest ID to continue from
        this.nextId = Math.max(...this.notifications.map(n => n.id), 0) + 1;
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
      this.notifications = [];
    }
  }
}

// Create singleton instance
const notificationStore = new NotificationStore();

export default notificationStore;

// Helper function to add different types of notifications
export const addTaskNotification = (title, taskInfo, type = 'task-due') => {
  return notificationStore.addNotification({
    type: taskInfo.type || type,
    title,
    message: taskInfo.message || `Task: ${taskInfo.taskTitle}`,
    taskId: taskInfo.taskId,
    taskTitle: taskInfo.taskTitle,
    dueTime: taskInfo.dueTime,
    priority: taskInfo.priority || 'medium',
    icon: taskInfo.icon || '⏰',
    category: 'duty-checklist'
  });
};

export const addSystemNotification = (title, message, type = 'info') => {
  return notificationStore.addNotification({
    type,
    title,
    message,
    priority: type === 'error' ? 'high' : 'medium',
    icon: type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️',
    category: 'system'
  });
};
