import { BiSolidDownvote, BiSolidUpvote } from "react-icons/bi";
import usePosts from "../../zustand/usePosts";
import { FaRegCommentDots } from "react-icons/fa";

const Saved = () => {
  const { savedPosts, postsList } = usePosts();
  const apiUrl = import.meta.env.VITE_API_URL;

  const filteredPosts = postsList.filter((post) =>
    savedPosts.includes(post._id)
  );

  console.log("All posts:", postsList);
  console.log("Saved posts:", savedPosts);
  console.log("Filtered saved posts:", filteredPosts);

  return (
    <div className=" px-4 py-2 shadow-md w-full h-screen text-white/40  border-l-1 flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Saved Papers</h1>

      <ul>
        {filteredPosts.map((post) => (
          <li
            key={post._id}
            className="bg-bg border rounded-2xl  w-full px-4 py-2 hover:outline-gray-500 hover:outline flex flex-col gap-2"
          >
            <h1>
              {post.title} -{" "}
              <span className="text-sm">{post.author.username}</span>
            </h1>
            <p className="line-clamp-1">{post.description}</p>
            <a
              href={`${apiUrl}${post.pdfUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-secondary hover:bg-lighter outline hover:outline-gray-100 outline-gray-700 px-4 py-2 rounded-lg text-black font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              Open PDF
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Saved;
