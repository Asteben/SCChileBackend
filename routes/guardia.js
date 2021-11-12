require('dotenv').config();
const { response } = require('express');
const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();

const pool = require('../database/config');

router.post("/guardia/actualizar", async (req, res) => {
    const { direccion, telefono, idvecino} = req.body;
    pool.query('UPDATE vecino SET direccion = $1, telefono = $2 WHERE idguardia = $3',[direccion, telefono, idvecino],async (err, rows) => {
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

router.get("/guardia/all", async (req, res) => {
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

router.delete("/guardia/:idguardia", async (req, res) => {
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

module.exports = router;