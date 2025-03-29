import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Chat from '../components/Chat';

const ChatPage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Grocery Assistant
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Ask me anything about our products, prices, or store information.
      </Typography>
      <Paper elevation={3} sx={{ mt: 2 }}>
        <Chat />
      </Paper>
    </Box>
  );
};

export default ChatPage;
 