import React, { useState, useEffect } from "react";
import axios from "axios";
import TabAffichage from "./TabAffichage";
import TabDashboard from "./TabDashboard";

export default function HistoriqueCC() {
    const [classes, setClasses] = useState([]);
    const [operators, setOperators] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectedOperator, setSelectedOperator] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedOperateurID, setSelectedOperatorID] = useState()
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/saisit/get_classe");
                const tauxUtilisationClass = {
                    ID: 'TauxUtilisationID',
                    NomClasse: 'Taux d\'Utilisation'
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
                const response = await axios.get("http://127.0.0.1:5000/operator/Get_all_operateur");
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
                    const response = await axios.post("http://127.0.0.1:5000/operator/GetUnitiesByOperator", {
                        "OperateurNom": selectedOperator
                    });
                    setUnits(response.data);
                } catch (error) {
                    console.error("Error fetching units:", error);
                }
            }
        };
        fetchUnits();
    }, [selectedOperator]);

    return (
        <div className=" ">
            <div className="flex flex-col w-screen">
                <TabDashboard />
                <div className="flex pt-4 justify-center">
                    <div className="w-1/4">
                        <label className="font-medium text-gray-700">Select Operator</label>
                        <select
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            value={selectedOperator}
                            onChange={(e) => {
                                setSelectedOperator(e.target.value);
                                setSelectedOperatorID(e.target.selectedOptions[0].getAttribute('data-id'));

                            }}
                        >
                            <option value="">Select Operator</option>
                            {operators.map((operator) => (
                                <option key={operator.OperateurID} value={operator.Nom_operateur} data-id={operator.OperateurID}>
                                    {operator.Nom_operateur}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-1/4 ">
                        <label className=" font-medium text-gray-700 mt-4">Select Unit</label>
                        <select
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
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
                        <label className="font-medium text-gray-700 mt-4">Select Year</label>
                        <input
                            type="number"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        />
                    </div>

                </div>
                {classes.map((classe) => (
                    <div key={classe.ID} className="mt-8">
                        <div className="font-semibold text-xl ml-3 mb-4">{classe.NomClasse}</div>
                        <TabAffichage IDClasse={classe.ID} selectedYear={selectedYear} selectedUnit={selectedUnit} selectedOperator={selectedOperateurID} />
                    </div>
                ))}
            </div>
        </div>
    );
}
