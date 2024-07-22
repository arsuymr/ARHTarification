import React from "react";
import SideBarOp from "../Components.jsx/sidebarOp";
import { useParams } from "react-router";
import AddMod from "../Components.jsx/addMod";
import Mod from "../Components.jsx/mod";

function Moderator() {
  const { OperateurID } = useParams();
  return (
    <div className="flex">
      <SideBarOp OperateurID={OperateurID} />
      <div className="flex justify-between items-center ">
        <Mod />
        <AddMod />
      </div>
    </div>
  );
}

export default Moderator;
