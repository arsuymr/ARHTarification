import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SideBarOp from "./Components.jsx/sidebarOp";
import EcritsTable from "./Components.jsx/ecrit";
import Unity from "./Pages/unity";
import Login from "./Components.jsx/login";
import Register from "./Components.jsx/register";
import Auth from "./Pages/auth";
import AdminOp from "./Pages/AdminOp";
import TableauComplet from "./Components.jsx/tableauComplet";
import ParamsTable from "./Components.jsx/parametresop";
import AddMod from "./Components.jsx/addMod";
import Moderator from "./Pages/Moderator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/admin-op/:OperateurID" element={<AdminOp />} />
        <Route
          path="/admin-op/:OperateurID/:UnityID/tableau"
          element={<TableauComplet />}
        />
        <Route
          path="/admin-op/:OperateurID/:UnityID/parametres-op"
          element={<ParamsTable />}
        />
        <Route
          path="/admin-op/:OperateurID/AjouterMod"
          element={<Moderator />}
        />
      </Routes>
    </Router>
  );
}

export default App;
