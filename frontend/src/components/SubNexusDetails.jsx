import React from "react";
import useSubNexus from "../../zustand/useSubNexus";

const SubNexusDetails = () => {
  const { selectedSubNexus } = useSubNexus();

  return (
    <div className="bg-bg p-4 rounded-2xl">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-white">
          {selectedSubNexus.name}
        </h1>
      </div>
    </div>
  );
};

export default SubNexusDetails;
