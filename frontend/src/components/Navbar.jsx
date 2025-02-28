import { Link } from "react-router-dom";
import { useState } from "react";
import useLogout from "../hooks/useLogout";
import {logo} from "../assets"; 
import { useAuthContext } from "../context/AuthContext";
import { MdMessage } from "react-icons/md";

const Navbar = () => {
  const { logout, loading } = useLogout();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { authUser } = useAuthContext();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleProfileMenuToggle = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <nav className="bg-bg/40 rounded-2xl px-4 py-2 w-full shadow-md shadow-white/20"> 
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          <img src={logo} alt="Nexus" className="h-8 w-8 inline-block mr-2" />
          Nexus
        </Link>

        <input
          type="text"
          placeholder="Search SubNexus, Posts, Users"
          className="px-4 py-2 rounded-lg bg-gray-700/60 text-white w-96"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="flex items-center space-x-4">
          <Link to="/messages" className="text-white">
            <MdMessage className="w-8 h-8"/>
          </Link>
          <div className="relative">
            <img
              src={authUser?.profilePic}
              onClick={handleProfileMenuToggle}
              alt="profile"
              className="w-8 h-8 rounded-full border-2 border-black "
            />
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-bg rounded-lg shadow-lg py-2 backdrop-blur-2xl border-2 border-white/20">
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-white hover:bg-darkpurple"
                >
                  Settings
                </Link>
                <Link
                  to="/help"
                  className="block px-4 py-2 text-white hover:bg-darkpurple"
                >
                  Help
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-white hover:bg-darkpurple"
                  disabled={loading}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
