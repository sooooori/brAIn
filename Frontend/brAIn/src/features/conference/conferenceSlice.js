import { createSlice } from '@reduxjs/toolkit';

const conferenceSlice = createSlice({
  name: 'conference',
  initialState: {
    role: null, // 'master' or 'participant'
  },
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    clearRole: (state) => {
      state.role = null;
    },
  },
});

export const { setRole, clearRole } = conferenceSlice.actions;

export default conferenceSlice.reducer;
