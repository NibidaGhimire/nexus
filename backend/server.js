import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import subnexusRoutes from "./routes/subnexus.routes.js";

import connectToMongoDb from "./db/connectToMongoDB.js";

const PORT = process.env.PORT || 5000;

const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/subnexus", subnexusRoutes);

app.listen(PORT, () => {
  connectToMongoDb();
  console.log(`Server running on port: ${PORT}`);
});
