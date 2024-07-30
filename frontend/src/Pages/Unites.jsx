import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CardUnity from "../Components.jsx/carteUnite";
import SideBarOp from "../Components.jsx/SideBarOp";
import SideBarARH from "../Components.jsx/SideBarARH";

export default function Unites({ role }) {
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
      {role === "ADMINARH" ? (
        <SideBarARH Role="ADMIN" />
      ) : (
        <SideBarOp OperateurID={OperateurID} Role="ADMIN" />
      )}
      <div className="flex  gap-7 p-6">
        {usines.length > 0 ? (
          usines.map((usine) => (
            <CardUnity
              key={usine.id}
              NomUnity={usine.NomUnity}
              typ={usine.typ}
            />
          ))
        ) : (
          <p>No unities available</p>
        )}
      </div>
    </div>
  );
}
