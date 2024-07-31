import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

const wilayas = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanghasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Alger",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "M'Sila",
  "M'sila",
  "Naâma",
  "Aïn Témouchent",
  "Tissemsilt",
  "El Oued",
  "El Meniaa",
  "Ghardaïa",
  "El Bayadh",
  "El M'Ghair",
  "El Madher",
  "El Tarf",
  "Souk Ahras",
  "Tipasa",
  "Mila",
  "Aïn Defla",
];

export default function AddUsine({ onSuccess }) {
  const { OperateurID } = useParams();
  const [NomUsine, setNomUsine] = useState("");
  const [Wilaya, setWilaya] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error before submission
    setSuccess(""); // Reset success message before submission

    try {
      await axios.post("http://127.0.0.1:5000/operator/addUsine", {
        NomUsine,
        Wilaya,
        OperateurID,
      });
      setSuccess("Usine ajoutée avec succès!");
      setNomUsine(""); // Reset usine name field
      setWilaya(""); // Reset wilaya selection
      onSuccess();
    } catch (error) {
      console.error("Error adding usine:", error);
      setError("Erreur lors de l'ajout de l'usine. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex justify-center items-center ">
      <form className="w-[300px] max-w-md mx-auto" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-6">Ajouter une Usine</h2>

        <div className="mb-4">
          <label
            htmlFor="nomUsine"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Nom de l'usine
          </label>
          <input
            type="text"
            id="nomUsine"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            placeholder="Nom de l'usine"
            value={NomUsine}
            onChange={(e) => setNomUsine(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="wilaya"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Wilaya
          </label>
          <select
            id="wilaya"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={Wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            required
          >
            <option value="" disabled>
              Sélectionner Wilaya
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
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Ajouter Usine
        </button>
      </form>
    </div>
  );
}
