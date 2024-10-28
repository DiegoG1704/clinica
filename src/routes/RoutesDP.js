import { Router } from "express";
import {deletePromocion, editPromocion, getPromociones, getPromocionesId, getTopPromociones, Image, postPromocion, Rutas, UsuariosRol} from "../controller/DatosPControler.js";
import { upload } from "../controller/UserController.js";

const routerDP = Router();

// Obtener datos personales por ID
routerDP.get('/getPromociones/:id', getPromocionesId);

// Obtener datos personales por ID
routerDP.get('/getPromociones', getPromociones);

routerDP.get('/getPromocionesTop', getTopPromociones);

// Ruta para agregar datos personales y asociarlos a un usuario por su Idusuario
routerDP.post('/CreatePromocion/:id', postPromocion);

// Actualizar datos personales por ID
routerDP.put('/editPromocion/:id', editPromocion);

// Eliminar datos personales por ID
routerDP.delete('/deletePromocion/:id', deletePromocion);

// Poner logo 
routerDP.post('/Promociones/:id/uploadProfileImage', upload.single('imagen'), Image);

routerDP.get('/Rutas/:id',Rutas)

routerDP.get('/UsersRol/:id',UsuariosRol)

export default routerDP;
