// src/redux/conferenceSlice.js
import { createSlice } from '@reduxjs/toolkit';

const conferenceSlice = createSlice({
  name: 'conference',
  initialState: {
    role: null,  // Role of the user ('host' or 'participant')
    users: [],   // List of users in the conference
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
  },
});

export const { setRole, clearRole, setUsers, clearUsers } = conferenceSlice.actions;

export default conferenceSlice.reducer;
