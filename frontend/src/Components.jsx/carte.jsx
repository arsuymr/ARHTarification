import React, { useState } from "react";
import usine from "../assets/petrole.svg";
import axios from "axios";
import { useParams } from "react-router";
import ConfirmDialog from "./ConfirmDialog";

export default function Card({ NomUsine, Wilaya, onClick, UsineID, onDelet }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { OperateurID } = useParams();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const onDelete = async () => {
    console.log(UsineID, OperateurID);
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/operator/delete_usine",
        {
          UsineID: UsineID,
          OperateurID: OperateurID,
        }
      );
      console.log(response.data);
      onDelet();
    } catch (error) {
      console.error("Error deleting usine:", error);
    }
  };

  return (
    <div
      className="relative h-[250px] w-[300px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-end px-4 pt-4">
        <button
          id="dropdownButton"
          onClick={toggleDropdown}
          className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
          type="button"
        >
          <span className="sr-only">Open dropdown</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
        </button>

        <div
          id="dropdown"
          className={`absolute right-4 top-12 z-20 ${
            isDropdownOpen ? "block" : "hidden"
          } text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
        >
          <ul className="py-2" aria-labelledby="dropdownButton">
            <li>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                }}
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center pb-10">
        <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center">
          <img className="w-20 h-20 object-cover" src={usine} alt="Usine" />
        </div>
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {NomUsine}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {Wilaya}
        </span>
      </div>
      <ConfirmDialog
        open={open}
        onClose={handleClose}
        onConfirm={onDelete}
        title="Confirmation de suppression"
        description="Êtes-vous sûr(e) de vouloir supprimer cette usine?"
      />
    </div>
  );
}
