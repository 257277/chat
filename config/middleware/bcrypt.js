const bcrypt = require('bcrypt');

const hashing = (req, res, next) => {
    try {
        bcrypt.hash(req.body.password, 5, function (err, hash) {
            if (err) {
                res.send(err);
            }
            else {
                req.body.password = hash;
                next();
            }
        });
    }
    catch (err) {
        res.send(err);
    }
}

module.exports = {
    hashing
}