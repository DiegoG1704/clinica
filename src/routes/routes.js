import { Router } from "express";
import { deleteUsuario, editUsuarioId, getUsuario, getUsuarioId, postUsuario } from "../controller/UserController.js";

const router = Router();

// Crear un nuevo usuario
router.post('/add', postUsuario);

// Obtener lista de usuarios
router.get('/list', getUsuario);

// Obtener usuario por ID
router.get('/user/:id', getUsuarioId); // Cambié la ruta para mayor claridad

// Editar usuario por ID
router.put('/user/edit/:id', editUsuarioId); // Consistente en la nomenclatura

// Eliminar usuario por ID
router.delete('/user/delete/:id', deleteUsuario); // Consistente en la nomenclatura

export default router;
