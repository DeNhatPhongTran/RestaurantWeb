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

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
