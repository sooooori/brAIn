// src/components/JoinConferenceFront.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import Button from './Button/Button'; // Adjust path if necessary
import { MeetingRoom as EnterIcon } from '@mui/icons-material';

const JoinConferenceFront = ({ handleJoinConferenceTrue }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      onClick={handleJoinConferenceTrue}
      p={3}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 3,
        cursor: 'pointer',
        height: '100%',
        width: '100%',
      }}
    >
      {/* Container for the image with border */}
      <Box
        sx={{
          width: '100%',
          height: 'auto',
          borderRadius: '8px',
          border: '4px solid #ddd', // Light grey border around the image
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center', // Center the image vertically
          justifyContent: 'center', // Center the image horizontally
        }}
      >
        <img
          src="images/joinConference.png"
          alt="Join Conference"
          style={{
            width: '100%',
            height: '100%', // Ensure the image covers the container
            objectFit: 'cover',
            objectPosition: 'center', // Center the image in its container
          }}
        />
      </Box>
      {/* Bottom section */}
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center" // Center the content vertically
        p={3}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.1)', // Shadow to separate the bottom section
        }}
      >
        <Typography variant="h5" component="h3" gutterBottom textAlign="center">
          회의 참여하기
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          startIcon={<EnterIcon />}
        >
          회의 참여하기
        </Button>
      </Box>
    </Box>
  );
};

export default JoinConferenceFront;
