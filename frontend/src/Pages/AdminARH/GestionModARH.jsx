import React from "react";
import SideBarARH from "../../Components.jsx/SideBarARH";
import ModARH from "../../Components.jsx/ModARH";

export default function GestionModARH() {
  return (
    <div className="flex">
      <SideBarARH Role="ADMIN" />
      <ModARH />
    </div>
  );
}
