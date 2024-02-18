import React from "react";
import { useState } from "react";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";
import { Lock } from "react-feather";

const RegisterPage = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    comfirmpassword: "",
  });

  const { handleRegister } = useAuth();

  const handleInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    setCredentials({ ...credentials, [name]: value });
    //console.log("CREDS:", credentials);
  };

  return (
    <div className="flex justify-center items-center flex-col h-screen w-screen bg-slate-900">
      <h1 className="inline-flex items-center text-2xl mb-4 flex-col text-white">
        <Lock className="h-8 w-8 mb-2" /> Register
      </h1>
      <div className="w-full max-w-xl">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={(e) => {
            handleRegister(e, credentials);
          }}
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              name="name"
              placeholder="Enter your Name..."
              value={credentials.name}
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={credentials.email}
              onChange={(e) => {
                handleInputChange(e);
              }}
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              name="password"
              placeholder="Enter a password"
              value={credentials.password}
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="comfirmPassword"
            >
              Comfirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="comfirmPassword"
              type="password"
              name="comfirmpassword"
              placeholder="Comfirm your password..."
              value={credentials.comfirmpassword}
              onChange={(e) => {
                handleInputChange(e);
              }}
            />
          </div>
          <div className="flex items-center justify-between ">
            <button
              className=" w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Register
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xl">
          Already have an account? Login{" "}
          <Link className="text-white underline" to="/login">
            here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
