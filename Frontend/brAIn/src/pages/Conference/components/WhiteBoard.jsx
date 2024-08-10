import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PostItTest from './PostItTest';
import './WhiteBoard.css';
import passImg from '../../../assets/svgs/pass.svg';
import nextImg from '../../../assets/svgs/next.svg';
import skipImg from '../../../assets/svgs/skip.svg';

const WhiteBoard = ({ subject, onSubmitClick }) => {
  const [ideas, setIdeas] = useState([]);
  const token = localStorage.getItem('authToken'); // 인증 토큰 가져오기
  const step = useSelector((state) => state.conferenceInfo.curStep); // Redux에서 currentStep 가져오기
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
    switch (step) {
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

  // 조건부 렌더링을 위해 step === 'STEP_0'에 대한 boolean 값
  const isStepZero = step === 'STEP_0';

  return (
    <div className="WhiteBoard">
      <div className="WhiteBoard-header">
        <h2>주제 : {subject} </h2>
      </div>
      {/* step이 'STEP_0'일 때 WhiteBoard-body와 WhiteBoard-footer를 숨김 */}
      {!isStepZero && (
        <div className="WhiteBoard-body">
          <div className="idea-board">
            <PostItTest />
          </div>
        </div>
      )}
      {!isStepZero && (
        <div className="WhiteBoard-footer">
          <form className="idea-form" onSubmit={handleAddIdea}>
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
      )}
    </div>
  );
};

export default WhiteBoard;
