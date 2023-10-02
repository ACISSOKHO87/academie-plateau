import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../slices/userSlice'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const Logout = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    useEffect( () =>{
        // on suprime le token dans le localStorage
        window.localStorage.removeItem("token-FC-Plateau")
        // on remet à jour le state user dans le store
        dispatch(logoutUser())
        // on redirige ver la page d'accueil
        navigate("/");
    },[])

    return (<div>        
        <Helmet>
            <meta charSet="utf-8" />
            <title>Se deconnecter | FC Plateau</title>
            <meta  name="description" content="Se deconnecter en tant que administrateur à FC Plateau - Site officiel"/>
            <link rel="canonical" href="/logout" />
        </Helmet>
        <h1>Se déconnecter </h1>
    </div>)
}

export default Logout