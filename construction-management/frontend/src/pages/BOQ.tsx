import React from 'react';
import { Typography, Box } from '@mui/material';

const BOQ: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4">Bill of Quantities (BOQ)</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        This page will show BOQ management and material tracking.
      </Typography>
    </Box>
  );
};

export default BOQ;