import pool from "../database.js";

export const getClinica = async (req, res) => {
    const query = 'SELECT * FROM Clinicas';
  
    try {
      const [results] = await pool.query(query);
      res.status(200).json(results);
    } catch (err) {
      console.error('Error al obtener las clínicas:', err);
      res.status(500).json({ message: 'Error al obtener las clínicas' });
    }
  };
  
export const postClinica = async (req, res) => {
  try {
      const { nombre, direccion, ruc, ubicacion, telefonos, ImagoTipo, IsoTipo } = req.body;

      // Validación de campos requeridos
      if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
          return res.status(400).json({ error: 'El campo "nombre" es requerido y debe ser una cadena válida.' });
      }
      if (!ruc || typeof ruc !== 'string' || ruc.trim().length === 0) {
          return res.status(400).json({ error: 'El campo "ruc" es requerido y debe ser una cadena válida.' });
      }
      if (!ubicacion || typeof ubicacion !== 'string' || ubicacion.trim().length === 0) {
          return res.status(400).json({ error: 'El campo "ubicacion" es requerido y debe ser una cadena válida.' });
      }
      if (telefonos && (typeof telefonos !== 'string' || isNaN(telefonos))) {
          return res.status(400).json({ error: 'El campo "telefonos" debe ser un número válido.' });
      }

      // Validación de longitud o formato
      if (nombre.length > 100) {
          return res.status(400).json({ error: 'El campo "nombre" no puede exceder los 100 caracteres.' });
      }
      if (direccion && direccion.length > 255) {
          return res.status(400).json({ error: 'El campo "direccion" no puede exceder los 255 caracteres.' });
      }
      if (ruc.length > 20) {
          return res.status(400).json({ error: 'El campo "ruc" no puede exceder los 20 caracteres.' });
      }
      if (ubicacion.length > 255) {
          return res.status(400).json({ error: 'El campo "ubicacion" no puede exceder los 255 caracteres.' });
      }
      if (telefonos && (telefonos.length < 9 || telefonos.length > 9)) { // Suponiendo que el número de teléfono debe tener 9 dígitos
          return res.status(400).json({ error: 'El campo "telefonos" debe ser un número válido de 9 dígitos.' });
      }

      // Verifica si el RUC ya existe
      const checkRucSql = 'SELECT * FROM Clinicas WHERE ruc = ?';
      const [existingClinica] = await pool.query(checkRucSql, [ruc]);

      if (existingClinica.length > 0) {
          return res.status(400).json({ error: 'El RUC ya existe. Por favor, use uno diferente.' });
      }

      // Inserta los datos en la base de datos
      const sql = 'INSERT INTO Clinicas (nombre, direccion, ruc, ubicacion, telefonos, ImagoTipo, IsoTipo) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const [results] = await pool.query(sql, [nombre, direccion, ruc, ubicacion, telefonos, ImagoTipo, IsoTipo]);

      res.status(201).json({ id: results.insertId, message: 'Clínica agregada exitosamente' });
  } catch (error) {
      console.error('Error insertando datos:', error);
      return res.status(500).json({ error: 'Error insertando datos' });
  }
};

  export const editClinica = async (req, res) => {
    const { id } = req.params;
    const { nombre, direccion, ruc, ubicacion, telefonos } = req.body;
  
    // Validaciones básicas
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'El ID es requerido y debe ser un número.' });
    }
  
    if (nombre && (typeof nombre !== 'string' || nombre.length > 100)) {
      return res.status(400).json({ message: 'El nombre debe ser un texto de hasta 100 caracteres.' });
    }
  
    if (direccion && typeof direccion !== 'string') {
      return res.status(400).json({ message: 'La dirección debe ser un texto.' });
    }
  
    if (ruc !== undefined && (isNaN(ruc) || ruc <= 0 || ruc.toString().length > 12)) {
      return res.status(400).json({ message: 'El RUC debe ser un número positivo y no debe exceder 12 dígitos.' });
    }
  
    if (ubicacion && typeof ubicacion !== 'string') {
      return res.status(400).json({ message: 'La ubicación debe ser un texto.' });
    }
  
    if (telefonos !== undefined && (isNaN(telefonos) || telefonos <= 0 || telefonos.toString().length > 10)) {
      return res.status(400).json({ message: 'Los teléfonos deben ser un número positivo y no deben exceder 10 dígitos.' });
    }
  
    const query = `UPDATE Clinicas SET nombre = ?, direccion = ?, ruc = ?, ubicacion = ?, telefonos = ? WHERE id = ?`;
  
    try {
      const [result] = await pool.query(query, [nombre, direccion, ruc, ubicacion, telefonos, id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Clínica no encontrada.' });
      }
  
      res.status(200).json({ message: 'Clínica actualizada con éxito' });
    } catch (err) {
      console.error('Error al actualizar la clínica:', err);
      res.status(500).json({ message: 'Error al actualizar la clínica' });
    }
  };
  
  export const deleteClinica = async (req, res) => {
    const { id } = req.params;
  
    // Validación básica del ID
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: 'El ID es requerido y debe ser un número.' });
    }
  
    const query = `DELETE FROM Clinicas WHERE id = ?`;
  
    try {
      const [result] = await pool.query(query, [id]);
  
      // Verificar si la clínica fue encontrada y eliminada
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Clínica no encontrada.' });
      }
  
      res.status(200).json({ message: 'Clínica eliminada con éxito' });
    } catch (err) {
      console.error('Error al eliminar la clínica:', err);
      res.status(500).json({ message: 'Error al eliminar la clínica' });
    }
  };

  export const ImagoTipo = async (req, res) => {
    try {
        const Id = req.params.id;
        const imagePath = req.file.filename; // Obtener el nombre del archivo guardado
  
        // Actualizar la ruta de la imagen en la base de datos
        const query = 'UPDATE clinicas SET ImagoTipo = ? WHERE Id = ?';
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

  export const IsoTipo = async (req, res) => {
    try {
        const Id = req.params.id;
        const imagePath = req.file.filename; // Obtener el nombre del archivo guardado
        console.log('Ruta de la imagen guardada:', imagePath);
  
        // Actualizar la ruta de la imagen en la base de datos
        const query = 'UPDATE clinicas SET IsoTipo = ? WHERE Id = ?';
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
  
export const GetIsoTipo = async (req, res) => {
  try {
      const query = 'SELECT id, IsoTipo FROM Clinicas WHERE IsoTipo IS NOT NULL';
      const [results] = await pool.query(query);

      if (results.length === 0) {
          return res.status(404).json({ message: 'No se encontraron isotipos.' });
      }

      res.status(200).json(results);
  } catch (error) {
      console.error('Error al obtener los isotipos:', error);
      res.status(500).json({ error: 'Error al obtener los isotipos' });
  }
};

