import React from "react";
import SideBarOp from "../Components.jsx/sidebarOp";
import { useParams } from "react-router";
import Card from "../Components.jsx/carte";

function Moderator() {
  const { OperateurID } = useParams();
  return (
    <div className="flex">
      <SideBarOp OperateurID={OperateurID} />
      <Card />
    </div>
  );
}

export default Moderator;
