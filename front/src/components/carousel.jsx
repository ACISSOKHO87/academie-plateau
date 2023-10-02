import React, { useState, useEffect } from "react"
import { config } from "../config"
import { Helmet } from 'react-helmet-async'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleLeft, faArrowAltCircleRight, faCircleXmark} from '@fortawesome/free-regular-svg-icons'

const Carousel = ({ medias, indexMedia, setShowCarrousel }) => {
    // state de l'index de la photo courante
    const [indexCurrent, setIndexCurrent] = useState(0)
    // state tableau des mdédia
    const [myMedias, setMyMedias] = useState([])

    const  onSliderGoToNext = () => { 
        indexCurrent < myMedias.length -1 ? setIndexCurrent((index) => index +1) : setIndexCurrent((index) => myMedias.length -1)
    }
    
    const onSliderGoToPrevious = () => {
        indexCurrent > 0 ? setIndexCurrent((index) => index - 1) : setIndexCurrent((index) => 0)
    }

    useEffect(() => {
        setIndexCurrent(indexMedia)
        setMyMedias([...medias])
    },[])

    return (<section className="carousel-photo">
        <Helmet>
            <meta charSet="utf-8" />
            <title>Photos | FC Plateau - Site officiel</title>
            <meta name="description" content="Site officiel de l'académie FC Plateau: Carousel(daiporama) de toutes les photos des articles en lignes du site"/>
            <link rel="canonical" href="/galerie" />
        </Helmet>
        <div
            className="close"
            onClick={(e) => {
                e.preventDefault()
                setShowCarrousel(false)
            }}
        >
            <FontAwesomeIcon icon={faCircleXmark} className="fontawesome"/> 
        </div>
        <div className="carousel-media-container">
            {myMedias.length !== 0 &&<div className="container-control">
                <figure className="slide">
                    <img key={myMedias[indexCurrent].id} src={config.photo_url + myMedias[indexCurrent].url} alt={myMedias[indexCurrent].name}  />
                    <figcaption>{indexCurrent + 1}/{myMedias.length}</figcaption>
                </figure>
                <button onClick = {onSliderGoToPrevious} > <FontAwesomeIcon icon={faArrowAltCircleLeft} className="fontawesome"/> </button>
                <button onClick = {onSliderGoToNext} > <FontAwesomeIcon icon={faArrowAltCircleRight} className="fontawesome"/></button>
            </div>}
        </div>
    </section>)
}

export default Carousel