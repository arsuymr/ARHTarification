import React from "react";
import SideBarOp from "../Components.jsx/sidebarOp";
import { useParams } from "react-router";

function AdminOp() {
  const { OperateurID } = useParams();
  console.log("hbieng", OperateurID);
  return (
    <div>
      <SideBarOp OperateurID={OperateurID} />
    </div>
  );
}

export default AdminOp;
