import React, { useState, useEffect, createRef } from 'react'
import axios from 'axios'
import { config } from '../config.js'
import {  saveOneMedia, getMediaByArticleId, getMediaById,deleteOneMedia, updateMediaArticleId } from '../api/media';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'

const ModalMedia = ({ setImageIds, articleID, setShowModalAddMedia }) => {

    const fileInput = createRef()

    const [name, setName] = useState("")
    const [url, setUrl] = useState(null)
    const [newMedias, setNewMedias] = useState([])

    const formaImage = ["image/jpeg", "image/webp", "image/png"]

    const onSubmitForm = () => {
        // on vérifie si le format de l'image est valide
        let index = formaImage.findIndex((element) => element === url.type)
        if(index !== -1) {
            const formData = new FormData()
            formData.append("image", url)
            // requète axios d'envoie d'une image vers le back
            axios({
                method: "post",
                url: config.api_url + '/api/v1/media/picture',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                if(res.status === 200) {
                    // on crée l'objet data pour l'envoyer vers le back 
                    let data = {
                        name: name,
                        url: res.data.url,
                        type: url.type

                    }
                    // on enregiste le média dans la base de donnée
                    saveOneMedia(data) 
                        .then((resp) => {
                            setImageIds((image) => [...image,resp.mediaId])
                            if(articleID !== null){
                                let data = {
                                    article_id: articleID,
                                    id: resp.mediaId
                                }
                                updateMediaArticleId(data)
                                    .then((respo) => {
                                        if(respo.status === 200){
                                            getMediaByArticleId(articleID)
                                                .then((respons) =>{
                                                    setNewMedias([...respons.results])
                                                })
                                                .catch((err) => {console.log(err)})

                                        }
                                    })
                                    .catch((err) => { console.log(err)})
                            }else {
                                getMediaById(resp.mediaId)
                                    .then((response) =>{
                                        setNewMedias((media) => [...media, response.result])
                                    })
                                    .catch((err) => { console.log(err)})
                            }
                            
                        })
                        .catch((err) => { console.log(err)})
                }

            })
            .catch((err) => {
                console.log(err)
            })
        }
        document.querySelector("form").reset()

    }

    const loadNewsMedias = () => {
        if(articleID !== null){
            getMediaByArticleId(articleID)
                .then((res) =>{
                    setNewMedias([...res.results])
                })
                .catch((err) => {console.log(err)})
        }
    }

    useEffect(() => {
        loadNewsMedias()
    },[]) 

    return (<main>
        <section className="modal-container">
            <div
                className="close"
                onClick={(e) => {
                    e.preventDefault()
                    setShowModalAddMedia(false)
                }}
            >
                <FontAwesomeIcon icon={faXmark} className="fontawesome"/> 
            </div>

            <h2>Ajouter des images à l'article</h2>
            <div className="form-modal">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSubmitForm()
                    }}
                >
                    <div className="form-items">
                        <label htmlFor="url">Image: <span>*</span></label>
                        <input  
                            ref={fileInput}                       
                            type="file"
                            name="url"
                            id="url"
                            required
                            placeholder="titre de l'image"
                            className="form-item"
                            onChange={(e) => {
                                setUrl(fileInput.current.files[0])
                            }}
                        />
                    </div>

                    <div className="form-items">
                        <label htmlFor="name">Titre: <span>*</span></label>
                        <input                         
                            type="text"
                            name="name"
                            id="name"
                            required
                            placeholder="titre de l'image"
                            className="form-item"
                            onChange={(e) => {
                                setName(e.currentTarget.value)
                            }}
                        />
                    </div>

                    <div className="submit-items">
                        <input type="submit" name="Ajouter"/>
                    </div>
                </form>
            </div>
            {
                newMedias.length !== 0 && <div className="medias-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Titre</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                newMedias.map((media) =>{
                                    return <tr key={media.id}>
                                        <td>{<img src={config.photo_url + media.url} alt={media.name} className="img-media-max-width"/>}</td>
                                        <td>{media.name}</td>
                                        <td>
                                            <span>
                                                <Link title="supprimer">
                                                    <FontAwesomeIcon icon={faTrashCan} className="fontawesome"/>
                                                </Link>
                                            </span>
                                        </td>
                                    </tr>
                                })
                            }
                                
                        </tbody>
                    </table>
                </div>
            }
        </section>
    </main>)
}

export default ModalMedia