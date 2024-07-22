import React from "react";
import { Route, Routes, Navigate, useParams } from "react-router-dom";
import SideBarOp from "../Components.jsx/sidebarOp";
import Tabs from "../Components.jsx/tabs";
import TableauComplet from "../Components.jsx/tableauComplet";
import ParamsTable from "../Components.jsx/parametresop";

function Unity() {
  const { OperateurID } = useParams();
  return (
    <div className="flex">
     
    </div>
  );
}

export default Unity;
