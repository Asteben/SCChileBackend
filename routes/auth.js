require('dotenv').config();
const { response } = require('express');
const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();

const { generarJWT } = require('../helpers/jwt');
const { validarJWT } = require('../middlewares/validar-jwt');

const pool = require('../database/config');

router.post('/',async (req, res = response) => {
    const { id, password } = req.body;
    try {
        // Validar que el ID exista
        const validarid =  await pool.query('SELECT idguardia FROM guardia WHERE idguardia = ($1)', [id]);
        console.log(validarid)
        if (!validarid.rowCount) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario y/o contraseña incorrectos'
            });
        }
        // Confirmamos las contraseñas
        const passwordHash = await pool.query('SELECT password FROM guardia WHERE idguardia = ($1)', [id]);
        if (passwordHash.rowCount) { // Se encontro el passwordHash
            const validarPassword = bcrypt.compareSync(password, passwordHash.rows[0].password);
            if (!validarPassword) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Usuario y/o contraseña incorrectos a'
                });
            }
        }
        // Generar JWT
        const token = await generarJWT(id);
        return res.status(200).json({
            ok: true,
            id,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
});

router.post('/loginVecino', async (req, res = response) => {
    const { id, password } = req.body;
    try {
        // Validamos que el ID del vecino exista
        const validarID = await pool.query('SELECT idvecino FROM vecino WHERE idvecino = ($1)', [id]);
        if (!validarID.rowCount) { // NO EXISTE
            return res.status(200).json({
                ok: true,
                msg: 'Usuario y/o contraseña incorrectos'
            });
        }
        // Confirmamos las passwords
        const passwordHash =  await pool.query('SELECT password FROM vecino WHERE idvecino = ($1)', [id]);
        const validarPassword = bcrypt.compareSync(password, passwordHash.rows[0].password);
        if (!validarPassword) { // NO COINCIDEN LAS CREDENCIALES
            return res.status(200).json({
                ok: false,
                msg: 'Usuario y/o contraseña incorrectos'
            });
        }
        // Generar JWT
        const token = await generarJWT(id);
        return res.status(200).json({
            ok: true,
            id,
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
});

router.get('/renew', validarJWT, async (req, res = response) => {
    const { id } = req;
    // Generar JWT
    const token = await generarJWT(id);
    return res.json({
        ok: true,
        id,
        token
    });
});
module.exports = router;