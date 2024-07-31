import React, { useState } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
const wilayas = ["liquefaction", "separation", "liquefaction et separation"];

export default function AddOperator({ onSuccess }) {
  const [error, setError] = useState("");
  const [NomOperator, setNomOperator] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("piw", NomOperator, email, username);
      const response = await axios.post(
        "http://127.0.0.1:5000/users/addOperator",
        {
          Nom_operateur: NomOperator,
          Email: email,
          Username: username,
        }
      );
      setSuccess("Opérateur ajouté avec succès!");
      onSuccess();
      setEmail("");
      setNomOperator("");
      setUsername("");
      console.log(response);
    } catch (error) {
      console.error("Error adding operator:", error);
      setError("Error adding operator. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form className="w-[300px] max-w-md mx-auto" onSubmit={handleLogin}>
        <div className="mb-5">
          <label
            htmlFor="nomUsine"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nom de l'opérateur
          </label>
          <input
            type="text"
            id="nomUsine"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Nom de l'usine"
            value={NomOperator}
            onChange={(e) => setNomOperator(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="nomUsine"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Email de l'admin
          </label>
          <input
            type="email"
            id="nomUsine"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Email de l'admin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="nomUsine"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nom d'utilisateur de l'admin
          </label>
          <input
            type="text"
            id="nomUsine"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Nom d'utilisateur de l'admin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {error && (
          <Stack sx={{ width: "100%" }} spacing={2}>
            <Alert severity="error">{error}</Alert>
          </Stack>
        )}
        {success && (
          <Stack className="w-full mb-5">
            <Alert severity="success">{success}</Alert>
          </Stack>
        )}
        <button
          type="submit"
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Ajouter opérateur
        </button>
      </form>
    </div>
  );
}
