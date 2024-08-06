import React, { useEffect, useState, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import './MemberList.css';

const MemberList = memo(() => {
    const users = useSelector((state) => state.user.users) || [];
    const curUser = useSelector((state) => state.conferenceInfo.curUser);
    const timer = useSelector((state) => state.conferenceInfo.timer);

    const [currentPage, setCurrentPage] = useState(0);
    const usersPerPage = 6;

    const updateCurrentPage = useCallback(() => {
        if (users.length > 0 && curUser) {
            const currentUserIndex = users.findIndex(user => user === curUser);
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

    const displayUsers = users.slice(currentPage * usersPerPage, (currentPage + 1) * usersPerPage);

    return (
        <div className="member-list-container">
            <div className="profile-container">
                {displayUsers.map((user, index) => (
                    <div
                        key={index}
                        className={`profile ${user === curUser ? 'highlighted' : ''}`}
                    >
                        {/* <img
                            src={`https://brain-content-profile.s3.ap-northeast-2.amazonaws.com/random-profile/${user.nickname}.png`}
                            alt={`${user}'s profile`}
                        /> */}
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
});

export default MemberList;