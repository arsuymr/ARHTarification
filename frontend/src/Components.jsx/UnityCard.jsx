import React from "react";
import unite from "../assets/unity.svg";

export default function UnityCard({ unity }) {
  console.log("unity", unity);
  return (
    <div className="flex gap-5 ">
      <div>
        <img src={unite} alt="unity" />
      </div>
      <div>
        <div className="text-[#778294]">Unité</div>
        <div>{unity.NomUnity}</div>
        <div className="font-bold text-[#497373]">{unity.typ}</div>
      </div>
    </div>
  );
}
