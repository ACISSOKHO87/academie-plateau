const jwt = require("jsonwebtoken");
const secret = "fCplaTeauFrom45°C"  // necessaire pour le token

const withAuth = (req, res, next) => {
  const token = req.headers["x-access-token"];
    jwt.verify(token, secret, (err, decode) => {

        if (err) {
            res.json({ status: 401, err: err });
        } else {
            req.key_id = decode.key_id;
            req.email = decode.email;
            next();
        }
    });
};

module.exports = withAuth;
