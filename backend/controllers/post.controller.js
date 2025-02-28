import Post from "../models/post.model.js";
import multer from "multer";
import path from "path";

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

export const upload = multer({ storage });

export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.user._id; // Assuming you have user ID in req.user
    const pdfUrl = req.file ? `/uploads/${req.file.filename}` : "";

    const newPost = new Post({
      title,
      description,
      pdfUrl,
      author: userId,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.log("Error in createPost controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "username");
    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getPosts controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
