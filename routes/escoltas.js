require('dotenv').config();
const { response } = require('express');
const moment = require('moment');
const express = require("express");
const router = express.Router();

const pool = require('../database/config');


router.post("/crearEscolta", async (req, res) => {
    const {idvecino, direccion, modalidad} = req.body;
    let terminar = false;
    const aux = await pool.query('SELECT estado FROM escolta WHERE vecino_idvecino = ($1)', [idvecino]);
    aux.rows.map(fila => {
        if (fila.estado === 'activa' || fila.estado === 'confirmada') {
            terminar = true;
        }
    });
    if (terminar) { // No agregamos la alarma debido a que ya hay una sin terminar
        res.send({
            code: 400,
            msg: "Ya hay una escolta activa",
        });
    }
    else{
        pool.query('INSERT INTO escolta (vecino_idvecino, fecha, estado, direccion, modalidad) VALUES ($1, $2, $3, $4, $5)', [idvecino , moment().format("YYYY-MM-DD HH:mm:ss"), 'activa', direccion, modalidad],async (err, rows) => {
            if (!err) {
                res.send({
                    code: 200,
                    message: "Escolta nueva ingresada exitosamente",
                });
                console.log("Escolta nueva ingresada exitosamente");
                console.log(rows);
            } else {
                res.send({
                    code: 400,
                    msg: "Hable con el administrador",
                });
                console.log(err);
            }
        });
    }
});

router.get("/getEscoltas", async (req, res) => {
    pool.query('SELECT escolta.*, vecino.telefono FROM escolta, vecino WHERE escolta.vecino_idvecino = vecino.idvecino AND (escolta.estado = ($1) OR escolta.estado = ($2)) ORDER BY escolta.idescolta', ['activa', 'confirmada'],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "escoltas activas y confirmadas retornadas exitosamente",
                rows
            });
            console.log("escoltas activas y confirmadas retornadas exitosamente");
            console.log(rows);
        } else {
            res.send({
                code: 400,
                msg: "Hable con el administrador",
            });
            console.log(err);
        }
    });
});

router.get("/getHistEscoltas", async (req, res) => {
    pool.query('SELECT escolta.*, vecino.telefono FROM escolta, vecino WHERE escolta.vecino_idvecino = vecino.idvecino AND (escolta.estado = ($1)) ORDER BY escolta.idescolta', ['terminada'],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "escoltas terminadas retornadas exitosamente",
                rows
            });
            console.log("escoltas terminadas retornadas exitosamente");
            console.log(rows);
        } else {
            res.send({
                code: 400,
                msg: "Hable con el administrador",
            });
            console.log(err);
        }
    });
});

router.post("/confirmarEscolta", async (req, res) => {
    const { idguardia, idescolta } = req.body;
    pool.query('UPDATE escolta SET guardia_idguardia = ($1), estado = ($2) WHERE idescolta = ($3)', [idguardia, 'confirmada', idescolta],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "escolta confirmada exitosamente",
            });
            console.log("escolta confirmada exitosamente");
            console.log(rows);
        } else {
            res.send({
                code: 400,
                msg: "Hable con el administrador",
            });
            console.log(err);
        }
    });
});

router.post("/terminarEscolta", async (req, res) => {
    const { idescolta } = req.body;
    pool.query('UPDATE escolta SET estado = ($1) WHERE idescolta = ($2)', ['terminada', idescolta],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "escolta terminada exitosamente",
            });
            console.log("escolta terminada exitosamente");
            console.log(rows);
        } else {
            res.send({
                code: 400,
                msg: "Hable con el administrador",
            });
            console.log(err);
        }
    });
});

router.post("/cancelarEscolta", async (req, res) => {
    const { idescolta } = req.body;
    pool.query('UPDATE escolta SET estado = ($1) WHERE idescolta = ($2)', ['cancelada', idescolta],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "escolta cancelada exitosamente",
            });
            console.log("escolta cancelada exitosamente");
            console.log(rows);
        } else {
            res.send({
                code: 400,
                msg: "Hable con el administrador",
            });
            console.log(err);
        }
    });
});

router.get("/Escolta/:idvecino", async (req, res) => {
    const {idvecino} = req.params;
    pool.query('SELECT * FROM escolta WHERE vecino_idvecino = $1', [idvecino],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "escoltas retornadas exitosamente",
                rows
            });
            console.log("escoltas retornadas exitosamente");
            console.log(rows);
        } else {
            res.send({
                code: 400,
                msg: "Hable con el administrador",
            });
            console.log(err);
        }
    });
});

module.exports = router;