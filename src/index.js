import express from "express"
import morgan from "morgan";
import cors from "cors"
import cookieParser from "cookie-parser";
//Configuracion inicial
const app = express()
//MIddlewares
app.use(express.json())
app.use(cookieParser())
const origenesPermitidos = [
  'http://localhost:5500',
  'http://127.0.0.1:5500'
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir peticiones sin origen (como Postman o peticiones del mismo servidor)
        if (!origin) return callback(null, true);
        
        if (origenesPermitidos.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Bloqueado por CORS'));
        }
    },
    credentials: true // Crucial para tus cookies HttpOnly
}));
app.use(morgan('dev'))
app.use(router)

app.set("port", process.env.PORT || 4002)




import { connection } from "../db/database.js"
import { router } from "./Router/librery-router.js";

app.listen(app.get("port"))
console.log(`El servidor esta corriendo en el puerto ${app.get("port")}`)




