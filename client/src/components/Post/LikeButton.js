//jshint esversion:6
import React, { useContext, useEffect, useState } from "react";
import { UidContext } from "../AppContext";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { useDispatch } from "react-redux";
import { likePost, unlikePost } from "../../actions/post.actions";

const LikeButton = ({ post }) => {
    // liker ou pas de base (non)
  const [liked, setLiked] = useState(false);
  // simplement travailler avec ce que on a stocker dans useContext
  const uid = useContext(UidContext);
  const dispatch = useDispatch();

  const like = () => {
    dispatch(likePost(post._id, uid));
    setLiked(true);
  };

  const unlike = () => {
    dispatch(unlikePost(post._id, uid));
    setLiked(false);
  };

  // post.likers cest le tableau qui regroupe tous les gens qui ont like ce post
  useEffect(() => {
    if (post.likers.includes(uid)) setLiked(true);
    else setLiked(false);
    // relance le useEffect qui tu as luid, post.likers ou liked est incrementer dune maniere ou dune autre
  }, [uid, post.likers, liked]);

  return (
    <div className="like-container">
        {/* si utilisateur pas connecter */}
      {uid === null && (
        <Popup
          trigger={<img src="./img/icons/heart.svg" alt="like" />}
          position={["bottom center", "bottom right", "bottom left"]}
          closeOnDocumentClick
        >
          <div style={{color: "black"}}>Log in to like a post ! </div>
        </Popup>
      )}
      {uid && liked === false && (
        <img src="./img/icons/heart.svg" onClick={like} alt="like" />
      )}
      {uid && liked && (
        <img src="./img/icons/heart-filled.svg" onClick={unlike} alt="unlike" />
      )}
      <span>{post.likers.length}</span>
    </div>
  );
};

export default LikeButton;