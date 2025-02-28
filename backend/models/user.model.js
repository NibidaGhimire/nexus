import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    totalUpvotes: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
      enum: ["none", "junior reviewer", "senior reviewer", "expert"],
      default: "none",
    },
  },
  { timestamps: true }
);



const User= mongoose.model("User",userSchema);
export default User;
