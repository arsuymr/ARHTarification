import React, { useState, useEffect } from "react";
import axios from "axios";
import Tableau from "../Components.jsx/tableau";
import { useParams } from "react-router";
import SideBarOp from "./SideBarOp";
import Tabs from "./tabs";
import { Button, TextField } from "@mui/material";
import ConfirmDialog from "./ConfirmDialog";

export default function TableauComplet({ role }) {

  const { UnityID, OperateurID } = useParams();
  const [classes, setClasses] = useState([]);
  const [controleCout, setControleCout] = useState(null);
  const [newControl, setNewControl] = useState({
    AnneeActuelle: "",
    Prevision: "",
  });

  const [open, setOpen] = useState(false);
  const [dialogInfo, setDialogInfo] = useState({ title: '', message: '', onConfirm: () => { } });
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const [allInputsFilledState, setAllInputsFilledState] = useState({});

  const handleAllInputsFilledChange = (idClasse, isAllFilled) => {
    setAllInputsFilledState((prevState) => ({
      ...prevState,
      [idClasse]: isAllFilled,
    }));

    setIsButtonDisabled(!Object.values(allInputsFilledState).every(Boolean));
  };


  const handleOpen1 = () => {
    setDialogInfo({
      title: 'Creation Controle de Cout pour une nouvelle année',
      message: "Veuillez vérifier attentivement vos entrées avant de continuer, Vos saisies seront archivées et ne pourront plus être modifiées.",
      onConfirm: () => { createControleCout(); setOpen(false) }
    })
    setOpen(true);
  };

  const handleOpen2 = () => {
    if (isButtonDisabled) {
      setDialogInfo({
        title: 'ATTENTION!!!',
        message: "Vous n'avez pas fini votre saisit vous devez entrer tout donnees",
        onConfirm: () => { setOpen(false); }
      })
    } else {
      setDialogInfo({
        title: 'Etes Vous sur de valider',
        message: "En confirmant, ces informations seront envoyées à l'administrateur d'ARH. Veuillez vérifier attentivement vos saisies avant de valider.",
        onConfirm: () => { validateControleCout(); setOpen(false); }
      })
    };
    setOpen(true)
  }


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
  }, []);

  return (
    <div className="flex">
      <SideBarOp Role={role} />
      <div className="flex flex-col w-full mt-15 ml-[340px]">
        <Tabs role={role} />
        {!controleCout || controleCout.valide ? (
          <div className="flex justify-center m-7 justify-items-center">
            <h3 className="w-fit font-bold max-xl:text-2xl flex flex-col justify-center mr-4">Créer un nouveau Controle de Coût</h3>
            <TextField
              label="Année du Nouveau controle cout"
              value={newControl.AnneeActuelle}
              onChange={(e) => setNewControl({ ...newControl, AnneeActuelle: e.target.value })}
              className="w-1/4  justify-center"
            />
            <TextField
              label="Nombre d'années de Previsions"
              value={newControl.Prevision}
              onChange={(e) => setNewControl({ ...newControl, Prevision: e.target.value })}
              type="number"
              className="w-1/4 justify-center"
            />
            <div className="flex m-4  justify-items-center">
              <button onClick={handleOpen1} className="w-36 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" >
                Créer
              </button>
            </div>
          </div>
        ) : null}
        <div className="mb-10">
          {classes.map((classe) => (
            <div key={classe.ID}>
              <div className="font-semibold text-xl my-7">
                {classe.NomClasse}
              </div>
              {classe && classe.ID && controleCout && controleCout.CCID && (
                <Tableau IDClasse={classe.ID} CCID={controleCout.CCID} onAllInputsFilledChange={handleAllInputsFilledChange} />
              )}
            </div>
          ))}
        </div>

        {controleCout && (
          <div className="flex justify-center mb-10">
            {!controleCout.valide && (
              <button onClick={handleOpen2} className=" text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800s" >
                Valider le Controle de Coût
              </button>
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
