import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import './MemberList.css';
import Button from '../../../components/Button/Button'; // Assuming you are using a custom Button component

const MemberList = () => {
    const users = useSelector((state) => state.user.users) || [];
    const curUser = useSelector(state => state.user.currentUser);
    const profileContainerRef = useRef(null);

    // Function to scroll the container to the left
    const scrollLeft = () => {
        if (profileContainerRef.current) {
            profileContainerRef.current.scrollLeft -= profileContainerRef.current.clientWidth / 2;
        }
    };

    // Function to scroll the container to the right
    const scrollRight = () => {
        if (profileContainerRef.current) {
            profileContainerRef.current.scrollLeft += profileContainerRef.current.clientWidth / 2;
        }
    };

    // Find the index of the current user
    const curUserIndex = users.findIndex(user => user.nickname === curUser);
    // Calculate the start index for the visible members
    const startIndex = Math.max(0, curUserIndex - 3);  // Show 3 members before the current user
    // Slice the users array to get the visible members
    const visibleUsers = users.slice(startIndex, startIndex + 6);

    return (
        <div className="carousel-container">
            <Button className="scroll-button left" onClick={scrollLeft}>‹</Button>
            <div className="carousel">
                <div className="profile-container" ref={profileContainerRef}>
                    {visibleUsers.map((user) => (
                        <div
                            key={user.id}
                            className={`profile ${user.nickname === curUser ? 'highlighted' : ''}`}
                        >
                            <img
                                src={`https://brain-content-profile.s3.ap-northeast-2.amazonaws.com/conference-image/${user.nickname.split(' ').pop()}.png`}
                                alt={user.nickname.split(' ').pop()}
                            />
                            <p>
                                {user.nickname}
                                {user.nickname === curUser.nickname && ' (Me)'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <Button className="scroll-button right" onClick={scrollRight}>›</Button>
        </div>
    );
};

export default MemberList;
