// src/App.tsx
import logo from "./logo.svg";
import "./App.css";
import Component from "./Components.jsx/sidebar";
import DenseTable from "./Components.jsx/table";
import { Sidebar } from "flowbite-react";
import TableInv from "./Components.jsx/tableInv";
import TableCharge from "./Components.jsx/tableCharge";
import EcritsTable from "./Components.jsx/ecrit";
import Tabs from "./Pages/tabs.jsx";
function App() {
  return (
    <div className="flex h-screen">
      <Component />
      <EcritsTable />
    </div>
  );
}
export default App;
