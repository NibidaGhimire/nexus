import { Link } from "react-router-dom";
import GenderCheckbox from "../components/GenderCheckbox";
import { useState } from "react";
import useSignup from "../../src/hooks/useSignup";
import { logo } from "../assets";

const SignUp = () => {
  const [inputs, setInputs] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { loading, signup } = useSignup();

  const handleCheckboxChange = (gender) => {
    setInputs({ ...inputs, gender });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(inputs);
  };

  return (
    <div className="flex flex-row items-center justify-center">
      <div className=" flex-[40%] flex flex-col bg-bg/40 bg-opacity-70 justify-center items-center h-screen w-fit p-20 shadow-lg shadow-gray-200 rounded-box">
        <img src={logo} alt="PhysioNep" className="w-96 h-96 object-cover " />
        <br />
        <p className="text-[24px] text-white font-bold">
          {" "}
          Welcome to <span className="text-primary">Nexus!</span>
        </p>
      </div>

      <div className="flex-[60%] p-4 h-screen flex items-center justify-center ">
        <div className="flex flex-col gap-4 items-center justify-center p-6 min-w-96 mx-auto rounded-lg shadow-md shadow-white outline bg-white/70 bg-clip-padding backdrop-filter backdrop-blur-lg ">
          <h1 className="text-3xl font-semibold text-center text-gray-800">
            Sign Up
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col w-full gap-4">
            <div>
              <label className="label p-2">
                <span className="text-base label-text text-gray-800">
                  Full Name
                </span>
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                className="px-4 w-full input input-bordered h-10 bg-white/40 text-gray-800 outline rounded-xl"
                value={inputs.fullName}
                onChange={(e) =>
                  setInputs({ ...inputs, fullName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label p-2">
                <span className="text-base label-text  text-gray-800">
                  Username
                </span>
              </label>
              <input
                type="text"
                placeholder="janedoe"
                className="px-4 w-full input input-bordered h-10 bg-white/40 text-gray-800 outline rounded-xl"
                value={inputs.username}
                onChange={(e) =>
                  setInputs({ ...inputs, username: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">
                <span className="text-base label-text  text-gray-800">
                  Password
                </span>
              </label>
              <input
                type="password"
                placeholder="Enter Password"
                className="px-4 w-full input input-bordered h-10 bg-white/40 text-gray-800 outline rounded-xl"
                value={inputs.password}
                onChange={(e) =>
                  setInputs({ ...inputs, password: e.target.value })
                }
              />
            </div>

            <div>
              <label className="label">
                <span className="text-base label-text text-gray-800">
                  Confirm Password
                </span>
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                className="px-4 w-full input input-bordered h-10 bg-white/40 text-gray-800 outline rounded-xl"
                value={inputs.confirmPassword}
                onChange={(e) =>
                  setInputs({ ...inputs, confirmPassword: e.target.value })
                }
              />
            </div>

            <GenderCheckbox
              onCheckboxChange={handleCheckboxChange}
              selectedGender={inputs.gender}
            />

            <Link
              to="/login"
              className="text-sm hover:underline hover:text-blue-600 mt-2 inline-block text-gray-800"
            >
              Already have an account?
            </Link>

            <div>
              <button
                disabled={loading}
                className="btn btn-block btn-sm mt-2 bg-black hover:outline hover:bg-primary text-white w-full px-4 py-2 rounded-xl"
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
