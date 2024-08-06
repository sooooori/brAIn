// PostItTest.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import './PostItTest.css'; // CSS 파일을 가져옵니다.

const PostItTest = () => {
  // Redux 스토어에서 'roundRobinBoard' 상태를 가져옵니다.
  const roundRobinBoard = useSelector((state) => state.roundRobinBoard?.roundRobinBoard || []);

  return (
    <div className="post-it-board">
      <h2>라운드 로빈 보드</h2>
      {roundRobinBoard.length === 0 ? (
        <p>보드에 아이디어가 없습니다.</p>
      ) : (
        roundRobinBoard.map((roundIdeas, roundIndex) => (
          <div key={roundIndex} className="round-container">
            <h3>라운드 {roundIndex + 1}</h3>
            <div className="post-it-container">
              {roundIdeas && roundIdeas.length > 0 ? (
                roundIdeas.map((idea, ideaIndex) => (
                  <div key={ideaIndex} className="post-it-card">
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
