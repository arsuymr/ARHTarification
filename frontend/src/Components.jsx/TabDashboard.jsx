import React from "react";
import { NavLink, useParams } from "react-router-dom";

function TabDashboard({ role }) {
    const { UserID } = useParams();
    return (
        <div className="text-sm font-semibold text-center text-[#D5E7F2] ">
            <ul className="flex flex-wrap -mb-px">
                <li className="me-2">
                    <NavLink
                        to={role === "ADMIN" ? `/admin-arh/${UserID}/DashBoard/Graphical_visualisation` : `/user-arh/${UserID}/DashBoard/Graphical_visualisation`}
                        className={({ isActive }) =>
                            `inline-block p-4 border-b-2 rounded-t-lg  hover:border-blue-600 ${isActive
                                ? "text-[#559DDB] border-[#559DDB]"
                                : "border-transparent hover:text-[#559DDB] hover:border-[#559DDB]"
                            }`
                        }
                    >
                        Graphiques
                    </NavLink>
                </li>
                <li className="me-2">
                    <NavLink
                        to={role === "ADMIN" ? `/admin-arh/${UserID}/DashBoard/Historique` : `/user-arh/${UserID}/DashBoard/Historique`}
                        className={({ isActive }) =>
                            `inline-block p-4 border-b-2 rounded-t-lg hover:border-blue-600 ${isActive
                                ? "text-[#559DDB] border-[#559DDB]"
                                : "border-transparent hover:text-[#559DDB] hover:border-[#559DDB]"
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
