import React, { useState } from "react";
import TodoItem from "./TodoItem";
import "./TodoList.css";

function TodoList({ todos, onToggle, onDelete, onUpdate, loading }) {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created");

  const sortTodos = (todosToSort, sortBy) => {
    const sorted = [...todosToSort];

    switch (sortBy) {
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return sorted.sort((a, b) => {
          const aPriority = priorityOrder[a.priority] || 0;
          const bPriority = priorityOrder[b.priority] || 0;
          return bPriority - aPriority;
        });
      case "dueDate":
        return sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        });
      case "created":
      default:
        return sorted.sort((a, b) => b.createdAt - a.createdAt);
    }
  };

  const getFilteredTodos = () => {
    if (!todos || !Array.isArray(todos)) return [];

    let filtered = [...todos];

    if (filter === "completed") {
      filtered = todos.filter((todo) => todo.completed === true);
    } else if (filter === "false") {
      filtered = todos.filter((todo) => todo.completed === false);
    }

    return sortTodos(filtered, sortBy);
  };

  if (loading) {
    return (
      <div className="card">
        <div className="loading">Chargement des tâches...</div>
      </div>
    );
  }

  const filteredTodos = getFilteredTodos();

  return (
    <div className="card">
      <div className="todo-list-header">
        <h2>Liste des Tâches ({filteredTodos.length})</h2>

        <div className="todo-controls">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">Toutes</option>
            <option value="pending">En cours</option>
            <option value="completed">Terminées</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="created">Date de création</option>
            <option value="priority">Priorité</option>
            <option value="dueDate">Date d'échéance</option>
          </select>
        </div>
      </div>

      {filteredTodos.length === 0 ? (
        <div className="empty-state">
          <p>Aucune tâche trouvée</p>
        </div>
      ) : (
        <div className="todo-items">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;
