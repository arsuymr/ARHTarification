import React, { useEffect, useState } from "react";
import operateur from "../assets/operator.svg";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import UsineCard from "./UsineCard";
import axios from "axios";

export default function OperatorCard({ operator, isARH }) {
  const [isOpen, setIsOpen] = useState(false);
  const [usines, setUsines] = useState([]);
  const getUsines = async (operateurId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/operator/${operateurId}/usines`
      );
      setUsines(response.data);
      console.log("dta", operator);
    } catch (error) {
      console.error("Error getting usines:", error);
    }
  };
  const handleOpening = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    getUsines(operator.OperateurID);
  }, []);
  const onDelet = () => {
    getUsines(operator.OperateurID);
  };
  console.log("hbieneg", usines);
  return (
    <>
      {isARH && (
        <div
          className="flex justify-between border-[#D5E7F2]  border-[1px] p-5 rounded-[16px] "
          style={{
            boxShadow:
              "0px 16px 24px 0px rgba(0, 0, 0, 0.06), 0px 2px 6px 0px rgba(0, 0, 0, 0.04), 0px 0px 1px 0px rgba(0, 0, 0, 0.04)",
          }}
          onClick={handleOpening}
        >
          <div className="flex gap-[60px] justify-center items-center">
            <div>
              <img src={operateur} alt="operator" />
            </div>
            <div className="font-bold uppercase"> {operator.Nom_operateur}</div>
          </div>
          <div className="flex justify-center items-center">
            <button onClick={handleOpening}>
              {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
        </div>
      )}
      <div className={`${!isARH ? "my-[30px]" : ""}`}>
        {usines.length > 0 &&
          (isOpen || !isARH) &&
          usines.map((usine) => (
            <UsineCard onDelet={onDelet} usine={usine} isARH={isARH} />
          ))}
      </div>

      {!usines.length && (isOpen || !isARH) && (
        <div
          className="flex justify-between mx-[200px] border-[#D5E7F2] border-[1px] p-5 rounded-[16px] mb-[30px]"
          style={{
            boxShadow:
              "0px 16px 24px 0px rgba(0, 0, 0, 0.06), 0px 2px 6px 0px rgba(0, 0, 0, 0.04), 0px 0px 1px 0px rgba(0, 0, 0, 0.04)",
          }}
        >
          Aucune usine à afficher
        </div>
      )}
    </>
  );
}
