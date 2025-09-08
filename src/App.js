import React, { useState, useEffect } from "react";
import "./App.css";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TodoStats from "./components/TodoStats";

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);

        const savedTodos = localStorage.getItem("todos");
        if (savedTodos) {
          setTodos(JSON.parse(savedTodos));
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://jsonplaceholder.typicode.com/todos"
        );
        const data = await response.json();
        const initialTodos = data.slice(0, 5);
        setTodos(initialTodos);

        localStorage.setItem("todos", JSON.stringify(initialTodos));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = (todoData) => {
    const newTodo = {
      id: Date.now(),
      createdAt:Date.now(),
      title: todoData.title,
      description: todoData.description || "",
      priority: todoData.priority || "medium",
      dueDate: todoData.dueDate || "",
      completed: false,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const updateTodo = (id, newData) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, ...newData } : todo))
    );
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo App - Test Technique</h1>
        <p>Trouvez et corrigez les bugs !</p>
      </header>

      <main className="App-main">
        <TodoForm onAdd={addTodo} />

        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onUpdate={updateTodo}
        />

        <TodoStats todos={todos} />
      </main>
    </div>
  );
}

export default App;
