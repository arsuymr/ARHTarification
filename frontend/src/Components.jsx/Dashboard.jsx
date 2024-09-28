import React, { useEffect, useState } from 'react';
import SideBarARH from './SideBarARH';
import CompanyIcon from '../assets/company.svg'
import { IoIosArrowForward } from "react-icons/io";
import axios from 'axios';
import Charts from './chart';
import SimulationPage from './Simulation';
import TabDashboard from './TabDashboard';


const Dashboard = ({ role }) => {
    const [selectedOperator, setSelectedOperator] = useState("");
    const [selectedOperatorNom, setSelectedOperatorNom] = useState("");
    const [operators, setOperators] = useState([]);
    useEffect(() => {
        // Fetch all operators on component mount
        const fetchOperators = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:5000/operator/Get_all_operateur"
                );
                const operatorsData = response.data;
                setOperators(operatorsData);
                if (operatorsData.length > 0) {
                    setSelectedOperatorNom(operatorsData[0].Nom_operateur);
                    setSelectedOperator(operatorsData[0].OperateurID)
                }
            } catch (error) {
                console.error("Error fetching operators:", error);
            }
        };

        fetchOperators();
    }, []);

    return (
        <div className='flex bg-[#FBFDFF]'>
            <SideBarARH Role={role} />
            <div className='w-full ml-10'>
                <TabDashboard role={role} />
                <div className='mx-2 my-10'>
                    <div className='w-full '>
                        <h2 className=' ml-4 text-lg'>les Operateurs</h2>
                        <div className='flex justify-between'>
                            {operators.map((operator) => (
                                <button className='rounded-3xl shadow-lg bg-white pl-8 pr-20 pt-5 pb-3  '
                                    key={operator.OperateurID}
                                    value={operator.OperateurID}
                                    onClick={(e) => { setSelectedOperator(e.target.value); setSelectedOperatorNom(operator.Nom_operateur); }}
                                >
                                    <img src={CompanyIcon} alt='' />
                                    <p className='font-medium'>  {operator.Nom_operateur} </p>
                                </button>
                            ))}

                            <IoIosArrowForward className='text-[#4EA4D9] self-center mr-8' />
                        </div>
                    </div>

                    <div className='mt-10 relative  rounded-xl shadow-2xl border-[#D5E7F2] border-2 pb-10'>
                        <h1 className="absolute -top-4  bg-white ml-4 pl-2 pr-10 text-lg text-[#11263C]"> Graphique</h1>
                        <Charts SelectedOperator={selectedOperatorNom} />
                    </div>

                    <div className='my-20'>
                        <SimulationPage SelectedOperator={selectedOperator} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;