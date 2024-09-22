import pool from "../database.js";

export const getDatos = async(req,res) =>{
    try {
        const[Datos] =await pool.query('select * from datospersonales')
        res.status(201).json(Datos);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getDatosId = async(req, res)=>{
    const {id}=req.params;
    try {
        const [datos] = await pool.query('select * from datospersonales where id=?', [id]);
        const datosId =datos[0];
        res.status(201).json(datosId);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const postDatos = async (req, res) => {
    const { Nombre, ApellidoP, ApellidoM, Direccion, EstadoC, Fechnac } = req.body;

    if (!Nombre || !ApellidoP || !ApellidoM || !Direccion || !EstadoC || !Fechnac) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const campos = {Nombre,ApellidoP,ApellidoM,Direccion,EstadoC,Fechnac,
            afiliador: false // Establece afiliador a false por defecto
        };
        const [datosPost] = await pool.query('INSERT INTO datospersonales SET ?', [campos]);
        // res.status(201).json(datosPost); Respuesta correcta
        res.status(201).json({ message: 'Datos creados correctamente'});
    } catch (error) {
        res.status(500).json({ message: error.message }); // Respuesta en caso de error
    }
}

export const putDatos = async (req, res)=>{
    const {id}=req.params;
    const { Nombre, ApellidoP, ApellidoM, Direccion, EstadoC, Fechnac } = req.body;

    if (!Nombre || !ApellidoP || !ApellidoM || !Direccion || !EstadoC || !Fechnac) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const campos = {Nombre,ApellidoP,ApellidoM,Direccion,EstadoC,Fechnac,
            afiliador: false // Establece afiliador a false por defecto
        };
        const [result] = await pool.query('UPDATE datospersonales SET ? WHERE Id = ?', [campos,id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Datos no encontrados' });
        }
        // res.status(201).json(datosPost); Respuesta correcta
        res.status(201).json({ message: 'Datos editados correctamente'});
    } catch (error) {
        res.status(500).json({ message: error.message }); // Respuesta en caso de error
    }
}

export const deleteDatos = async(req, res)=>{
    try {
        const {id} = req.params;
        const [result] = await pool.query('DELETE FROM datospersonales where id=?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para eliminar' });
        }

        res.status(200).json({message:'usuario eliminado con id:',id});
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const AfiliadorEdit = async (req, res) => {
    const { id } = req.params;

    try {
        // Actualiza el campo 'afiliador' a true
        const [result] = await pool.query('UPDATE datospersonales SET Afiliador = true WHERE Id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Datos no encontrados' });
        }
        
        res.status(200).json({ message: 'Datos editados correctamente' }); // Código 200 para éxito
    } catch (error) {
        res.status(500).json({ message: error.message }); // Respuesta en caso de error
    }
}

