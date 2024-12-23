import { Router } from "express";
import { crearLocal, DeleteLocal, editarLocal, GetLocales, LocalesClinica, Logistica } from "../controller/LocalesController.js";
import { verificarToken } from "../controller/UserController.js";

const RoutesLcl = Router();

RoutesLcl.post('/CreateLocal/',verificarToken,crearLocal);
RoutesLcl.put('/EditLocal/:id',verificarToken,editarLocal);
RoutesLcl.get('/GetLocal',verificarToken,GetLocales);
RoutesLcl.get('/locales/clinica/:clinica_id',verificarToken, LocalesClinica);
RoutesLcl.delete('/Deletelocales/:id',verificarToken, DeleteLocal);
RoutesLcl.get('/Logistica',verificarToken,Logistica)


export default RoutesLcl;