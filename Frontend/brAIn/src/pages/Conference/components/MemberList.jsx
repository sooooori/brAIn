import { useEffect, useState } from 'react';
import axios from '../../../utils/Axios';

const MemberList = ({ roomId }) => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const usersPerPage = 6;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`/topic/start.conferences.${roomId}`);
        setUsers(response.data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [roomId]);

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
          <div key={index} className="profile">
            {/* 이미지 주소 수정 필요 */}
            <img src={`"https://brain-content-profile.s3.ap-northeast-2.amazonaws.com/random-profile/${user}.png"`} alt={`${user}'s profile`} />
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
