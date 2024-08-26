## Managing Global State in React with `useContext` and `useReducer`: A Todo App Example

React provides powerful tools for managing state within your application, and when it comes to global state management, the combination of `useContext` and `useReducer` offers a scalable and maintainable solution. In this blog, we'll explore how `useContext` can be used to share state across different components of a React application. We'll walk through the creation of a simple Todo app that demonstrates how to add, update, remove, and change the completed status of todo items using `useReducer` and `useContext`.

### What is `useContext`?

`useContext` is a React hook that allows you to access the state managed by a context provider from anywhere within the component tree. It effectively eliminates the need for prop drilling, where you pass props through multiple layers of components.

### Key Concepts

- Global State: State that is accessible throughout the entire application, not just within a single component.
- Provider Component: A component that provides the global state to its children using the context API.
- Consumer Component: A component that consumes the global state provided by the context.

### Setting Up the Todo App with `useContext` and `useReducer`

Let’s build a Todo app that allows users to add, update, remove, and toggle the completion status of todos.

### 1. Setting Up Context and Reducer

First, let's create a context and set up the reducer function that will manage our state transitions.


```javascript
import React, { useReducer, createContext, useContext } from 'react';

// Create a context for the Todo app
const TodoContext = createContext();

// Define the initial state
const initialState = [];

// Define the reducer function
function todoReducer(state, action) {
    switch (action.type) {
        case 'ADD_TODO':
            return [...state, action.payload];
        case 'UPDATE_TODO':
            return state.map(todo =>
                todo.id === action.payload.id ? { ...todo, title: action.payload.title } : todo
            );
        case 'REMOVE_TODO':
            return state.filter(todo => todo.id !== action.payload.id);
        case 'TOGGLE_TODO':
            return state.map(todo =>
                todo.id === action.payload.id ? { ...todo, isCompleted: !todo.isCompleted } : todo
            );
        default:
            return state;
    }
}
```

### 2. Creating the Context Provider

Next, we’ll create the `TodoProvider` component that wraps the `TodoContext.Provider`. This provider will manage the global state using the `useReducer` hook.

```javascript
const TodoProvider = ({ children }) => {
    const [state, dispatch] = useReducer(todoReducer, initialState);

    return (
        <TodoContext.Provider value={{ state, dispatch }}>
            {children}
        </TodoContext.Provider>
    );
};
```

Here, the `TodoProvider` component uses `useReducer` to manage the todo list's state. It then provides both the state and the dispatch function to any component that needs access to the global state.

### 3. Wrapping the App with the Context Provider

Now, let’s wrap our entire application with the `TodoProvider` to make the global state accessible across all components.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { TodoProvider } from './TodoContext';

ReactDOM.render(
    <TodoProvider>
        <App />
    </TodoProvider>,
    document.getElementById('root')
);
```

By wrapping the `App` component with `TodoProvider`, all components within `App` will have access to the global state managed by `TodoProvider`.

### 4. Creating the Todo Consumer Components

Finally, we’ll create components that consume the global state and allow users to interact with the Todo app.

- TodoForm Component: Allows users to add new todos.

```javascript
import React, { useState, useContext } from 'react';
import { TodoContext } from './TodoContext';

const TodoForm = () => {
    const [title, setTitle] = useState('');
    const { dispatch } = useContext(TodoContext);

    const addTodo = () => {
        dispatch({ type: 'ADD_TODO', payload: { id: Date.now(), title, isCompleted: false } });
        setTitle('');
    };

    return (
        <div>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter todo"
            />
            <button onClick={addTodo}>Add Todo</button>
        </div>
    );
};

export default TodoForm;
```

- TodoList Component: Displays the list of todos and allows users to update, remove, or toggle the completion status of each todo.

```javascript
import React, { useContext } from 'react';
import { TodoContext } from './TodoContext';

const TodoList = () => {
    const { state, dispatch } = useContext(TodoContext);

    return (
        <ul>
            {state.map((todo) => (
                <li key={todo.id}>
                    <input
                        type="text"
                        value={todo.title}
                        onChange={(e) =>
                            dispatch({
                                type: 'UPDATE_TODO',
                                payload: { id: todo.id, title: e.target.value },
                            })
                        }
                    />
                    <button onClick={() => dispatch({ type: 'TOGGLE_TODO', payload: { id: todo.id } })}>
                        {todo.isCompleted ? 'Undo' : 'Complete'}
                    </button>
                    <button onClick={() => dispatch({ type: 'REMOVE_TODO', payload: { id: todo.id } })}>
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default TodoList;
```

- App Component: Brings everything together.

```javascript
import React from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const App = () => {
    return (
        <div>
            <h1>Todo App</h1>
            <TodoForm />
            <TodoList />
        </div>
    );
};

export default App;
```

### How It All Works Together

- TodoProvider: Manages the global state using `useReducer` and provides it to the entire app through the `TodoContext.Provider`.
- TodoForm: Uses the `dispatch` function from - the context to add new todos to the state.
- TodoList: Consumes the global state to display todos and interacts with the state via the `dispatch` function to update, remove, or toggle todos.

By structuring the app this way, we've created a maintainable and scalable todo app where global state is efficiently managed and shared across components using `useContext` and `useReducer`.

### Conclusion

`useContext` combined with `useReducer` is a powerful pattern for managing global state in React applications. It allows for centralized state management while maintaining the flexibility of React’s component-based architecture. In our Todo app example, we demonstrated how to create a global state with `useContext`, manage that state with `useReducer`, and efficiently share it across different components. This pattern helps eliminate prop drilling and ensures that all components have access to the necessary state, making your React applications cleaner and more scalable.