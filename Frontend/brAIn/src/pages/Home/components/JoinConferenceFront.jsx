import React from 'react';
import { Box, Typography } from '@mui/material';
import Button from '../../../components/Button/Button'; // Adjust path if necessary
import { MeetingRoom as EnterIcon } from '@mui/icons-material';
import './JoinConferenceFront.css'; // Import the CSS file

const JoinConferenceFront = ({ handleJoinConferenceTrue }) => {
  return (
    <Box
      className="join-conference-front"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      onClick={handleJoinConferenceTrue}
      p={3}
    >
      <Box className="image-container">
        <img
          src="images/joinConference.png"
          alt="Join Conference"
          className="join-conference-image"
        />
      </Box>
      <Box className="bottom-section" p={3}>
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
