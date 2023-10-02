// chargment du framework express
const express = require("express"); // importé en tant que cadre principal pour la création de l'application Web.
const app = express();

const mysql = require("promise-mysql"); // permet de communiquer en sql avec la BDD 
const cors = require("cors"); // importé pour le partage de ressouces cross-origin
const fileUpload = require('express-fileupload')

const  dotenv = require("dotenv") // importé pour gérer les variables d'environnement.
dotenv.config()

app.use(express.static(__dirname+'/public'))
app.set('views', './views')
app.set('view engine', 'ejs')

let config = require("./config")

app.use(fileUpload({
    createParentPath: true
}))

app.use(cors());
app.use(express.json()) //va nous permettre de transformer nos formats string en format objets
app.use(express.urlencoded({extended: true})) //il peut traduire nos url en objet ou transformer en format json



const host = config.db.host
const database = config.db.database
const user = config.db.user
const password = config.db.password
const secret = config.token.secret

// appel de tous les routes APIs
const userRoutes = require('./routes/userRoutes')
const authRoutes = require('./routes/authRoutes.js')
const articleRoutes = require('./routes/articleRoutes')
const mediaRoutes = require('./routes/mediaRoutes')

mysql.createConnection({
    host: host,
    database: database,
    user: user,
    password: password
}).then((db) =>{
    console.log('vous êtes connecté à la BDD')
    setInterval(async function() {
        let res = await db.query('SELECT 1')
    }, 10000)

    app.get("/", (req, res, next) =>{
        res.json({status: 200, msg: "Bienvenue sur le site de FC Plateau Tamba"})
    })

    // appel de mes routes
    userRoutes(app, db, secret)
    authRoutes(app, db, secret)
    articleRoutes(app, db, secret)
    mediaRoutes(app, db, secret)


})
.catch(err => console.log(err))

const PORT = process.env.PORT || 9501;
app.listen(PORT, () =>{
    console.log(`Listen port ${PORT} is ok`)
})