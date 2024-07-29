import React, { useState, useEffect } from "react";
import axios from "axios";
import Tabs from "./tabs";
import { useParams } from "react-router";
import SideBarOp from "./SideBarOp";

export default function ParamsTable() {
  const [params, setParams] = useState([]);
  const { OperateurID } = useParams();
  useEffect(() => {
    const getEcrits = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/param", {
          params: {
            UnityID: 1,
          },
        });
        setParams(response.data); // Assuming the API response is an array of objects
      } catch (error) {
        console.error("Error fetching écrits:", error);
      }
    };
    getEcrits();
  }, []); // Empty dependency array ensures useEffect runs once on component mount

  return (
    <div className="flex justify-between">
      <SideBarOp OperateurID={OperateurID} />
      <div className="w-full h-full mx-6 mt-15">
        <Tabs />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="px-4 py-2 text-left text-lg font-bold text-gray-900">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-lg font-bold text-gray-900">
                  Valeur
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-gray-200">
              {params.map((ecrit) => (
                <tr key={ecrit.codePO}>
                  <td className="px-4 py-2 text-left text-gray-900">
                    {ecrit.codePO}
                  </td>
                  <td className="px-4 py-2 text-left text-gray-700">
                    {ecrit.valeur}
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={ecrit.lien}
                      className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      Modifier
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
