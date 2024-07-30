import React from "react";
import SideBarOp from "../../Components.jsx/SideBarOp";
import { useParams } from "react-router";
import Card from "../../Components.jsx/carte";
import Mod from "../../Components.jsx/mod";
import AddMod from "../../Components.jsx/addMod";

export default function GestionModOp() {
  const { OperateurID } = useParams();
  return (
    <div className="flex">
      <SideBarOp OperateurID={OperateurID} Role="ADMIN" />

      <Mod />
    </div>
  );
}
