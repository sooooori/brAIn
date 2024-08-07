import React, { useEffect, useState, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import './MemberList.css';

const MemberList = () => {
    const users = useSelector((state) => state.user.users) || [];
    const curUser = useSelector(state => state.user.currentUser)
    const timer = useSelector((state) => state.conferenceInfo.timer);
    const nickname = useSelector(state => state.user.nickname);

    const [currentPage, setCurrentPage] = useState(0);
    const usersPerPage = 6;

    const updateCurrentPage = useCallback(() => {
        if (users.length > 0 && curUser) {
            const currentUserIndex = users.findIndex(user => user.nickname === curUser.nickname);
            if (currentUserIndex !== -1) {
                setCurrentPage(Math.floor(currentUserIndex / usersPerPage));
            }
        }
    }, [users, curUser, usersPerPage]);

    useEffect(() => {
        updateCurrentPage();
    }, [updateCurrentPage]);

    const totalPages = Math.ceil(users.length / usersPerPage);

    const handleNextPage = useCallback(() => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages - 1));
    }, [totalPages]);

    const handlePreviousPage = useCallback(() => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
    }, []);

    // const displayUsers = users.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);

    return (
        <div className="member-list-container">
            <div className="profile-container">
                {users.map((user) => (
                    <div
                        key={user.id} // 고유한 ID를 사용하는 것이 좋습니다
                        className={`profile ${user.nickname == curUser ? 'highlighted' : ''}`}
                    >
                        {user.nickname === nickname && <p>Me</p>}
                        <img
                            src={`https://brain-content-profile.s3.ap-northeast-2.amazonaws.com/conference-image/${user.nickname.split(' ').pop()}.png`}
                            alt={`${user.nickname.split(' ').pop()}`}
                        />
                        <p>{user.nickname}</p>
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
