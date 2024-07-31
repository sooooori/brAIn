import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  accessToken: localStorage.getItem('accessToken') || null,
  isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, accessToken } = action.payload;

      state.user = user || state.user;
      state.accessToken = accessToken || state.accessToken;
      state.isAuthenticated = true;

      // Store user and tokens in local storage
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }

      localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('isAuthenticated');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
