import React from 'react';
import { Box, Typography, TextField, IconButton, Slider } from '@mui/material';
import Button from './Button/Button';
import { Close as CloseIcon, Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewConferenceBack = ({ 
  handleNewConferenceFalse,
  isNewConferenceClicked,
  handleNewConferenceClickedTrue,
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [preparationTime, setPreparationTime] = React.useState(5); // Default to 5 minutes

  const handleCreateButtonClicked = () => {
    if (title.trim() && preparationTime > 0) {
      axios
        .post(
          `${import.meta.env.VITE_API_SERVER_URL}/conference`,
          {
            title,
            preparationTime,
            email: localStorage.getItem('email'),
          },
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        )
        .then(() => {
          handleNewConferenceClickedTrue();
        })
        .catch((error) => {
          if (error.response?.status === 401) {
            navigate('/userauth');
          } else {
            alert('회의 생성에 실패했습니다.');
          }
        });
    } else {
      alert('올바른 회의 정보를 입력해주세요.');
    }
  };

  const handleCloseButtonClicked = () => {
    setTitle('');
    setPreparationTime(5); // Reset to default
    handleNewConferenceFalse();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={3}
      sx={{
        width: '100%',
        maxWidth: '500px',
        height: '100%',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 3,
        overflow: 'hidden',
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        mb={2}
      >
        <Typography variant="h6">새로운 회의 생성하기</Typography>
        <IconButton onClick={handleCloseButtonClicked}>
          <CloseIcon />
        </IconButton>
      </Box>

      {isNewConferenceClicked ? (
        <>
          <Box width="100%" mb={2}>
            <Typography variant="h6">회의 제목</Typography>
            <Typography variant="body1">{title}</Typography>
          </Box>
          <Box width="100%" mb={2}>
            <Typography variant="h6">아이디어 준비 시간</Typography>
            <Typography variant="body1">{preparationTime} 분</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/instructor?roomid=${title}`)}
            sx={{ width: '100%', mt: 2 }}
          >
            회의 생성하기
          </Button>
        </>
      ) : (
        <>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            width="100%"
            mb={2}
          >
            <Typography variant="h6">회의 주제</Typography>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="회의 주제를 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              inputProps={{ maxLength: 50 }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                },
                '& .MuiInputBase-input': {
                  fontSize: '16px',
                },
              }}
            />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            width="100%"
            mb={2}
          >
            <Typography variant="h6">아이디어 준비 기간</Typography>
            <Typography variant="body1">
              브레인스토밍을 위한 아이디어 준비 제한 시간을 설정해주세요.
            </Typography>
            <Slider
              value={preparationTime}
              onChange={(e, newValue) => setPreparationTime(newValue)}
              aria-labelledby="preparation-time-slider"
              valueLabelDisplay="auto"
              min={1}
              max={10} // Set maximum to 10 minutes
              step={1} // Adjust step to 1 minute for fine control
              sx={{
                color: '#D1C4E9', // Light purple color for the slider
                '& .MuiSlider-thumb': {
                  borderRadius: '50%',
                  bgcolor: '#D1C4E9', // Light purple color for the thumb
                },
                '& .MuiSlider-track': {
                  borderRadius: '4px',
                },
                '& .MuiSlider-rail': {
                  borderRadius: '4px',
                },
              }}
            />
            <Typography variant="body2" color="textSecondary">
              선택된 시간: {preparationTime} 분
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleCreateButtonClicked}
            sx={{ width: '100%', mt: 2 }}
          >
            회의 생성하기
          </Button>
        </>
      )}
    </Box>
  );
};

export default NewConferenceBack;
