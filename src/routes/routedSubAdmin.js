import { Router } from "express";
import { GetPaginaHome, GetSubAdmin, GetSubAdministrador } from "../controller/SubAdminController.js";
import { verificarToken } from "../controller/UserController.js";

const SubRoutes=Router();

SubRoutes.get('/GetSubAdmin/:id',verificarToken,GetSubAdmin);
SubRoutes.get('/GetSubAdministrador/:id',verificarToken,GetSubAdministrador);
SubRoutes.get('/GetPagHome',GetPaginaHome)

export default SubRoutes;