import React, { useState, useEffect } from 'react';
import axios from 'axios'; // HTTP 클라이언트 라이브러리
import TimerIcon from '../../../assets/svgs/timer.svg'; // 타이머 아이콘
import PlusTimeIcon from '../../../assets/svgs/plus_time.svg'; // + 버튼 아이콘
import './Timer.css'; // 스타일을 위한 CSS 파일

const Timer = ({ roomId }) => {
  const initialTime = 5 * 60; // 5분 (초 단위)
  const [time, setTime] = useState(initialTime); // 타이머의 시간(초 단위)
  const [isRunning, setIsRunning] = useState(false); // 타이머가 실행 중인지 여부

  useEffect(() => {
    let timer;
    if (isRunning && time > 0) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time <= 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, time]);

  const startTimer = () => setIsRunning(true);
  const stopTimer = () => setIsRunning(false);

  const addTime = async () => {
    try {
      await axios.post(`/topic/timer.modify.${roomId}`, { extraTime: 30 });
      setTime(prevTime => prevTime + 30);
    } catch (error) {
      console.error('Error adding time:', error);
    }
  };

  const passTurn = async () => {
    try {
      await axios.post(`/topic/state.user.pass.${roomId}`);
    } catch (error) {
      console.error('Error passing turn:', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      <img src={TimerIcon} alt="Timer Icon" className="timer-icon" />
      <div className="timer-display">
        {formatTime(time)}
      </div>
      <div className="timer-buttons">
        <button className="timer-button add-time" onClick={addTime}>
          <img src={PlusTimeIcon} alt="Plus Time Icon" className="button-icon" />
        </button>
      </div>
    </div>
  );
};

export default Timer;
