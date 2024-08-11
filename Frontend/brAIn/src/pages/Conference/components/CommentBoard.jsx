import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './PostItTest.css';
import axios from 'axios';

const CommentBoard = () => {
  const commentBoard = useSelector((state) => state.commentBoard.comments || []);
  const votes=useSelector((state)=>state.commentBoard.vote || []);
  const curIndex=useSelector((state)=>state.commentBoard.curIndex);
  const dispatch = useDispatch();

  useEffect(() => {

    const postComment = async () => {
      try {
        // votes[curIndex]가 존재하는지 확인
        if (votes[curIndex]) {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/comment`, {
            body: {
              content: votes[curIndex]
            }
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // 응답이 성공적으로 왔을 때의 처리
          console.log('Comment posted successfully:', response.data);
        } else {
          console.warn('Invalid vote or curIndex');
        }
      } catch (error) {
        // 에러 핸들링
        console.error('Error posting comment:', error);
      }
    };

    postComment();
  }, [votes, curIndex]);

  // 파스텔 톤 색상 배열
  const colors = [
    '#F8CFCF', // 분홍색
    '#FFFFC2', // 노란색
    '#C9E4C5', // 녹색
    '#D6C0EB', // 보라색
    '#E0FFFF', // 라이트 시안색
    '#F7B7A3', // 연한 오렌지색
    '#D0E6F8'  // 파스텔 블루
  ];

  // 아이디어별 색상을 매칭하기 위한 상태
  const [postItColors, setPostItColors] = useState({});

  // 랜덤 색상 선택 함수
  const getColorForIdea = useCallback((roundIndex, ideaIndex) => {
    const uniqueKey = `${roundIndex}-${ideaIndex}`;
    if (!(uniqueKey in postItColors)) {
      const remainingColors = colors.filter(color => !Object.values(postItColors).includes(color));
      const selectedColor = remainingColors.length > 0
        ? remainingColors[Math.floor(Math.random() * remainingColors.length)]
        : colors[Math.floor(Math.random() * colors.length)];

      setPostItColors(prevColors => ({ ...prevColors, [uniqueKey]: selectedColor }));
      return selectedColor;
    }
    return postItColors[uniqueKey];
  }, [colors, postItColors]);

  

  return (
    <div className="post-it-board">
      
      {commentBoard.length === 0 ? (
        <p>보드에 코멘트가 없습니다.</p>
      ) : (
        commentBoard.map((comment, roundIndex) => (
          <div key={roundIndex} className="round-container">
            <div className="post-it-container">
              {comment && comment.length > 0 ? (
                comment.map((idea, ideaIndex) => (
                  <div
                    key={ideaIndex}
                    className="post-it-card"
                    style={{ backgroundColor: getColorForIdea(roundIndex, ideaIndex) }} // 아이디어별 랜덤 색상 적용
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

export default CommentBoard;
