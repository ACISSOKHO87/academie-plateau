const withAuth = require('../withAuth');
const fs = require('fs')//va nous permettre de supprimer des images locales

module.exports = (app, db, secret) =>{
    const articleModel = require("../models/ArticleModel")(db)
    const mediaModel = require('../models/MediaModel')(db)
    // route de souvegarde d'un article
    app.post("/api/v1/article/save", withAuth, async(req, res, next) =>{
        let article = await articleModel.saveOneArticle(req)
        if(article.code){
            res.json({status:500, msg: "Soucis lors du sauvegarde d'article", error: article})
        }
        //on récup dans l'objet de réponse l'insertId (l'id qu'il vient d'insérer dans le bdd)
        let articleId = article.insertId
        res.json({status: 200, msg: "L'article a étè bien enregistré", articleId: articleId})
    })
 
    
    // route de récuperation de tous les articles
    app.get("/api/v1/article/all", async(req, res, next) =>{
        let articles = await articleModel.getAllArticles()
        if(articles.code){
            res.json({status:500, msg: "Soucis lors du chargement des articles", error: articles})
        } 
        res.json({status: 200, results: articles})
    })
 
    // route de recuperation d'un article par son id
    app.get("/api/v1/article/one/:id", async(req, res, next) =>{
        let id = req.params.id
        let article = await articleModel.getOneArticleById(id)
        if(article.code) {
            res.json({status:500, msg: "Soucis lors de la récupération de l'article", error: article})
        }
        res.json({status:200, result: article[0]})
    })

    // route de modification d'un article
    app.put("/api/v1/article/update/:id", withAuth, async(req, res, next) =>{
        let id = req.params.id
        let article = await articleModel.updateOneArticle(req, id)
        if(article.code) {
            res.json({status:500, msg: "Soucis lors de la modification de l'article", error: article})
        }
        res.json({status:200, msg: "L'article a étè modifié avec succès", result: article})
    })

    
    // route de supréssion d'un article 
    app.delete("/api/v1/article/delete/:id", withAuth, async(req, res, next) =>{
        let id = req.params.id
        let article = await articleModel.deleteOneArticle(id)
        if(article.code){
            res.json({status:500, msg: "Soucis lors de la suppréssion de l'article", error: article})
        } else {
            // suprime l'ensemble des images correspondant à l'article
            let mediasTodelete = await mediaModel.getMediaByArticleId(id)
            if(mediasTodelete.code) {
                res.json({status:500, msg: "Soucis de récupération des images de l'article"})
            } else {
                mediasTodelete.forEach((media) => {
                    //supprime le fichier (photo) correspondant au nom de la photo enregistrée pour le produit dans la bdd, il supprime la photo dans le dossier static ou son stockées les images
            		fs.unlink(`public/images/${media.url}`, function(err){
            			if(err){
            				res.json({status: 500, msg: "Problème suppression d'image!"})
            			}
            		})
                })
            }
            res.json({status:200, msg: "L'article a étè supprimer", result: article[0]})
        }
    })
}