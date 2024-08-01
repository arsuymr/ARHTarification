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
import DetailsOperator from "./Pages/AdminARH/DetailsOperator";
import HistoriqueOp from "./Components.jsx/HistoriqueOperateur";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route
          path="/admin-op/:UserID/:OperateurID"
          element={<AccueilOp role="ADMIN" />}
        />
        <Route path="/admin-arh/:UserID/" element={<Charts role="ADMIN" />} />
        <Route
          path="/admin-arh/:UserID/:OperateurID"
          element={<DetailsOperator />}
        />
        <Route
          path="/admin-arh/:UserID/:OperateurID/:UsineID"
          element={<Unites role="ADMINARH" />}
        />
        <Route path="/mod-arh/:UserID/" element={<AccueilModARH />} />
        <Route
          path="/mod-op/:UserID/:OperateurID"
          element={<AccueilOp role="USER" />}
        />
        <Route
          path="/admin-op/:UserID/:OperateurID/:UnityID/tableau"
          element={<TableauComplet />}
        />
        <Route
          path="/mod-op/:UserID/:OperateurID/:UnityID/tableau"
          element={<TableauComplet />}
        />
        <Route
          path="/admin-op/:UserID/:OperateurID/:UnityID/parametres-op"
          element={<ParamsTable />}
        />
        <Route
          path="/mod-op/:UserID/:OperateurID/:UnityID/parametres-op"
          element={<ParamsTable />}
        />
        <Route
          path="/admin-op/:UserID/:OperateurID/AjouterMod"
          element={<GestionModOp />}
        />
        <Route
          path="/admin-arh/:UserID/moderateurs"
          element={<GestionModARH />}
        />
        <Route
          path="/admin-op/:UserID/:OperateurID/:UsineID"
          element={<Unites role="ADMINOP" />}
        />
        <Route
          path="/admin-arh/:UserID/DashBoard/Graphical_visualisation"
          element={<Charts role="ADMIN" />}
        />
        <Route
          path="/user-arh/:UserID/DashBoard/Graphical_visualisation"
          element={<Charts role="USER" />}
        />
        <Route
          path="/admin-arh/:UserID/DashBoard/Simulation_donnee"
          element={<SimulationPage role="ADMIN" />}
        />
        <Route
          path="/user-arh/:UserID/DashBoard/Simulation_donnee"
          element={<SimulationPage role="USER" />}
        />
        <Route
          path="/admin-arh/:UserID/DashBoard/Historique"
          element={<HistoriqueCC role="ADMIN" />}
        />
        <Route
          path="/user-arh/:UserID/DashBoard/Historique"
          element={<HistoriqueCC role="USER" />}
        />
        <Route
          path="/admin-op/:UserID/:OperateurID/Historique"
          element={<HistoriqueOp role="ADMIN" />}
        />
        <Route
          path="/user-op/:UserID/:OperateurID/Historique"
          element={<HistoriqueOp role="USER" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
