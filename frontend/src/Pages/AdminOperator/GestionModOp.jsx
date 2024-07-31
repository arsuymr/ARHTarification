import React from "react";
import { useParams } from "react-router";
import Mod from "../../Components.jsx/mod";
import SideBarOp from "../../Components.jsx/SideBarOp.jsx";

export default function GestionModOp() {
  const { OperateurID } = useParams();
  return (
    <div className="flex">
      <SideBarOp OperateurID={OperateurID} Role="ADMIN" />
      <Mod />
    </div>
  );
}
