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
      <div className="flex flex-col w-screen mt-14 ml-[310px]">
        <div className=" mt-10 relative px-5 rounded-xl shadow-2xl border-[#D5E7F2] border-2 mx-2 pb-10">
          <div className="absolute -top-4 flex justify-center gap-2">
            <select
              className="border-2 border-[#ECE9F1]"
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
              placeholder="Date"
              className="border-2 border-[#ECE9F1]"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              min="2020"
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
            <div key={classe.ID} >
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
    </div>
  );
}
