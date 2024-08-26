# Installing Redux Toolkit with React, Vite, and Tailwind: A Beginner's Guide

Redux Toolkit simplifies working with Redux in React applications by providing a powerful set of tools to manage state. In this guide, we'll walk through the process of setting up a React project with Vite and Tailwind CSS, and integrating Redux Toolkit to manage application state. We'll cover everything from installation to creating slices and connecting them to the UI.

## Step 1: Setting Up the Project

### 1.1 Install Vite and React

Start by setting up a new React project using Vite. Vite is a fast build tool that provides an excellent development experience.

```javascript
npm create vite@latest my-redux-app --template react
```

Move into your project directory:

```javascript
cd my-redux-app
```

### 1.2 Install Tailwind CSS

Tailwind CSS is a utility-first CSS framework that allows you to build modern designs quickly. Follow these steps to install and configure Tailwind in your Vite project.

Install Tailwind CSS and its dependencies:

```javascript
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Configure tailwind.config.js to look like this:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add Tailwind's base, components, and utilities to your src/index.css:

```javascript
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 1.3 Install Redux Toolkit and React-Redux

Now, let's install Redux Toolkit and React-Redux, which will allow us to use Redux in our React application.

```javascript
npm install @reduxjs/toolkit react-redux
```

## Step 2: Project File Structure

Organize your project directory under src as follows:

```javascript
src/
│
├── components/
│   ├── layouts/
│   └── UI/
│
├── pages/
│
├── routes/
│
├── redux/
│   ├── features/
│   └── store.js
│
├── utils/
│
├── context/
│
├── hooks/
│   └── hook.ts
│
├── main.jsx
└── index.css
```

This structure helps keep your code organized as your application grows.

## Step 3: Configure the Redux Store

We'll start by configuring the Redux store using Redux Toolkit.

Create a `store.js` file inside the `redux` directory:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export default store;
```

## Step 4: Connect the Store with `main.jsx`

Now, let's connect the Redux store to our React application.

In `main.jsx`, wrap your `App` component with `Provider` from `react-redux` and pass in the store:

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import store from './redux/store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
```

## Step 5: Create a `counterSlice`

In the `redux/features` directory, create a new file named `counterSlice.js`:

```javascript
import { createSlice } from '@reduxjs/toolkit';

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
```

This `counterSlice` contains an initial state and two reducers: `increment` and `decrement`, which modify the state.

## Step 6: Connect `counterSlice` with the Store

The `counterSlice` has already been connected to the store when we configured it in `store.js`. This means our store is now aware of the `counter` state and can manage it according to the reducers we defined.

## Step 7: Use useDispatch and useSelector

Let's create a simple component that will display the counter and provide buttons to increment and decrement it.

In the `components/UI` directory, create a `Counter.jsx` file:

```javascript
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../../redux/features/counterSlice';

const Counter = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div className="p-4">
      <h1 className="text-2xl">Count: {count}</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 m-2"
        onClick={() => dispatch(increment())}
      >
        Increment
      </button>
      <button
        className="bg-red-500 text-white px-4 py-2 m-2"
        onClick={() => dispatch(decrement())}
      >
        Decrement
      </button>
    </div>
  );
};

export default Counter;
```

In this component, we use `useSelector` to access the current count from the store and `useDispatch` to dispatch `increment` and `decrement` actions.

## Step 8: Show Count in the UI

Now, let's render the `Counter` component in our application.

Update your `App.jsx` to include the `Counter` component:

```javascript
import React from 'react';
import Counter from './components/UI/Counter';

function App() {
  return (
    <div className="App">
      <Counter />
    </div>
  );
}

export default App;
```

Run your application to see the counter in action.

## Step 9: Create `todoSlice` with Payload Example

Let's create another slice, `todoSlice`, to manage a list of todos. Inside `redux/features`, create a `todoSlice.js` file:

```javascript
import { createSlice } from '@reduxjs/toolkit';

export const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
  },
  reducers: {
    addTodo: (state, action) => {
      state.items.push(action.payload);
    },
    removeTodo: (state, action) => {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
    },
  },
});

export const { addTodo, removeTodo } = todoSlice.actions;
export default todoSlice.reducer;
```

Add `todoReducer` to your store in `store.js`:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counterSlice';
import todoReducer from './features/todoSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    todos: todoReducer,
  },
});

export default store;
```

You can now manage todos similarly to how we managed the counter.

## Step 10: Create `hook.ts` File

To simplify the use of `useDispatch` and `useSelector`, let's create custom hooks. Inside the `hooks` directory, create a `hook.ts` file:

```javascript
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../redux/store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

This TypeScript file ensures type safety when using these hooks with Redux.

## Conclusion

In this blog, we've walked through setting up a React application with Vite, Tailwind CSS, and Redux Toolkit. We've covered everything from installing necessary dependencies to configuring the store and creating slices. By following these steps, you should now have a solid foundation to manage state in your React applications using Redux Toolkit. 