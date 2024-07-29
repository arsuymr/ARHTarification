import React, { useState, useEffect } from "react";
import axios from "axios";
import Tableau from "../Components.jsx/tableau";
import { useParams } from "react-router";
import SideBarOp from "./SideBarOp";
import Tabs from "./tabs";
import { Button, TextField } from "@mui/material";
import ConfirmDialog from "./ConfirmDialog";

export default function TableauComplet() {

  const { UnityID, OperateurID } = useParams();
  const [classes, setClasses] = useState([]);
  const [controleCout, setControleCout] = useState(null);
  const [newControl, setNewControl] = useState({
    AnneeActuelle: "",
    Prevision: "",
  });

  const [open, setOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({ title: '', message: '', onConfirm: () => { } });

  const handleOpen1 = () => {
    setDialogInfo({
      title: 'Creation Controle de Cout pour une nouvelle année',
      message: "Veuillez vérifier attentivement vos entrées avant de continuer, Vos saisies seront archivées et ne pourront plus être modifiées.",
      onConfirm: () => { createControleCout(); setOpen(false) }
    })
    setOpen(true);
  };

  const handleOpen2 = () => {
    setDialogInfo({
      title: 'Validation de Saisits',
      message: "En confirmant, ces informations seront envoyées à l'administrateur d'ARH. Veuillez vérifier attentivement vos saisies avant de valider.",
      onConfirm: () => { validateControleCout(); setOpen(false); }
    })
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
          <div className="flex justify-center m-7">
            <h3 className="w-full font-bold ">Créer un nouveau Controle de Coût</h3>
            <TextField
              label="Année du Nouveau controle cout"
              value={newControl.AnneeActuelle}
              onChange={(e) => setNewControl({ ...newControl, AnneeActuelle: e.target.value })}
              className="w-full "
            />
            <TextField
              label="Nombre d'années de Previsions"
              value={newControl.Prevision}
              onChange={(e) => setNewControl({ ...newControl, Prevision: e.target.value })}
              fullWidth
              type="number"
              className=""
            />
            <div className="flex p-4 justify-items-center">
              <button onClick={handleOpen1} className="rounded bg-indigo-600 px-4 py-2  font-medium text-white hover:bg-indigo-700 w-24" >
                Créer
              </button>
            </div>


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
              <Button onClick={handleOpen2} variant="contained" className="bg-indigo-600" >
                Valider le Controle de Coût
              </Button>
            )}
          </div>
        )}
      </div>
      <ConfirmDialog
        open={open}
        onClose={handleClose}
        onConfirm={dialogInfo.onConfirm}
        title={dialogInfo.title}
        description={dialogInfo.message}
      />
    </div>
  );
};
