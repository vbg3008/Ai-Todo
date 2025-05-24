// In-memory storage for todos
let todos = [];

// Get all todos with optional filtering and sorting
export const getTodos = (req, res) => {
  const { status, sortBy, order } = req.query;

  // Create a copy of the todos array to avoid modifying the original
  let filteredTodos = [...todos];

  // Filter by status if provided
  if (status) {
    const isCompleted = status === "completed";
    filteredTodos = filteredTodos.filter(
      (todo) => todo.completed === isCompleted
    );
  }

  // Sort todos if sortBy is provided
  if (sortBy) {
    const sortOrder = order === "desc" ? -1 : 1;

    filteredTodos.sort((a, b) => {
      // Handle different sort fields
      if (sortBy === "title") {
        return sortOrder * a.title.localeCompare(b.title);
      } else if (sortBy === "createdAt") {
        return sortOrder * (new Date(a.createdAt) - new Date(b.createdAt));
      } else if (sortBy === "priority") {
        // Convert priority to numeric value for sorting
        const priorityValues = { high: 3, medium: 2, low: 1 };
        const priorityA = priorityValues[a.priority] || 2;
        const priorityB = priorityValues[b.priority] || 2;
        return sortOrder * (priorityA - priorityB);
      } else if (sortBy === "dueDate") {
        // Handle null due dates (put them at the end)
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return sortOrder;
        if (!b.dueDate) return -sortOrder;
        return sortOrder * (new Date(a.dueDate) - new Date(b.dueDate));
      }
      return 0;
    });
  }

  res.status(200).json(filteredTodos);
};

// Create a new todo
export const createTodo = (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  // Validate priority if provided
  const validPriorities = ["low", "medium", "high"];
  const todoPriority =
    priority && validPriorities.includes(priority.toLowerCase())
      ? priority.toLowerCase()
      : "medium";

  // Validate due date if provided
  let todoDueDate = null;
  if (dueDate) {
    try {
      // Ensure the date is valid
      const parsedDate = new Date(dueDate);
      if (!isNaN(parsedDate.getTime())) {
        todoDueDate = parsedDate.toISOString();
      }
    } catch (err) {
      console.error("Invalid date format:", err);
    }
  }

  const newTodo = {
    id: Date.now().toString(),
    title,
    description: description || "",
    priority: todoPriority,
    dueDate: todoDueDate,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
};

// Update a todo
export const updateTodo = (req, res) => {
  const { id } = req.params;
  const { title, description, completed, priority, dueDate } = req.body;

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  // Validate priority if provided
  let todoPriority = todos[todoIndex].priority;
  if (priority !== undefined) {
    const validPriorities = ["low", "medium", "high"];
    todoPriority = validPriorities.includes(priority.toLowerCase())
      ? priority.toLowerCase()
      : todos[todoIndex].priority;
  }

  // Validate due date if provided
  let todoDueDate = todos[todoIndex].dueDate;
  if (dueDate !== undefined) {
    if (dueDate === null) {
      // Allow clearing the due date
      todoDueDate = null;
    } else {
      try {
        // Ensure the date is valid
        const parsedDate = new Date(dueDate);
        if (!isNaN(parsedDate.getTime())) {
          todoDueDate = parsedDate.toISOString();
        }
      } catch (err) {
        console.error("Invalid date format:", err);
      }
    }
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    title: title !== undefined ? title : todos[todoIndex].title,
    description:
      description !== undefined ? description : todos[todoIndex].description,
    priority: todoPriority,
    dueDate: todoDueDate,
    completed: completed !== undefined ? completed : todos[todoIndex].completed,
    updatedAt: new Date().toISOString(),
  };

  res.status(200).json(todos[todoIndex]);
};

// Delete a todo
export const deleteTodo = (req, res) => {
  const { id } = req.params;

  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  const deletedTodo = todos[todoIndex];
  todos = todos.filter((todo) => todo.id !== id);

  res.status(200).json(deletedTodo);
};
