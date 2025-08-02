// server.js

const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const helmet = require("helmet");
const app = express();
const PORT = process.env.PORT;
const connectDB = require("./Config/database");
const logger = require("./Config/logger");
const itemRoutes = require("./Routes/itemRoutes");

// Connect to MongoDB
connectDB();

// Log incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`); // Log method and URL
  next();
});
// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle MongoDB connection events
mongoose.connection.on("disconnected", () => {
  console.log("❌ MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB error:", err);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    mongodb:
      mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Express + MongoDB + Mongoose CRUD API! ",
    endpoints: {
      "GET /": "This endpoint",
      "GET /health": "Health check",
      "GET /items": "Get all items",
      "GET /items/:id": "Get item by ID",
      "POST /items": "Create new item",
      "PUT /items/:id": "Update item by ID",
      "DELETE /items/:id": "Delete item by ID",
    },
  });
});

// Routes
app.use("/items", itemRoutes);
// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});
// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT. Graceful shutdown...");
  await mongoose.connection.close();
  console.log("📀 MongoDB connection closed.");
  process.exit(0);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`📋 API endpoints available at http://localhost:${PORT}/`);
});
