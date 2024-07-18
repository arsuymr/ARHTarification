import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SideBarOp from "../Components.jsx/sidebarOp";
import Tabs from "../Components.jsx/tabs";
import TableauComplet from "../Components.jsx/tableauComplet";
import ParamsTable from "../Components.jsx/parametresop";

function Unity({ Active }) {
  return (
    <div className="flex">
      <div>
        <Tabs Active={Active} />
        <Routes>
          <Route path="/" element={<Navigate to="/donnees" />} />
          <Route path="/donnees" element={<TableauComplet />} />
          <Route path="/parametres-op" element={<ParamsTable />} />
        </Routes>
      </div>
    </div>
  );
}

export default Unity;
