import { Router } from "express";
import { deleteUsuario, editUsuarioId, getUsuario, getUsuarioId, postUsuario, loginUsuario, getUsuarioDetalles } from "../controller/UserController.js";

const router = Router();

// Crear un nuevo usuario
router.post('/createUser', postUsuario);

// Obtener lista de usuarios
router.get('/list', getUsuario);

// Obtener usuario por ID
router.get('/user/:id', getUsuarioId);

// Editar usuario por ID
router.put('/user/edit/:id', editUsuarioId);

// Eliminar usuario por ID
router.delete('/user/delete/:id', deleteUsuario);

// Ruta para login
router.post('/login', loginUsuario);

// Ruta para obtener todos los detalles del usuario
router.get('/user/details/:id', getUsuarioDetalles); // Nueva ruta para obtener detalles de usuario

export default router;
