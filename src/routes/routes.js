import { Router } from "express";
import { deleteUsuario, editUsuarioId, getUsuario, loginUsuario, getUsuarioDetalles, postRol, crearUsuario, getUsuariosId, getUsuarioById, getAfiliadosPorUsuarioId } from "../controller/UserController.js";

const router = Router();

// Crear un nuevo usuario
router.post('/CreateUsuario', crearUsuario);

// Obtener lista de usuarios
router.get('/list', getUsuario);

// Obtener usuario por ID
router.get('/user', getUsuariosId);

// Editar usuario por ID
router.put('/user/edit/:id', editUsuarioId);

// Eliminar usuario por ID
router.delete('/user/delete/:id', deleteUsuario);

// Ruta para login
router.post('/login', loginUsuario);
// Ruta para obtener todos los detalles del usuario
router.get('/user/details/:id', getUsuarioDetalles); // Nueva ruta para obtener detalles de usuario

router.get('/usuarios/:id', getUsuarioById)

router.post('/roles', postRol);;

router.get('/usuarios/:id/afiliados', getAfiliadosPorUsuarioId);


export default router;
