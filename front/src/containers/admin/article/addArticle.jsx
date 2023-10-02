import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getAllArticles, saveArticle } from '../../../api/article';
import { updateMediaArticleId, deleteOneMedia } from '../../../api/media';
import ModalMedia from '../../../components/modalMedia';
import { useDispatch } from "react-redux";
import { loadArticles } from '../../../slices/articleSlice';
import { selectUser } from '../../../slices/userSlice';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import { Helmet } from 'react-helmet-async';


const AddArticle = () => {

    // on récupère le state user dans le store
    const user = useSelector(selectUser)
    // on instancie le dispatch pour  mettre à jour le store
    const dispatch = useDispatch()

    const [title, setTitle] = useState("")
    const [contents, setContents] = useState("")
    const [online, setOnline] = useState(0)
    const [redirect, setRedirect] = useState(false)
    const [success, setSucces] = useState(null)
    const [error, setError] = useState(null)
    const [timer, setTimer] = useState(null)
    // tableau qui contient les Ids des images liées à l'article
    const [imageIds, setImageIds] = useState([])
    // state pour l'article ID
    const [articleID, setArticleID] = useState(null)
    // state pour la visualisation du modal add Média
    const [showModalAddMedia, setShowModalAddMedia] = useState(false)

    // fonction qui qui supprime les eventuels médias ajouté si l'admin n'a pas souvegarder l'article qu'il ajoutait
    const deleteMediaWithNoArticleID = () => {
        imageIds.forEach((id) => {
            deleteOneMedia(id)
                .then((res) => {
                    setSucces(res.msg)
                })
                .catch((err) => {
                    setError(err)
                })
        })
        setSucces(null)
    }
    
    const onSubmitForm = () => {
        // data: objet contenant les informations liées de l'article
        let data = {
            title: title,
            contents: contents,
            user_key: user.infos.key_id,
            online: online
        }
        // sauvegarde d'article
        saveArticle(data)
            .then((resp) => {
                if(resp.status === 200){
                    imageIds.forEach((id) =>{
                        let data = {
                            article_id: resp.articleId,
                            id: id
                        }
                        // on met à jour l'id de larticle aux médias correspondant dans la base de données
                        updateMediaArticleId(data)
                            .then((res) => {
                                if(res.status === 200) {
                                    setSucces(res.msg)
                                }
                            })
                    })
                    getAllArticles()
                        .then((response) => {
                            dispatch(loadArticles(response.results))
                        })
                        .catch((err) => {setError(err)})
                }
                setRedirect(true)
            })
            .catch((err) => {
                setError(err)
            })
    }


    return (<main>
        <Helmet>
            <meta charSet="utf-8" />
            <title>FC Plateau - site officiel</title>
            <meta name="description" content="Ajouter un article : Page destinée à l'ajout d'un article par un administrateur"/>
            <link rel="canonical" href="/addArticle" />
        </Helmet>
        <div className="retour-accueil">
            {/** Si l'admin clique sur retour sans sauvegarder l'article, on supprime tous les médias éventuels ajoutés**/}
            <Link title="Accueil"
                onClick={(e) =>{
                    e.preventDefault()
                    deleteMediaWithNoArticleID()
                    setRedirect(true)
                }}
            >
                <FontAwesomeIcon icon={faChevronLeft} className="fontawesome"/> Accueil 
            </Link>
        </div>
        {error !== null && <p>{error}</p>}
        {redirect && <Navigate to="/admin" />}
        <section className="article-container">
            {showModalAddMedia && <ModalMedia setImageIds ={setImageIds} articleID = {articleID} setShowModalAddMedia = {setShowModalAddMedia}/>}
            <div className="add-form-container">
                <h2>Ajouter un article</h2>
                <form 
                    onSubmit={(e) => {
                        e.preventDefault()
                        onSubmitForm();
                    }}
                >
                    <div className="form-items">
                        <label htmlFor="title">Titre: <span>*</span></label>
                        <input                         
                            type="text"
                            name="title"
                            id="title"
                            placeholder="titre de l'article"
                            required
                            className="form-item"
                            onChange={(e) => {
                                setTitle(e.currentTarget.value)
                                }}
                        />
                    </div>

                    <div className="form-items full">
                        <label htmlFor="contents">Description: <span>*</span></label>
                        <textarea name="contents" id="contents" className="form-item" placeholder="description..." required
                            onChange={(e) =>{
                                setContents(e.currentTarget.value)
                            }}
                        >

                        </textarea>
                    </div>

                    <div className="form-items">
                        <button
                            className="form-item-add-image"
                            onClick={(e) => {
                            e.preventDefault();
                                setShowModalAddMedia(true)
                            }}
                        >
                            Ajouter des images à l'article
                        </button>
                        {imageIds.length !== 0 && <p className="infos-nombre-media">Vous avez ajoué {imageIds.length} image(s) à votre article</p>}
                    </div>

                    <fieldset>
                        <legend htmlFor="online">En ligne :</legend>
                        <div >
                            <label htmlFor="online">oui</label>
                            <input type="radio" name="online" id="online" value='1'
                                onChange={(e) => {
                                    setOnline(e.currentTarget.value)
                                }}
                            />                        
                        </div>
                        <div >
                            <label htmlFor="offline">non</label>
                            <input type="radio" name="online" id="offline" value='0'
                                defaultChecked
                                onChange={(e) => {
                                    setOnline(e.currentTarget.value)
                                }}
                            />                        
                        </div>
                    </fieldset>

                    <div className="submit-items">
                        <input type="submit" name="envoyer" />
                    </div>
                </form>

            </div>
        </section>
    </main>)
}

export default AddArticle