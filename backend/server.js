import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import todoRoutes from "./routes/todoRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/todos", todoRoutes);
app.use("/api/summary", summaryRoutes);

// Health check routes
app.get("/", (req, res) => {
  res.send("Todo Summary Assistant API is running");
});

app.get("/health", (req, res) => {
  const healthCheck = {
    status: "OK",
    message: "Todo Summary Assistant API is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    version: "1.0.0",
    services: {
      gemini: process.env.GEMINI_API_KEY ? "configured" : "not configured",
      slack:
        process.env.SLACK_BOT_TOKEN || process.env.SLACK_WEBHOOK_URL
          ? "configured"
          : "not configured",
    },
  };

  res.status(200).json(healthCheck);
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
