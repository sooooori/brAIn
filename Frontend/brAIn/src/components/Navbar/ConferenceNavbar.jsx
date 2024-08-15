import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ConferenceNavbar.css';
import { Avatar, Popover, Box, CircularProgress } from '@mui/material';
import exitIcon from '../../assets/svgs/exit_conference.svg'; // SVG 경로 수정
import settingsIcon from '../../assets/svgs/setting.svg'; // SVG 경로 수정
import Button from '../Button/Button';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import {resetNotes} from '../../features/note/noteSlice'
import { resetItems } from '../../actions/votedItemAction';

const ConferenceNavbar = ({client}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [conferenceCode, setConferenceCode] = useState(null);
  const [conferenceSubject, setConferenceSubject] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const open = Boolean(anchorEl);
  const id = open ? 'profile-popover' : undefined;
  const { secureId: routeSecureId } = useParams();
  const role = useSelector((state) => state.conference.role);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/conferences`, {
          params: { secureId:routeSecureId },
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setConferenceCode(response.data.inviteCode);
        setConferenceSubject(response.data.subject || 'No subject available');
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [routeSecureId]);

  const handleShareCode = () => {
    navigator.clipboard.writeText(conferenceCode);
    setIsSharing(true);
    setTimeout(() => setIsSharing(false), 2000);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLeaveConference = () => {

    dispatch(resetNotes());
    dispatch(resetItems());
    navigate('/'); // Redirect to Home page

    
  };

  const handleSettings = () => {
    console.log('Opening conference settings...');
  };

  return (
    <nav className="conference-navbar">
      <div className="conference-navbar-logo">
        {!logoLoaded && <CircularProgress size={24} className="logo-spinner" />}
        <img
          className={`logo-img ${logoLoaded ? 'loaded' : ''}`}
          src="/images/brAIn_2.png"
          alt="brAIn"
          onLoad={() => setLogoLoaded(true)}
        />
        <span className='service-name'>BrAIn</span>
      </div>
      <div className="conference-navbar-info">
        <h2 className="conference-navbar-subject">{conferenceSubject}</h2>
        {conferenceCode && (
          <div className="conference-navbar-code">
            <pre>{conferenceCode}</pre>
            <Button
              type="fit"
              onClick={handleShareCode}
              buttonStyle="blue"
              ariaLabel="Share conference code"
              className="conference-navbar-code-button"
            >
              {isSharing ? 'Copied!' : 'Share Code'}
            </Button>
          </div>
        )}
      </div>
      <div className="conference-navbar-buttons">
        {role === 'host' && (
          <Button
            type="fit"
            buttonStyle="gray"
            onClick={handleSettings}
            ariaLabel="Conference Settings"
            className="conference-navbar-button conference-navbar-settings-button"
          >
            <img src={settingsIcon} alt="Settings" className="icon-svg" />
          </Button>
        )}
        <Button
          type="fit"
          buttonStyle="red"
          onClick={handleLeaveConference}
          ariaLabel="Leave Conference"
          className="conference-navbar-button conference-navbar-leave-button"
        >
          <img src={exitIcon} alt="Exit" className="icon-svg" />
        </Button>
        <Avatar
          src={user?.photo || ""}
          alt="Profile"
          onClick={handleClick}
          className="user-avatar"
        />
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Box className="modal-content">
            <div className="user-info">
              <Avatar src={user?.photo || ""} alt="Profile" className="user-img-large" />
              <div className="user-details">
                <p className="user-name">{user?.name}</p>
                <p className="user-email">{user?.email}</p>
              </div>
            </div>
          </Box>
        </Popover>
      </div>
    </nav>
  );
};

export default ConferenceNavbar;
