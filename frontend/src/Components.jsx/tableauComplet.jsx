import React, { useState } from "react";
import axios from "axios";
import Tableau from "../Components.jsx/tableau";
import { useParams } from "react-router";
import SideBarOp from "./sidebarOp";
import Tabs from "./tabs";

export default function TableauComplet() {
  const [classes, setClasses] = useState([]);
  const { OperateurID } = useParams();
  const getClasses = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:5000/saisit/get_classe"
      );
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  getClasses();

  return (
    <div className="flex">
      <SideBarOp OperateurID={OperateurID} />
      <div className="flex flex-col">
        <Tabs />
        {classes.map((classe) => (
          <div key={classe.ID}>
            <div className="font-semibold text-xl ml-3 mt-[40px] mb-[10px]">
              {classe.NomClasse}
            </div>
            <Tableau IDClasse={classe.ID} />
          </div>
        ))}
      </div>
    </div>
  );
}
