import React, { useEffect, useState } from "react";
import { FaRegCommentDots } from "react-icons/fa";
import { BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";
import usePosts from "../../zustand/usePosts";
import { useAuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaBookmark } from "react-icons/fa";

const PostDetails = () => {
  const { selectedPost, setSavedPosts } = usePosts();
  const [comments, setComments] = useState([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const { authUser } = useAuthContext();
  const [authormatch, setAuthormatch] = useState(false);

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
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Comments</h3>
        {comments.length > 0 ? (
          <ul className="mt-2 space-y-2">
            {comments.map((comment) => (
              <li key={comment._id} className="bg-bg/40 px-4 py-2 rounded-lg">
                <p className="text-gray-500 text-sm">
                  {comment.author.username}
                </p>
                <p className="text-white">{comment.text}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-gray-400">No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default PostDetails;
