import React from 'react';

const TaskList = ({ tasks, onEditTask, onDeleteTask, onToggleComplete }) => {
  if (tasks.length === 0) {
    return <div className="no-tasks">No tasks found. Add a task to get started!</div>;
  }

  return (
    <div className="task-list">
      <h3>Your Tasks ({tasks.length})</h3>
      {tasks.map((task) => (
        <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <div className="task-content">
            <div className="task-header">
              <h4>{task.title}</h4>
              <div className="task-actions">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleComplete(task._id, !task.completed)}
                  className="complete-checkbox"
                />
                <button
                  onClick={() => onEditTask(task)}
                  className="btn btn-edit"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteTask(task._id)}
                  className="btn btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
            
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
            
            {task.dueDate && (
              <p className="task-due-date">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
            
            <p className="task-created">
              Created: {new Date(task.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
