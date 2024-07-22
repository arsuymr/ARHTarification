import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import SideBarOp from "../Components.jsx/sidebarOp";
import Tabs from "../Components.jsx/tabs";
import TableauComplet from "../Components.jsx/tableauComplet";
import ParamsTable from "../Components.jsx/parametresop";
import Login from "../Components.jsx/login";
import logo_arh from "../assets/logo_arh.svg";
function Auth() {
  return (
    <div className="flex ">
      <div className="bg-[#DDE5EB] w-1/2 h-screen flex justify-center items-center">
        <img src={logo_arh} alt="Logo ARH" className="w-100 h-100" />
      </div>
      <div className=" flex items-center justify-center">
        <Login />
      </div>
    </div>
  );
}

export default Auth;
