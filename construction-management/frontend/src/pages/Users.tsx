import React from 'react';
import { Typography, Box } from '@mui/material';

const Users: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4">User Management</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
        This page will show user management features.
      </Typography>
    </Box>
  );
};

export default Users;