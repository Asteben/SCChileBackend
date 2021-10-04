const jwt = require('jsonwebtoken');

const generarJWT = (id, tipo) => {
    return new Promise((resolve, reject) => {
        const payload = { id, tipo }
        jwt.sign(payload, 'PaLaBRa-MagiCA-SECReT@-tiCS2', {
            expiresIn: '2h'
        }, (err, token) => {
            if (err) {
                console.log(err);
                reject('No se pude generar el token');
            }
            resolve(token);
        });
    });
};

module.exports = {
    generarJWT
};