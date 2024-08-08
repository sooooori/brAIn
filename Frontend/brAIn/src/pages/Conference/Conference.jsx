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
import SkipIcon from '../../assets/svgs/skip.svg'; // 아이콘 경로
import PassIcon from '../../assets/svgs/pass.svg'; // 아이콘 경로
import NextIcon from '../../assets/svgs/next.svg'; // 아이콘 경로
import MemberList from './components/MemberList';
import Timer from './components/Timer';
import './Conference.css';

import { addUser, removeUser, setUsers, setUserNick, setCuruser } from '../../actions/userActions';
import { setCurStep, upRound, setRound } from '../../actions/conferenceActions';
import { sendToBoard } from '../../actions/roundRobinBoardAction';

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

  const users = useSelector(state => state.user.users);
  const nickname = useSelector(state => state.user.nickname);
  const step = useSelector(state => state.conferenceInfo.curStep);
  const round = useSelector(state => state.conferenceInfo.round);
  const curUser = useSelector(state => state.user.currentUser);
  const roundRobinBoard = useSelector(state => state.roundRobinBoard.roundRobinBoard);
  const { secureId: routeSecureId } = useParams();

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
            newClient.publish({ destination: '/app/pong', body: 'pong' });
          }
        };

        newClient.onConnect = (frame) => {
          setConnected(true);
          newClient.subscribe(`/topic/room.${response.data.roomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
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

  }, [routeSecureId]);

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

  const roundRobinBoardUpdate = (postit) => {
    dispatch(sendToBoard(postit.curRound, postit.content));
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
    // Implement logic for "Ready" button click
  };

  const handleNextStepClick = () => {
    if (client) {
      client.publish({
        destination: `/app/next.step.${roomId}`,
        headers: {
          'Authorization': localStorage.getItem('roomToken')
        },
        body: JSON.stringify({ step: step })
      });
    }
  };

  const handlePassButtonClick = () => {
    console.log('Pass button clicked');
  };

  const handleSkipButtonClick = () => {
    console.log('Skip button clicked');
  };

  return (
    <div className="conference">
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
              <div className="action-panel">
                <div className="voted-post-it-container">
                  {roundRobinBoard.map((postit, index) => (
                    <VotedPostIt key={index} content={postit.content} />
                  ))}
                </div>
                <div className="conf-timer-container">
                  <Timer />
                </div>
                <div className="action-buttons-container">
                  <Button onClick={handleSkipButtonClick} ariaLabel="Skip">
                    <img src={SkipIcon} alt="Skip" className="action-icon" />
                  </Button>
                  <Button onClick={handlePassButtonClick} ariaLabel="Pass">
                    <img src={PassIcon} alt="Pass" className="action-icon" />
                  </Button>
                  <Button onClick={handleNextStepClick} ariaLabel="Next">
                    <img src={NextIcon} alt="Next" className="action-icon" />
                  </Button>
                </div>
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
