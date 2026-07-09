import React, { useState, useCallback, useEffect } from 'react';

// Constants of text being reused
const DELETE_CONFIRMATION = 'Are you sure you want to delete the task?';
const EMPTY_TASKS_MESSAGE = 'No tasks added';
const LOCAL_STORAGE_KEY = 'todo_list_tasks';

function getInitialTasks() {
  return [
    { id: 'task-1', label: 'Walk the dog', completed: false },
    { id: 'task-2', label: 'Water the plants', completed: false },
    { id: 'task-3', label: 'Wash the dishes', completed: false },
  ];
}

// Optimized individual row component with checkbox integration
const TaskRow = React.memo(function TaskRow({ id, label, completed, onToggle, onDelete }) {
  return (
    <tr className="border-b border-gray-100 last:border-none transition-colors hover:bg-gray-50/50">
      {/* 1. Interactive Checkbox Column */}
      <td className="px-4 py-3 text-left w-10">
        <input
          type="checkbox"
          checked={completed}
          onChange={() => onToggle(id)}
          aria-label={`Mark "${label}" as completed`}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
        />
      </td>
      {/* Dynamic Text Styling with conditional line-through */}
      <td className={`text-left px-4 py-3 font-medium transition-all duration-200 ${
        completed ? 'line-through text-gray-400 italic font-normal' : 'text-gray-700'
      }`}>
        {label}
      </td>
      <td className="px-4 py-3 text-right">
        <button 
          className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none text-white text-sm px-4 py-1 rounded transition-all" 
          onClick={() => onDelete(id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
});

const TodoForm = React.memo(function TodoForm({ newTask, onNewTaskChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="mb-6">
      <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto px-4">
        <input 
          className="border border-gray-300 rounded px-3 py-2 grow focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all" 
          aria-label="Add new task" 
          type="text" 
          placeholder="Add your task" 
          value={newTask} 
          onChange={onNewTaskChange} 
        />
        <button className="bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:outline-none text-white px-5 py-2 rounded font-medium transition-all">
          Submit
        </button>
      </div>
    </form>
  );
});

const EmptyState = React.memo(function EmptyState({ message }) {
  return <div className="text-gray-500 my-8 font-medium">{message}</div>;
});

export default function App() {
  // DEFENSIVE STATE INITIALIZATION: Automatically migrates historical tasks
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedTasks) {
      const parsed = JSON.parse(savedTasks);
      // Guarantee that every saved row safely possesses the completed boolean flag
      return parsed.map(task => ({
        ...task,
        completed: task.completed ?? false
      }));
    }
    return getInitialTasks();
  });

  const [newTask, setNewTask] = useState('');

  // Synchronize array changes directly to local storage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Map the array and flip the targeted completion boolean
  const handleToggleComplete = useCallback((id) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

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
        { 
          id: `task-${crypto.randomUUID()}`, 
          label: newTask.trim(),
          completed: false // Default baseline state for fresh rows
        },
      ]);
      setNewTask('');
    },
    [newTask],
  );

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-md border border-gray-100 text-center">
      <h1 id="todo-list-heading" className="text-3xl font-extrabold text-gray-800 mb-6 tracking-tight">
        Todo List
      </h1>
      
      <TodoForm newTask={newTask} onNewTaskChange={handleNewTaskChange} onSubmit={handleSubmit} />

      {tasks.length === 0 ? (
        <EmptyState message={EMPTY_TASKS_MESSAGE} />
      ) : (
        <div className="overflow-x-auto px-4">
          <table className="w-full max-w-md mx-auto border-collapse">
            <tbody>
              {tasks.map(({ id, label, completed }) => (
                <TaskRow 
                  key={id} 
                  id={id} 
                  label={label} 
                  completed={completed}
                  onToggle={handleToggleComplete}
                  onDelete={handleDelete} 
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
