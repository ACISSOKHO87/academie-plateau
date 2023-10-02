import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Link } from 'react-router-dom';
import { loadArticles } from '../../../slices/articleSlice';
import { updateOneArticle, getOneArticleById, getAllArticles} from '../../../api/article';
import { getMediaByArticleId, deleteOneMedia  } from '../../../api/media';
import ModalMedia from '../../../components/modalMedia';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import { Helmet } from 'react-helmet-async';

const EditArticle = () => {

    const dispatch = useDispatch()
    const params = useParams()
    const [title, setTitle] = useState("")
    const [contents, setContents] = useState("")
    const [online, setOnline] = useState(0)
    const [redirect, setRedirect] = useState(false)
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)
    const [timer, setTimer] = useState(null)

    // tableau qui contient les Ids des images liées à l'article
    const [imageIds, setImageIds] = useState([])
    // state pour la visualisation du modal add Média
    const [showModalAddMedia, setShowModalAddMedia] = useState(false)
    
    // fonction qui qui supprime les eventuels médias ajouté si l'admin n'a pas souvegarder l'article qu'il ajoutait
    const deleteMediaWithNoArticleID = () => {
        imageIds.forEach((id) => {
            deleteOneMedia(id)
                .then((res) => {
                    setSuccess(res.msg)
                })
                .catch((err) => {
                    setError(err)
                })
        })
        setSuccess(null)
    }

    // fonction de delay pour la redirection lorsque l'article est ajouté avec succes
    const delayRedirect = () => {
        if(timer !== null){
            setTimer(clearInterval(timer))
            setInterval(null)
        } else {
            setTimer(setTimeout(() => {
                setRedirect(true)
            }, 3000))  
        }
    }

    const onSubmitForm = () => {
        let data = {
            title: title,
            contents: contents,
            online: online
        }
        updateOneArticle(data, params.id)
            .then((res) => {
                if(res.status === 200){
                    setSuccess(res.msg)
                    getAllArticles()
                        .then((response) => {
                            dispatch(loadArticles(response.results))
                        })
                        .catch((err) => {setError(err)})
                }
            })
            .catch((err) => setError(err))
        delayRedirect()
    }
    
    useEffect(() => {
        getOneArticleById(params.id)
            .then((res) => {
                if(res.status === 200 ){
                    setTitle(res.result.title)
                    setContents(res.result.contents)
                    setOnline(res.result.online)
                    getMediaByArticleId(params.id)
                        .then((resp) =>{
                            let tab = []
                            if(resp.status === 200){
                                resp.results.map((result) => {
                                    tab = [...tab, result.id]
                                    setImageIds([...tab])
                                })
                            }
                            
                            
                        })
                        .catch((err) => setError(err))
                }
            })
            .catch((err) => setError(err))
    },[])

    if (redirect) {
        return <Navigate to="/admin" />
    }

    return (<main>
        <Helmet>
            <meta charSet="utf-8" />
            <title>FC Plateau - site officiel</title>
            <meta name="description" content="Modification un article : Page destinée à la modification d'un article par un administrateur"/>
            <link rel="canonical" href={`/editArticle/${params.id}`}/>
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
        <section className="article-container">
            {error !== null && <p className="errorMsg">{error}</p>}
            {success !== null && <p className="message">{success}</p>}
            {showModalAddMedia && <ModalMedia setImageIds ={setImageIds} articleID = {params.id} setShowModalAddMedia = {setShowModalAddMedia}/>}
            <div className="edit-form-container">
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
                            className="form-item"
                            defaultValue={title}
                            onChange={(e) => {
                                setTitle(e.currentTarget.value)
                                }}
                        />
                    </div>

                    <div className="form-items full">
                        <label htmlFor="contents">Description: <span>*</span></label>
                        <textarea name="contents" id="contents" className="form-item" placeholder="description..."
                            defaultValue={contents}
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
                        {imageIds.length !== 0 && <p className="infos-nombre-media">Vous avez ajoué {imageIds.length} nouvelle(s) image(s) à votre article</p>}
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

export default EditArticle