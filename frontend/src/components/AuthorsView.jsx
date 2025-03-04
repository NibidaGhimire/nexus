import React from "react";
import usePosts from "../../zustand/usePosts";

const AuthorsView = () => {
  const { selectedPost } = usePosts();

  return (
    <div className="mt-6">
      <h3 className="text-lg text-white font-semibold">Reviews</h3>
      {selectedPost.reviews.length > 0 && (
        <ul className="mt-2 mr-2 space-y-2 border rounded-2xl border-white/40">
          {selectedPost.reviews.map((review, index) => (
            <li key={index} className="bg-bg/40 px-4 py-2 rounded-lg">
              <p className="text-gray-500 text-sm ">
                {review.reviewer}
              </p>
              <p className="text-gray-300 ">
                Clarity:{" "}
                <span className="text-white font-bold text-lg">
                  {review.clarity}
                </span>
              </p>
              <p className="text-gray-300">
                Methodology:{" "}
                <span className="text-white font-bold text-lg">
                  {review.methodology}
                </span>
              </p>
              <p className="text-gray-300">
                Quality:{" "}
                <span className="text-white font-bold text-lg">
                  {review.quality}
                </span>
              </p>
              <p className="text-gray-300">
                Logical Flow:{" "}
                <span className="text-white font-bold text-lg">
                  {review.logicalFlow}
                </span>
              </p>
              <p className="text-gray-300">
                Writing Style:
                <span className="text-white font-bold text-lg">
                  {review.writingStyle}
                </span>
              </p>
              <p className="text-gray-300">
                Citation:
                <span className="text-white font-bold text-lg">
                  {review.citation}
                </span>
              </p>
              <p className="text-gray-300">
                Contribution:{" "}
                <span className="text-white font-bold text-lg">
                  {review.contribution}
                </span>
              </p>
              <p className="text-gray-300">
                Review:{" "}
                <span className="text-white text-lg">
                  {review.review}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuthorsView;
