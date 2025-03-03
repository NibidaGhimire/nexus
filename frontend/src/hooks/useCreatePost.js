import toast from "react-hot-toast";
import { useState } from "react";
import usePosts from "../../zustand/usePosts";

const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const { postsList, setPostsList } = usePosts();

  const createPost = async ({ title, description, pdfFile, subNexus }) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("subNexus", JSON.stringify(subNexus));
    if (pdfFile) {
      formData.append("pdfFile", pdfFile);
    }

    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await res.json();
      setPostsList([...postsList, data]);
      toast.success("Post created successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, createPost };
};

export default useCreatePost;
