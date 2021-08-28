//jshint esversion:6
import React from 'react';
import axios from 'axios';

//pour supprimer le cookie frontalement
import cookie from "js-cookie";


function Logout() {

    // on se retire le cookie en front
    const removeCookie = (key) => {
        if (window !== "undefined") {
            cookie.removeCookie(key, {expires: 1});
        }
    };

    // on se retire le cookie en back
    const logout = async () => {
        await axios({
            method: "get",
            url: `${process.env.REACT_APP_API_URL}api/user/logout`,
            withCredentials: true,
        })
            // mais aussi en front par securite avec remove cookie function
            .then(() => removeCookie('jwt'))
            .catch((err) => console.log(err));

        // que ca marche ou pas, on interroge si le cookie est present, cest comme reactualiser les informations
        // (checkUser (index.js) back)
        // pour eviter de le faire soi-meme et voir le changement automatiquement
        window.location = "/";
    };

    return (
        <li onClick={logout}>
            <img src="./img/icons/logout.svg" alt="logout" />
        </li>
    )
}

export default Logout;
