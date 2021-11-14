require('dotenv').config();
const { response } = require('express');
const moment = require('moment');
const express = require("express");
const router = express.Router();

const pool = require('../database/config');


router.post("/crearHito", async (req, res) => {
    const {idalarma, texto} = req.body;
    pool.query('INSERT INTO hito (alarma_idalarma, fecha, texto) VALUES ($1, $2, $3)', [idalarma , moment().format("YYYY-MM-DD HH:mm:ss"), texto],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "Hito nuevo ingresado exitosamente",
            });
            console.log("Hito nuevo ingresado exitosamente");
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

router.get("/getHitos", async (req, res) => {
    pool.query('SELECT * FROM hito',async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "Hitos retornados exitosamente",
                rows
            });
            console.log("Hitos retornados exitosamente");
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


router.get("/Hitos/:idalarma", async (req, res) => {
    const {idalarma} = req.params;
    pool.query('SELECT * FROM hito WHERE alarma_idalarma = $1', [idalarma],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "Hitos retornados exitosamente",
                rows
            });
            console.log("Hitos retornados exitosamente");
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