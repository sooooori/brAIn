import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import Button from '../../../components/Button/Button';
import { Close as CloseIcon, Search as SearchIcon, MeetingRoom as EnterIcon } from '@mui/icons-material';
import ConferenceCodeInput from './ConferenceCodeInput';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JoinConferenceBack = ({
  handleJoinConferenceFalse,
  codeInputs,
  setCodeInputs
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [conferenceFetched, setConferenceFetched] = React.useState(false);

  const handleSearchButtonClicked = () => {
    if (codeInputs.join('').length !== 6) {
      alert('회의 코드를 올바르게 입력해주세요.');
    } else {
      axios
        .get(`${import.meta.env.VITE_API_SERVER_URL}/conference?code=${codeInputs.join('')}`)
        .then((result) => {
          setTitle(result.data.title);
          setDescription(result.data.description);
          setConferenceFetched(true);
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
      alignItems="center"
      justifyContent="center" // Center vertically
      p={3}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: 3,
        height: '100%',
        width: '100%',
        maxWidth: '500px', // Ensure it doesn't stretch too wide
        margin: '0 auto', // Center the box horizontally
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          mb={3} // Increased margin-bottom for more space below header
        >
          <Typography variant="h6">회의 참여하기</Typography>
          <IconButton
            onClick={() => {
              handleJoinConferenceFalse(); 
              setCodeInputs(Array(6).fill('')); // Reset code inputs
              setConferenceFetched(false); // Reset fetched state
            }}
            sx={{ minWidth: '40px' }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {conferenceFetched ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="stretch"
            width="100%"
            mb={3} // Increased margin-bottom between sections
          >
            <Box mb={2} width="100%">
              <Typography variant="h6">회의 코드</Typography>
              <Typography variant="body1">{codeInputs.join('')}</Typography>
            </Box>
            <Box mb={2} width="100%">
              <Typography variant="h6">회의 제목</Typography>
              <Typography variant="body1">{title}</Typography>
            </Box>
            <Box mb={2} width="100%">
              <Typography variant="h6">회의 설명</Typography>
              <Typography variant="body1">{description}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleJoinButtonClicked}
              startIcon={<EnterIcon />}
              sx={{ width: '100%' }}
            >
              회의 참여하기
            </Button>
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
              width="100%"
              mb={3} // Increased margin-bottom for spacing above the input and button
            >
              <Typography variant="h6">회의 코드</Typography>
              <Typography variant="body2" mb={1}>
                전달받은 회의 코드 6자리를 입력해주세요.
              </Typography>
              <ConferenceCodeInput inputs={codeInputs} setInputs={setCodeInputs} keyPress={handleSearchButtonClicked} />
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearchButtonClicked}
              startIcon={<SearchIcon />}
              sx={{ width: '100%' }}
            >
              회의 조회하기
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default JoinConferenceBack;
