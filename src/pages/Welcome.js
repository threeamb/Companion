import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Fade,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  Slide,
} from '@mui/material';
import {
  ArrowForward,
  ArrowBack,
  WavingHandOutlined,
  Explore,
  MenuBook,
  Close,
  WarningAmberOutlined,
} from '@mui/icons-material';

const Welcome = ({ onComplete, showWelcome: externalShowWelcome, onResetWelcome }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // Welcome steps content
  const steps = [
    {
      title: 'Welcome to 3AMB BHQ',
      content: 'This guide hopes to help you understand your taskings and welfare in 3AMB! From understanding what you\'ll need to do to what you can do (wink)',
      icon: <MenuBook sx={{ fontSize: 60, color: 'primary.main' }} />,
    },
    {
      title: 'Get to Know Your Superiors',
      content: ' It also hopes to provide insights into your superiors\' roles and responsibilities, and who to look for if you need help!',
      icon: <Explore sx={{ fontSize: 60, color: 'success.main' }} />,
    },
    {
      title: 'Refresh on Guidelines of SAF & 3AMB',
      content: 'It refreshes you on what is expected of you as a member of the SAF and 3AMB. This includes understanding the rules, regulations, and culture that govern our organization.',
      icon: <WarningAmberOutlined sx={{ fontSize: 60, color: 'secondary.main' }} />,
    },
    {
      title: 'Finish',
      content: 'Ready to dive in? Click the button below to begin your journey through the 3AMB unit. You can always return to this guide later.',
      icon: <WavingHandOutlined sx={{ fontSize: 60, color: 'success.main' }} />,
    },
  ];

  // Debug info for testing mobile layout
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Welcome Screen Debug:');
      console.log('To test Welcome screen, run: localStorage.removeItem("3amb-guidebook-visited"); window.location.reload();');
      console.log('To test iPhone layout, use browser dev tools mobile simulation');
    }
  }, []);

  // Check if user has visited before or external control
  useEffect(() => {
    // If external control is explicitly set to true, use that
    if (externalShowWelcome === true) {
      setShowWelcome(true);
      setIsVisible(true);
      setActiveStep(0); // Reset to first step when showing externally
      return;
    }
    
    // If external control is explicitly false, don't show
    if (externalShowWelcome === false) {
      setShowWelcome(false);
      setIsVisible(false);
      return;
    }

    // Default behavior when no external control (undefined)
    // Only run automatic behavior if external control is not being used
    if (externalShowWelcome === undefined) {
      // Temporarily always show welcome for testing
      //   setShowWelcome(true);
      //   setIsVisible(true);
      
      // Uncomment below for production behavior:
      const hasVisited = localStorage.getItem('3amb-guidebook-visited');
      if (!hasVisited) {
        setShowWelcome(true);
        setIsVisible(true);
      }
    }
  }, [externalShowWelcome]);

  // Handle scroll events for tab navigation
  useEffect(() => {
    if (!showWelcome) return;

    const handleWheel = (e) => {
      // Always prevent default scrolling behavior
      e.preventDefault();
      e.stopPropagation();
      
      if (isScrolling) return; // Prevent rapid scrolling
      
      setIsScrolling(true);
      
      if (e.deltaY > 0) {
        // Scrolling down - next step
        if (activeStep < steps.length - 1) {
          setActiveStep(prev => prev + 1);
        }
        // Removed: Don't complete the tour when scrolling past last step
      } else {
        // Scrolling up - previous step
        if (activeStep > 0) {
          setActiveStep(prev => prev - 1);
        }
      }
      
      // Reset scrolling flag after a delay
      setTimeout(() => setIsScrolling(false), 500);
    };

    // Block all scrolling on the body when welcome is showing
    const preventScroll = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    // Add wheel event listener with capture to block all scrolling
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    document.addEventListener('scroll', preventScroll, { passive: false, capture: true });
    document.addEventListener('touchmove', preventScroll, { passive: false, capture: true });
    
    // Prevent scrolling on body
    document.body.style.overflow = 'hidden';
    
    // Cleanup
    return () => {
      document.removeEventListener('wheel', handleWheel, { capture: true });
      document.removeEventListener('scroll', preventScroll, { capture: true });
      document.removeEventListener('touchmove', preventScroll, { capture: true });
      document.body.style.overflow = 'unset';
    };
  }, [activeStep, showWelcome, isScrolling, steps.length]);

  // Handle completion
  const handleComplete = useCallback(() => {
    // Mark as visited in localStorage
    localStorage.setItem('3amb-guidebook-visited', 'true');
    localStorage.setItem('3amb-guidebook-completed-date', new Date().toISOString());
    
    setIsVisible(false);
    setTimeout(() => {
      setShowWelcome(false);
      if (onComplete) {
        onComplete();
      }
    }, 300);
  }, [onComplete]);

  // Handle skip
  const handleSkip = useCallback(() => {
    localStorage.setItem('3amb-guidebook-visited', 'true');
    localStorage.setItem('3amb-guidebook-skipped', 'true');
    setIsVisible(false);
    setTimeout(() => {
      setShowWelcome(false);
      if (onComplete) {
        onComplete();
      }
    }, 300);
  }, [onComplete]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!showWelcome) return;

    const handleKeyDown = (e) => {
      if (isScrolling) return;
      
      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
        case ' ': // Spacebar
          e.preventDefault();
          setIsScrolling(true);
          if (activeStep < steps.length - 1) {
            setActiveStep(prev => prev + 1);
          } else {
            handleComplete();
          }
          setTimeout(() => setIsScrolling(false), 300);
          break;
          
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          setIsScrolling(true);
          if (activeStep > 0) {
            setActiveStep(prev => prev - 1);
          }
          setTimeout(() => setIsScrolling(false), 300);
          break;
          
        case 'Escape':
          handleSkip();
          break;
          
        case 'Enter':
          if (activeStep === steps.length - 1) {
            handleComplete();
          } else {
            setIsScrolling(true);
            setActiveStep(prev => prev + 1);
            setTimeout(() => setIsScrolling(false), 300);
          }
          break;
          
        default:
          // No action for other keys
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeStep, showWelcome, isScrolling, steps.length, handleComplete, handleSkip]);

  // Handle next step
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  // Handle previous step
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  // Reset welcome (for testing - you can remove this)
  // eslint-disable-next-line no-unused-vars
  const resetWelcome = () => {
    localStorage.removeItem('3amb-guidebook-visited');
    localStorage.removeItem('3amb-guidebook-completed-date');
    localStorage.removeItem('3amb-guidebook-skipped');
    setShowWelcome(true);
    setIsVisible(true);
    setActiveStep(0);
    if (onResetWelcome) {
      onResetWelcome();
    }
  };

  // Don't render the floating button anymore
  if (!showWelcome) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        bgcolor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
        backdropFilter: 'blur(5px)',
        // iPhone safe area support
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',
        // Ensure content is never cut off on mobile
        minHeight: '100dvh', // Dynamic viewport height for better mobile support
        // Additional padding for mobile devices with bottom bars
        '@media (max-width: 768px)': {
          paddingTop: 'max(env(safe-area-inset-top), 24px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 24px)',
          paddingLeft: 'max(env(safe-area-inset-left), 16px)',
          paddingRight: 'max(env(safe-area-inset-right), 16px)',
          // Ensure there's enough space for the content
          minHeight: 'calc(100dvh - 48px)', // Dynamic viewport height
        },
        // Special handling for iPhone X and newer with notches and bottom bars
        '@media (max-width: 480px) and (orientation: portrait)': {
          paddingTop: 'max(env(safe-area-inset-top), 44px)', // iPhone status bar + extra
          paddingBottom: 'max(env(safe-area-inset-bottom), 34px)', // iPhone home indicator + extra
          minHeight: 'calc(100dvh - 78px)', // Dynamic viewport height
        },
        // For very small screens, ensure even more conservative spacing
        '@media (max-width: 375px)': {
          paddingTop: 'max(env(safe-area-inset-top), 50px)',
          paddingBottom: 'max(env(safe-area-inset-bottom), 40px)',
          paddingLeft: 'max(env(safe-area-inset-left), 12px)',
          paddingRight: 'max(env(safe-area-inset-right), 12px)',
        },
      }}
    >
      <Fade in={isVisible} timeout={500}>
        <Container maxWidth="md">
          <Card
            elevation={24}
            sx={{
              maxWidth: 800,
              mx: 'auto',
              borderRadius: 3,
              overflow: 'hidden',
              // Mobile optimizations
              '@media (max-width: 768px)': {
                mx: 1,
                maxWidth: 'calc(100% - 16px)',
                // Ensure card doesn't exceed available viewport height on mobile
                maxHeight: 'calc(100dvh - 80px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
                display: 'flex',
                flexDirection: 'column',
              },
              // For iPhone and smaller screens
              '@media (max-width: 480px) and (orientation: portrait)': {
                maxHeight: 'calc(100dvh - 120px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
                mx: 0.5,
                maxWidth: 'calc(100% - 8px)',
              },
              // Very small screens
              '@media (max-width: 375px)': {
                maxHeight: 'calc(100dvh - 140px - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
              },
            }}
          >
            {/* Header with progress */}
            <Box
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                p: 2,
                position: 'relative',
              }}
            >
              <LinearProgress
                variant="determinate"
                value={(activeStep / (steps.length - 1)) * 100}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'secondary.main',
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <Typography variant="h6" component="h2">
                  Introductions to 3AMB
                </Typography>
                <IconButton
                  onClick={handleSkip}
                  sx={{ color: 'white' }}
                  size="small"
                >
                  <Close />
                </IconButton>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Step {activeStep + 1} of {steps.length}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, mt: 0.5, display: 'block' }}>
                💡 Use scroll wheel or arrow keys to navigate
              </Typography>
            </Box>

            {/* Content */}
            <CardContent sx={{ 
              p: 4, 
              minHeight: 400,
              // Mobile optimizations
              '@media (max-width: 768px)': {
                p: 3,
                minHeight: 250, // Reduced min height for mobile
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              },
              // For very small screens, reduce padding and height further
              '@media (max-width: 480px)': {
                p: 2,
                minHeight: 200,
              },
              '@media (max-width: 375px)': {
                p: 1.5,
                minHeight: 180,
              },
            }}>
              <Slide
                direction="left"
                in={true}
                key={activeStep}
                timeout={300}
              >
                <Box sx={{ textAlign: 'center' }}>
                  {/* Icon */}
                  <Box sx={{ mb: 3 }}>
                    {steps[activeStep].icon}
                  </Box>

                  {/* Title */}
                  <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{
                      fontWeight: 'bold',
                      color: 'text.primary',
                      mb: 3,
                      // Mobile optimizations
                      '@media (max-width: 768px)': {
                        variant: 'h5',
                        fontSize: '1.5rem',
                        mb: 2,
                      },
                    }}
                  >
                    {steps[activeStep].title}
                  </Typography>

                  {/* Content */}
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1.1rem',
                      lineHeight: 1.6,
                      color: 'text.secondary',
                      maxWidth: 500,
                      mx: 'auto',
                      mb: 4,
                      // Mobile optimizations
                      '@media (max-width: 768px)': {
                        fontSize: '1rem',
                        mb: 3,
                        maxWidth: '100%',
                      },
                    }}
                  >
                    {steps[activeStep].content}
                  </Typography>

                  {/* Step indicator dots */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 1, 
                    mb: 4,
                    // Mobile optimizations
                    '@media (max-width: 768px)': {
                      mb: 2,
                    },
                  }}>
                    {steps.map((_, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: index === activeStep ? 'primary.main' : 'grey.300',
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Slide>
            </CardContent>

            {/* Navigation buttons */}
            <Box
              sx={{
                p: 3,
                bgcolor: 'grey.50',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                // Mobile optimizations
                '@media (max-width: 768px)': {
                  p: 2,
                  gap: 1.5,
                  // Ensure buttons area is above iPhone bottom bar
                  paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
                },
                // For iPhone and small screens, improve button layout and spacing
                '@media (max-width: 480px)': {
                  p: 1.5,
                  paddingBottom: 'max(20px, env(safe-area-inset-bottom))',
                  gap: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  '& > button:nth-of-type(2)': {
                    order: -1,
                    fontSize: '0.75rem',
                    padding: '4px 8px',
                  },
                },
                // Very small screens - even more compact
                '@media (max-width: 375px)': {
                  p: 1,
                  paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
                  '& > button': {
                    fontSize: '0.8rem',
                    padding: '6px 12px',
                  },
                  '& > button:nth-of-type(2)': {
                    fontSize: '0.7rem',
                    padding: '4px 6px',
                  },
                },
              }}
            >
              <Button
                onClick={handleBack}
                disabled={activeStep === 0}
                startIcon={<ArrowBack />}
                variant="outlined"
              >
                Back
              </Button>

              <Button
                variant="text"
                onClick={handleSkip}
                sx={{ color: 'text.secondary' }}
              >
                Skip Tour
              </Button>

              <Button
                onClick={handleNext}
                variant="contained"
                endIcon={activeStep === steps.length - 1 ? <WavingHandOutlined /> : <ArrowForward />}
                size="large"
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          </Card>
        </Container>
      </Fade>
    </Box>
  );
};

export default Welcome;
