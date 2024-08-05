import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import PostItSidebar from './components/PostItSidebar';
import Button from '../../components/Button/Button';
import Timer from './components/Timer';
import WhiteBoard from './components/WhiteBoard';
import VotedPostIt from './components/VotedPostIt';
import SidebarIcon from '../../assets/svgs/sidebar.svg';


import './ConferenceEx.css';

const ConferenceEx = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.conference.role);
  const secureId = useSelector((state) => state.conference.secureId);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [notes, setNotes] = useState([]);
  const [conferenceSubject, setConferenceSubject] = useState('');
  
  useEffect(() => {
    const fetchConferenceSubject = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost/api/v1/conferences', {
          params: { secureId },
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setConferenceSubject(response.data.subject || 'No subject available');
      } catch (error) {
        console.error('Error fetching conference subject:', error);
      }
    };

    fetchConferenceSubject();
  }, [secureId]);

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarVisible(false);
  };

  const handleReadyButtonClick = () => {
    // Implement logic for "Ready" button click
  };

  const handleNextStepClick = () => {
    // Implement logic for "Next Step" button click
  };

  const handlePassButtonClick = () => {
    // Implement logic for "Pass" button click
    console.log('Pass button clicked');
  };

  return (
    <div className="conference">
      <div className="sidebar-container">
        <Button
          type="fit"
          onClick={toggleSidebar}
          buttonStyle="black"
          ariaLabel="Toggle Sidebar"
          className="toggle-sidebar-button"
        >
          <img src={SidebarIcon} alt="Sidebar Toggle" className="sidebar-icon" />
        </Button>
        <PostItSidebar
          notes={notes}
          isVisible={isSidebarVisible}
          onClose={handleCloseSidebar}
        />
      </div>
      <div className="main-content">
        <VotedPostIt />
        <div className="whiteboard-section">
          <div className="conf-timer-container">
            <Timer />
          </div>
          <div className="whiteboard-container">
            <WhiteBoard subject={conferenceSubject} />
          </div>
          <div className="action-buttons-container">
            <Button
              onClick={handleReadyButtonClick}
              buttonStyle="purple"
              ariaLabel="Ready Button"
              className="action-button ready-button"
            >
              <span>준비 완료</span>
            </Button>
            {role !== 'host' && (
              <>
                <Button
                  onClick={handleNextStepClick}
                  buttonStyle="purple"
                  ariaLabel="Next Step Button"
                  className="action-button next-step-button"
                >
                  <span>다음 단계</span>
                </Button>
                <Button
                  onClick={handlePassButtonClick}
                  buttonStyle="purple"
                  ariaLabel="Pass Button"
                  className="action-button pass-button"
                >
                  <span>패스하기</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConferenceEx;
