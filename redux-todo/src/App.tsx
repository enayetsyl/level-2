import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGetTasksQuery, useAddTaskMutation, useDeleteTaskMutation, useUpdateTaskMutation } from './redux/api/api';
import TodoItem from './components/TodoItem';
import TodoModal from './components/TodoModal';

function App() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState("");

  const { data: todosData, error, isLoading } = useGetTasksQuery(priorityFilter);
  const [addTask] = useAddTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const handleAddTodo = async (newTodo) => {
    await addTask(newTodo);
    setIsModalOpen(false);
  };

  const handleEditTodo = async (updatedTodo) => {
    await updateTask({ id: updatedTodo.id, ...updatedTodo });
    setIsModalOpen(false);
    setCurrentTodo(null);
  };

  const handleEditClick = (todo) => {
    setCurrentTodo(todo);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
  };

  const handleToggleStatus = async (id) => {
    console.log(id)
    const todo = todosData?.data?.find(todo => todo.id === id); // Adjust according to actual structure
    console.log(todo)
    await updateTask({ id: todo.id, ...todo, isCompleted: !todo.isCompleted });
  };

  const handleFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  // Ensure `todosData?.data` is an array
  const filteredAndSortedTodos = todosData?.data
    ?.slice() // Only call slice on an array
    .sort((a, b) => a.isCompleted - b.isCompleted)
    .sort((a, b) => {
      if (priorityFilter) {
        if (a.priority === priorityFilter && b.priority !== priorityFilter) {
          return -1;
        } else if (a.priority !== priorityFilter && b.priority === priorityFilter) {
          return 1;
        }
      }
      return 0;
    });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching tasks</div>;

  return (
    <div>
      <h1>Todo List</h1>
      <div className="flex space-x-4 mb-4">
        <button
          onClick={() => {
            setCurrentTodo(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Todo
        </button>
        <select
          value={priorityFilter}
          onChange={handleFilterChange}
          className="px-4 py-2 border border-gray-300 rounded"
        >
          <option value="">Filter by Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      <div className='w-[90%] mx-auto space-y-5'>
        {filteredAndSortedTodos?.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={handleDelete}
            onEdit={handleEditClick}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>
      {isModalOpen && (
        <TodoModal
          onClose={() => setIsModalOpen(false)}
          onSave={currentTodo ? handleEditTodo : handleAddTodo}
          todo={currentTodo}
        />
      )}
    </div>
  );
}

export default App;
