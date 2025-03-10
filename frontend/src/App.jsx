import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";


function App() {
  const { authUser } = useAuthContext();

  return (
    <div className="my-2 mx-4">
       <Routes>
        <Route
          path="/*"
          element={authUser ? <Home /> : <Navigate to="/signup" />}
        />
       
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUp />}
        />
      </Routes> 

      <Toaster />
    </div>
  );
}

export default App;
