require('dotenv').config();
const { response } = require('express');
const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();

const pool = require('../database/config');

router.post("/vecino/nuevo", async (req, res) => {
    const {idvecino, direccion, telefono, password} = req.body;
    const salt = bcrypt.genSaltSync();
    const passwordHash = bcrypt.hashSync(password, salt);
    pool.query('INSERT INTO vecino (idvecino, direccion, telefono, password, estado) VALUES ($1, $2, $3, $4, $5)', [idvecino, direccion, telefono, passwordHash, 'activo'], async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "Vecino nuevo ingresado exitosamente",
            });
            console.log("Vecino nuevo ingresado exitosamente");
            console.log(rows);
        } else {
            res.send({
                code: 400,
                msg: "Vecino ya existe",
            });
            console.log(err);
        }
    });
});

router.post("/vecino/actualizar", async (req, res) => {
    const { direccion, telefono, idvecino} = req.body;
    pool.query('UPDATE vecino SET direccion = $1, telefono = $2 WHERE idvecino = $3',[direccion, telefono, idvecino],async (err, rows) => {
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

router.get("/vecino/all", async (req, res) => {
    pool.query('SELECT * FROM vecino',async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "Vecinos retornados exitosamente",
                rows
            });
            console.log("Vecinos retornados exitosamente");
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

router.get("/vecino/:idvecino", async (req, res) => {
    const {idvecino} = req.params;
    pool.query('SELECT * FROM vecino WHERE idvecino = $1', [idvecino],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "Vecino retornado exitosamente",
                rows
            });
            console.log("Vecino retornado exitosamente");
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

router.delete("/vecino/:idvecino", async (req, res) => {
    const {idvecino} = req.params;
    pool.query("DELETE FROM vecino WHERE idvecino = $1", [idvecino], async (err, rows) => {
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

router.post("/vecino/actualizar/password", async (req, res) => {
    const { antiguaPassword, nuevaPassword, confirmarPassword, idvecino } = req.body;
    if (nuevaPassword !== confirmarPassword) {
        res.send({
            code: 400,
            message: "Contraseñas no coinciden",
        });
        console.log("Contraseñas no coinciden");
    }
    else {
        const password = await pool.query('SELECT password FROM vecino WHERE idvecino = ($1)', [idvecino]);
        const validarAntiguaPassword = bcrypt.compareSync(antiguaPassword, password.rows[0].password);
        if (!validarAntiguaPassword) {
            res.send({
                code: 400,
                message: "Contraseña incorrecta",
            });
            console.log("Contraseña incorrecta");
        }
        else{
            const salt = bcrypt.genSaltSync();
            const passwordHash = bcrypt.hashSync(nuevaPassword, salt);
            pool.query('UPDATE vecino SET password = ($1) WHERE idvecino = ($2)', [passwordHash, idvecino], async (err, rows) => {
                if (!err) {
                  res.send({
                    code: 200,
                    message: "Contraseña modificada exitosamente",
                  });
                } else {
                  res.send({
                    code: 400,
                    msg: "un error ha ocurrido",
                  });
                  console.log(err);
                }
            })
        }
    }
    
});
module.exports = router;