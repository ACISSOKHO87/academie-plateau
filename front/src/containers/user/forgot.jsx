import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { forgotPsw } from '../../api/user'
import { Helmet } from 'react-helmet-async'

const Forgot = () => {

    const [email, setEmail] = useState("")
    const [email2, setEmail2] = useState("")
    const [redirect, setRedirect] = useState(false)
    const [error, setError] = useState(null)

    // state digit code pour la modification du Psw
    const [digitCode, setDigitCode] = useState(0)

    // fonction pour la génération d'un nombre entier aléatoire compris entre les arguments min et max inclus
    const getRandomInteger = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    useEffect(() => {
        setDigitCode((digit) => getRandomInteger(0, 9999))
    },[])

    const onSubmitForm = (e) =>{
        e.preventDefault()
        if(email !== email2) {
            setError("Les emails ne sont différents, veuillez saisir des emails identiques")
        } else {

            let data = {
                email: email,
                digitCode: digitCode
            }

            forgotPsw(data)
                .then((res)=>{
                    console.log("coucou forgot: ", res)
                    if(res.status === 200){
                        console.log("token code: ", res.token)
                        window.localStorage.setItem("token-code", res.token)
                        setRedirect(true)
                    }
                })
                .catch((err) =>{setError(err)})
        }
    }

    return ( <main>
        <Helmet>
            <meta charSet="utf-8" />
            <title>ReFC Plateau - Site officiel du FC Plateau </title>
            <meta name="description" content=" Mot de passe oublié ? envoie du mail pour le changement du mot de passe administrateur - FC Plateau officiel"/>
            <link rel="canonical" href="/forgot" />            
        </Helmet>        
        {redirect && <Navigate to="/initPassword" />}
        {error !== null && <p className="errorMsg">{error}</p>}
        <section className="forgot-section">
            <h2>Mot de passe oublié</h2>
            <div className="form-forgot">
                <form 
                    onSubmit={onSubmitForm}
                >
                    <div className="form-items">
                        <label htmlFor="email">Email:*</label>
                        <input 
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="form-item"
                            onChange={(e)=>{
                                setEmail(e.currentTarget.value)
                            }}
                        />
                    </div>
                    <div className="form-items">
                        <label htmlFor="email2">Confirmer l'email:*</label>
                        <input 
                            type="email"
                            id="email2"
                            name="email2"
                            required
                            className="form-item"
                            onChange={(e)=>{
                                setEmail2(e.currentTarget.value)
                            }}
                        />
                    </div>
                    <div className="submit-items">
                        <input type="submit" name="envoyer"/>
                    </div>
                </form>
            </div>
        </section>
    </main>)
}

export default Forgot