import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
} from '@mui/material';


const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'grey.100', 
        mt: 'auto',
        pt: 4,
        pb: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">

        {/* Bottom Bar */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} 3AMB. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              Privacy Policy
            </Link>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              Terms of Service
            </Link>
            <Link href="#" color="text.secondary" underline="hover" variant="body2">
              Help
            </Link>
          </Box>
        </Box>

        {/* PWA Status Indicator */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            🚀 This is a Progressive Web App (PWA) - Install for the best experience!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
