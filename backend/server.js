import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "DELETE", "PUT"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// Routes

app.listen(PORT, () => {
  console.log("Server is Connected on PORT " + PORT);
  connectDB();
});
