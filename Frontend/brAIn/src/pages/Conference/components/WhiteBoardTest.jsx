import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addPostIt } from '../../../actions/roundRobinBoardAction';
import PostItTest from './PostItTest';

const WhiteBoardTest = ({ subject, onSubmitClickn }) => {
  const dispatch = useDispatch();
  const postItState = useSelector(state => state.roundRobinBoard.roundRobinBoard);
  const currentRound = useSelector(state => state.roundRobinBoard.currentRound || 0);

  useEffect(() => {
    if (client) {
      client.onConnect = (frame) => {
        client.subscribe('/topic/updatePostIts', (message) => {
          const data = JSON.parse(message.body);
          dispatch(addPostIt(data.currentRound, data.postIts.content, data.postIts.position));
        });
      };
    }
  }, [client, dispatch]);

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const content = 'Sample PostIt';
    const left = event.clientX;
    const top = event.clientY;

    const newPostIt = {
      content,
      position: { left, top },
    };

    dispatch(addPostIt(currentRound, newPostIt.content, newPostIt.position));
    attachPostitOnRoundBoard(newPostIt);
  };

  const attachPostitOnRoundBoard = (postit) => {
    if (client) {
      const postitData = {
        round: currentRound,
        content: postit.content,
      };

      client.publish({
        destination: `/app/step1.submit.${roomId}`,
        headers: { Authorization: localStorage.getItem('roomToken') },
        body: JSON.stringify(postitData)
      });
    }
  };

  const handleContentChange = (newContent, index) => {
    const updatedPostIt = {
      ...postItState[currentRound][index],
      content: newContent,
    };
    dispatch(addPostIt(currentRound, updatedPostIt.content, updatedPostIt.position));
    attachPostitOnRoundBoard(updatedPostIt);
  };

  return (
    <div
      className="whiteboard-container"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {postItState[currentRound]?.map((postIt, index) => (
        <PostItTest
          key={index}
          content={postIt.content}
          left={postIt.position.left}
          top={postIt.position.top}
          onContentChange={(newContent) => handleContentChange(newContent, index)}
        />
      ))}
    </div>
  );
};

export default WhiteBoardTest;
