import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Auth from "./Pages/Authentification";
import TableauComplet from "./Components.jsx/tableauComplet";
import ParamsTable from "./Components.jsx/parametresop";
import Unites from "./Pages/Unites";
import HistoriqueCC from "./Components.jsx/HistoriqueCC";
import AccueilOp from "./Pages/AdminOperator/AccueilOperator";
import GestionModARH from "./Pages/AdminARH/GestionModARH";
import GestionModOp from "./Pages/AdminOperator/GestionModOp";
import DetailsOperator from "./Pages/AdminARH/DetailsOperator";
import HistoriqueOp from "./Components.jsx/HistoriqueOperateur";
import Dashboard from "./Components.jsx/Dashboard";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        {/** ADMIN OPERATEUR  */}
        <Route
          path="/admin-op/:UserID/:OperateurID"
          element={<AccueilOp role="ADMIN" />}
        />
        <Route
          path="/admin-op/:UserID/:OperateurID/:UsineID/:UnityID/tableau"
          element={<TableauComplet role="ADMIN" />}
        />
        <Route
          path="/admin-op/:UserID/:OperateurID/:UsineID/:UnityID/parametres-op"
          element={<ParamsTable role="ADMIN" />}
        />
        <Route
          path="/admin-op/:UserID/:OperateurID/AjouterMod"
          element={<GestionModOp />}
        />
        <Route
          path="/admin-op/:UserID/:OperateurID/:UsineID"
          element={<Unites role="ADMIN" Interface="Op" />}
        />
        <Route
          path="/admin-op/:UserID/:OperateurID/Historique"
          element={<HistoriqueOp role="ADMIN" />}
        />
        {/** USER OPERATEUR  */}

        <Route
          path="/user-op/:UserID/:OperateurID/:UsineID/:UnityID/tableau"
          element={<TableauComplet role="USER" />}
        />
        <Route
          path="/user-op/:UserID/:OperateurID/Historique"
          element={<HistoriqueOp role="USER" />}
        />
        <Route
          path="/user-op/:UserID/:OperateurID"
          element={<AccueilOp role="USER" />}
        />
        <Route
          path="/user-op/:UserID/:OperateurID/:UsineID/:UnityID/parametres-op"
          element={<ParamsTable role="USER" />}
        />
        <Route
          path="/user-op/:UserID/:OperateurID/:UsineID"
          element={<Unites role="USER" Interface="Op" />}
        />
        {/** ADMIN ARH  */}
        <Route
          path="/admin-arh/:UserID/"
          element={<Dashboard role="ADMIN" />}
        />
        <Route
          path="/admin-arh/:UserID/DashBoard/Simulation_donnee"
          element={<Dashboard role="ADMIN" />}
        />
        <Route
          path="/admin-arh/:UserID/DashBoard/Historique"
          element={<HistoriqueCC role="ADMIN" />}
        />
        <Route
          path="/admin-arh/:UserID/details"
          element={<DetailsOperator role="ADMIN" />}
        />
        <Route
          path="/admin-arh/:UserID/:OperateurID/:UsineID"
          element={<Unites role="ADMIN" Interface="ARH" />}
        />
        <Route
          path="/admin-arh/:UserID/moderateurs"
          element={<GestionModARH />}
        />

        <Route
          path="/admin-arh/:UserID/DashBoard/Graphical_visualisation"
          element={<Dashboard role="ADMIN" />}
        />
        {/** USER ARH  */}
        <Route
          path="/user-arh/:UserID/details"
          element={<DetailsOperator role="USER" />}
        />

        <Route
          path="/user-arh/:UserID/DashBoard/Graphical_visualisation"
          element={<Dashboard role="USER" />}
        />

        <Route path="/user-arh/:UserID/" element={<Dashboard role="USER" />} />
        <Route
          path="/user-arh/:UserID/DashBoard/Simulation_donnee"
          element={<Dashboard role="USER" />}
        />

        <Route
          path="/user-arh/:UserID/DashBoard/Historique"
          element={<HistoriqueCC role="USER" />}
        />
        <Route
          path="/user-arh/:UserID/:OperateurID/:UsineID"
          element={<Unites role="USER" Interface="ARH" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
