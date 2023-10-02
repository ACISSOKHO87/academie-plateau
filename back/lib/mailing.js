//on importe  la librairie nodemailer
const nodeMailer = require('nodemailer')
let config = require("../config")

module.exports = (mailTo, subject, title, text) => {
   //création du transport du mail pret à partir (préparation)
    let transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: config.auth.user,
            pass: config.auth.pass
            }
    });
    
    //création du mail
    let mailOptions = {
        from: '"FC PLATEAU TAMBA" <academyfc.plateau@gmail.com>', //qui envoi
        to: mailTo, //qui recoit
        subject: subject, //ligne du sujet
        text: "", //texte de corps
        html: `<h1>${title}</h1><p>${text}</p>` //on peut carrément créer du contenu html
    }
    
    //envoi du mail avec une callback pour voir si ça a réussi
    transporter.sendMail(mailOptions, (err, info)=>{
        if(err) {
            console.log("Impossible d'envoyer le message")
            return
        }
        console.log("Le message a été envoyé: ", info.envelope, info.response)
    })
}