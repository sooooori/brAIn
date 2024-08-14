import React, { useEffect, useRef, useState } from 'react';
import { IconButton, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import './PostItSidebar.css';
import { useDispatch, useSelector } from 'react-redux';
import { addNote, deleteNote, submitNote, updateNote } from '../../../features/note/noteSlice';

const PostItSidebar = ({ isVisible, onClose, onSubmitClick }) => {
  const dispatch = useDispatch();
  const notes = useSelector(state => state.note.notes);
  const nickname = useSelector(state => state.user.nickname);
  const sidebarRef = useRef(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [notesVisible, setNotesVisible] = useState(true);
  const step = useSelector(state => state.conferenceInfo.curStep);
  const curUser=useSelector(state=>state.user.currentUser)

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
    dispatch(addNote(''));
    setEditingIndex(notes.length); // 새로 추가된 노트를 편집 모드로 설정
  };

  // 메모 삭제 함수
  const handleDeleteNote = (index) => {
    const noteId = notes[index].id;
    dispatch(deleteNote(noteId));
    setEditingIndex(null);
  };

  // 메모 내용 수정 함수
  const handleEditNote = (index, newContent) => {
    const noteId = notes[index].id;
    dispatch(updateNote({ id: noteId, content: newContent }));
  };

  // 메모 제출 함수
  const handleSubmitNote = (index) => {
    const note = notes[index];
    const content = note.content;
    dispatch(submitNote(note.id));
    onSubmitClick(content);
  };

  // 편집 모드 종료 함수
  const handleBlur = () => {
    setEditingIndex(null);
  };

  // 사이드바 스타일 결정
  const sidebarClasses = `postit-sidebar ${isVisible ? 'visible' : ''} ${step === 'STEP_0' ? 'expanded' : ''}`;

  return (
    <div ref={sidebarRef} className={sidebarClasses}>
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
                    className="custom-delete-button"
                  >
                    🗑️
                  </button>
                  {/* STEP_0일 때 제출 버튼 숨기기 */}
                  {(step !== 'STEP_0' && curUser===nickname)&& (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleSubmitNote(index)}
                      className="submit-note-button"
                    >
                      제출
                    </Button>
                  )}
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
