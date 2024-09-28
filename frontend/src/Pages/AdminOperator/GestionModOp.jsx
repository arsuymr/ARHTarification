import React from "react";
import Mod from "../../Components.jsx/mod";
import SideBarOp from "../../Components.jsx/SideBarOp.jsx";

export default function GestionModOp() {
  return (
    <div className="flex">
      <SideBarOp Role="ADMIN" />

      <Mod />
    </div>
  );
}
