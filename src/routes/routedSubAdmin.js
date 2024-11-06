import { Router } from "express";
import { GetSubAdmin, GetSubAdministrador } from "../controller/SubAdminController.js";

const SubRoutes=Router();

SubRoutes.get('/GetSubAdmin/:id',GetSubAdmin);
SubRoutes.get('/GetSubAdministrador/:id',GetSubAdministrador);

export default SubRoutes;