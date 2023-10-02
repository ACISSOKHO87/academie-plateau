import axios from "axios";
import { config } from "../config";

const token = window.localStorage.getItem("token-FC-Plateau")

export const saveArticle = (data) => {
    return axios.post(`${config.api_url}/api/v1/article/save`, data, {headers: { "x-access-token": token }})
        .then((res) =>{
            return res.data
        })
        .catch((err) =>{
            return err
        })
}

export const getAllArticles = () =>{
    return axios.get(`${config.api_url}/api/v1/article/all`)
        .then((res) =>{
            return res.data
        })
        .catch((err) =>{
            return err
        })
}

export const getOneArticleById = (id) =>{
    return axios.get(`${config.api_url}/api/v1/article/one/${id}`)
        .then((res) =>{
            return res.data
        })
        .catch((err) =>{
            return err
        })
}

export const updateOneArticle = (data, id) =>{
    return axios.put(`${config.api_url}/api/v1/article/update/${id} ` , data, {headers: { "x-access-token": token }})
        .then((res) =>{
            return res.data
        })
        .catch((err) =>{
            return err
        })
}

export const deleteOneArticle = (id) =>{
    return axios.delete(`${config.api_url}/api/v1/article/delete/${id} `, {headers: { "x-access-token": token }})
        .then((res) =>{
            return res.data
        })
        .catch((err) =>{
            return err
        })
}