// PostItTest.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import './PostItTest.css'; // CSS 파일을 가져옵니다.

const PostItTest = () => {
  const roundRobinBoard = useSelector((state) => state.roundRobinBoard?.roundRobinBoard || []);

  // 파스텔 톤 색상 배열
  const colors = [
    '#fce4ec', // Pastel Pink
    '#f8bbd0', // Light Pink
    '#f0f4c3', // Pastel Yellow
    '#c5e1a5', // Light Green
    '#bbdefb', // Light Blue
    '#d1c4e9', // Light Purple
  ];

  // 랜덤 색상 선택 함수
  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="post-it-board">
      <h2>라운드 로빈 보드</h2>
      {roundRobinBoard.length === 0 ? (
        <p>보드에 아이디어가 없습니다.</p>
      ) : (
        roundRobinBoard.map((roundIdeas, roundIndex) => (
          <div key={roundIndex} className="round-container">
            <h3>라운드 {roundIndex}</h3>
            <div className="post-it-container">
              {roundIdeas && roundIdeas.length > 0 ? (
                roundIdeas.map((idea, ideaIndex) => (
                  <div
                    key={ideaIndex}
                    className="post-it-card"
                    style={{ backgroundColor: getRandomColor() }} // 랜덤 색상 적용
                  >
                    {idea}
                  </div>
                ))
              ) : (
                <p>아이디어가 없습니다.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostItTest;
