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

// Middleware - CORS configuration (allows requests from anywhere)
const corsOptions = {
  origin: "*", // Allow requests from any origin
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
  ],
  credentials: false, // Set to true if you need to send cookies/auth headers
  optionsSuccessStatus: 200, // For legacy browser support
};
app.use(cors(corsOptions));

// Additional CORS headers for maximum compatibility
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept, Origin"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

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
