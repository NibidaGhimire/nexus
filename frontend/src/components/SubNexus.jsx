import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaFire, FaPlus } from "react-icons/fa";
import { MdNewReleases } from "react-icons/md";
import useGetSubNexus from "../hooks/useGetSubNexus";

const SubNexus = () => {
  const { loading, getSubNexus, subNexusList } = useGetSubNexus();
  const location = useLocation();

  useEffect(() => {
    getSubNexus();
  }, []);

  return (
    <div className="bg-bg/40 px-4 py-2 shadow-md text-white w-full h-screen  border-r-1 border-white/40">
      <div className="mb-4">
        <ul className="mt-2 space-y-2">
          <li
            className={`flex items-center px-8 py-4 rounded-2xl ${
              location.pathname === "/" ? "bg-darker" : "text-gray-500"
            }`}
          >
            <FaHome className="mr-2" />
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li
            className={`flex items-center px-8 py-4 rounded-2xl ${
              location.pathname === "/checkplagiarism"
                ? "bg-darker"
                : "text-gray-500"
            }`}
          >
            <FaFire className="mr-2" />
            <Link to="/checkplagiarism" className="hover:underline">
              Check Plagiarism
            </Link>
          </li>
          <li
            className={`flex items-center px-8 py-4 rounded-2xl ${
              location.pathname === "/popular" ? "bg-darker" : "text-gray-500"
            }`}
          >
            <MdNewReleases className="mr-2" />
            <Link to="/popular" className="hover:underline">
              Popular
            </Link>
          </li>
        </ul>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">SubNexus</h2>
        <Link to="/create-subnexus" className="bg-darker hover:bg-lighter outline hover:outline-gray-100 outline-gray-700 px-2 py-1 rounded-lg font-medium">
          +
        </Link>
        </div>
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
        )}
      </div>
    </div>
  );
};

export default SubNexus;
