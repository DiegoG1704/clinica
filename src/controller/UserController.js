import multer from "multer";
import pool from "../database.js";

export const crearUsuario = async (req, res) => {
    const {
        correo,
        contraseña,
        nombres,
        apellidos,
        dni,
        estado_civil,
        rol_id,
        afiliador_id,
        clinica_id,
        Local_id,
        fechNac,
        telefono,
        fotoPerfil,
        direccion
    } = req.body;

    // Validaciones
    if (!correo || !contraseña) {
        return res.status(400).json({ message: 'El correo y la contraseña son obligatorios.' });
    }

    // Validar formato de correo
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
        return res.status(400).json({ message: 'El correo no tiene un formato válido.' });
    }

    // Validar longitud de la contraseña
    if (contraseña.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    // Validar nombres y apellidos
    if (!nombres || typeof nombres !== 'string' || nombres.length > 100) {
        return res.status(400).json({ message: 'Los nombres son obligatorios y deben ser un texto de hasta 100 caracteres.' });
    }

    if (!apellidos || typeof apellidos !== 'string' || apellidos.length > 100) {
        return res.status(400).json({ message: 'Los apellidos son obligatorios y deben ser un texto de hasta 100 caracteres.' });
    }

    // Validar DNI
    if (dni && (isNaN(dni) || dni.toString().length > 8)) {
        return res.status(400).json({ message: 'El DNI debe ser un número y no puede tener más de 8 dígitos.' });
    }

    // Validar estado civil
    const estadosCiviles = ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Separado'];
    if (estado_civil && !estadosCiviles.includes(estado_civil)) {
        return res.status(400).json({ message: 'Estado civil inválido.' });
    }

    // Validar rol_id
    if (rol_id && isNaN(rol_id)) {
        return res.status(400).json({ message: 'El rol_id debe ser un número.' });
    }

    // Validar afiliador_id
    if (afiliador_id && isNaN(afiliador_id)) {
        return res.status(400).json({ message: 'El afiliador_id debe ser un número.' });
    }

    try {
        // Validar que el afiliador tenga rol_id 3
        if (afiliador_id) {
            const [afiliadorResult] = await pool.query('SELECT rol_id FROM Usuarios WHERE id = ?', [afiliador_id]);

            if (afiliadorResult.length === 0) {
                return res.status(400).json({ success: false, message: 'El afiliador no existe.' });
            }

            const afiliadorRol = afiliadorResult[0].rol_id;

            if (afiliadorRol !== 3) {
                return res.status(400).json({ success: false, message: 'No puedes afiliar a otros hasta que pagues el nuevo plan.' });
            }
        }

        const query = `
            INSERT INTO Usuarios (correo, contraseña, nombres, apellidos, dni, estado_civil, rol_id, afiliador_id, clinica_id, Local_id, fechNac, telefono, fotoPerfil, direccion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await pool.query(query, [correo, contraseña, nombres, apellidos, dni, estado_civil, rol_id, afiliador_id, clinica_id, Local_id, fechNac, telefono, fotoPerfil, direccion]);

        res.status(201).json({ success: true, message: 'Usuario creado con éxito', usuarioId: result.insertId });
    } catch (err) {
        console.error('Error al crear el usuario:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'El correo ya está en uso.' });
        }
        return res.status(500).json({ success: false, message: 'Error al crear el usuario.' });
    }
};

export const getUsuario = async (req, res) => {
    try {
        const query = `
            SELECT 
                u.id AS usuario_id, 
                u.correo, 
                u.nombres, 
                u.apellidos, 
                u.dni, 
                u.estado_civil, 
                u.rol_id, 
                u.afiliador_id,
                a.id AS afiliador_id,
                a.correo AS afiliador_correo,
                a.nombres AS afiliador_nombres,
                a.apellidos AS afiliador_apellidos,
                a.dni AS afiliador_dni,
                a.estado_civil AS afiliador_estado_civil,
                a.rol_id AS afiliador_rol_id
            FROM 
                Usuarios u
            LEFT JOIN 
                usuarios a ON u.afiliador_id = a.id
        `;

        const [result] = await pool.query(query);

        // Map to hold users and their affiliates
        const usersMap = {};

        result.forEach(user => {
            const {
                usuario_id,
                correo,
                contraseña,
                nombres,
                apellidos,
                dni,
                estado_civil,
                rol_id,
                afiliador_id,
                afiliador_correo,
                afiliador_nombres,
                afiliador_apellidos,
                afiliador_dni,
                afiliador_estado_civil,
                afiliador_rol_id
            } = user;

            // Si el usuario no tiene afiliador, lo agregamos directamente
            if (!afiliador_id) {
                if (!usersMap[usuario_id]) {
                    usersMap[usuario_id] = {
                        id: usuario_id,
                        correo,
                        contraseña,
                        nombres,
                        apellidos,
                        dni,
                        estado_civil,
                        rol_id,
                        afiliados: [] // Inicializa el array de afiliados
                    };
                }
            } else {
                // Si el afiliador ya existe en el mapa, solo agregamos el afiliado
                if (!usersMap[afiliador_id]) {
                    usersMap[afiliador_id] = {
                        id: afiliador_id,
                        correo: afiliador_correo,
                        nombres: afiliador_nombres,
                        apellidos: afiliador_apellidos,
                        dni: afiliador_dni,
                        estado_civil: afiliador_estado_civil,
                        rol_id: afiliador_rol_id,
                        afiliados: [] // Inicializa el array de afiliados
                    };
                }

                // Agrega el afiliado a la lista de afiliados del afiliador
                usersMap[afiliador_id].afiliados.push({
                    id: usuario_id,
                    correo,
                    nombres,
                    apellidos,
                    dni,
                    estado_civil,
                    rol_id
                });
            }
        });

        // Convertimos el usersMap en un array para la respuesta
        const response = Object.values(usersMap);

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getUsuariosId = async (req, res) => {
    const query = 'SELECT id, correo, nombres, apellidos, dni, estado_civil, rol_id, afiliador_id FROM Usuarios';

    try {
        const [results] = await pool.query(query);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error al obtener los usuarios:', err);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

export const getUsuarioDatosId = async (req, res) => {
    const { id } = req.params; // Obtener el ID del usuario desde los parámetros de la URL
    const query = 'SELECT id, correo, nombres, apellidos, dni, estado_civil, rol_id, afiliador_id FROM Usuarios WHERE id = ?';

    try {
        const [results] = await pool.query(query, [id]); // Ejecutar la consulta con el ID proporcionado

        if (results.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(results[0]); // Devolver el primer resultado
    } catch (err) {
        console.error('Error al obtener el usuario:', err);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Carpeta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);  // Guardar la imagen con nombre único
    }
});

export const upload = multer({ storage: storage });

export const FotoPerfil = async (req, res) => {
    try {
        const Id = req.params.id;
        const imagePath = req.file.filename;  // Obtener el nombre del archivo guardado

        // Actualizar la ruta de la imagen en la base de datos
        const query = 'UPDATE Usuarios SET fotoPerfil = ? WHERE Id = ?';
        const [result] = await pool.query(query, [imagePath, Id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(201).json({ fotoPerfil: imagePath, message: 'Éxito' });
    } catch (err) {
        console.error("Error actualizando la imagen de perfil:", err);
        res.status(500).send("Error al actualizar la imagen de perfil");
    }
};

export const editUsuarioId = async (req, res) => {
    const userId = req.params.id;
    const {
        correo,
        contraseña,
        nombres,
        apellidos,
        dni,
        estado_civil,
        rol_id,
        afiliador_id,
        clinica_id,
        fechNac,
        telefono,
        fotoPerfil,
        direccion
    } = req.body;

    // Validaciones
    if (!correo || !contraseña) {
        return res.status(400).json({ message: 'El correo y la contraseña son obligatorios.' });
    }

    // Validar formato de correo
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
        return res.status(400).json({ message: 'El correo no tiene un formato válido.' });
    }

    // Validar longitud de la contraseña
    if (contraseña.length < 6) {
        return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    // Validar nombres y apellidos
    if (!nombres || typeof nombres !== 'string' || nombres.length > 100) {
        return res.status(400).json({ message: 'Los nombres son obligatorios y deben ser un texto de hasta 100 caracteres.' });
    }

    if (!apellidos || typeof apellidos !== 'string' || apellidos.length > 100) {
        return res.status(400).json({ message: 'Los apellidos son obligatorios y deben ser un texto de hasta 100 caracteres.' });
    }

    // Validar DNI
    if (dni && (isNaN(dni) || dni.toString().length > 8)) {
        return res.status(400).json({ message: 'El DNI debe ser un número y no puede tener más de 8 dígitos.' });
    }

    // Validar estado civil
    const estadosCiviles = ['Soltero', 'Casado', 'Divorciado', 'Viudo', 'Separado'];
    if (estado_civil && !estadosCiviles.includes(estado_civil)) {
        return res.status(400).json({ message: 'Estado civil inválido.' });
    }

    // Validar rol_id
    if (rol_id && isNaN(rol_id)) {
        return res.status(400).json({ message: 'El rol_id debe ser un número.' });
    }

    // Validar afiliador_id
    if (afiliador_id && isNaN(afiliador_id)) {
        return res.status(400).json({ message: 'El afiliador_id debe ser un número.' });
    }

    try {
        // Validar que el afiliador tenga rol_id 3
        if (afiliador_id) {
            const afiliadorQuery = 'SELECT rol_id FROM Usuarios WHERE id = ?';
            const [afiliadorResult] = await pool.query(afiliadorQuery, [afiliador_id]);

            if (afiliadorResult.length === 0) {
                return res.status(400).json({ message: 'El afiliador no existe.' });
            }

            const afiliadorRol = afiliadorResult[0].rol_id;

            if (afiliadorRol !== 3) {
                return res.status(400).json({ message: 'No puedes afiliar a otros hasta que pagues el nuevo plan.' });
            }
        }

        const sql = `UPDATE Usuarios SET 
            correo = ?, 
            contraseña = ?, 
            nombres = ?, 
            apellidos = ?, 
            dni = ?, 
            estado_civil = ?, 
            rol_id = ?, 
            afiliador_id = ?,
            clinica_id = ?, 
            fechNac = ?, 
            telefono = ?, 
            fotoPerfil = ?,
            direccion = ?
            WHERE id = ?`;

        // Nota el cambio en el orden de los parámetros aquí
        const [result] = await pool.query(sql, [
            correo,
            contraseña,
            nombres,
            apellidos,
            dni,
            estado_civil,
            rol_id,
            afiliador_id,
            clinica_id,
            fechNac,
            telefono,
            fotoPerfil,
            direccion,
            userId // userId debe ser el último
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.json({ message: 'Usuario actualizado exitosamente' });
    } catch (err) {
        console.error('Error al actualizar el usuario:', err);
        return res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

export const deleteUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM Usuarios WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para eliminar' });
        }

        res.status(200).json({ message: 'Usuario eliminado con id:', id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const obtenerRutasPorRol = async (id) => {
    const queryUsuario = 'SELECT rol_id FROM Usuarios WHERE id = ?';

    try {
        const [resultsUsu] = await pool.query(queryUsuario, [id]);

        // Validar que se haya encontrado un usuario
        if (resultsUsu.length === 0) {
            throw new Error('Usuario no encontrado');
        }

        const rolId = resultsUsu[0].rol_id; // Extraer rol_id

        const queryRutas = 'SELECT nombre, logo, ruta FROM Vistas WHERE rol_id = ?';
        const [results] = await pool.query(queryRutas, [rolId]);

        return results; // Retornar las rutas
    } catch (err) {
        console.error('Error al obtener las rutas:', err);
        throw err; // Re-lanzar el error para manejarlo en el contexto de la llamada
    }
};


export const loginUsuario = async (req, res) => {
    const { correo, contraseña } = req.body;

    if (!correo || !contraseña) {
        return res.status(400).json({ message: 'Correo y contraseña son requeridos' });
    }

    try {
        // Buscar el usuario por correo y obtener sus datos, junto con las vistas asociadas a su rol
        const [rows] = await pool.query(`
            SELECT 
    u.id AS usuarioId, 
    u.correo, 
    u.contraseña, 
    u.nombres, 
    u.apellidos, 
    u.fotoPerfil, 
    u.clinica_id, 
    r.nombre AS rol,
    v.id AS vistaId, 
    v.nombre AS vistaNombre, 
    v.logo, 
    v.ruta
FROM 
    Usuarios u
LEFT JOIN 
    Roles r ON u.rol_id = r.id
LEFT JOIN 
    Vistas v ON r.id = v.rol_id
WHERE 
    u.correo = ?;
        `, [correo]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        const usuario = rows[0];

        // Comparar la contraseña proporcionada con la almacenada
        if (contraseña !== usuario.contraseña) {
            return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        // Agrupar las vistas en un array de objetos
        const vistas = rows.map(row => ({
            id: row.vistaId,
            nombre: row.vistaNombre,
            logo: row.logo,
            ruta: row.ruta
        }));

        // Responder con éxito, incluyendo los datos del usuario y sus vistas
        return res.status(200).json({
            success: true,
            usuario: {
                id: usuario.usuarioId,  // Incluyendo el id del usuario
                correo: usuario.correo,
                nombres: usuario.nombres,
                apellidos: usuario.apellidos,
                fotoPerfil: usuario.fotoPerfil,
                rol: usuario.rol,
                ...(usuario.clinica_id ? { clinica_id: usuario.clinica_id } : {}),
                vistas: vistas
            },
            message: 'Bienvenido'
        });

    } catch (error) {
        console.error('Error del servidor:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
};


export const postRol = async (req, res) => {
    try {
        const { nombre } = req.body;

        // Validate required field
        if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
            return res.status(400).json({ error: 'El campo "nombre" es requerido y debe ser una cadena válida.' });
        }

        // Optional: Validate length
        if (nombre.length > 50) {
            return res.status(400).json({ error: 'El campo "nombre" no puede exceder los 50 caracteres.' });
        }

        // Insert data into the database
        const sql = 'INSERT INTO Roles (nombre) VALUES (?)';
        const [results] = await pool.query(sql, [nombre]);

        res.status(201).json({ id: results.insertId, message: 'Rol creado exitosamente' });
    } catch (error) {
        console.error('Error inserting data:', error);
        return res.status(500).json({ error: 'Error inserting data' });
    }
};

export const getUsuarioById = async (req, res) => {
    const userId = req.params.id;

    try {
        const query = `
            SELECT 
                u.id AS usuario_id, 
                u.correo, 
                u.nombres, 
                u.apellidos, 
                u.dni, 
                u.estado_civil, 
                u.rol_id,
                a.id AS afiliador_id,
                a.correo AS afiliador_correo,
                a.nombres AS afiliador_nombres,
                a.apellidos AS afiliador_apellidos,
                a.dni AS afiliador_dni,
                a.estado_civil AS afiliador_estado_civil,
                a.rol_id AS afiliador_rol_id,
                af.id AS afiliado_id,
                af.correo AS afiliado_correo,
                af.nombres AS afiliado_nombres,
                af.apellidos AS afiliado_apellidos,
                af.dni AS afiliado_dni,
                af.estado_civil AS afiliado_estado_civil,
                af.rol_id AS afiliado_rol_id
            FROM 
                Usuarios u
            LEFT JOIN 
                Usuarios a ON u.afiliador_id = a.id
            LEFT JOIN 
                Usuarios af ON af.afiliador_id = u.id
            WHERE 
                u.id = ?
        `;

        const [result] = await pool.query(query, [userId]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Extraemos la información del usuario y sus afiliados
        const user = result[0];

        // Construimos el objeto de respuesta
        const response = {
            id: user.usuario_id,
            correo: user.correo,
            nombres: user.nombres,
            apellidos: user.apellidos,
            dni: user.dni,
            estado_civil: user.estado_civil,
            rol_id: user.rol_id,
            afiliador: user.afiliador_id ? {
                id: user.afiliador_id,
                correo: user.afiliador_correo,
                nombres: user.afiliador_nombres,
                apellidos: user.afiliador_apellidos,
                dni: user.afiliador_dni,
                estado_civil: user.afiliador_estado_civil,
                rol_id: user.afiliador_rol_id
            } : null,
            afiliados: result.map(item => ({
                id: item.afiliado_id,
                correo: item.afiliado_correo,
                nombres: item.afiliado_nombres,
                apellidos: item.afiliado_apellidos,
                dni: item.afiliado_dni,
                estado_civil: item.afiliado_estado_civil,
                rol_id: item.afiliado_rol_id
            })).filter(af => af.id !== null) // Filtramos afiliados nulos
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error fetching user and affiliates:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getAfiliadosPorUsuarioId = async (req, res) => {
    const userId = req.params.id;

    try {
        const query = `
            SELECT 
                af.id AS afiliado_id,
                af.correo AS afiliado_correo,
                af.nombres AS afiliado_nombres,
                af.apellidos AS afiliado_apellidos,
                af.dni AS afiliado_dni,
                af.estado_civil AS afiliado_estado_civil,
                af.rol_id AS afiliado_rol_id
            FROM 
                Usuarios af
            WHERE 
                af.afiliador_id = ?
        `;

        const [result] = await pool.query(query, [userId]);

        // Si no hay afiliados, se puede devolver un array vacío
        const afiliados = result.map(item => ({
            id: item.afiliado_id,
            correo: item.afiliado_correo,
            nombres: item.afiliado_nombres,
            apellidos: item.afiliado_apellidos,
            dni: item.afiliado_dni,
            estado_civil: item.afiliado_estado_civil,
            rol_id: item.afiliado_rol_id
        }));

        // Devolver solo el array de afiliados
        res.status(200).json(afiliados);
    } catch (error) {
        console.error('Error fetching affiliates:', error);
        res.status(500).json({ message: error.message });
    }
};


export const GetAfiliadorAfiliadores = async (req, res) => {
    try {
        // Consulta a la base de datos para obtener los usuarios con rol_id 3 (Afiliador) y 4 (Afiliado)
        const [usuarios] = await pool.query(
            `SELECT u.id, u.correo, u.fotoPerfil, u.nombres, u.apellidos, u.dni, u.telefono, r.nombre AS rol
             FROM Usuarios u
             LEFT JOIN Roles r ON u.rol_id = r.id
             WHERE u.rol_id IN (3, 4)`)
        // Responder con los usuarios encontrados
        return res.status(200).json(usuarios);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};
//opcional
// import fs from 'fs';
// import path from 'path';

// // Configuración de multer para subir imágenes
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');  // Carpeta donde se guardarán las imágenes
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);  // Guardar la imagen con nombre único
//     }
// });

// export const upload = multer({ storage: storage });

// export const FotoPerfil = async (req, res) => {
//     try {
//         const Id = req.params.id;

//         // Obtener la foto actual del usuario
//         const queryCurrentPhoto = 'SELECT fotoPerfil FROM Usuarios WHERE Id = ?';
//         const [currentPhotoResult] = await pool.query(queryCurrentPhoto, [Id]);

//         if (currentPhotoResult.length === 0) {
//             return res.status(404).json({ message: 'Usuario no encontrado' });
//         }

//         const currentPhotoPath = currentPhotoResult[0].fotoPerfil;

//         // Eliminar la foto anterior del sistema de archivos
//         if (currentPhotoPath) {
//             const filePath = path.join(__dirname, 'uploads', currentPhotoPath);
//             fs.unlink(filePath, (err) => {
//                 if (err) {
//                     console.error("Error eliminando la foto anterior:", err);
//                     // Continuar con la actualización aunque no se pueda eliminar la foto
//                 }
//             });
//         }

//         // Obtener el nombre del nuevo archivo guardado
//         const newImagePath = req.file.filename;

//         // Actualizar la ruta de la nueva imagen en la base de datos
//         const queryUpdatePhoto = 'UPDATE Usuarios SET fotoPerfil = ? WHERE Id = ?';
//         const [updateResult] = await pool.query(queryUpdatePhoto, [newImagePath, Id]);

//         res.status(201).json({ fotoPerfil: newImagePath, message: 'Éxito' });
//     } catch (err) {
//         console.error("Error actualizando la imagen de perfil:", err);
//         res.status(500).send("Error al actualizar la imagen de perfil");
//     }
// };


