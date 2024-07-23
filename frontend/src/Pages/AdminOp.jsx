import React from "react";
import SideBarOp from "../Components.jsx/sidebarOp";
import { useParams } from "react-router";
import Accueil from "./Accueil";

function AdminOp() {
  const { OperateurID } = useParams();
  return (
    <div className="flex">
      <SideBarOp OperateurID={OperateurID} />
      <Accueil />
    </div>
  );
}

export default AdminOp;
