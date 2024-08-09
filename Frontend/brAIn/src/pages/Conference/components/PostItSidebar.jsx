import React, { useEffect, useRef, useState } from 'react';
import { IconButton, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import './PostItSidebar.css';
import { useDispatch, useSelector } from 'react-redux';
import { addNote, deleteNote, updateNote } from '../../../actions/noteActions';

const PostItSidebar = ({ isVisible, onClose, onSubmitClick }) => {
  const dispatch = useDispatch();
  const notes = useSelector(state => state.note.notes);
  const sidebarRef = useRef(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [notesVisible, setNotesVisible] = useState(true); // 노트 가시성 상태 추가

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
    dispatch(addNote('')); // Redux에 빈 노트 추가
    setEditingIndex(notes.length); // 새로 추가된 노트를 편집 모드로 설정
    
  };

  // 메모 삭제 함수
  const handleDeleteNote = (index) => {
    const noteId = notes[index].id;
    dispatch(deleteNote(noteId)); // Redux에서 해당 노트 삭제
    setEditingIndex(null);
  };

  // 메모 내용 수정 함수
  const handleEditNote = (index, newContent) => {
    const noteId = notes[index].id;
    dispatch(updateNote(noteId, newContent)); // Redux를 사용하여 노트 내용 업데이트
  };

  // 메모 제출 함수
  const handleSubmitNote = (index) => {
    const note = notes[index];
    const content = note.content;

    // 라운드로빈 보드에 제출
    onSubmitClick(content);
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
      <div className={`notes-list ${notesVisible ? 'visible' : ''}`}>
        {notes.map((note, index) => (
          <div key={note.id} className="note">
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
                  <button
                    onClick={() => handleDeleteNote(index)}
                    aria-label="delete"
                    className="custom-delete-button" // 새로운 버튼 클래스 사용
                  >
                    🗑️
                  </button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={() => handleSubmitNote(index)}
                    className="submit-note-button"
                  >
                    제출
                  </Button>
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