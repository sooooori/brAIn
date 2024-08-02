import React, { useState } from 'react';
import './JoinMainCard.css'; // 스타일을 정의한 CSS 파일을 임포트

const JoinMainCard = ({ frontComponent, backComponent }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="perspective">
      <div className={`card ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-face card-front">
          {React.cloneElement(frontComponent, { handleJoinConferenceTrue: handleFlip })}
        </div>
        <div className="card-face card-back">
          {React.cloneElement(backComponent, { handleJoinConferenceFalse: handleFlip })}
        </div>
      </div>
    </div>
  );
};

export default JoinMainCard;
