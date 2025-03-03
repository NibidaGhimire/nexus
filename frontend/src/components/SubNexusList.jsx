import React, { useEffect } from "react";
import useGetSubNexus from "../hooks/useGetSubNexus";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import useSubNexus from "../../zustand/useSubNexus";

const SubNexusList = () => {
  const { loading, getSubNexus, subNexusList } = useGetSubNexus();
  const { setSelectedSubNexus } = useSubNexus();
  const navigate = useNavigate();

  useEffect(() => {
    getSubNexus();
  }, []);

  const handleSubNexusClick = (subNexus) => {
    setSelectedSubNexus(subNexus);
    navigate(`/subnexus/${subNexus._id}`);
  };

  return (
    <div>
      {loading ? (
        <div className="mt-2">Loading...</div>
      ) : (
        <ul className="space-y-2">
          {subNexusList.map((subNexus) => (
            <li
              key={subNexus._id}
              className={`flex items-center px-8 py-4 rounded-2xl  w-full ${
                location.pathname === `/subnexus/${subNexus._id}`
                  ? "bg-darker"
                  : "text-gray-500"
              }`}
            >
              <div
                className={`hover:underline flex items-center cursor-pointer`}
                onClick={() => handleSubNexusClick(subNexus)}
              >
                <FaPlus className="mr-2" /> {subNexus.name}
              </div>
            </li>
          ))}
        </ul>
      )}{" "}
    </div>
  );
};

export default SubNexusList;
