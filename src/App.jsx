import React, { useState, useCallback, useEffect } from 'react';

// Constants of text being reused
const DELETE_CONFIRMATION = 'Are you sure you want to delete the task?';
const EMPTY_TASKS_MESSAGE = 'No tasks added';
const LOCAL_STORAGE_KEY = 'todo_list_tasks';

function getInitialTasks() {
  return [
    { id: 'task-1', label: 'Walk the dog' },
    { id: 'task-2', label: 'Water the plants' },
    { id: 'task-3', label: 'Wash the dishes' },
  ];
}

// Encapsulate the ID generation so that it can only
// be read and is protected from external modification.
// const newID = (() => {
//   let id = 0;
//   return () => id++;
// })();

const TaskRow = React.memo(function TaskRow({ id, label, onDelete }) {
  return (
    <tr>
      <td className="text-left px-4 py-2">{label}</td>
      <td className="px-4 py-2">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
          onClick={() => onDelete(id)}>
          Delete
        </button>
      </td>
    </tr>
  );
});

const TodoForm = React.memo(function TodoForm({ newTask, onNewTaskChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      <input
        className="border border-gray-300 rounded px-2 py-1 mb-4"
        aria-label="Add new task"
        type="text"
        placeholder="Add your task"
        value={newTask}
        onChange={onNewTaskChange}
      />
      <div>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 mb-4 rounded">Submit</button>
      </div>
    </form>
  );
});

const EmptyState = React.memo(function EmptyState({ message }) {
  return <div className="text-gray-500 my-8 font-medium">{message}</div>;
});

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    return savedTasks ? JSON.parse(savedTasks) : getInitialTasks();
  });

  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const handleDelete = useCallback((id) => {
    if (window.confirm(DELETE_CONFIRMATION)) {
      setTasks((current) => current.filter((task) => task.id !== id));
    }
  }, []);

  const handleNewTaskChange = useCallback((event) => {
    setNewTask(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (newTask.trim() === '') {
        return;
      }
      setTasks((current) => [
        ...current,
        { id: `task-${crypto.randomUUID()}`, label: newTask.trim() },
      ]);
      setNewTask('');
    },
    [newTask],
  );

  return (
    <div>
      <h1 id="todo-list-heading">Todo List</h1>
      {/* Use a form instead. */}
      <TodoForm
        newTask={newTask}
        onNewTaskChange={handleNewTaskChange}
        onSubmit={handleSubmit}
      />
      {/* Display an empty message when there are no tasks */}
      {tasks.length === 0 ? (
        <EmptyState message={EMPTY_TASKS_MESSAGE} />
      ) : (
        <table className="mx-auto border-collapse">
          <tbody>
            {tasks.map(({ id, label }) => (
              <TaskRow key={id} id={id} label={label} onDelete={handleDelete} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
