import React from 'react'

const CheckPlagiarism = () => {
  return (
    <div className="bg-bg/40 px-4 py-2 shadow-md text-white w-full h-screen  border-r-1 border-white/40 flex flex-col gap-4">
      <h1 className="text-xl font-semibold">Check Plagiarism</h1>
      <div className="mt-2 bg-gray-900 flex flex-col gap-8 text-center items-center outline-dotted outline-2 outline-gray-500 p-4">
        <h2>Upload File</h2>
        <form className='flex flex-col gap-4'
        onSubmit={(e) => {
          e.preventDefault();
          const file = e.target[0].files[0];
          console.log(file);
        }}
        >
          <input
            className="text-center bg-bg outline  p-2 rounded-lg"
            pattern=".*pdf"
            type="file"
            required
          />
            <button className="bg-secondary hover:bg-lighter outline hover:outline-gray-100 outline-gray-700 px-4 py-2 rounded-lg text-black font-medium">
                Check Plagiarism
            </button>
        </form>
      </div>
    </div>
  );
}

export default CheckPlagiarism
