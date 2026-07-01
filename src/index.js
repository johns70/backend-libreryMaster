import express from "express"
import morgan from "morgan";
import cors from "cors"
import cookieParser from "cookie-parser";
//Configuracion inicial
const app = express()
//MIddlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5500', // El puerto exacto donde corre tu Frontend local
    credentials: true                // Permite el intercambio de cookies HttpOnly
}));
app.use(morgan('dev'))
app.use(router)

app.set("port", process.env.PORT || 4002)




import { connection } from "../db/database.js"
import { router } from "./Router/librery-router.js";

app.listen(app.get("port"))
console.log(`El servidor esta corriendo en el puerto ${app.get("port")}`)




