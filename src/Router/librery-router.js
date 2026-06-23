import { Router } from "express";
import { getAutores, getCategorias, getEditoriales, getLibros } from "../controller/library-controller.js";
const router = Router()

//Obtener todos los libros existentes
router.get("/libros", getLibros)
router.get("/autores", getAutores)
router.get("/categorias", getCategorias)
router.get("/editoriales", getEditoriales)


export { router }