import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function AqUsine() {
  const { OperateurID } = useParams();
  const [usines, setUsines] = useState([]);
  const [selectedUsine, setSelectedUsine] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch inactive usines on component mount
  useEffect(() => {
    const fetchInactiveUsines = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/operator/getInactiveUsines"
        );
        setUsines(response.data);
      } catch (error) {
        console.error("Error fetching inactive usines:", error);
        setError(
          "Erreur lors de la récupération des usines. Veuillez réessayer."
        );
      }
    };
    fetchInactiveUsines();
  }, []);

  // Handle usine acquisition
  const handleAcquisition = async (usineId) => {
    setError(""); // Reset error before submission
    setSuccess(""); // Reset success message before submission
    console.log("piw,", OperateurID, usineId);
    try {
      await axios.post("http://127.0.0.1:5000/operator/acquisition", {
        OperateurID,
        UsineID: usineId,
      });
      setSuccess("Acquisition réussie!");
      setSelectedUsine(null); // Reset selected usine
    } catch (error) {
      console.error("Error acquiring usine:", error);
      setError("Erreur lors de l'acquisition de l'usine. Veuillez réessayer.");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-[300px] max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-6">Acquérir une Usine</h2>

        {error && <div className="mb-4 text-sm text-red-500">{error}</div>}
        {success && (
          <div className="mb-4 text-sm text-green-500">{success}</div>
        )}

        <ul className="space-y-2">
          {usines.map((usine) => (
            <li
              key={usine.UsineID}
              className="flex justify-between items-center p-2 border rounded-lg"
            >
              <span>{usine.NomUsine}</span>
              <button
                onClick={() => handleAcquisition(usine.UsineID)}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1"
              >
                Acquérir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
