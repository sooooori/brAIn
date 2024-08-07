import React, { useState } from 'react';
import axios from 'axios';
import PostIt from './PostIt';
import './WhiteBoard.css';
import { useSelector } from 'react-redux';
import PostItTest from './PostItTest';

const WhiteBoard = ({ subject, onSubmitClick }) => {
  const [ideas, setIdeas] = useState([]);
  const token = localStorage.getItem('authToken'); // 인증 토큰 가져오기
  const currentStep = useSelector((state) => state.conference.currentStep); // Redux에서 currentStep 가져오기
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddIdea = async (e) => {
    e.preventDefault();
    const newIdea = inputValue.trim();

    if (newIdea) {
      try {
        const response = await axios.post('http://localhost/api/v1/postIts', {
          content: newIdea,
        }, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const { message, key } = response.data;

        if (key) {
          setIdeas([...ideas, { content: message, key }]);
          setInputValue(''); // 입력 필드 초기화
        } else {
          console.error('No key returned from server');
        }
      } catch (error) {
        console.error('Error saving post-it:', error);
      }
    }
  };

  const handleDeleteIdea = async (key) => {
    try {
      await axios.delete(`http://localhost/api/v1/postIts/${key}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setIdeas(ideas.filter((idea) => idea.key !== key));
    } catch (error) {
      console.error('Error deleting post-it:', error);
    }
  };

  const handleUpdateIdea = async (key, newContent) => {
    try {
      await axios.put(`http://localhost/api/v1/postIts/${key}`, {
        content: newContent,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setIdeas(ideas.map((idea) => (idea.key === key ? { ...idea, content: newContent } : idea)));
    } catch (error) {
      console.error('Error updating post-it:', error);
    }
  };

  const getInstructionText = () => {
    switch (currentStep) {
      case 'initial':
        return '아이디어를 추가해 주세요.';
      case 'discussion':
        return '아이디어를 논의해 주세요.';
      case 'review':
        return '아이디어를 검토해 주세요.';
      default:
        return '아이디어를 작성해주세요.';
    }
  };

  const handleClick = () => {
    onSubmitClick(inputValue);
  };

  return (
    <div className="WhiteBoard">
      <header className="WhiteBoard-header">
        <h1>주제: {subject}</h1>
      </header>
      <div className="WhiteBoard-body">
        <div className="instruction-container">
          <p className="instruction">{getInstructionText()}</p>
        </div>
        <div className="divider-line" />
        <div className="idea-board">
          {/* {ideas.map((idea) => (
            <PostIt
              key={idea.key}
              content={idea.content}
              onDelete={handleDeleteIdea}
              onUpdate={handleUpdateIdea}
            />
          ))} */}
          
          <div>
            <PostItTest />  
          </div>

        </div>
      </div>

      

      <div className="WhiteBoard-footer">
        <form className="idea-form" /*onSubmit={handleAddIdea}*/>
          <input
            type="text"
            name="idea"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="아이디어를 입력하세요..."
            className="idea-input"
          />
          <button type="button" className="idea-submit-button" onClick={handleClick}>제출</button>
        </form>
      </div>
    </div>
  );
};

export default WhiteBoard;
