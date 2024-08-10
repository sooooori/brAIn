import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import axios from '../../../utils/Axios';
import './WaitingModal.css';

const WaitingModal = ({ isVisible, participantCount, secureId, onClose, onStartMeeting, client }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conferenceCode, setConferenceCode] = useState(null);
  const [conferenceSubject, setConferenceSubject] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  const navigate = useNavigate();
  const role = useSelector((state) => state.conference.role); // Get role from Redux

  useEffect(() => {
    const fetchData = async () => {
      if (isVisible) {
        setLoading(true);
        setError(null);

        try {
          const token = localStorage.getItem('authToken');
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/conferences`, {
            params: { secureId },
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          setConferenceCode(response.data.inviteCode);
          setConferenceSubject(response.data.subject || 'No subject available');
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to load data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isVisible, secureId,participantCount]);

  const handleShareCode = () => {
    navigator.clipboard.writeText(conferenceCode);
    setIsSharing(true);
    setTimeout(() => setIsSharing(false), 2000); // Reset share status after 2 seconds
  };

  const handleClose = () => {
    navigate('/'); // Redirect to Home page
  };

  if (!isVisible) return null;

  return (
    <div className="waiting-modal">
      <div className="waiting-modal-content">
        {loading ? (
          <div className="loading-overlay">
            <p>Loading...</p>
          </div>
        ) : (
          <>
            <h2>회의 주제: {conferenceSubject}</h2>
            <p>현재 참여 인원: {participantCount}</p>
            {error && <p className="error">{error}</p>}
            {conferenceCode && (
              <div className="waiting-modal-code">
                <div className="conference-code-container">
                  <span className="conference-code">참여 코드 : {conferenceCode}</span>
                  <Button
                    type="fit"
                    onClick={handleShareCode}
                    buttonStyle="blue"
                    ariaLabel="Share conference code"
                    className="waiting-modal-code-button"
                  >
                    {isSharing ? 'Copied!' : 'Share Code'}
                  </Button>
                </div>
              </div>
            )}
            <div className="waiting-modal-footer">
              <Button
                type="fit"
                onClick={handleClose}
                buttonStyle="red"
                ariaLabel="Cancel"
                className="waiting-modal-button waiting-modal-button-cancel"
              >
                Cancel
              </Button>
              {role === 'host' && (
                <Button
                  type="fit"
                  onClick={onStartMeeting}
                  buttonStyle="black"
                  ariaLabel="Start Meeting"
                  className="waiting-modal-button waiting-modal-button-start"
                >
                  Start Meeting
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WaitingModal;
