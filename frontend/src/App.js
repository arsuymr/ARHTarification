import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./Pages/auth";
import AdminOp from "./Pages/AdminOp";
import TableauComplet from "./Components.jsx/tableauComplet";
import ParamsTable from "./Components.jsx/parametresop";
import Moderator from "./Pages/Moderator";
import Unites from "./Pages/Unites";
import Charts from "./Components.jsx/chart";
import SimulationPage from "./Components.jsx/Simulation";
import HistoriqueCC from "./Components.jsx/HistoriqueCC";
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
        <Route path="/DashBoard" element={<Charts />} />
        <Route path="/DashBoard/Graphical_visualisation" element={<Charts />} />
        <Route
          path="/DashBoard/Simulation_donnee"
          element={<SimulationPage />}
        />
        <Route path="/DashBoard/Historique" element={<HistoriqueCC />} />
      </Routes>
    </Router>
  );
}

export default App;
