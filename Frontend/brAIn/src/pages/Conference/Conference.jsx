// src/pages/Conference/Conference.jsx
import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import WaitingModal from './components/WaitingModal';
import ConferenceNavbar from '../../components/Navbar/ConferenceNavbar';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Conference = () => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(1); // Participant count
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [roomId, setRoomId] = useState(null);

  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const { secureId } = useParams();

  // Fetch roomId when secureId changes
  useEffect(() => {
    let isMounted = true;
    let currentClient = null;

    const fetchDataAndConnect = async () => {
      try {
        if (isConnecting) return; // 이미 연결 중이면 중단
        setIsConnecting(true);
        const response = await axios.post(`http://localhost/api/v1/conferences/${secureId}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          },
        }); // Replace with your API endpoint
        localStorage.setItem('roomToken', response.data.jwtForRoom);
        setRoomId(response.data.roomId);

        const newClient = new Client({
          brokerURL: 'ws://localhost/ws', // WebSocket URL
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

        // Set up WebSocket connection
        newClient.onConnect = (frame) => {
          setConnected(true);
          console.log('Connected: ' + frame);
          newClient.subscribe(`/topic/room.${roomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);

            if (receivedMessage.type === 'ENTER_WAITING_ROOM') {
              countUpMember();
            }
          });

          newClient.subscribe(`/topic/start.conferences.${roomId}`, (message) => {
            const receivedMessage = JSON.parse(message.body);
            console.log('Received message to start conference:', receivedMessage);

            if (receivedMessage.type === 'START_MEETING') {
              startMeeting();
            }
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
  }, [secureId, connected, isConnecting]);

  const countUpMember = () => {
    setParticipantCount((prevCount) => prevCount + 1);
    setIsModalVisible(true);
  };

  const countDownMember = () => {
    setParticipantCount((prevCount) => Math.max(prevCount - 1, 1)); // Ensure participant count does not go below 1
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

  return (
    <div className="conference">
      {isMeetingStarted && <ConferenceNavbar secureId={secureId} />}
      {!isMeetingStarted && (
        <div>
          <WaitingModal
            isVisible={isModalVisible}
            participantCount={participantCount}
            secureId={secureId}
            onClose={() => setIsModalVisible(false)}
            onStartMeeting={handleStartMeeting}
            client={client}
          />
        </div>
      )}
      {isMeetingStarted && (
        <div className="meeting">
          {/* Add your meeting-related components here */}
          <h1>Meeting in progress...</h1>
        </div>
      )}
    </div>
  );
};

export default Conference;
