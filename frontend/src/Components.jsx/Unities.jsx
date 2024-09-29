import React from "react";
import UnityCard from "./UnityCard";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function Unities({ units, usine, role, isARH }) {
  console.log(units)
  return (
    <div
      className="border-[1px] border-blue-300 mx-[250px] p-5 rounded-[16px] flex flex-wrap gap-[50px]"
      style={{
        boxShadow:
          "0px 16px 24px 0px rgba(0, 0, 0, 0.06), 0px 2px 6px 0px rgba(0, 0, 0, 0.04), 0px 0px 1px 0px rgba(0, 0, 0, 0.04)",
      }}
    >
      {!units.length && <div>Aucune unité à afficher.</div>}
      {units.length > 0 && units.map((unity) => <UnityCard unity={unity} usine={usine} role={role} isARH={isARH} />)}
    </div>
  );
}
