import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import TabAffichage from "./TabAffichage";
import TabDashboard from "./TabDashboard";

export default function HistoriqueOp() {
    const { OperateurID } = useParams();
    const [classes, setClasses] = useState([]);
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/saisit/get_classe");
                setClasses(response.data);
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };
        fetchClasses();
    }, []);


    useEffect(() => {
        const fetchUnits = async () => {
            if (OperateurID) {
                try {
                    const response = await axios.post("http://127.0.0.1:5000/operator/GetUnitiesByOperator", {
                        "OperateurID": OperateurID
                    });
                    setUnits(response.data);
                } catch (error) {
                    console.error("Error fetching units:", error);
                }
            }
        };
        fetchUnits();
    }, []);

    return (
        <div className="">
            <div className="flex flex-col w-full">
                <TabDashboard />
                <div className="p-4">

                    <label className="block text-sm font-medium text-gray-700 mt-4">Select Unit</label>
                    <select
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        value={selectedUnit}
                        onChange={(e) => setSelectedUnit(e.target.value)}
                        disabled={!OperateurID}
                    >
                        <option value="">Select Unit</option>
                        {units.map((unit) => (
                            <option key={unit.UnityID} value={unit.UnityID}>
                                {unit.NomUnity}
                            </option>
                        ))}
                    </select>

                    <label className="block text-sm font-medium text-gray-700 mt-4">Select Year</label>
                    <input
                        type="number"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        min="2020" max="2040"
                    />
                </div>
                {classes.map((classe) => (
                    <div key={classe.ID} className="mt-8">
                        <div className="font-semibold text-xl ml-3 mb-4">{classe.NomClasse}</div>
                        <TabAffichage IDClasse={classe.ID} selectedYear={selectedYear} selectedUnit={selectedUnit} selectedOperator={OperateurID} />
                    </div>
                ))}
            </div>
        </div>
    );
}
