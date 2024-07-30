import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../Components.jsx/carte";
import SideBarOp from "../../Components.jsx/SideBarOp";
import SideBarARH from "../../Components.jsx/SideBarARH";

export default function DetailsOperator() {
  const { OperateurID } = useParams();
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
    navigate(`/admin-arh/${OperateurID}/${usineId}`);
  };

  return (
    <div className="flex flex-wrap gap-7 p-6">
      <SideBarARH />
      {usines.length > 0 ? (
        usines.map((usine) => (
          <Card
            key={usine.id}
            NomUsine={usine.NomUsine}
            Wilaya={usine.Wilaya}
            UsineID={usine.UsineID}
            onClick={() => handleCardClick(usine.UsineID)}
          />
        ))
      ) : (
        <p>No usines available</p>
      )}
    </div>
  );
}
