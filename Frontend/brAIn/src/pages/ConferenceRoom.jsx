// ConferenceRoom.js
import React from 'react';
import { useParams } from 'react-router-dom';

const ConferenceRoom = () => {
  const { secureId } = useParams();

  return (
    <div>
      <h1>Conference Room</h1>
      <p>Secure ID: {secureId}</p>
    </div>
  );
};

export default ConferenceRoom;
