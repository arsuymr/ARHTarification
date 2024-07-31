import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function UpdatePassword({ onSuccess }) {
  const { UserID } = useParams();
  const [previousPassword, setPreviousPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    try {
      console.log(previousPassword, newPassword, UserID);
      const response = await axios.post(
        "http://127.0.0.1:5000/users/update_password",
        {
          previous_password: previousPassword,
          password: newPassword,
          userID: UserID,
        }
      );
      setSuccess("Mot de passe modifié avec succès!");
      setError("");
    } catch (error) {
      setError("Erreur lors de la modification");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form
        className="w-[300px] max-w-md mx-auto"
        onSubmit={handleUpdatePassword}
      >
        <div className="mb-5">
          <label
            htmlFor="previousPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Ancien mot de passe
          </label>
          <input
            type="password"
            id="previousPassword"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            value={previousPassword}
            onChange={(e) => setPreviousPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="newPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nouveau mot de passe
          </label>
          <input
            type="password"
            id="newPassword"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-5">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Confirmer mot de passe
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <Stack className="w-full mb-5">
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
          Modifier mot de passe
        </button>
      </form>
    </div>
  );
}
