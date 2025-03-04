import { Route, Routes } from "react-router";
import CreatePost from "../components/CreatePost";
import Navbar from "../components/Navbar";
import PostsList from "../components/PostsList";
import Saved from "../components/Saved";
import SubNexus from "../components/SubNexus";
import PostDetails from "../components/PostDetails";
import CheckPlagiarism from "../components/CheckPlagiarism";
import CreateSubNexus from "../components/CreateSubNexus";
import SubNexusDetails from "../components/SubNexusDetails";
import AuthorsView from "../components/AuthorsView";
import ReviewersView from "../components/ReviewersView";
import Summarize from "../components/Summarize";

const Home = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>
      <div className="flex flex-row ">
        <div className="flex-[0.2] sticky">
          <div className="fixed top-16 h-full w-70 bg-bg/40 text-white">
            <SubNexus />
          </div>
        </div>
        <div className="flex-[0.6] ">
          <Routes>
            <Route path="/" element={<PostsList />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/post/:postId" element={<PostDetails />} />
            <Route path="/post/:postId/reviews" element={<AuthorsView />} />
            <Route path="/post/:postId/addreview" element={<ReviewersView />} />

            <Route path="/checkplagiarism" element={<CheckPlagiarism />} />
            <Route path="/summarize" element={<Summarize />} />

            <Route path="/create-subnexus" element={<CreateSubNexus />} />
            <Route path="/subnexus/:subnexusID" element={<SubNexusDetails />} />
          </Routes>
        </div>
        <div className="flex-[0.2]">
          <div className="fixed top-16 h-full w-60 bg-bg/40 text-white">
            <Saved />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
