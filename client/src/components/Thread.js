//jshint esversion:6
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPosts } from "../actions/post.actions";
import Card from "./Post/Card";
import { isEmpty } from "./Utils";

const Thread = () => {
    // si on load des post oui ou non (ici cest oui true)
  const [loadPost, setLoadPost] = useState(true);
  //pour le scroll, on veut a la base 5 post
  const [count, setCount] = useState(5);
  // dispatch pour lancer l'action
  const dispatch = useDispatch();
  // pour recuperer les donnees (posts) et les afficher
  const posts = useSelector((state) => state.postReducer);

  const loadMore = () => {
    // le dire quand on est en bas de la page
    if (window.innerHeight + document.documentElement.scrollTop + 1 > document.scrollingElement.scrollHeight) {
      setLoadPost(true);
    }
  };

  useEffect(() => {
      //si loadpost est sur true, alors tu me les chargent
    if (loadPost) {
      // comme loadpost est sur true, il le fait une fois et il touche plus (false)
      // getpost mais le nmbre de post que lon veut
      dispatch(getPosts(count));
      // quand on la jouer 1 fois, il se met sur false
      setLoadPost(false);
      // et on le relance de 5
      setCount(count + 5);
    }

    //loadmore est une fonction pour charger plus
    window.addEventListener('scroll', loadMore);
    return () => window.removeEventListener('scroll', loadMore);
    // le callback fait quil est censer relancer la fonction chaque fois quune de ces chose la evolue
  }, [loadPost, dispatch, count]);

  return (
    <div className="thread-container">
      <ul>
        {!isEmpty(posts[0]) &&
          posts.map((post) => {
            return <Card post={post} key={post._id} />;
          })}
      </ul>
    </div>
  );
};

export default Thread;
