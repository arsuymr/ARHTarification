import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EcritsTable() {
  const [ecrits, setEcrits] = useState([]);

  useEffect(() => {
    const getEcrits = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/ecrit", {
          params: {
            OperateurID: 1,
          },
        });
        setEcrits(response.data); // Assuming the API response is an array of objects
      } catch (error) {
        console.error("Error fetching écrits:", error);
      }
    };
    getEcrits();
  }, []); // Empty dependency array ensures useEffect runs once on component mount

  return (
    <div className="w-full h-full mx-6 mt-15">
      <h1 className="text-center text-3xl font-bold mb-4">
        Liste des écrits envoyés
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="px-4 py-2 text-left text-lg font-bold text-gray-900">
                Description
              </th>
              <th className="px-4 py-2 text-left text-lg font-bold text-gray-900">
                Date d'envoi
              </th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>

          <tbody className="divide-y-2 divide-gray-200">
            {ecrits.map((ecrit) => (
              <tr key={ecrit.idecrit}>
                <td className="px-4 py-2 text-left text-gray-900">
                  {ecrit.description}
                </td>
                <td className="px-4 py-2 text-left text-gray-700">
                  {ecrit.date}
                </td>
                <td className="px-4 py-2">
                  <a
                    href={ecrit.lien}
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
