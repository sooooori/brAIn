import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from '../../../utils/Axios';
import './ConferenceHistoryModal.css';

const ConferenceHistoryModal = ({ conferenceId, onClose }) => {
  const [conferenceDetails, setConferenceDetails] = useState(null);

  useEffect(() => {
    const fetchConferenceDetails = async () => {
      try {
        const response = await axios.get(`http://localhost/api/v1/conferences/history/${conferenceId}`);
        setConferenceDetails(response.data);
      } catch (error) {
        console.error('Error fetching conference details:', error);
      }
    };

    fetchConferenceDetails();
  }, [conferenceId]);

  if (!conferenceDetails) {
    return <div className="conference-history-modal">Loading...</div>;
  }

  const { subject, totalTime, members, conclusion } = conferenceDetails;

  return (
    <div className="conference-history-modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{subject}</h2>
        <p>회의 주제: {subject}</p>
        <p>회의 요약: {conclusion || '요약이 없습니다.'}</p>
        <p>총 시간: {new Date(totalTime).toLocaleString()}</p>
        <h3>참가자 목록</h3>
        <ul>
          {members.map(member => (
            <li key={member.memberId}>
              이름: {member.name} (역할: {member.role})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ConferenceHistoryModal.propTypes = {
  conferenceId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ConferenceHistoryModal;
