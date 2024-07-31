import React, { useState, useEffect } from "react";
import axios from "axios";
import logo_arh from "../assets/logo_arh.svg";
import { Link, useParams } from "react-router-dom";
import Modal from "./Modal";
import { useNavigate } from "react-router-dom";
import {
  HiArrowSmRight,
  HiChartPie,
  HiInbox,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiChevronDown,
} from "react-icons/hi";
import AddOperator from "./AddOperator";
import UpdatePassword from "./UpdatePassword";

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
    <div className="h-screen">
      <aside className="w-64 h-full" aria-label="Sidebar">
        <div className="px-3 py-4 overflow-y-auto rounded bg-gray-50 dark:bg-gray-800 h-full">
          <div className="flex items-center justify-center mb-4">
            <img
              src={logo_arh}
              alt="Logo ARH"
              className="w-40 h-40"
              onClick={() => getOperators()}
            />
          </div>
          <ul className="space-y-2">
            <li>
              <Link
                to={`/admin-arh/${UserID}`}
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HiChartPie className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                onClick={() => setIsOpen(!isOpen)}
              >
                <HiShoppingBag className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 text-left whitespace-nowrap">
                  Opérateurs
                </span>
                <HiChevronDown
                  className={`w-6 h-6 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <ul className={`${isOpen ? "block" : "hidden"} py-2 space-y-2`}>
                {operators.map((operator) => (
                  <li key={operator.OperateurID}>
                    <button
                      className="flex items-center w-full p-2 text-base font-normal text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 pl-11"
                      onClick={() =>
                        navigate(`/admin-arh/${UserID}/${operator.OperateurID}`)
                      }
                    >
                      {operator.Nom_operateur}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    className="flex items-center w-full p-2 text-base font-semibold text-[#21466F] transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 pl-11"
                    onClick={handleAddOperator}
                  >
                    Ajouter opérateur
                  </button>
                </li>
              </ul>
            </li>
            {Role === "ADMIN" && (
              <li>
                <Link
                  to={`/admin-arh/${UserID}/moderateurs`}
                  className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <HiUser className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="flex-1 ml-3 whitespace-nowrap">
                    Modérateurs
                  </span>
                </Link>
              </li>
            )}
            <li>
              <a
                href="https://google.com"
                className="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HiArrowSmRight className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="flex-1 ml-3 whitespace-nowrap">
                  Se déconnecter
                </span>
              </a>
            </li>
          </ul>

          <div className="mt-60">
            <div className="flex-1 ml-3 whitespace-nowrap">
              Connected as {user.username}
            </div>
            <div className="flex-1 ml-3 whitespace-nowrap font-bold">
              <button onClick={handleUpdatePassword}>Change Password</button>
            </div>
          </div>
        </div>
      </aside>
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
