import { createClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase URL or Anon Key. Check your environment variables."
  );
}

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl || "https://udmexdvuitchdiuqdgqz.supabase.co",
  supabaseAnonKey ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkbWV4ZHZ1aXRjaGRpdXFkZ3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgwMDk0MTAsImV4cCI6MjA2MzU4NTQxMH0.mtO_kGb_eeS3jrgmT2raWSwHPUv8KD47eVtj4ysMNbQ"
);

// Todo table operations
export const todoService = {
  // Get all todos
  async getTodos() {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching todos:", error);
        throw error;
      }

      return data || [];
    } catch (err) {
      console.error("Exception in getTodos:", err);
      throw err;
    }
  },

  // Add a new todo
  async addTodo(todo) {
    try {
      // Create the todo object
      const todoData = {
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority || "medium",
        due_date: todo.dueDate,
        completed: false,
      };

      // Insert the todo
      const { data, error } = await supabase
        .from("todos")
        .insert([todoData])
        .select();

      if (error) {
        console.error("Error adding todo:", error);
        throw error;
      }

      return data?.[0];
    } catch (err) {
      console.error("Exception in addTodo:", err);
      throw err;
    }
  },

  // Update a todo
  async updateTodo(id, updates) {
    const { data, error } = await supabase
      .from("todos")
      .update({
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        due_date: updates.dueDate,
        completed: updates.completed,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating todo:", error);
      throw error;
    }

    return data?.[0];
  },

  // Toggle todo completion
  async toggleTodo(id, currentStatus) {
    const { data, error } = await supabase
      .from("todos")
      .update({
        completed: !currentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error toggling todo:", error);
      throw error;
    }

    return data?.[0];
  },

  // Delete a todo
  async deleteTodo(id) {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }

    return true;
  },
};
