import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import { spawn } from "child_process";


import authRoutes from "./routes/auth.routes.js"

import connectToMongoDb from "./db/connectToMongoDB.js";

const PORT = process.env.PORT || 5000;

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  connectToMongoDb();
  console.log(`Server running on port: ${PORT}`)
});
