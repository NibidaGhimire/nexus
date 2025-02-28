import express from "express";
import { createPost, getPosts } from "../controllers/post.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create", protectRoute,createPost);
router.get("/", getPosts);

export default router;
