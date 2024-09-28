import React, { useState, useEffect } from "react";
import axios from "axios";
import logo_arh from "../assets/logo_arh.svg";
import { Link, useParams } from "react-router-dom";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import {
  HiArrowSmRight,
  HiChartPie,
  HiShoppingBag,
  HiUser,
  HiChevronDown,
} from "react-icons/hi";
import AddOperator from "./AddOperator";
import UpdatePassword from "./UpdatePassword";
import dashboard from "../assets/dashboard.svg";
import users from "../assets/users.svg";
import operator from "../assets/operators.svg";

const SideBarARH = ({ Role }) => {
  const { UserID } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [operators, setOperators] = useState([]);
  const [user, setUser] = useState({});
  const [showAddOperator, setShowAddOperator] = useState(false);
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getOperators();
    getUser();
  }, [UserID]);

  const getOperators = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/operator/Get_all_operateur`
      );
      setOperators(response.data);
    } catch (error) {
      console.error("Error getting operators:", error);
    }
  };

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

  const handleAddOperator = () => {
    setShowAddOperator(true);
  };

  const handleAddOperatorSuccess = () => {
    getOperators();
  };

  const handleUpdatePassword = () => {
    setShowUpdatePassword(true);
  };

  const handleUpdatePasswordSuccess = () => {};

  return (
    <div
      className="flex flex-col text-[24px] font-poppins
    "
    >
      <div className="flex items-center justify-center fixed left-[70px] ">
        <img
          src={logo_arh}
          alt="Logo ARH"
          className="w-40 h-40"
          onClick={() => getOperators()}
        />
      </div>
      <aside className="p-8 rounded-r-2xl border-[#D5E7F2] border-[2px] fixed h-screen overflow-y-auto mt-[150px] ">
        <div className="px-10 py-4 mt-16">
          <ul className="space-y-2">
            <li>
              <Link
                to={
                  Role === "ADMIN"
                    ? `/admin-arh/${UserID}`
                    : `/user-arh/${UserID}`
                }
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <img
                  src={dashboard}
                  className=" text-gray-500 transition duration-75 group-hover:text-gray-900"
                />
                <span className="ml-6">Dashboard</span>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100"
                onClick={() => setIsOpen(!isOpen)}
              >
                <img
                  src={operator}
                  alt="o"
                  className=" text-gray-500 transition duration-75 group-hover:text-gray-900"
                />
                <button
                  className="flex-1 ml-6 text-left whitespace-nowrap"
                  onClick={() => {
                    Role === "ADMIN"
                      ? navigate(`/admin-arh/${UserID}/details`)
                      : navigate(`/user-arh/${UserID}/details`);
                  }}
                >
                  Opérateurs
                </button>
                {/* <HiChevronDown
                  className={`w-6 h-6 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                /> */}
              </button>
              {/* <ul className={`${isOpen ? "block" : "hidden"} py-2 space-y-2`}>
                {operators.map((operator) => (
                  <li key={operator.OperateurID}>
                    <button
                      className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 pl-11"

                    >
                      {operator.Nom_operateur}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className="flex items-center w-full p-2 text-base font-semibold text-[#21466F] transition duration-75 rounded-lg hover:bg-gray-100 pl-11"
                    onClick={handleAddOperator}
                  >
                    Ajouter opérateur
                  </button>
                </li>
              </ul> */}
            </li>
            {Role === "ADMIN" && (
              <li>
                <Link
                  to={`/admin-arh/${UserID}/moderateurs`}
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
                >
                  <img
                    src={users}
                    className=" text-gray-500 transition duration-75 group-hover:text-gray-900"
                  />
                  <span className="flex-1 ml-6 whitespace-nowrap">
                    Utilisateurs
                  </span>
                </Link>
              </li>
            )}
            {/* <li>
              <a
                href="/sign-in"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <HiArrowSmRight className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Se déconnecter
                </span>
              </a>
            </li> */}
          </ul>
          {/* 
          <div className=" w-full p-4 text-center text-gray-900">
            <div className="flex flex-col items-start ml-1">
              <div className="flex-1 whitespace-nowrap">
                Connecté en tant que {user.username}
              </div>
              <div className="flex-1 whitespace-nowrap">
                <button className="font-bold" onClick={handleUpdatePassword}>
                  Changer mot de passe.
                </button>
              </div>
            </div>
          </div> */}
        </div>
      </aside>
      <div className="flex-1 ml-64 p-4 overflow-y-auto h-screen">
        {/* Other components/content can be rendered here */}
      </div>
      <Modal show={showAddOperator} onClose={() => setShowAddOperator(false)}>
        <AddOperator onSuccess={handleAddOperatorSuccess} />
      </Modal>
      <Modal
        show={showUpdatePassword}
        onClose={() => setShowUpdatePassword(false)}
      >
        <UpdatePassword onSuccess={handleUpdatePasswordSuccess} />
      </Modal>
    </div>
  );
};

export default SideBarARH;
