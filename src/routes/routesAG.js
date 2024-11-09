import { Router } from "express";
import { crearUsuarioYClinica, deleteClinica, editClinica, getClinica, GetIsoTipo, ImagoTipo, IsoTipo, postClinica } from "../controller/AgController.js";
import { upload, verificarToken } from "../controller/UserController.js";

const routerAG = Router();

routerAG.get('/listaClinicas',verificarToken,getClinica);

routerAG.post('/CreateClinica',verificarToken, postClinica)

routerAG.put('/editClinica/:id',verificarToken, editClinica)

routerAG.delete('/deleteclinica/:id',verificarToken, deleteClinica)

routerAG.post('/Clinica/:id/ImagoTipo',verificarToken, upload.single('ImagoTipo'), ImagoTipo);

routerAG.post('/Clinica/:id/IsoTipo',verificarToken, upload.single('IsoTipo'), IsoTipo);

routerAG.get('/clinicas/isotipos',verificarToken, GetIsoTipo)

routerAG.post('/crearUsuarioYClinica', crearUsuarioYClinica)

export default routerAG;
