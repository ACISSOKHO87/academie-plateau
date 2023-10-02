import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { updateUserPassword } from '../../api/user'
import { validateInputField } from '../../helpers/form-validator'


const InitPassword = () => {

    
    const [password1, setPassword1] = useState("")
    const [password2, setPassword2] = useState("")
    const [code, setCode] = useState(0)
    const [redirect, setRedirect] = useState(false)
    const [timer, setTimer] = useState(null)
    const [msg, setMsg] = useState(null)
    const [error, setError] = useState(null)

    // fonction de delay pour la redirection lorsque la modification du mot de passe a réussi
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

    const onSubmitForm = (e) => {
        e.preventDefault()
         
        // on vérifie si le mot de passe est au bon format
        const testPass = validateInputField("Password", "password", password1)
            if(testPass !== true){
                setError(testPass)
                return
        }
 
        let data = {
            code: code,
            password1: password1,
            password2: password2
        }

        updateUserPassword(data)
            .then((res) => {
                if(res.status === 200) {
                    setMsg(res.msg)
                    // on suprime le token dans le localStorage
                    window.localStorage.removeItem("token-code")
                    delayRedirect()
                } else {
                    setError(res.msg)
                }
            })
            .catch((err) => {setError(err)})
    }

    return (<main>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Modifier mot de passe | FC Plateau</title>
            <meta name="description" content="Redéfinition du mot de passe en tant que administrateur à FC Plateau - Site officiel"/>
            <link rel="canonical" href="/initPassword" />
        </Helmet>
        <section className="initPassword-section">
            {redirect && <Navigate to="/login" />}
            {error !== null && <p className="errorMsg">{error}</p>}
            {msg !== null && <p className="message">{msg}</p>}
            <h2>Redéfinition de mot de passe</h2>
            <div className="initPassword-form">
                <form 
                    onSubmit={ onSubmitForm }
                >
                    <div className="form-items">
                        <label htmlFor="code">Code:*</label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            placeholder="code de vérification"
                            className="form-item"
                            onChange={(e)=>{
                                setCode(e.currentTarget.value)
                            }}
                        />
                    </div>
                    <div className="form-items">
                        <label htmlFor="password1">Mot de passe <span>*</span></label>
                        <input 
                            type="password"
                            id="password1"
                            name="password1"
                            required
                            placeholder="votre mot de passe"
                            className="form-item"
                            onChange={(e)=>{
                                setPassword1(e.currentTarget.value)
                            }}
                        />
                    </div>
                    <div className="form-items">
                        <label htmlFor="password2">Confirmez <span>*</span></label>
                        <input 
                            type="password"
                            id="password2"
                            name="password2"
                            required
                            placeholder="confirmez votre mot de passe"
                            className="form-item"
                            onChange={(e)=>{
                                setPassword2(e.currentTarget.value)
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

export default InitPassword