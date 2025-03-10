import { useState } from "react";
import useCheckPlagiarism from "../hooks/useCheckPlagiarism";
import toast from "react-hot-toast";

const CheckPlagiarism = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [similarityThreshold, setSimilarityThreshold] = useState();
  const { checkPlagiarism } = useCheckPlagiarism();
  const [plagiarismResult, setPlagiarismResult] = useState(null);

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleCheckPlagiarism = async (e) => {
    
    e.preventDefault();
    if (!pdfFile) {
      toast.error("Please upload a PDF file first.");
      return;
    }
    const result = await checkPlagiarism({
      file: pdfFile,
      similarityThreshold,
    });
    setPlagiarismResult(result);
    setPdfFile(null);
    setSimilarityThreshold();
  };

  return (
    <div className="bg-bg/40 px-4 py-2 shadow-md text-white w-full h-screen  border-r-1 border-white/40 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Check Plagiarism</h1>
      <div className="mt-2 bg-gray-900 flex flex-col gap-8 text-center items-center outline-dotted outline-2 outline-gray-500 p-4">
        <h2>Upload File</h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            const file = e.target[0].files[0];
            console.log(file);
          }}
        >
          <input
            className="text-center bg-bg outline  p-2 rounded-lg"
            type="number"
            required
            placeholder="Enter Similarity Threshold"
            value={similarityThreshold}
            onChange={(e) => setSimilarityThreshold(e.target.value)}
          />
          <input
            type="file"
            accept="application/pdf"
            className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
            onChange={handleFileChange}
          />
          <div className="flex w-full justify-center gap-4">
            <button
              onClick={handleCheckPlagiarism}
              className="bg-secondary hover:bg-lighter outline hover:outline-gray-100 outline-gray-700 px-4 py-2 rounded-lg text-black font-medium"
            >
              Check Plagiarism
            </button>
          </div>
        </form>
        {plagiarismResult && (
          <div className="mt-4 bg-gray-800 p-4 rounded-lg text-left">
            <h3 className="text-lg font-semibold">Plagiarism Results</h3>
            <p>
              Overall Plagiarism Percentage:{" "}
              {plagiarismResult.overall_plagiarism_percentage}%
            </p>
            <p>
              Total Chunks Analyzed: {plagiarismResult.total_chunks_analyzed}
            </p>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckPlagiarism;
