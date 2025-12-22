import express from "express";
import { connectDB } from "./database/db_connect.js";
import reservationsRoute from './routes/reservations.js'
import dishMenuRoute from './routes/dish_menu.js'

const app = express();

app.use(express.json());

await connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

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
