import { Router } from "express";
import { deleteUsuario, editUsuarioId, getUsuario, loginUsuario, postRol, crearUsuario, getUsuariosId, getUsuarioById, getAfiliadosPorUsuarioId, getUsuarioDatosId, FotoPerfil, upload, GetAfiliadorAfiliadores, verificarToken, } from "../controller/UserController.js";

const router = Router();

// Crear un nuevo usuario
router.post('/CreateUsuario', crearUsuario);

// Obtener lista de usuarios
router.get('/list',verificarToken, getUsuario);

// Obtener usuario por ID
router.get('/user',verificarToken, getUsuariosId);

router.get('/user/:id',verificarToken, getUsuarioDatosId);

// Editar usuario por ID
router.put('/user/edit/:id', editUsuarioId);

// Eliminar usuario por ID
router.delete('/user/delete/:id', deleteUsuario);

// Ruta para login
router.post('/login', loginUsuario);

router.get('/usuarios/:id',verificarToken, getUsuarioById)

router.post('/roles', postRol);;

router.put('/CambioRol/:id', getAfiliadosPorUsuarioId);

router.post('/Usuario/:id/uploadProfileImage', upload.single('image'), FotoPerfil);

router.get('/afiliadores-afiliados',verificarToken, GetAfiliadorAfiliadores);

export default router;
