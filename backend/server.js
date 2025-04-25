import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth-routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is Connected on PORT " + PORT);
  connectDB();
});
