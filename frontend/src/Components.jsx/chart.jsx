import React, { useEffect, useState } from "react";
import axios from "axios";
import { LineChart } from "@mui/x-charts/LineChart";

export default function Charts({ SelectedOperator }) {
  const [xLabels, setXLabels] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [anneeDebut, setAnneeDebut] = useState(new Date().getFullYear());

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
            OperateurNom: SelectedOperator,
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
  }, [SelectedOperator, nomUnity, Limit, anneeDebut, Type]);

  useEffect(() => {
    const fetchUnities = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/operator/GetUnitiesByOperator",
          {
            OperateurNom: SelectedOperator,
          }
        );
        setUnities(response.data);
      } catch (error) {
        console.error("Error fetching unities:", error);
      }
    };
    if (SelectedOperator !== "") {
      fetchUnities();
    }
  }, [SelectedOperator]);


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

  return (

    <div className="flex flex-col space-y-5 ">
      <div className="mt-10 flex gap-4 justify-start ml-10 ">
        <input
          type="number"
          placeholder="Année Début"
          value={anneeDebut}
          onChange={(e) => setAnneeDebut(e.target.value)}
          className="border-2 border-[#ECE9F1]"
        />
        <input
          type="number"
          placeholder="Limite"
          value={Limit}
          onChange={(e) => setLimit(e.target.value)}
          className="border-2 border-[#ECE9F1]"
        />
        <select
          value={Type}
          onChange={(e) => setType(e.target.value)}
          className="border-2 border-[#ECE9F1]"
        >
          <option value="Tarifs">Tarification</option>
          <option value="CREU">Creu</option>
        </select>
        {Type === "CREU" && (

          <select
            value={nomUnity}
            onChange={(e) => setNomUnity(e.target.value)}
            className="border-2 border-[#ECE9F1]"
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
      <div className="flex justify-center m-5">
        {Type === "Tarifs" && (
          <>
            <div className="flex lg:w-1/2 lg:h-96 h-80">
              <LineChart
                series={[
                  {
                    data: data1,
                    yAxisKey: "leftAxisId",
                    color: "#497373",
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
                grid={{ vertical: true, horizontal: true }}
              />
            </div>
            <div className="flex lg:w-1/2 lg:h-96 h-80">
              <LineChart

                series={[
                  {
                    data: data2,
                    label: "Tarif Separation  [DA/1000 Tonne]",
                    yAxisKey: "leftAxisId",
                    color: "#4A96D9",
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
                grid={{ vertical: true, horizontal: true }}
              />
            </div>
          </>
        )}
        {Type === "CREU" && (
          <>
            <div className="flex-1 lg:w-1/2 lg:h-96 h-80">
              <LineChart

                series={[
                  {
                    data: data1,
                    label: "Creu de Liquifaction Par Tonne",
                    yAxisKey: "leftAxisId",
                    color: "#4A96D9"
                  },
                  {
                    data: data2,
                    label: "Creu Liquifaction Par Sm3",
                    yAxisKey: "leftAxisId",
                    color: "#497373"
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
                grid={{ vertical: true, horizontal: true }}

              />
            </div>
            <div className="flex-1 lg:w-1/2 lg:h-96 h-80">
              <LineChart

                series={[
                  {
                    data: data3,
                    label: "Creu Separation Par tonne",
                    yAxisKey: "leftAxisId",
                    color: "#4A96D9"
                  },
                  {
                    data: data4,
                    label: "Creu Separation Par Sm3",
                    yAxisKey: "leftAxisId",
                    color: "#497373"
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
                grid={{ vertical: true, horizontal: true }}

              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
