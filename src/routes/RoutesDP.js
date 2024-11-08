import { Router } from "express";
import {deletePromocion, editPromocion, getPromociones, getPromocionesId, getTopPromociones, Image, postPromocion, RolUsuario, Rutas, UsuariosRol} from "../controller/DatosPControler.js";
import { upload, verificarToken } from "../controller/UserController.js";

const routerDP = Router();

// Obtener datos personales por ID
routerDP.get('/getPromociones/:id',verificarToken, getPromocionesId);

// Obtener datos personales por ID
routerDP.get('/getPromociones',verificarToken, getPromociones);

routerDP.get('/getPromocionesTop',verificarToken, getTopPromociones);

// Ruta para agregar datos personales y asociarlos a un usuario por su Idusuario
routerDP.post('/CreatePromocion',verificarToken, postPromocion);

// Actualizar datos personales por ID
routerDP.put('/editPromocion/:id',verificarToken, editPromocion);

// Eliminar datos personales por ID
routerDP.delete('/deletePromocion/:id',verificarToken, deletePromocion);

// Poner logo 
routerDP.post('/Promociones/:id/uploadProfileImage',verificarToken, upload.single('imagen'), Image);

routerDP.get('/Rutas/:id',verificarToken,Rutas)

routerDP.get('/UsersRol/:id',verificarToken,UsuariosRol)

routerDP.get('/RolUsuario/:id',verificarToken,RolUsuario)

export default routerDP;
