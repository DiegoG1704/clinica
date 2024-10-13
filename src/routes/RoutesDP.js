import { Router } from "express";
import {deletePromocion, editPromocion, getPromociones, Image, postPromocion} from "../controller/DatosPControler.js";
import { upload } from "../controller/UserController.js";

const routerDP = Router();

// Obtener datos personales por ID
routerDP.get('/getPromociones/:id', getPromociones);

// Ruta para agregar datos personales y asociarlos a un usuario por su Idusuario
routerDP.post('/CreatePromocion/:id', postPromocion);

// Actualizar datos personales por ID
routerDP.put('/editPromocion/:id', editPromocion);

// Eliminar datos personales por ID
routerDP.delete('/deletePromocion/:id', deletePromocion);

routerDP.post('/Promociones/:id/uploadProfileImage', upload.single('imagen'), Image);


export default routerDP;
