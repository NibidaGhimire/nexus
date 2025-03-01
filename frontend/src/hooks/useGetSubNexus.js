import toast from "react-hot-toast";
import useSubNexus from "../../zustand/useSubNexus";
import { useState } from "react";

const useGetSubNexus = () => {
  const [loading, setLoading] = useState(false);
  const { subNexusList, setSubNexusList } = useSubNexus();

  const getSubNexus = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/subnexus");
      const data = await res.json();
      setSubNexusList(data);
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { loading, getSubNexus, subNexusList, setSubNexusList };
};

export default useGetSubNexus;
