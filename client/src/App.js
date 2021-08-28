//jshint esversion:6
import React, { useState, useEffect } from 'react';
import Routes from './components/Routes';
import { UidContext } from './components/AppContext';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { getUser } from './actions/user.actions';

function App() {

  const [uid, setUid] = useState(null);

  //pour appeler les data de l'utilisateur
  const dispatch = useDispatch();

  //a chaque fois que l'on va lancer le component, ca va lancer ce useEffect
  // et ce useEffect va controler le token de l'utilisateur
  // jwtid 
  useEffect(() => {
    const fetchToken = async() => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}jwtid`,
        withCredentials: true,
      })
      .then((res) => setUid(res.data))
      .catch((err) => console.log("No token"));
    };
    fetchToken();

    // apres avoir verifier que l'utilisateur est connecter, on fait l'action d'aller chercher la data qui correspond a ce uid et on se l'affiche dans notre store
    // on remet uid en parametre comme dans la fonction user.action.js
    if (uid) dispatch(getUser(uid));
  }, [uid, dispatch]);

  //donc nous a chaque fois que on va appeler dans nimporte quel context on aura la possibilite d'avoir le id de notre utilisateur
  // avec uid
  return (
    <UidContext.Provider value={uid}>
      <Routes />
    </UidContext.Provider>
  );
}

export default App;
