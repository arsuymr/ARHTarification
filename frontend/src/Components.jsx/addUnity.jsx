import React, { useState } from "react";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const wilayas = ["liquefaction", "separation", "liquefaction et separation"];

export default function AddUnity({ UsineID, onSuccess }) {
  const [NomUnity, setNomUsine] = useState("");
  const [Wilaya, setWilaya] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("Submitting", NomUnity, Wilaya, UsineID);
      const response = await axios.post(
        "http://127.0.0.1:5000/operator/addUnity",
        {
          NomUnity: NomUnity,
          typ: Wilaya,
          UsineID: UsineID,
        }
      );
      console.log(response);
      setSuccess("Unité ajouté avec succès!");
      onSuccess();
    } catch (error) {
      console.error("Error adding usine:", error);
      setError("Error adding usine. Please try again.");
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
            Nom de l'unité
          </label>
          <input
            type="text"
            id="nomUsine"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            placeholder="Nom de l'unité"
            value={NomUnity}
            onChange={(e) => setNomUsine(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="wilaya"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Type
          </label>
          <select
            id="wilaya"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            value={Wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            required
          >
            <option value="" disabled>
              Sélectionner type
            </option>
            {wilayas.map((wilaya) => (
              <option key={wilaya} value={wilaya}>
                {wilaya}
              </option>
            ))}
          </select>
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
          Ajouter Unité
        </button>
      </form>
    </div>
  );
}
