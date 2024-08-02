import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import WaitingModal from './components/WaitingModal';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Conference = () => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const { secureId } = useParams();

  // Fetch roomId when secureId changes
  useEffect(() => {
    const fetchRoomId = async () => {
      try {
        const response = await axios.get('http://localhost/api/v1/conferences', {
          params: { secureId },
        });
        console.log('Fetched roomId:', response.data.roomId);
        setRoomId(response.data.roomId);
      } catch (error) {
        console.error('Failed to fetch roomId:', error);
      }
    };

    fetchRoomId();
  }, [secureId]);

  // Set up WebSocket connection when roomId changes
  useEffect(() => {
    if (roomId === null) return;

    const newClient = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      connectHeaders: {
        login: 'user',
        passcode: 'password',
      },
      debug: (str) => {
        console.log('WebSocket Debug:', str);
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
        console.log('Received message:', receivedMessage);

        if (receivedMessage.type === 'ENTER_WAITING_ROOM') {
          countUpMember();
        }
      });
    };

    newClient.onStompError = (frame) => {
      console.error('STOMP error:', frame);
    };

    setClient(newClient);
    newClient.activate();

    return () => {
      if (newClient) {
        newClient.deactivate();
      }
    };
  }, [roomId]);

  // Show modal when roomId is fetched and WebSocket is connected
  useEffect(() => {
    if (roomId && connected) {
      setIsModalVisible(true);
    }
  }, [roomId, connected]);

  const countUpMember = () => {
    setParticipantCount((prevCount) => prevCount + 1);
    setIsModalVisible(true);
    setTimeout(() => setIsModalVisible(false), 3000);
  };

  return (
    <div className="waiting-room">
      <WaitingModal
        isVisible={isModalVisible}
        participantCount={participantCount}
        secureId={secureId}
      />
    </div>
  );
};

export default Conference;
