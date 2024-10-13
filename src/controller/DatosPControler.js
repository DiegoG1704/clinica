import pool from "../database.js";
import multer from "multer";

export const getPromociones = async (req, res) => {
    const { id } = req.params; // Obtener el ID de la clínica de los parámetros
  
    // Validación del ID de la clínica
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'El ID de la clínica es requerido y debe ser un número.' });
    }
  
    const query = 'SELECT * FROM Promociones WHERE clinica_id = ?';
  
    try {
      const [results] = await pool.query(query, [id]);
      res.status(200).json(results);
    } catch (err) {
      console.error('Error al obtener las promociones:', err);
      res.status(500).json({ message: 'Error al obtener las promociones' });
    }
  };  

export const postPromocion = async (req, res) => {
    const { id } = req.params; // Obtener el ID de la clínica de los parámetros
    const { area, descuento, descripcion } = req.body;
  
    // Validaciones
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'El ID de la clínica es requerido y debe ser un número.' });
    }
  
    if (!area || typeof area !== 'string' || area.length > 100) {
      return res.status(400).json({ message: 'El área es requerida y debe ser un texto de hasta 100 caracteres.' });
    }
  
    if (descuento === undefined || isNaN(descuento) || descuento < 0 || descuento > 100) {
      return res.status(400).json({ message: 'El descuento debe ser un número entre 0 y 100.' });
    }
  
    // Verificar que la clínica exista
    const checkClinicaQuery = 'SELECT COUNT(*) AS count FROM Clinicas WHERE id = ?';
    try {
      const [clinicaCheck] = await pool.query(checkClinicaQuery, [id]);
      if (clinicaCheck[0].count === 0) {
        return res.status(404).json({ message: 'La clínica no existe.' });
      }
  
      const query = `INSERT INTO Promociones (area, descuento, descripcion, clinica_id) 
                     VALUES (?, ?, ?, ?)`;
      const [result] = await pool.query(query, [area, descuento, descripcion, id]); // Usar id como clinica_id
      res.status(201).json({ message: 'Promoción creada con éxito', promocionId: result.insertId });
    } catch (err) {
      console.error('Error al crear la promoción:', err);
      res.status(500).json({ message: 'Error al crear la promoción' });
    }
  };
  
export const editPromocion = async (req, res) => {
    const { id } = req.params;
    const { area, descuento, descripcion, clinica_id } = req.body;
  
    // Validaciones
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'El ID es requerido y debe ser un número.' });
    }
  
    if (area && (typeof area !== 'string' || area.length > 100)) {
      return res.status(400).json({ message: 'El área debe ser un texto de hasta 100 caracteres.' });
    }
  
    if (descuento !== undefined && (isNaN(descuento) || descuento < 0 || descuento > 100)) {
      return res.status(400).json({ message: 'El descuento debe ser un número entre 0 y 100.' });
    }
  
    if (clinica_id !== undefined && isNaN(clinica_id)) {
      return res.status(400).json({ message: 'El ID de la clínica debe ser un número.' });
    }
  
    const query = `UPDATE Promociones SET area = ?, descuento = ?, descripcion = ?, clinica_id = ? WHERE id = ?`;
  
    try {
      const [result] = await pool.query(query, [area, descuento, descripcion, clinica_id, id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Promoción no encontrada.' });
      }
  
      res.status(200).json({ message: 'Promoción actualizada con éxito' });
    } catch (err) {
      console.error('Error al actualizar la promoción:', err);
      res.status(500).json({ message: 'Error al actualizar la promoción' });
    }
  };

export const deletePromocion = async (req, res) => {
    const { id } = req.params;
  
    // Validación del ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'El ID es requerido y debe ser un número.' });
    }
  
    const query = `DELETE FROM Promociones WHERE id = ?`;
  
    try {
      const [result] = await pool.query(query, [id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Promoción no encontrada.' });
      }
  
      res.status(200).json({ message: 'Promoción eliminada con éxito' });
    } catch (err) {
      console.error('Error al eliminar la promoción:', err);
      res.status(500).json({ message: 'Error al eliminar la promoción' });
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

export const Image = async (req, res) => {
  try {
      const Id = req.params.id;
      const imagePath = req.file.filename; // Obtener el nombre del archivo guardado

      // Actualizar la ruta de la imagen en la base de datos
      const query = 'UPDATE promociones SET imagen = ? WHERE Id = ?';
      const [result] = await pool.query(query, [imagePath, Id]);

      if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Promoción no encontrada' });
      }

      res.status(201).json({ fotoPerfil: imagePath, message: 'Éxito' });
  } catch (err) {
      console.error("Error actualizando la imagen de perfil:", err);
      res.status(500).send("Error al actualizar la imagen de perfil");
  }
};


