import { Router } from "express";
import { getAutores, getCategorias, getEditoriales, getLibros, login, registrar, obtenerPerfil, actualizarPerfil, Protect } from "../controller/library-controller.js";
const router = Router()

//Obtener todos los libros existentes
router.get("/libros", getLibros)
router.get("/autores", getAutores)
router.get("/categorias", getCategorias)
router.get("/editoriales", getEditoriales)
router.post("/register", registrar)
router.post("/login", login)

router.get("/obtenerPerfil", Protect, obtenerPerfil);
router.put("/actualizarPerfil", Protect, actualizarPerfil);


export { router }