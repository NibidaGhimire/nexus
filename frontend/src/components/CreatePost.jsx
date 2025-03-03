import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreatePost from "../hooks/useCreatePost";
import useSubNexus from "../../zustand/useSubNexus";
import Select from "react-select";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { subNexusList } = useSubNexus();
  const [selectedSubNexus, setSelectedSubNexus] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const { loading, createPost } = useCreatePost();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const subNexusOptions = subNexusList.map((subNexus) => ({
    value: subNexus._id,
    label: subNexus.name,
  }));

  const handleSubNexusChange = (selectedOption) => {
    console.log("selectedOption", selectedOption);
    setSelectedSubNexus(selectedOption);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedSubNexusIds = selectedSubNexus.map(
      (subNexus) => subNexus.value
    );

    try {
      await createPost({
        title,
        description,
        pdfFile,
        subNexus: selectedSubNexusIds,
      });
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

        <Select
          isMulti
          options={subNexusOptions}
          className="basic-multi-select text-black"
          classNamePrefix="select"
          placeholder="Select SubNexus"
          value={selectedSubNexus}
          onChange={(selectedOption) => handleSubNexusChange(selectedOption)}
        />
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
