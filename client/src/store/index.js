import { configureStore } from '@reduxjs/toolkit';
import authReducer     from './authSlice';
import subjectsReducer from './subjectsSlice';
import scheduleReducer from './scheduleSlice';

export const store = configureStore({
  reducer: {
    auth:     authReducer,
    subjects: subjectsReducer,
    schedule: scheduleReducer,
  },
});
