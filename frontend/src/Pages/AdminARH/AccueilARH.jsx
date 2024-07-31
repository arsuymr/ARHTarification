import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Charts from "../../Components.jsx/chart";
export default function AccueilARH() {
  const { OperateurID } = useParams();
  const [usines, setUsines] = useState([]);

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
      console.log(usines);
    } catch (error) {
      console.error("Error getting usines:", error);
    }
  };

  return (
    <div>
      <Charts role="ADMIN" />
    </div>
  );
}
