import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
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


import { addUser, removeUser, setUsers, setUserNick, setCuruser } from '../../actions/userActions';
import { setCurStep, upRound, setRound, setRoom } from '../../actions/conferenceActions';
import { sendToBoard } from '../../actions/roundRobinBoardAction';
import VoteResultsModal from './components/VoteResultsModal';

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


  const MINUTES_IN_MS = 6 * 1000;
  const [timeLeft, setTimeLeft] = useState(MINUTES_IN_MS);

  //투표결과 모달관련
  const [voteResults, setVoteResults] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);



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

        if (!localStorage.getItem('roomToken')) {
          localStorage.setItem('roomToken', response.data.jwtForRoom);
          dispatch(setUserNick(response.data.nickname));
        }
        if(roomId == null){
          //dispatch(setRoom(response.data.roomId));
          setRoomId(response.data.roomId);
        }

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

  }, [routeSecureId,roomId]);

  const handleMessage = async (receivedMessage) => {
    if (receivedMessage.messageType === 'ENTER_WAITING_ROOM') {
      countUpMember();
    } else if (receivedMessage.messageType === 'SUBMIT_POST_IT') {
      roundRobinBoardUpdate(receivedMessage);
    } else if (receivedMessage.messageType === 'START_CONFERENCE') {
      startMeeting();
      const updatedUsers = await dispatch(setUsers(receivedMessage.users));
      dispatch(setCuruser(updatedUsers[0].nickname));
      dispatch(setCurStep('STEP_0'));
    } else if (receivedMessage.messageType === 'ENTER_CONFERENCES') {
      dispatch(setUserNick(receivedMessage.nickname));

    }
    else if (receivedMessage.messageType == 'NEXT_STEP') {
      dispatch(setCurStep(receivedMessage.curStep))
    }else if(receivedMessage.messageType=='SUBMIT_POST_IT_AND_END'){
      await roundRobinBoardUpdate(receivedMessage);
      dispatch(setCurStep('STEP_2'));
      dispatch(step1EndAlarm());
    }else if(receivedMessage.messageType==='FINISH_MIDDLE_VOTE'){
      console.log(receivedMessage);
      console.log(receivedMessage.votes.postit);
    } else if(receivedMessage.messageType=='PASS'){
      console.log('pass to '+receivedMessage.nextUser)
      dispatch(setCuruser(receivedMessage.nextUser))
    } else if(receivedMessage.messageType=='PASS_AND_END'){
      console.log('투표시작')
      dispatch(setCurStep('STEP_2'));
      dispatch(step1EndAlarm());
    } else if (receivedMessage.messageType === 'NEXT_STEP') {
      dispatch(setCurStep(receivedMessage.curStep));

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

  };

  const handleNextStepClick = () => {
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

  const step1EndAlarm = () => async (dispatch, getState) => {
    try {
      await Swal.fire({
        icon: "success",
        title: '브레인 스토밍이 끝났습니다.',
        text: '1분 동안 맘에 드는 3개의 아이디어를 골라주세요',
        timer: 3000
      });
  
      // 타이머 시작
      await timer();
  
      if (timeLeft <= 0) {
        console.log("타이머 종료");
      }
  
      // 상태 업데이트 후 후속 작업을 수행하기 위해 상태를 확인
      const state = getState();
      const votedItems = state.votedItem.items;
      const step=state.conferenceInfo.curStep;
      console.log(votedItems);  // 상태가 업데이트된 후 출력
  
      const itemsObject = votedItems.reduce((map, item, index) => {
        const key = item.content;
        const value = 5 - index * 2;
        map[key] = value;
        return map;
      }, {});
  
      console.log('itemsObject:', itemsObject);
      console.log('step:', state.conferenceInfo.curStep);
  
      // 서버에 투표 결과 전송
      await axios.post(`http://localhost/api/v1/conferences/vote`, {
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

  const endVote = async (step) => {
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
                  {roundRobinBoard.map((postit, index) => (
                    <VotedPostIt key={index} content={postit.content} />
                  ))}
                </div>
                <div className="conf-timer-container">
                  <Timer />
                </div>
                {role === 'host' && ( // 호스트일 때만 버튼 표시
                  <div className="action-buttons-container">
                    <Button onClick={handleReadyButtonClick} ariaLabel="Ready">
                      <img src={ReadyIcon} alt="Ready" className="action-icon" />
                    </Button>
                    <Button onClick={handlePassButtonClick} ariaLabel="Skip">
                      <img src={SkipIcon} alt="Skip" className="action-icon" />
                    </Button>

                    <Button onClick={handleNextStepClick} ariaLabel="Next">
                      <img src={NextIcon} alt="Next" className="action-icon" />
                    </Button>
                    <Button onClick={step1EndAlarm} ariaLabel="Next">
                      <img src={NextIcon} alt="투표시작" className="action-icon" />
                    </Button>
                  </div>
                )}
                {role !== 'host' && ( // 호스트일 때만 버튼 표시
                  <div className="action-buttons-container">
                    <Button onClick={handleReadyButtonClick} ariaLabel="Ready">
                      <img src={ReadyIcon} alt="Ready" className="action-icon" />
                    </Button>
                    <Button onClick={handlePassButtonClick} ariaLabel="Skip">
                      <img src={SkipIcon} alt="Skip" className="action-icon" />
                    </Button>
                  </div>
                )}

              </div>
              <WhiteBoard />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conference;
