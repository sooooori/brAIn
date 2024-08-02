import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice';
import authSlice from '../src/features/auth/authSlice';
import conferenceSlice from '../src/features/conference/conferenceSlice'
const store = configureStore({
  reducer: {
    auth: authSlice,
    conference: conferenceSlice,
  },
});

export default store;