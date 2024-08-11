// src/redux/conferenceSlice.js
import { createSlice } from '@reduxjs/toolkit';

const conferenceSlice = createSlice({
  name: 'conference',
  initialState: {
    role: null,          // Role of the user ('host' or 'participant')
    users: [],           // List of users in the conference
    current_step: null,  // Current step of the conference
  },
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    clearRole: (state) => {
      state.role = null;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    clearUsers: (state) => {
      state.users = [];
    },
    setCurrentStep: (state, action) => {
      state.current_step = action.payload;
    },
    clearCurrentStep: (state) => {
      state.current_step = null;
    },
  },
});

export const { setRole, clearRole, setUsers, clearUsers, setCurrentStep, clearCurrentStep } = conferenceSlice.actions;

export default conferenceSlice.reducer;
