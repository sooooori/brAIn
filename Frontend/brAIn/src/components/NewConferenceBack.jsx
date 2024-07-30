import React from 'react';
import { Box, Typography, TextField, IconButton, Button as MuiButton } from '@mui/material';
import Button from './Button/Button'; // Adjust path if necessary
import CloseIcon from '@mui/icons-material/Close'; // Use MUI's CloseIcon
import AddIcon from '@mui/icons-material/Add'; // Use MUI's AddIcon
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import useAuth from './hooks/useAuth'; // Assuming you have a useAuth hook

const NewConferenceBack = ({ 
  handleNewConferenceFalse,
  isNewConferenceClicked,
  handleNewConferenceClickedTrue,
}) => {
  const navigate = useNavigate();
  // const { checkAuth } = useAuth();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  // Function to handle the creation of a new conference
  const handleCreateButtonClicked = () => {
    if (title.trim() && description.trim()) {
      // checkAuth(); // Check authentication
      axios
        .post(
          `${import.meta.env.VITE_API_SERVER_URL}/conference`,
          {
            title,
            description,
            email: localStorage.getItem('email'),
          },
          {
            headers: {
              Authorization: localStorage.getItem('token'),
            },
          }
        )
        .then((result) => {
          handleNewConferenceClickedTrue(); // Trigger the flip to show the confirmation
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
    // Reset input fields and close the card
    setTitle('');
    setDescription('');
    handleNewConferenceFalse();
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={3}
      className="w-full h-full"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        mb={2}
      >
        <Typography variant="h6">새로운 회의 생성하기</Typography>
        <IconButton onClick={handleCloseButtonClicked} color="inherit">
          <CloseIcon />
        </IconButton>
      </Box>

      {isNewConferenceClicked ? (
        <>
          <Box mb={2}>
            <Typography variant="h6">회의 제목</Typography>
            <Typography variant="body1">{title}</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h6">회의 설명</Typography>
            <Typography variant="body1">{description}</Typography>
          </Box>
          <MuiButton
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/instructor?roomid=${title}`)} // Adjust as needed
          >
            회의 생성하기
          </MuiButton>
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
            <Typography variant="h6">회의 제목</Typography>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="회의 제목을 입력해주세요"
              maxLength={50}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              inputProps={{ maxLength: 50 }}
            />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            width="100%"
            mb={2}
          >
            <Typography variant="h6">회의 설명</Typography>
            <TextField
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              placeholder="회의 설명을 입력해주세요"
              maxLength={200}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              inputProps={{ maxLength: 200 }}
            />
          </Box>

          <Button
            onClick={handleCreateButtonClicked}
            startIcon={<AddIcon />}
            buttonStyle="blue"
          >
            회의 생성하기
          </Button>
        </>
      )}
    </Box>
  );
};

export default NewConferenceBack;
