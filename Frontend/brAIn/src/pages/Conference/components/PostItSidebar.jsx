import React, { useEffect, useRef, useState } from 'react';
import { IconButton, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import './PostItSidebar.css';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const PostItSidebar = ({ isVisible, onClose }) => {
  const sidebarRef = useRef(null);
  const [notes, setNotes] = useState([]); // 메모를 관리하는 상태
  const [editingIndex, setEditingIndex] = useState(null); // 현재 편집 중인 메모의 인덱스

  // 사이드바 외부 클릭 시 닫히도록 처리
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible]);

  // 새 메모 추가 함수
  const handleAddNote = () => {
    setNotes([...notes, { content: '' }]); // 빈 메모 추가
    setEditingIndex(notes.length); // 새로 추가된 메모를 편집 모드로 설정
  };

  // 메모 삭제 함수
  const handleDeleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index)); // 해당 인덱스의 메모 삭제
    setEditingIndex(null);
  };

  // 메모 내용 수정 함수
  const handleEditNote = (index, newContent) => {
    const updatedNotes = notes.map((note, i) =>
      i === index ? { content: newContent } : note
    );
    setNotes(updatedNotes);
  };

  // 편집 모드 종료 함수
  const handleBlur = () => {
    setEditingIndex(null); // 편집 모드를 종료
  };

  return (
    <div ref={sidebarRef} className={`postit-sidebar ${isVisible ? 'visible' : ''}`}>
      <div className="sidebar-header">
        <IconButton onClick={onClose} aria-label="close" className="close-button">
          <CloseIcon />
        </IconButton>
      </div>
      <div className="notes-list">
        {notes.map((note, index) => (
          <div key={index} className="note">
            {editingIndex === index ? (
              <TextField
                value={note.content}
                onChange={(e) => handleEditNote(index, e.target.value)}
                onBlur={handleBlur}
                autoFocus
                multiline
                fullWidth
                variant="outlined"
                InputProps={{
                  style: { fontSize: 14, lineHeight: '1.5', whiteSpace: 'normal' },
                }}
              />
            ) : (
              <div className="note-content">
                <p onClick={() => setEditingIndex(index)} className="note-text">
                  {note.content || '클릭하여 입력하세요...'}
                </p>
                <div className="note-actions">
                  <IconButton
                    onClick={() => handleDeleteNote(index)}
                    aria-label="delete"
                    className="delete-button-side"
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddNote}
        className="add-note-button"
      >
        포스트잇 추가
      </Button>
    </div>
  );
};

export default PostItSidebar;
