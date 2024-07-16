import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import axios from "axios";

// Define the years from 2024 to 2042
const years = Array.from({ length: 19 }, (_, i) => 2024 + i);

const initialData = {
  Investissements: Array(19).fill("0.0"), // Initial values as strings
};

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
    const response = await axios.post(`http://127.0.0.1:5000/saisit/`, {
      AnneeActuelle,
      AnneePrevision,
      codeSR,
      Valeur,
      CCID,
      UnityID,
      UsineID,
      OperateurID,
      IDClasse,
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error submitting data:", error);
  }
};

export default function TableInv() {
  const [data, setData] = useState(initialData);

  const handleChange = (category, index, value) => {
    const newData = {
      ...data,
      [category]: data[category].map((val, idx) =>
        idx === index ? value : val
      ),
    };
    setData(newData);
  };

  const handleBlur = (category, index, value) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      handleChange(category, index, parsedValue.toString());
      const AnneeActuelle = new Date().getFullYear();
      const AnneePrevision = years[index];
      const CCID = "1"; // Replace with the actual CCID value
      const UnityID = "1"; // Replace with the actual UnityID( value
      const UsineID = "1"; // Replace with the actual UsineID) value
      const OperateurID = "1"; // Replace with the actual OperateurID value
      const IDClasse = 1; // Replace with the actual IDClasse value
      const codeSR = "1"; // Replace with the actual IDClasse value
      console.log(
        AnneeActuelle,
        AnneePrevision,
        codeSR,
        parsedValue.toString(),
        CCID,
        UnityID,
        UsineID,
        OperateurID,
        IDClasse
      );
      saisir(
        AnneeActuelle,
        AnneePrevision,
        codeSR,
        parsedValue.toString(),
        CCID,
        UnityID,
        UsineID,
        OperateurID,
        IDClasse
      );
    }
  };

  useEffect(() => {
    console.log("Saving data:", data);
    localStorage.setItem("tableData", JSON.stringify(data));
  }, [data]);

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Investissements (million de DA)</TableCell>
            {years.map((year) => (
              <TableCell key={year} align="center">
                {year}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(data).map(([category, values]) => (
            <TableRow key={category}>
              <TableCell component="th" scope="row">
                {category}
              </TableCell>
              {values.map((value, index) => (
                <TableCell key={index} align="center">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) =>
                      handleChange(category, index, e.target.value)
                    }
                    onBlur={(e) => handleBlur(category, index, e.target.value)}
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
}
