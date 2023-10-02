const bcrypt = require('bcryptjs');  // librairie pour le cryptage et decryptage du mot de pass
const jwt = require('jsonwebtoken'); // librairie pour la génération du web token pour l'authentification du l'utilisateur
const mail = require('../lib/mailing');  
const checkCode = require('../checkCode');

module.exports = (app, db, secret) => {

    const userModel = require('../models/UserModel')(db); // on instancie le userModel

    // route de souvegarde d'un utlisateur 
    app.post("/api/v1/user/save", async(req, res, next) =>{
        // on verifie si l'utilisateur  a saisi un email
        if(req.body.email === ""){
            res.json({status: 404, msg: "Veuillez saisir un email valide s'il vous plaît!"})
        }
        // on verifie si l'email saisi par l'utilisateur n'existe pas dans la BBD
        let email = await userModel.getUserByEmail(req.body.email)
        if(email.code){ // si la base de donnée nous retourne une erreur
            res.json({status: 500, msg: "Soucis technique, veuiller reéssayer plutard... "})
        } else if(email.length > 0){
            res.json({status: 200, msg: "L'email existe déjà. Veuillez vous connecter "})
        } else {
            let user = await userModel.saveOneUser(req)
            if(user.code){
                res.json({status: 500, user: user, msg: "Soucis technique, veuiller reéssayer plutard... "})
            }
            res.json({status: 200, msg: "user enregistré avec succès"})
        }
    })

    // route de login (connexion )
    app.post("/api/v1/user/login", async(req, res, next) =>{
        //  on vérifie si l'utilisateur a saisi un email
        if(req.body.email ===""){
            res.json({status: 404, msg: "Veuillez saisir un email valide s'il vous plaît!"})
        }
        let user = await userModel.getUserByEmail(req.body.email)
        if(user.code){
            res.json({status: 500, msg: "Soucis technique, veuiller reéssayer plutard... "})
        } else if (user.length === 0){
            res.json({status:404, msg: "Votre email n'existe pas, veuillez vous enregistrer !"})
        } else {
            let same = bcrypt.compare(req.body.password, user[0].password)
            if(same){
                let payload = {key_id: user[0].key_id, email: user[0].email}
                let token = jwt.sign(payload, secret)
                res.json({status: 200, msg: "connecté", token: token, user: user[0]})
            } else {
                res.json({status: 404, msg: "Votre mode passe est invalide, veuiller réessayer"})
            }
        }
    })

    //route de demande de récupération de mot de pass oublié
    app.post('/api/v1/user/forgot', async (req, res, next)=>{
        let check = await userModel.getUserByEmail(req.body.email)
        if(check.code){
            res.json({status: 500, err: check})
        } else {    
            if(check.length === 0){
                res.json({status: 404, msg: "Utilisateur innexistant!"})
            } else {
                let payload = {key_id: check[0].key_id, code: req.body.digitCode}
                let token = jwt.sign(payload, secret,  {expiresIn: '3h'})
                // on envoi un mail avec un code de redefinition de mdp qui 
                // envoie du mail de modification de mot de passe
                mail(
                    req.body.email,
                    "Changement de mot de passe",
                    "Mot de passe oublié ?",
                    `Voici le code de vérification de votre mail: <strong>${req.body.digitCode}</strong>`
                )
                res.json({status: 200, msg: "Email envoyé", token: token})
            }
        }
    })

    // route de modification du mot de passe
    app.put("/api/v1/user/password/update", checkCode, async (req, res, next) =>{
        let key_id = req.key_id
        let code = req.code
        // on vérifie si le code fourni est valide
        if(code !== req.body.code)
        //on check si les deux mots de passes rentrés sont les même
        if(req.body.password1 !== req.body.password2){
            res.json({status: 404, msg: "Vos deux mots de passes ne sont pas identiques"})
        } else {
            let password = await userModel.updateUserPassword(req.body.password1, key_id)
            if(password.code) {
                res.json({status: 500, msg: "Impossible de modifier le mot de passe", error: password})
            } 
            res.json({status: 200, msg: "Le mot de passe modifié ! Vous allez être rediriger vers pa page de login"})
        }
    })

    // route de modification de la grade de l'administrateur
    app.put("/api/v1/user/grade/:key_id", async(req, res, next) => {
        let key_id = req.params.key_id;
        let grade = await userModel.updateUserGrade(req.body.grade, key_id)
        if(grade.code) {
            res.json({status: 500, msg: "Impossible de modifier la grade de l'administrateur", error: grade})
        }
        res.json({status: 200, msg: "La grade de l'administrateur a été modifié avec succès"})
    })

    // route pour desactiver le compte de l'administrateur
    app.put("/api/v1/user/access/:key_id", async(req, res, next) =>{
        let key_id = req.params.key_id
        let access = await userModel.updateUserAccess(key_id)
        if(access.code){
            res.json({status: 500, msg: "soucis technique lors de  l'ajout à la blackList", error: access})
        }
        res.json({status: 200, msg: "L'utilisateur ajoué avec succés dans la BlackList"})
    })

    // route de recuperation de tous les utilisateur
    app.get("/api/v1/user/all", async(req, res, next)=>{
        let users = await userModel.getAllUsers()
        if(users.code){
            res.json({status: 500, msg: "Soucis de back-end", error: users})
        }
        res.json({status: 200, users: users})
    })

    // route de recuperation d'un utlisateur par son key_id
    app.get("/api/v1/user/ByKeyId/:key_id", async(req, res, next) =>{
        let key_id = req.params.key_id
        let user = await userModel.getUserByKeyId(key_id)
        if(user.code){
            res.json({status: 500, msg: "Soucis de back-end", error: user})
        }
        res.json({status: 200, user: user[0]})
    })

    //route pour envoie du mail du contact
    app.post('/api/v1/user/contact', async (req, res, next)=>{
        mail(
            "academyfc.plateau@gmail.com ",
            "Contact : " + req.body.title,
            req.body.subject,
            req.body.message
        )
        res.json({status: 200, msg: "Email envoyé"})
    })
}