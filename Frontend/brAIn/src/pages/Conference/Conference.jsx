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
import './ConferenceEx.css';

const Conference = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.conference.role);
  const secureId = useSelector((state) => state.conference.secureId);

  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [notes, setNotes] = useState([]);
  const [showNotes, setShowNotes] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  
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

        localStorage.setItem('roomToken', response.data.jwtForRoom);
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

        newClient.onConnect = (frame) => {
          setConnected(true);
          console.log('Connected: ' + frame);
          newClient.subscribe(`/topic/room.${roomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            handleMessage(receivedMessage);
          });

          newClient.subscribe(`/topic/start.conferences.${roomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            console.log('Received message to start conference:', receivedMessage);

            if (receivedMessage.type === 'START_MEETING') {
              startMeeting();
            }
          });

          newClient.subscribe(`/topic/notes.${roomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            setNotes(prevNotes => [...prevNotes, receivedMessage]);
          });
        };

        newClient.onStompError = (frame) => {
          console.error('STOMP error:', frame);
        };

        setClient(newClient);
        newClient.activate();

        if (isMounted && !connected) {
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
  }, [routeSecureId, connected, isConnecting]);

  const handleMessage = (receivedMessage) => {
    if (receivedMessage.type === 'ENTER_WAITING_ROOM') {
      countUpMember();
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
        destination: `/topic/start.conferences.${roomId}`,
        body: JSON.stringify({ type: 'START_MEETING' }),
      });
      startMeeting();
    }
  };

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
  };

  const handlePassButtonClick = () => {
    // Implement logic for "Pass" button click
    console.log('Pass button clicked');
  };

  return (
    <div className="conference">
      {isMeetingStarted && <ConferenceNavbar secureId={routeSecureId} />}
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
            />
          </div>
          <div className="main-content">
            <VotedPostIt />
            <div className="whiteboard-section">
              <div className="conf-timer-container">
                <Timer />
              </div>
              <div className="whiteboard-container">
                <WhiteBoard subject="안녕" />
              </div>
              <div className="action-buttons-container">
                <Button
                  onClick={handleReadyButtonClick}
                  buttonStyle="purple"
                  ariaLabel="Ready Button"
                  className="action-button ready-button"
                >
                  <span>준비 완료</span>
                </Button>
                {role !== 'host' && (
                  <>
                    <Button
                      onClick={handleNextStepClick}
                      buttonStyle="purple"
                      ariaLabel="Next Step Button"
                      className="action-button next-step-button"
                    >
                      <span>다음 단계</span>
                    </Button>
                    <Button
                      onClick={handlePassButtonClick}
                      buttonStyle="purple"
                      ariaLabel="Pass Button"
                      className="action-button pass-button"
                    >
                      <span>패스하기</span>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Conference;
