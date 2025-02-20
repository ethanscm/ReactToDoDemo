import React from 'react';

function TodoItem({ todo, onDelete, onToggle }) {
  return (
    <li className="todo-item">
      <span
        className={`todo-text ${todo.isComplete ? 'completed' : ''}`}
        onClick={() => onToggle(todo.id)}
      >
        {todo.description}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="delete-button"
      >
        Delete
      </button>
    </li>
  );
}

export default TodoItem;