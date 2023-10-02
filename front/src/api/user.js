import axios from "axios";
import { config } from "../config";

export const saveUser = (data) => {
    return axios.post(`${config.api_url}/api/v1/user/save`, data)
        .then((res) => {
            return res.data
        })
        .catch((err) => {
            return err
        })
}


export const getAllUsers = () => {
    return axios.get(`${config.api_url}/api/v1/user/all`)
        .then((res) =>{
            return res.data
        })
        .catch((err) =>{
            return err
        })
}

export const getUserByKeyId = (key_id) =>{
    return axios.get(`${config.api_url}/api/v1/user/ByKeyId/${key_id}`)
        .then((res) =>{
            return res.data
        })
        .catch((err) =>{
            return err
        })
}

export const connectUser =(data) =>{
    return axios.post(`${config.api_url}/api/v1/user/login`, data)
        .then((res) =>{
            return res.data
        })
        .catch((err) =>{
            return err
        })
}

export const updateUserPassword = (data) =>  {
    const token = window.localStorage.getItem("token-code")
    return axios.put(`${config.api_url}/api/v1/user/password/update`, data, {headers: { "x-access-token": token }})
        .then((res) =>{
            return res.data
        })
        .catch((err) =>{
            return err
        })
}

export const updateUserGrade = (data, key_id) => {
    return axios.put(`${config.api_url}/api/v1/user/grade/${key_id}`, data)
        .then((res) =>{
            return res.data
        })
        .catch((err) =>{
            return err
        })
}

export const updateUserAcces = (key_id) => {
    return axios.put(`${config.api_url}/api/v1/user/access/${key_id}`)
        .then((res) =>{
            return res.data
        })
        .catch((err) =>{
            return err
        })
}

export const forgotPsw = (data) => {
    return axios.post(`${config.api_url}/api/v1/user/forgot`, data)
        .then((res) =>{
            return res.data
        })
        .catch((err) => {
            return err;
        })
}


export const mailFromContact = (data) =>{
    return axios.post(`${config.api_url}/api/v1/user/contact`, data)
        .then((res) =>{
            return res.data
        })
        .catch((err) =>{
            return err
        })
}