// PWA utilities for 3AMB Guidebook

// Check if service workers are supported and if we should use PWA features
const isServiceWorkerSupported = () => {
  return 'serviceWorker' in navigator;
};

// Check if PWA features should be enabled
const isPWAEnabled = () => {
  // Always enabled in production
  if (process.env.NODE_ENV === 'production') {
    return true;
  }
  
  // In development, only enable if explicitly set
  return process.env.REACT_APP_ENABLE_PWA_DEV === 'true';
};

// Register service worker
export const registerServiceWorker = () => {
  if (!isPWAEnabled() || !isServiceWorkerSupported()) {
    console.log('Service worker registration skipped');
    return;
  }
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registered successfully:', registration.scope);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
          
          // Handle update found
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, dispatch custom event
                const event = new CustomEvent('pwa-update-available', {
                  detail: { waitingWorker: newWorker }
                });
                window.dispatchEvent(event);
              }
            });
          });

          // Handle successful update
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            const event = new CustomEvent('pwa-update-installed');
            window.dispatchEvent(event);
          });
        })
        .catch((error) => {
          console.log('ServiceWorker registration failed:', error);
        });
  });
}

// Install PWA prompt
export const canInstallPWA = () => {
  return window.deferredPrompt !== null;
};

// Install PWA prompt
export const installPWA = async () => {
  if (window.deferredPrompt) {
    window.deferredPrompt.prompt();
    const { outcome } = await window.deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    window.deferredPrompt = null;
    return outcome === 'accepted';
  }
  return false;
};

// Setup PWA install prompt
export const setupInstallPrompt = () => {
  if (!isPWAEnabled()) {
    console.log('PWA install prompt skipped');
    return;
  }

  // eslint-disable-next-line no-unused-vars
  let deferredPrompt = null;

  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    window.deferredPrompt = e;
    
    // Show install button or banner
    showInstallBanner();
  });

  window.addEventListener('appinstalled', () => {
    console.log('3AMB Guidebook was installed');
    hideInstallBanner();
  });
};

// Show install banner
const showInstallBanner = () => {
  // You can customize this to show your own install prompt
  console.log('PWA install prompt is available');
};

// Hide install banner
const hideInstallBanner = () => {
  console.log('PWA install banner hidden');
};

// Check if running as PWA
export const isPWA = () => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
};

// Get PWA display mode
export const getPWADisplayMode = () => {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return 'standalone';
  }
  if (window.matchMedia('(display-mode: fullscreen)').matches) {
    return 'fullscreen';
  }
  if (window.matchMedia('(display-mode: minimal-ui)').matches) {
    return 'minimal-ui';
  }
  return 'browser';
};

// Network status
export const getNetworkStatus = () => {
  return {
    online: navigator.onLine,
    connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection
  };
};

// Listen for network changes
export const setupNetworkListener = (callback) => {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));
};

// Manually check for updates
export const checkForUpdates = async () => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      return registration.update();
    }
  }
  return Promise.resolve();
};

// Force app refresh (useful for troubleshooting)
export const forceRefresh = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((registration) => {
        registration.unregister();
      });
      window.location.reload();
    });
  } else {
    window.location.reload();
  }
};
