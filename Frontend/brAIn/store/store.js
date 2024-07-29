import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice';
import authSlice from '../src/features/auth/authSlice';
const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export default store;