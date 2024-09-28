import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../Components.jsx/carte";
import SideBarARH from "../../Components.jsx/SideBarARH";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import OperatorCard from "../../Components.jsx/OperatorCard";
import UsineCard from "../../Components.jsx/UsineCard";
import Unities from "../../Components.jsx/Unities";
import Modal from "../../Components.jsx/Modal";
import AddOperator from "../../Components.jsx/AddOperator";
import add from "../../assets/add.svg";
export default function DetailsOperator({ role }) {
  // const { OperateurID, UserID } = useParams();
  const [usines, setUsines] = useState([]);
  const [operators, setOperators] = useState([]);
  const [showAddOperator, setShowAddOperator] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getOperators();
  }, []);

  const getOperators = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/operator/Get_all_operateur`
      );
      setOperators(response.data);
    } catch (error) {
      console.error("Error getting operators:", error);
    }
  };
  const handleAddOperator = () => {
    setShowAddOperator(true);
  };

  const handleAddOperatorSuccess = () => {
    getOperators();
  };

  console.log("operators", operators);
  return (
    <div className="flex">
      <SideBarARH Role={role} />
      <div className="border-[1px] border-blue-200 rounded-[10px] w-full m-[150px] relative">
        <button
          className="absolute -top-4 right-[60px] bg-white px-8 flex items-center justify-center gap-5"
          onClick={handleAddOperator}
        >
          Ajouter opérateur
          <img src={add} alt="alt" />
        </button>
        <div className="flex-col flex gap-[10px] mx-[60px] my-[40px] ">
          {operators.length &&
            operators.map((operator) => (
              <OperatorCard operator={operator} isARH={true} />
            ))}
        </div>
        <Modal show={showAddOperator} onClose={() => setShowAddOperator(false)}>
          <AddOperator onSuccess={handleAddOperatorSuccess} />
        </Modal>
      </div>
    </div>
  );
}
