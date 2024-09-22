import { Router } from "express";
import { deleteUsuario, editUsuarioId, getUsuario, getUsuarioId, postUsuario } from "../controller/UserController.js";

const router = Router();

router.post('/add', postUsuario)
router.get('/list',getUsuario)
router.get('/edit/:id', getUsuarioId)
router.put('/edit/:id', editUsuarioId);
router.delete('/delete/:id', deleteUsuario)


export default router;