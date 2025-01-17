import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';

function TodoList() {
  // State for the list of to-dos
  const [todos, setTodos] = useState([]);

  // State for the input field
  const [input, setInput] = useState('');

  // Load to-dos from localStorage when the component mounts
  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'));
    if (storedTodos) {
      setTodos(storedTodos);
    }
  }, []);

  // Save to-dos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Handle input field changes
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Handle adding a new to-do
  const handleAddTodo = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput === '') return;
    const newTodo = {
      id: Date.now(),
      text: trimmedInput,
      completed: false,
    };
    setTodos([...todos, newTodo]);
    setInput('');
  };

  // Handle deleting a to-do
  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Handle toggling the completion status of a to-do
  const toggleCompletion = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: !todo.completed }
          : todo
      )
    );
  };

  return (
    <div className="todo-container">
      <form onSubmit={handleAddTodo} className="todo-form">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Add a new task"
          className="todo-input"
        />
        <button type="submit" className="todo-button">
          Add
        </button>
      </form>
      {todos.length > 0 ? (
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={handleDelete}
              onToggle={toggleCompletion}
            />
          ))}
        </ul>
      ) : (
        <p className="no-tasks">No tasks! Add a task to get started.</p>
      )}
    </div>
  );
}

export default TodoList;