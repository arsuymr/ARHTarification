import React, { useState, useEffect } from "react";
import axios from "axios";
import Tabs from "./tabs";
import { useParams } from "react-router";
import SideBarOp from "./SideBarOp";

export default function ParamsTable({ role }) {
  const [params, setParams] = useState([]);
  const [paramNames, setParamNames] = useState([]);
  const [paramValues, setParamValues] = useState([]);
  const [selectedParam, setSelectedParam] = useState('');
  const [selectedParamPo, setSelectedParamPo] = useState('');
  const { OperateurID, UnityID } = useParams();
  useEffect(() => {
    const getEcrits = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/param", {
          params: {
            UnityID: UnityID,
          },
        });
        setParams(response.data); // Assuming the API response is an array of objects
      } catch (error) {
        console.error("Error fetching écrits:", error);
      }
    };
    getEcrits();
  }, []); // Empty dependency array ensures useEffect runs once on component mount

  useEffect(() => {
    if (OperateurID) {
      axios.get('http://127.0.0.1:5000/resultat/get_param', {
        params: { OperateurID: OperateurID }
      })
        .then(response => {
          const allParams = response.data;

          // Filtrer les paramètres souhaités
          const filteredParams = allParams.filter(param =>
            param.codeParam === 'CTGNL' || param.codeParam === 'CCM3'
          );
          console.log("paaaaa", filteredParams)


          setParamNames(filteredParams);
          setParamValues(filteredParams.map(param => param.valeur));
        })
        .catch(error => console.error('Error fetching parameters:', error));
    }
  }, [OperateurID]);


  const handleInputChange = (index, event) => {
    const newParams = [...paramNames];
    newParams[index].valeur = event.target.value;
    setParamNames(newParams)
    setSelectedParam(newParams[index]);

  };

  const SetParametre = async () => {
    try {
      console.log(selectedParam)
      await axios.post("http://127.0.0.1:5000/param/set_param", {
        "ValeurParam": selectedParam.valeur,
        "codeParam": selectedParam.codeParam
      });
    } catch (error) {
      console.error("Error posting data", error);
    }
  }

  const handlechangeParamPo = async (event, index) => {
    const newParams = [...params];
    newParams[index].valeur = event.target.value;
    setParams(newParams)
    setSelectedParamPo(newParams[index]);

  }

  const SetParametreOp = async () => {
    try {
      console.log("helloooo", selectedParamPo)
      await axios.post("http://127.0.0.1:5000/param/set_ParamOp", {
        "ValeurParam": selectedParamPo.valeur,
        "codeParam": selectedParamPo.codePO,
        "UnityID": UnityID
      });
    } catch (error) {
      console.error("Error posting data", error);
    }
  }

  return (
    <div className="flex justify-between ">
      <SideBarOp Role={role} />
      <div className="w-full h-full ml-[340px] mt-15">
        <Tabs role={role} />
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="px-4 py-2 text-left text-lg font-bold text-gray-900">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-lg font-bold text-gray-900">
                  Valeur
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-gray-200">
              {paramNames.map((param, index) => (
                <tr key={param.codeParam}>
                  <td className="px-4 py-2 text-left text-gray-900">
                    {param.NomParam}
                  </td>
                  <td className="px-4 py-2 text-left text-gray-700">
                    <input
                      type="text"
                      value={param.valeur}
                      onChange={(event) => handleInputChange(index, event)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={SetParametre}
                      className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
              {params.map((parampo, index) => (
                <tr key={parampo.codePO}>
                  <td className="px-4 py-2 text-left text-gray-900">
                    {parampo.codePO}
                  </td>
                  <td className="px-4 py-2 text-left text-gray-700">
                    <input
                      type="text"
                      value={parampo.valeur}
                      onChange={(event) => handlechangeParamPo(event, index)}
                      className="w-full px-2 py-1 border border-gray-300 rounded-md"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={SetParametreOp}
                      className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      Modifier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
