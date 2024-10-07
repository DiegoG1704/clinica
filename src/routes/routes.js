import { Router } from "express";
import { deleteUsuario, editUsuarioId, getUsuario, loginUsuario, postRol, crearUsuario, getUsuariosId, getUsuarioById, getAfiliadosPorUsuarioId, getUsuarioDatosId } from "../controller/UserController.js";

const router = Router();

// Crear un nuevo usuario
router.post('/CreateUsuario', crearUsuario);

// Obtener lista de usuarios
router.get('/list', getUsuario);

// Obtener usuario por ID
router.get('/user', getUsuariosId);

router.get('/user/:id', getUsuarioDatosId);

// Editar usuario por ID
router.put('/user/edit/:id', editUsuarioId);

// Eliminar usuario por ID
router.delete('/user/delete/:id', deleteUsuario);

// Ruta para login
router.post('/login', loginUsuario);

router.get('/usuarios/:id', getUsuarioById)

router.post('/roles', postRol);;

router.get('/usuarios/:id/afiliados', getAfiliadosPorUsuarioId);


export default router;
