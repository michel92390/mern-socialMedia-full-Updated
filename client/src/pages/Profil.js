//jshint esversion:6
import React, { useContext } from 'react';
import Log from '../components/Log';
import { UidContext } from '../components/AppContext';
import UpdateProfil from '../components/profil/UpdateProfil';

// maintenant on peut utilser UidContext pour decider si on veut lui afficher signIn ou signUp
function Profil() {

    //en faisant ca, la variable uid contient l'ID de l'utilisateur si il y est connecter
    const uid = useContext(UidContext);

    return (
        <div className="profil-page">
            {uid ? (
                <UpdateProfil />
            ) : (
                <div className="log-container">
                    <Log signin={false} signup={true} />
                    <div className="img-container">
                        <img src="./img/log.svg" alt="img-log" />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Profil;
