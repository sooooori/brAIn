// src/features/note/noteSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: [],
  ideas: [],
};

const noteSlice = createSlice({
  name: 'note',
  initialState,
  reducers: {
    addNote: (state, action) => {
      state.notes.push({ content: action.payload, id: Date.now() });
    },
    submitNote: (state, action) => {
      // 아이디어 보드로 노트를 이동
      const noteIndex = state.notes.findIndex(note => note.id === action.payload);
      if (noteIndex !== -1) {
        const [note] = state.notes.splice(noteIndex, 1);
        //state.ideas.push(note);
      }
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(note => note.id !== action.payload);
    },
    updateNote: (state, action) => {
      const { id, content } = action.payload;
      const note = state.notes.find(note => note.id === id);
      if (note) {
        note.content = content;
      }
    },
  },
});

export const { addNote, submitNote, deleteNote, updateNote, } = noteSlice.actions;
export default noteSlice.reducer;
