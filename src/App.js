import { useState, useEffect, useCallback } from 'react';
import {
  Typography, Container,
  Box, Button, Breadcrumbs, Link, Stack,
} from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createAppTheme } from './theme';
import ScrollTopButton from '../src/components/scrollTopButton';
import Welcome from './pages/Welcome';
import Settings from './pages/Settings';
import Help from './pages/Help';
import About from './pages/About';
import PWAInstallGuide from './pages/PWAInstallGuide';
import CustomAppBar from './components/CustomAppBar';
import Footer from './components/Footer';
import OfflineIndicator from './components/OfflineIndicator';
import PWAUpdateNotification from './components/PWAUpdateNotification';
import ArticleCard from './components/ArticleCard';
import GuideSearch from './components/GuideSearch';
import { getAllGuidePages, getGuidePageByPath } from './guidepages';
import { Home, NavigateNext } from '@mui/icons-material';



function App() {
  const [showWelcomeOverride, setShowWelcomeOverride] = useState(undefined); // Use undefined initially
  const [hasManuallyTriggered, setHasManuallyTriggered] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentGuidePage, setCurrentGuidePage] = useState(null);
  const [themeMode, setThemeMode] = useState('light');
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [filteredGuidePages, setFilteredGuidePages] = useState([]);

  // Load theme and font size from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('3amb-lightdark') || 'light';
    const savedFontSize = parseInt(localStorage.getItem('3amb-font-size')) || 16;
    const savedHighContrast = localStorage.getItem('3amb-high-contrast') === 'true';
    
    setThemeMode(savedTheme);
    setFontSize(savedFontSize);
    setHighContrast(savedHighContrast);

    // Initialize filtered guide pages
    const allGuides = getAllGuidePages();
    setFilteredGuidePages(allGuides);

    // Load saved page with activity check
    loadSavedPage();
  }, []);

  // Page memory functionality
  const loadSavedPage = () => {
    const savedPageData = localStorage.getItem('3amb-current-page');
    if (savedPageData) {
      try {
        const { page, guidePath, timestamp } = JSON.parse(savedPageData);
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds

        // Check if less than 30 minutes have passed
        if (now - timestamp < thirtyMinutes) {
          if (page === 'guide' && guidePath) {
            const guidePage = getGuidePageByPath(guidePath);
            if (guidePage) {
              setCurrentPage('guide');
              setCurrentGuidePage(guidePage);
            } else {
              setCurrentPage('home');
            }
          } else {
            setCurrentPage(page);
          }
        } else {
          // Clear expired page data
          localStorage.removeItem('3amb-current-page');
          setCurrentPage('home');
        }
      } catch (error) {
        // If there's an error parsing, just go to home
        localStorage.removeItem('3amb-current-page');
        setCurrentPage('home');
      }
    }
  };

  const saveCurrentPage = (page, guidePath = null) => {
    const pageData = {
      page: page,
      guidePath,
      timestamp: Date.now()
    };
    localStorage.setItem('3amb-current-page', JSON.stringify(pageData));
  };

  // Track user activity to update timestamp
  useEffect(() => {
    const updateActivity = () => {
      const savedPageData = localStorage.getItem('3amb-current-page');
      if (savedPageData) {
        try {
          const { page, guidePath } = JSON.parse(savedPageData);
          saveCurrentPage(page, guidePath); // Update timestamp
        } catch (error) {
          // If error, remove the data
          localStorage.removeItem('3amb-current-page');
        }
      }
    };

    // Add event listeners for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Cleanup event listeners
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
    };
  }, []);

  // Create dynamic theme
  const theme = createAppTheme(themeMode, fontSize, highContrast);

  const handleShowWelcome = () => {
    setHasManuallyTriggered(true);
    setShowWelcomeOverride(true);
  };

  const handleWelcomeComplete = () => {
    if (hasManuallyTriggered) {
      // If manually triggered, just hide it
      setShowWelcomeOverride(false);
    } else {
      // If automatic, reset to undefined to allow normal behavior
      setShowWelcomeOverride(undefined);
    }
    console.log('Welcome tour completed!');
  };

  const handleThemeChange = (newLightDark) => {
    setThemeMode(newLightDark);
  };

  const handleFontSizeChange = (newFontSize) => {
    setFontSize(newFontSize);
  };

  const handleHighContrastChange = (newHighContrast) => {
    setHighContrast(newHighContrast);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setCurrentGuidePage(null); // Clear guide page when navigating to other pages
    saveCurrentPage(page);
  };

  const handleGuidePageNavigation = (guidePage) => {
    setCurrentPage('guide');
    setCurrentGuidePage(guidePage);
    saveCurrentPage('guide', guidePage.path);
  };

  // Handle navigation to specific task (from notifications)
  const handleNavigateToTask = (taskId) => {
    // Find the DS Checklist guide page
    const allGuides = getAllGuidePages();
    const dsGuide = allGuides.find(gp => gp.metadata.id === 'store-manager-duty');
    
    if (dsGuide) {
      // Navigate to the guide page first
      setCurrentPage('guide');
      setCurrentGuidePage(dsGuide);
      saveCurrentPage('guide', dsGuide.metadata.path);
      
      // Scroll to the specific task after a short delay
      setTimeout(() => {
        const taskElement = document.getElementById(taskId);
        if (taskElement) {
          taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // Attempt to expand the task by finding and clicking the expand button
          setTimeout(() => {
            // Look for the expand button in the task element
            const expandButton = taskElement.querySelector('button[aria-label*="expand"], .MuiIconButton-root');
            if (expandButton) {
              expandButton.click();
            }
            
            // Highlight the task briefly
            taskElement.style.outline = '3px solid #2196f3';
            taskElement.style.outlineOffset = '2px';
            setTimeout(() => {
              taskElement.style.outline = '';
              taskElement.style.outlineOffset = '';
            }, 3000);
          }, 500);
        }
      }, 300);
    }
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setCurrentGuidePage(null);
    saveCurrentPage('home');
  };

  const handleFilteredPagesChange = useCallback((pages) => {
    setFilteredGuidePages(pages);
  }, []);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'settings':
        return (
          <Settings
            onThemeChange={handleThemeChange}
            onFontSizeChange={handleFontSizeChange}
            onHighContrastChange={handleHighContrastChange}
            currentTheme={themeMode}
            currentFontSize={fontSize}
            currentHighContrast={highContrast}
          />
        );
      case 'help':
        return <Help />;
      case 'about':
        return <About />;
      case 'pwa-install':
        return <PWAInstallGuide />;
      case 'guide':
        if (!currentGuidePage) {
          // Fallback to home if no guide page is selected
          setCurrentPage('home');
          return null;
        }
        
        const GuideComponent = currentGuidePage.component;
        return (
          <Container maxWidth="lg" sx={{ py: 2 }}>
            {/* Breadcrumb Navigation */}
            <Box sx={{ mb: 1 }}>
              <Breadcrumbs separator={<NavigateNext fontSize="small" />}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleBackToHome}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
                >
                  <Home sx={{ mr: 0.5, fontSize: 16 }} />
                  Home
                </Link>
                <Typography variant="body2" color="text.primary">
                  {currentGuidePage.metadata.title}
                </Typography>
              </Breadcrumbs>
              <Button
                onClick={handleBackToHome}
                size="small"
                sx={{ mt: 1 }}
              >
                ← Back to Guides
              </Button>
            </Box>
            
            {/* Render the guide page */}
            <GuideComponent />
          </Container>
        );
      case 'home':
      default:
        return (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                3AMB Guidebook
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                Your comprehensive resource for navigating the 3AMB ecosystem
              </Typography>
            </Box>

            {/* Search and Filter */}
            <GuideSearch
              guidePages={getAllGuidePages()}
              onFilteredPagesChange={handleFilteredPagesChange}
            />

            {/* Guide Pages Grid */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Available Guides
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 2 }}>
                  ({filteredGuidePages.length} guide{filteredGuidePages.length !== 1 ? 's' : ''})
                </Typography>
              </Typography>
              
              {filteredGuidePages.length > 0 ? (
                <Stack spacing={3}>
                  {filteredGuidePages.map((guidePage, index) => (
                    <ArticleCard
                      key={index}
                      metadata={guidePage.metadata}
                      onNavigate={() => handleGuidePageNavigation(guidePage)}
                    />
                  ))}
                </Stack>
              ) : (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2
                }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No guides match your search
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search terms or filters
                  </Typography>
                </Box>
              )}
            </Box>

          </Container>
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Welcome 
        showWelcome={showWelcomeOverride}
        onComplete={handleWelcomeComplete}
      />
      <Box sx={{ 
        bgcolor: 'background.default', 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <CustomAppBar 
          onShowWelcome={handleShowWelcome}
          onPageChange={handlePageChange}
          onGuidePageChange={handleGuidePageNavigation}
          currentPage={currentPage}
          onNavigateToTask={handleNavigateToTask}
        />
        <Box sx={{ flex: 1 }}>
          {renderCurrentPage()}
        </Box>
        <Footer />
        <ScrollTopButton />
        <OfflineIndicator />
        <PWAUpdateNotification />
      </Box>
    </ThemeProvider>
  )
}

export default App;
