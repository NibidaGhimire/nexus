import React, { useEffect } from "react";
import { Link } from "react-router-dom";


import useGetPostsList from "../hooks/useGetPostsList";
import usePosts from "../../zustand/usePosts";
import PostListLayout from "./PostListLayout";

const PostsList = () => {
  const { loading, getPostsList } = useGetPostsList();
  const {postsList} = usePosts();


  useEffect(() => {
    getPostsList();
  }, []);
 

  return (
    <div className="px-4 py-2 w-full shadow-md text-white">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Posts</h2>
        <Link
          to="/create-post"
          className="cursor-pointer bg-secondary hover:bg-lighter outline hover:outline-gray-100 outline-gray-700 px-4 py-2 rounded-lg text-black font-medium"
        >
          Create Post
        </Link>
      </div>
      <div>
        {loading ? (
          <div className="mt-2">Loading...</div>
        ) : (
          <PostListLayout postsList={postsList}/>
        )}
      </div>
    </div>
  );
};

export default PostsList;
