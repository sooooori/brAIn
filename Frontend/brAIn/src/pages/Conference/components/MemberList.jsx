import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import './MemberList.css';

const MemberList = () => {
    const users = useSelector((state) => state.user.users) || [];
    const curUser = useSelector((state) => state.user.currentUser);
    const nickname = useSelector((state) => state.user.nickname);
    const passStatus = useSelector((state) => state.user.passStatus);

    const [currentPage, setCurrentPage] = useState(0);
    const usersPerPage = 6;

    useEffect(() => {
        console.log('Pass Status:', passStatus);
      }, [passStatus]);

    const updateCurrentPage = useCallback(() => {
        if (users.length > 0 && curUser) {
            const currentUserIndex = users.findIndex(
                (user) => user.nickname === curUser
            );
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
        document.querySelector('.profile-container').scrollBy({ left: 180 * usersPerPage, behavior: 'smooth' });
    }, [totalPages, usersPerPage]);

    const handlePreviousPage = useCallback(() => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
        document.querySelector('.profile-container').scrollBy({ left: -180 * usersPerPage, behavior: 'smooth' });
    }, [usersPerPage]);

    const startIndex = currentPage * usersPerPage;
    const displayedUsers = users.slice(startIndex, startIndex + usersPerPage);

    return (
        <div className="carousel-container">
            <button 
                className="scroll-button left" 
                onClick={handlePreviousPage} 
                disabled={currentPage === 0}
            >
                &lt;
            </button>
            <div className="carousel">
                <div className="profile-container">
                    {displayedUsers.map((user) => (
                        <div
                            key={user.id || user.nickname}
                            className={`profile ${
                                user.nickname === curUser ? 'highlighted' : ''}`}
                        >
                            {user.nickname === nickname && <p>Me</p>}
                            {passStatus[user.nickname] && (
                                <span className="pass-indicator">PASS</span>
                            )}
                            <img
                                src={`https://brain-content-profile.s3.ap-northeast-2.amazonaws.com/conference-image/${user.nickname.split(' ').pop()}.png`}
                                alt={`${user.nickname.split(' ').pop()}`}
                            />
                            <p>{user.nickname}</p>
                        </div>
                    ))}
                </div>
            </div>
            <button 
                className="scroll-button right" 
                onClick={handleNextPage} 
                disabled={currentPage === totalPages - 1}
            >
                &gt;
            </button>
        </div>
    );
};

export default MemberList;
