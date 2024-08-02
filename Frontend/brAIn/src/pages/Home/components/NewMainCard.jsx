import React, { useState } from 'react';
import './MainCard.css'; // 스타일을 정의한 CSS 파일을 임포트

const NewMainCard = ({ frontComponent, backComponent }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="perspective">
      <div className={`card ${isFlipped ? 'flipped' : ''}`}>
        <div className="card-face card-front">
          {React.cloneElement(frontComponent, { handleNewConferenceTrue: handleFlip })}
        </div>
        <div className="card-face card-back">
          {React.cloneElement(backComponent, { handleNewConferenceFalse: handleFlip })}
        </div>
      </div>
    </div>
  );
};

export default NewMainCard;
