import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import WaitingModal from './components/WaitingModal';
import ConferenceNavbar from '../../components/Navbar/ConferenceNavbar';

import PostItSidebar from './components/PostItSidebar';
import Timer from './components/Timer';
import WhiteBoard from './components/WhiteBoard';
import VotedPostIt from './components/VotedPostIt';
import Button from '../../components/Button/Button';
import SidebarIcon from '../../assets/svgs/sidebar.svg';
import MemberList from './components/MemberList';
import './ConferenceEx.css';
import Swal from "sweetalert2"; 

import { addUser, removeUser, setUsers, setUserNick, setCuruser, resetUser } from '../../actions/userActions';
import { setCurStep, upRound, setRound, resetConference } from '../../actions/conferenceActions';
import { sendToBoard, resetRoundBoard } from '../../actions/roundRobinBoardAction';

import { useNavigate } from 'react-router-dom';

import PostItTest from './components/PostItTest';


const Conference = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.conference.role);
  const secureId = useSelector((state) => state.conference.secureId);
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [roomId, setRoomId] = useState(null);
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  //const [roundRobinBoard, setRoundRobinBoard] = useState([]);


  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const users = useSelector(state => state.user.users);
  const nickname = useSelector(state => state.user.nickname)
  const step = useSelector(state => state.conferenceInfo.curStep)
  const round = useSelector(state => state.conferenceInfo.round)
  const [isUnmounted, setIsUnmounted] = useState(false);
  const curUser = useSelector(state => state.user.currentUser)

  const roundRobinBoard = useSelector(state => state.roundRobinBoard.roundRobinBoard);
  const { secureId: routeSecureId } = useParams();

  const votedItems = useSelector(state => state.votedItem.items || []);

  const MINUTES_IN_MS = 6 * 1000;
  const [timeLeft, setTimeLeft] = useState(MINUTES_IN_MS);


  useEffect(() => {
    let isMounted = true;
    let currentClient = null;


    const fetchDataAndConnect = async () => {
      try {
        if (isConnecting) return;
        setIsConnecting(true);

        const response = await axios.post(`http://localhost/api/v1/conferences/${routeSecureId}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          },
        });

        // 'roomToken'이 로컬 스토리지에 없을 때만 작업 수행
        if (!localStorage.getItem('roomToken')) {
          localStorage.setItem('roomToken', response.data.jwtForRoom);
          console.log('roomToken이 없어서 새로운 토큰을 저장했습니다.');
          dispatch(setUserNick(response.data.nickname));
        } else {
          console.log('roomToken이 이미 존재합니다.');
        }
        setRoomId(response.data.roomId);

        const newClient = new Client({
          brokerURL: 'ws://localhost/ws',
          connectHeaders: {
            Authorization: 'Bearer ' + localStorage.getItem('roomToken')
          },
          debug: (str) => {
            console.log(str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        newClient.onmessage = function (event) {
          if (event.data === 'ping') {
            socket.send('pong');
          }
        };

        newClient.onConnect = (frame) => {
          setConnected(true);
          console.log('Connected: ' + frame);
          newClient.subscribe(`/topic/room.${response.data.roomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            handleMessage(receivedMessage);
          });

          // newClient.subscribe(`/topic/start.conferences.${roomId}`, (message) => {
          //   const receivedMessage = JSON.parse(message.body);
          //   console.log('Received message to start conference:', receivedMessage);


          //   if (receivedMessage.type === 'START_MEETING') {
          //     startMeeting(receivedMessage);
          //   }
          // });
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

  }, [routeSecureId]);

  useEffect(() => {
    console.log(users);
  }, [users]);

  useEffect(() => {
    console.log(nickname);
  }, [nickname]);

  useEffect(() => {
    console.log(curUser);
  }, [curUser]);
  useEffect(() => {
    console.log(roundRobinBoard.content);
  }, [roundRobinBoard]);

  const handleMessage = async (receivedMessage) => {
    if (receivedMessage.messageType === 'ENTER_WAITING_ROOM') {
      countUpMember();
    } else if (receivedMessage.messageType === 'SUBMIT_POST_IT') {
      roundRobinBoardUpdate(receivedMessage);
    }
    else if (receivedMessage.messageType == 'START_CONFERENCE') {
      console.log("Rldpdpdpdpdpdpdpdppd")
      startMeeting();
      const updatedUsers = await dispatch(setUsers(receivedMessage.users));
      dispatch(setCuruser(updatedUsers[0].nickname));
      dispatch(setCurStep('STEP_0'))
    }
    else if (receivedMessage.messageType == 'ENTER_CONFERENCES') {
      dispatch(setUserNick(receivedMessage.nickname));
    }
    else if (receivedMessage.messageType == 'NEXT_STEP') {
      dispatch(setCurStep(receivedMessage.curStep))
    }else if(receivedMessage.messageType=='SUBMIT_POST_IT_AND_END'){
      await roundRobinBoardUpdate(receivedMessage);
      step1EndAlarm();
    }else if(receivedMessage.messageType==='FINISH_MIDDLE_VOTE'){
      console.log(receivedMessage);
      console.log(receivedMessage.votes.postit);
    } else if(receivedMessage.messageType=='PASS'){
      console.log('pass to '+receivedMessage.nextUser)
      dispatch(setCuruser(receivedMessage.nextUser))
    } else if(receivedMessage.messageType=='PASS_AND_END'){
      console.log('투표시작')
      await setCurStep('STEP_2')
      step1EndAlarm();
    }
  };

  const countUpMember = () => {
    setParticipantCount((prevCount) => prevCount + 1);
    setIsModalVisible(true);
  };

  const countDownMember = () => {
    setParticipantCount((prevCount) => Math.max(prevCount - 1, 1));
    setIsModalVisible(true);
  };

  const startMeeting = () => {
    setIsModalVisible(false);
    setIsMeetingStarted(true);
    // console.log(users)
  };

  const handleStartMeeting = () => {
    if (client) {
      client.publish({
        destination: `/app/start.conferences.${roomId}`,
        headers: {
          'Authorization': localStorage.getItem('roomToken')  // 예: 인증 토큰
        },
        //body: JSON.stringify({ type: 'START_MEETING' }),
      });
    }
  };

  //라운드 로빈 포스트잇 보드에 저장
  const roundRobinBoardUpdate=async (postit)=>{
    
    dispatch(sendToBoard(postit.curRound, postit.content))
    if (round !== postit.nextRound) {
      dispatch(setRound(postit.nextRound));
    }
    dispatch(setCuruser(postit.nextUser))
  }

  //라운드 로빈 포스트잇 제출
  const attachPostitOnRoundBoard = (content) => {
    if (client) {
      const postit = {
        round: round,
        content: content,
      }

      client.publish({
        destination: `/app/step1.submit.${roomId}`,
        headers: { Authorization: localStorage.getItem('roomToken') },
        body: JSON.stringify(postit)
      });
    }
  }

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarVisible(false);
  };

  const handleReadyButtonClick = () => {
    // Implement logic for "Ready" button click
  };

  const handleNextStepClick = () => {
    // Implement logic for "Next Step" button click
    if (client) {
      client.publish({
        destination: `/app/next.step.${roomId}`,
        headers: {
          'Authorization': localStorage.getItem('roomToken')  // 예: 인증 토큰
        },
        body: JSON.stringify({
          step: step
        })
      });
    }
  };

  const handlePassButtonClick = () => {
    if (client) {
      client.publish({
        destination: `/app/state.user.pass.${roomId}`,
        headers: {
          'Authorization': localStorage.getItem('roomToken')  // 예: 인증 토큰
        },
        body: JSON.stringify({
          curRound: round
        })
      });
    }
    console.log('Pass button clicked');
  };

  const step1EndAlarm = async () => {
    
    
    try {
      await Swal.fire({
        icon: "success",
        title: '브레인 스토밍이 끝났습니다.',
        text: '1분 동안 맘에 드는 3개의 아이디어를 골라주세요',
        timer: 3000
      });
  
      // 알림창이 닫힌 후 타이머 시작
      await timer();  // timer() 함수는 비동기 함수여야 합니다.
  
      if (timeLeft <= 0) {
        console.log("타이머 종료");
      }
      
      const itemsObject = votedItems.reduce((map, item, index) => {
        const key = item.content;
        const value = index * 2 + 1; 
        map[key] = value;
        return map;
      }, {});
  
      // 서버에 투표 결과 전송
      const response = await axios.post(`http://localhost/api/v1/conferences/vote`, {
        roomId: roomId,
        step: step,
        votes: itemsObject
      }, {
        headers: {
          'Content-Type': 'application/json',
          AuthorizationRoom:localStorage.getItem('roomToken')
        }
      });

      console.log(response);

      await endVote();

    
  
      // STOMP 클라이언트를 통해 메시지 전송
      client.publish({
        destination: `/app/vote.middleResults.${roomId}.${step}`,
        headers: { Authorization: localStorage.getItem('roomToken') }
      });
    } catch (error) {
      console.error("Error during step1EndAlarm:", error);
    }
  };

  let timerId;

const timer = async () => {
  return new Promise(resolve => {
    const tick = () => {
      setTimeLeft(prevTimeLeft => {
        const newTimeLeft = prevTimeLeft - 1000;
        if (newTimeLeft <= 0) {
          clearInterval(timerId); // 타이머를 멈춥니다
          resolve();
          return 0; // 타이머 종료 후 0으로 설정
        } else {
          return newTimeLeft;
        }
      });
    };

    timerId = setInterval(tick, 1000); // 매 초마다 tick 함수를 호출
  });
};

  const endVote = async () => {
  try {
    const response = await axios.post(`http://localhost/api/v1/conferences/vote/endByTimer`, {
      conferenceId: roomId,
      step: step
    }, {
      headers: {
        'Content-Type': 'application/json',
        AuthorizationRoom: localStorage.getItem('roomToken')
      }
    });

    await Swal.fire({
      icon: "success",
      title: '투표가 종료되었습니다.',
      text: '결과를 확인하세요',
      showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
      confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
      cancelButtonColor: '#d33', // cancel 버튼 색깔 지정
      confirmButtonText: '승인', // confirm 버튼 텍스트 지정
      cancelButtonText: '취소', // cancel 버튼 텍스트 지정
    }).then(async (result) => {
      if (result.isConfirmed) {
        const voteResults = await getVoteResult();
        console.log("투표결과");
        console.log(voteResults);

        if (voteResults && voteResults.length > 0) {
          voteResults.forEach(vote => {
            console.log(`PostIt: ${vote.postIt}, Score: ${vote.score}`);
          });
        } else {
          console.log("No vote results found.");
        }
      }
    });
  } catch (error) {
    console.error("Error ending vote:", error);
  }
  };

  const getVoteResult = async () => {
    try {
      const response = await axios.get(`http://localhost/api/v1/conferences/vote/results`, {
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

  const voteTestPublish=async ()=>{

  }


  return (
    <div className="conference">
      {/* {isMeetingStarted && <ConferenceNavbar secureId={routeSecureId} />} */}
      {!isMeetingStarted && (
        <div>
          <WaitingModal
            isVisible={isModalVisible}
            participantCount={participantCount}
            secureId={routeSecureId}
            onClose={() => setIsModalVisible(false)}
            onStartMeeting={handleStartMeeting}
            client={client}
          />
        </div>
      )}
      <div>
        <MemberList />
      </div>

      {isMeetingStarted && (
        <div className="meeting-content">
          <div className="sidebar-container">
            <Button
              type="fit"
              onClick={toggleSidebar}
              buttonStyle="black"
              ariaLabel="Toggle Sidebar"
              className="toggle-sidebar-button"
            >
              <img src={SidebarIcon} alt="Sidebar Toggle" className="sidebar-icon" />
            </Button>
            <PostItSidebar
              notes={notes}
              isVisible={isSidebarVisible}
              onClose={handleCloseSidebar}
              onSubmitClick={attachPostitOnRoundBoard}
            />
          </div>
          <div className="main-content">
            <VotedPostIt />
            <div className="whiteboard-section">
              <div className="conf-timer-container">
                <Timer />
              </div>
              <div className="whiteboard-container">
                <WhiteBoard subject="안녕" onSubmitClick={attachPostitOnRoundBoard} />
              </div>

              {/* test */}


              <div className="action-buttons-container">
                <Button
                  type='fit'
                  onClick={handleReadyButtonClick}
                  buttonStyle="purple"
                  ariaLabel="Ready Button"
                  className="action-button ready-button"
                >
                  <span>준비 완료</span>
                </Button>
                {/*role !== 'host' && (
                  <>
                    <Button
                      type='fit'
                      onClick={handleNextStepClick}
                      buttonStyle="purple"
                      ariaLabel="Next Step Button"
                      className="action-button next-step-button"
                    >
                      <span>다음 단계</span>
                    </Button>
                    <Button
                      type='fit'
                      onClick={handlePassButtonClick}
                      buttonStyle="purple"
                      ariaLabel="Pass Button"
                      className="action-button pass-button"
                    >
                      <span>패스하기</span>
                    </Button>
                  </>
                )*/}
                <Button
                  type='fit'
                  onClick={handleNextStepClick}
                  buttonStyle="purple"
                  ariaLabel="Next Step Button"
                  className="action-button next-step-button"
                >
                  <span>다음 단계</span>
                </Button>
                <Button
                  type='fit'
                  onClick={handlePassButtonClick}
                  buttonStyle="purple"
                  ariaLabel="Pass Button"
                  className="action-button pass-button"
                >
                  <span>패스하기</span>
                </Button>
                <Button
                  type='fit'
                  onClick={step1EndAlarm}
                  buttonStyle="purple"
                  ariaLabel="Pass Button"
                  className="action-button end-button"
                >
                  <span>투표하기</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div>Current Step: {step}
      </div>
      <div>Current Round: {round}</div>
      {/* {users.map((user, index) => (
        <div key={index}>
          <p>Nickname: {user.nickname}</p>
          <p>Ready: {user.ready ? 'Yes' : 'No'}</p>
          {user.nickname === curUser && <p>cur</p>}
        </div>
      ))}
      <div>nickname: {nickname}</div>
      <div>curuser : {curUser}</div> */}
    </div>
  );
};

export default Conference;
