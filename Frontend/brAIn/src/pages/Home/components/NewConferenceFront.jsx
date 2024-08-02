import React from 'react';
import { Box, Typography } from '@mui/material';
import Button from '../../../components/Button/Button'; // Adjust path if necessary
import AddIcon from '@mui/icons-material/Add';
import './NewConferenceFront.css'; // Import CSS file

const NewConferenceFront = ({ handleNewConferenceTrue }) => {
  return (
    <Box
      className="conference-front-container"
      onClick={handleNewConferenceTrue}
    >
      {/* Container for the image with border */}
      <Box className="conference-image-container">
        <img
          src="images/NewConference.png"
          alt="회의 시작 배너 이미지"
          className="conference-image"
        />
      </Box>
      {/* Bottom section */}
      <Box className="conference-bottom-section">
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
