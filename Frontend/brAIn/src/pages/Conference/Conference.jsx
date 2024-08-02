import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { v4 as uuidv4 } from 'uuid';
import WaitingModal from './components/WaitingModal';
import axios from 'axios';

const Conference = () => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0); // Participant count
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state
  const [roomId, setRoomId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { secureId } = useParams();
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
        localStorage.setItem('roomToken',response.data.jwtForRoom);
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
        };

        // Handle WebSocket connection errors
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


    if (!connected) {
      fetchDataAndConnect();
    }
  
    return () => {
      isMounted = false;
      if (currentClient) {
        currentClient.deactivate();
      }
    };
  }, [secureId, connected]);

  // Function to update participant count and show modal
  const countUpMember = () => {
    setParticipantCount((prevCount) => prevCount + 1);
    setIsModalVisible(true);
    setTimeout(() => setIsModalVisible(false), 3000); // Hide modal after 3 seconds
  };

  return (
    <div>
      <p>Secure ID: {secureId}</p>
    </div>
    // <div className="waiting-room">
    //   <WaitingModal isVisible={isModalVisible} participantCount={participantCount} />
    // </div>
  );

};

export default Conference;
