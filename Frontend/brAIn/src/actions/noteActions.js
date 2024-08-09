// src/actions/noteActions.js

export const ADD_NOTE = 'ADD_NOTE';
export const SUBMIT_NOTE = 'SUBMIT_NOTE';
export const DELETE_NOTE = 'DELETE_NOTE';
export const UPDATE_NOTE = 'UPDATE_NOTE';

export const addNote = (content) => ({
  type: ADD_NOTE,
  payload: content,
});

export const submitNote = (id) => ({
  type: SUBMIT_NOTE,
  payload: id,
});

export const deleteNote = (id) => ({
  type: DELETE_NOTE,
  payload: id,
});

export const updateNote = (id, content) => ({
  type: UPDATE_NOTE,
  payload: { id, content },
});
