//jshint esversion:6
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { UidContext } from './AppContext';
import Logout from './Log/Logout';


function Navbar() {

    //tester si lutilisateur a ses donnees avec l'uid
    // faire interagir la navbar en fonction de si le id existe
    const uid = useContext(UidContext);

    //pour recuperer le nom de l'utilisateur
    const userData = useSelector((state) => state.userReducer);

    return (
        <nav>
            <div className="nav-container">
                <NavLink exact to="/">
                    <div className="logo">
                        <img src="./img/icon.png" alt="icon" />
                        <h3>Star Blog</h3>
                    </div>
                </NavLink>
            {uid ? (
                <ul>
                    <li></li>
                    <li className="welcome">
                        <NavLink exact to="/profil">
                            <h5>Welcome {userData.pseudo}</h5>
                        </NavLink>
                    </li>
                    <Logout />
                </ul>
            ) : (
                <ul>
                    <li></li>
                    <li>
                        <NavLink exact to="/profil">
                            <img src="./img/icons/login.svg" alt="login" />
                        </NavLink>
                    </li>
                </ul>
            )}
            </div>
        </nav>
    )
}

export default Navbar;
