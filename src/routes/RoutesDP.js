import { Router } from "express";
import { AfiliadorEdit, deleteDatos, getDatos, getDatosId, postDatos, putDatos } from "../controller/DatosPControler.js";

const routerDP = Router();

// Obtener todos los datos personales
routerDP.get('/datos-personales', getDatos);

// Obtener datos personales por ID
routerDP.get('/datos-personales/:id', getDatosId);

// Crear nuevos datos personales
routerDP.post('/datos-personales', postDatos);

// Actualizar datos personales por ID
routerDP.put('/datos-personales/:id', putDatos);

// Eliminar datos personales por ID
routerDP.delete('/datos-personales/:id', deleteDatos);

// Editar el estado de afiliador por ID
routerDP.put('/datos-personales/afiliador/:id', AfiliadorEdit);

export default routerDP;
