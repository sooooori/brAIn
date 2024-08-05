import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Client } from '@stomp/stompjs';
import { setUsers } from '../../../features/conference/conferenceSlice';
import axios from '../../../utils/Axios';
import './MemberList.css';

const MemberList = ({ roomId }) => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.conference.users); // Redux에서 사용자 정보 가져오기
  const [currentPage, setCurrentPage] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const usersPerPage = 6;

  // WebSocket 클라이언트 설정
  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://localhost/ws',
      connectHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken') // 적절한 인증 헤더 설정
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log('Connected: ' + frame);
      client.subscribe(`/topic/state.user.pass.${roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        if (receivedMessage.type === 'PASS') {
          setCurrentUser(receivedMessage.curUser);
        }
      });

      client.subscribe(`/topic/start.conferences.${roomId}`, (message) => {
        const receivedMessage = JSON.parse(message.body);
        if (receivedMessage.type === 'START_CONFERENCE') {
          dispatch(setUsers(receivedMessage.users));
        }
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
    };

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [dispatch, roomId]);

  // 현재 차례인 사용자의 페이지를 설정
  useEffect(() => {
    if (users.length > 0 && currentUser !== null) {
      const currentUserIndex = users.indexOf(currentUser);
      if (currentUserIndex !== -1) {
        const newPage = Math.floor(currentUserIndex / usersPerPage);
        setCurrentPage(newPage);
      }
    }
  }, [users, currentUser, usersPerPage]);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const displayUsers = users.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);

  return (
    <div className="member-list-container">
      <div className="profile-container">
        {displayUsers.map((user, index) => (
          <div
            key={index}
            className={`profile ${user === currentUser ? 'highlighted' : ''}`} // 현재 차례인 사용자 강조
          >
            <img src={`https://brain-content-profile.s3.ap-northeast-2.amazonaws.com/random-profile/${user}.png`} alt={`${user}'s profile`} />
            <p>{user}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</button>
      </div>
    </div>
  );
};

export default MemberList;
