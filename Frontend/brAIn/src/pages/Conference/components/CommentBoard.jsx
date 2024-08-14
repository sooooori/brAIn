import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './PostItTest.css';
import axios from 'axios';
import { initComment } from '../../../actions/commentsAction';
import { resetReadyStatus } from '../../../actions/userActions';
import Swal from 'sweetalert2';

const CommentBoard = () => {
  const commentBoard = useSelector((state) => state.commentBoard.comments || []);
  const votes = useSelector((state) => state.commentBoard.vote || []);
  const curIndex = useSelector((state) => state.commentBoard.curIndex);
  const dispatch = useDispatch();

  useEffect(()=> {
    console.log(commentBoard)
  },[commentBoard])

  // 단계 변경 시 준비 상태 초기화
  useEffect(() => {
    dispatch(resetReadyStatus());
  }, [curIndex, dispatch])

  useEffect(() => {
    const postComment = async () => {
      try {
        if (votes[curIndex] && curIndex < votes.length) {
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/comment`, {
            content: votes[curIndex]
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          console.log('Comment posted successfully:', response.data.comments);
          dispatch(initComment(response.data.comments));
        } else {
          console.warn('Invalid vote or curIndex');
        }
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    };

    postComment();
  }, [votes, curIndex, dispatch]);

  // 파스텔 톤 색상 배열
  const colors = [
    '#F8CFCF', '#FFFFC2', '#C9E4C5',
    '#D6C0EB', '#E0FFFF', '#F7B7A3', '#D0E6F8'
  ];

  const [postItColors, setPostItColors] = useState({});

  const getColorForIdea = useCallback((ideaIndex) => {
    if (!(ideaIndex in postItColors)) {
      const remainingColors = colors.filter(color => !Object.values(postItColors).includes(color));
      const selectedColor = remainingColors.length > 0
        ? remainingColors[Math.floor(Math.random() * remainingColors.length)]
        : colors[Math.floor(Math.random() * colors.length)];

      setPostItColors(prevColors => ({ ...prevColors, [ideaIndex]: selectedColor }));
      return selectedColor;
    }
    return postItColors[ideaIndex];
  }, [colors, postItColors]);

  return (
    <div className="post-it-board">
      {commentBoard.length === 0 ? (
        <p>보드에 코멘트가 없습니다.</p>
      ) : (
        <div className="post-it-container">
          {commentBoard.map((idea, ideaIndex) => (
            <div
              key={ideaIndex}
              className="post-it-card"
              style={{ backgroundColor: getColorForIdea(ideaIndex) }}
            >
              {idea}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentBoard;