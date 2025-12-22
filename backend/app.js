import express from "express";
import cors from "cors";
import { connectDB } from "./database/db_connect.js";
import authRoutes from "./routes/auth.js";
import menuRoutes from "./routes/menu.js";
import reservationsRoute from './routes/reservations.js'
import dishMenuRoute from './routes/dish_menu.js'

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
app.use('/api/reservations', reservationsRoute)
app.use('/api/dish_menu', dishMenuRoute)

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
