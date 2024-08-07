import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CardUnity from "../Components.jsx/carteUnite";
import SideBarOp from "../Components.jsx/SideBarOp";
import SideBarARH from "../Components.jsx/SideBarARH";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function Unites({ role, Interface }) {
  const { UsineID } = useParams();
  const { OperateurID } = useParams();
  const [usines, setUsines] = useState([]);

  useEffect(() => {
    if (UsineID) {
      getUsines(UsineID);
    }
  }, [UsineID]);

  const getUsines = async (UsineID) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/operator/${UsineID}/units`
      );
      setUsines(response.data);
    } catch (error) {
      console.error("Error getting usines:", error);
    }
  };

  return (
    <div className="flex">
      {Interface === "Op" ? (
        <SideBarOp Role={role} />
      ) : (
        <SideBarARH Role={role} />
      )}
      <div className="flex flex-wrap w-full gap-7 p-6 ">
        {usines.length > 0 ? (
          usines.map((usine) => (
            <CardUnity
              key={usine.id}
              NomUnity={usine.NomUnity}
              typ={usine.typ}
            />
          ))
        ) : (
          <Stack className="w-full m-6">
            <Alert severity="info">Aucune unité à afficher.</Alert>
          </Stack>
        )}
      </div>
    </div>
  );
}
