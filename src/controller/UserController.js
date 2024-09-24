import pool from "../database.js";

export const postUsuario = async (req, res) => {
    const { DNI, Contraseña } = req.body;

    if (!DNI || !Contraseña) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const newUsuario = { DNI, Contraseña };
        await pool.query('INSERT INTO USUARIO SET ?', [newUsuario]);
        res.status(201).json({ message: 'Usuario creado', newUsuario });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsuario = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM USUARIO');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsuarioId = async (req, res) => {
    const { id } = req.params;

    try {
        const [usuario] = await pool.query('SELECT DNI FROM USUARIO WHERE id = ?', [id]);

        if (usuario.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(usuario[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const editUsuarioId = async (req, res) => {
    const { id } = req.params;
    const { DNI, Contraseña } = req.body;

    if (!DNI || !Contraseña) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const editUsuario = { DNI, Contraseña };
        const result = await pool.query('UPDATE USUARIO SET ? WHERE id = ?', [editUsuario, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
        }

        res.status(200).json({ message: 'Usuario actualizado correctamente', usuario: editUsuario });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM USUARIO WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para eliminar' });
        }

        res.status(200).json({ message: 'Usuario eliminado con id:', id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const loginUsuario = async (req, res) => {
    const { DNI, Contraseña } = req.body;

    if (!DNI || !Contraseña) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        // Convertimos el DNI a número entero para evitar problemas de comparación
        const [result] = await pool.query('SELECT * FROM USUARIO WHERE DNI = ?', [parseInt(DNI, 10)]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
            
        }

        const usuario = result[0];

        // Validar contraseña
        if (usuario.Contraseña !== Contraseña) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.status(200).json({ message: 'Login exitoso', usuario });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controlador para obtener todos los detalles del usuario
export const getUsuarioDetalles = async (req, res) => {
    const { id } = req.params;

    try {
        // Hacemos un JOIN entre USUARIO y DATOSPERSONALES
        const [result] = await pool.query(`
            SELECT 
                U.Id AS IdUsuario, U.DNI, U.Contraseña, 
                DP.Nombre, DP.ApellidoP, DP.ApellidoM, DP.Direccion, 
                DP.EstadoC, DP.Fechnac, DP.Afiliador
            FROM USUARIO U
            JOIN DATOSPERSONALES DP ON U.Id = DP.Idusuario
            WHERE U.Id = ?
        `, [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(result[0]); // Devolvemos los datos combinados del usuario
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


