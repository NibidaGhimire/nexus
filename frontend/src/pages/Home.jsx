import Navbar from "../components/Navbar";
import PostsList from "../components/PostsList";
import Saved from "../components/Saved";
import SubNexus from "../components/SubNexus";

const Home = () => {
  return (
    <div className="flex flex-col gap-2" >
      <div className="sticky top-0 z-10">
      <Navbar />
      </div>
      <div className="flex flex-row ">
        <div className="flex-[0.2] sticky ">
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
