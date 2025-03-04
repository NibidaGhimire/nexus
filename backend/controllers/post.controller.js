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
    let subNexus = req.body.subNexus;

    if (typeof subNexus === "string") {
      try {
        subNexus = JSON.parse(subNexus);
      } catch (error) {
        return res.status(400).json({ error: "Invalid subNexus format" });
      }
    }

    if (!Array.isArray(subNexus)) {
      return res.status(400).json({ error: "subNexus must be an array" });
    }

    const userId = req.user ? req.user._id : null;
    const pdfUrl = req.file ? `/uploads/${req.file.filename}` : "";

    console.log("Creating post with data:", {
      title,
      description,
      pdfUrl,
      userId,
      subNexus,
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
      subNexus,
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

export const addReview = async (req, res) => {
  try {
    const { postId, review } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!userId) {
      return res.status(400).json({ error: "User ID is missing" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newReview = {
      ...review,
      reviewer: userId,
    };

    post.reviews.push(newReview);
    await post.save();
    await post.populate("reviews.reviewer", "username");
    res.status(201).json(post);
  } catch (error) {
    console.error("Error in addReview controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId, comment, username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username is missing" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      comment,
      username,
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();
    await post.populate("comments.username", "username");
    res.status(201).json(post);
  } catch (error) {
    console.error("Error in addComment controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

