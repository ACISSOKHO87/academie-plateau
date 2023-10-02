import axios from 'axios'
import {config} from '../config'


// fonction d'ajout d'un média
export function saveOneMedia(data) {
    return axios.post(config.api_url + "/api/v1/media/save", data)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return err
        })
}

// fonction de récupération de tous les médias
export function getAllMedia() {
    return axios.get(config.api_url + "/api/v1/media/all")
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return err
        })
}

// fonction de récupération d'un média par son ID
export function getMediaById(id) {
    return axios.get(config.api_url + `/api/v1/media/one/${id}`)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return err
        })
}
// fonction de mise à jour de l'article_id du média
export function updateMediaArticleId(data) {
    return axios.put(config.api_url + "/api/v1/media/update", data)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return err
        })        
}

// fonction de récupération de tous les médias par l'article id
export function getMediaByArticleId(articleId) {
    return axios.get(config.api_url + `/api/v1/media/ByArticleId/${articleId}`)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return err
        })
}

// fonction de suppréssion d'un article
export function deleteOneMedia (id) {
    return axios.delete(config.api_url + `/api/v1/delete/${id}`)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return err
        })
}