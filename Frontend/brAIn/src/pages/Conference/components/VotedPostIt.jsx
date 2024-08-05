import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './VotedPostIt.css';

const VotedPostIt = () => {
  const [votedPostIts, setVotedPostIts] = useState([]);

  useEffect(() => {
    const fetchVotedPostIts = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost/api/v1/votes', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setVotedPostIts(response.data.votedPostIts || []);
      } catch (error) {
        console.error('Error fetching voted post-its:', error);
      }
    };

    fetchVotedPostIts();
  }, []);

  return (
    <div className="voted-post-it-container">
      <h2>내가 투표한 포스트잇</h2>
      <div className="voted-post-it-list">
        {votedPostIts.map((postIt) => (
          <div key={postIt.id} className="voted-post-it">
            {postIt.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotedPostIt;
