// src/App.tsx
import logo from "./logo.svg";
import "./App.css";
import Component from "./Components.jsx/sidebar";
import DenseTable from "./Components.jsx/table";
import { Sidebar } from "flowbite-react";
import TableInv from "./Components.jsx/tableInv";
import TableCharge from "./Components.jsx/tableCharge";

function App() {
  return (
    <div className="flex h-screen">
      <Component />
      <div className="flex flex-col mt-10 gap-4 bg-[#f2f9fe]">
        <div className="text-2xl">Investissements : </div>
        <TableInv className="px-8" />
        <div className="text-2xl">Charges d'exploitation : </div>
        <TableCharge />
        <div className="text-2xl">Production : </div>
        <DenseTable />
      </div>
    </div>
  );
}

export default App;
