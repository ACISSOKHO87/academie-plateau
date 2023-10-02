const withAuth = require('../withAuth')
const fs = require('fs')//va nous permettre de supprimer des images locales
const path = require('path')
const moment = require('moment')

module.exports = (app, db, secret) =>{

    const mediaModel = require('../models/MediaModel')(db)
    
    //une route de sauvegarde d'un média (pour l'image vous mettez req.body.url)
    app.post('/api/v1/media/save', async(req, res, next) => {
        console.log("coucou")
        let media = await mediaModel.saveOneMedia(req)
        if(media.code) { 
            res.json({status: 500, result: media})
        }
        //on récup dans l'objet de réponse l'insertId (l'id qu'il vient d'insérer dans le bdd)
        let mediaId = media.insertId
        res.json({status: 200, msg: "Média enregistré avec succé", mediaId: mediaId})
    })

    // routes de sauvegarde de la image dans l'api (stock une image et retourne au front le nom de l'image stocké)
    app.post("/api/v1/media/picture", async (req, res, next) => {
        // les images seront classées par annee-mois (exemple 2023-07)
        let dateforma =  moment( new Date() ).format("YYYY-MM")
        let mediaPath = "public" + "/" + "images" + "/" + dateforma
        
        //si on a pas envoyé de req.files via le front ou que cet objet ne possède aucune propriété
		if(!req.files || Object.keys(req.files).length === 0){
		    //on envoi une réponse d'erreur
		    res.json({status: 400, msg: "La photo n'a pas pu être récupéré"})
		}
	    //la fonction mv va envoyer l'image dans le dossier que l'on souhaite.
	    req.files.image.mv(mediaPath + "/" + req.files.image.name, (err)=>{
	        //si ça plante dans la callback
	        if(err){
                console.log(err)
	            res.json({status: 500, msg: "La photo n'a pas pu être enregistrée", erro: err})
	        }
	    })
	    //si c'est good on retourne un json avec le nom de la photo vers le front
        res.json({status: 200, msg: "image bien enregistré!", url : dateforma + "/" + req.files.image.name}) 
    })

    // route de modification d'un article
    app.put('/api/v1/media/update', async(req, res, next) =>{
        let media = await mediaModel.updateMediaArticleId(req)
        if(media.code) {
            res.json({status:500, msg: "Soucis lors de la modification du média", error: media})
        }
        res.json({status:200, msg: "L'article a étè modifié", result: media})
    })

    //route de récupération de toutes les medias
    app.get('/api/v1/media/all', async (req, res, next) => {
        let medias = await mediaModel.getAllMedia()
        if(medias.code){
            res.json({status: 500, error_msg: medias})
        }
        res.json({status: 200, results: medias})
    })

    // route de récupération d'un média par son ID
    app.get("/api/v1/media/one/:id", async(req, res, next) =>{
        let id = req.params.id
        let media = await mediaModel.getMediaById(id)
        if(media.code){
            res.json({status: 500, error_msg: media})
        }
        res.json({status: 200, result: media[0]})
    })

    // routes de récupération des médias par article_id
    app.get("/api/v1/media/ByArticleId/:article_id", async (req, res, next) => {
        let articleId = req.params.article_id
        let medias = await mediaModel.getMediaByArticleId(articleId)
        if(medias.code){
            res.json({status: 500, error_msg: medias})
        }
        res.json({status: 200, results: medias})
    })

    //route de suppression d'un média (image)
    app.delete('/api/v1/delete/:id', async(req, res, next) => {
        let id = req.params.id;
        let sql = "SELECT * FROM medias WHERE id = ?";
        let deleteMedia = await db.query(sql, [id])
        if(deleteMedia.code){
            res.json({status: 500, error_msg: deleteMedia})
        } else {
            //suppression de media dans la basse de données
            let supp = await mediaModel.deleteOneMedia(id)
            if(supp.code){
                res.json({status: 500, error_msg: supp})
            }                
            //supprime le fichier (photo) correspondant au nom de la photo enregistrée pour le produit dans la bdd, il supprime la photo dans le dossier static ou son stockées les images
            fs.unlink(`public/images/${deleteMedia[0].url}`, (err)=>{
                if(err){
                    res.json({status: 500, msg: "Impossible de supprimer la photo dans le dossier static ou son stockées les images!", err: err})
                }else{
                    res.json({status: 200, msg: "Média supprimé avec succès!"})
                }
            })
           
        }
    })
}