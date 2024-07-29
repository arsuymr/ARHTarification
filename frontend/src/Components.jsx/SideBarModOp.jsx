import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import logo_arh from "../assets/logo_arh.svg";
import {
  HiArrowSmRight,
  HiInbox,
  HiShoppingBag,
  HiUser,
  HiChevronDown,
} from "react-icons/hi";
import AddUnity from "./addUnity"; // Import the AddUnity component
import Modal from "./Modal"; // Import the Modal component
import AddUsine from "./ajoutUsine";
import AqUsine from "./aqUsine";

const SideBarModOp = ({ OperateurID }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [usines, setUsines] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedUsine, setSelectedUsine] = useState(null);
  const [showAddUsine, setShowAddUsine] = useState(false);
  const [showAqUsine, setShowAqUsine] = useState(false);
  const [showAddUnity, setShowAddUnity] = useState(false);
  const [currentUsineId, setCurrentUsineId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUsines(OperateurID);
    // Fetch usines when component mounts or OperateurID changes
  }, [OperateurID]);

  useEffect(() => {
    if (selectedUsine) {
      getUnits(selectedUsine.UsineID); // Fetch units when a new usine is selected
    }
  }, [selectedUsine]);

  const getUsines = async (operateurId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/operator/${operateurId}/usines`
      );
      setUsines(response.data);
      console.log(usines);
    } catch (error) {
      console.error("Error getting usines:", error);
    }
  };

  const getUnits = async (usineId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/operator/${usineId}/units`
      );
      setUnits(response.data);
    } catch (error) {
      console.error("Error getting units:", error);
    }
  };

  const handleUsineClick = (usine) => {
    if (selectedUsine && selectedUsine.UsineID === usine.UsineID) {
      // Deselect usine if clicking on the already selected one
      setSelectedUsine(null);
      setUnits([]);
    } else {
      // Select new usine and fetch its units
      setSelectedUsine(usine);
      getUnits(usine.UsineID);
    }
  };

  const handleAjouterUsine = () => {
    setShowAddUsine(true);
  };

  const handleAqUsine = () => {
    setShowAqUsine(true);
  };

  const handleAddUsineSuccess = () => {
    setShowAddUsine(false);
    getUsines(OperateurID); // Refresh the list of usines
  };

  const handleAqUsineSuccess = () => {
    setShowAqUsine(false);
    getUsines(OperateurID); // Refresh the list of usines
  };

  const handleAjouterUnity = (usineId) => {
    setCurrentUsineId(usineId);
    setShowAddUnity(true);
  };

  const handleAddUnitySuccess = () => {
    setShowAddUnity(false);
    if (selectedUsine) {
      getUnits(selectedUsine.UsineID); // Refresh the list of units
    }
  };

  return (
    <div className="h-screen relative">
      <aside className="w-64 h-full" aria-label="Sidebar">
        <div className="px-3 py-4 overflow-y-auto rounded bg-gray-50 dark:bg-gray-800 h-full">
          <div className="flex items-center justify-center mb-4">
            <img
              src={logo_arh}
              alt="Logo ARH"
              className="w-40 h-40"
              onClick={() => getUsines(OperateurID)} // Fetch usines on logo click
            />
          </div>
          <button className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
            <HiInbox className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
            <span
              className="flex-1 ml-3 whitespace-nowrap "
              onClick={() => navigate(`/mod-op/${OperateurID}/`)}
            >
              Accueil
            </span>
          </button>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={() => setIsOpen(!isOpen)}
              >
                <HiShoppingBag className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">
                  Usines
                </span>
                <HiChevronDown
                  className={`w-6 h-6 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <ul
                className={`${isOpen ? "block" : "hidden"} py-2 space-y-2 pl-4`}
              >
                {usines.map((usine) => (
                  <li key={usine.UsineID}>
                    <button
                      className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                      onClick={() => handleUsineClick(usine)}
                    >
                      {usine.NomUsine}
                    </button>
                    {selectedUsine &&
                      selectedUsine.UsineID === usine.UsineID && (
                        <ul className="py-2 space-y-2 pl-6">
                          {units.map((unit) => (
                            <li key={unit.UnityID}>
                              <button
                                className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                onClick={() =>
                                  navigate(
                                    `/mod-op/${OperateurID}/${unit.UnityID}/tableau`
                                  )
                                }
                              >
                                {unit.NomUnity}
                              </button>
                            </li>
                          ))}
                          <li>
                            <button
                              className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                              onClick={() => handleAjouterUnity(usine.UsineID)}
                            >
                              Ajouter Unité
                            </button>
                          </li>
                        </ul>
                      )}
                  </li>
                ))}
                <li>
                  <button
                    className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={handleAjouterUsine}
                  >
                    Ajouter usine
                  </button>
                </li>
                <li>
                  <button
                    className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={handleAqUsine}
                  >
                    Acquisition d'une usine
                  </button>
                </li>
              </ul>
            </li>

            <li>
              <NavLink
                to="/sign-in"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HiArrowSmRight className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Se déconnecter
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>

      <Modal show={showAddUsine} onClose={() => setShowAddUsine(false)}>
        <AddUsine onSuccess={handleAddUsineSuccess} />
      </Modal>

      <Modal show={showAddUnity} onClose={() => setShowAddUnity(false)}>
        <AddUnity UsineID={currentUsineId} onSuccess={handleAddUnitySuccess} />
      </Modal>

      <Modal show={showAqUsine} onClose={() => setShowAqUsine(false)}>
        <AqUsine onSuccess={handleAqUsineSuccess} />
      </Modal>
    </div>
  );
};

export default SideBarModOp;
