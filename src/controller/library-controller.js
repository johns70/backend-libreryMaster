import  jwt  from "jsonwebtoken";   
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser";
import { connection } from "../../db/database.js";
const pool = await connection();

export const getLibros = async (req, res) => {
    const { autor, editorial, categoria } = req.query;
    
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    if (isNaN(limit) || limit <= 0) {
        return res.status(400).json({ error: "el limite debe ser un numero valido" });
    }

    try {
        const parametros = [];

       let sqlQuery = `
            SELECT 
                libros.id_libro,
                libros.titulo,
                libros.precio,
                libros.url_image AS imagen,
                
                -- ¡AGREGADOS LOS IDS INDEPENDIENTES AQUÍ!
                autores.id_autor AS id_autor,
                autores.nombre AS nombre_autor,
                
                editoriales.id_editorial AS id_editorial,
                editoriales.nombre AS nombre_editorial,
                
                categorias.id_categoria AS id_categoria,
                categorias.nombre AS nombre_categorias
            FROM libros
            
            -- Unión de Autores (Con filtro inteligente si existe)
            LEFT JOIN libros_autores ON libros.id_libro = libros_autores.id_libro
                ${autor ? 'AND libros_autores.id_autor = ?' : ''}
            LEFT JOIN autores ON libros_autores.id_autor = autores.id_autor
            
            -- Unión de Categorías
            LEFT JOIN libros_categorias ON libros.id_libro = libros_categorias.id_libro
                ${categoria ? 'AND libros_categorias.id_categoria = ?' : ''}
            LEFT JOIN categorias ON libros_categorias.id_categoria = categorias.id_categoria
            
            -- Unión de Editoriales (Con filtro inteligente si existe)
            LEFT JOIN editoriales ON libros.id_editorial = editoriales.id_editorial
                ${editorial ? 'AND libros.id_editorial = ?' : ''}
        `;
        
        if (autor) parametros.push(autor);
        if (categoria) parametros.push(categoria);
        if (editorial) parametros.push(editorial);

        if (autor || editorial || categoria) {
            
            sqlQuery += " WHERE 1=1 ";
            if (autor) sqlQuery += " AND autores.nombre IS NOT NULL ";
            if (categoria) sqlQuery += " AND categorias.nombre IS NOT NULL ";
            if (editorial) sqlQuery += " AND editoriales.nombre IS NOT NULL ";

            sqlQuery += " LIMIT ? ;";
            parametros.push(limit);

            const [resultado] = await pool.query(sqlQuery, parametros);
            return res.json(resultado);

        } else {
            
            sqlQuery += " ORDER BY RAND() LIMIT ? ;";
            parametros.push(limit);

            const [resultado] = await pool.query(sqlQuery, parametros);
            return res.json(resultado);
        }

    } catch (error) {
        console.error("Error en el servidor:", error.message);
        return res.status(500).json({ error: "Error en el servidor" });
    }
};


// 1. Endpoint para traer TODOS los autores (Sin límites, sin random)
export const getAutores = async (req, res) => {
    const [resultado] = await pool.query(`SELECT id_autor, nombre FROM autores ORDER BY nombre DESC;`);
    return res.json(resultado);
};

// 2. Endpoint para traer TODAS las editoriales
export const getEditoriales = async (req, res) => {
    const [resultado] = await pool.query(`SELECT id_editorial, nombre FROM editoriales ORDER BY nombre DESC;`);
    return res.json(resultado);
};

// 3. Endpoint para traer TODAS las categorías
export const getCategorias = async (req, res) => {
    const [resultado] = await pool.query(`SELECT id_categoria, nombre FROM categorias ORDER BY nombre DESC;`);
    return res.json(resultado);
}

//inicio de Sesion
export const login = async (req, res) => {
    const { correo, password } = req.body

    try {
        const [row] = await pool.query(`SELECT * FROM usuarios WHERE correo = ?`, [correo])
        if(row.length === 0) {
           return res.status(404).json({ message: `El usuario no existe` })
        }

        const usuario = row[0]
        const passwordCorecto = await bcrypt.compare(password, usuario.password)

        if(!passwordCorecto) {
            return res.status(401).json({ message: `Contraseña incorrecta` })
        }

        const token = jwt.sign(
            {id: usuario.id_usuario, rol: usuario.rol},
            process.env.JWT_SECRET ,
            { expiresIn: '1h' }
        )

        console.log(process.env.JWT_SECRET)

        res
        .cookie('acces_token', token, {
            httpOnly: true, //la cookie solo puede accederce en el servidor
            secure: process.env.NODE_ENV === 'production', // la cookie solo se accede por https
            sameSite: 'none', // la cookie solo puede accederce en el mismo dominio
            maxAge: 1000 * 60 * 60 // la duracion de la cookie 1hr
        })
        .status(200)
        .json({
            message: "Login exitoso",
            token,
            usuario: { nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol }
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el login.' });
    }
}

export const registrar = async (req, res) => {
    const { nombre, password ,correo} = req.body

    try {
        const [existe] = await pool.query(`SELECT * FROM usuarios WHERE correo = ?`, [correo])
        if(existe.length > 0 ) {
            return res.status(400).json({ message:`El correo ya esta registrado` })
        } 

        const salt = await bcrypt.genSalt(10)
        const passwordEncripatado = await bcrypt.hash(password, salt)

        await pool.query(`INSERT INTO usuarios(nombre, correo, password) VALUES (?, ?, ?)`, [nombre, correo, passwordEncripatado])

        res.status(201).json({ message: `Usuario registrado con exito` })
    } 
    catch(error) {
        console.error(error)
        res.status(500).json({ message: 'Error al registrar usuario.' });
    }
}

export const logout = async(req, res) => {

}

export const Protect = async(req, res) => {

}