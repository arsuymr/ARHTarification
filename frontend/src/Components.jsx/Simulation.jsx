import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
  Stack,
  Alert,
  AlertTitle,
} from "@mui/material";
import ConfirmDialog from "./ConfirmDialog";

export default function SimulationPage({ SelectedOperator }) {
  const [paramNames, setParamNames] = useState([]);
  const [paramValues, setParamValues] = useState([]);
  const [selectedParam, setSelectedParam] = useState("");
  const [paramValue, setParamValue] = useState("");
  const [tarifS, setTarifS] = useState(0);
  const [tarifL, setTarifL] = useState(0);
  const [resultData, setResultData] = useState({});
  const [ErrorMessage, setErrorMessage] = useState(false);


  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (SelectedOperator) {
      axios
        .get("http://127.0.0.1:5000/resultat/get_param", {
          params: { OperateurID: SelectedOperator },
        })
        .then((response) => {
          setParamNames(response.data.map((param) => param));
          setParamValues(response.data.map((param) => param.valeur));
        })
        .catch((error) => console.error("Error fetching parameters:", error));
    }
  }, [SelectedOperator]);

  const fetchData = async () => {
    try {
      console.log("fetch data")
      if (SelectedOperator) {
        const date = new Date().getFullYear();
        const response = await axios.get(
          "http://127.0.0.1:5000/resultat/Simulation",
          {
            params: {
              NomParametre: selectedParam,
              ValeurParam: paramValue,
              AnneeActuelle: date,
              OperateurID: SelectedOperator,
            },
          }
        );
        setTarifS(response.data.tarif_S); // Adjust based on response structure
        setTarifL(response.data.tarif_L);
        setResultData(response.data.Resultat); // Adjust based on response structure
      }
    } catch (error) {
      setErrorMessage(true)
      console.error("Error updating parameters and fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [SelectedOperator]);

  const handleParamSubmit = () => {
    const anneeActuelle = new Date().getFullYear();

    // Iterate over each unity in the resultData object
    Object.keys(resultData).forEach((nomUnity) => {
      axios
        .post("http://127.0.0.1:5000/resultat/ValiderSimulation", {
          AnneeActuelle: anneeActuelle,
          NomUnity: nomUnity,
          OperateurID: SelectedOperator,
          tarif_L: tarifL,
          tarif_S: tarifS,
          creu_results: resultData[nomUnity].map((row) => ({
            CREU_parTonne: row.CREU_parTonne,
            CREU_parsm3: row.CREU_parsm3,
            Type: row.Type,
            UnityID: null, // This will be handled in the backend
          })),
        })
        .then((response) => {
          console.log(`Simulation validated for ${nomUnity}`, response.data);
        })
        .catch((error) =>
          console.error(`Error validating simulation for ${nomUnity}:`, error)
        );
    });
    setOpen(false);
  };
  console.log(SelectedOperator)
  return (
    <div className="space-y-8">
      <div className="flex justify-start space-x-24 ">
        <div className="relative rounded-2xl shadow-2xl border-[#D5E7F2] border-2 w-4/6">
          <h2 variant="h4" className="absolute -top-4 bg-white ml-4 pl-2 pr-10 text-lg text-[#11263C] ">
            Simulation de l’annee actuelle
          </h2>
          <div className="px-24 pt-7 pb-4 ">
            <Box sx={{ padding: 2, width: "100%" }} className="space-y-2">
              <div className="flex justify-between text-[#AEAEAE] mb-3 mr-4 ">
                <Grid item xs={12} md={6}>
                  <p gutterBottom>Parametre</p>
                </Grid>
                <Grid item xs={12} md={6}>
                  <p >Unitee de mesure</p>
                </Grid>
                <Grid item xs={12} md={6}>
                  <p>Amount</p>
                </Grid>
              </div>
              {paramNames.map((paramName, index) => (
                <div className="flex justify-between" key={index}>
                  <Grid className="text-[#404040] text-lg">
                    <Typography gutterBottom>{paramName.NomParam}</Typography>
                  </Grid>

                  <Grid>
                    <input
                      className="border-b-0 font-bold w-20"
                      type="number"
                      step="0.1"
                      min="0"
                      value={paramValues[index] || ""}
                      onChange={(e) => {
                        const newValues = [...paramValues];
                        newValues[index] = e.target.value;
                        setParamValues(newValues);
                        setParamValue(e.target.value);
                        setSelectedParam(paramName.codeParam);
                      }}
                    />
                  </Grid>
                </div>
              ))}
            </Box>
            {ErrorMessage && (
              <Stack sx={{ width: '100%', padding: '16px' }} spacing={2}>
                <Alert severity="info">
                  <AlertTitle>Alerte</AlertTitle>
                  Aucune donnée disponible pour les filtres sélectionnés.
                </Alert>
              </Stack>)}
            <div className="flex justify-end ">
              <button onClick={fetchData} className="text-[#11263C] bg-[#CBF2FF] hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-14 py-2 text-center">
                Simuler
              </button>
            </div>

          </div>
        </div>
        <Grid item xs={12} md={4} className="relative py-10 w-1/5 bg-white grid place-items-center rounded-2xl shadow-2xl border-[#D5E7F2] border-2">
          <Box className="h-32 w-60 mx-5 p-3  border-2 shadow-lg rounded-xl border-[#E2E8F0] ">
            <h2 className="font-medium">Tarif de Liquifaction</h2>
            <p className="text-4xl font-bold mb-2">
              {tarifL}
            </p>
            <p>
              [DA/1000 Tonne]
            </p>
          </Box>
          <Box className="h-32 w-60 mx-5 p-3  border-2 shadow-lg rounded-xl border-[#E2E8F0]">
            <h2 className="font-medium">Tarif de Separation</h2>
            < p className="text-4xl font-bold mb-2">
              {tarifS}
            </p>
            <p>
              [DA/1000 Sm3]
            </p>
          </Box>
          <button className="absolute -bottom-4 text-[#11263C] bg-[#CBF2FF] hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-sm px-14 py-2 text-center"
            onClick={handleOpen}>
            Enregistrer
          </button>
        </Grid>

      </div>
      <Grid
        item
        xs={12}
        className="flex justify-center"
      >



      </Grid>

      <Grid className=" relative  rounded-xl shadow-2xl border-[#D5E7F2] border-2 bg-white ">
        <h2 className="absolute -top-4  bg-white ml-4 pl-2 pr-10 text-lg text-[#11263C]">Table des Resultat Des CREU</h2>
        <TableContainer component={Paper} className="border-0 border-white px-20 pt-3 "  >
          <Table>
            <TableHead >
              <TableRow >
                <TableCell style={{ color: '#8C8C8C' }}>UnityID</TableCell>
                <TableCell style={{ color: '#8C8C8C' }}>CREU per Tonne</TableCell>
                <TableCell style={{ color: '#8C8C8C' }}>CREU per sm3</TableCell>
                <TableCell style={{ color: '#8C8C8C' }}>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(resultData).map((unityID) =>
                resultData[unityID].map((row, index) => (
                  <TableRow key={`${unityID}-${index}`}>
                    {index === 0 && (
                      <TableCell style={{ fontWeight: 'extrabold', fontSize: '17px' }} rowSpan={resultData[unityID].length}>
                        {unityID}
                      </TableCell>
                    )}
                    <TableCell>{row.CREU_parTonne}</TableCell>
                    <TableCell>{row.CREU_parsm3}</TableCell>
                    <TableCell>{row.Type}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Grid>
      <ConfirmDialog
        open={open}
        onClose={handleClose}
        onConfirm={handleParamSubmit}
        title="Confirmation de Validation"
        description="Si vous validez maintenant, vous ne pourrez plus simuler les données ultérieurement. Veuillez vous assurer que toutes les informations saisies sont correctes."
      />
    </div >
  );
}
