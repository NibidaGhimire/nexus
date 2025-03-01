import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegCommentDots } from "react-icons/fa";
import useGetPostsList from "../hooks/useGetPostsList";

const PostsList = () => {
  const { loading, getPostsList, postsList } = useGetPostsList();

  useEffect(() => {
    getPostsList();
  }, []);

  return (
    <div className=" px-4 py-2 w-full shadow-md text-white ">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Posts</h2>
        <Link
          to="/create-post"
          className="bg-purple hover:bg-darkpurple outline hover:outline-gray-100 outline-gray-700 px-4 py-2 rounded-lg text-white"
        >
          Create Post
        </Link>
      </div>
      <div>
        {loading ? (
          <div className="mt-2">Loading...</div>
        ) : (
          <ul className="mt-2 space-y-2">
            {postsList.map((post) => (
              <li key={post._id} className="bg-bg/40 rounded-2xl px-4 py-2 ">
                <Link to={`/post/${post._id}`} className=" flex flex-col gap-2">
                  <h2 className="text-lg font-semibold hover:underline">
                    {post.title}
                  </h2>
                  <p className="text-sm">{post.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FaRegCommentDots className="w-6 h-6" />
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PostsList;
