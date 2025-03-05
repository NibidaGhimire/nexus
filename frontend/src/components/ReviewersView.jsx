import React, { useState } from "react";
import usePosts from "../../zustand/usePosts";
import useAddReview from "../hooks/useAddReview";
import { useNavigate } from "react-router-dom";


const ReviewersView = () => {
  const { selectedPost } = usePosts();
  const apiUrl = import.meta.env.VITE_API_URL;
    const { addReview } = useAddReview();
  const navigate = useNavigate();

  const [review, setReview] = useState({
    clarity: "",
    methodology: "",
    quality: "",
    logicalFlow: "",
    writingStyle: "",
    citation: "",
    contribution: "",
    review: "",
  });

 const handleReviewSubmit = async (e) => {
   e.preventDefault();
   await addReview({ postId: selectedPost._id, review });
   navigate(`/post/${selectedPost._id}`);
 };

  return (
    <div className="flex flex-col gap-2 bg-bg">
      <form onSubmit={handleReviewSubmit} className="flex flex-col gap-2 p-4">
        <label className="text-white font-semibold">
          <a
            href={`${apiUrl}${selectedPost.pdfUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit px-4 py-2 rounded-lg  font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            Paper: <span className="text-primary">{selectedPost.pdfUrl}</span>
          </a>
        </label>
        <label className="text-white font-semibold">Rating</label>
        <ul>
          <li className=" text-sm flex items-center gap-2 ">
            <p className="text-gray-300">
              Clarity and significance of the research question:
            </p>
            <input
              className=" bg-bg/40 p-2 rounded-lg font-bold text-white placeholder:text-gray-700 placeholder:font-regular"
              type="number"
              placeholder="1-10"
              value={review.clarity}
              onChange={(e) =>
                setReview({ ...review, clarity: e.target.value })
              }
              min="0"
              max="10"
            />
          </li>
          <li className=" text-sm flex items-center gap-2">
            <p className="text-gray-300">Methodology:</p>
            <input
              className="bg-bg/40 p-2 rounded-lg font-bold text-white placeholder:text-gray-700 placeholder:font-regular"
              type="number"
              placeholder="1-10"
              value={review.methodology}
              onChange={(e) =>
                setReview({ ...review, methodology: e.target.value })
              }
              min="0"
              max="10"
            />
          </li>
          <li className="text-sm flex items-center gap-2">
            <p className="text-gray-300">Quality of data analysis:</p>
            <input
              className="bg-bg/40 p-2 rounded-lg font-bold text-white placeholder:text-gray-700 placeholder:font-regular"
              type="number"
              placeholder="1-10"
              value={review.quality}
              onChange={(e) =>
                setReview({ ...review, quality: e.target.value })
              }
              min="0"
              max="10"
            />
          </li>

          <li className="text-sm flex items-center gap-2">
            <p className="text-gray-300">Logical flow of arguments:</p>
            <input
              className="bg-bg/40 p-2 rounded-lg font-bold text-white placeholder:text-gray-700 placeholder:font-regular"
              type="number"
              placeholder="1-10"
              value={review.logicalFlow}
              onChange={(e) =>
                setReview({ ...review, logicalFlow: e.target.value })
              }
              min="0"
              max="10"
            />
          </li>

          <li className="text-sm flex items-center gap-2">
            <p className="text-gray-300">writing style</p>
            <input
              className="bg-bg/40 p-2  rounded-lg font-bold text-white placeholder:text-gray-700 placeholder:font-regular"
              type="number"
              placeholder="1-10"
              value={review.writingStyle}
              onChange={(e) =>
                setReview({ ...review, writingStyle: e.target.value })
              }
              min="0"
              max="10"
            />
          </li>

          <li className="text-sm flex items-center gap-2 ">
            <p className="text-gray-300">Proper Citation of sources</p>
            <input
              className="bg-bg/40 p-2 rounded-lg font-bold text-white placeholder:text-gray-700 placeholder:font-regular"
              type="number"
              placeholder="1-10"
              value={review.citation}
              onChange={(e) =>
                setReview({ ...review, citation: e.target.value })
              }
              min="0"
              max="10"
            />
          </li>
          <li className="text-sm flex items-center gap-2">
            <p className="text-gray-300">
              Overall Contribution to the field of study
            </p>
            <input
              className="bg-bg/40 p-2 rounded-lg font-bold text-white placeholder:text-gray-700 placeholder:font-regular"
              type="number"
              placeholder="1-10"
              value={review.contribution}
              onChange={(e) =>
                setReview({ ...review, contribution: e.target.value })
              }
              min="0"
              max="10"
            />
          </li>
        </ul>

        <label className="text-white font-semibold">Review</label>
        <textarea
          className="bg-bg/40 p-2 rounded-lg text-white border"
          rows="7"
          placeholder="Write your review here"
          value={review.review}
          onChange={(e) => setReview({ ...review, review: e.target.value })}
        ></textarea>
        <button
          type="submit"
          className="bg-secondary hover:bg-lighter text-black font-medium rounded-lg p-2"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewersView;
