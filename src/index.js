import express from "express"
import morgan from "morgan";
import cors from "cors"

import { connection } from "../db/database.js"
import { router } from "./Router/librery-router.js";


//Configuracion inicial
const app = express()
app.set("port", 4002)
app.use(cors())


//MIddlewares
app.use(router)
app.use(morgan('dev'))


app.listen(app.get("port"))
console.log(`El servidor esta corriendo en el puerto ${app.get("port")}`)




