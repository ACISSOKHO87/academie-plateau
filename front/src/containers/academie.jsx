import React from 'react'
import { Link } from 'react-router-dom'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import { Helmet } from 'react-helmet-async'
import ReactPlayer from 'react-player'
import SeydouInterview from '../assets/video/Fc_Plateau.mp4'

const Academie = () => {
    return (<main>
        <Helmet>
            <meta charSet="utf-8" />
            <title>Historique | FC Plateau - Site officiel</title>
            <meta name="description" content="Site officiel de l'académie FC Plateau: Historique de l'académie dépuis ça création en 2012"/>
            <link rel="canonical" href="/academie" />
        </Helmet>
        <div className="retour-accueil">
                <Link to="/" title="Accueil"><FontAwesomeIcon icon={faChevronLeft} className="fontawesome"/> Accueil </Link>
        </div>
        <section className="academie-section">
            <h2>L'académie FC Plateau Tamba</h2>
            <div className="player" >
                <ReactPlayer 
                    url={SeydouInterview}
                    controls
                    playing
                    muted
                    width="100%"
                    height="100%"
                />
                <p><Link to="https://www.youtube.com/watch?v=uAUqY03scso&t=8s" target="_blank"><em>source: youtube Tamba'Actu</em></Link></p>
            </div>
            <div className="history">
                <p>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor at consequatur, error qui ex aliquid enim suscipit unde odit alias, assumenda voluptatum blanditiis a iste natus earum id nisi nesciunt!
                    Mollitia modi nesciunt ex delectus fugit dignissimos rerum soluta temporibus consectetur magnam corporis doloribus corrupti quod dolores, adipisci eligendi deleniti saepe quas incidunt? Officia maxime obcaecati, neque iste quos eaque?
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Et cupiditate sint voluptatibus consequuntur quod in aliquam ullam ratione, fuga laudantium quam esse mollitia ipsa, veritatis, amet molestias delectus hic temporibus.
                    Quas consectetur at sunt odio omnis, aut dolorum a quo voluptatibus facere eaque ab nesciunt harum. Ea explicabo fugit ipsum ullam nostrum, sit eveniet eum repudiandae aliquam sapiente amet quasi!
                    Facilis doloribus qui pariatur laboriosam, sint ullam ratione sapiente totam eius. Impedit quia recusandae, delectus laudantium blanditiis, explicabo beatae dolorem illum esse mollitia itaque. Labore sunt quidem expedita ducimus magni?
                </p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate facere fugiat error. Rerum nulla aspernatur aut magni earum illum et ex. Deleniti laboriosam dicta facere ullam in, iste nam officia!
                    Optio, ullam vitae doloribus consectetur quae possimus quibusdam libero dolore quia eaque ut quam quod deleniti quas debitis autem expedita omnis soluta mollitia beatae officiis sed. Neque, magnam. Nobis, quo?
                    Veritatis, dolorum suscipit voluptatum doloremque, dicta dignissimos reiciendis distinctio incidunt laboriosam numquam omnis amet assumenda similique, deleniti nemo expedita aliquid quia! Blanditiis, veniam corrupti? Deserunt beatae vitae aspernatur delectus ullam!
                </p>
            </div>
        </section>
    </main>)
}

export default Academie