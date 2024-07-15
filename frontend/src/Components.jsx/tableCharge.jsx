import React, { useState } from "react";

const InitialData = {
  Consommable: Array(19).fill(8),
  "Charges du personnel": Array(19).fill(8),
  "Maintenance et pièces de stockage": Array(19).fill(8),
  "Dépendences d énergie": Array(19).fill(8),
  Assurances: Array(19).fill(8),
};

const TableCharge = () => {
  const [data, setData] = useState(InitialData);

  const handleChange = (category, index, value) => {
    const newData = {
      ...data,
      [category]: [
        ...data[category].slice(0, index),
        value,
        ...data[category].slice(index + 1),
      ],
    };
    setData(newData);
  };

  return <div className="flex justify-center items-center"></div>;
};
export default TableCharge;
