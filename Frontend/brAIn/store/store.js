import { configureStore } from '@reduxjs/toolkit';
// import authReducer from '../features/auth/authSlice';
import authSlice from '../src/features/auth/authSlice';
import conferenceSlice from '../src/features/conference/conferenceSlice'
import userReducer from '../src/reducers/userReducer';
import conferenceReducer from '../src/reducers/conferenceReducer';
import roundRobinBoardReducer from '../src/reducers/roundRobinBoardReducer';
import votedItemReducer from '../src/reducers/votedItemReducer';
import noteSlice from '../src/features/note/noteSlice';


const store = configureStore({
  reducer: {
    auth: authSlice,
    conference: conferenceSlice,
    user: userReducer,
    conferenceInfo: conferenceReducer,
    roundRobinBoard: roundRobinBoardReducer,
    votedItem: votedItemReducer,
    note: noteSlice,
  },
});





export default store;
