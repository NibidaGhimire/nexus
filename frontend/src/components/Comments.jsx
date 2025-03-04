import { BiSolidDownvote, BiSolidUpvote } from "react-icons/bi";
import usePosts from "../../zustand/usePosts";
import { LuReply } from "react-icons/lu";

const Comments = () => {
  const { selectedPost } = usePosts();

  return (
    <div>
      <ul>
        {selectedPost.comments.map((comment) => (
          <li
            key={comment._id}
            className="bg-bg/40  px-4 py-2 hover:outline-gray-500 hover:outline outline mb-2 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <p className=" text-sm text-blue-300">{comment.username} . </p>
              <p className="text-sm text-blue-300">
                {new Date(comment.createdAt).toDateString()}
              </p>
            </div>
            <p>{comment.comment}</p>
            <div className=" flex items-center gap-4 ">
              <div className="flex items-center gap-2">
                <BiSolidUpvote className="w-4 h-4" />
                {/* <span>{selectedPost.upvotes}</span> */}
              </div>
              <div className="flex items-center gap-2">
                <BiSolidDownvote className="w-4 h-4" />
                {/* <span>{selectedPost.downvotes}</span> */}
              </div>
              <div className="flex items-center gap-2"> 
                <LuReply />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
