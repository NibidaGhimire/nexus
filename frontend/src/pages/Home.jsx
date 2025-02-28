import Navbar from "../components/Navbar";
import PostsList from "../components/PostsList";
import Saved from "../components/Saved";
import SubNexus from "../components/SubNexus";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <Navbar />
      <div className="flex  flex-row ">
        <div className="flex-[0.2] ">
          <SubNexus />
        </div>
        <div className="flex-[0.6]">
          <PostsList />
        </div>
        <div className="flex-[0.2]">
          <Saved />
        </div>
      </div>
    </div>
  );
};

export default Home;
