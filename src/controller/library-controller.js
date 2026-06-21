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
                autores.nombre AS nombre_autor,
                editoriales.nombre AS nombre_editorial,
                categorias.nombre AS nombre_categorias
            FROM libros
            
            -- Unión de Autores (Con filtro inteligente si existe)
            LEFT JOIN libros_autores ON libros.id_libro = libros_autores.id_libro
                ${autor ? 'AND libros_autores.id_autor = ?' : ''}
            LEFT JOIN autores ON libros_autores.id_autor = autores.id_autor
            
            -- Unión de Categorías (¡Aquí se resuelve tu problema!)
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