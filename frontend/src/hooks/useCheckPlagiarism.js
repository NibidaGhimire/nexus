import toast from "react-hot-toast";
import { useState } from "react";

const useCheckPlagiarism = () => {
  const [loading, setLoading] = useState(false);

  const checkPlagiarism = async ({ file, similarityThreshold }) => {
    setLoading(true);

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }
formData.append("similarity_threshold", similarityThreshold);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/check-plagiarism", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await res.json();
      toast.success("Plagiarism check successfull");

      return data;
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Error checking plagiarism:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, checkPlagiarism };
};

export default useCheckPlagiarism;
