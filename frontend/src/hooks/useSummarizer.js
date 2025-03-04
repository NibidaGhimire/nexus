import toast from "react-hot-toast";
import { useState } from "react";

const useSummarizer = () => {
  const [loading, setLoading] = useState(false);

  const summarizer = async ({ file }) => {
    setLoading(true);

    const formData = new FormData();

    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/summarize", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await res.json();
      toast.success("Summarization successfull");

      return data;
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Error summarizing", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, summarizer };
};

export default useSummarizer;
