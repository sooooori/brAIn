import React from 'react';
import './VoteResultsModal.css';

const VoteResultsModal = ({ voteResults, onClose }) => {
  return (
    <div className="modal">
      <div className="vote-modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>투표 결과</h2>
        <div id="results-container">
          {voteResults.map((vote, index) => (
            <p key={index}>
              <span className='rank'>{index + 1}위 :</span> {vote.postIt} 
              <span className="badge">{vote.score}점</span>
            </p>
          ))}
        </div>
        <button id="close-modal-button" className="btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default VoteResultsModal;
