import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, reorderItems } from '../../../actions/votedItemAction';
import './VotedPostIt.css';

const VotedPostIt = React.memo(() => {
  const dispatch = useDispatch();
  const votedItems = useSelector(state => state.votedItem.items || []);
  console.log('votedItems:', votedItems);

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;

    const reorderedItems = Array.from(votedItems);
    const [movedItem] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, movedItem);

    dispatch(reorderItems(reorderedItems));
  };

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  const containerHeight = votedItems.length * 158; 

  const handleDeleteVotedPostIt = (index) => {
    dispatch(removeItem(index));
  }

  return (
    <>
      <h3>아이디어 투표</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="droppable-container"
              style={{ height: containerHeight }}
            >
              {votedItems.map((item, index) => (
                <Draggable key={item.round * 10 + item.index} draggableId={`${item.round * 10 + item.index}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="draggable-item"
                    >
                      <div className="item-content">
                        {item.content}
                      </div>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteVotedPostIt(index)}
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>

  );
});

export default VotedPostIt;
