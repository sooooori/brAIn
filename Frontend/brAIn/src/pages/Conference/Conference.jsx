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
import { initVote, nextItem } from '../../actions/commentsAction';

import MiddlePage from './components/MiddlePage';

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
  const nextUser = useSelector(state => state.user.nextUser);
  const roundRobinBoard = useSelector(state => state.roundRobinBoard.roundRobinBoard);
  const readyStatuses = useSelector((state) => state.user.readyStatuses);
  //const roomId=useSelector(state=>state.conferenceInfo.roomId);
  const { secureId: routeSecureId } = useParams();
  const [data,setData]=useState(null);
  
  const votedItems = useSelector(state => state.votedItem.items || []);
  const curIndex=useSelector(state=>state.commentBoard.curIndex);
  const ideaLIst=useSelector(state=>state.commentBoard.vote);
  const [time, setTime] = useState(null);
  const [timerForStep3,setTimerForStep3]=useState(false);

  //투표결과 모달관련
  const [voteResults, setVoteResults] = useState([]);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  const [userList, setUserList] = useState([]);
  const [newTime, setnewTime] = useState(null);

  // READY 카운트 상태 추가
  const [readyCount, setReadyCount] = useState(0);

  // AI 닉네임 저장을 위한 상태
  const [aiName, setAiName] = useState(''); // useState를 사용하여 상태로 관리

  // 구체화 이후
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);


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
          const countMemberInWaitingroom=await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/conferences/countUser/${response.data.roomId}`);
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

          let nick=null;
          if(nickname==""){
            nick=response.data.nickname;
          }else{
            nick=nickname;
          }
          newClient.subscribe(`/queue/room.${response.data.roomId}.${nick}`,(message)=>{
            const receivedMessage=JSON.parse(message.body);
            handleMessageForIndividual(receivedMessage);
          })
        };

        newClient.onStompError = (frame) => {
          console.error('STOMP error:', frame);
        };
        
        // 그냥 isMount 원래 true였는데 안되서 ! 붙임
        if (!isMounted) {
          
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

  // 라운드 및 단계 변경 시 패스 상태 초기화
  useEffect(() => {
    dispatch(resetPassStatus());
  }, [round, step, dispatch]);

  // 단계 변경 시 준비 상태 초기화
  useEffect(() => {
    dispatch(resetReadyStatus());
    setReadyCount(0);
  }, [step, dispatch])

  // // 단계가 변경될 때마다 readyCount를 0으로 초기화
  // useEffect(() => {
  //   setReadyCount(0);
  // }, [step]);

  

  useEffect(()=>{

    const getTime=async()=>{
      const time_response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/conferences/time`, {
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
        console.log()
      }
    }
    console.log('useEffect내부',step)
    if(step=='STEP_0'){
      getTime();
    }
    console.log("회의창에서 재 랜더링 될때, 현재유저",curUser);

  },[time,curUser])



  // const getPerson=async()=>{
    
  // }

  // getPerson();

  const handleMessage = (receivedMessage) => {
    if (receivedMessage.messageType == 'ENTER_WAITING_ROOM') {
      countUpMember();
    }else if(receivedMessage.messageType=='EXIT_WAITING_ROOM'){
      console.log('유저나감1');
      countDownMember();
    } 
    else if (receivedMessage.messageType == 'SUBMIT_POST_IT') {
      roundRobinBoardUpdate(receivedMessage);
    } else if (receivedMessage.messageType === 'START_CONFERENCE') {
      console.log("회의시작")
      // AI 닉네임 저장
      setAiName(receivedMessage.aiNickname);
      startMeeting();

      // 사용자 목록 상태 업데이트
      const updatedUsers = dispatch(setUsers(receivedMessage.users));
      dispatch(setCuruser(updatedUsers[0].nickname));
      
      dispatch(setCurStep('STEP_0'));

    } else if (receivedMessage.messageType === 'ENTER_CONFERENCES') {
      dispatch(setUserNick(receivedMessage.nickname));

    } else if (receivedMessage.messageType == 'NEXT_STEP') {
      dispatch(setCurStep(receivedMessage.curStep))
      if(receivedMessage.curStep=='STEP_1'){
        setTime(2*6*1000);
      }else if(receivedMessage.curStep=='STEP_2'){
        setTime(1*6*1000);
      }
      else if(receivedMessage.curStep=='STEP_3'){
        setTime(3*6*1000);
      }
    }else if(receivedMessage.messageType=='SUBMIT_POST_IT_AND_END'){
      roundRobinBoardUpdate(receivedMessage);
      dispatch(setCurStep('STEP_2'));
      setTime(1*6*1000);
    } else if(receivedMessage.messageType==='FINISH_MIDDLE_VOTE'){
      console.log(receivedMessage);
      console.log(receivedMessage.votes.postit);

    } else if(receivedMessage.messageType=='PASS'){
      console.log('pass to '+receivedMessage.nextUser);
      console.log('User who passed:', receivedMessage.curUser);
      dispatch(updatePassStatus(receivedMessage.curUser));
      
      console.log("제 랜더링 전에 시간",time);
      dispatch(setCuruser(receivedMessage.nextUser));
      if (round !== receivedMessage.nextRound) {
        //dispatch(updatePassStatus(receivedMessage.curUser));
        dispatch(setRound(receivedMessage.nextRound));
      }

    } else if(receivedMessage.messageType=='PASS_AND_END'){
      console.log('투표시작')
      dispatch(setCurStep('STEP_2'));
      setTime(1*6*1000);


    } 

    else if (receivedMessage.messageType === 'READY') {
      console.log('준비누른 사람 누구 ? : ', receivedMessage.curUser);
      dispatch(updateReadyStatus(receivedMessage.curUser));

      // READY 한 사람 수 증가
      setReadyCount((prevCount) => prevCount + 1);

      // AI 준비 상태 설정을 3초 지연
      setTimeout(() => {
        if (readyCount + 1 === participantCount) {
          console.log('모든 참여자가 준비됨. AI 준비 시도. 비상!!');
          console.log('AI 닉네임임 : ' + receivedMessage.aiNickname)
          dispatch(updateReadyStatus(receivedMessage.aiNickname));
        }
      }, 5000); // 5초 후 실행
    }
    else if(receivedMessage.messageType=='NEXT_IDEA'){
        dispatch(nextItem());
      
    }else if(receivedMessage.messageType=='END_IDEA'){
      setTimerForStep3(true);
      setTime(0);
      Swal.fire({
        icon: "info",
        title: '구체화 단계가 마무리 되었습니다.',
        text: '다음 단계로 이동하세요',
        showCancelButton: true, // cancel버튼 보이기. 기본은 원래 없음
        confirmButtonColor: '#3085d6', // confrim 버튼 색깔 지정
        confirmButtonText: '승인', // confirm 버튼 텍스트 지정
      }).then((res)=>{
        if (res.isConfirmed){
          // 구체화 끝나고 어떻게 할지
          console.log('구체화 끝')
          setIsHistoryModalOpen(true); // 모달 열기
        }
      })
    }
  };

  const handleMessageForIndividual= async(receivedMessage)=>{
    if(receivedMessage.messageType=='STEP3_FOR_USER'){
      console.log('step3 start');
      console.log(receivedMessage.step3ForUser);
      dispatch(initVote(receivedMessage.step3ForUser));
    }
  };

  const countUpMember = () => {
      setParticipantCount((prevCount) => {
      console.log('Previous Count:', prevCount);
      return prevCount + 1;
      });    
      setIsModalVisible(true);
  };

  const countDownMember = () => {
    console.log('유저나감')
    setParticipantCount((prevCount) => Math.max(prevCount - 1, 1));
    setIsModalVisible(true);
  };

  const startMeeting = () => {
    setIsModalVisible(false);
    setIsMeetingStarted(true);
    setHideButtons(false);
  };

  const handleStartMeeting = () => {
    console.log('스타트미팅')
    console.log(roomId);
    console.log(client)
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

      if(step=='STEP_2'){
        step3start();
      }
    }
    console.log('Next Step Btn Clicked')
  };  

  const handlePassButtonClick = () =>  {
    if (client) {
      // 사용자 패스 정보 전송
      
      console.log("직접적으로 패스를 누르는 사용자",curUser);
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

  const handlepassSent = () => {
    
    handlePassButtonClick();
    
  }

  const handleVoteSent = () => {
    dispatch(step1EndAlarm());
  };

  const step1EndAlarm = () => async (dispatch, getState) => {
    try {
      console.log('투표진행')
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
          console.log(voteResults)
          setVoteResults(voteResults);
          setIsVoteModalOpen(true); // 모달 열기
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
      console.log(response.data)
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

  const handleNextIdeaClick=()=>{
      if (client) {
        client.publish({
          destination: `/app/next.idea.${roomId}`,
          headers: {
            'Authorization': localStorage.getItem('roomToken')  // 예: 인증 토큰
          },
          body:JSON.stringify({'curIndex':curIndex})
          
        });
      }
  }

  
  return (
    
    <div className="conference">
      {isVoteModalOpen && (
        <VoteResultsModal 
          voteResults={voteResults} 
          onClose={() => setIsVoteModalOpen(false)} 
        />
      )}
      {isHistoryModalOpen && (
        <MiddlePage
          onClose={() => setIsHistoryModalOpen(false)} 
          roomId={roomId}
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
                  <Timer time={time} voteSent={handleVoteSent} passSent={handlepassSent} nextIdea={handleNextIdeaClick} timerStop={timerForStep3}/>
                </div>
                {role === 'host' && ( // 호스트일 때만 버튼 표시
                  <div className="action-buttons-container">
                    <Button onClick={handleReadyButtonClick} ariaLabel="Ready">
                      <img src={ReadyIcon} alt="Ready" className="action-icon" />
                    </Button>
                    <Button onClick={handlePassButtonClick} ariaLabel="Skip" disabled={curUser !== nickname}>
                      <img src={SkipIcon} alt="Skip" className="action-icon" />
                    </Button>

                    <Button onClick={handleNextStepClick} ariaLabel="Next">
                      <img src={NextIcon} alt="Next" className="action-icon" />
                    </Button>
                    <Button onClick={handleNextIdeaClick} ariaLabel="Next">
                      <img src={NextIcon} alt="투표정보 가져오기" className="action-icon" />
                    </Button>
                  </div>
                )}
                {role !== 'host' && ( // 호스트일 때만 버튼 표시
                  <div className="action-buttons-container">
                    <Button onClick={handleReadyButtonClick} ariaLabel="Ready">
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
