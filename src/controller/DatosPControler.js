import pool from "../database.js";

export const getDatos = async (req, res) => {
    try {
        const [datos] = await pool.query('SELECT * FROM datospersonales');
        res.status(200).json(datos); // Cambiado a 200
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDatosId = async (req, res) => {
    const { id } = req.params;
    try {
        const [datos] = await pool.query('SELECT * FROM datospersonales WHERE id = ?', [id]);
        if (datos.length === 0) {
            return res.status(404).json({ message: 'Datos no encontrados' });
        }
        res.status(200).json(datos[0]); // Cambiado a 200
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postDatos = async (req, res) => {
    const { id } = req.params;
    const { Nombre, ApellidoP, ApellidoM, Direccion, EstadoC, Fechnac } = req.body;

    // Validar campos obligatorios
    if (!Nombre || !ApellidoP || !ApellidoM || !Direccion || !EstadoC || !Fechnac) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    try {
        const campos = {
            Idusuario: id,
            Nombre,
            ApellidoP,
            ApellidoM,
            Direccion,
            EstadoC,
            Fechnac,
            afiliador: false // Valor por defecto
        };

        // Insertar datos en la base de datos
        const result = await pool.query('INSERT INTO datospersonales SET ?', [campos]);

        // Obtener el ID del nuevo registro insertado
        const nuevoId = result.insertId;

        // Enviar respuesta al usuario con los datos insertados
        res.status(201).json({
            success: true,
            message: 'Datos creados correctamente',

        });
    } catch (error) {
        console.error('Error al insertar datos:', error); // Registrar el error
        res.status(500).json({ success: false, message: 'Error al crear datos', error: error.message });
    }
};

export const putDatos = async (req, res) => {
    const { id } = req.params;
    const { Nombre, ApellidoP, ApellidoM, Direccion, EstadoC, Fechnac } = req.body;

    // Validar campos obligatorios
    if (!Nombre || !ApellidoP || !ApellidoM || !Direccion || !EstadoC || !Fechnac) {
        return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    try {
        const campos = {
            Nombre,
            ApellidoP,
            ApellidoM,
            Direccion,
            EstadoC,
            Fechnac,
            afiliador: false // Valor por defecto
        };

        const [result] = await pool.query('UPDATE datospersonales SET ? WHERE Id = ?', [campos, id]);

        // Verificar si se actualizó algún registro
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Datos no encontrados' });
        }

        // Enviar respuesta exitosa
        res.status(200).json({
            message: 'Datos editados correctamente',
        });
    } catch (error) {
        console.error('Error al actualizar datos:', error); // Registrar el error
        res.status(500).json({ success: false, message: 'Error al editar datos', error: error.message });
    }
};


export const deleteDatos = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM datospersonales WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Datos no encontrados para eliminar' }); // Cambiado el mensaje
        }

        res.status(200).json({ message: 'Datos eliminados con id:', id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const AfiliadorEdit = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await pool.query('UPDATE datospersonales SET Afiliador = true WHERE Id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Datos no encontrados' });
        }

        res.status(200).json({ message: 'Datos editados correctamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
