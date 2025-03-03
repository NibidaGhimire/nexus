import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCreateSubNexus from "../hooks/useCreateSubNexus";

const CreateSubNexus = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { loading, createSubNexus } = useCreateSubNexus();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSubNexus({ name, description });
      navigate("/");
    } catch (error) {
      console.error("Error creating subnexus:", error);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-bg/40">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 p-6 rounded-lg shadow-lg text-white w-full min-h-[400px]"
      >
        <h3 className="text-xl font-semibold text-center w-full px-8 py-4">
          Create SubNexus
        </h3>
        <input
          type="text"
          placeholder="Name"
          className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="px-4 py-2 rounded-lg bg-gray-700 h-40 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-secondary text-black font-medium rounded-lg hover:bg-lighter hover:text-black focus:outline-none focus:ring-2 focus:ring-secondary"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create SubNexus"}
        </button>
      </form>
    </div>
  );
};

export default CreateSubNexus;
