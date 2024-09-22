import { Router } from "express";
import { AfiliadorEdit, deleteDatos, getDatos, getDatosId, postDatos, putDatos } from "../controller/DatosPControler.js";

const routerDP = Router();

routerDP.get('/getDP',getDatos)
routerDP.get('/getDP/:id',getDatosId)
routerDP.post('/postDP',postDatos)
routerDP.put('/editDP/:id', putDatos)
routerDP.delete('/deleteDP/:id',deleteDatos)
routerDP.put('/afiliadorEdit/:id', AfiliadorEdit)

export default routerDP;