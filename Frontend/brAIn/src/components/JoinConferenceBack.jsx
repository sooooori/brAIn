import React from 'react';
import Button from '../components/Button/Button'
import { Box, Typography } from '@mui/material';
import { Close as CloseIcon, Search as SearchIcon, MeetingRoom as EnterIcon } from '@mui/icons-material';
import ConferenceCodeInput from './ConferenceCodeInput';
import { useNavigate } from 'react-router-dom';
const JoinConferenceBack = ({
  handleJoinConferenceFalse,
  isConferenceSearchClicked,
  handleConferenceSearchClickedTrue,
  codeInputs,
  setCodeInputs
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleSearchButtonClicked = () => {
    if (isConferenceSearchClicked) {
      navigate(`/participant?roomid=${codeInputs.join('')}`);
    } else {
      if (codeInputs.join('').length !== 6) {
        alert('회의 코드를 올바르게 입력해주세요.');
      } else {
        axios
          .get(`${import.meta.env.VITE_API_SERVER_URL}/conference?code=${codeInputs.join('')}`)
          .then((result) => {
            setTitle(result.data.title);
            setDescription(result.data.description);
            handleConferenceSearchClickedTrue();
          })
          .catch(() => {
            alert('회의 코드가 존재하지 않아요.');
          });
      }
    }
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
      >
        <Typography variant="h6">회의 참여하기</Typography>
        <Button onClick={handleJoinConferenceFalse}>
          <CloseIcon />
        </Button>
      </Box>
      
      {isConferenceSearchClicked ? (
        <>
          <Box mb={2}>
            <Typography variant="h6">회의 코드</Typography>
            <Typography variant="body1">{codeInputs.join('')}</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h6">회의 제목</Typography>
            <Typography variant="body1">{title}</Typography>
          </Box>
          <Box mb={2}>
            <Typography variant="h6">회의 설명</Typography>
            <Typography variant="body1">{description}</Typography>
          </Box>
        </>
      ) : (
        <Box mb={2}>
          <Typography variant="h6">회의 코드</Typography>
          <Typography variant="body2">회의 진행자에게 전달받은 회의 코드 6자리를 입력해주세요.</Typography>
          <ConferenceCodeInput inputs={codeInputs} setInputs={setCodeInputs} keyPress={handleSearchButtonClicked} />
        </Box>
      )}

      <Button
        variant="contained"
        color={isConferenceSearchClicked ? 'primary' : 'default'}
        onClick={handleSearchButtonClicked}
        startIcon={isConferenceSearchClicked ? <EnterIcon /> : <SearchIcon />}
      >
        {isConferenceSearchClicked ? '회의 참여하기' : '회의 조회하기'}
      </Button>
    </Box>
  );
};

export default JoinConferenceBack;
