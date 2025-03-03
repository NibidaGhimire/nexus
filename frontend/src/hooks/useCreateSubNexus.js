import toast from "react-hot-toast";
import { useState } from "react";
import useSubNexus from "../../zustand/useSubNexus";

const useCreateSubNexus = () => {
  const [loading, setLoading] = useState(false);
  const { subNexusList, setSubNexusList } = useSubNexus();

  const createSubNexus = async ({ name, description }) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
   
    try {
      const res = await fetch("/api/subnexus/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Something went wrong");
      }

      const data = await res.json();
      setSubNexusList([...subNexusList, data]);
      toast.success("SubNexus created successfully!");
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error("Error creating subnexus:", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, createSubNexus };
};

export default useCreateSubNexus;
