//jshint esversion:6
import React, { useState }from 'react';
import axios from 'axios';
import SignInForm from './SignInForm';


function SignUpForm() {

    //pour checker si le formulaire est a ete soumis
    const [formSubmit, setFormSubmit] = useState(false);

    const [pseudo, setPseudo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [controlPassword, setControlPassword] = useState('');


    // function pour lorsque l'on submit le form
    const handleRegister = async (e) => {
        e.preventDefault();
        // chercher tous les element d'erreurs possible
        const terms = document.getElementById('terms');
        const pseudoError = document.querySelector('.pseudo.error');
        const emailError = document.querySelector('.email.error');
        const passwordError = document.querySelector('.password.error');
        const passwordConfirmError = document.querySelector('.password-confirm.error');
        const termsError = document.querySelector('.terms.error');

        //pour effacer apres chaque refersh de la pages
        passwordConfirmError.innerHTML= "";
        termsError.innerHTML= "";


        if (password !== controlPassword || !terms.checked) {
            if (password !== controlPassword) {
                passwordConfirmError.innerHTML = "Password does not match";
            }
            if (!terms.checked) {
                termsError.innerHTML = "You should accept the general conditions";
            }
        } else {
            // si on passe les validations
            // on envoi des donnees a la base de donnees
            await axios({
                method: "post",
                url: `${process.env.REACT_APP_API_URL}api/user/register`,
                data: {
                    pseudo,
                    email,
                    password
                }
            })
            //ca ce sont les reponses deja enregistrer en back
            .then((res) => {
                console.log(res);
                if (res.data.errors) {
                    pseudoError.innerHTML = res.data.errors.pseudo;
                    emailError.innerHTML = res.data.errors.email;
                    passwordError.innerHTML = res.data.errors.password;
                } else {
                    // si il n'y a pas de probleme on met setFormSubmit sur true.
                    setFormSubmit(true);
                }
            })
            .catch((err) => console.log(err));
        }
    };

    return (
        <>
        {formSubmit ? (
            <>
            <SignInForm />
            <span></span>
            <h4 className="success">Successfully registered! Please, Log in</h4>
            </>
        ) : (
            <form action="" onSubmit={handleRegister} id="sign-up-form">
                <label htmlFor="pseudo">Pseudo</label>
                <br />
                <input 
                    style={{color:"white"}}
                    type="text" 
                    name="pseudo" 
                    id="pseudo" 
                    onChange={(e) => setPseudo(e.target.value)} 
                    value={pseudo}
                />
                <div className="pseudo error"></div>
                <br />
                <label htmlFor="email">Email</label>
                <br />
                <input 
                    style={{color:"white"}}
                    type="text" 
                    name="email" 
                    id="email" 
                    onChange={(e) => setEmail(e.target.value)} 
                    value={email}
                />
                <div className="email error"></div>
                <br />
                <label htmlFor="password">Password</label>
                <br />
                <input 
                    style={{color:"white"}}
                    type="password" 
                    name="password" 
                    id="password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    value={password}
                />
                <div className="password error"></div>
                <br />
                <label htmlFor="password-conf">Confirmation Password</label>
                <br />
                <input 
                    style={{color:"white"}}
                    type="password" 
                    name="password" 
                    id="password-conf" 
                    onChange={(e) => setControlPassword(e.target.value)} 
                    value={controlPassword}
                />
                <div className="password-confirm error"></div>
                <br />
                <input type="checkbox" id="terms" />
                <label htmlFor="terms">Accept <a href="/" target="_blank" rel="noopener norefer">general conditions</a></label> 
                <div className="terms error"></div>
                <br />
                <input type="submit" value="Valider inscription" />
            </form>
        )}
        </>
    )
}

export default SignUpForm;
