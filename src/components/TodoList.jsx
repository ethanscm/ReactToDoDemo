import React, { useState, useEffect } from 'react';
import TodoItem from './TodoItem';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(/*INSERT SUPABASE LINK HERE*/, /*INSERT KEY HERE*/);
// Read https://supabase.com/docs/reference/javascript/initializing on how to call createClient.
// This is also not a safe way to interact with supabase. But I will do more research on how
// to do that.

function TodoList() {
  // State for the list of to-dos
  const [todos, setTodos] = useState([]);

  // State for the input field
  const [input, setInput] = useState('');

  // State for the username input field
  const [userInput, setUserInput] = useState('');

  const [currentUser, setCurrentUser] = useState('');

  // Load to-dos from localStorage when the component mounts
  useEffect(() => {
    getUserTasks();
  }, []);

  async function getUserTasks() {
    const { data } = await supabase.from("tasks").select().eq("userName", currentUser);
    setTodos(data || []);
  }

  // Save to-dos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    getUserTasks();
  }, [currentUser]);

  // Handle input field changes
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Handle adding a new to-do
  async function handleAddTodo(e) {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (trimmedInput === '') return;
    
    const {error} = await supabase
      .from("tasks")
      .insert({description: trimmedInput, userName: currentUser});

    if (error) {
      console.log(error.message);
    }

    getUserTasks();   
    setInput('');
  };

  // Handle username lookup
  async function handleUsernameLookup(e) {
    e.preventDefault();
    if (await userExists(userInput)){
      setCurrentUser(userInput);
    } else {
      setCurrentUser('');
    }
  }

  async function userExists(username) {
    const { data } = await supabase.from("users").select().eq("name", username);
    return data.length > 0;
  }

  const handleUserInputChange = (e) => {
    setUserInput(e.target.value);
  }

  // Handle deleting a to-do
  async function handleDelete(id){
    const { error } = await supabase.from("tasks").delete().eq("id", id)
    if(error) {
      console.log(error.message);
    }
    getUserTasks();
  };

  // Handle toggling the completion status of a to-do
  async function toggleCompletion(id){
    const { data } = await supabase.from("tasks").select("isComplete").eq("id", id);

    if (data.length !== 1) {
      return;
    }

    const currentCompletion = data[0].isComplete;

    const { error } = await supabase.from("tasks").update({isComplete: !currentCompletion}).eq("id", id);

    if(error) {
      console.log(error.message);
    }

    getUserTasks();
  };

  return (
    <div className="todo-container">
      <form onSubmit={handleUsernameLookup} className="todo-form">
        <input
          type="text"
          value={userInput}
          onChange={handleUserInputChange}
          placeholder="enter an existing username"
          className="todo-input"
        />
        <button type="submit" className="todo-button">
          Search
        </button>
      </form>
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
      {currentUser !== '' ? (
          todos.length > 0 ? (
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
          )
        ) : (
          <p className="no-tasks">No user found. Please enter an existing user.</p>
        )
      }
    </div>
  );
}

export default TodoList;