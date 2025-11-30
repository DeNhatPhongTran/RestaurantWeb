import express from "express";
import { connectDB } from "./database/db_connect.js";

const app = express();
app.use(express.json());

await connectDB();

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
