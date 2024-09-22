import pool from "../database.js";

export const postUsuario = async(req, res)=>{
    const { DNI, Contraseña } = req.body;

    if (!DNI|| !Contraseña) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const newUsuario = {DNI,Contraseña};
        await pool.query('INSERT INTO usuario SET ?',[newUsuario]);
        res.status(201).json({ message: 'usuario creado', newUsuario });
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getUsuario = async(req,res)=>{
    try {
        const[result] = await pool.query('select * from  Usuario')
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const getUsuarioId = async(req, res)=>{
    try {
        const {id} = req.params;
        const [usuario] =await pool.query('SELECT DNI FROM usuario where id=?', [id]);
        const usuarioedit = usuario[0];
        res.status(200).json(usuarioedit);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

export const editUsuarioId = async (req, res) => {
    const { id } = req.params;
    const { DNI, Contraseña } = req.body;

    if (!DNI|| !Contraseña) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
        const editUsuario = {DNI, Contraseña};
        const result = await pool.query('UPDATE Usuario SET ? WHERE Id = ?', [editUsuario, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
        }

        res.status(200).json({ message: 'Usuario actualizado correctamente', usuario: editUsuario });
    } catch (error) {
        console.error(error); 
        res.status(500).json({ message: error.message });
    }
}

export const deleteUsuario = async(req, res)=>{
    try {
        const {id} = req.params;
        const [result] = await pool.query('DELETE FROM usuario where id=?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
        }

        res.status(200).json({message:'usuario eliminado con id:',id});
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}