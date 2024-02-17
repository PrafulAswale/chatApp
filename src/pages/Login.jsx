import React, { useEffect, useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Lock } from "react-feather";
import "../index.css";

const LoginPage = () => {
  const { user, handleUserLogin } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  });

  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setCredentials({ ...credentials, [name]: value });
    // console.log('CREDS:', credentials)
  };

  return (
    <div className="flex justify-center items-center flex-col h-screen w-screen bg-slate-900">
      <h1 className="inline-flex items-center text-2xl mb-4 flex-col text-white">
        <Lock className="h-8 w-8 mb-2" /> Login
      </h1>
      <div className="w-full max-w-xl">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={(e) => {
            handleUserLogin(e, credentials);
          }}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={(e) => {
                handleInputChange(e);
              }}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="Enter password..."
              value={credentials.password}
              onChange={(e) => {
                handleInputChange(e);
              }}
              required
            />
            <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p>
          </div>
          <div className="flex items-center justify-between ">
            <button
              className=" w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xl">
          Dont have an account ? Register{" "}
          <Link to="/register" className="text-white underline">
            here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
