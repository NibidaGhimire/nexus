import express from "express";
import {
  addReview,
  createPost,
  getPosts,
  upload,
} from "../controllers/post.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create", protectRoute, upload.single("pdfFile"), createPost);
router.get("/", getPosts);
router.post("/:id/reviews",protectRoute, addReview);

export default router;
