import React from "react";
import SideBarARH from "../../Components.jsx/SideBarARH";
import ModARH from "../../Components.jsx/ModARH";
import AddModARH from "../../Components.jsx/AddModARH";

export default function GestionModARH() {
  return (
    <div className="flex">
      <SideBarARH />
      <ModARH/>
      <AddModARH />
    </div>
  );
}
