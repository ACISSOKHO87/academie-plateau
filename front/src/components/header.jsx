import React, { useState } from 'react'

import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux' 
import { selectUser } from '../slices/userSlice'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark, faBook, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'

const Header = () => {

    // on récupère le state user dans le store
    const user = useSelector(selectUser)
    // state pour la visualisation du menu
    const [showMenu, setShowMenu] = useState(false)
    // state pour la visualisation du menu administration (PopUp)
    const [isPopUp, setIsPopUp] = useState(false)

    return (<header>
        <div className="header">
            <div className="header-top-container">
                <Link to="/" title="Accueil">FCPLATEAU.COM</Link>
                <Link to="#" title="Page Facebook"><FontAwesomeIcon icon={faFacebook} className="fontawesome"/></Link>
            </div>
            <div className="header-icons-container">
                <ul>
                    <li
                        onClick={() =>{
                            setShowMenu(!showMenu)
                        }}
                    > 
                        <FontAwesomeIcon icon={showMenu ? faXmark : faBars} className="fontawesome"/>
                        {showMenu ? <p>FERMER</p>: <p>MENU</p>}
                    </li>
                    <li>
                        <Link
                            to="/"
                            title="Accueil"
                            className="header-logo-container"
                        >
                            <div className="header-logo-academie">
                                {/** logo de l'académie en background **/}
                            </div>
                        </Link> 
                    </li>   
                    <li
                        onClick={() => {
                            setIsPopUp(!isPopUp)
                        }}
                    >
                        <Link to = {user.isLogged ? "#" : "/login"} title="login/logout/Admin" ><FontAwesomeIcon icon={faUser} className="fontawesome"/></Link> 
                    </li>                   
                </ul>
            </div>
        </div>
        
        <div className={showMenu ? "header-sidebar-container is-open" : "header-sidebar-container"}>
            <div className="sidebar-inner">
                <div className="sidebar-content">
                    <ul>
                        <li
                            onClick={() =>{
                                setShowMenu(!showMenu)
                            }}
                        >
                            <Link to="/" title="Accueil">Accueil</Link>
                        </li>
                        <li
                            onClick={() =>{
                                setShowMenu(!showMenu)
                            }}
                        >
                            <Link to="/academie" title="Historique de l'académie">L'academie</Link>
                        </li>
                        <li
                            onClick={() =>{
                                setShowMenu(!showMenu)
                            }}
                        >
                            <Link to="/galerie" title="Galérie des photos">Galerie</Link>
                        </li>
                        <li
                            onClick={() =>{
                                setShowMenu(!showMenu)
                            }}
                        >
                            <Link to="/contact" title="Contact">Contact</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <ul>
                    <li
                    className={ showMenu || isPopUp ? "menu-invisible-item" : "hidden"}
                    onClick={() =>{
                        setShowMenu(false)
                        setIsPopUp(false)
                    }}
                    >
                    </li>
                </ul>
           </div>
        </div>
            
        <div className={isPopUp ? "header-user-login login-dropdown-items" : "header-user-login" }>
            {
                user.isLogged && <ul>
                    <li 
                        onClick={() => {
                            setIsPopUp(!isPopUp)
                        }}
                    >
                        <Link to="/admin" title="Administrateur">
                            <FontAwesomeIcon icon={faBook} className="fontawesome"/>
                            <p>Administration</p>
                        </Link>
                        <Link to="/logout" title="Déconnexion">
                            <FontAwesomeIcon icon={faRightFromBracket} className="fontawesome"/>
                            <p>Déconnexion</p>
                        </Link>
                    </li>
                </ul>
            }
        </div> 
    </header>)
}

export default Header