import usePosts from "../../zustand/usePosts";
import { useNavigate } from "react-router";
import { FaRegCommentDots } from "react-icons/fa";
import { BiSolidUpvote, BiSolidDownvote } from "react-icons/bi";

const PostListLayout = ({postsList}) => {

  const apiUrl = import.meta.env.VITE_API_URL;

  const { setSelectedPost } = usePosts();
  const navigate = useNavigate();
  const handlePostClick = (post) => {
    setSelectedPost(post);
    navigate(`/post/${post._id}`);
  };

  return (
    <div>
      <ul className="mt-2 space-y-2">
        {postsList.map((post) => (
          <li
            key={post._id}
            className="bg-bg/40  px-4 py-2 hover:outline-gray-500 hover:outline"
          >
            <div className="flex flex-col gap-2">
              <p className="text-gray-500 text-sm">
                {post.author.username} -{" "}
                {new Date(post.createdAt).toDateString()}
              </p>

              <div
                className=" flex flex-col gap-2 cursor-pointer text-white"
                onClick={() => handlePostClick(post)}
              >
                <h2 className="text-lg font-semibold hover:underline">
                  {post.title}
                </h2>
                <p className="px-6 text-sm text-gray-400 line-clamp-3 w-[820px]">
                  {post.description}
                </p>
              </div>
              <a
                href={`${apiUrl}${post.pdfUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit bg-secondary hover:bg-lighter outline hover:outline-gray-100 outline-gray-700 px-4 py-2 rounded-lg text-black font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Open PDF
              </a>
              <div className="flex justify-between items-center text-white">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <BiSolidUpvote className="w-6 h-6" />
                    <span>1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BiSolidDownvote className="w-6 h-6" />
                    <span>1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaRegCommentDots className="w-6 h-6" />
                    <span>1</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostListLayout;
