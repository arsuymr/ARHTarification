import React from "react";
import unite from "../assets/unity.svg";
import { useNavigate, useParams } from "react-router-dom";

export default function UnityCard({ unity, usine, role, isARH }) {
  const { OperateurID, UserID } = useParams();
  const navigate = useNavigate();
  console.log("unity", unity, usine);
  return (
    <div className="flex gap-5">
      <div>
        <img src={unite} alt="unity" />
      </div>
      {isARH ? <div className="text-left  ">
        <div className="text-[#778294]">Unité</div>
        <div>{unity.NomUnity}</div>
        <div className="font-bold text-[#497373]">{unity.typ}</div>
      </div> :
        <button className="text-left  "
          onClick={() => {
            role === "ADMIN" ? navigate(
              `/admin-op/${UserID}/${OperateurID}/${usine.UsineID}/${unity.UnityID}/tableau`
            ) : navigate(
              `/user-op/${UserID}/${OperateurID}/${usine.UsineID}/${unity.UnityID}/tableau`
            )
          }
          }>
          <div className="text-[#778294]">Unité</div>
          <div>{unity.NomUnity}</div>
          <div className="font-bold text-[#497373]">{unity.typ}</div>
        </button>}
    </div>
  );
}
