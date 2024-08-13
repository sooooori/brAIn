import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Redux의 useSelector 훅 가져오기
import Swal from 'sweetalert2';
import TimerIcon from '../../../assets/svgs/timer.svg'; // 타이머 아이콘
import './Timer.css'; // 스타일을 위한 CSS 파일
import {setCuruser, updatePassStatus} from '../../../actions/userActions';
import {useDispatch} from 'react-redux'

const Timer = ({ time, voteSent, passSent }) => {
  const initialTime = parseInt(time, 10) / 1000 || 0;
  const [currentTime, setCurrentTime] = useState(initialTime); // 타이머의 시간 상태
  const curstep = useSelector(state => state.conferenceInfo.curStep);
  const curUser = useSelector(state => state.user.currentUser);
  const nextUser = useSelector(state => state.user.nextUser)
  const [alertShown, setAlertShown] = useState(false);
  const role = useSelector((state) => state.conference.role);
  const dispatch = useDispatch();

  useEffect(() => {
    setCurrentTime(initialTime);
  }, [time, curstep, curUser]);

  useEffect(() => {
    console.log(curstep);
    let time = currentTime;

    if(curstep=='STEP_0' && currentTime==initialTime){
        Swal.fire({
        icon: "info",
        title: '준비 시간이 시작되었습니다.',
        text: '준비를 마치세요.',
        timer: 3000
      });
    }
    else if (curstep === 'STEP_1' && currentTime === initialTime && !alertShown) {
      Swal.fire({
        icon: "success",
        title: '준비 시간이 끝났습니다.',
        text: '준비한 아이디어를 자신의 차례에 제출하세요.',
        timer: 3000
      });
      setAlertShown(true);
    }
    else if(curstep=='STEP_2' && currentTime==initialTime){
      Swal.fire({
        icon: "success",
        title: '브레인 스토밍이 끝났습니다.',
        text: '1분 동안 맘에 드는 3개의 아이디어를 골라주세요.',
        timer: 3000
      });
    }

    const timer = setInterval(() => {
        setCurrentTime((prevtime)=>{
          if(prevtime>0){
            return prevtime-1;
          }else{
            return 0;
          }
        })
    },1000);

    if (currentTime <= 0 && curstep=='STEP_0') {
        clearInterval(timer);
      Swal.fire({
      icon: "warning",
      title: '준비 시간이 끝났습니다.',
      text: '다음 단계로 진행하세요.',
      });
        
    }

    else if (currentTime<=0 && curstep=='STEP_1'){
      console.log('pass User : ',curUser)
      passSent();
    }

    else if(currentTime<=0 && curstep=='STEP_2'){
      console.log('투표시작')
      voteSent();
      clearInterval(timer);
    }
    

    // 이 부분이 컴포넌트가 unmount되거나, 의존성 배열의 값이 변경될 때 실행됨
    return () => clearInterval(timer);

}, [currentTime, curstep, curUser, initialTime]);

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
