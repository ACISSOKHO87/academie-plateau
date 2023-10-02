import React, { useState, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Helmet } from "react-helmet-async"
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { selectArticles } from "../slices/articleSlice"
import { getAllMedia } from '../api/media';
import { config } from '../config';
import SeydouInterview from '../assets/video/Fc_Plateau.mp4'
import Logo from '../assets/images/logo-plateau.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleInfo} from '@fortawesome/free-solid-svg-icons'

const Home = () => {

    // on instancie le dispatch pour 
    const dispatch = useDispatch()
    // on récupères les articles dans le store
    const myArticles = useSelector(selectArticles)
    // on stock dans un tableau les urls de tous les médias liés au articles
    const [photos, setPhotos] = useState([])

    const infosMedia = (id) => {
        console.log(photos.filter((photo) => photo.article_id === id))
        return photos.filter((photo) => photo.article_id === id)    
    }
    
    useEffect(() => {
        getAllMedia()
            .then((resp) => {
                if(resp.status === 200) {
                    setPhotos([...resp.results])
                } 
            })         
            .catch((err) =>{console.log(err )})
                
    },[])

    return (<main>
        <Helmet>
            <meta charSet="utf-8" />
            <title>FC Plateau - Site officiel de l'académie FC Plateau</title>
            <meta name="description" content="Site officiel de l'académie FC Plateau: toute l'actualité de l'académie, photo et contact en ligne"/>
            <link rel="canonical" href="/" />
        </Helmet>
        <section className="home-container">
            <div className="first-div-acceuil">
                <div className="row-item">
                    <h1>Académie plateau football club</h1>
                    <h2>Fc plateau</h2>
                </div>
            </div>
            <div className="div-about-container">
                <div className="about-fc">
                    <div className="about-row">
                        <div className="about-row-video-container">
                            <ReactPlayer 
                                url={SeydouInterview}
                                controls
                                playing = {false}
                                muted
                                width="100%"
                                height="100%"
                            />
                            <p><Link to="https://www.youtube.com/watch?v=uAUqY03scso&t=8s" target="_blank"><em>source: youtube Tamba'Actu</em></Link></p>
                        </div>
                        <div className="about-propos-container">
                            <h3 className="subtitle">L'académie FC Plateau Tamba</h3>
                            <p></p>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui, impedit modi excepturi error corporis possimus aspernatur minus quo quisquam harum quibusdam commodi neque nobis asperiores debitis. Voluptatibus vel magnam ipsam.
                            </p>
                            <p>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Et cupiditate sint voluptatibus consequuntur quod in aliquam ullam ratione, fuga laudantium quam esse mollitia ipsa, veritatis, amet molestias delectus hic temporibus...
                            </p>
                            
                            <div>
                                <Link to="/academie" className="link-about-academie" title="Historique de l'académie"><FontAwesomeIcon icon={faCircleInfo} className="fontawesome"/> Historique</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="div-container-article">
                <div className="titles-div">
                    <h4>Actualités récentes</h4>
                </div>
                <div className="last-articles-container">
                    {
                       myArticles !== null && <div className="last-articles">
                            {
                                myArticles.articles.map((post, index) => {
                                    if(post.online === 1 && photos.length !== 0){
                                        let infosM = infosMedia(post.id)
                                        return <Link to={`/detailArticle/${post.id}`} className="link-detail-article" key={index} >
                                            <div className="img-container">
                                                <div className="img-hover">
                                                {infosM.length !== 0 ? <img src={config.photo_url + infosM[0].url} alt={infosM[0].name} loading="lazy" /> : <img src={Logo} alt="Logo de l'academie FC Plateau" loading="lazy"/>}
                                                </div>
                                            </div>
                                            <div className="item-inner">
                                                <div className="infos-articles">
                                                    <span className="infos-actualite">Article </span>
                                                    <span className="infos-article-date">
                                                        | <time dateTime={post.creationTimestamp}>{ new Date(post.creationTimestamp).toLocaleDateString()} </time>
                                                    </span>
                                                </div>
                                                <h5 className="infos-article-title">{post.title}</h5>
                                            </div>
                                    </Link>      
                                    }                              
                                })
                            }
                        </div>
                    }
                </div>
            </div>
        </section>
    </main>)
}
export default Home 