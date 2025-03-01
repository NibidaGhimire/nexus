import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreatePost from "../hooks/useCreatePost";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const { loading, createPost } = useCreatePost();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPost({ title, description, pdfFile });
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="flex justify-center min-h-screen  bg-bg/40">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6  rounded-lg shadow-lg text-white w-full min-h-[400px]"
      >
        <h3 className="text-xl font-semibold text-center w-full px-8 py-4">
          Create Post
        </h3>
        <input
          type="text"
          placeholder="Title"
          className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="px-4 py-2 rounded-lg bg-gray-700 h-40 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept="application/pdf"
          className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
          onChange={handleFileChange}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-secondary text-black font-medium rounded-lg hover:bg-lighter hover:text-black focus:outline-none focus:ring-2 focus:ring-secondary"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;

