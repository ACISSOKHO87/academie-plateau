import React, { useState } from 'react'
import { Helmet } from "react-helmet-async"

import { Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { connectUser } from '../../api/user'
import { loginUser } from '../../slices/userSlice'

const Login = () => {

    const dispatch = useDispatch()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [redirect, setRedirect] = useState(false)
    const [error, setError] = useState(null)
    const [updatePsw, setUpdatePsw] = useState(false)
    // fonction de connexion
    const onSubmitForm = (e) =>{

        e.preventDefault()
        // objet data pour la connexion
        let data = {
            email: email,
            password: password
        }
        
        connectUser(data)
            .then((res) =>{
                if(res.status === 200){
                    if(res.user.validate === "no") {
                        setUpdatePsw(true)
                    } else {
                        window.localStorage.setItem("token-FC-Plateau", res.token)
                        let user = res.user
                        user.token = res.token
                        // on remet à jour le state user dans le store
                        dispatch(loginUser(user))
                        // on demande la redirection à la page d'accueil
                        setRedirect(true)
                    }
                    
                } else {
                    setError(res.msg)
                }
            })
            .catch((err) =>{setError(err)})
    }

    return (<main>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Se connecter | FC Plateau</title>
            <meta  name="description" content="Se connecter en tant que administrateur à FC Plateau - Site officiel"/>
            <link rel="canonical" href="/login" />
        </Helmet>
        <section className='login-section'>
            {redirect && <Navigate to="/" />}
            {updatePsw && <Navigate to="/forgot"/>}
            <div className="form-login">
                {error !== null ? (
                    <p >{error}</p>
                    ) : (
                    <h2>Se connecter</h2>
                )}
                <form
                    onSubmit={ onSubmitForm }
                >
                    <div className="form-items">
                        <label htmlFor="email">Email <span>*</span></label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            required
                            placeholder="fc.plateau@exemple.com"
                            className="form-item"
                            onChange={(e)=>{
                                setEmail(e.currentTarget.value)
                            }}
                        />
                    </div>
                    
                    <div className="form-items">
                        <label htmlFor="password">Mot de passe <span>*</span></label>
                        <input 
                            type="password"
                            id="password"
                            name="password"
                            required
                            placeholder="votre mot de pass"
                            className="form-item"
                            onChange={(e)=>{
                                setPassword(e.currentTarget.value)
                            }}
                        />
                    </div>
            
                    <div className="pswForget">
                        <p><a href="/forgot" title="Lien pour la modification du mot de passe">Mot de passe oublié ?</a></p>
                    </div>
                    
                    <div className="submit-items">
                        <input type="submit" name="envoyer"/>
                    </div>
                </form>
            </div>
        </section>
    </main>)
}

export default Login