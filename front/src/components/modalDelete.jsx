import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faXmark } from '@fortawesome/free-solid-svg-icons'

const ModalDelete = ({ deleteArticle, setRemoveArticle }) => {
    return (
        <section className="modal-container">
            <div
                className="close"
                onClick={(e) => {
                    e.preventDefault()
                    setRemoveArticle()
                }}
            >
                <FontAwesomeIcon icon={faXmark} className="fontawesome"/> 
            </div>
            <div className="modal">
                <FontAwesomeIcon icon={faTrashCan} className="fontawesome" />
                <p>
                    Veuillez confirmer la suppréssion ! 
                </p>
                <div className="confirm-delete">
                    <button 
                        className="confirmer"
                        onClick={(e) =>{
                            e.preventDefault()
                            deleteArticle()
                        }}
                    >
                        Suprimer
                    </button>
                    <button 
                        className="annuler"
                        onClick={(e) =>{
                            e.preventDefault()
                            setRemoveArticle(false)
                        }}
                    >
                        Annuler
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ModalDelete