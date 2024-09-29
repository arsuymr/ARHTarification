import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../Components.jsx/carte";
import SideBarOp from "../../Components.jsx/SideBarOp";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import OperatorCard from "../../Components.jsx/OperatorCard";
import add from "../../assets/add.svg";
import { Modal } from "@mui/material";
import AddUsine from "../../Components.jsx/ajoutUsine";
import AqUsine from "../../Components.jsx/aqUsine";

export default function AccueilOp({ role }) {
  const { OperateurID, UserID } = useParams();
  const [usines, setUsines] = useState([]);
  const [operator, setOperator] = useState({});
  const navigate = useNavigate();
  const [showAddUsine, setShowAddUsine] = useState(false);
  const [showAqUsine, setShowAqUsine] = useState(false);

  useEffect(() => {
    if (OperateurID) {
      getUsines(OperateurID);
      getOperatorById(OperateurID);
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
  const getOperatorById = async (operateurId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/operator/getByID/${operateurId}`
      );
      setOperator(response.data);
    } catch (error) {
      console.error("Error fetching operator:", error);
      throw error; // You can handle the error as you see fit
    }
  };
  const handleCardClick = (usineId) => {
    role === "ADMIN"
      ? navigate(`/admin-op/${UserID}/${OperateurID}/${usineId}`)
      : navigate(`/user-op/${UserID}/${OperateurID}/${usineId}`);
  };

  const handleAddUsineSuccess = () => {
    getUsines(OperateurID);
  };

  const onDelet = () => {
    getUsines();
    navigate(`/admin-op/${UserID}/${OperateurID}`);
  };
  const handleAddUsine = () => {
    setShowAddUsine(true);
  };
  const handleAqUsineSuccess = () => {
    getUsines(OperateurID);
  };
  const handleAqUsine = () => {
    setShowAqUsine(true);
  };
  return (
    <div className="flex relative">
      <SideBarOp Role={role} />
      <div className="border-[1px] border-blue-200 rounded-[10px] w-full m-[150px] ml-[400px] relative">
        <button
          className="absolute -top-4 right-[60px] bg-white px-8 flex items-center justify-center gap-5"
          onClick={handleAddUsine}
        >
          Ajouter usine
          <img src={add} alt="alt" />
        </button>
        <button
          className="absolute -top-4 right-[360px] bg-white px-8 flex items-center justify-center gap-5"
          onClick={handleAqUsine}
        >
          Acquisition usine
          <img src={add} alt="alt" />
        </button>
        {Object.keys(operator).length > 0 && (
          <OperatorCard isARH={false} operator={operator} role={role} />
        )}
        <Modal open={showAddUsine} onClose={() => setShowAddUsine(false)}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              boxShadow: 24,
              borderRadius: "8px",
            }}
          >
            <AddUsine onSuccess={handleAddUsineSuccess} />
          </div>
        </Modal>
        <Modal open={showAqUsine} onClose={() => setShowAqUsine(false)}>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              padding: "20px",
              boxShadow: 24,
              borderRadius: "8px",
            }}
          >
            <AqUsine onSuccess={handleAqUsineSuccess} />
          </div>
        </Modal>
      </div>
    </div>
  );
}
