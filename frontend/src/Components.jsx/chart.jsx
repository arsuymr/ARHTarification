import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts/LineChart";
import TabDashboard from "./TabDashboard";
import SideBarARH from "./SideBarARH";

export default function Charts({ role }) {
  const [xLabels, setXLabels] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [anneeDebut, setAnneeDebut] = useState(new Date().getFullYear());
  const [operateurNom, setOperateurNom] = useState("");
  const [operators, setOperators] = useState([]);
  const [Limit, setLimit] = useState(5);
  const [Type, setType] = useState("Tarifs");
  const [unities, setUnities] = useState([]);
  const [nomUnity, setNomUnity] = useState("");

  useEffect(() => {
    const generateYearLabels = (startYear) => {
      const labels = [];
      for (let i = 0; i < Limit; i++) {
        const year = parseInt(startYear) + i;
        labels.push(year);
      }
      return labels;
    };

    const fetchData = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/resultat/Stats",
          {
            NomUnity: nomUnity,
            AnneeDebut: anneeDebut,
            OperateurNom: operateurNom,
            Type: Type,
            Limit: Limit,
          }
        );
        const resultData = response.data;
        console.log(anneeDebut, Type, Limit, resultData);
        setXLabels(generateYearLabels(anneeDebut));
        // Assuming Tarifs_L and Tarifs_S are keys in resultData
        if (Type === "Tarifs") {
          setData1(resultData.Tarif_L?.valeurs || []);
          setData2(resultData.Tarif_S?.valeurs || []);
          console.log(data1);
        } else if (Type === "CREU") {
          setData1(resultData.CREU_parTonne_L?.valeurs || []);
          setData2(resultData.CREU_parsm3_L?.valeurs || []);
          setData3(resultData.CREU_parTonne_S?.valeurs || []);
          setData4(resultData.CREU_parsm3_S?.valeurs || []);
          console.log(resultData, data2, data3, data4);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [operateurNom, nomUnity, Limit, anneeDebut, Type]);

  useEffect(() => {
    const fetchUnities = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/operator/GetUnitiesByOperator",
          {
            OperateurNom: operateurNom,
          }
        );
        setUnities(response.data);
      } catch (error) {
        console.error("Error fetching unities:", error);
      }
    };
    if (operateurNom !== "") {
      fetchUnities();
    }
  }, [operateurNom]);

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
          setOperateurNom(operatorsData[0].Nom_operateur);
        }
      } catch (error) {
        console.error("Error fetching operators:", error);
      }
    };

    fetchOperators();
  }, []);

  const sharedTooltip = (params) => {
    return `<div classname= 'w-2 h-2 bg-black rounded-full'>
                <strong>${params[0].seriesName}</strong><br/>
                Year: ${params[0].dataIndex}<br/>
                Value: ${params[0].value}
                <br/>
                <strong>${params[1].seriesName} </strong><br/>
                Value: "${params[1].value} 'DA'"
            </div>`;
  };
  console.log(role);
  return (
    <div className="flex ">
      <SideBarARH Role={role} />
      <div className="m-2 w-screen ">
        <div className="p-4 pt-2 w-full">
          <TabDashboard role={role} />
        </div>
        <h1 className=" m-4 text-2xl font-extrabold  text-gradient"> Representation Graphique</h1>
        <div className="flex justify-start gap-20 my-10 ">
          <div className="flex flex-col gap-4  items-center  ml-10 mt-6">
            <select
              value={operateurNom}
              onChange={(e) => setOperateurNom(e.target.value)}
              className="p-1 border-b border-blue-700 m-2 w-full"
            >
              {operators.map((operator) => (
                <option key={operator.OperateurID} value={operator.Nom_operateur}>
                  {operator.Nom_operateur}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Année Début"
              value={anneeDebut}
              onChange={(e) => setAnneeDebut(e.target.value)}
              className="p-1 border-b border-blue-700  m-2 w-full"
            />
            <input
              type="number"
              placeholder="Limite"
              value={Limit}
              onChange={(e) => setLimit(e.target.value)}
              className="p-1 border-b border-blue-700  m-2 w-full"
            />
            <select
              value={Type}
              onChange={(e) => setType(e.target.value)}
              className="p-1 border-b border-blue-700  m-2 w-full"
            >
              <option value="Tarifs">Tarifs</option>
              <option value="CREU">Creu</option>
            </select>
            {Type === "CREU" && (

              <select
                value={nomUnity}
                onChange={(e) => setNomUnity(e.target.value)}
                className="p-1 border-b border-blue-700  m-2 w-full"
              >
                <option value="">Select Unity</option>
                {unities.map((unity, index) => (
                  <option key={index} value={unity.NomUnity}>
                    {unity.NomUnity}
                  </option>
                ))}
              </select>

            )}
          </div>
          <div className="flex flex-col gap-5 justify-center ">
            {Type === "Tarifs" && (
              <>
                <div className="flex">
                  <LineChart
                    width={700}
                    height={300}
                    series={[
                      {
                        data: data1,
                        yAxisKey: "leftAxisId",
                        color: "green",
                        label: "Tarifs Liquifaction  [DA/1000 Sm3]",
                      },
                    ]}
                    xAxis={[{ scaleType: "point", data: xLabels }]}
                    yAxis={[
                      {
                        id: "leftAxisId",
                        min:
                          Math.min(...data1) > 0
                            ? Math.min(...data1) - 0.1 * Math.min(...data1)
                            : 0,
                        max: Math.max(...data1) + 0.1 * Math.max(...data1),
                      },
                    ]}
                    tooltip={{
                      trigger: "axis",
                      formatter: sharedTooltip,
                      backgroundColor: "#fff",
                      borderColor: "#ddd",
                      borderWidth: 1,
                      padding: 10,
                    }}
                  />
                </div>
                <div className="flex">
                  <LineChart
                    width={700}
                    height={300}
                    series={[
                      {
                        data: data2,
                        label: "Tarif Separation  [DA/1000 Tonne]",
                        yAxisKey: "leftAxisId",
                        color: "blue",
                      },
                    ]}
                    xAxis={[{ scaleType: "point", data: xLabels }]}
                    yAxis={[
                      {
                        id: "leftAxisId",
                        min:
                          Math.min(...data2) > 0
                            ? Math.min(...data2) - 0.1 * Math.min(...data2)
                            : 0,
                        max: Math.max(...data2) + 0.1 * Math.max(...data2),
                      },
                    ]}
                    tooltip={{
                      enabled: true,
                      trigger: "axis",
                      formatter: sharedTooltip,
                      backgroundColor: "#fff",
                      borderColor: "#ddd",
                      borderWidth: 1,
                      padding: 10,
                    }}
                  />
                </div>
              </>
            )}
            {Type === "CREU" && (
              <>
                <div className="flex-1">
                  <LineChart
                    width={700}
                    height={300}
                    series={[
                      {
                        data: data1,
                        label: "Creu de Liquifaction Par Tonne",
                        yAxisKey: "leftAxisId",
                        color: "blue"
                      },
                      {
                        data: data2,
                        label: "Creu Liquifaction Par Sm3",
                        yAxisKey: "leftAxisId",
                        color: "green"
                      },
                    ]}
                    xAxis={[{ scaleType: "point", data: xLabels }]}
                    yAxis={[
                      {
                        id: "leftAxisId",
                        min:
                          Math.min(...data1) > 0
                            ? Math.min(...data1) - 0.1 * Math.min(...data1)
                            : 0,
                        max: Math.max(...data1) + 0.1 * Math.max(...data1),
                      },
                      {
                        id: "rightAxisId",
                        min:
                          Math.min(...data2) > 0
                            ? Math.min(...data2) - 0.1 * Math.min(...data2)
                            : 0,
                        max: Math.max(...data2) + 0.1 * Math.max(...data2),
                      },
                    ]}
                    tooltip={{
                      enabled: true,
                      trigger: "axis",
                      formatter: sharedTooltip,
                      backgroundColor: "#fff",
                      borderColor: "#ddd",
                      borderWidth: 1,
                      padding: 10,
                    }}
                  />
                </div>
                <div className="flex-1">
                  <LineChart
                    width={700}
                    height={300}
                    series={[
                      {
                        data: data3,
                        label: "Creu Separation Par tonne",
                        yAxisKey: "leftAxisId",
                        color: "blue"
                      },
                      {
                        data: data4,
                        label: "Creu Separation Par Sm3",
                        yAxisKey: "leftAxisId",
                        color: "green"
                      },
                    ]}
                    xAxis={[{ scaleType: "point", data: xLabels }]}
                    yAxis={[
                      {
                        id: "leftAxisId",
                        min:
                          Math.min(...data3) > 0
                            ? Math.min(...data3) - 0.1 * Math.min(...data3)
                            : 0,
                        max: Math.max(...data3) + 0.1 * Math.max(...data3),
                      },
                      {
                        id: "rightAxisId",
                        min:
                          Math.min(...data4) > 0
                            ? Math.min(...data4) - 0.1 * Math.min(...data4)
                            : 0,
                        max: Math.max(...data4) + 0.1 * Math.max(...data4),
                      },
                    ]}
                    tooltip={{
                      enabled: true,
                      trigger: "axis",
                      formatter: sharedTooltip,
                      backgroundColor: "#fff",
                      borderColor: "#ddd",
                      borderWidth: 1,
                      padding: 10,
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
