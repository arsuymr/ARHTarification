import React from "react";
import { NavLink, useParams } from "react-router-dom";

function TabDashboard() {
    const { OperateurID, UnityID } = useParams();

    return (
        <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
                <li className="me-2">
                    <NavLink
                        to={`/DashBoard/Graphical_visualisation`}
                        className={({ isActive }) =>
                            `inline-block p-4 border-b-2 rounded-t-lg ${isActive
                                ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                            }`
                        }
                    >
                        Graphiques
                    </NavLink>
                </li>
                <li className="me-2">
                    <NavLink
                        to={`/DashBoard/Simulation_donnee`}
                        className={({ isActive }) =>
                            `inline-block p-4 border-b-2 rounded-t-lg ${isActive
                                ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                            }`
                        }
                    >
                        Simulation
                    </NavLink>
                </li>
                <li className="me-2">
                    <NavLink
                        to={`/DashBoard/Historique`}
                        className={({ isActive }) =>
                            `inline-block p-4 border-b-2 rounded-t-lg ${isActive
                                ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
                                : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                            }`
                        }
                    >
                        Historique controle cout
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default TabDashboard;
