import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import TodoFilter from "./components/TodoFilter";
import SummarySection from "./components/SummarySection";
import Modal from "./components/Modal";
import { todoService } from "./utils/supabaseClient";

const App = () => {
  // State for todos
  const [todos, setTodos] = useState([]);
  const [summary, setSummary] = useState("");
  const [isLoadingTodos, setIsLoadingTodos] = useState(false);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState(null);

  // Filter and sort state
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch todos from Supabase on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setIsLoadingTodos(true);
        const data = await todoService.getTodos();
        setTodos(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch todos");
        console.error("Error fetching todos:", err);
      } finally {
        setIsLoadingTodos(false);
      }
    };

    fetchTodos();
  }, []);

  // API base URL
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Filter and sort todos from Supabase
  const filterAndSortTodos = useCallback(() => {
    try {
      // Get todos from state (already loaded from Supabase)
      let filteredTodos = [...todos];

      // Filter by status if not "all"
      if (filterStatus !== "all") {
        const isCompleted = filterStatus === "completed";
        filteredTodos = filteredTodos.filter(
          (todo) => todo.completed === isCompleted
        );
      }

      // Sort todos
      const sortOrder_num = sortOrder === "desc" ? -1 : 1;

      filteredTodos.sort((a, b) => {
        // Handle different sort fields
        if (sortBy === "title") {
          return sortOrder_num * a.title.localeCompare(b.title);
        } else if (sortBy === "created_at") {
          return (
            sortOrder_num * (new Date(a.created_at) - new Date(b.created_at))
          );
        } else if (sortBy === "priority") {
          // Convert priority to numeric value for sorting
          const priorityValues = { high: 3, medium: 2, low: 1 };
          const priorityA = priorityValues[a.priority] || 2;
          const priorityB = priorityValues[b.priority] || 2;
          return sortOrder_num * (priorityA - priorityB);
        } else if (sortBy === "due_date") {
          // Handle null due dates (put them at the end)
          if (!a.due_date && !b.due_date) return 0;
          if (!a.due_date) return sortOrder_num;
          if (!b.due_date) return -sortOrder_num;
          return sortOrder_num * (new Date(a.due_date) - new Date(b.due_date));
        }
        return 0;
      });

      return filteredTodos;
    } catch (err) {
      setError("Failed to process todos");
      console.error("Error processing todos:", err);
      return [];
    }
  }, [todos, filterStatus, sortBy, sortOrder, setError]);

  // State for filtered todos
  const [filteredTodos, setFilteredTodos] = useState([]);

  // Update filtered todos when filter/sort criteria or todos change
  useEffect(() => {
    const result = filterAndSortTodos();
    setFilteredTodos(result);
  }, [filterAndSortTodos]);

  // Add a new todo
  const addTodo = async (todo) => {
    try {
      setIsLoadingTodos(true);

      // Add todo to Supabase
      const newTodo = await todoService.addTodo(todo);

      // Update state
      setTodos([...todos, newTodo]);
      setError(null);
    } catch (err) {
      setError("Failed to add todo");
      console.error("Error adding todo:", err);
    } finally {
      setIsLoadingTodos(false);
    }
  };

  // Toggle todo completion status
  const toggleTodo = async (id) => {
    try {
      setIsLoadingTodos(true);

      // Find the todo to toggle
      const todoToToggle = todos.find((todo) => todo.id === id);
      if (!todoToToggle) return;

      // Update in Supabase
      const updatedTodo = await todoService.toggleTodo(
        id,
        todoToToggle.completed
      );

      // Update state
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));

      setError(null);
    } catch (err) {
      setError("Failed to update todo");
      console.error("Error updating todo:", err);
    } finally {
      setIsLoadingTodos(false);
    }
  };

  // Update a todo
  const updateTodo = async (id, updates) => {
    try {
      setIsLoadingTodos(true);

      // Update in Supabase
      const updatedTodo = await todoService.updateTodo(id, updates);

      // Update state
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));

      setError(null);
    } catch (err) {
      setError("Failed to update todo");
      console.error("Error updating todo:", err);
    } finally {
      setIsLoadingTodos(false);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      setIsLoadingTodos(true);

      // Delete from Supabase
      await todoService.deleteTodo(id);

      // Update state
      setTodos(todos.filter((todo) => todo.id !== id));

      setError(null);
    } catch (err) {
      setError("Failed to delete todo");
      console.error("Error deleting todo:", err);
    } finally {
      setIsLoadingTodos(false);
    }
  };

  // Generate summary of todos
  const generateSummary = async () => {
    try {
      setIsLoadingSummary(true);

      // Get pending todos
      const pendingTodos = todos.filter((todo) => !todo.completed);

      if (pendingTodos.length === 0) {
        setSummary("You have no pending tasks. Great job!");
        setError(null);
        setIsLoadingSummary(false);
        return;
      }

      // Format todos for the backend (convert snake_case to camelCase for consistency)
      const formattedTodos = pendingTodos.map((todo) => ({
        id: todo.id,
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority || "medium",
        dueDate: todo.due_date,
        completed: todo.completed,
        createdAt: todo.created_at,
      }));

      // Send todos to backend for summarization
      const response = await fetch(`${API_URL}/summary/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ todos: formattedTodos }),
      });

      const data = await response.json();
      setSummary(data.summary);
      setError(null);
    } catch (err) {
      setError("Failed to generate summary");
      console.error("Error generating summary:", err);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Send summary to Slack
  const sendToSlack = async () => {
    if (!summary) {
      setError("Please generate a summary first");
      throw new Error("Please generate a summary first");
    }

    try {
      setIsLoadingSummary(true);

      const response = await fetch(`${API_URL}/summary/send-to-slack`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ summary }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send to Slack");
      }

      setError(null);
      return data; // Return the data so it can be used by the component
    } catch (err) {
      console.error("Error sending to Slack:", err);
      setError("Failed to send to Slack");
      throw err; // Re-throw the error so it can be caught by the component
    } finally {
      setIsLoadingSummary(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Todo Summary Assistant</h1>
      </header>

      <main>
        <div className="todo-section">
          <div className="todo-header">
            <h2>Your Todos</h2>
            <button
              className="btn btn-primary add-todo-btn"
              onClick={() => setIsModalOpen(true)}
            >
              + Add Todo
            </button>
          </div>

          <TodoFilter
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />

          {error && <div className="error-message">{error}</div>}
          {isLoadingTodos ? (
            <div className="loading">Loading...</div>
          ) : (
            <TodoList
              todos={filteredTodos}
              toggleTodo={toggleTodo}
              updateTodo={updateTodo}
              deleteTodo={deleteTodo}
            />
          )}
        </div>

        <SummarySection
          generateSummary={generateSummary}
          sendToSlack={sendToSlack}
          summary={summary}
          isLoading={isLoadingSummary}
        />

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Todo"
        >
          <TodoForm addTodo={addTodo} onClose={() => setIsModalOpen(false)} />
        </Modal>
      </main>
    </div>
  );
};

export default App;
