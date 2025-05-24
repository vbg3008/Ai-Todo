import React, { useState } from "react";

const TodoItem = ({ todo, toggleTodo, updateTodo, deleteTodo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: todo.title,
    description: todo.description || "",
    priority: todo.priority,
    due_date: todo.due_date ? todo.due_date.split("T")[0] : "", // Format for date input
  });

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle edit form submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editForm.title.trim()) return;

    updateTodo(todo.id, {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      priority: editForm.priority,
      dueDate: editForm.due_date || null,
    });

    setIsEditing(false);
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditForm({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority,
      due_date: todo.due_date ? todo.due_date.split("T")[0] : "",
    });
    setIsEditing(false);
  };

  // Get priority badge class based on priority level
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case "high":
        return "priority-badge priority-high";
      case "medium":
        return "priority-badge priority-medium";
      case "low":
        return "priority-badge priority-low";
      default:
        return "priority-badge priority-medium";
    }
  };

  // Format due date for display
  const formatDueDate = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    // Format as "Month Day, Year"
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Check if due date is approaching (within 2 days)
  const isDueSoon = (dateString) => {
    if (!dateString) return false;

    const dueDate = new Date(dateString);
    if (isNaN(dueDate.getTime())) return false;

    const today = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(today.getDate() + 2);

    return dueDate <= twoDaysFromNow && dueDate >= today;
  };

  // Check if due date is overdue
  const isOverdue = (dateString) => {
    if (!dateString) return false;

    const dueDate = new Date(dateString);
    if (isNaN(dueDate.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day

    return dueDate < today;
  };

  if (isEditing) {
    return (
      <div className={`todo-item ${todo.completed ? "completed" : ""} editing`}>
        <form onSubmit={handleEditSubmit} className="todo-edit-form">
          <div className="edit-form-row">
            <input
              type="text"
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              placeholder="Todo title"
              required
              className="edit-input edit-title"
            />
            <select
              name="priority"
              value={editForm.priority}
              onChange={handleEditChange}
              className="edit-select edit-priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="edit-form-row">
            <textarea
              name="description"
              value={editForm.description}
              onChange={handleEditChange}
              placeholder="Description (optional)"
              className="edit-textarea edit-description"
              rows="2"
            />
          </div>
          <div className="edit-form-row">
            <input
              type="date"
              name="due_date"
              value={editForm.due_date}
              onChange={handleEditChange}
              className="edit-input edit-date"
            />
          </div>
          <div className="edit-form-actions">
            <button type="submit" className="btn btn-save">
              Save
            </button>
            <button
              type="button"
              onClick={handleEditCancel}
              className="btn btn-cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`todo-item ${todo.completed ? "completed" : ""}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="todo-checkbox"
        />
        <div className="todo-text">
          <div className="todo-header">
            <h3 className="todo-title">{todo.title}</h3>
            <span className={getPriorityBadgeClass(todo.priority)}>
              {todo.priority}
            </span>
          </div>
          {todo.description && (
            <p className="todo-description">{todo.description}</p>
          )}
          {todo.due_date && (
            <div
              className={`todo-due-date ${
                isOverdue(todo.due_date)
                  ? "overdue"
                  : isDueSoon(todo.due_date)
                  ? "due-soon"
                  : ""
              }`}
            >
              <span className="due-date-label">Due:</span>{" "}
              {formatDueDate(todo.due_date)}
              {isOverdue(todo.due_date) && (
                <span className="due-status overdue">Overdue</span>
              )}
              {isDueSoon(todo.due_date) && !isOverdue(todo.due_date) && (
                <span className="due-status due-soon">Due Soon</span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="todo-actions">
        <button
          onClick={() => setIsEditing(true)}
          className="btn btn-edit"
          aria-label="Edit todo"
        >
          Edit
        </button>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="btn btn-delete"
          aria-label="Delete todo"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
