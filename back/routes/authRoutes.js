const withAuth = require('../withAuth');

module.exports = (app, db, secret)=>{
    const userModel = require('../models/UserModel')(db); // on instancie le userModel
    //route d'authentification d'un utilisateur
    app.get('/api/v1/checkToken', withAuth, async (req, res, next) => {
        let user = await userModel.getUserByEmail(req.email)
        if(user.code){
            res.json({status: 500, err: user})
        } else {
            res.json({status: 200, msg: "Token valide", user: user[0]})
        }
    })
    
}