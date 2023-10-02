export const validateInputField = (label, type, value) => {
    
    if(value===""){
        return `Votre champ ${label} ne doit pas être vide!`
    }
    
    switch (type) {
        //si c'est email
        case "email":
            // on test le mail à l'aide d'un regex qui teste les mails (pour tester un regex on utilise la fonction test sur regmail)
            const regMail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            
            // si le test du regex est faux
            if(regMail.test(value) === false){
                //alors on retourne une string d'erreur
                return `Vote champ ${label} n'est pas au bon format!`
            }
        break;
        //si c'est password
        case "password":
            // on test le mot de passe à l'aide d'un regex qui teste les strings pour avoir 8 chiffres,
             // lettre, majuscule, minuscule, caractère spécial
            const regPass = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/;
            
            // si le test du regex est faux
            if(regPass.test(value) === false){
                //alors on retourne une string d'erreur
                return `Le champ ${label} doit contenir minimum 8 caractères et au moins: un chiffre, une lettre majuscule, une lettre minuscule et un caractère spécial!`
            }
        break; 
       
    }
    
    // si tout va bien on retourne true, le champ de formulaire est validé
    return true;   
}