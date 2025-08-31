import React from 'react';
import { Typography, Box } from '@mui/material';

const Reports: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4">Reports</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        This page will show project reports and analytics.
      </Typography>
    </Box>
  );
};

export default Reports;