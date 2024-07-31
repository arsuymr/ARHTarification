import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Input,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
} from "@mui/material";
import TabDashboard from "./TabDashboard";
import ConfirmDialog from "./ConfirmDialog";
import SideBarARH from "./SideBarARH";

export default function SimulationPage({ role }) {
  const [paramNames, setParamNames] = useState([]);
  const [paramValues, setParamValues] = useState([]);
  const [selectedParam, setSelectedParam] = useState("");
  const [selectedOperator, setSelectedOperator] = useState("");
  const [operatorList, setOperatorList] = useState([]);
  const [paramValue, setParamValue] = useState("");
  const [tarifS, setTarifS] = useState(0);
  const [tarifL, setTarifL] = useState(0);
  const [resultData, setResultData] = useState({});

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/operator/Get_all_operateur")
      .then((response) => setOperatorList(response.data))
      .catch((error) => console.error("Error fetching operators:", error));
  }, []);

  useEffect(() => {
    if (selectedOperator) {
      axios
        .get("http://127.0.0.1:5000/resultat/get_param", {
          params: { OperateurID: selectedOperator },
        })
        .then((response) => {
          setParamNames(response.data.map((param) => param));
          setParamValues(response.data.map((param) => param.valeur));
        })
        .catch((error) => console.error("Error fetching parameters:", error));
    }
  }, [selectedOperator]);

  const fetchData = async () => {
    try {
      console.log(selectedParam, paramValue, selectedOperator);
      if (selectedOperator) {
        const date = new Date().getFullYear();
        const response = await axios.get(
          "http://127.0.0.1:5000/resultat/Simulation",
          {
            params: {
              NomParametre: selectedParam,
              ValeurParam: paramValue,
              AnneeActuelle: date,
              OperateurID: selectedOperator,
            },
          }
        );
        console.log(response.data);
        setTarifS(response.data.tarif_S); // Adjust based on response structure
        setTarifL(response.data.tarif_L);
        setResultData(response.data.Resultat); // Adjust based on response structure
      }
    } catch (error) {
      console.error("Error updating parameters and fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [selectedOperator]);

  const handleParamSubmit = () => {
    const anneeActuelle = new Date().getFullYear();

    // Iterate over each unity in the resultData object
    Object.keys(resultData).forEach((nomUnity) => {
      axios
        .post("http://127.0.0.1:5000/resultat/ValiderSimulation", {
          AnneeActuelle: anneeActuelle,
          NomUnity: nomUnity,
          OperateurID: selectedOperator,
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

  return (
    <div className="flex">
      <SideBarARH Role={role} />
      <Box sx={{ padding: 4, paddingTop: 2 }}>
        <TabDashboard role={role} />
        <h4 variant="h4" className="text-xl mt-4  ">
          Simulation De L'annee {new Date().getFullYear()} :
        </h4>
        <Grid container spacing={4} className="flex justify-center">
          <Grid item xs={12} md={8}>
            <Box sx={{ padding: 2, width: "100%" }} className="">
              <FormControl fullWidth>
                <InputLabel id="operator-select-label">
                  Select Operator
                </InputLabel>
                <Select
                  className="my-4 rounded-md h-10 border border-blue-300"
                  labelId="operator-select-label"
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                >
                  {operatorList.map((operator) => (
                    <MenuItem
                      key={operator.OperateurID}
                      value={operator.OperateurID}
                    >
                      {operator.Nom_operateur}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {paramNames.map((paramName, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={6}>
                      <Typography gutterBottom>{paramName.NomParam}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Input
                        className="border-b border-blue-300"
                        type="number"
                        inputProps={{ min: "0", step: "0.1" }}
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
                  </Grid>
                </Box>
              ))}
            </Box>
            <Button variant="contained" color="primary" onClick={fetchData}>
              Simuler
            </Button>
          </Grid>
          <Grid item xs={12} md={4} className="grid place-items-center">
            <Box className="h-fit w-60 p-2 mb-3 mt-10 border rounded-lg border-blue-300 ">
              <Typography variant="h6">Tarif de Liquifaction</Typography>
              <Typography component="p" variant="h4">
                {tarifL}
              </Typography>
              <Typography color="text.secondary" sx={{ marginTop: 1 }}>
                [DA/1000 Tonne]
              </Typography>
            </Box>
            <Box className="h-fit w-60 p-2 border rounded-lg  border-blue-300 ">
              <Typography variant="h6">Tarif de Separation</Typography>
              <Typography component="p" variant="h4">
                {tarifS}
              </Typography>
              <Typography color="text.secondary" sx={{ marginTop: 1 }}>
                [DA/1000 Sm3]
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Table des Resultat Des CREU</Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>UnityID</TableCell>
                    <TableCell>CREU per Tonne</TableCell>
                    <TableCell>CREU per sm3</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(resultData).map((unityID) =>
                    resultData[unityID].map((row, index) => (
                      <TableRow key={`${unityID}-${index}`}>
                        {index === 0 && (
                          <TableCell rowSpan={resultData[unityID].length}>
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
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}
          >
            <Button variant="contained" color="primary" onClick={handleOpen}>
              Valider Simulation
            </Button>
          </Grid>
        </Grid>
      </Box>
      <ConfirmDialog
        open={open}
        onClose={handleClose}
        onConfirm={handleParamSubmit}
        title="Confirmation de Validation"
        description="Si vous validez maintenant, vous ne pourrez plus simuler les données ultérieurement. Veuillez vous assurer que toutes les informations saisies sont correctes."
      />
    </div>
  );
}
