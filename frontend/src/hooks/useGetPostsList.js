import toast from "react-hot-toast";
import { useState } from "react";
import usePosts from "../../zustand/usePosts";

const useGetPostsList = () => {
  const [loading, setLoading] = useState(false);
  const { postsList, setPostsList } = usePosts();

  const getPostsList = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPostsList(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getPostsList, postsList, setPostsList };
};

export default useGetPostsList;
