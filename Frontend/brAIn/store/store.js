import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice';
import authSlice from '../src/features/auth/authSlice';
import conferenceSlice from '../src/features/conference/conferenceSlice'
import userReducer from '../src/reducers/userReducer';
import conferenceReducer from '../src/reducers/conferenceReducer';

const store = configureStore({
  reducer: {
    auth: authSlice,
    conference: conferenceSlice,
    user: userReducer,
    conference: conferenceReducer
  },
});

export default store;