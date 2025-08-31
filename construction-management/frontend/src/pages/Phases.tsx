import React from 'react';
import { Typography, Box } from '@mui/material';

const Phases: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4">Construction Phases</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        This page will show construction phases tracking.
      </Typography>
    </Box>
  );
};

export default Phases;