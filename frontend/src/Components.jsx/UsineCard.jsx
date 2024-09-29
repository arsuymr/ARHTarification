import React, { useEffect, useState } from "react";
import usin from "../assets/usine.svg";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

import axios from "axios";
import Unities from "./Unities";
import add from "../assets/add.svg";
import { Modal } from "@mui/material";
import AddUnite from "./addUnity";
import { useParams } from "react-router";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function UsineCard({ usine, isARH = true, onDelet, role }) {
  const { OperateurID } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [units, setUnits] = useState([]);
  const [showAddUnity, setShowAddUnity] = useState(false);
  console.log("usine", usine)
  const getUnits = async (UsineID) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/operator/${UsineID}/units`
      );
      setUnits(response.data);
    } catch (error) {
      console.error("Error getting usines:", error);
    }
  };
  const handleOpening = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    getUnits(usine.UsineID);
  }, []);
  const handleAjouterUnity = () => {
    setShowAddUnity(true);
  };

  const handleAddUnitySuccess = () => {
    if (usine.usineID) {
      getUnits(usine.UsineID);
      console.log("success", units);
    }
  };
  const onDelete = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/operator/delete_usine",
        {
          UsineID: usine.UsineID,
          OperateurID: OperateurID,
        }
      );
      console.log(response.data);
      onDelet();
    } catch (error) {
      console.error("Error deleting usine:", error);
    }
  };
  console.log(usine, "usine");
  return (
    <>
      <div
        className={`flex justify-between mx-[200px] border-[#D5E7F2] border-[1px] p-5 rounded-[16px] ${!isARH ? "my-[10px]" : "my-[10px]"
          }`}
        style={{
          boxShadow:
            "0px 16px 24px 0px rgba(0, 0, 0, 0.06), 0px 2px 6px 0px rgba(0, 0, 0, 0.04), 0px 0px 1px 0px rgba(0, 0, 0, 0.04)",
        }}
        onClick={handleOpening}
      >
        <div className="flex gap-[60px] justify-center items-center">
          <div>
            <img src={usin} alt="usine" />
          </div>
          <div className="font-bold ">{usine.NomUsine}</div>
        </div>
        <div className="flex justify-center items-center gap-48">
          <div className="items-center flex flex-col justify-center">
            <div className="text-[#778294]">Wilaya</div>
            <div>{usine.Wilaya}</div>
          </div>
          {!isARH && (
            <>
              <button onClick={handleAjouterUnity}>
                <img src={add} alt="Add" />
              </button>
              <button className="" onClick={onDelete}>
                <MdDeleteOutline className="size-6" />
              </button>
            </>
          )}

          <button onClick={handleOpening}>
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      </div>
      {isOpen && <Unities units={units} usine={usine} role={role} />}

      <Modal open={showAddUnity} onClose={() => setShowAddUnity(false)}>
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
          <AddUnite UsineID={usine.UsineID} onSuccess={handleAddUnitySuccess} />
        </div>
      </Modal>
    </>
  );
}
