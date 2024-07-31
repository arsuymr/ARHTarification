import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import Modal from "./Modal";
import AddMod from "./addMod";

export default function Mod() {
  const { OperateurID } = useParams();
  const [moderators, setModerators] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [error, setError] = useState("");
  const [showAddMod, setShowAddMod] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility

  const getMod = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/users/get_mod", {
        OperateurID: OperateurID,
      });
      setModerators(response.data);
    } catch (error) {
      console.error("Error fetching moderators:", error);
      setError("Failed to fetch moderators");
    }
  };

  useEffect(() => {
    getMod();
  }, [OperateurID]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleAddMod = () => {
    setShowAddMod(true);
  };

  const handleAddModSuccess = () => {
    getMod();
  };

  const handleCheckboxChange = (email) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(email)
        ? prevSelected.filter((user) => user !== email)
        : [...prevSelected, email]
    );
  };

  const activateAccounts = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/users/activate_account", {
        emails: selectedUsers,
      });
      alert("Selected accounts activated successfully");
      getMod();
    } catch (error) {
      console.error("Error activating accounts:", error);
    }
  };

  const deactivateAccounts = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/users/deactivate_account", {
        emails: selectedUsers,
      });
      alert("Selected accounts deactivated successfully");
      getMod();
    } catch (error) {
      console.error("Error deactivating accounts:", error);
    }
  };

  const deleteAccounts = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/users/delete_account", {
        emails: selectedUsers,
      });
      alert("Selected accounts deleted successfully");
      getMod();
    } catch (error) {
      console.error("Error deleting accounts:", error);
    }
  };

  return (
    <div className="m-[50px] overflow-x-auto shadow-md sm:rounded-lg w-full">
      <div className="flex items-center justify-between pb-4 bg-white dark:bg-gray-900">
        <div className="relative flex-grow mr-4 max-w-xs">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 19l-4-4m0-7A7 7 0 111 8a7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              id="table-search-users"
              className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search for users"
            />
          </div>
        </div>
        <div className="relative">
          <button
            id="dropdownActionButton"
            onClick={toggleDropdown}
            className="inline-flex items-center text-white bg-blue-500 border border-blue-500 focus:outline-none hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
            type="button"
          >
            <span className="sr-only">Action button</span>
            Action
            <svg
              className="w-2.5 h-2.5 ml-2.5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1l4 4 4-4"
              />
            </svg>
          </button>
          <div
            id="dropdownAction"
            className={`absolute z-10 ${
              dropdownOpen ? "block" : "hidden"
            } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600`}
            style={{ top: "100%", right: 0 }}
          >
            <ul
              className="py-1 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="dropdownActionButton"
            >
              <li>
                <button
                  onClick={handleAddMod}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                >
                  Ajouter un modérateur
                </button>
              </li>
              <li>
                <button
                  onClick={activateAccounts}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                >
                  Activer un compte
                </button>
              </li>
              <li>
                <button
                  onClick={deactivateAccounts}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                >
                  Désactiver un compte
                </button>
              </li>
            </ul>
            <div className="py-1">
              <button
                onClick={deleteAccounts}
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white w-full text-left"
              >
                Supprimer un compte
              </button>
            </div>
          </div>
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-4">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" className="px-6 py-3">
              Username
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {moderators.map((moderator, index) => (
            <tr
              key={index}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <td className="w-4 p-4">
                <div className="flex items-center">
                  <input
                    id={`checkbox-table-search-${index}`}
                    type="checkbox"
                    onChange={() => handleCheckboxChange(moderator.email)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    htmlFor={`checkbox-table-search-${index}`}
                    className="sr-only"
                  >
                    checkbox
                  </label>
                </div>
              </td>
              <th
                scope="row"
                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
              >
                <div className="pl-3">
                  <div className="text-base font-semibold">
                    {moderator.username}
                  </div>
                  <div className="font-normal text-gray-500">
                    {moderator.email}
                  </div>
                </div>
              </th>
              <td className="px-6 py-4">{moderator.email}</td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div
                    className="h-2.5 w-2.5 rounded-full mr-2"
                    style={{
                      backgroundColor: moderator.status_color,
                    }}
                  ></div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal show={showAddMod} onClose={() => setShowAddMod(false)}>
        <AddMod onSuccess={handleAddModSuccess} />
      </Modal>
    </div>
  );
}
