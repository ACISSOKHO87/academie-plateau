import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { mailFromContact } from '../api/user'
import { Navigate } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import { Helmet } from 'react-helmet-async'

const Contact = () => {

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [redirect, setRedirect] = useState(false)


    // fonction d'envoie de mail
    const onSubmitForm = () => {
        let data = {
            title: fullName,
            subject: subject,
            message: `${message}   <br/> email:  ${ email }  <br/> phone:  ${ phone } `
        }
        mailFromContact(data)
            .then((res) =>{
                console.log(res)
                setRedirect(true)
            })
            .catch((err) =>{
                console.log(err)
            })
    }
    
    return (<main>
        <div className="retour-accueil">
            <Link to="/" title="Accueil"><FontAwesomeIcon icon={faChevronLeft} className="fontawesome"/> Accueil </Link>
        </div>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Contact | FC Plateau-Site officiel</title>
            <meta name="description" content="Page contact de l'académie. Permet nous contacter par mail, téléphone ou même se rendre au terrain de foot de l'académie. FC Plateau officiel"/>
            <link rel="canonical" href="/contact" />
        </Helmet>
        <section className="contact-section">
            {redirect && <Navigate to="/" />}
            <div className="contact-form">
                <div className="titles-div">
                    <h4>Nous contacter</h4>
                </div>
                <div className="coordonnees">
                    <ul>
                        <li>FC Plateau</li>
                        <li>Siége social: Plateau, terrain de foot FC Plateau</li>
                        <li>Téléphone: <Link to="tel:+221785059831"> 77 505 98 63</Link></li>
                        <li>Email: <Link to ="mailto:academyfc.plateau@gmail.com">academyfc.plateau@gmail.com</Link></li>
                    </ul>
                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.142421286121!2d-13.650415120654294!3d13.770283600250572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xeefd1a69277fad7%3A0xa64692568923621f!2sAcademie%20Fc%20Plateau%2C%20Tamba!5e0!3m2!1sfr!2sfr!4v1682012302368!5m2!1sfr!2sfr" loading="lazy"  title="geolocation du terrain du terrain de foot de l'academie"></iframe>
                </div>
                <form 
                    onSubmit={(e) =>{
                        e.preventDefault()
                        onSubmitForm()
                    }}
                >
                    <div className="form-items">
                        <label htmlFor="fullName">Prenom et NOM: <span>*</span></label>
                        <input 
                            type="text" 
                            id="fullName" 
                            name="fullName" required
                            placeholder="votre prenom et nom"
                            className="form-item"
                            onChange={(e)=>{
                                setFullName(e.currentTarget.value)
                            }}
                        />
                    </div>
                    <div className="form-items">
                        <label htmlFor="email">Email: <span>*</span></label>
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
                        <label htmlFor="phone">Téléphone:</label>
                        <input 
                            type="text" 
                            id="phone" 
                            name="phone"
                            placeholder="votre numéro de téléphone"
                            className="form-item"
                            onChange={(e)=>{
                                setPhone(e.currentTarget.value)
                            }}
                        />
                    </div>
                    <div className="form-items">
                        <label htmlFor="subject">Objet: <span>*</span></label>
                        <input 
                            type="text" 
                            id="subject" 
                            name="subject" required
                            placeholder="Objet "
                            className="form-item "
                            onChange={(e)=>{
                                setSubject(e.currentTarget.value)
                            }}
                        />
                    </div>
                    <div className="form-items full">
                        <label htmlFor="message">Votre message: <span>*</span></label>
                        <textarea maxLength="5000" rows="10" name="message" id="message" className="form-item" placeholder="votre message..."
                            onChange={(e) =>{
                                setMessage(e.currentTarget.value)
                            }}
                        >

                        </textarea>
                    </div>

                    <div className="submit-items">
                        <input type="submit" name="envoyer"/>
                    </div>
                </form>
            </div>
        </section>
    </main>)
}

export default Contact