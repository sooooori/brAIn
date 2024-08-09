import React, { useState, useCallback, useEffect } from 'react';
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
    '#F8CFCF', // 분홍색
    '#C2E0FF', // 파란색
    '#FFFFC2', // 노란색
    '#C9E4C5', // 녹색
    '#D6C0EB', // 보라색
    '#E0FFFF', // 라이트 시안색
    '#F7B7A3', // 연한 오렌지색
    '#D0E6F8'  // 파스텔 블루
  ];

  // 라운드별 포스트잇 아이디어와 색상을 매칭하기 위한 상태
  const [postItColors, setPostItColors] = useState({});
  const [roundUsedColors, setRoundUsedColors] = useState({}); // 현재 라운드에서 사용된 색상

  // 랜덤 색상 선택 함수
  const getColorForIdea = useCallback((roundIndex, idea) => {
    // 라운드 인덱스와 아이디어를 결합하여 고유 키 생성
    const ideaKey = `${roundIndex}-${idea}`;
    const currentRoundColors = roundUsedColors[roundIndex] || new Set();

    if (!(ideaKey in postItColors)) {
      let selectedColor;
      const availableColors = colors.filter(color => !currentRoundColors.has(color));

      if (availableColors.length === 0) {
        // 모든 색상이 사용된 경우 색상 목록을 초기화
        setRoundUsedColors(prev => ({
          ...prev,
          [roundIndex]: new Set()
        }));
      }

      // 색상을 랜덤으로 선택
      do {
        const colorIndex = Math.floor(Math.random() * colors.length);
        selectedColor = colors[colorIndex];
      } while (currentRoundColors.has(selectedColor) && availableColors.length > 0);

      // 선택된 색상을 상태에 저장
      setPostItColors(prevColors => ({ ...prevColors, [ideaKey]: selectedColor }));
      setRoundUsedColors(prev => ({
        ...prev,
        [roundIndex]: new Set([...currentRoundColors, selectedColor])
      }));

      return selectedColor;
    }
    
    // 이미 색상이 지정된 아이디어에는 저장된 색상 반환
    return postItColors[ideaKey];
  }, [colors, postItColors, roundUsedColors]);

  // 페이지 변경 시 색상 목록 초기화
  useEffect(() => {
    // 현재 페이지의 라운드 색상 기록을 초기화
    setRoundUsedColors(prev => ({
      ...prev,
      [currentPage]: new Set()
    }));
  }, [currentPage]);

  // 투표 핸들러
  const handleVote = (round, index, content) => {
    console.log('Dispatching vote with:', { round, index, content });
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
            className={index === currentPage ? 'active' : 'non'}
          >
            <h3>Rnd.{index + 1}</h3>
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
                    style={{ backgroundColor: getColorForIdea(currentPage, idea) }} // 라운드별 랜덤 색상 적용
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
