// src/components/NewConferenceFront.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import Button from '../../../components/Button/Button'; // Adjust path if necessary
import AddIcon from '@mui/icons-material/Add';

const NewConferenceFront = ({ handleNewConferenceTrue }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      onClick={handleNewConferenceTrue}
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
          overflow: 'hidden', // Ensure the image stays within the border
          display: 'flex',
          alignItems: 'center', // Center the image vertically
          justifyContent: 'center', // Center the image horizontally
        }}
      >
        <img
          src='images/NewConference.png'
          alt="회의 시작 배너 이미지"
          style={{
            width: '100%',
            height: 'auto',
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
          회의 생성하기
        </Typography>
        <Button
          type="full"
          buttonStyle="black"
          fullWidth
          startIcon={<AddIcon />}
        >
          회의 생성하기
        </Button>
      </Box>
    </Box>
  );
};

export default NewConferenceFront;
