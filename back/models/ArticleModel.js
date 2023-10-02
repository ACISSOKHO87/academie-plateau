module.exports = (_db) =>{
    db= _db
    return ArticleModel
}

/*
@title: itre de l'article
@contents: contenu (description) de l'article
@user_key: reférence (ou clé) de l'admin ayant ajouté l'article
@online: permet de savoir si l'article est en ligne ou pas
*/
class ArticleModel {

    //methode de souvegarde d'un article
    static saveOneArticle(req){
        let sql = "INSERT INTO articles (title, contents, user_key, online, creationTimestamp) VALUES (?, ?, ?, ?, NOW())"
        return db.query(sql, [req.body.title, req.body.contents, req.body.user_key, req.body.online])
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }

    //methode de modifier un article 
    static updateOneArticle(req, id){
        let sql = "UPDATE articles SET title= ?, contents= ?, online= ? WHERE id = ?"
        return db.query(sql, [req.body.title, req.body.contents, req.body.online, id])
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }

    // methode de récupération de tous les articles
    static getAllArticles(){
        let sql = "SELECT * FROM articles ORDER BY creationTimestamp DESC"
        return db.query(sql)
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }

    // methode de récupération d'un article par son id
    static getOneArticleById(id) {
        let sql = "SELECT * FROM articles WHERE id = ?"
        return db.query(sql, [id])
            .then((res) => {
                return res
            })
            .catch((err) =>{
                return err
            })
    }

    //methode de supréssion d'un article à partir de son id
    static deleteOneArticle(id){
        let sql = "DELETE FROM articles WHERE id= ?"
        return db.query(sql, [id])
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }

}