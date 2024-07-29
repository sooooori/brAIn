import React, { useState } from 'react';
import JoinConferenceFront from '../components/JoinConferenceFront';
import JoinConferenceBack from '../components/JoinConferenceBack';

const Home = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [codeInputs, setCodeInputs] = useState(Array(6).fill(''));

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-80 h-96 perspective">
        <div className={`relative w-full h-full transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="absolute w-full h-full backface-hidden">
            <JoinConferenceFront onFlip={handleFlip} />
          </div>
          <div className="absolute w-full h-full backface-hidden rotate-y-180">
            <JoinConferenceBack onFlip={handleFlip} codeInputs={codeInputs} setCodeInputs={setCodeInputs} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
