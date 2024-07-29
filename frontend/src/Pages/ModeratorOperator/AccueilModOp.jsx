import React from "react";
import SideBarModOp from "../../Components.jsx/SideBarModOp";
import { useParams } from "react-router";

const AccueilModOp = () => {
  const { OperateurID } = useParams();
  return (
    <div>
      <SideBarModOp OperateurID={OperateurID} />
    </div>
  );
};

export default AccueilModOp;
