import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import PostItTest from './PostItTest';
import './WhiteBoard.css';
import { useDispatch } from 'react-redux';
import { addComments } from '../../../actions/commentsAction';
import CommentBoard from './CommentBoard';

const WhiteBoard = ({ subject, onSubmitClick, postItBig }) => {
  const [ideas, setIdeas] = useState([]);
  const token = localStorage.getItem('accessToken'); // 인증 토큰 가져오기
  const step = useSelector((state) => state.conferenceInfo.curStep); // Redux에서 currentStep 가져오기
  const [inputValue, setInputValue] = useState('');
  const votes = useSelector((state) => state.commentBoard.vote);
  const curIndex = useSelector(state => state.commentBoard.curIndex);

  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddIdea = async (e) => {
    e.preventDefault();
    const newIdea = inputValue.trim();

    if (newIdea) {
      try {
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/comment/create`, {
          target: votes[curIndex],
          comment: newIdea,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {

          dispatch(addComments(newIdea));
          // 입력칸 초기화
          setInputValue('')
        }
      } catch (error) {
        console.error('Error saving post-it:', error);
      }
    }
  };

  const handleDeleteIdea = async (key) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/v1/postIts/${key}`, {
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
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/v1/postIts/${key}`, {
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
  const isStepOne = step === 'STEP_1';
  const isStepTwo = step === 'STEP_2';
  const isStepThree = step === 'STEP_3';

  return (
    <div className="WhiteBoard">
      {(isStepZero || isStepOne || isStepTwo) && (
        <div className="WhiteBoard-header">
          <h2>주제 : {subject} </h2>
        </div>)}
      {(isStepThree) && (
        <div className="WhiteBoard-header">
          <h2>No.{curIndex + 1} 아이디어 : {votes[curIndex]} </h2>
        </div>)}
      {/* step이 'STEP_0'일 때 WhiteBoard-body와 WhiteBoard-footer를 숨김 */}
      {(isStepOne || isStepTwo) && (
        <div className="WhiteBoard-body">
          <div className="idea-board">
            <PostItTest postItBig={postItBig} />
          </div>
        </div>
      )}
      {isStepThree && (
        <div className="WhiteBoard-body">
          <div className="idea-board">
            <CommentBoard />
          </div>
        </div>
      )}
      {isStepThree && (
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
            <button type="button" className="idea-submit-button" onClick={handleAddIdea}>제출</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default WhiteBoard;
