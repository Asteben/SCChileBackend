require('dotenv').config();
const { response } = require('express');

const { dbConecction } = require('../database/config');

const crearSolicitudEscolta = async (req, res = response) => {
    try {
        // Creamos la conexion a la BDD
        const pool = await dbConecction();
        // EXTRAER ID DEL TOKEN PARA EVITAR FALSIFICACION DE DATOS
        const { id } = req;
        // Primero vemos que no exista una solicitud activa de escolta del vecino
        const verificarExistencia = await pool.query('SELECT id_veci, estado FROM alarma WHERE id_veci = ($1)', [id]);

        return res.status(200).json({
            ok: true,
            id,
            msg: 'Solicitud de escolta creada'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};

const getAllSoliEscolta = async (req, res = response) => {
    try {
        // Creamos la conexion a la BDD
        const pool = await dbConecction();
        //modificar query para escoltas.
        const query = '';
        const data = await pool.query(query)
            .then(res => {
                const rows = res.rows;
                return rows;
            })
            .catch(err => {
                console.log(err);
            });
        return res.status(200).json({
            ok: true,
            data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
};


module.exports = {
    crearSolicitudEscolta,
    getAllSoliEscolta
};