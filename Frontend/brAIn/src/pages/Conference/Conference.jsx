import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import WaitingModal from './components/WaitingModal';
import ConferenceNavbar from '../../components/Navbar/ConferenceNavbar';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, removeUser, setUsers, setUserNick } from '../../actions/userActions';

import { useNavigate } from 'react-router-dom';


const Conference = () => {
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [roomId, setRoomId] = useState(null);
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const users = useSelector(state => state.user.users);
  const nickname = useSelector(state => state.user.nickname)
  const dispatch = useDispatch();
  const [isUnmounted, setIsUnmounted] = useState(false);

  const { secureId } = useParams();

  useEffect(() => {
    let isMounted = true;
    let currentClient = null;

    const fetchDataAndConnect = async () => {
      try {
        if (isConnecting) return;
        setIsConnecting(true);
        const response = await axios.post(`http://localhost/api/v1/conferences/${secureId}`, {}, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
          },
        });

        // 'roomToken'이 로컬 스토리지에 없을 때만 작업 수행
        if (!localStorage.getItem('roomToken')) {
            localStorage.setItem('roomToken', response.data.jwtForRoom);
            console.log('roomToken이 없어서 새로운 토큰을 저장했습니다.');
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
        
        newClient.onmessage = function(event) {
          if (event.data === 'ping') {
              socket.send('pong');
          }
        };

        newClient.onConnect = (frame) => {
          setConnected(true);
          console.log('Connected: ' + frame);
          newClient.subscribe(`/topic/room.${roomId}`, (message) => {
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
  }, [secureId, isConnecting]);

  useEffect(() => {
    console.log(users);
  }, [users]);


  const handleMessage = (receivedMessage) => {
    if (receivedMessage.messageType === 'ENTER_WAITING_ROOM') {
      countUpMember();
    }
    else if (receivedMessage.messageType == 'START_CONFERENCE'){
      console.log("Rldpdpdpdpdpdpdpdppd")
      dispatch(setUsers(receivedMessage.users));
    }
    else if (receivedMessage.messageType == 'ENTER_CONFERENCES'){
      dispatch(setUserNick(receivedMessage.nickname));
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
          <h1>Meeting in progress...</h1>
        </div>
      )}
    </div>
  );
};

export default Conference;
