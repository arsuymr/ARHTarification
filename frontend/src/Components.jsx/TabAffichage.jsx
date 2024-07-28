import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

const TabAffichage = ({ IDClasse, selectedYear, selectedUnit, selectedOperator }) => {
    const [data, setData] = useState([]);
    const [nomsSR, setNomsSR] = useState([]);
    const [years, setYears] = useState([]);
    const [codeSRs, setCodeSRs] = useState([]);


    const getSR = async (IDClasse) => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/saisit/get_SR", {
                params: { IDClasse: IDClasse },
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching écrits:", error);
            return [];
        }
    };

    // Function to fetch all data for the provided IDClasse and initial years
    const getALL = async (IDClasse, codeSRs) => {
        try {
            const Response = await axios.get("http://127.0.0.1:5000/saisit/get_CC", {
                params: {
                    UnityID: selectedUnit,
                    AnneeActuelle: selectedYear
                }, // Use the actual selectedUnit here
            });
            const years = Response.data.years;
            const CCID = Response.data.CCID;
            console.log(selectedUnit, CCID, years);

            if (!Array.isArray(years)) {
                throw new Error('Years data is not an array');
            }
            setYears(years)

            const promises = codeSRs.map((codeSR) =>
                Promise.all(
                    years.map((year) =>
                        axios
                            .get("http://127.0.0.1:5000/saisit/get_all", {
                                params: {
                                    CCID: CCID,
                                    IDClasse: IDClasse,
                                    AnneePrevision: year,
                                    UnityID: selectedUnit,
                                    CodeSR: codeSR,
                                },
                            })
                            .then((response) =>
                                response.data.data.length > 0 ? response.data.data[0].Valeur : "0.0"
                            )
                            .catch(() => "0.0")
                    )
                )
            );

            const results = await Promise.all(promises);
            return results;
        } catch (error) {
            console.error("Error fetching data:", error);
            return Array(codeSRs.length).fill(Array(19).fill("0.0"));
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            if (IDClasse && selectedUnit && selectedOperator) {
                const response = await getSR(IDClasse);
                const nomSRs = response.map((item) => item.NomSR);
                const codeSRs = response.map((item) => item.codeSR);
                setNomsSR(nomSRs);
                setCodeSRs(codeSRs);

                const initialInvestissements = await getALL(IDClasse, codeSRs);
                setData(initialInvestissements);
            }
        };
        fetchData();
    }, [IDClasse, selectedYear, selectedUnit, selectedOperator]);

    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        <TableCell>Année</TableCell>
                        {years.map((year) => (
                            <TableCell key={year} align="center">
                                {year}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {nomsSR.map((nomSR, rowIndex) => (
                        <TableRow key={nomSR}>
                            <TableCell component="th" scope="row">
                                {nomSR}
                            </TableCell>
                            {data[rowIndex] &&
                                data[rowIndex].map((value, colIndex) => (
                                    <TableCell key={colIndex} align="center">
                                        {value}
                                    </TableCell>
                                ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TabAffichage;
