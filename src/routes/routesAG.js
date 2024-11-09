import { Router } from "express";
import { deleteClinica, editClinica, getClinica, GetIsoTipo, ImagoTipo, IsoTipo, postClinica } from "../controller/AgController.js";
import { upload, verificarToken } from "../controller/UserController.js";

const routerAG = Router();

routerAG.get('/listaClinicas',verificarToken,getClinica);

routerAG.post('/CreateClinica', postClinica)

routerAG.put('/editClinica/:id', editClinica)

routerAG.delete('/deleteclinica/:id', deleteClinica)

routerAG.post('/Clinica/:id/ImagoTipo', upload.single('ImagoTipo'), ImagoTipo);

routerAG.post('/Clinica/:id/IsoTipo', upload.single('IsoTipo'), IsoTipo);

routerAG.get('/clinicas/isotipos',verificarToken, GetIsoTipo)

export default routerAG;    