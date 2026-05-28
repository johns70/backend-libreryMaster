import { Router } from "express";
import { getLibros, getLibrosFiltroAvanzado } from "../controller/library-controller.js";
const router = Router()

//Obtener todos los libros existentes
router.get("/libros", getLibros)
//obtener libros pero por select
router.get("/filter", getLibrosFiltroAvanzado)


export { router }