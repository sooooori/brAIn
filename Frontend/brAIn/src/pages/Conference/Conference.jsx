
import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import { v4 as uuidv4 } from 'uuid';
import WaitingModal from './components/WaitingModal';

const Conference = () => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(0); // Participant count
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility state

  useEffect(() => {
    const newClient = new Client({
      brokerURL: 'ws://localhost:8080/ws', // WebSocket URL
      connectHeaders: {
        login: 'user',
        passcode: 'password',
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
      newClient.subscribe(`/topic/room.*`, (message) => {
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

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [client]);

  // Function to update participant count and show modal
  const countUpMember = () => {
    setParticipantCount((prevCount) => prevCount + 1);
    setIsModalVisible(true);
    setTimeout(() => setIsModalVisible(false), 3000); // Hide modal after 3 seconds
  };

  return (
    <div>
        222222222222222222
    </div>
    // <div className="waiting-room">
    //   <WaitingModal isVisible={isModalVisible} participantCount={participantCount} />
    // </div>
  );
};

export default Conference;
