import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { HiEye, HiEyeOff } from "react-icons/hi"; // Flowbite icons

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Logging in with", email, password);
      const response = await axios.post("http://127.0.0.1:5000/users/login", {
        email: email,
        pas: password,
      });
      const { rol, OperateurID, UserID } = response.data;
      if (rol === "admin" && OperateurID) {
        navigate(`/admin-op/${UserID}/${OperateurID}`);
      } else if (rol === "admin") {
        navigate(`/admin-arh/${UserID}`);
      } else if (rol === "user" && OperateurID) {
        navigate(`/user-op/${UserID}/${OperateurID}`);
      } else if (rol === "user") {
        navigate(`/user-arh/${UserID}`);
      } else {
        console.log("Role not recognized or missing OperateurID");
        setError("Role not recognized or missing OperateurID");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Mot de passe ou email incorrect");
    }
  };

  return (
    <div>
      <form className="w-[300px] mx-[200px]" onSubmit={handleLogin}>
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-5 relative">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Mot de passe
          </label>
          <div className="relative flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 flex items-center justify-center h-full"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <HiEyeOff className="text-gray-500" />
              ) : (
                <HiEye className="text-gray-500" />
              )}
            </button>
          </div>
        </div>
        {error && <div className="mb-5 text-sm text-red-500">{error}</div>}
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
