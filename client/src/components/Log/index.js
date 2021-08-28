//jshint esversion:6
import React, { useState } from 'react';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';

function Log(props) {

    //props pour donner un etat de base, ici on decide que de base il doit etre sur register
    // signin, signup pour decider quelle modal on veut afficher au client en premier et ainsi on peut changer selon la neccessite
    const [signUpModal, setSignUpModal] = useState(props.signup);
    const [signInModal, setSignInModal] = useState(props.signin);

    //fonction pour faire apparaitre le form en fonction de ce que l'on clique
    const handleModals = (e) => {
        if (e.target.id === 'register') {
            setSignInModal(false);
            setSignUpModal(true);
        } else if (e.target.id === 'login') {
            setSignInModal(true);
            setSignUpModal(false);
        }
    };

    return (
        <div className="connection-form">
            <div className="form-container">
                <ul>
                    {/* si register est actif, on envoi la classe active-btn au boutton */}
                    <li onClick={handleModals} id="register" className={signUpModal?"active-btn":null}>Register</li>
                    <li onClick={handleModals} id="login" className={signInModal?"active-btn":null}>Log In</li>
                </ul>
                {/* si signupmodal est true, tu m'affiche signupform et si signinmodal est true, tu m'affiche sugninform */}
                {signUpModal && <SignUpForm />}
                {signInModal && <SignInForm />}
            </div>
        </div>
    )
}

export default Log;
