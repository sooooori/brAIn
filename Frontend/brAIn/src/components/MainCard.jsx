import React, { useState } from 'react';
import './MainCard.css';

const MainCard = ({ frontComponent, backComponent }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="perspective">
      <div className={`card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="card-face card-front">
          {frontComponent}
        </div>
        <div className="card-face card-back">
          {backComponent}
        </div>
      </div>
    </div>
  );
};

export default MainCard;
