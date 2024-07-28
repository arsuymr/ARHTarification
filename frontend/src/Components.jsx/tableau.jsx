import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";
import { useParams } from "react-router";

const Tableau = ({ IDClasse, CCID }) => {
  const { UnityID, OperateurID } = useParams();
  const [data, setData] = useState([]);
  const [nomsSR, setNomsSR] = useState([]);
  const [codeSRs, setCodeSRs] = useState([]);
  const [years, setYears] = useState([]);


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
      console.log(UnityID, CCID)
      const yearsResponse = await axios.get("http://127.0.0.1:5000/saisit/get_recent_CC", {
        params: { UnityID: UnityID }, // Use the actual UnityID here
      });
      const years = yearsResponse.data.years; // Assurez-vous que `years` est un tableau

      // Assurez-vous que `years` est bien un tableau
      if (!Array.isArray(years)) {
        throw new Error('Years data is not an array');
      }
      setYears(years)
      // Fetch all data for the provided IDClasse, codeSRs, and CCID
      const promises = codeSRs.map((codeSR) =>
        Promise.all(
          years.map((year) =>
            axios
              .get("http://127.0.0.1:5000/saisit/get_all", {
                params: {
                  CCID: CCID,
                  IDClasse: IDClasse,
                  AnneePrevision: year,
                  UnityID: UnityID,
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

  // Fetch NomSR and initial data for the provided IDClasse on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (IDClasse) {
        const response = await getSR(IDClasse);
        const nomSRs = response.map((item) => item.NomSR);
        const codeSRs = response.map((item) => item.codeSR);
        setNomsSR(nomSRs);
        setCodeSRs(codeSRs);

        const initialInvestissements = await getALL(IDClasse, codeSRs);

        // Update the data state with the fetched initial values
        setData(initialInvestissements);
      }
    };
    fetchData();
  }, [IDClasse]);

  // Function to send data to backend
  const saisir = async (
    AnneeActuelle,
    AnneePrevision,
    codeSR,
    Valeur,
    CCID,
    UnityID,
    UsineID,
    OperateurID,
    IDClasse
  ) => {
    const data = {
      AnneeActuelle,
      AnneePrevision,
      codeSR,
      Valeur,
      CCID,
      UnityID,
      UsineID,
      OperateurID,
      IDClasse,
    };

    console.log("Data to be sent:", data);
    try {
      const response = await axios.post(`http://127.0.0.1:5000/saisit/`, data);
      console.log("Data submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleChange = (rowIndex, colIndex, value) => {
    const newData = [...data];
    newData[rowIndex][colIndex] = value;
    setData(newData);
  };

  const handleBlur = (rowIndex, colIndex, value) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      handleChange(rowIndex, colIndex, parsedValue.toString());
      // Replace with actual values or retrieve dynamically
      const AnneeActuelle = new Date().getFullYear();
      const AnneePrevision = years[colIndex];
      console.log("cooocoo", colIndex, years)
      saisir(
        AnneeActuelle,
        AnneePrevision,
        codeSRs[rowIndex],
        parsedValue.toString(),
        CCID,
        UnityID,
        1,
        OperateurID,
        IDClasse
      );
    }
  };

  const handleKeyPress = (event, rowIndex, colIndex, value) => {
    if (event.key === 'Enter') {
      handleBlur(rowIndex, colIndex, value);
    }
  };

  useEffect(() => {
    localStorage.setItem("tableData", JSON.stringify(data));
  }, [data]);

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Année </TableCell>
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
                    <input
                      type="text"
                      value={value}
                      onChange={(e) =>
                        handleChange(rowIndex, colIndex, e.target.value)
                      }
                      onBlur={(e) =>
                        handleBlur(rowIndex, colIndex, e.target.value)
                      }
                      onKeyPress={(e) =>
                        handleKeyPress(e, rowIndex, colIndex, e.target.value)
                      }
                      style={{ width: "60px", textAlign: "center" }}
                    />
                  </TableCell>
                ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Tableau;