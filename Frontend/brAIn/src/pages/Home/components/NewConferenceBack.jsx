import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Slider } from '@mui/material';
import Button from '../../../components/Button/Button';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
<<<<<<< HEAD
import axios from '../../../utils/Axios';
import { useDispatch } from 'react-redux';
=======
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
>>>>>>> 75ccbe74d12a1695724ac1c7444e2a6c75431fb6
=======
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
>>>>>>> 749e056dc148a1be74efc923c4447f594635329f
import { setRole } from '../../../features/conference/conferenceSlice'; // Adjust the path as needed
import './NewConferenceBack.css'; // 스타일을 정의한 CSS 파일을 임포트

import { addUser, removeUser, setUsers, setUserNick } from '../../../actions/userActions';

const NewConferenceBack = ({ 
  handleNewConferenceFalse,
  isNewConferenceClicked,
  handleNewConferenceClickedTrue,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Initialize useDispatch
  const [title, setTitle] = React.useState('');
  const [preparationTime, setPreparationTime] = React.useState(5); // Default to 5 minutes
  const [roomUrl, setRoomUrl] = React.useState('');
  const nickname = useSelector((state) => state.user.nickname);

  const handleCreateButtonClicked = () => {
    if (title.trim() && preparationTime > 0) {
      axios
        .post(
          `http://localhost/api/v1/conferences`,
          {
            subject: title,
            time: preparationTime,
          },
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
            },
          }
        )
        .then((result) => {
          dispatch(setUserNick(result.data.nickname));
          localStorage.setItem('roomToken', result.data.jwtForRoom);
          setRoomUrl(result.data.secureId);
          dispatch(setRole('host')); // Set the role to host
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

  useEffect(() => {
    // 이 useEffect는 nickname이 변경될 때마다 호출됩니다.
    console.log(nickname);
  }, [nickname]);

  const handleCloseButtonClicked = () => {
    setTitle('');
    setPreparationTime(5); // Reset to default
    handleNewConferenceFalse();
  };

  return (
    <Box className="container-box">
      <Box className="header-section">
        <Typography variant="h6">새로운 회의 생성하기</Typography>
        {/* <IconButton onClick={handleCloseButtonClicked}>
          <CloseIcon />
        </IconButton> */}
      </Box>

      {isNewConferenceClicked ? (
        <>
          <Box width="100%" className="typography-margin-bottom">
            <Typography variant="h6">회의 제목</Typography>
            <Typography variant="body1">{title}</Typography>
          </Box>
          <Box width="100%" className="typography-margin-bottom">
            <Typography variant="h6">아이디어 준비 시간</Typography>
            <Typography variant="body1">{preparationTime} 분</Typography>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate(`/conferences/${roomUrl}`)}
            className="button-full-width"
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
            className="typography-margin-bottom"
          >
            <Typography variant="h6">회의 주제</Typography>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="회의 주제를 입력해주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              inputProps={{ maxLength: 50 }}
              classes={{
                root: 'textfield-input-root',
                input: 'textfield-input',
              }}
            />
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            gap={2}
            width="100%"
            className="typography-margin-bottom"
          >
            <Typography variant="h6">아이디어 준비 기간</Typography>
            <Typography variant="body1">
              브레인스토밍을 위한 아이디어 준비 <br/>제한 시간을 설정해주세요.
            </Typography>
            <Slider
              value={preparationTime}
              onChange={(e, newValue) => setPreparationTime(newValue)}
              aria-labelledby="preparation-time-slider"
              valueLabelDisplay="auto"
              min={1}
              max={10} // Set maximum to 10 minutes
              step={1} // Adjust step to 1 minute for fine control
              classes={{
                root: 'slider-root',
                thumb: 'slider-thumb',
                track: 'slider-track',
                rail: 'slider-rail',
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
            className="button-full-width"
          >
            회의 생성하기
          </Button>
        </>
      )}
    </Box>
  );
};

export default NewConferenceBack;
