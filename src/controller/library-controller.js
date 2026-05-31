import { connection } from "../../db/database.js"
const pool = await connection()


//GET
export const getLibros = async(req, res) => {
    try {
        const [result] = await pool.query('SELECT l.id_libro, l.titulo, l.descripcion, l.precio, l.url_image AS imagen, a.nombre AS nombre_autor FROM libros l INNER JOIN libros_autores la ON l.id_libro = la.id_libro INNER JOIN autores a ON la.id_autor = a.id_autor;')
        res.send(result)
    } catch(error) {
        console.log(error.message)
    }

}

export const getLibrosFiltroAvanzado = async (req, res) => {
    const { autor, editorial, categoria } = req.query;

    try {
        let sqlQuery = `
            SELECT 
                libros.id_libro,
                libros.titulo,
                libros.precio,
                libros.url_image AS imagen,
                autores.nombre AS nombre_autor,
                editoriales.nombre AS nombre_editorial,
                categorias.nombre AS nombre_categorias
            FROM libros
            -- Unimos autores mediante su tabla puente
            LEFT JOIN libros_autores ON libros.id_libro = libros_autores.id_libro
            LEFT JOIN autores ON libros_autores.id_autor = autores.id_autor
            -- Unimos categorías mediante su tabla puente
            LEFT JOIN libros_categorias ON libros.id_libro = libros_categorias.id_libro
            LEFT JOIN categorias ON libros_categorias.id_categoria = categorias.id_categoria
            -- Unimos editoriales
            LEFT JOIN editoriales ON libros.id_editorial = editoriales.id_editorial
            WHERE 1=1
        `;

        const parametros = [];

        // Si el usuario selecciona un AUTOR en el frontend
        if (autor) {
            sqlQuery += " AND libros_autores.id_autor = ? ";
            parametros.push(autor);
        }

        // Si el usuario selecciona una EDITORIAL en el frontend
        if (editorial) {
            sqlQuery += " AND libros.id_editorial = ? ";
            parametros.push(editorial);
        }

        // Si el usuario selecciona un GÉNERO en el frontend
        if (categoria) {
            sqlQuery += " AND libros_categorias.id_categoria = ? ";
            parametros.push(categoria);
        }

        const [resultado] = await pool.query(sqlQuery, parametros);

        if(resultado.length <= 0 ) {
            res.send(`No existe  ${autor, editorial, categoria} `)
        }
        
        // Devolvemos el array con TODOS los libros encontrados
        res.json(resultado);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

//    SELECT 
//                 libros.id_libro, 
//                 libros.titulo, 
//                 libros.precio, 
//                 editoriales.nombre AS nombre_editorial, 
//                 autores.nombre AS nombre_autor, 
//                 categorias.nombre AS nombre_genero
//             FROM libros
//             LEFT JOIN editoriales ON libros.id_editorial = editoriales.id_editorial
//             LEFT JOIN libros_autores ON libros.id_libro = libros_autores.id_libro
//             LEFT JOIN autores ON libros_autores.id_autor = autores.id_autor
//             LEFT JOIN libros_categorias ON libros.id_libro = libros_categorias.id_libro
//             LEFT JOIN categorias ON libros_categorias.id_categoria = categorias.id_categoria
//             WHERE 1=1 AND libros_autores.id_autor = 8