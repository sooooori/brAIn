// src/reducers/noteReducer.jsx
import { ADD_NOTE, SUBMIT_NOTE, DELETE_NOTE, UPDATE_NOTE } from "../actions/noteActions";

const initialState = {
  notes: [],
  ideas: [],
};

const noteReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_NOTE: {
      const newNote = { content: action.payload, id: Date.now() };
      return { ...state, notes: [...state.notes, newNote] };
    }

    case SUBMIT_NOTE: {
      const noteIndex = state.notes.findIndex(note => note.id === action.payload);
      if (noteIndex !== -1) {
        const note = state.notes[noteIndex];
        return {
          ...state,
          notes: state.notes.filter(note => note.id !== action.payload),
          ideas: [...state.ideas, note]
        };
      }
      return state;
    }

    case DELETE_NOTE: {
      return { ...state, notes: state.notes.filter(note => note.id !== action.payload) };
    }

    case UPDATE_NOTE: {
      const updatedNotes = state.notes.map(note =>
        note.id === action.payload.id ? { ...note, content: action.payload.content } : note
      );
      return { ...state, notes: updatedNotes };
    }

    default:
      return state;
  }
};

export default noteReducer;
