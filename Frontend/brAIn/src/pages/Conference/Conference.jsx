import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import axios from '../../utils/Axios';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import WaitingModal from './components/WaitingModal';
import PostItSidebar from './components/PostItSidebar';
import WhiteBoard from './components/WhiteBoard';
import VotedPostIt from './components/VotedPostIt';
import Button from '../../components/Button/Button';
import SidebarIcon from '../../assets/svgs/sidebar.svg';
import SkipIcon from '../../assets/svgs/skip.svg';
import ReadyIcon from '../../assets/svgs/pass.svg';
import NextIcon from '../../assets/svgs/next.svg';
import MemberList from './components/MemberList';

import './ConferenceEx.css';
import Swal from "sweetalert2"; 


import { useNavigate } from 'react-router-dom';

import PostItTest from './components/PostItTest';

import Timer from './components/Timer';
import './Conference.css';


import { addUser, removeUser, setUsers, setUserNick, setCuruser, updatePassStatus, resetPassStatus, updateReadyStatus, resetReadyStatus } from '../../actions/userActions';
import { setCurStep, upRound, setRound, setRoom } from '../../actions/conferenceActions';
import { sendToBoard } from '../../actions/roundRobinBoardAction';
import VoteResultsModal from './components/VoteResultsModal';
import { initVote } from '../../actions/commentsAction';

const Conference = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.conference.role);
  const secureId = useSelector((state) => state.conference.secureId);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [roomId, setRoomId] = useState(null);
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPostItSidebarVisible, setIsPostItSidebarVisible] = useState(false);
  const [hideButtons, setHideButtons] = useState(false);
  const [subject, setSubject] = useState('');

  const users = useSelector(state => state.user.users);
  const nickname = useSelector(state => state.user.nickname);
  const step = useSelector(state => state.conferenceInfo.curStep);
  const round = useSelector(state => state.conferenceInfo.round);
  const curUser = useSelector(state => state.user.currentUser);
  const roundRobinBoard = useSelector(state => state.roundRobinBoard.roundRobinBoard);
  //const roomId=useSelector(state=>state.conferenceInfo.roomId);
  const { secureId: routeSecureId } = useParams();
  const [data,setData]=useState(null);
  
  const votedItems = useSelector(state => state.votedItem.items || []);
  
  
  const MINUTES_IN_MS = 2*60* 1000;
  const [time, setTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(MINUTES_IN_MS);
  const [voteTime,setVoteTime]=useState(10*1000);
  const [timerActive, setTimerActive] = useState(false);

  //투표결과 모달관련
  const [voteResults, setVoteResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [userList, setUserList] = useState([]);



  const [newTime, setnewTime] = useState(null);


  useEffect(() => {
    let isMounted = true;
    let currentClient = null;

    const fetchDataAndConnect = async () => {
      try {
        if (isConnecting) return;
        setIsConnecting(true);

        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/conferences/${routeSecureId}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          },
        });

        if (!localStorage.getItem('roomToken')) {
          localStorage.setItem('roomToken', response.data.jwtForRoom);
          dispatch(setUserNick(response.data.nickname));
        }
        if(roomId == null){
          //dispatch(setRoom(response.data.roomId));
          setRoomId(response.data.roomId);
          const countMemberInWaitingroom=await axios.get(`http://localhost/api/v1/conferences/countUser/${response.data.roomId}`);
          console.log("인원",countMemberInWaitingroom.data);
          setParticipantCount(countMemberInWaitingroom.data+1);
        }

        if (subject === ''){
          setSubject(response.data.subject);
        }

        const newClient = new Client({
          brokerURL: `${import.meta.env.VITE_WSS_BASE_URL}`,
          connectHeaders: {
            Authorization: 'Bearer ' + localStorage.getItem('roomToken')
          },
          debug: (str) => {
            // console.log(str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        newClient.onmessage = function (event) {
          if (event.data === 'ping') {
            newClient.publish({ destination: '/app/pong', body: 'pong' });
          }
        };

        newClient.onConnect = (frame) => {
          setConnected(true);
          newClient.subscribe(`/topic/room.${response.data.roomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            setData(receivedMessage);
            handleMessage(receivedMessage);
          });

          newClient.subscribe(`/queue/room.${response.data.roomId}.${nickname}`,(message)=>{
            const receivedMessage=JSON.parse(message.body);
            handleMessageForIndividual(receivedMessage);
          })
        };

        newClient.onStompError = (frame) => {
          console.error('STOMP error:', frame);
        };

        if (isMounted) {
          setClient(newClient);
          currentClient = newClient;
          newClient.activate();
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsConnecting(false);
      }
    };  

    fetchDataAndConnect();
    

    return () => {
      isMounted = false;
      if (currentClient) {
        currentClient.deactivate();
      }
    };

  }, [routeSecureId, roomId]);

  // 라운드 변경 시 패스 상태 초기화
  useEffect(() => {
    dispatch(resetPassStatus());
  }, [round, dispatch]);


  useEffect(() => {
    if (step === 'STEP_0') {
      // Start the timer if it's step0 and no other timer is running
      // setTimerActive(true);
      startTimer(time);
    }else{
      stepTimeset(step)
    }
    console.log("curUser",curUser);
    
  }, [step, newTime]);

  // const getPerson=async()=>{
    
  // }

  // getPerson();



  const getTime=async()=>{
    const time_response = await axios.get(`http://localhost/api/v1/conferences/time`, {
      params: {
        secureId: routeSecureId,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
    });
  
    if (time === null) {
      setTime(time_response.data.time);
      console.log(time)
    }
  }

  getTime();

  const startTimer = async () => {
    try {
      await Swal.fire({
        icon: "info",
        title: '준비 시간이 시작되었습니다.',
        text: '준비를 마치세요.',
        timer: 3000
      });

      await timer(time);
      
     
        await Swal.fire({
          icon: "warning",
          title: '준비 시간이 끝났습니다.',
          text: '다음 단계로 진행하세요.',
        });
      
    } catch (error) {
      console.error("Error during timer:", error);
    }
  };

  const timer = async (time) => {
    return new Promise(resolve => {
      let timerId;

      const tick = () => {
        
          time -= 1000;
          console.log(time)
          if (time <= 0) {

            clearInterval(timerId); // Stop the timer
            resolve();
            return 0; // Set timer to 0 after it ends
          } else {
            return time;
          }
        
      };

      timerId = setInterval(tick, 1000); // Call tick every second
    });
  };

  const handleMessage = async (receivedMessage) => {
    if (receivedMessage.messageType == 'ENTER_WAITING_ROOM') {
      countUpMember();
    } else if (receivedMessage.messageType == 'SUBMIT_POST_IT') {
      roundRobinBoardUpdate(receivedMessage);
    } else if (receivedMessage.messageType === 'START_CONFERENCE') {
      startMeeting();

      // 사용자 목록 상태 업데이트
      const updatedUsers = dispatch(setUsers(receivedMessage.users));
      dispatch(setCuruser(updatedUsers[0].nickname));

      dispatch(setCurStep('STEP_0'));

    } else if (receivedMessage.messageType === 'ENTER_CONFERENCES') {
      dispatch(setUserNick(receivedMessage.nickname));

    } else if (receivedMessage.messageType == 'NEXT_STEP') {
      dispatch(setCurStep(receivedMessage.curStep))
      if(step=='STEP_3'){
        step3start();
      }
    }else if(receivedMessage.messageType=='SUBMIT_POST_IT_AND_END'){
      await roundRobinBoardUpdate(receivedMessage);
      dispatch(setCurStep('STEP_2'));
      dispatch(step1EndAlarm());
    } else if(receivedMessage.messageType==='FINISH_MIDDLE_VOTE'){
      console.log(receivedMessage);
      console.log(receivedMessage.votes.postit);
    } else if(receivedMessage.messageType=='PASS'){
      console.log('pass to '+receivedMessage.nextUser);
      console.log('User who passed:', receivedMessage.curUser);
      dispatch(updatePassStatus(receivedMessage.curUser));
      dispatch(setCuruser(receivedMessage.nextUser));
      if (round !== receivedMessage.nextRound) {
        dispatch(setRound(receivedMessage.nextRound));
      }
    } else if(receivedMessage.messageType=='PASS_AND_END'){
      console.log('투표시작')
      dispatch(setCurStep('STEP_2'));
      dispatch(step1EndAlarm());

    } 

    else if (receivedMessage.messageType === 'READY') {
      console.log('next :' + receivedMessage.nextUser)
      console.log('User who re:', receivedMessage.curUser);
      dispatch(updateReadyStatus(receivedMessage.curUser));
      dispatch(setCuruser(receivedMessage.nextUser));
    }
  };

  const handleMessageForIndividual= async(receivedMessage)=>{
    if(receivedMessage.messageType=='STEP3_FOR_USER'){
      console.log('step3 start');
      console.log(receivedMessage.step3ForUser);
      dispatch(initVote(receivedMessage.step3ForUser));
    }
  }

  const countUpMember = () => {
      setParticipantCount((prevCount) => {
      console.log('Previous Count:', prevCount);
      return prevCount + 1;
      });    
      setIsModalVisible(true);
  };

  const countDownMember = () => {
    setParticipantCount((prevCount) => Math.max(prevCount - 1, 1));
    setIsModalVisible(true);
  };

  const startMeeting = () => {
    setIsModalVisible(false);
    setIsMeetingStarted(true);
    setHideButtons(false);
  };

  const handleStartMeeting = () => {
    if (client) {
      client.publish({
        destination: `/app/start.conferences.${roomId}`,
        headers: {
          'Authorization': localStorage.getItem('roomToken')
        },
      });
    }
  };


  //라운드 로빈 포스트잇 보드에 저장
  const roundRobinBoardUpdate=async (postit)=>{
    
    dispatch(sendToBoard(postit.curRound, postit.content))

    if (round !== postit.nextRound) {
      dispatch(setRound(postit.nextRound));
    }
    dispatch(setCuruser(postit.nextUser));
  };

  const attachPostitOnRoundBoard = (content) => {
    if (client) {
      const postit = {
        round: round,
        content: content,
      };

      client.publish({
        destination: `/app/step1.submit.${roomId}`,
        headers: { Authorization: localStorage.getItem('roomToken') },
        body: JSON.stringify(postit)
      });
    }
  };

  const togglePostItSidebar = () => {
    setIsPostItSidebarVisible(prev => !prev);
  };

  const handleReadyButtonClick = () => {
    if (client) {
      // 사용자 레디 정보 전송
      client.publish({
        destination: `/app/state.user.ready.${roomId}`,
        headers: {
          Authorization: localStorage.getItem('roomToken'),
        },
        body: JSON.stringify({
          userNickname: curUser, // 레디한 사용자의 닉네임
        }),
      });
    }
  };

  const stepTimer = async (newTime) => {
    return new Promise(resolve => {
      let timerId;

      const tick = () => {
        
        newTime -= 1000;
          console.log(newTime)
          if (newTime <= 0) {
            clearInterval(timerId); // Stop the timer
            resolve();

            Swal.fire({
              icon: "warning",
              title: '시간이 다 되었습니다.',
              text: '다음 단계로 진행하세요.',
            });

            return 0; // Set timer to 0 after it ends
          } else {
            return newTime;
          }
        
      };

      timerId = setInterval(tick, 1000); // Call tick every second
    });
  };


  const stepTimeset = (step) =>{
    const timeSetting = {
      'STEP_1' : 2 * 60 * 1000,
      'STEP_2' : 1 * 60 * 1000,
      'STEP_3' : 2 * 60 * 1000,
    };
    
    console.log(timeSetting[step])
    const newTime = timeSetting[step];
    console.log('step : ', step)
    console.log('new Time : ', newTime)
    setnewTime(newTime);
    stepTimer(newTime);
  };
  

  const handleNextStepClick = () => {
    if (client){
      client.publish({
        destination: `/app/next.step.${roomId}`,
        headers:{
          'Authorization': localStorage.getItem('roomToken')
        },
        body: JSON.stringify({
          step: step
        })
      });
    }
    console.log('Next Step Btn Clicked')
  };  

  const handlePassButtonClick = () => {
    if (client) {
      // 사용자 패스 정보 전송
      client.publish({
        destination: `/app/state.user.pass.${roomId}`,
        headers: {
          Authorization: localStorage.getItem('roomToken'),
        },
        body: JSON.stringify({
          curRound: round,
          userNickname: curUser, // 패스한 사용자의 닉네임
        }),
      });
    }
  };

  const step1EndAlarm = () => async (dispatch, getState) => {
    try {
      await Swal.fire({
        icon: "success",
        title: '브레인 스토밍이 끝났습니다.',
        text: '1분 동안 맘에 드는 3개의 아이디어를 골라주세요',
        timer: 3000
      });
  
      // 타이머 시작
      await timer(voteTime);
  
  
      // 상태 업데이트 후 후속 작업을 수행하기 위해 상태를 확인
      const state = getState();
      const votedItems = state.votedItem.items;
      const step=state.conferenceInfo.curStep;
  
      const itemsObject = votedItems.reduce((map, item, index) => {
        const key = item.content;
        const value = 5 - index * 2;
        map[key] = value;
        return map;
      }, {});
  
      console.log('itemsObject:', itemsObject);
      console.log('step:', state.conferenceInfo.curStep);
  
      // 서버에 투표 결과 전송
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/conferences/vote`, {
        roomId: roomId,
        step: step,
        votes: itemsObject
      }, {
        headers: {
          'Content-Type': 'application/json',
          AuthorizationRoom: localStorage.getItem('roomToken')
        }
      });
  
      // 투표 종료 처리
      await endVote(step);
    } catch (error) {
      console.error("Error during step1EndAlarm:", error);
    }
  };


  const endVote = async (step) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/conferences/vote/endByTimer`, {
      conferenceId: roomId,
      step: step
    }, {
      headers: {
        'Content-Type': 'application/json',
        AuthorizationRoom: localStorage.getItem('roomToken')
      }
    });
    

    Swal.fire({
      icon: "success",
      title: '투표가 종료되었습니다.',
      text: '결과를 확인하세요',
      showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
      confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
      cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
      confirmButtonText: '승인', // confirm 버튼 텍스트 지정
      cancelButtonText: '취소', // cancel 버튼 텍스트 지정
    }).then(async(result) => {
      if (result.isConfirmed) {
        const voteResults = await getVoteResult(step);
        // console.log("투표결과");
        // console.log(voteResults);

        if (voteResults && voteResults.length > 0) {
          // voteResults.forEach(vote => {
          //   console.log(`PostIt: ${vote.postIt}, Score: ${vote.score}`);
          // });
          setVoteResults(voteResults);
          setIsModalOpen(true); // 모달 열기
        } else {
          console.log("No vote results found.");
        }
      }
    });
  } catch (error) {
    console.error("Error ending vote:", error);
  }
  };

  const getVoteResult = async (step) => {
    
    try {
      console.log("getVoteREsult",step)
      console.log(roomId);
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/conferences/vote/results`, {
        params: {
          roomId: roomId,
          step: step
        },
        headers: {
          'Content-Type': 'application/json',
          AuthorizationRoom: localStorage.getItem('roomToken')
        }
      });
      return response.data;  // 데이터 반환
    } catch (error) {
      console.error("Error fetching vote results:", error);
    }
  };

  const step3start=()=>{
    if (client) {
      client.publish({
        destination: `/app/vote.middleResults.${roomId}.${step}`,
        headers: {
          'Authorization': localStorage.getItem('roomToken')  // 예: 인증 토큰
        },
        
      });
    }
    console.log('Step3 button click');
  }

  


  return (
    
    <div className="conference">
      {isModalOpen && (
        <VoteResultsModal 
          voteResults={voteResults} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
      {!isMeetingStarted && (
        <WaitingModal
          isVisible={isModalVisible}
          participantCount={participantCount}
          secureId={routeSecureId}
          onClose={() => setIsModalVisible(false)}
          onStartMeeting={handleStartMeeting}
          client={client}
        />
      )}
      <div className="conference-content">
        <div className="member-list-container">
          <MemberList />
        </div>


        {isMeetingStarted && (
          <div className="conference-section">
            <div className={`sidebar-container ${isPostItSidebarVisible ? 'visible' : ''}`}>
              {isPostItSidebarVisible ? (
                <PostItSidebar
                  isVisible={isPostItSidebarVisible}
                  onClose={togglePostItSidebar}
                  onSubmitClick={attachPostitOnRoundBoard}
                  className={step === 'STEP_0' ? 'expanded' : ''}
                />
              ) : (

                <Button
                  type="fit"
                  onClick={togglePostItSidebar}
                  buttonStyle="black"
                  ariaLabel="Toggle Post-It Sidebar"
                  className="toggle-postit-sidebar-button"
                >
                  <img src={SidebarIcon} alt="Post-It Sidebar Toggle" className="sidebar-icon" />
                </Button>
              )}
            </div>
            <div className="main-content">
              <div className={`action-panel`}>
                <div className="voted-post-it-container">
                  
                    <VotedPostIt/>
                  
                </div>
                <div className="conf-timer-container">
                  <Timer time={step === 'STEP_0' ? time : newTime} />
                </div>
                {role === 'host' && ( // 호스트일 때만 버튼 표시
                  <div className="action-buttons-container">
                    <Button onClick={handleReadyButtonClick} ariaLabel="Ready" disabled={curUser !== nickname}>
                      <img src={ReadyIcon} alt="Ready" className="action-icon" />
                    </Button>
                    <Button onClick={handlePassButtonClick} ariaLabel="Skip" disabled={curUser !== nickname}>
                      <img src={SkipIcon} alt="Skip" className="action-icon" />
                    </Button>

                    <Button onClick={handleNextStepClick} ariaLabel="Next">
                      <img src={NextIcon} alt="Next" className="action-icon" />
                    </Button>
                    <Button onClick={step3start} ariaLabel="Next">
                      <img src={NextIcon} alt="투표정보 가져오기" className="action-icon" />
                    </Button>
                  </div>
                )}
                {role !== 'host' && ( // 호스트일 때만 버튼 표시
                  <div className="action-buttons-container">
                    <Button onClick={handleReadyButtonClick} ariaLabel="Ready" disabled={curUser !== nickname}>
                      <img src={ReadyIcon} alt="Ready" className="action-icon" />
                    </Button>
                    <Button onClick={handlePassButtonClick} ariaLabel="Skip" disabled={curUser !== nickname}>
                      <img src={SkipIcon} alt="Skip" className="action-icon" />
                    </Button>
                  </div>
                )}

              </div>
                <WhiteBoard subject={subject} /> 
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conference;
