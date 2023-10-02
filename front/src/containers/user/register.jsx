import React, { useState } from 'react'
import { Helmet } from "react-helmet-async"
import { Navigate } from 'react-router-dom'
import { saveUser } from '../../api/user'
import { validateInputField } from '../../helpers/form-validator'

const Register = () => {

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [grade, setGrade] = useState("")

    const [error, setError] = useState(null)
    const [redirect, setRedirect] = useState(false)
    const [success, setSuccess] = useState(null)
    const [timer, setTimer] = useState(null)

    // fonction de delay pour la redirection 
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
        // on vérifie si l'email est au bon format
        const testMail = validateInputField("Email", "email", email)
        if(testMail !== true) {
            setError(testMail)
            return
        }
        // on vérifie si le mot de passe est au bon format
        const testPass = validateInputField("Password", "password", password)
        if(testPass !== true){
            setError(testPass)
            return
        }

        // on vérifie si le champ grade n'est pas vide
        const testGrade = validateInputField("Grade", "grade", grade)
        if(testGrade !== true){
            setError(testGrade)
            return
        }

        let data = {
            firstName: firstName,
            lastName: lastName,
            grade: grade,
            email: email,
            password: password
        }
        console.log("admin: ", data)
        // on sauvegarde les données du nouveau admin
        saveUser(data)
            .then((res) =>{
                if(res.status === 200) {
                    setError(null)
                    setSuccess(res.msg)
                    delayRedirect()
                }
            })
            .catch((err) =>{setError(err)})
    }

    return (<main>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Register | FC Plateau</title>
            <meta  name="description" content="Ajouter un nouveau administrateur du site web FC Plateau - Site officiel"/>
            <link rel="canonical" href="/login" />
        </Helmet>
        <section className="register-section">
            {redirect && <Navigate to="/" />}
            {error !== null && <p className="errorMsg">{error}</p>}
            {success !== null && <p className="message">{success}</p>}
            <h2>Ajouter un administrateur</h2>
            <div className="form-register">
                <form 
                    onSubmit={(e) =>{
                        e.preventDefault()
                        onSubmitForm()
                    }}
                >
                    <div className="form-items">
                        <label htmlFor="firstName">Prenom:*</label>
                        <input 
                            type="text" 
                            id="firstName" 
                            name="firstName"
                            placeholder="votre prenom"
                            className="form-item"
                            onChange={(e)=>{
                                setFirstName(e.currentTarget.value)
                            }}
                        />
                    </div>
                    <div className="form-items">
                        <label htmlFor="lastName">Nom:*</label>
                        <input 
                            type="text" 
                            id="lastName" 
                            name="lastName"
                            placeholder="votre nom"
                            className="form-item"
                            onChange={(e)=>{
                                setLastName(e.currentTarget.value)
                            }}
                        />
                    </div>
                    <div className="form-items">
                        <label htmlFor="grade">Grade:*</label>
                        <select name="grade" id="grade" 
                            onChange={(e) =>{
                                setGrade(e.currentTarget.value)
                            }}
                        >
                            <option value="" >--- selectionnez la grade ---</option>
                            <option value="A" >A</option>
                            <option value="B" >B</option>
                            <option value="C" >C</option>
                            <option value="D" >D</option>
                        </select>
                    </div>
                    <div className="form-items">
                        <label htmlFor="email">Email:*</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email"
                            placeholder="fc.plateau@exemple.com"
                            required
                            className="form-item"
                            onChange={(e)=>{
                                setEmail(e.currentTarget.value)
                            }}
                        />
                    </div>
                    <div className="form-items">
                        <label htmlFor="password">Mot de passe:*</label>
                        <input 
                            type="password"
                            id="password"
                            name="password"
                            placeholder="votre mot de passe"
                            required
                            className="form-item"
                            onChange={(e)=>{
                                setPassword(e.currentTarget.value)
                            }}
                        />
                    </div>
                    <div className="submit-items">
                        <input type="submit" name="envoyer"/>
                    </div>
                </form>
            </div>
        </section>
    </main> )
}

export default Register