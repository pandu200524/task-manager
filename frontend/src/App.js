import React, { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasks';
import TaskForm from './components/Taskform';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData, taskId = null) => {
    try {
      if (taskId) {
        // Update existing task
        const response = await updateTask(taskId, taskData);
        setTasks(tasks.map(task => 
          task._id === taskId ? response.data : task
        ));
        setEditingTask(null);
      } else {
        // Create new task
        const response = await createTask(taskData);
        setTasks([response.data, ...tasks]);
      }
    } catch (error) {
      console.error('Error saving task:', error);
      throw error;
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        setTasks(tasks.filter(task => task._id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const response = await updateTask(taskId, { completed });
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Manager</h1>
        <p>Organize your tasks efficiently</p>
      </header>

      <main className="App-main">
        <div className="container">
          <div className="form-section">
            <TaskForm 
              onTaskAdded={handleAddTask}
              editingTask={editingTask}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          <div className="tasks-section">
            {loading ? (
              <div className="loading">Loading tasks...</div>
            ) : (
              <TaskList 
                tasks={tasks}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
                onToggleComplete={handleToggleComplete}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;