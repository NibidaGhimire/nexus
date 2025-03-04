import toast from "react-hot-toast";
import { useState } from "react";
import usePosts from "../../zustand/usePosts";

const useAddReview = () => {
  const [loading, setLoading] = useState(false);
  const { setPostsList, postsList } = usePosts();

  const addReview = async ({ postId, review }) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${postId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId, review }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await res.json();
      setPostsList([...postsList, data]);
      toast.success("Review submitted successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Error submitting review:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, addReview };
};

export default useAddReview;
