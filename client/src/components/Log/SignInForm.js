//jshint esversion:6
import React, { useState } from 'react';
import axios from 'axios';

function SignInForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        //pour gerer les erreurs
        const emailError = document.querySelector('.email.error');
        const passwordError = document.querySelector('.password.error');

        //avec url on va chercher dans le back le lien qu'on a fait pour se log in.
        // et on passe la data qui est demander dans le log in page in back
        // auth.controller.js signIn function
        axios({
            method: "post",
            url: `${process.env.REACT_APP_API_URL}api/user/login`,
            withCredentials: true,
            data: {
                email,
                password,
            }
        })
        .then((res) => {
            console.log(res);
            if (res.data.errors) {
                emailError.innerHTML = res.data.errors.email;
                passwordError.innerHTML = res.data.errors.password;
            } else {
                window.location = '/';
            }
        })
        .catch((err) => {console.log(err);
        });
    };

    return (
        <form action="" onSubmit={handleLogin} id="sign-up-form" >
            <label htmlFor="email">Email</label>
            <br />
            {/* recuperer la valeur de l'input avec onChange */}
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
            <input type="submit" value="login" />
        </form>
    )
}

export default SignInForm;
