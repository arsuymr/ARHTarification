import React, { useState, useEffect } from "react";
import axios from "axios";
import TabAffichage from "./TabAffichage";
import TabDashboard from "./TabDashboard";
import SideBarARH from "./SideBarARH";
import { Alert, AlertTitle, Stack } from "@mui/material";

export default function HistoriqueCC({ role }) {
    const [classes, setClasses] = useState([]);
    const [operators, setOperators] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectedOperator, setSelectedOperator] = useState("");
    const [selectedUnit, setSelectedUnit] = useState("");
    const [selectedYear, setSelectedYear] = useState();
    const [selectedOperateurID, setSelectedOperatorID] = useState();
    const [ErrorMessage, setErrorMessage] = useState(false);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:5000/saisit/get_classe"
                );
                const tauxUtilisationClass = {
                    ID: "TauxUtilisationID",
                    NomClasse: "Taux d'Utilisation",
                };

                // Add the Taux d'Utilisation class to the fetched classes
                setClasses([...response.data, tauxUtilisationClass]);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };
        fetchClasses();
    }, []);

    useEffect(() => {
        const fetchOperators = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:5000/operator/Get_all_operateur"
                );
                setOperators(response.data);
            } catch (error) {
                console.error("Error fetching operators:", error);
            }
        };
        fetchOperators();
    }, []);

    useEffect(() => {
        const fetchUnits = async () => {
            if (selectedOperator) {
                try {
                    const response = await axios.post(
                        "http://127.0.0.1:5000/operator/GetUnitiesByOperator",
                        {
                            OperateurNom: selectedOperator,
                        }
                    );
                    setUnits(response.data);
                } catch (error) {
                    console.error("Error fetching units:", error);
                }
            }
        };
        fetchUnits();
    }, [selectedOperator]);

    return (
        <div className="flex">
            <SideBarARH Role={role} />
            <div className="flex flex-col w-screen ">
                <TabDashboard role={role} />
                <div className="mt-10 relative px-5 rounded-xl shadow-2xl border-[#D5E7F2] border-2 pb-10 mx-2">
                    <div className="absolute -top-4 flex justify-center gap-2">
                        <div className=" ">
                            <select
                                className="border-2 border-[#ECE9F1]"
                                value={selectedOperator}
                                onChange={(e) => {
                                    setSelectedOperator(e.target.value);
                                    setSelectedOperatorID(
                                        e.target.selectedOptions[0].getAttribute("data-id")
                                    );
                                }}
                            >
                                <option value="">Select Operator</option>
                                {operators.map((operator) => (
                                    <option
                                        key={operator.OperateurID}
                                        value={operator.Nom_operateur}
                                        data-id={operator.OperateurID}
                                    >
                                        {operator.Nom_operateur}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-1/4 ">
                            <select
                                className="border-2 border-[#ECE9F1]"
                                value={selectedUnit}
                                onChange={(e) => setSelectedUnit(e.target.value)}
                                disabled={!selectedOperator}
                            >
                                <option value="">Select Unit</option>
                                {units.map((unit) => (
                                    <option key={unit.UnityID} value={unit.UnityID}>
                                        {unit.NomUnity}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="w-1/4">
                            <input
                                type="number"
                                placeholder="Date"
                                className="border-2 border-[#ECE9F1] "
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                            />
                        </div>
                    </div>
                    {ErrorMessage && (<Stack sx={{ width: '100%', padding: '16px' }} spacing={2}>
                        <Alert severity="info">
                            <AlertTitle>Info</AlertTitle>
                            Aucune donnée disponible pour les filtres sélectionnés.
                        </Alert>
                    </Stack>)}
                    {classes.map((classe) => (
                        <div key={classe.ID}>
                            <TabAffichage
                                IDClasse={classe.ID}
                                NomClasse={classe.NomClasse}
                                selectedYear={selectedYear}
                                selectedUnit={selectedUnit}
                                selectedOperator={selectedOperateurID}
                                setErrorMessage={setErrorMessage}
                            />
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}
