import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrashCan, faCirclePlus, faBan, faSquareCheck, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom' 
import { selectArticles, loadArticles } from '../../slices/articleSlice'
import { selectUser } from '../../slices/userSlice'
import { getAllUsers,updateUserAcces, updateUserGrade } from '../../api/user'
import { deleteOneArticle, getAllArticles } from '../../api/article'
import ModalDelete from '../../components/modalDelete'
import { Helmet } from 'react-helmet-async'
import { Navigate } from 'react-router-dom'
import { gradeAuth } from '../../helpers/gradeAuth'

const Admin = () => {


    const dispatch = useDispatch()
    // state admin
    const admin = useSelector(selectUser)
    // state (tableau) pour les utilisateur
    const [users, setUsers] = useState([])
    // récupération des states globales
    const allArticles = useSelector(selectArticles)
    // state pour les articles à afficher dans le table en fonction de sa grade de l'administrateur 
    const [adminArticles, setAdminArticles] = useState([])
    // states pour l'affichage de la popup de supression d'un element
    const [removeArticle, setRemoveArticle] = useState(false)
    // state global pour la supression d'un element
    const [articleId, setArticleId] = useState(null)

    /* 
        fonction qui met à jour admin article.
        Seul l'admin de grade 'A' a accès à tous les articles
    */
    const getAdminArticles = () => {
        if(admin.infos.grade !== "A") { // si admin différent de l'administrateur principal, on affiche que les articles ajouter par l'admin
            setAdminArticles(allArticles.articles.filter((post) => post.user_key === admin.infos.key_id ))
        } else { // sinon on affiche tous les articles
            setAdminArticles(allArticles.articles)
        }
    }

    // fonction pour récupérer l'auteur de l'article
    const getArticleAuthor = (user_key) =>  {
        if(users.length !== 0){
            return users.find((user) => user.key_id === user_key).lastName
        }
    }

    // fonction pour changer la grade de l'admin
    const chanceGradeAdmin = (grade, user_key) => {
        let data = {
            grade: grade
        }
        console.log("coucou")
        updateUserGrade(data, user_key)
            .then((res) => {
                console.log(res)
                if(res.status === 200){
                    getAllUsers()
                        .then((resp) =>{
                            if(resp.status === 200){
                                setUsers(resp.users)
                            }
                        })
                        .catch((err) =>{ console.log(err) })
                }
            })
            .catch((err) =>{console.log(err)})
    }

    // fonction pour interdire l'accès à un admin
    const chanceAdminacces = (user_key) => {
        updateUserAcces(user_key)
            .then((res) => {
                if(res.status === 200){
                    getAllUsers()
                        .then((resp) =>{
                            if(res.status === 200){
                                setUsers(resp.users)
                            }
                        })
                        .catch((err) =>{ console.log(err) })
                }
            })
            .catch((err) =>{console.log(err)})
    }

    // fonction de supression d'un article
    const deleteArticle = () => {
        deleteOneArticle(articleId)
            .then((res) => {
                if(res.status === 200) {
                    getAllArticles()
                        .then((response) =>{
                            dispatch(loadArticles(response.results))
                        })
                        .catch((err) =>{console.log(err)})
                }
                setRemoveArticle(!removeArticle)
            })
            .catch((err) =>{console.log(err)})
    }

    useEffect(() =>{
        getAdminArticles()
        getAllUsers()
            .then((res) =>{
                if(res.status === 200){
                    setUsers(res.users)
                }
            })
            .catch((err) =>{
                console.log(err)
            })
    },[allArticles])

    return (<main>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Admin | FC Plateau-Site officiel</title>
            <meta name="description" content="Administration du site . FC Plateau - Site officiel"/>
            <link rel="canonical" href="/admin" />
        </Helmet> 
        <div className="retour-accueil">
            <Link to="/" title="Accueil"><FontAwesomeIcon icon={faChevronLeft} className="fontawesome"/> Accueil </Link>
        </div>
        <section className="admin-container">
            <h2>Administration</h2>
            {/** Popup pour la supression d'un article **/}
            {removeArticle && <ModalDelete setRemoveArticle={setRemoveArticle} deleteArticle={deleteArticle} />}
            {
                admin.infos.grade === "A" &&  users.length !== 0 && <div className="users-table">
                    
                    <div className="add">
                        <Link to="/register" className="add-link" title="register"> <FontAwesomeIcon icon={faCirclePlus} className="fontawesome"/> Ajouter un admin </Link>
                    </div>
                    
                    <table>
                        <thead>
                            <tr>
                                <th>Prenom NOM</th>
                                <th>Grade</th>
                                <th>Valide</th>
                                <th>Access</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user, index) =>{
                                return <tr key = {user.id}>
                                    <td> {user.firstName} {user.lastName}</td>
                                    <td>
                                        <select name="grade" id={"grade_" + index} 
                                            onChange={(e) => {
                                                e.preventDefault()
                                                chanceGradeAdmin(e.currentTarget.value, user.key_id)
                                            }}
                                        >
                                            <option value={user.grade} >{user.grade}</option>
                                            {gradeAuth.map((grade, index)=>{
                                                if(grade !== user.grade) {
                                                    return (<option key={index} value={grade}>
                                                        {grade}
                                                    </option>)
                                                }
                                            })}
                                        </select>
                                    </td>
                                    <td>{user.validate}</td>
                                    <td>
                                        {user.access === "allow" ? <FontAwesomeIcon icon={faSquareCheck} className="fontawesome allow"/> : <span><FontAwesomeIcon icon={faBan} className="fontawesome"/></span>  }
                                    </td>
                                    <td>
                                        <span>
                                            <Link  title="bloquer"
                                                onClick={(e) => {
                                                    e.preventDefault()
                                                    chanceAdminacces(user.key_id)
                                                }}
                                            >Bloquer</Link>
                                        </span>

                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            }
            
            <div className="articles-table">
                <div className="add">
                    <Link to="/addArticle" className="add-link" title="Ajouter un article"> <FontAwesomeIcon icon={faCirclePlus} className="fontawesome"/> Ajouter un article </Link>
                </div>
                {adminArticles.lenth === 0 ? <p>
                    Pas d'articles pour le moment
                </p>: <table>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Titre</th>
                            <th>En ligne</th>
                            {admin.infos.grade === "A" && <th>Auteur</th>}
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            adminArticles.map((post) =>{
                                let auteur = getArticleAuthor(post.user_key)
                                return <tr key={post.id}>
                                    <td><strong>{post.id}</strong></td>
                                    <td>{post.title.substring(1, 30)}...</td>
                                    <td>{post.online === 1 ? "oui" : "non"}</td>
                                    {admin.infos.grade === "A" && <td>{auteur}</td>}
                                    <td>
                                        <span className="actions">
                                            <Link  to={`/editArticle/${post.id}`} className="editPencil" title="modifier">
                                                <FontAwesomeIcon icon={faPencil} className="fontawesome"/> 
                                            </Link> 
                                            <Link title="supprimer"
                                                onClick={(e) =>{
                                                    e.preventDefault()
                                                    setArticleId(post.id)
                                                    setRemoveArticle(true)
                                                }}
                                            >
                                                <FontAwesomeIcon icon={faTrashCan} className="fontawesome"/>
                                            </Link>
                                        </span>
                                    </td>
                                </tr>
                            })
                        }
                    </tbody>
                </table>}
            </div>
        </section>
    </main>)
}

export default Admin