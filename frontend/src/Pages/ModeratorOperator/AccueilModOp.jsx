import React from "react";

import { useParams } from "react-router";
import SideBarOp from "../../Components.jsx/SideBarOp";

const AccueilModOp = () => {
  const { OperateurID } = useParams();
  return (
    <div>
      <SideBarOp OperateurID={OperateurID} Role="USER" />
    </div>
  );
};

export default AccueilModOp;
