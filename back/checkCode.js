const jwt = require("jsonwebtoken");
const secret = process.env.SECRET  // necessaire pour le token

const checkCode = (req, res, next) => {
  const token = req.headers["x-access-token"];
    jwt.verify(token, secret, (err, decode) => {

        if (err) {
            res.json({ status: 401, err: err });
        } else {
            req.key_id = decode.key_id;
            req.code = decode.code;
            next();
        }
    });
};

module.exports = checkCode;
