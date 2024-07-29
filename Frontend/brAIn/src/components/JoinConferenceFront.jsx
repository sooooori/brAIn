import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { MeetingRoom as EnterIcon } from '@mui/icons-material';

const JoinConferenceFront = ({ handleJoinConferenceTrue }) => {
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      p={3}
      onClick={handleJoinConferenceTrue}
      sx={{ cursor: 'pointer' }}
    >
      <img
        src="images/JoinConference.png"
        alt="Join Conference"
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
      />
      <Box 
        display="flex" 
        flexDirection="column" 
        justifyContent="space-between" 
        p={3}
        sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'white', borderRadius: '8px' }}
      >
        <Typography variant="h5" gutterBottom>
          Join a Conference
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<EnterIcon />}
        >
          Join Conference
        </Button>
      </Box>
    </Box>
  );
};

export default JoinConferenceFront;
