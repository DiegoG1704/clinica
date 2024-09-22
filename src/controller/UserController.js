import pool from "../database.js";

export const postUsuario = async (req, res) => {
    const { DNI, Contraseña } = req.body;

    if (!DNI || !Contraseña) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const newUsuario = { DNI, Contraseña };
        await pool.query('INSERT INTO usuario SET ?', [newUsuario]);
        res.status(201).json({ message: 'Usuario creado', newUsuario });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsuario = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM usuario');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUsuarioId = async (req, res) => {
    const { id } = req.params;

    try {
        const [usuario] = await pool.query('SELECT DNI FROM usuario WHERE id = ?', [id]);

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
        const result = await pool.query('UPDATE usuario SET ? WHERE id = ?', [editUsuario, id]);

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
        const [result] = await pool.query('DELETE FROM usuario WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para eliminar' });
        }

        res.status(200).json({ message: 'Usuario eliminado con id:', id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
