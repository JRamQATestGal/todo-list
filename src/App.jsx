import React, { useState } from 'react';

// Constants of text being reused
const DELETE_CONFIRMATION = 'Are you sure you want to delete the task?';
const EMPTY_TASKS_MESSAGE = 'No tasks added';

// Encapsulate the ID generation so that it can only
// be read and is protected from external modification.
const newID = (() => {
  let id = 0;
  return () => id++;
})();

const INITIAL_TASKS = [
  { id: newID(), label: 'Walk the dog' },
  { id: newID(), label: 'Water the plants' },
  { id: newID(), label: 'Wash the dishes' },
];

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [newTask, setNewTask] = useState('');

  return (
    <div>
      <h1 id="todo-list-heading">Todo List</h1>
      {/* Use a form instead. */}
      <form
        onSubmit={(event) => {
          // Listen to onSubmit events so that it works for both "Enter" key and
          // click of the submit <button>.
          event.preventDefault();
          // Trim the field and don't add to the list if it's empty.
          if (newTask.trim() === '') {
            return;
          }

          // Trim the value before adding it to the tasks.
          setTasks([
            ...tasks,
            { id: newID(), label: newTask.trim() },
          ]);
          // Clear the <input> field after successful submission.
          setNewTask('');
        }}>
        <input
          className="border border-gray-300 rounded px-2 py-1 mb-4"
          aria-label="Add new task"
          type="text"
          placeholder="Add your task"
          value={newTask}
          onChange={(event) =>
            setNewTask(event.target.value)
          }
        />
        <div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 mb-4 rounded">Submit</button>
        </div>
      </form>
      {/* Display an empty message when there are no tasks */}
      {tasks.length === 0 ? (
        <div>{EMPTY_TASKS_MESSAGE}</div>
      ) : (
        <table className="mx-auto border-collapse">
          <tbody>
            {tasks.map(({ id, label }) => (
              <tr key={id}>
                <td className="text-left px-4 py-2">{label}</td>
                <td className="px-4 py-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded"
                onClick={() => {
                  // Add confirmation before destructive actions.
                  if (
                    window.confirm(
                      DELETE_CONFIRMATION,
                    )
                  ) {
                    setTasks(
                      tasks.filter(
                        (task) => task.id !== id,
                      ),
                    );
                  }
                }}>
                Delete
              </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
