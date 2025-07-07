import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  ListItemButton,
  TextField,
  InputAdornment,
  Paper,
  Popper,
  ClickAwayListener,
  Fade,
  ListItemAvatar,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Info,
  Settings,
  Help,
  WavingHand,
  Search as SearchIcon,
  Close as CloseIcon,
  Store,
  Security,
  PersonAdd,
  MenuBook,
  ClearAll,
  GetApp,
} from '@mui/icons-material';
import PWAInstallButton from './PWAInstallButton';
import NotificationIcon from './NotificationIcon';
import { getAllGuidePages } from '../guidepages';

function CustomAppBar({ onShowWelcome, onPageChange, onGuidePageChange, currentPage, onNavigateToTask }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const searchContainerRef = useRef(null);

  // Memoize the search index to prevent infinite re-renders
  const searchIndex = useMemo(() => {
    // Get guide pages for search index
    const guidePages = getAllGuidePages();

    // Map guide pages to search index format with appropriate icons
    const getGuideIcon = (category) => {
      switch (category) {
        case 'Management':
          return <Store />;
        case 'Security':
          return <Security />;
        case 'HR':
          return <PersonAdd />;
        default:
          return <MenuBook />;
      }
    };

    const guideSearchItems = guidePages.map(guidePage => {
      const { title, description, tags, category } = guidePage.metadata;
      return {
        page: 'guide',
        title: title,
        content: `${description} ${tags.join(' ')} ${category}`.toLowerCase(),
        icon: getGuideIcon(category),
        scrollTarget: 'top',
        guidePage: guidePage // Store the guide page object for navigation
      };
    });

    // Return the complete search index
    return [
    // Home page 
    { 
      page: 'home', 
      title: 'Welcome to 3AMB Guidebook', 
      content: 'guidebook navigate 3AMB ecosystem menu sections customize experience settings',
      icon: <Home />,
      scrollTarget: 'top'
    },
    
    // About page 
    { 
      page: 'about', 
      title: 'About 3AMB Guidebook', 
      content: 'comprehensive digital companion 3AMB ecosystem usability accessibility efficiency mission',
      icon: <Info />,
      scrollTarget: 'top'
    },
    { 
      page: 'about', 
      title: 'Our Mission', 
      content: 'centralized user-friendly resource complex information accessible searchable actionable beautiful tailored needs',
      icon: <Info />,
      scrollTarget: 'mission'
    },
    { 
      page: 'about', 
      title: 'Key Features', 
      content: 'comprehensive guidebook customizable themes accessibility fast responsive modern technology reliable secure',
      icon: <Info />,
      scrollTarget: 'features'
    },
    { 
      page: 'about', 
      title: 'Technology Stack', 
      content: 'react material-ui javascript css html local storage api modern web technologies',
      icon: <Info />,
      scrollTarget: 'tech-stack'
    },
    { 
      page: 'about', 
      title: 'Getting Started Guide', 
      content: 'navigate customize explore hamburger menu settings procedures',
      icon: <Info />,
      scrollTarget: 'getting-started'
    },
    
    // Settings page 
    { 
      page: 'settings', 
      title: 'Settings - Appearance', 
      content: 'light mode dark mode high contrast theme appearance customize',
      icon: <Settings />,
      scrollTarget: 'appearance'
    },
    { 
      page: 'settings', 
      title: 'Settings - Typography', 
      content: 'font size small medium large typography text size adjustment',
      icon: <Settings />,
      scrollTarget: 'typography'
    },
    { 
      page: 'settings', 
      title: 'Settings - Reset', 
      content: 'reset defaults restore original settings',
      icon: <Settings />,
      scrollTarget: 'quick-actions'
    },
    
    // Help page 
    { 
      page: 'help', 
      title: 'Website Updates', 
      content: 'making updates website technical expertise contact development team github repository',
      icon: <Help />,
      scrollTarget: 'updates'
    },
    { 
      page: 'help', 
      title: 'Key Contacts', 
      content: 'web development team threeambtech@gmail.com phone contact website management',
      icon: <Help />,
      scrollTarget: 'contacts'
    },
    { 
      page: 'help', 
      title: 'Technical Resources', 
      content: 'github repository source code version control documentation wiki technical setup guides',
      icon: <Help />,
      scrollTarget: 'technical'
    },
    { 
      page: 'help', 
      title: 'Update Procedures', 
      content: 'content updates users developers procedures different types updates',
      icon: <Help />,
      scrollTarget: 'procedures'
    },
    
    // Navigation items
    { 
      page: 'home', 
      title: 'Navigate to Home', 
      content: 'home main page welcome guidebook',
      icon: <Home />,
      scrollTarget: 'top'
    },
    { 
      page: 'about', 
      title: 'Navigate to About', 
      content: 'about information features technology mission',
      icon: <Info />,
      scrollTarget: 'top'
    },
    { 
      page: 'settings', 
      title: 'Navigate to Settings', 
      content: 'settings preferences customize theme font size',
      icon: <Settings />,
      scrollTarget: 'top'
    },
    { 
      page: 'help', 
      title: 'Navigate to Help', 
      content: 'help update page contacts procedures resources',
      icon: <Help />,
      scrollTarget: 'top'
    },
    
    // DS Checklist - specific entry for direct access
    {
      page: 'guide',
      title: 'DS Checklist',
      content: 'duty storeman checklist daily tasks store management opening closing inventory',
      icon: <Store />,
      scrollTarget: 'ds-checklist',
      guidePage: guidePages.find(gp => gp.metadata.id === 'store-manager-duty') // Find the store management guide
    },
    
    // Guide pages - dynamically added
    ...guideSearchItems,
    ];
  }, []); // Empty dependency array since getAllGuidePages() is stable

  // Search function
  const performSearch = useCallback((query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ');
    const results = searchIndex.filter(item => {
      const searchText = `${item.title} ${item.content}`.toLowerCase();
      return searchTerms.some(term => searchText.includes(term));
    }).slice(0, 8); // Limit to 8 results

    setSearchResults(results);
  }, [searchIndex]);

  // Update search results when query changes
  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery, performSearch]);

  // Search button toggle handler
  const handleSearchToggle = (event) => {
    if (!searchOpen) {
      setSearchOpen(true);
      // Set the search container as anchor for consistent positioning
      setAnchorEl(searchContainerRef.current);
    } else {
      handleSearchClose();
    }
  };

  const handleSearchClose = () => {
    setSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setAnchorEl(null);
  };

  const handleSearchResultClick = (result) => {
    handleSearchClose();
    setDrawerOpen(false);
    
    // Check if this is a guide page
    if (result.page === 'guide' && result.guidePage && onGuidePageChange) {
      onGuidePageChange(result.guidePage);
      
      // Handle scrolling to specific section within guide page
      if (result.scrollTarget && result.scrollTarget !== 'top') {
        setTimeout(() => {
          const element = document.getElementById(result.scrollTarget);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 300); // Longer delay for guide page navigation
      } else {
        // Scroll to top if no specific target
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    } else if (onPageChange) {
      onPageChange(result.page);
      
      // Scroll to specific section after a short delay to allow page to load
      if (result.scrollTarget && result.scrollTarget !== 'top') {
        setTimeout(() => {
          const element = document.getElementById(result.scrollTarget);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 100);
      } else {
        // Scroll to top if no specific target
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleShowWelcome = () => {
    setDrawerOpen(false);
    if (onShowWelcome) {
      onShowWelcome();
    }
  };

  const handlePageNavigation = (page) => {
    setDrawerOpen(false);
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Clear cache function for development
  const handleClearCache = async () => {
    try {
      console.log('🧹 Starting comprehensive cache clearing...');
      
      // Clear localStorage
      localStorage.clear();
      console.log('✅ localStorage cleared');
      
      // Clear sessionStorage
      sessionStorage.clear();
      console.log('✅ sessionStorage cleared');
      
      // Clear indexedDB if available
      if ('indexedDB' in window) {
        try {
          const databases = await indexedDB.databases?.();
          if (databases) {
            await Promise.all(databases.map(db => {
              console.log(`🗄️ Deleting IndexedDB: ${db.name}`);
              return indexedDB.deleteDatabase(db.name);
            }));
            console.log('✅ IndexedDB cleared');
          }
        } catch (dbError) {
          console.warn('⚠️ IndexedDB clearing failed:', dbError);
        }
      }
      
      // Clear all service worker caches (PWA caches)
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(cacheNames.map(cacheName => {
            console.log(`🗂️ Deleting PWA cache: ${cacheName}`);
            return caches.delete(cacheName);
          }));
          console.log('✅ All PWA caches cleared');
        } catch (cacheError) {
          console.warn('⚠️ Service Worker cache clearing failed:', cacheError);
        }
      }
      
      // Unregister service worker if present
      if ('serviceWorker' in navigator) {
        try {
          const registrations = await navigator.serviceWorker.getRegistrations();
          await Promise.all(registrations.map(registration => {
            console.log('🔄 Unregistering service worker...');
            return registration.unregister();
          }));
          console.log('✅ Service workers unregistered');
        } catch (swError) {
          console.warn('⚠️ Service worker unregistration failed:', swError);
        }
      }
      
      // Clear any remaining browser storage
      try {
        // Clear any cookies for this domain
        document.cookie.split(";").forEach(cookie => {
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
        console.log('✅ Cookies cleared');
      } catch (cookieError) {
        console.warn('⚠️ Cookie clearing failed:', cookieError);
      }
      
      console.log('🎉 Cache clearing completed successfully!');
      
      // Show confirmation and reload
      alert('🧹 All caches cleared!\n\n' +
            '✅ localStorage & sessionStorage\n' +
            '✅ IndexedDB databases\n' +
            '✅ PWA service worker caches\n' +
            '✅ Service worker registrations\n' +
            '✅ Browser cookies\n\n' +
            'Page will reload to apply changes...');
      
      // Force reload to ensure clean state
      window.location.reload(true);
      
    } catch (error) {
      console.error('❌ Error during cache clearing:', error);
      alert('❌ Error clearing cache!\n\nCheck browser console for details.\n\n' +
            'Some caches may have been partially cleared.');
    }
  };

  const menuItems = [
    { 
      text: 'Home', 
      icon: <Home />, 
      action: () => handlePageNavigation('home'),
      page: 'home'
    },
    { 
      text: 'About', 
      icon: <Info />, 
      action: () => handlePageNavigation('about'),
      page: 'about'
    },
    { 
      text: 'Settings', 
      icon: <Settings />, 
      action: () => handlePageNavigation('settings'),
      page: 'settings'
    },
    { 
      text: 'Help', 
      icon: <Help />, 
      action: () => handlePageNavigation('help'),
      page: 'help'
    },
  ];

  return (
    <>
      <AppBar position="static" sx={{ zIndex: 1200 }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {/* Title */}
          {!searchOpen && (
            <Typography 
              variant="h6" 
              component="div"
              sx={{ 
                flexGrow: 1,
                textAlign: 'center',
                fontWeight: 'bold'
              }}
            >
              3AMB Guidebook
            </Typography>
          )}
          
          {/* PWA Install Button */}
          <PWAInstallButton />
          
          {/* Notification Icon */}
          <NotificationIcon onNavigateToTask={onNavigateToTask} />
          
          {/* Clear Cache Button (Development only) */}
          {process.env.NODE_ENV === 'development' && (
            <IconButton
              color="inherit"
              onClick={handleClearCache}
              title="Clear Cache (Dev)"
              sx={{ ml: 1 }}
            >
              <ClearAll />
            </IconButton>
          )}
          
          {/* Search functionality */}
          <Box 
            sx={{ 
              position: 'relative',
              flexGrow: searchOpen ? 1 : 0,
              display: 'flex',
              justifyContent: searchOpen ? 'center' : 'flex-end'
            }}
            ref={searchContainerRef}
          >
            {!searchOpen ? (
              <IconButton
                color="inherit"
                onClick={handleSearchToggle}
                sx={{ 
                  mr: 1,
                  minWidth: { xs: 48, sm: 40 }, // Larger touch target on mobile
                  minHeight: { xs: 48, sm: 40 },
                }}
                aria-label="search"
              >
                <SearchIcon sx={{ fontSize: { xs: '1.5rem', sm: '1.2rem' } }} />
              </IconButton>
            ) : (
              <ClickAwayListener 
                onClickAway={handleSearchClose}
                touchEvent="onTouchStart" // Better touch support
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  width: '100%',
                  maxWidth: { xs: '100%', sm: 600 }, // Full width on mobile
                  justifyContent: 'center'
                }}>
                  <TextField
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search guidebook..."
                    variant="outlined"
                    size="small"
                    sx={{
                      width: '100%',
                      mr: 1,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        color: 'white',
                        fontSize: { xs: '0.875rem', sm: '1rem' }, // Responsive font size
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.7)',
                        },
                      },
                      '& .MuiInputBase-input': {
                        padding: { xs: '8px 12px', sm: '8.5px 14px' }, // Responsive padding
                        '&::placeholder': {
                          color: 'rgba(255, 255, 255, 0.7)',
                          opacity: 1,
                          fontSize: { xs: '0.875rem', sm: '1rem' },
                        },
                      },
                    }}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ 
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: { xs: '1.2rem', sm: '1.5rem' }
                            }} />
                          </InputAdornment>
                        ),
                      }
                    }}
                  />
                  <IconButton
                    color="inherit"
                    onClick={handleSearchClose}
                    size="small"
                    sx={{
                      minWidth: { xs: 40, sm: 32 }, // Larger touch target on mobile
                      minHeight: { xs: 40, sm: 32 },
                      p: { xs: 1, sm: 0.5 },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: { xs: '1.2rem', sm: '1rem' } }} />
                  </IconButton>
                </Box>
              </ClickAwayListener>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Search Results Popper - Anchored to centered search container */}
      <Popper
        open={searchOpen && searchResults.length > 0}
        anchorEl={anchorEl}
        placement="bottom"
        transition
        sx={{ 
          zIndex: 1300,
          width: { xs: '95vw', sm: 400, md: 450 }, // Responsive width
          maxWidth: { xs: 'calc(100vw - 32px)', sm: 450 }, // Prevent overflow on mobile
        }}
        modifiers={[
          {
            name: 'offset',
            options: {
              offset: [0, 8],
            },
          },
          {
            name: 'preventOverflow',
            options: {
              boundary: 'viewport',
              padding: { xs: 16, sm: 24 }, // More padding on mobile
            },
          },
          {
            name: 'flip',
            options: {
              fallbackPlacements: ['top', 'bottom-start', 'bottom-end'],
            },
          },
        ]}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              elevation={8}
              sx={{
                maxHeight: { xs: '60vh', sm: 400 }, // Responsive max height
                overflow: 'auto',
                border: 1,
                borderColor: 'divider',
                width: '100%', // Take full width of Popper
                mx: { xs: 2, sm: 0 }, // Margin on mobile
              }}
            >
              <Box sx={{ p: { xs: 0.5, sm: 1 } }}> {/* Less padding on mobile */}
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ 
                    px: { xs: 1, sm: 2 }, 
                    py: { xs: 0.5, sm: 1 },
                    fontSize: { xs: '0.75rem', sm: '0.875rem' } // Smaller text on mobile
                  }}
                >
                  Search Results ({searchResults.length})
                </Typography>
                <List dense sx={{ py: 0 }}>
                  {searchResults.map((result, index) => (
                    <ListItemButton
                      key={`${result.type}-${result.page || result.id || index}`}
                      onClick={() => handleSearchResultClick(result)}
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        mx: { xs: 0.5, sm: 0 }, // Less margin on mobile
                        minHeight: { xs: 48, sm: 56 }, // Larger touch targets on mobile
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                        // Better touch feedback
                        '&:active': {
                          backgroundColor: 'action.selected',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          bgcolor: 'primary.main', 
                          width: { xs: 28, sm: 32 }, 
                          height: { xs: 28, sm: 32 } 
                        }}>
                          {result.icon}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={result.title}
                        secondary={`Page: ${result.page.charAt(0).toUpperCase() + result.page.slice(1)}`}
                        slotProps={{
                          primary: {
                            variant: 'body2',
                            sx: { 
                              fontWeight: 'medium',
                              fontSize: { xs: '0.875rem', sm: '0.875rem' }
                            }
                          },
                          secondary: {
                            variant: 'caption',
                            sx: {
                              fontSize: { xs: '0.75rem', sm: '0.75rem' }
                            }
                          }
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            3AMB Menu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Navigate through the guidebook
          </Typography>
        </Box>
        
        <Divider />
        
        <List>
          {menuItems.map((item) => (
            <ListItemButton
              key={item.page}
              onClick={() => {
                item.action();
              }}
              selected={currentPage === item.page}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          ))}
        </List>

        <Divider />

        {/* Welcome Tour Section */}
        <List>
          <ListItemButton onClick={handleShowWelcome}>
            <ListItemIcon>
              <WavingHand sx={{ color: 'secondary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Show Welcome Tour"
              secondary="Restart the introduction"
            />
          </ListItemButton>
        </List>

        <Divider />

        {/* Clear Cache Section - Development Only */}
        {process.env.NODE_ENV === 'development' && (
          <List>
            <ListItemButton onClick={handleClearCache}>
              <ListItemIcon>
                <ClearAll sx={{ color: 'error.main' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Clear Cache"
                secondary="Development: Clear local storage, session storage, and caches"
              />
            </ListItemButton>
          </List>
        )}

        {/* PWA Installation Guide */}
        <List>
          <ListItemButton onClick={() => handlePageNavigation('pwa-install')}>
            <ListItemIcon>
              <GetApp sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Install App"
              secondary="Learn how to install this app on your device"
            />
          </ListItemButton>
        </List>

        <Box sx={{ flexGrow: 1 }} />
        
        {/* Footer in drawer */}
        <Box sx={{ p: 2, bgcolor: 'grey.50', mt: 'auto' }}>
          <Typography variant="caption" color="text.secondary">
            3AMB Guidebook v1.2
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}

export default CustomAppBar;