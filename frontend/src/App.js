import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./Pages/auth";
import AdminOp from "./Pages/AdminOp";
import TableauComplet from "./Components.jsx/tableauComplet";
import ParamsTable from "./Components.jsx/parametresop";
import Moderator from "./Pages/Moderator";
import Unites from "./Pages/Unites";

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
        <Route path="/admin-op/:OperateurID/:UsineID" element={<Unites />} />
      </Routes>
    </Router>
  );
}

export default App;
