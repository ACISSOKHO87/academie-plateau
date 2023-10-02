module.exports = (_db) =>{
    db= _db
    return MediaModel
}

/*
@name: titre (nom) de l'image
@url: l'url de l'image au format 'ANNEE-MOIS/image_name'
@article_id: l'id de l'article auquel appartient l'image  
*/
class MediaModel {

    // methode de sauvegarde d'un média (image)
    static saveOneMedia(req) {
        let sql = "INSERT INTO medias (name, url, type, article_id, creationTimestamp) VALUES (?, ?, ?, ?, NOW() )"
        let articleId = 0; // on initialise l'article id à 0 
        return db.query(sql, [req.body.name, req.body.url, req.body.type, articleId])
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }

    // methode de récupération des médias 
    static getAllMedia() {
        let sql = "SELECT * FROM medias"
        return db.query(sql)
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }

    // methode de récupération d'un média par son ID
    static getMediaById(id) {
        let sql = "SELECT * FROM medias WHERE id = ?"
        return db.query(sql, [id])
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }

    // methode de récupération des médias par l'article_id
    static getMediaByArticleId(article_id) {
        let sql = "SELECT * FROM medias WHERE article_id = ?"
        return db.query(sql, [article_id])
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }

    // methode de mise à jour de l'article_id du média par son id
    static updateMediaArticleId(req) {
        let sql = "UPDATE medias SET article_id = ? WHERE id = ?"
        return db.query(sql, [req.body.article_id, req.body.id])
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }

    // methode de suppression d'un score
    static deleteOneMedia(id) {
        let sql = "DELETE FROM medias WHERE id = ?"
        return db.query(sql, [id])
            .then((res) =>{
                return res
            })
            .catch((err) =>{
                return err
            })
    }
}