import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fab, useScrollTrigger, Zoom, Box } from '@mui/material';

function ScrollTopButton() {
  const trigger = useScrollTrigger({
    disableHysteresis: true, 
    threshold: 100, 
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{
          position: 'fixed',
          bottom: 80, // Moved higher to avoid footer obstruction
          right: 32,
          zIndex: 1000,
          // Additional mobile adjustments
          '@media (max-width: 768px)': {
            bottom: 80, // Slightly lower on mobile for better thumb reach
            right: 20,
          },
          // Ensure it doesn't interfere with footer on very small screens
          '@media (max-height: 600px)': {
            bottom: 80,
          },
        }}
      >
        <Fab color="primary" size="medium" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
}

export default ScrollTopButton;