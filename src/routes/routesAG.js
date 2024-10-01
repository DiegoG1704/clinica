import { Router } from "express";
import { deleteClinica, editClinica, getClinica, postClinica } from "../controller/AgController.js";

const routerAG = Router();

routerAG.get('/listaClinicas',getClinica);

routerAG.post('/CreateClinica', postClinica)

routerAG.put('/editClinica/:id', editClinica)

routerAG.delete('/deleteclinica/:id', deleteClinica)


export default routerAG;