import { configureStore } from '@reduxjs/toolkit';
import { taskApi } from './api/api';
import todoReducer from './features/todoSlice'

export const store = configureStore({
  reducer: {
    todos: todoReducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskApi.middleware),
});
