// WaitingModal.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests
import './WaitingModal.css'; // Import your CSS for styling

const WaitingModal = ({ isVisible, participantCount, secureId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conferenceCode, setConferenceCode] = useState(null); // State for storing the fetched data

  useEffect(() => {
    const fetchData = async () => {
      if (isVisible) {
        setLoading(true);
        setError(null); // Reset error state

        try {
          // Construct the URL with the secureId
          const response = await axios.get(`http://localhost/api/v1/conferences`, {
            params: { secureId }
          });
          setConferenceCode(response.data.inviteCode); // Update state with the fetched data
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to load data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [isVisible, secureId]); // Re-run the effect if isVisible or secureId changes

  if (!isVisible) return null; // Don't render the modal if it's not visible

  return (
    <div className="waiting-modal">
      <div className="waiting-modal-content">
        <h2>Waiting Room</h2>
        <p>Current Participants: {participantCount}</p>
        {loading && <p>Loading data...</p>}
        {error && <p className="error">{error}</p>}
        {conferenceCode && (
          <div>
            {/* Render your data here */}
            <pre>{JSON.stringify(conferenceCode, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingModal;
