import { Router } from "express";
import { getLibros } from "../controller/library-controller.js";
const router = Router()

//Obtener todos los libros existentes
router.get("/libros", getLibros)


export { router }