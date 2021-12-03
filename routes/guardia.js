require('dotenv').config();
const { response } = require('express');
const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();

const { validarJWT } = require('../middlewares/validar-jwt');
const pool = require('../database/config');

router.post("/guardia/actualizar", validarJWT, async (req, res) => {
    const { direccion, telefono, rut, idvecino} = req.body;
    pool.query('UPDATE vecino SET direccion = $1, telefono = $2, rut = $3 WHERE idguardia = $3',[direccion, telefono, rut, idvecino],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "Vecino actualizado exitosamente",
            });
            console.log("Vecino actualizado exitosamente");
            console.log(rows);
        } else {
            res.send({
                code: 400,
                msg: "Vecino no existe",
            });
            console.log(err);
        }
    });
});

router.get("/guardia/all", validarJWT , async (req, res) => {
    pool.query('SELECT * FROM guardia',async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "guardias retornados exitosamente",
                rows
            });
            console.log("guardias retornados exitosamente");
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

router.delete("/guardia/:idguardia", validarJWT, async (req, res) => {
    const idguardia = req.params;
    pool.query("DELETE FROM guardia WHERE idguardia = $1", [idvecino], async (err, rows) => {
      if (!err) {
        res.send({
          code: 200,
          message: "Vecino eliminado exitosamente",
        });
      } else {
        res.send({
          code: 400,
          msg: "un error ha ocurrido",
        });
        console.log(err);
      }
    });
});

router.post("/guardia/nuevo", validarJWT, async (req, res) => {
    const {idguardia, nombre, email, password, rut, tipo} = req.body;
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);
    pool.query('INSERT INTO guardia (idguardia, nombre, email, password, rut, tipo) VALUES ($1, $2, $3, $4, $5, $6)', [idguardia, nombre, email, passwordHash, rut, tipo], async (err, rows) => {
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