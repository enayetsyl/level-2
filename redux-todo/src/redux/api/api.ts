import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/' }), // Replace with your backend URL
  tagTypes: ['Tasks'], // Add tagTypes for cache invalidation
  endpoints: (builder) => ({
    getTasks: builder.query({
      query: (priority) => {
        if (priority) {
          return `tasks?priority=${priority}`;
        }
        return 'tasks';
      },
      providesTags: ['Tasks'], // Associate this query with the 'Tasks' tag
    }),
    getTaskById: builder.query({
      query: (id) => `task/${id}`,
      providesTags: ['Tasks'], // Associate this query with the 'Tasks' tag
    }),
    addTask: builder.mutation({
      query: (task) => ({
        url: 'task',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Tasks'], // Invalidate 'Tasks' tag on mutation
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `task/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tasks'], // Invalidate 'Tasks' tag on mutation
    }),
    updateTask: builder.mutation({
      query: ({ id, ...task }) => ({
        url: `task/${id}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: ['Tasks'], // Invalidate 'Tasks' tag on mutation
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useAddTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} = taskApi;
