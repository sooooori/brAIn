import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector, useDispatch } from 'react-redux';
import { reorder } from '../../../actions/votedItemAction';
import './VotedPostIt.css';

const VotedPostIt = () => {
  const dispatch = useDispatch();
  const votedItems = useSelector(state => state.votedItem.items || []);
  console.log('votedItems:', votedItems);

  // --- Draggable이 Droppable로 드래그 되었을 때 실행되는 이벤트
  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;

    // 아이템의 순서를 업데이트합니다.
    const reorderedItems = Array.from(votedItems);
    const [movedItem] = reorderedItems.splice(source.index, 1);
    reorderedItems.splice(destination.index, 0, movedItem);

    // Redux 스토어에 업데이트된 아이템 목록을 디스패치합니다.
    dispatch(reorder(reorderedItems));
  };

  // --- requestAnimationFrame 초기화
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

  // Calculate the height of the Droppable container based on the number of items
  const containerHeight = votedItems.length * 158; // Each item height (150px) + margin-bottom (8px)

  return (
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
              <Draggable key={item.round*10+item.index} draggableId={`${item.round*10+item.index}`} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="draggable-item"
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default VotedPostIt;
