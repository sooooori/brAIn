import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, accessToken} = action.payload;

      // Update state based on available data
      state.user = user || state.user; // if user data is available, use it
      state.isAuthenticated = true;

      // Store user and tokens in local storage
      if (user) {
        localStorage.setItem('user', JSON.stringify(state.user));
      }
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }

      localStorage.setItem('isAuthenticated', JSON.stringify(state.isAuthenticated));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('accessToken');

    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
