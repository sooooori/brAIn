import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

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
      Cookies.remove('refreshToken');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    }
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
