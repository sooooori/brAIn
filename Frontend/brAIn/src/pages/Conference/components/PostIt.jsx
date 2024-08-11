// PostIt.js
import React, { useState } from 'react';
import axios from 'axios';
import './PostIt.css';

const PostIt = ({ content, key, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(content);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/v1/postIts/${key}`, { content: newContent });
      onUpdate(key, newContent); // 상위 컴포넌트에 업데이트 알리기
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post-it:', error);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setNewContent(content);
  };

  const handleDeleteClick = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/v1/postIts/${key}`);
      onDelete(key); // 상위 컴포넌트에 삭제 알리기
    } catch (error) {
      console.error('Error deleting post-it:', error);
    }
  };

  return (
    <div className="post-it" style={{ backgroundColor: getPostItColor(key) }}>
      {isEditing ? (
        <div className="post-it-editor">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button onClick={handleSaveClick}>저장</button>
          <button onClick={handleCancelClick}>취소</button>
        </div>
      ) : (
        <div className="post-it-content">
          {content}
          <button onClick={handleEditClick} className="edit-button">수정</button>
          <button onClick={handleDeleteClick} className="delete-button">삭제</button>
        </div>
      )}
    </div>
  );
};

const getPostItColor = (key) => {
  const postItColors = ['#f9e79f', '#f5b7b1', '#a2d9ce', '#f7c6c7', '#d5dbdb'];
  return postItColors[key % postItColors.length];
};

export default PostIt;
