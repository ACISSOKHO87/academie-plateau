import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from "react-router-dom"
import { getOneArticleById } from '../api/article'
import { getMediaByArticleId } from '../api/media'
import { config } from '../config'
import Carousel from '../components/carousel'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import { Helmet } from 'react-helmet-async'

const DetailArticle = () => {

    // constant pour la récupération du paramètre ID de l'article
    const params = useParams()
    // state pour la récupération des données d'article
    const [myArticle, setMyArticle] = useState([])
    // state pour la récupération des médias liées à l'article
    const [medias, setMedias] = useState([])
    // media index in medias table
    const [indexMedia, setIndexMedia ] = useState(0)
    // state pour la cattousel d'image
    const [showCarrousel, setShowCarrousel] = useState(false)

    useEffect(() =>{
        // on récupère les données de l'articles
        getOneArticleById(params.id)
            .then((res) =>{
                if(res.status === 200){
                    // on remet à jour le tableau de l'article
                    setMyArticle(res.result)
                    // on récupère les médias de l'article dans la BDD
                    getMediaByArticleId(res.result.id)
                        .then((resp) =>{
                            console.log("media: ", resp.results)
                            // on met à jour le tableau des médias
                            setMedias(resp.results)
                        })
                        .catch((err) => console.log(err))
                }
            })
            .catch((err) => console.log(err))
    },[])

    return ( <main> 
        <div className="retour-accueil">
            <Link to="/" title="Accueil"><FontAwesomeIcon icon={faChevronLeft} className="fontawesome"/> Accueil </Link>
        </div>
        {myArticle.length !== 0 && <section className="detail-container">
            <Helmet>
                <meta charSet="utf-8" />
                <title>FC Plateau - site officiel</title>
                <meta name="description" content={`${myArticle.contents.substring(0, 60)}...`}/>
                <link rel="canonical" href={`/detailArticle/${params.id}`} />
            </Helmet>
            <div className="article-infos-container">
                <div className="article-infos">
                    <div className="titles-div">
                        <h4 className="infos-article-title">{myArticle.title}</h4>
                    </div>
                    <div className="infos-article-contents">
                        <p> { myArticle.contents } </p>
                    </div>
                </div>
                <div className="item-inner">
                    <div className="infos-articles">
                        <span className="infos-actualite">Article </span>
                        <span className="infos-article-date">
                            | <time dateTime={myArticle.creationTimestamp}>{ new Date(myArticle.creationTimestamp).toLocaleDateString()} </time> 
                        </span>
                    </div>
                </div>
            </div>
           {medias.length !== 0 && <div className="detail-medias-container">
                {
                    medias.map((media, index) => {
                        return <div className="gallery-detail" key={index}
                            onClick={(e) => {
                                e.preventDefault()
                                setIndexMedia(index)
                                setShowCarrousel(!showCarrousel)
                            }}
                        >
                            <img src={config.photo_url + media.url} alt={media.name} loading="lazy" />
                        </div>
                    })
                }
            </div>}
            {showCarrousel && <Carousel medias={medias} indexMedia={indexMedia} setShowCarrousel={setShowCarrousel} />}
        </section>}
    </main> )
}

export default DetailArticle