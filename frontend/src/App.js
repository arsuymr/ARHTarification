import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SideBarOp from "./Components.jsx/sidebarOp";
import EcritsTable from "./Components.jsx/ecrit";
import Unity from "./Pages/unity";

function App() {
  return (
    <Router>
      <div className="flex">
        <SideBarOp />
        <div className="content flex-grow">
          <Routes>
            <Route path="/ecrits" element={<EcritsTable />} />
            <Route path="/unity" element={<Unity Active={1} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
