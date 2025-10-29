import React, { useState } from 'react';

const TaskForm = ({ onTaskAdded, editingTask, onCancelEdit }) => {
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [dueDate, setDueDate] = useState(editingTask?.dueDate?.split('T')[0] || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const taskData = {
      title,
      description,
      dueDate: dueDate || undefined
    };

    try {
      if (editingTask) {
        await onTaskAdded(taskData, editingTask._id);
      } else {
        await onTaskAdded(taskData);
      }
      
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h3>{editingTask ? 'Edit Task' : 'Add New Task'}</h3>
      
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Due Date:</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
        {editingTask && (
          <button type="button" onClick={onCancelEdit} className="btn btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;