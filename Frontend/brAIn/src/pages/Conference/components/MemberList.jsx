import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import './MemberList.css';

const MemberList = () => {
    // Redux 상태에서 데이터 가져오기
    const users = useSelector((state) => state.user.users) || [];
    const nickname = useSelector((state) => state.user.nickname);
    const timer = useSelector((state) => state.conferenceInfo.timer); // 타이머 정보
    const curUser = useSelector((state) => state.conferenceInfo.curUser); // 현재 사용자

    const [currentPage, setCurrentPage] = useState(0);
    const usersPerPage = 6;

    useEffect(() => {
        if (users.length > 0 && curUser) {
            const currentUserIndex = users.indexOf(curUser);
            if (currentUserIndex !== -1) {
                const newPage = Math.floor(currentUserIndex / usersPerPage);
                setCurrentPage(newPage);
            }
        }
    }, [users, curUser, usersPerPage]);

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
                        className={`profile ${user === curUser ? 'highlighted' : ''}`} // 현재 차례인 사용자 강조
                    >
                        <img
                            src={`https://brain-content-profile.s3.ap-northeast-2.amazonaws.com/random-profile/${user}.png`}
                            alt={`${user}'s profile`}
                        />
                        <p>{user}</p>
                    </div>
                ))}
            </div>
            <div className="pagination">
                <button onClick={handlePreviousPage} disabled={currentPage === 0}>Previous</button>
                <button onClick={handleNextPage} disabled={currentPage === totalPages - 1}>Next</button>
            </div>
            <div className="timer-info">
                <p>Time Remaining: {timer}</p>
            </div>
        </div>
    );
};

export default MemberList;
