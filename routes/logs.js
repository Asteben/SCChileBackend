require('dotenv').config();
const { response } = require('express');
const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();

const pool = require('../database/config');


router.get("/logs/all", async (req, res) => {
    pool.query('SELECT * FROM logs',async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "logs retornados exitosamente",
                rows
            });
            console.log("logs retornados exitosamente");
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

router.post("/logs/nuevo", async (req, res) => {
    const {idguardia} = req.body;
    pool.query('INSERT INTO logs (guardia_idguardia, fecha, nombre) VALUES ($1, $2, (SELECT nombre FROM guardia WHEN idguardua = $1) )', [idguardia, moment().format("YYYY-MM-DD HH:mm:ss")], async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "Guardia nuevo ingresado exitosamente",
            });
            console.log("Guardia nuevo ingresado exitosamente");
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