require('dotenv').config();
const { response } = require('express');
const bcrypt = require('bcryptjs');
const express = require("express");
const router = express.Router();

const { validarJWT } = require('../middlewares/validar-jwt');
const pool = require('../database/config');

router.post("/contacto/nuevo", validarJWT, async (req, res) => {
    const {idvecino, nombre, telefono} = req.body;
    let aux2 = 0;
    const aux = await pool.query('SELECT telefono FROM contacto WHERE telefono = ($1)', [telefono]);
    console.log(aux.rowCount)
    if (!aux.rowCount){
        pool.query("INSERT INTO contacto (nombre, telefono) VALUES ($1, $2);", [nombre, telefono], async (err, rows) => {
            if (!err) {
                console.log("Contacto nuevo ingresado exitosamente");
                console.log(rows);
            } else {
                res.send({
                    code: 400,
                    msg: "Hable con el administrador",
                });
                console.log(err);
                aux2 = 1;
            }
        });
    }
    const aux3 = await pool.query('SELECT contacto_telefono FROM vecino_contacto WHERE contacto_telefono = ($1) and vecino_idvecino = ($2)', [telefono, idvecino]);
    if(aux2 === 0 && !aux3.rowCount){
        pool.query("INSERT INTO vecino_contacto (vecino_idvecino, contacto_telefono) VALUES ($1, $2);", [idvecino, telefono], async (err, rows) => {
            if (!err) {
                res.send({
                    code: 200,
                    message: "Contacto nuevo ingresado exitosamente para vecino",
                });
                console.log("Contacto nuevo ingresado exitosamente para vecino");
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
    else{
        res.send({
            code: 400,
            msg: "Hable con el administrador ",
        });    
    }
});

router.post("/contacto/actualizar", validarJWT, async (req, res) => {
    const {telefono, nombre, telefononuevo} = req.body;
    pool.query('UPDATE contacto SET telefono = $1, nombre = $2 WHERE telefono = $3',[telefononuevo, nombre, telefono],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "contacto actualizado exitosamente",
            });
            console.log("contacto actualizado exitosamente");
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

router.get("/contacto/:idvecino", validarJWT, async (req, res) => {
    const {idvecino} = req.params;
    pool.query('SELECT contacto.nombre, contacto.telefono FROM contacto INNER JOIN vecino_contacto ON contacto.telefono = vecino_contacto.contacto_telefono WHERE vecino_contacto.vecino_idvecino = $1', [idvecino],async (err, rows) => {
        if (!err) {
            res.send({
                code: 200,
                message: "contactos retornados exitosamente",
                rows
            });
            console.log("contactos retornados exitosamente");
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

router.delete("/contacto/:telefono", validarJWT, async (req, res) => {
    const {telefono} = req.params;
    pool.query("DELETE FROM contacto WHERE telefono = $1", [telefono], async (err, rows) => {
      if (!err) {
        res.send({
          code: 200,
          message: "contacto eliminado exitosamente",
        });
        console.log("contacto eliminado exitosamente");
      } else {
        res.send({
          code: 400,
          msg: "un error ha ocurrido",
        });
        console.log(err);
        console.log("un error a ocurrido");
      }
    });
});

module.exports = router;