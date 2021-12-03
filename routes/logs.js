require('dotenv').config();
const { response } = require('express');
const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();

const { validarJWT } = require('../middlewares/validar-jwt');
const pool = require('../database/config');


router.get("/logs/all", validarJWT, async (req, res) => {
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

module.exports = router;