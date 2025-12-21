import express from "express";
import cors from "cors";
import { connectDB } from "./database/db_connect.js";
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

await connectDB();

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Backend is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

const server = app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
