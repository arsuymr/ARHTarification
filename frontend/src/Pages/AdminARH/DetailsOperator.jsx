import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../Components.jsx/carte";
import SideBarARH from "../../Components.jsx/SideBarARH";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function DetailsOperator({ role }) {
  const { OperateurID, UserID } = useParams();
  const [usines, setUsines] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (OperateurID) {
      getUsines(OperateurID);
    }
  }, [OperateurID]);

  const getUsines = async (operateurId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/operator/${operateurId}/usines`
      );
      setUsines(response.data);
      console.log("dta", usines);
    } catch (error) {
      console.error("Error getting usines:", error);
    }
  };

  const handleCardClick = (usineId) => {
    role === "ADMIN"
      ? navigate(`/admin-arh/${UserID}/${OperateurID}/${usineId}`)
      : navigate(`/user-arh/${UserID}/${OperateurID}/${usineId}`);
  };

  return (
    <div className="flex">
      <SideBarARH Role={role} />
      {usines.length > 0 ? (
        <div className="flex flex-col">
          <div className="mx-6 mt-6 text-2xl font-bold  ">
            {usines[0].Nom_operateur}
          </div>

          <div className="flex flex-wrap gap-7 p-6">
            {usines.map((usine) => (
              <Card
                key={usine.id}
                NomUsine={usine.NomUsine}
                Wilaya={usine.Wilaya}
                UsineID={usine.UsineID}
                onClick={() => handleCardClick(usine.UsineID)}
              />
            ))}
          </div>
        </div>
      ) : (
        <Stack className="w-full m-6 ">
          <Alert severity="info">Aucune usine à afficher.</Alert>
        </Stack>
      )}
    </div>
  );
}
