import React from 'react';

function TodoItem({ todo, onDelete, onToggle }) {
  return (
    <li className="todo-item">
      <span
        className={`todo-text ${todo.completed ? 'completed' : ''}`}
        onClick={() => onToggle(todo.id)}
      >
        {todo.text}
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