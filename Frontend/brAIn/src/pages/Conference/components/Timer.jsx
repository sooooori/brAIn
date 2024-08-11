import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux의 useSelector 훅 가져오기
import Swal from 'sweetalert2';
import TimerIcon from '../../../assets/svgs/timer.svg'; // 타이머 아이콘
import './Timer.css'; // 스타일을 위한 CSS 파일

const Timer = ({ time, onTimerEnd }) => {
  const initialTime = parseInt(time, 10) / 1000 || 0;
  const [currentTime, setCurrentTime] = useState(initialTime); // 타이머의 시간 상태
  const curstep = useSelector(state => state.conferenceInfo.curStep);
  const role = useSelector((state) => state.conference.role);
  useEffect(() => {
    // time이 변경될 때 타이머 초기화
    setCurrentTime(initialTime);
  }, [time]);

  useEffect(() => {
    console.log(curstep)
    const timer = setInterval(() => {
      setCurrentTime(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
        
          if (curstep === 'WAIT' && role ==='host') {
            Swal.fire({
              icon: 'warning',
              title: '준비 시간이 끝났습니다.',
              text: '라운드 로빈을 준비해주세요. 다음 라운드를 진행하겠습니까?',
              confirmButtonText: '다음 라운드'
            }).then(() => {
              if (onTimerEnd) onTimerEnd(); // 타이머 종료 시 onTimerEnd 호출
            });
          }
          // curstep이 0일 때 Swal 모달 추가
          if (curstep === 'WAIT' && role !=='host') {
            Swal.fire({
              icon: 'warning',
              title: '준비 시간이 끝났습니다.',
              text: '라운드 로빈을 준비해주세요. 회의 호스트가 회의를 시작하길 기다립니다.',
            }).then(() => {
              if (onTimerEnd) onTimerEnd(); // 타이머 종료 시 onTimerEnd 호출
            });
          }

          return 0; // 타이머가 0에 도달하면 중지
        }
        return prevTime - 1; // 타이머 감소
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime, onTimerEnd, curstep]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      <img src={TimerIcon} alt="Timer Icon" className="timer-icon" />
      <div className="timer-display">
        {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default Timer;
