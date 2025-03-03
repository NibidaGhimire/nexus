import React from "react";
import useSubNexus from "../../zustand/useSubNexus";

import { RiAdminFill } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import usePosts from "../../zustand/usePosts";
import PostListLayout from "./PostListLayout";

const SubNexusDetails = () => {
  const { selectedSubNexus } = useSubNexus();
  const { postsList } = usePosts();

  const filteredPosts = postsList.filter(
    (post) => post.subNexus._id === selectedSubNexus._id
  );

  return (
    <div className=" w-full ">
      <div className="flex flex-col  gap-4   p-4 bg-bg border-white border-b ">
        <h1 className="text-xl font-semibold text-white">
          {selectedSubNexus.name}
        </h1>
        <p className="text-lg text-gray-400 flex items-center gap-1">
          <RiAdminFill /> {selectedSubNexus.createdBy.username}
        </p>
        <p className="text-lg text-gray-400 flex items-center gap-1">
          <FaUsers className="w-6 h-6" />
          {selectedSubNexus.members.length}
        </p>
        <p className="text-sm text-gray-400">
          {selectedSubNexus.description
            ? selectedSubNexus.description
            : "No description available"}
        </p>
      </div>
      <div>
        <PostListLayout postsList={filteredPosts} />
      </div>
    </div>
  );
};

export default SubNexusDetails;
