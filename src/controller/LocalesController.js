import multer from "multer";
import pool from "../database.js";

export const crearLocal = async (req, res) => {
    const { nombre, direccion, clinica_id } = req.body;

    // Verifica que se envíen todos los campos obligatorios
    if (!nombre || !direccion || !clinica_id) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios: nombre, direccion, clinica_id' });
    }

    try {
        // Consulta SQL para insertar un nuevo local
        const [result] = await pool.query(
            'INSERT INTO Locales (nombre, direccion, clinica_id) VALUES (?, ?, ?)',
            [nombre, direccion, clinica_id]
        );

        // Responder con éxito y el ID del local creado
        return res.status(201).json({
            message: 'Local creado con éxito',
            localId: result.insertId, // Devuelve el ID del nuevo local
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al crear el local' });
    }
};

export const editarLocal = async (req, res) => {
    const { id } = req.params; // Obtener el ID del local a editar
    const { nombre, direccion, clinica_id } = req.body; // Obtener los nuevos datos del cuerpo de la solicitud

    // Verifica que se envíen todos los campos obligatorios
    if (!nombre || !direccion || !clinica_id) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios: nombre, direccion, clinica_id' });
    }

    try {
        // Verificar si el local existe antes de actualizarlo
        const [local] = await pool.query('SELECT * FROM Locales WHERE id = ?', [id]);
        if (local.length === 0) {
            return res.status(404).json({ message: 'El local no existe' });
        }

        // Consulta SQL para actualizar el local
        await pool.query(
            'UPDATE Locales SET nombre = ?, direccion = ?, clinica_id = ? WHERE id = ?',
            [nombre, direccion, clinica_id, id]
        );

        // Responder con éxito si la actualización fue exitosa
        return res.status(200).json({
            message: 'Local actualizado con éxito',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al actualizar el local' });
    }
};

export const GetLocales = async (req, res) => {
    try {
        // Consulta para obtener todos los locales
        const [locales] = await pool.query('SELECT * FROM Locales');

        // Verificar si hay locales en la base de datos
        if (locales.length === 0) {
            return res.status(404).json({ message: 'No se encontraron locales' });
        }

        // Enviar la lista de locales en la respuesta
        return res.status(200).json(locales);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los locales' });
    }
};

export const LocalesClinica = async (req, res) => {
    const { clinica_id } = req.params; // Obtener el clinica_id desde los parámetros de la ruta

    try {
        // Consulta para obtener los locales filtrados por clinica_id
        const [locales] = await pool.query('SELECT * FROM Locales WHERE clinica_id = ?', [clinica_id]);

        // Verificar si se encontraron locales para la clínica
        if (locales.length === 0) {
            return res.status(404).json({ message: 'No se encontraron locales para esta clínica' });
        }

        // Enviar la lista de locales en la respuesta
        return res.status(200).json(locales);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al obtener los locales para esta clínica' });
    }
};

export const DeleteLocal = async (req, res) => {
    const { id } = req.params; // Obtener el id del local desde los parámetros de la ruta

    try {
        // Ejecutar la consulta para eliminar el local
        const [result] = await pool.query('DELETE FROM Locales WHERE id = ?', [id]);

        // Verificar si el local fue eliminado
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Local no encontrado' });
        }

        // Enviar respuesta de éxito
        return res.status(200).json({ message: 'Local eliminado exitosamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al eliminar el local' });
    }
};