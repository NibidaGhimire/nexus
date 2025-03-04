import { useState } from "react";
import useSummarizer from "../hooks/useSummarizer";
import toast from "react-hot-toast";

const Summarize = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [summarizedText, setSummarizedText] = useState("");
  const { summarizer } = useSummarizer();

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      toast.error("Please upload a PDF file first.");
      return;
    }
    const result = await summarizer({
      file: pdfFile,
    });
    setSummarizedText(result.summary);
  };

  return (
    <div className="bg-bg/40 px-4 py-2 shadow-md text-white w-full h-screen  border-r-1 border-white/40 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Summarize</h1>
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
            type="file"
            accept="application/pdf"
            className="px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-secondary"
            onChange={handleFileChange}
          />
          <div className="flex w-full justify-center gap-4">
            <button
              type="button"
              onClick={handleSummarize}
              className="bg-secondary hover:bg-lighter outline hover:outline-gray-100 outline-gray-700 px-4 py-2 rounded-lg text-black font-medium"
            >
              Summarize
            </button>
          </div>
        </form>
        <div>
          {summarizedText !== "" && (
            <div>
              <h2 className="text-md text-secondary ">Summarized Text:</h2>
              <div className="bg-gray-800 p-4 rounded-lg text-justify">{summarizedText}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Summarize;
