import { cloneElement } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import {
  Info,
  Book,
  Star,
  Code,
  Palette,
  Accessibility,
  Speed,
  Security,
  DataObject,
  Web,
  Storage,
  Language,
} from '@mui/icons-material';

const About = () => {
  const features = [
    {
      icon: <Book />,
      title: 'Comprehensive Guidebook',
      description: 'A complete resource hub for navigating the 3AMB ecosystem with detailed procedures and references.'
    },
    {
      icon: <Palette />,
      title: 'Customizable Themes',
      description: 'Light, dark, and high contrast modes to suit your preferences and accessibility needs.'
    },
    {
      icon: <Accessibility />,
      title: 'Accessibility First',
      description: 'Built with accessibility in mind, featuring high contrast mode and adjustable font sizes.'
    },
    {
      icon: <Speed />,
      title: 'Fast & Responsive',
      description: 'Optimized for speed with a responsive design that works on all devices.'
    },
    {
      icon: <Code />,
      title: 'Modern Technology',
      description: 'Built with React and Material-UI for a modern, professional experience.'
    },
    {
      icon: <Security />,
      title: 'Reliable & Secure',
      description: 'Built with security best practices and reliable local storage for your settings and preferences.'
    },
  ];

  const techStack = [
    { 
      name: 'React 19', 
      icon: <Code />, 
      color: '#61DAFB'
    },
    { 
      name: 'Material-UI (MUI)', 
      icon: <Palette />, 
      color: '#007FFF' 
    },  
    { 
      name: 'JavaScript ES6+', 
      icon: <DataObject />, 
      color: '#F7DF1E'
    },
    { 
      name: 'CSS3', 
      icon: <Web />, 
      color: '#1572B6'
    },
    { 
      name: 'HTML5', 
      icon: <Language />, 
      color: '#E34F26'
    },
    { 
      name: 'Local Storage', 
      icon: <Storage />, 
      color: '#4285F4'
    }
  ];

  const version = '1.1.0';
  const lastUpdated = 'June 2025';

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      {/* Header Section */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          About 3AMB Guidebook
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: '800px', mx: 'auto' }}>
          Your comprehensive digital companion for navigating the 3AMB ecosystem. 
          Designed with usability, accessibility, and efficiency in mind.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" useFlexGap>
          <Chip label={`Version ${version}`} color="primary" />
          <Chip label={`Updated ${lastUpdated}`} color="secondary" variant="outlined" />
        </Stack>
      </Box>

      {/* Mission Statement */}
      <Card elevation={3} sx={{ mb: 6, width: '100%', minWidth: '100%' }} id="mission">
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Info sx={{ mr: 2, color: 'primary.main', fontSize: '2rem' }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
              Our Mission
            </Typography>
          </Box>
          <Typography variant="body1" pararaph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
            The 3AMB Guidebook was created to provide a centralized, user-friendly resource for 
            people in 3AMB. Our goal is to make complex information 
            accessible, searchable, and understandable for users at all levels.
            <br /><br />
            We believe that great guides should be more than just functional—it should be 
            beautiful, accessible, and centralised. That's why we've built this 
            guidebook with customization and searchability at its core.
          </Typography>
        </CardContent>
        </Card>

      {/* Features Cards */}
      <Box sx={{ mb: 6 }} id="features">
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          Key Features
        </Typography>
        <Stack spacing={3}>
          {features.map((feature, index) => (
            <Card elevation={2} key={index} sx={{ 
              width: '100%',
              minWidth: '100%',
              maxWidth: '100%',
              transition: 'transform 0.2s', 
              '&:hover': { transform: 'translateY(-4px)' }
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ lineHeight: 1.6 }}
                >
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* Technical Information */}
      <Grid container spacing={4} sx={{ mb: 6 }} id="tech-stack">
        <Grid item xs={12} sm={12} md={6}>
          <Card elevation={2} sx={{ width: '100%', minWidth: '100%', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <Code sx={{ mr: 1 }} />
                Technology Stack
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
                {techStack.map((tech, index) => (
                  <Chip 
                    key={index} 
                    label={tech.name} 
                    icon={cloneElement(tech.icon, { 
                      sx: { color: tech.color + ' !important' } 
                    })}
                    variant="outlined" 
                    size="small"
                    sx={{
                      '& .MuiChip-icon': {
                        fontSize: '1rem',
                      },
                      borderColor: tech.color,
                      '&:hover': {
                        backgroundColor: tech.color + '15', // 15% opacity
                        borderColor: tech.color,
                      }
                    }}
                  />
                ))}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 3, lineHeight: 1.6 }}>
                Built with modern web technologies to ensure reliability, performance, and maintainability.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2} sx={{ width: '100%', minWidth: '100%', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <Star sx={{ mr: 1 }} />
                Why Use This Guidebook?
              </Typography>
              <Box component="ul" sx={{ mt: 2, pl: 2 }}>
                <Typography component="li" variant="body2">
                  <strong>Searchable Content:</strong> Find what you need quickly instantly with our powerful search feature!
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Customisable Design:</strong> You decide the look and feel of your guidebook!
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>Accessibility Focus:</strong> Font size adjustments, high contrast mode, and more to come!
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  <strong>No Internet Required:</strong> Works offline once loaded!
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer Info */}
      <Box sx={{ mt: 6, pt: 4, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          3AMB Guidebook • Version {version} • {lastUpdated}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Built with ❤️ for the 3AMB Unit
        </Typography>
      </Box>
    </Container>
  );
};

export default About;
