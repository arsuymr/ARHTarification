import React, { useState, useEffect } from "react";
import axios from "axios";
import Tableau from "../Components.jsx/tableau";
import { useParams } from "react-router";
import SideBarOp from "./sidebarOp";
import Tabs from "./tabs";
import { Button, TextField } from "@mui/material";

export default function TableauComplet() {

  const { UnityID, OperateurID } = useParams();
  const [classes, setClasses] = useState([]);
  const [controleCout, setControleCout] = useState(null);
  const [newControl, setNewControl] = useState({
    AnneeActuelle: "",
    Prevision: "",
  });

  useEffect(() => {
    const getClasses = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/saisit/get_classe"
        );
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };

    getClasses();
  }, []);

  // Fetch the most recent ControleCout
  const fetchRecentControleCout = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/saisit/get_recent_CC", {
        params: { UnityID: UnityID }, // Use the actual UnityID here
      });
      console.log(response.data)
      setControleCout(response.data);
    } catch (error) {
      console.error("Error fetching ControleCout:", error);
    }
  };

  // Handle creating a new ControleCout
  const createControleCout = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/saisit/create_CC", {
        AnneeActuelle: newControl.AnneeActuelle,
        UnityID: UnityID, // Use the actual UnityID here
        Prevision: parseInt(newControl.Prevision, 10),
      });
      fetchRecentControleCout(); // Refresh the controle cout data
    } catch (error) {
      console.error("Error creating ControleCout:", error);
    }
  };

  const validateControleCout = async () => {
    if (controleCout) {
      try {
        await axios.post("http://127.0.0.1:5000/saisit/valides_CC", {
          CCID: controleCout.CCID,
        });
        fetchRecentControleCout();
      } catch (error) {
        console.error("Error validating ControleCout:", error);
      }
    }
  };

  useEffect(() => {
    fetchRecentControleCout();
  }, [UnityID]);

  return (
    <div className="flex">
      <SideBarOp OperateurID={OperateurID} />
      <div className="flex flex-col">
        <Tabs />
        {!controleCout || controleCout.valide ? (
          <div>
            <h3>Créer un nouveau Controle de Coût</h3>
            <TextField
              label="Année actuelle"
              value={newControl.AnneeActuelle}
              onChange={(e) => setNewControl({ ...newControl, AnneeActuelle: e.target.value })}
              fullWidth
            />
            <TextField
              label="Nombre d'années (Prevision)"
              value={newControl.Prevision}
              onChange={(e) => setNewControl({ ...newControl, Prevision: e.target.value })}
              fullWidth
              type="number"
            />
            <Button onClick={createControleCout} variant="contained" color="primary">
              Créer Controle de Coût
            </Button>
          </div>
        ) : null}
        {classes.map((classe) => (
          <div key={classe.ID}>
            <div className="font-semibold text-xl ml-3 mt-[40px] mb-[10px]">
              {classe.NomClasse}
            </div>
            {classe && classe.ID && controleCout && controleCout.CCID && (
              <Tableau IDClasse={classe.ID} CCID={controleCout.CCID} />
            )}
          </div>
        ))}
        {controleCout && (
          <div>
            {!controleCout.valide && (
              <Button onClick={() => validateControleCout(controleCout.CCID)} variant="contained" color="primary">
                Valider le Controle de Coût
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
