import toast from "react-hot-toast";
import { useState } from "react";
import usePosts from "../../zustand/usePosts";

const useGetComments = () => {
  const [loading, setLoading] = useState(false);
  const { selectedPost, setComments } = usePosts();
  

  const getComments = async () => {
    setLoading(true);

    try {
      const res = await fetch(`/api/posts/${selectedPost._id}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getComments };
};

export default useGetComments;
