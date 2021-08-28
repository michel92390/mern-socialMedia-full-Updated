//jshint esversion:6


//cas d'erreurs lors d'un sign up
module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' };

    if (err.message.includes('pseudo')) 
        errors.pseudo = "Pseudo incorrect or already used.";
     
    if (err.message.includes('email')) 
        errors.email = "Email incorrect.";
    
    if (err.message.includes('password')) 
        errors.password = "Password should have at least 6 characters.";
    
    if (err.code===11000 && Object.keys(err.keyValue)[0].includes("email")) 
        errors.email = "Email already used.";

    if (err.code===11000 && Object.keys(err.keyValue)[0].includes("pseudo")) 
        errors.email = "Pseudo already used.";
    
    return errors;

};

module.exports.signInErrors = (err) => {
    let errors = { email: '', password: '' };

    if (err.message.includes('email'))
        errors.email = "Unknown email.";
    
    if (err.message.includes('password'))
        errors.password = "Password does not match.";

        return errors;
};

module.exports.uploadErrors = (err) => {
    let errors = { format: '', maxSize: ""};

    if (err.message.includes('Invalid file'))
        errors.format = "Format not allowed";

    if (err.message.includes('max size'))
        errors.maxSize = "File too big";

    return errors;
};