import Post from "../models/post.model.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user ? req.user._id : null; // Ensure req.user is defined
    const pdfUrl = req.file ? `/uploads/${req.file.filename}` : "";

    console.log("Creating post with data:", {
      title,
      description,
      pdfUrl,
      userId,
    });

    if (!userId) {
      console.error("User ID is missing");
      return res.status(400).json({ error: "User ID is missing" });
    }
    
    const newPost = new Post({
      title,
      description,
      pdfUrl,
      author: userId,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in getPosts controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
