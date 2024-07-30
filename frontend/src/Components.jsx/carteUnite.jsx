import React, { useState } from "react";
import usine from "../assets/petrole.svg";

export default function CardUnity({ NomUnity, typ }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative h-[250px] w-[300px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer flex items-center justify-center">
      <div className="flex flex-col items-center pb-10">
        <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center">
          <img className="w-20 h-20 object-cover " src={usine} alt="Usine" />
        </div>
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {NomUnity}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">{typ}</span>
      </div>
    </div>
  );
}
