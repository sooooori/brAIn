import React from 'react';
import './PostIt.css';

const VotedPostItItem = ({ postIt, provided, handleDelete }) => {
  return (
    <div
      className="voted-post-it"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <button className="delete-button" onClick={() => handleDelete(postIt.id)}>x</button>
      {postIt.content}
    </div>
  );
};

export default VotedPostItItem;
