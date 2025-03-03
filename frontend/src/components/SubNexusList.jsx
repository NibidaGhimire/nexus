import React, { useEffect } from "react";
import useGetSubNexus from "../hooks/useGetSubNexus";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const SubNexusList = () => {
  const { loading, getSubNexus, subNexusList } = useGetSubNexus();
  useEffect(() => {
    getSubNexus();
  }, []);

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
              <Link
                to={`/subnexus/${subNexus._id}`}
                className={`hover:underline flex items-center`}
              >
                <FaPlus className="mr-2" /> {subNexus.name}
              </Link>
            </li>
          ))}
        </ul>
      )}{" "}
    </div>
  );
};

export default SubNexusList;
