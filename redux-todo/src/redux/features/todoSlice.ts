import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Todo = {
  id: number;
  title: string;
  description: string;
  priority: string;
  completed: boolean;
};

type TodosState = {
  todos: Todo[];
};

const initialState: TodosState = {
  todos: [
    {
      id: 1,
      title: "Learn Redux",
      description: "Understand the basics of Redux and how to integrate it with React.",
      priority: "High",
      completed: false,
    },
    {
      id: 2,
      title: "Build a Todo App",
      description: "Create a simple todo app using React and Redux Toolkit.",
      priority: "Medium",
      completed: true,
    },
  ],
};


const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    editTodo: (state, action: PayloadAction<Todo>) => {
      const { id, title, description, priority, completed } = action.payload;
      const existingTodo = state.todos.find(todo => todo.id === id);
      if (existingTodo) {
        existingTodo.title = title;
        existingTodo.description = description;
        existingTodo.priority = priority;
        existingTodo.completed = completed;
      }
    },
    toggleTodoStatus: (state, action: PayloadAction<number>) => {
      const existingTodo = state.todos.find(todo => todo.id === action.payload);
      if (existingTodo) {
        existingTodo.completed = !existingTodo.completed;
      }
    },
  },
});

export const { addTodo, deleteTodo, editTodo, toggleTodoStatus } = todoSlice.actions;
export default todoSlice.reducer;
