import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../Components.jsx/carte";
import SideBarOp from "../../Components.jsx/SideBarOp";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function AccueilOp({ role }) {
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
    } catch (error) {
      console.error("Error getting usines:", error);
    }
  };

  const handleCardClick = (usineId) => {
    role === "ADMIN" ? navigate(`/admin-op/${UserID}/${OperateurID}/${usineId}`) : navigate(`/user-op/${UserID}/${OperateurID}/${usineId}`)
  };

  const onDelet = () => {
    getUsines();
    navigate(`/admin-op/${UserID}/${OperateurID}`);
  };

  return (
    <div className="flex">
      <SideBarOp Role={role} />
      <div className="flex flex-wrap gap-7 p-6 w-full">
        {usines.length > 0 ? (
          usines.map((usine) => (
            <Card
              key={usine.UsineID}
              NomUsine={usine.NomUsine}
              Wilaya={usine.Wilaya}
              UsineID={usine.UsineID}
              onClick={() => handleCardClick(usine.UsineID)}
              onDelet={onDelet}
            />
          ))
        ) : (
          <Stack className="w-full m-6">
            <Alert severity="info">Aucune usine à afficher.</Alert>
          </Stack>
        )}
      </div>
    </div>

  );
}
