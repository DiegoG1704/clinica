import { Router } from "express";
import { deleteClinica, editClinica, getClinica, ImagoTipo, IsoTipo, postClinica } from "../controller/AgController.js";
import { upload } from "../controller/UserController.js";

const routerAG = Router();

routerAG.get('/listaClinicas',getClinica);

routerAG.post('/CreateClinica', postClinica)

routerAG.put('/editClinica/:id', editClinica)

routerAG.delete('/deleteclinica/:id', deleteClinica)

routerAG.post('/Clinica/:id/ImagoTipo', upload.single('ImagoTipo'), ImagoTipo);

routerAG.post('/Clinica/:id/IsoTipo', upload.single('IsoTipo'), IsoTipo);

export default routerAG;