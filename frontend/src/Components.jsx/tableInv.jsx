import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// Define the years from 2024 to 2042
const years = Array.from({ length: 19 }, (_, i) => 2024 + i);

const initialData = {
  Investissements: Array(19).fill("0.0"), // Initial values as strings
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

  useEffect(() => {
    // Save data whenever 'data' changes
    console.log("Saving data:", data);
    // Replace with actual save logic (e.g., API call, local storage, etc.)
    // Example of saving to local storage:
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
                    onBlur={(e) => {
                      const parsedValue = parseFloat(e.target.value);
                      if (!isNaN(parsedValue)) {
                        handleChange(category, index, parsedValue.toString());
                      }
                    }}
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
