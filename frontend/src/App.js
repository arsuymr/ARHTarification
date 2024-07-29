import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./Pages/Authentification";
import TableauComplet from "./Components.jsx/tableauComplet";
import ParamsTable from "./Components.jsx/parametresop";
import Unites from "./Pages/Unites";
import Charts from "./Components.jsx/chart";
import SimulationPage from "./Components.jsx/Simulation";
import HistoriqueCC from "./Components.jsx/HistoriqueCC";
import AccueilARH from "./Pages/AdminARH/AccueilARH";
import AccueilModARH from "./Pages/ModeratorARH/AccueilModARH";
import AccueilOp from "./Pages/AdminOperator/AccueilOperator";
import AccueilModOp from "./Pages/ModeratorOperator/AccueilModOp";
import GestionModARH from "./Pages/AdminARH/GestionModARH";
import GestionModOp from "./Pages/AdminOperator/GestionModOp";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/admin-op/:OperateurID" element={<AccueilOp />} />
        <Route path="/admin-arh" element={<AccueilARH />} />
        <Route path="/mod-arh" element={<AccueilModARH />} />
        <Route path="/mod-op/:OperateurID" element={<AccueilModOp />} />
        <Route
          path="/admin-op/:OperateurID/:UnityID/tableau"
          element={<TableauComplet />}
        />
        <Route
          path="/mod-op/:OperateurID/:UnityID/tableau"
          element={<TableauComplet />}
        />
        <Route
          path="/admin-op/:OperateurID/:UnityID/parametres-op"
          element={<ParamsTable />}
        />
        <Route
          path="/mod-op/:OperateurID/:UnityID/parametres-op"
          element={<ParamsTable />}
        />
        <Route
          path="/admin-op/:OperateurID/AjouterMod"
          element={<GestionModOp />}
        />
        <Route path="/admin-arh/moderateurs" element={<GestionModARH />} />
        <Route path="/admin-op/:OperateurID/:UsineID" element={<Unites />} />
        <Route
          path="/admin-arh/DashBoard/Graphical_visualisation"
          element={<Charts role="ADMIN" />}
        />
        <Route
          path="/user-arh/DashBoard/Graphical_visualisation"
          element={<Charts role="USER" />}
        />
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
