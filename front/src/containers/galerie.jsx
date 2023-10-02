import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectArticles } from '../slices/articleSlice'
import { getAllMedia } from '../api/media'
import { config } from '../config'
import Carousel from '../components/carousel'


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import { Helmet } from 'react-helmet-async'

const Galerie = () => {

    // on récupère tous les articles dans le store
    const myArticles = useSelector(selectArticles)
    // state tableau des média
    const [medias, setMedias] = useState([])
    // media index in medias table    
    const [indexMedia, setIndexMedia ] = useState(0)
    // state pour la cattousel d'image
    const [showCarrousel, setShowCarrousel] = useState(false)
    
    
    useEffect(() => {
        // on récupère les médias dans la BDD
        getAllMedia()
            .then((res) =>{
                if(res.status === 200){
                    setMedias(res.results)
                }
            })
            .catch((err) => {console.log(err)})
    },[])

    return (<main>
        <div className="retour-accueil">
            <Link to="/" title="Accueil"><FontAwesomeIcon icon={faChevronLeft} className="fontawesome"/> Accueil </Link>
        </div>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Galérie | FC Plateau - site officiel</title>
            <meta name="description" content="Galérie : l'ensemble des photos des articles en ligne de l'académie FC plateau Tamba"/>
            <link rel="canonical" href="/galerie" />
        </Helmet>
        <section className="galerie-container">
            <h2>La galérie</h2>
            {medias.length !== 0 && <div className="medias-article-container">
                {
                    medias.map((media, index) => {
                        return <div className="gallery" key={index}
                            onClick={(e) => {
                                e.preventDefault()
                                setIndexMedia(index)
                                setShowCarrousel(!showCarrousel)
                            }}
                        >
                            <img src={config.photo_url + media.url} alt={media.name} loading="eager" title={media.url} loading="lazy"/>
                        </div>
                    })
                }
            </div>}
            {showCarrousel && <Carousel medias={medias} indexMedia={indexMedia} setShowCarrousel={setShowCarrousel} />}
        </section>
    </main>)
}

export default Galerie