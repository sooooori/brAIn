import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import WaitingModal from './components/WaitingModal';
import ConferenceNavbar from '../../components/Navbar/ConferenceNavbar';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Conference = () => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [participantCount, setParticipantCount] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [roomId, setRoomId] = useState(null);
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [roundRobinBoard,setRoundRobinBoard]=useState([]);
  const [round,setRound]=useState(0);

  //현재 제출자
  const [curUser,setCurUser]=useState("");

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

  const handleMessage = (receivedMessage) => {
    if (receivedMessage.type === 'ENTER_WAITING_ROOM') {
      countUpMember();
    }else if(receivedMessage.type==='SUBMIT_POST_IT'){
      roundRobinBoardUpdate(receivedMessage);
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


  const roundRobinBoardUpdate=(postit)=>{
    
    setRoundRobinBoard((prevRoundRobinBoard)=>{
      const roundRobinBoard=[...prevRoundRobinBoard];
      if(roundRobinBoard[postit.curRound]){
        roundRobinBoard[postit.curRound]=[...roundRobinBoard[postit.curRound],postit.content];
      }else{
        roundRobinBoard[postit.curRound]=[postit.content];
      }

      return roundRobinBoard;
    })

    if(round!==postit.nextRound){
      setRound(postit.nextRound);
    }

    setCurUser(postit.nextUser);
  }

  //라운드 로빈 포스트잇 제출
  const attachPostitOnRoundBoard=(content)=>{
    if(client){
      const postit={
        round:round,
        content:content,
      }

      client.publish({
        destination:`/app/step1.submit.${roomId}`,
        headers:{Authorization:localStorage.getItem('roomToken')},
        body:JSON.stringify(postit)
      });
    }
  }

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
