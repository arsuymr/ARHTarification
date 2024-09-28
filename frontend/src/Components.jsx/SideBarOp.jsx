import React, { useState, useEffect } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import axios from "axios";
import {
  HiInbox,
  HiShoppingBag,
  HiUser,
  HiArrowSmRight,
  HiChevronDown,
} from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import logo_arh from "../assets/logo_arh.svg";
import Modal from "./Modal";
import AddUnity from "./addUnity";
import AddUsine from "./ajoutUsine";
import AqUsine from "./aqUsine";
import UpdatePassword from "./UpdatePassword";
import users from "../assets/users.svg";
import usines from "../assets/usines.svg";
import history from "../assets/history.svg";
import home from "../assets/home.svg";

const SideBarOp = ({ Role }) => {
  const { OperateurID, UserID } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [showAddUsine, setShowAddUsine] = useState(false);
  const [showAqUsine, setShowAqUsine] = useState(false);
  const [showAddUnity, setShowAddUnity] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    getUser(UserID);
  }, [UserID]);

  const getUser = async () => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/users/get_user`,
        { UserID }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error getting user:", error);
    }
  };

  const handleAddUsine = () => {
    setShowAddUsine(true);
  };

  const handleAqUsine = () => {
    setShowAqUsine(true);
  };

  const handleAddUnity = () => {
    setShowAddUnity(true);
  };

  const handleUpdatePassword = () => {
    setShowUpdatePassword(true);
  };

  return (
    <div className="flex relative text-[24px] ">
      {" "}
      <div className="flex items-center justify-center fixed left-[70px] ">
        <img
          src={logo_arh}
          alt="Logo ARH"
          className="w-40 h-40"
          onClick={() => navigate(`/admin-op/${UserID}/${OperateurID}/`)}
        />
      </div>
      <aside className="p-8 rounded-r-2xl border-[#D5E7F2] border-[2px] fixed h-screen overflow-y-auto mt-[150px] ">
        <div className="px-10 py-4 mt-16">
          <button className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100">
            <img className="w-6 h-6 text-gray-500" src={home} alt="home" />
            <span
              className="ml-6"
              onClick={() => navigate(`/admin-op/${UserID}/${OperateurID}/`)}
            >
              Accueil
            </span>
          </button>
          <ul className="space-y-2">
            <li>
              <button
                className="flex items-center w-full p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
                onClick={() => {
                  setIsOpen(!isOpen);
                  navigate(`/admin-op/${UserID}/${OperateurID}/`);
                }}
              >
                <img
                  className="w-6 h-6 text-gray-500 "
                  src={usines}
                  alt="usines"
                />
                <span className="ml-6">Usines</span>
                {/* <HiChevronDown
                  className={`ml-auto w-6 h-6 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                /> */}
              </button>
              {/* {isOpen && (
                <ul className="space-y-2 pl-4">
                  <li>
                    <button
                      className="flex items-center w-full p-2 text-base font-semibold text-blue-600 rounded-lg hover:bg-gray-100"
                      onClick={handleAddUsine}
                    >
                      Ajouter usine
                    </button>
                  </li>
                  <li>
                    <button
                      className="flex items-center w-full p-2 text-base font-semibold text-blue-600 rounded-lg hover:bg-gray-100"
                      onClick={handleAqUsine}
                    >
                      Acquisition d'une usine
                    </button>
                  </li>
                </ul>
              )} */}
            </li>
            {Role === "ADMIN" && (
              <li>
                <button
                  className="flex items-center w-full p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
                  onClick={() =>
                    navigate(`/admin-op/${UserID}/${OperateurID}/AjouterMod`)
                  }
                >
                  <img
                    className="w-6 h-6 text-gray-500"
                    src={users}
                    alt="users"
                  />
                  <span className="ml-6">Utilisateurs</span>
                </button>
              </li>
            )}
            <li>
              <button
                className="flex items-center w-full p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
                onClick={() =>
                  navigate(
                    Role === "ADMIN"
                      ? `/admin-op/${UserID}/${OperateurID}/Historique`
                      : `/user-op/${UserID}/${OperateurID}/Historique`
                  )
                }
              >
                <img
                  className="w-6 h-6 text-gray-500"
                  src={history}
                  alt="history"
                />
                <span className="ml-6">Historique</span>
              </button>
            </li>
            {/* <li>
              <NavLink
                to="/sign-in"
                className="flex items-center w-full p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <HiArrowSmRight className="w-6 h-6 text-gray-500" />
                <span className="ml-3">Se déconnecter</span>
              </NavLink>
            </li> */}
          </ul>
        </div>
        {/* <div className="w-full p-4 text-center text-gray-900">
          <div className="flex flex-col items-start">
            <span>Connecté en tant que {user.username}</span>
            <button className="font-bold" onClick={handleUpdatePassword}>
              Changer mot de passe.
            </button>
          </div>
        </div> */}
      </aside>
      {/* Modals */}
      <Modal show={showAddUsine} onClose={() => setShowAddUsine(false)}>
        <AddUsine />
      </Modal>
      <Modal show={showAqUsine} onClose={() => setShowAqUsine(false)}>
        <AqUsine />
      </Modal>
      <Modal show={showAddUnity} onClose={() => setShowAddUnity(false)}>
        <AddUnity />
      </Modal>
      <Modal
        show={showUpdatePassword}
        onClose={() => setShowUpdatePassword(false)}
      >
        <UpdatePassword />
      </Modal>
    </div>
  );
};

export default SideBarOp;
