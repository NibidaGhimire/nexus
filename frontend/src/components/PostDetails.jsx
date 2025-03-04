import React, { useEffect, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import usePosts from "../../zustand/usePosts";
import { useAuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaBookmark } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import useAddComment from "../hooks/useAddComment";
import Comments from "./Comments";

const PostDetails = () => {
  const { selectedPost, setSavedPosts } = usePosts();
  const [comment, setComment] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { authUser } = useAuthContext();
  const [authormatch, setAuthormatch] = useState(false);
  const { addComment } = useAddComment();

  const handleAddComment = async (e) => {
    e.preventDefault();
    await addComment({
      postId: selectedPost._id,
      comment: comment,
      username: authUser.username,
    });
    setComment("");
  };

  useEffect(() => {
    if (selectedPost && authUser) {
      setAuthormatch(selectedPost.author._id === authUser._id);
    }
  }, [selectedPost, authUser]);

  return (
    <div className="px-4 py-2 w-full shadow-md text-white">
      <h2 className="text-2xl font-semibold">{selectedPost.title}</h2>
      <p className="text-gray-500 text-sm">
        {selectedPost.author.username} -{" "}
        {new Date(selectedPost.createdAt).toDateString()}
      </p>
      <p className="mt-4 text-lg">{selectedPost.description}</p>
      <div>
        <embed
          src={`${apiUrl}${selectedPost.pdfUrl}`}
          type="application/pdf"
          width="100%"
          height="500px"
        />
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <BiSolidUpvote className="w-6 h-6" />
            {/* <span>{selectedPost.upvotes}</span> */}
          </div>
          <div className="flex items-center gap-2">
            <BiSolidDownvote className="w-6 h-6" />
            {/* <span>{selectedPost.downvotes}</span> */}
          </div>
          <div className="flex items-center gap-2">
            <FaRegCommentDots className="w-6 h-6" />
            {/* <span>{comments.length}</span> */}
          </div>
        </div>
        <div className="flex  items-center gap-4">
          <button onClick={() => setSavedPosts(selectedPost._id)}>
            <FaBookmark className="w-6 h-6" />
          </button>
          {!authormatch && (
            <Link to={`/post/${selectedPost._id}/addreview`}>
              <button className="bg-secondary hover:bg-lighter outline hover:outline-gray-100 outline-gray-700 px-4 py-2 rounded-lg text-black font-medium">
                Add Custom Review
              </button>
            </Link>
          )}
          {authormatch && (
            <Link to={`/post/${selectedPost._id}/reviews`}>
              <button className="bg-secondary hover:bg-lighter outline hover:outline-gray-100 outline-gray-700 px-4 py-2 rounded-lg text-black font-medium">
                View Custom Reviews
              </button>
            </Link>
          )}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <h3 className="text-xl font-semibold">Comments</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a comment"
            className="w-full mt-2 p-2 outline rounded-2xl"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleAddComment}>
            <IoSend className="w-6 h-6" />{" "}
          </button>
        </div>
        <div>
          <Comments />
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
