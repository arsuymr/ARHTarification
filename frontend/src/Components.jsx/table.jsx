import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// Define the years from 2024 to 2042
const years = Array.from({ length: 19 }, (_, i) => 2024 + i);

const data = {
  GNL: Array(19).fill(8),
  Propane: Array(19).fill(8),
  Butane: [
    98, 86, 98, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99, 99,
  ],
  Gasoline: [
    29, 26, 29, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
  ],
};

export default function ProductionTable() {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Production (1000 tonnes)</TableCell>
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
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
