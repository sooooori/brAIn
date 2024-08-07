import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../../actions/votedItemAction';
import './PostItTest.css';

const PostItTest = () => {
  const roundRobinBoard = useSelector((state) => state.roundRobinBoard?.roundRobinBoard || []);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 1; // 한 페이지에 보여줄 라운드 수
  const dispatch = useDispatch();

  // 페이지 버튼 클릭 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 페이지네이션 관련 데이터 계산
  const totalPages = Math.ceil(roundRobinBoard.length / itemsPerPage);
  const currentRoundIdeas = roundRobinBoard.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

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

  // 투표 핸들러
  const handleVote = (round, index, content) => {
    dispatch(addItem(round, index, content));
  };

  return (
    <div className="post-it-board">
      {/* 페이지네이션 버튼 */}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index)}
            className={index === currentPage ? 'active' : ''}
          >
            <h3>라운드 {index + 1}</h3>
          </button>
        ))}
      </div>
      {currentRoundIdeas.length === 0 ? (
        <p>보드에 아이디어가 없습니다.</p>
      ) : (
        currentRoundIdeas.map((roundIdeas, roundIndex) => (
          <div key={roundIndex} className="round-container">
            <div className="post-it-container">
              {roundIdeas && roundIdeas.length > 0 ? (
                roundIdeas.map((idea, ideaIndex) => (
                  <div
                    key={ideaIndex}
                    className="post-it-card"
                    style={{ backgroundColor: getRandomColor() }} // 랜덤 색상 적용
                  >
                    {idea}
                    <button onClick={() => handleVote(currentPage + 1, ideaIndex, idea)}>Vote</button>
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
