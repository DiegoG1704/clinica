import { Router } from "express";
import { crearLocal, DeleteLocal, editarLocal, GetLocales, LocalesClinica } from "../controller/LocalesController.js";

const RoutesLcl = Router();

RoutesLcl.post('/CreateLocal/',crearLocal);
RoutesLcl.put('/EditLocal/:id',editarLocal);
RoutesLcl.get('/GetLocal',GetLocales);
RoutesLcl.get('/locales/clinica/:clinica_id', LocalesClinica);
RoutesLcl.delete('/Deletelocales/:id', DeleteLocal);

export default RoutesLcl;