const bcrypt = require("bcryptjs")  // librairie pour le cryptage du mode passe
const saltRounds = process.env.SALT_ROUNDS; // le nombre de fois que le mot de passe sera crypter

let randomId = require("random-id") // librairie pour la génération d'id aléatoire
let len = 20; // la taille de 'id aléatoire
let pattern = "aA0"; // qui definit les elements de l'id qui sera composé de lettes miniuscule, majuscule et de chiffre

module.exports = (_db) => {
    db = _db;
    return UserModel;
}

/********************** Les utilisateurs (user) sont les administrateurs avec des grades ****************/
/*
@firstName: Prenom 
@lastName: Nom 
@email: adresse email 
@password: mot de passe
@grade: grade de l'administeur qui permet de définir les actions qu'il peut effectuer
@key_id: clé aléatoire suplémentaire pour plus de sécurité
@validate: prend deux valeurs: "no": à la création du compte par l'admin principale, "yes": lorsque le nouveau admin aura modifié son mot de passe à la première connexion.
@access: "allow" ou "denied", il permet de desactiver le compte de admin si ce dernier ne travaille plus pour l'academie
*/

class UserModel {

    // methode de sauvegarde d'un utilisateur (administrateur)
    static async saveOneUser(req) {
        let sql = "INSERT INTO users (firstName, lastName, email, password, grade, key_id, validate, access, creationTimestamp) VALUES (?, ?, ?, ?, ?, ?, 'no', 'allow', NOW())"
        return await bcrypt.hash(req.body.password, saltRounds)
            .then((hash) =>{
                // on génére un clé aléatoire 
                let keyId = randomId(len, pattern)
                return db.query(sql, [req.body.firstName, req.body.lastName, req.body.email, hash, req.body.grade, keyId])
                    .then((res) =>{
                        res.key_id = keyId
                        return res
                    })
                    .catch((err) =>{
                        return err
                    })
            })
    }

    // methode de modification du mot de passe de l'utilisateur
    static async updateUserPassword(newPassword, key_id){
        let sql = "UPDATE users SET password=?, validate=? WHERE key_id=?"
	    return await bcrypt.hash(newPassword, saltRounds)
            .then((hash) => {
			    return db.query(sql, [hash, "yes", key_id])
			    	.then((res) =>{
			    		return res
			    	})
			    	.catch((err) =>{
			    		return err
			    	})
            })
            .catch(err=>console.log(err))
	}

    // methode de modification de la grade de l'administrateur
    static async updateUserGrade(newGrade, key_id) {
        let sql = "UPDATE users SET grade = ? WHERE key_id = ?"
        return db.query(sql, [newGrade, key_id])
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }

     // methode qui permet de desactiver le compte de l'administrateur
     static updateUserAccess(key_id) {
        let sql = "UPDATE users SET access = ? WHERE key_id = ?"
        return db.query(sql, ["denied", key_id])
            .then((res)=> {
                return res
            })
            .catch((err) =>{
                return err
            })
    }

    // methode de récupération de tous les utlisateur
    static getAllUsers = () => {
        let sql = "SELECT * FROM users "
        return db.query(sql)
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }

    // methode de recuperation du user par son key_id
    static getUserByKeyId(key_id){
        let sql = "SELECT * FROM users WHERE key_id = ?"
        return db.query(sql, [key_id])
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }

    // methode de recherche d'un utilisateur par son email
    static getUserByEmail(email){
        let sql = "SELECT * FROM users WHERE email = ?"
        return db.query(sql, [email])
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }
}