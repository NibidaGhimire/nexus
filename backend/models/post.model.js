import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    clarity: { type: Number, required: true },
    methodology: { type: Number, required: true },
    quality: { type: Number, required: true },
    logicalFlow: { type: Number, required: true },
    writingStyle: { type: Number, required: true },
    citation: { type: Number, required: true },
    contribution: { type: Number, required: true },
    review: { type: String, required: true },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);


const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pdfUrl: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    downvotes: {
      type: Number,
      default: 0,
    },

    comments: [
      {
        type: String,
      },
    ],
    subNexus: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubNexus",
        required: true,
      },
    ],
    reviews: [reviewSchema]
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
