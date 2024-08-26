import React from 'react';

function TodoItem({ todo, onDelete, onEdit, onToggleStatus }) {
  return (
    <div className="todo-item bg-blue-300 py-2 rounded-lg flex justify-around items-center gap-5 px-5">
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => onToggleStatus(todo.id)}
      />
      <h3>{todo.title}</h3>
      <p>{todo.description}</p>
      <span>Priority: {todo.priority}</span>
      <span>Status: {todo.isCompleted ? 'Completed' : 'Incomplete'}</span>
      <button onClick={() => onEdit(todo)}>Edit</button>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </div>
  );
}

export default TodoItem;
