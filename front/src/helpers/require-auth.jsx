import React, { useState, useEffect} from "react";
import { Navigate, useParams,  useNavigate } from "react-router-dom";
import {config } from "../config"
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, loginUser } from "../slices/userSlice";
import { loadArticles } from "../slices/articleSlice"
import { getUserByKeyId } from "../api/user";
import { getAllArticles } from "../api/article";


// HOC de controle des data et de la sécurité
const RequireAuth = (props) => {
    
    // on récupére les params de la routes demandée
    const params = useParams();
    // on récupére le state user dans le store en mode lecture 
    const user = useSelector(selectUser)

    // on instancie le dispatch pour  mettre à jour le store
    const dispatch = useDispatch()
    //on instancie le navigate pour la redirection
    const navigate = useNavigate()

    const Child = props.child;
    const [redirect, setRedirect] = useState(false)

    useEffect(() =>{
        //si l'utilisateur n'est pas connecté
        if(user.isLogged === false){
            // on récupére le token dans le localStorage
            const token = window.localStorage.getItem("token-FC-Plateau")
            // on vérifie si le token est nul et que la route est protégée
            if(token===null && props.auth){
                // on demande une redirection
                setRedirect(true)
            } else { // sinon 
                // non vérifie le token récupéré dans le localSotage
                axios.get(`${config.api_url}/api/v1/checkToken`, {headers: {"x-access-token": token}})
                    .then((res) =>{
                        //si le status de la réponse n'est pas 200
                        if(res.data.status !== 200){
                            // si la route demander est protégée, on demande un redirection
                            if(props.auth){
                                setRedirect(true)
                            }
                        } else { // sinon (res.status === 200)
                            //on récupére les infos de du user qu'on stock dans un variable user
                            let user = res.data.user                            
                            // on rajoute le token au variable user
                            user.token = token
                            // on dispatch le user pour mettre à jour le store
                            dispatch(loginUser(user))            
                            // on vérifie si l'utilisateur n'est pas blacklisté
                            getUserByKeyId(user.key_id)
                                .then((response) =>{
                                    // si l'utilisateur est blacklisté
                                    if(response.user.access === "denier"){
                                        // on vide le token dans le localStorage
                                        window.localStorage.removeItem("token-FC-Plateau")
                                        // on redirige l'utilisateur vers l'accueil
                                        navigate("/");
                                    }
                                })
                                .catch((err) =>{console.log(err)})                
                        }
                    })
                    .catch((err) =>{console.log("error token:", err)})
            }
        } 
        
        getAllArticles()
            .then((res) =>{
                if(res.status === 200){
                    // On met à jour le store
                    dispatch(loadArticles(res.results))      
                }
            })
            .catch((err) =>{console.log(err)})
    },[])
    
    if (redirect) {
        return <Navigate to="/login" />;
    }
      //{...props} = transmet au composant enfant les props du parent (comme un relais)
      //params = j'ai crée une une props qui envoi le params de l'url (récupéré en haut par useParams) vers le composant enfant
      return <Child {...props} params={params} />;
}

export default RequireAuth