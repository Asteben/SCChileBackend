const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {
    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token'
        });
    }
    try {
        const { id } = jwt.verify(token, 'PaLaBRa-MagiCA-SECReT@-tiCS2');
        req.id = id;
    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
    next();
};

module.exports = {
    validarJWT
};