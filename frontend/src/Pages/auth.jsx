import React from "react";
import Login from "../Components.jsx/login";
import logo_arh from "../assets/logo_arh.svg";
function Auth() {
  return (
    <div className="flex ">
      <div className="bg-[#DDE5EB] w-1/2 h-screen flex justify-center items-center">
        <img src={logo_arh} alt="Logo ARH" className="w-100 h-100" />
      </div>
      <div className=" flex items-center justify-center">
        <Login />
      </div>
    </div>
  );
}

export default Auth;
