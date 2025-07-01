import { useEffect, useState } from 'react';
import axios from '../api/axios';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [filterStatus, setFilterStatus] = useState('');

  // Fetch tasks
  const fetchTasks = async (filter = '') => {
    try {
      const response = await axios.get(`/tasks/?status=${filter}`);
      setTasks(response.data);
    } catch (err) {
      alert('Failed to load tasks');
    }
  };

  useEffect(() => {
    fetchTasks(filterStatus);
  }, [filterStatus]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/tasks/', { title, description, status });
      setTitle('');
      setDescription('');
      setStatus('To Do');
      fetchTasks(filterStatus);
    } catch (err) {
      alert('Failed to create task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/tasks/${id}/`);
      fetchTasks(filterStatus);
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleStatusChange = async (id, newStatus, title) => {
    try {
      await axios.put(`/tasks/${id}/`, { status: newStatus, title: title});
      fetchTasks(filterStatus);
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div>
      <h2>Task Manager</h2>

      {/* Filter */}
      <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
        <option value="">All</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      {/* Task form */}
      <form onSubmit={handleAddTask}>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" required />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {/* Task list */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> — {task.description} [{task.status}]
            <select
              value={task.status}
              onChange={(e) => handleStatusChange(task.id, e.target.value, task.title)}
            >
              <option>To Do</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
            <button onClick={() => handleDelete(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
