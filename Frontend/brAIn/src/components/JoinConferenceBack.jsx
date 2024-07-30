import React from 'react';
import { Box, Typography } from '@mui/material';
import Button from './Button/Button';
import { Close as CloseIcon, Search as SearchIcon, MeetingRoom as EnterIcon } from '@mui/icons-material';
import ConferenceCodeInput from './ConferenceCodeInput';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Ensure axios is installed and imported

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
  const [conferenceFetched, setConferenceFetched] = React.useState(false); // Track if conference details are fetched

  const handleSearchButtonClicked = () => {
    if (codeInputs.join('').length !== 6) {
      alert('회의 코드를 올바르게 입력해주세요.');
    } else {
      axios
        .get(`${import.meta.env.VITE_API_SERVER_URL}/conference?code=${codeInputs.join('')}`)
        .then((result) => {
          setTitle(result.data.title);
          setDescription(result.data.description);
          setConferenceFetched(true); // Mark conference details as fetched
        })
        .catch(() => {
          alert('회의 코드가 존재하지 않아요.');
        });
    }
  };

  const handleJoinButtonClicked = () => {
    if (conferenceFetched) {
      navigate(`/participant?roomid=${codeInputs.join('')}`);
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
        <Button 
          onClick={() => {
            handleJoinConferenceFalse(); 
            setCodeInputs(Array(6).fill('')); // Reset code inputs
            setConferenceFetched(false); // Reset fetched state
          }}
        >
          <CloseIcon />
        </Button>
      </Box>
      
      {conferenceFetched ? (
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleJoinButtonClicked}
            startIcon={<EnterIcon />}
          >
            회의 참여하기
          </Button>
        </>
      ) : (
        <>
          <Box mb={2}>
            <Typography variant="h6">회의 코드</Typography>
            <Typography variant="body2">회의 진행자에게 전달받은 회의 코드 6자리를 입력해주세요.</Typography>
            <ConferenceCodeInput inputs={codeInputs} setInputs={setCodeInputs} keyPress={handleSearchButtonClicked} />
          </Box>
          <Button
            variant="contained"
            color="default"
            onClick={handleSearchButtonClicked}
            startIcon={<SearchIcon />}
          >
            회의 조회하기
          </Button>
        </>
      )}
    </Box>
  );
};

export default JoinConferenceBack;
