import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import axios from '../../../utils/Axios';
import axios from 'axios';
import './ConferenceHistoryModal.css';
import { useSelector } from 'react-redux';

const ConferenceHistoryModal = ({ isOpen, conferenceId, onClose }) => {
  const [conferenceDetails, setConferenceDetails] = useState(null);
  const accessToken = useSelector((state) => state.auth.accessToken);
  
  const id = conferenceId;
  
  useEffect(() => {
    if (id) {
      const fetchConferenceDetails = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/conferences/history/${id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          console.log("API Response:", response);
          setConferenceDetails(response.data);
        } catch (error) {
          console.error('Error fetching conference details:', error);
        }
      };

      fetchConferenceDetails();
    }
  }, [id, accessToken]);

  if (!isOpen) return null;

  if (!conferenceDetails) {
    return <div className="conference-history-modal">Loading...</div>;
  }

  const { subject, totalTime, members, conclusion } = conferenceDetails;

  return (
    <div className="modal-overlay">
      <div className="conference-history-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-content">
          <div className="modal-section">
            <h2>회의 주제</h2>
            <div className="info-box">
              {subject}
            </div>
          </div>

          <div className="modal-section">
            <h2>회의 정보</h2>
            <div className="info-box">
              <p>회의 시간: {new Date(totalTime).toLocaleString()}</p>
              <p>참여 인원: {members.length} 명</p>
              <p>참가자: {members.map(member => member.name).join(', ')}</p>
            </div>
          </div>

          <div className="modal-section">
            <h2>회의 요약</h2>
            <div className="info-box">
              {conclusion || '요약이 없습니다.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ConferenceHistoryModal.propTypes = {
  conferenceId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default ConferenceHistoryModal;
