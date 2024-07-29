import React, { useState, useEffect } from "react";
import axios from "axios";
import logo_arh from "../assets/logo_arh.svg";
import { Link } from "react-router-dom";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiChevronDown,
} from "react-icons/hi";

const SideBarARH = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [usines, setUsines] = useState([]);
  const [selectedUsine, setSelectedUsine] = useState(null);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    getUsines(1); // Replace with the appropriate operateurId
  }, []);

  const getUsines = async (operateurId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/operator/${operateurId}`
      );
      setUsines(response.data);
      console.log("unites");
    } catch (error) {
      console.error("Error getting usines:", error);
    }
  };

  const getUnits = async (usineId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/operator/${usineId}/unity`
      );
      setUnits(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error getting units:", error);
    }
  };

  return (
    <div className="h-screen">
      <aside className="w-64 h-full" aria-label="Sidebar">
        <div className="px-3 py-4 overflow-y-auto rounded bg-gray-50 dark:bg-gray-800 h-full">
          <div className="flex items-center justify-center mb-4">
            <img
              src={logo_arh}
              alt="Logo ARH"
              className="w-40 h-40"
              onClick={() => getUsines(1)} // Replace with appropriate operateurId
            />
          </div>
          <ul className="space-y-2">
            <li>
              <a
                href="google.com"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HiChartPie className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-3">Dashboard</span>
              </a>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={() => setIsOpen(!isOpen)}
              >
                <HiShoppingBag className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">
                  Unités
                </span>
                <HiChevronDown
                  className={`w-6 h-6 transition-transform ${isOpen ? "rotate-180" : ""
                    }`}
                />
              </button>
              <ul className={`${isOpen ? "block" : "hidden"} py-2 space-y-2`}>
                {usines.map((usine) => (
                  <li key={usine.usineID}>
                    <button className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 pl-11">
                      {usine.NomUnity}
                    </button>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link
                to="/admin-arh/moderateurs"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HiUser className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Modérateurs
                </span>
              </Link>
            </li>


            <li>
              <a
                href="google.com"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HiArrowSmRight className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 whitespace-nowrap">Sign In</span>
              </a>
            </li>
            <li>
              <a
                href="google.com"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HiArrowSmRight className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 whitespace-nowrap">Sign Up</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default SideBarARH;
