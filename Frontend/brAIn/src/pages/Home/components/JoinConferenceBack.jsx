import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import Button from '../../../components/Button/Button';
import { Close as CloseIcon, Search as SearchIcon, MeetingRoom as EnterIcon } from '@mui/icons-material';
import ConferenceCodeInput from './ConferenceCodeInput';
import { useNavigate } from 'react-router-dom';
import axios from '../../../utils/Axios';
import { useDispatch } from 'react-redux';
import { setRole } from '../../../features/conference/conferenceSlice'; // Adjust the path as needed
import './JoinConferenceBack.css';

const JoinConferenceBack = ({
  handleJoinConferenceFalse,
  codeInputs,
  setCodeInputs
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [conferenceFetched, setConferenceFetched] = React.useState(false);
  const [roomUrl, setRoomUrl] = React.useState('');

  const handleSearchButtonClicked = () => {
    if (codeInputs.join('').length !== 6) {
      alert('회의 코드를 올바르게 입력해주세요.');
    } else {
      axios
        .post(`${import.meta.env.VITE_API_BASE_URL}/v1/conferences/join`, {
          inviteCode: codeInputs.join('')
        })
        .then((result) => {
          setTitle(result.data.subject);
          setDescription(result.data.subject);
          setRoomUrl(result.data.secureId);
          setConferenceFetched(true);
        })
        .catch(() => {
          alert('회의 코드가 존재하지 않아요.');
        });
    }
  };

  const handleJoinButtonClicked = () => {
    if (conferenceFetched) {
      dispatch(setRole('participant')); // Set the role to participant
      navigate(`/conferences/${roomUrl}`);
    }
  };

  return (
    <Box className="join-conference-back">
      <Box className="join-conference-content">
        <Box className="join-conference-header">
          <Typography variant="h6">회의 참여하기</Typography>
          <IconButton
            onClick={() => {
              handleJoinConferenceFalse();
              setCodeInputs(Array(6).fill(''));
              setConferenceFetched(false);
            }}
            className="close-button"
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {conferenceFetched ? (
          <Box className="conference-details">
            <Box className="conference-detail-item">
              <Typography variant="h6">회의 코드</Typography>
              <Typography variant="body1">{codeInputs.join('')}</Typography>
            </Box>
            <Box className="conference-detail-item">
              <Typography variant="h6">회의 제목</Typography>
              <Typography variant="body1">{title}</Typography>
            </Box>
            <Box className="conference-detail-item">
              <Typography variant="h6">회의 설명</Typography>
              <Typography variant="body1">{description}</Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              onClick={handleJoinButtonClicked}
              startIcon={<EnterIcon />}
              className="full-width-button"
            >
              회의 참여하기
            </Button>
          </Box>
        ) : (
          <Box className="conference-input-section">
            <Box className="conference-code-input">
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
              className="full-width-button"
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
