import React from 'react';
import { Typography, Box } from '@mui/material';

const Payments: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4">Payments</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        This page will show payment tracking and financial management.
      </Typography>
    </Box>
  );
};

export default Payments;