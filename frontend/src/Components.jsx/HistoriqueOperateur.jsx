import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import TabAffichage from "./TabAffichage";
import { Alert, AlertTitle, Stack } from "@mui/material";
import SideBarOp from "./SideBarOp";

export default function HistoriqueOp({ role }) {
  const { OperateurID } = useParams();
  const [classes, setClasses] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [ErrorMessage, setErrorMessage] = useState(false);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/saisit/get_classe"
        );
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchUnits = async () => {
      if (OperateurID) {
        try {
          const response = await axios.post(
            "http://127.0.0.1:5000/operator/GetUnitiesByOperator",
            {
              OperateurID: OperateurID,
            }
          );
          setUnits(response.data);
        } catch (error) {
          console.error("Error fetching units:", error);
        }
      }
    };
    fetchUnits();
  }, []);
  console.log(role)
  return (
    <div className="flex">
      <SideBarOp Role={role} />
      <div className="flex flex-col w-full mt-12">
        <div className="flex p-4 justify-center">
          <select
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            disabled={!OperateurID}
          >
            <option value="">Select Unit</option>
            {units.map((unit) => (
              <option key={unit.UnityID} value={unit.UnityID}>
                {unit.NomUnity}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            min="2020"
            max="2040"
          />
        </div>
        {ErrorMessage && (
          <Stack sx={{ width: "100%", padding: "16px" }} spacing={2}>
            <Alert severity="info">
              <AlertTitle>Info</AlertTitle>
              Aucune donnée disponible pour les filtres sélectionnés.
            </Alert>
          </Stack>
        )}
        {classes.map((classe) => (
          <div key={classe.ID} className="mt-8">
            <TabAffichage
              IDClasse={classe.ID}
              NomClasse={classe.NomClasse}
              selectedYear={selectedYear}
              selectedUnit={selectedUnit}
              selectedOperator={OperateurID}
              setErrorMessage={setErrorMessage}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
