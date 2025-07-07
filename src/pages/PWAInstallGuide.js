import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Chip,
  Stack,
} from '@mui/material';
import {
  Computer,
  Apple,
  Android,
  GetApp,
} from '@mui/icons-material';

const PWAInstallGuide = () => {
  const deviceTypes = [
    {
      type: 'iPhone/iPad (Safari)',
      icon: <Apple sx={{ fontSize: 40, color: '#007AFF' }} />,
      color: '#007AFF',
      steps: [
        {
          title: 'Open Safari Browser',
          description: 'Make sure you\'re using Safari (not Chrome or other browsers)',
          detail: 'PWA installation is only supported in Safari on iOS devices.'
        },
        {
          title: 'Navigate to the App',
          description: 'Visit the 3AMB Guidebook website',
          detail: 'Make sure the app is fully loaded before proceeding.'
        },
        {
          title: 'Tap Share Button',
          description: 'Tap the Share button at the bottom of the screen',
          detail: 'Look for the square with an arrow pointing up.'
        },
        {
          title: 'Add to Home Screen',
          description: 'Scroll down and tap "Add to Home Screen"',
          detail: 'You might need to scroll down in the share menu to find this option.'
        },
        {
          title: 'Customize and Add',
          description: 'Edit the name if desired, then tap "Add"',
          detail: 'The app icon will appear on your home screen like a native app.'
        }
      ]
    },
    {
      type: 'Android (Chrome)',
      icon: <Android sx={{ fontSize: 40, color: '#3DDC84' }} />,
      color: '#3DDC84',
      steps: [
        {
          title: 'Open Chrome Browser',
          description: 'Use Google Chrome for the best experience',
          detail: 'Other browsers may also support PWA installation.'
        },
        {
          title: 'Visit the App',
          description: 'Navigate to the 3AMB Guidebook website',
          detail: 'Wait for the page to fully load.'
        },
        {
          title: 'Look for Install Prompt',
          description: 'Chrome may show an "Install" banner automatically',
          detail: 'If you see this banner, tap "Install" and skip to step 5.'
        },
        {
          title: 'Use Menu Option',
          description: 'If no banner appears, tap the three dots menu (⋮)',
          detail: 'The menu is usually in the top-right corner.'
        },
        {
          title: 'Add to Home Screen',
          description: 'Select "Add to Home screen" or "Install app"',
          detail: 'The option name may vary depending on your Chrome version.'
        },
        {
          title: 'Confirm Installation',
          description: 'Tap "Add" or "Install" to complete',
          detail: 'The app will be added to your app drawer and home screen.'
        }
      ]
    },
    {
      type: 'Windows/Mac (Desktop)',
      icon: <Computer sx={{ fontSize: 40, color: '#0078D4' }} />,
      color: '#0078D4',
      steps: [
        {
          title: 'Use Chrome or Edge',
          description: 'Open the app in Chrome, Edge, or another Chromium browser',
          detail: 'Firefox also supports PWA installation in recent versions.'
        },
        {
          title: 'Look for Install Icon',
          description: 'Check the address bar for an install icon (⊕ or ⬇)',
          detail: 'The icon appears when the PWA is installable.'
        },
        {
          title: 'Click Install',
          description: 'Click the install icon or use the menu',
          detail: 'Alternatively, go to menu → More tools → Create shortcut.'
        },
        {
          title: 'Open as Window',
          description: 'Check "Open as window" for app-like experience',
          detail: 'This makes the app behave like a native desktop application.'
        },
        {
          title: 'Access from Desktop',
          description: 'The app will be available in your start menu/applications',
          detail: 'You can also create a desktop shortcut for quick access.'
        }
      ]
    }
  ];

  const benefits = [
    'Works offline after initial load',
    'Faster loading times',
    'Native app-like experience',
    'Push notifications support',
    'No app store required',
    'Automatic updates',
    'Less storage space than native apps',
    'Cross-platform compatibility'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Install 3AMB Guidebook
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Get the full app experience on any device
        </Typography>
        
        <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
          <Typography variant="body2">
            Progressive Web Apps (PWAs) provide a native app experience through your web browser. 
            No app store downloads required!
          </Typography>
        </Alert>
      </Box>

      {/* Benefits Section */}
      <Card sx={{ mb: 4, bgcolor: 'primary.50' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GetApp color="primary" />
            Why Install?
          </Typography>
          <Grid container spacing={1}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Chip 
                  label={benefit} 
                  variant="outlined" 
                  size="small" 
                  sx={{ m: 0.5, width: '100%', justifyContent: 'flex-start' }}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Installation Instructions */}
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Installation Instructions
      </Typography>

      <Stack spacing={3}>
        {deviceTypes.map((device, index) => (
          <Card 
            key={index} 
            sx={{ 
              width: '100%',
              border: `2px solid ${device.color}`,
              transition: 'all 0.3s ease',
              '&:hover': { 
                transform: 'translateY(-2px)',
                boxShadow: 4,
              }
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {device.icon}
                <Typography variant="h6" sx={{ ml: 2, fontWeight: 'bold' }}>
                  {device.type}
                </Typography>
              </Box>
              
              <Stepper orientation="vertical" sx={{ mt: 2 }}>
                {device.steps.map((step, stepIndex) => (
                  <Step key={stepIndex} active={true}>
                    <StepLabel>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {step.title}
                      </Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {step.description}
                      </Typography>
                      <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                        {step.detail}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Troubleshooting */}
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>
          Troubleshooting
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Alert severity="warning">
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Don't see the install option?
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary="• Make sure you're using a supported browser" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Try refreshing the page" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Check if the app is already installed" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="• Ensure you have a stable internet connection" />
                </ListItem>
              </List>
            </Alert>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Alert severity="info">
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                Need help?
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                If you're still having trouble installing the app, contact your system administrator 
                or check your device's browser settings to ensure PWA installation is enabled.
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </Box>

      {/* Browser Compatibility */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Browser Compatibility
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <Chip label="Chrome ✓" color="success" variant="outlined" />
          <Chip label="Safari ✓" color="success" variant="outlined" />
          <Chip label="Edge ✓" color="success" variant="outlined" />
          <Chip label="Firefox ✓" color="success" variant="outlined" />
          <Chip label="Samsung Internet ✓" color="success" variant="outlined" />
        </Box>
      </Box>
    </Container>
  );
};

export default PWAInstallGuide;
