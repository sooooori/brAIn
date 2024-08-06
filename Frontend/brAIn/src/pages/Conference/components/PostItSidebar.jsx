import React, { useEffect, useRef } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './PostItSidebar.css'; // 스타일을 위한 CSS 파일

const PostItSidebar = ({ notes, isVisible, onClose }) => {
  const sidebarRef = useRef(null);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div ref={sidebarRef} className={`postit-sidebar ${isVisible ? 'visible' : ''}`}>
      <div className="sidebar-header">
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </div>
      <h2>Saved Notes</h2>
      <div className="notes-list">
        {notes.map((note, index) => (
          <div key={index} className="note">
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostItSidebar;
