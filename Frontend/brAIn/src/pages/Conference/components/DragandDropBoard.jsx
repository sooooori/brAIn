// DragandDropBoard.jsx
import React from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { ItemTypes } from './ItemTypes'; 
import { sendToBoard } from '../../../actions/roundRobinBoardAction';

const DragandDropBoard = () => {
  const dispatch = useDispatch();

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.NOTE,
    drop: (item) => {
      dispatch(sendToBoard(item.round, item.content));
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
      className="drag-and-drop-board"
      style={{ border: '1px solid black', padding: '20px', backgroundColor: isOver ? 'lightyellow' : 'white' }}
    >
      Drop here
    </div>
  );
};

export default DragandDropBoard;
