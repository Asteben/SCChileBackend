require('dotenv').config();
const { response } = require('express');
const moment = require('moment');
const express = require("express");
const router = express.Router();

const pool = require('../database/config');


router.post("/crearAlarma", async (req, res) => {
    const idvecino = req.body.idvecino;
    let terminar = false;
    const aux = await pool.query('SELECT estado FROM alarma WHERE vecino_idvecino = ($1)', [idvecino]);
    aux.rows.map(fila => {
        if (fila.estado === 'activa' || fila.estado === 'confirmada') {
            terminar = true;
        }
    });
    if (terminar) { // No agregamos la alarma debido a que ya hay una sin terminar
        res.send({
            code: 400,
            msg: "Ya hay una alarma activa",
        });
    }
    else{
        pool.query('INSERT INTO alarma (vecino_idvecino, fecha, estado) VALUES ($1, $2, $3)', [idvecino , moment().format("YYYY-MM-DD HH:mm:ss"), 'activa'],async (err, rows) => {
            if (!err) {
                res.send({
                    code: 200,
                    message: "Alarma nueva ingresada exitosamente",
                });
                console.log("Alarma nueva ingresada exitosamente");
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

router.get("/getAlarmas", async (req, res) => {
    pool.query('SELECT alarma.*, vecino.telefono FROM alarma, vecino WHERE alarma.vecino_idvecino = vecino.idvecino AND (alarma.estado = ($1) OR alarma.estado = ($2)) ORDER BY alarma.idalarma', ['activa', 'confirmada'],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "Alarmas activas y confirmadas retornadas exitosamente",
                rows
            });
            console.log("Alarmas activas y confirmadas retornadas exitosamente");
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

router.get("/getHistAlarm", async (req, res) => {
    pool.query('SELECT alarma.*, vecino.telefono FROM alarma, vecino WHERE alarma.vecino_idvecino = vecino.idvecino AND (alarma.estado = ($1)) ORDER BY alarma.idalarma', ['terminada'],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "Alarmas terminadas retornadas exitosamente",
                rows
            });
            console.log("Alarmas terminadas retornadas exitosamente");
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

router.post("/confirmarAlarma", async (req, res) => {
    const { idguardia, idalarma } = req.body;
    pool.query('UPDATE alarma SET guardia_idguardia = ($1), estado = ($2) WHERE idalarma = ($3)', [idguardia, 'confirmada', idalarma],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "Alarma confirmada exitosamente",
            });
            console.log("Alarma confirmada exitosamente");
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

router.post("/terminarAlarma", async (req, res) => {
    const { idalarma, comentario } = req.body;
    pool.query('UPDATE alarma SET estado = ($1), comentario = ($2) WHERE idalarma = ($3)', ['terminada', comentario, idalarma],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "Alarma terminada exitosamente",
            });
            console.log("Alarma terminada exitosamente");
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

router.post("/cancelarAlarma", async (req, res) => {
    const { idalarma } = req.body;
    pool.query('UPDATE alarma SET estado = ($1) WHERE idalarma = ($2)', ['cancelada', idalarma],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "alarma cancelada exitosamente",
            });
            console.log("alarma cancelada exitosamente");
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

router.get("/Alarma/:idvecino", async (req, res) => {
    const {idvecino} = req.params;
    pool.query('SELECT * FROM alarma WHERE vecino_idvecino = $1', [idvecino],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "alarmas retornadas exitosamente",
                rows
            });
            console.log("alarmas retornadas exitosamente");
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