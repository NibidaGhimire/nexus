import toast from "react-hot-toast";
import { useState } from "react";

const useAddComment = () => {
  const [loading, setLoading] = useState(false);

  const addComment = async ({ postId, comment, username }) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/addComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, comment, username }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      toast.success("Comment Sent successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Error sending comment:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, addComment };
};

export default useAddComment;
