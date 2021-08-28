//jshint esversion:6
import axios from 'axios';


// une action qui permet de recuperer notre utilisateuret on se les dipatch(envoi) a notre reducteur
// et qui par la suite nous les mettra dans notre store
export const GET_USER = "GET_USER";
export const UPLOAD_PICTURE = "UPLOAD_PICTURE";
export const UPDATE_BIO = "UPDATE_BIO";
export const FOLLOW_USER = "FOLLOW_USER";
export const UNFOLLOW_USER = "UNFOLLOW_USER";

export const GET_USER_ERRORS = "GET_USER_ERRORS";

export const getUser = (uid) => {
    return (dispatch) => {
        // on veut les information de notre utilisateur, on communique qvec la base de donnee
        return axios
            .get(`${process.env.REACT_APP_API_URL}api/user/${uid}`)
            .then((res) => {
                //ca part au reducer et on lui dit:
                dispatch({ type: GET_USER, payload: res.data});
            })
            .catch((err) => console.log(err));
    };
};

export const uploadPicture = (data, id) => {
    // dispatch est pour envoyer au reducer qqc
    return (dispatch) => {
        // avant d'envoyer au reducer , on envoi la data a notre base de donnees
        return axios
            .post(`${process.env.REACT_APP_API_URL}api/user/upload`, data)
            .then((res) => {
                //tester si erreur 
                if (res.data.errors) {
                    dispatch({ type: GET_USER_ERRORS, payload: res.data.errors });
                } else {
                    dispatch({ type: GET_USER_ERRORS, payload: '' });
                     //pour recuperer la donnees envoyer plus h
                    return axios
                        .get(`${process.env.REACT_APP_API_URL}api/user/${id}`)
                        .then((res) => {
                            // recupere le chemin et on se l'envoi dans notre store
                            dispatch({ type: UPLOAD_PICTURE, payload: res.data.picture });
                        });
                }
            })
            .catch((err) => console.log(err));
    };
};

export const updateBio = (userId, bio) => {
    return (dispatch) => {
        return axios({
            method: "put",
            url: `${process.env.REACT_APP_API_URL}api/user/` + userId,
            data: { bio }
        })
        .then((res) => {
            dispatch({ type: UPDATE_BIO, payload: bio });
        })
        .catch((err) => console.log(err));
    };
};

export const followUser = (followerId, idToFollow) => {
    return (dispatch) => {
        return axios({
            method: 'patch',
            url: `${process.env.REACT_APP_API_URL}api/user/follow/` + followerId,
            data: {idToFollow}
        })
        .then((res) => {
            dispatch({ type: FOLLOW_USER, payload: {idToFollow}});
        })
        .catch((err) => console.error(err));
    };
};

export const unfollowUser = (followerId, idToUnFollow) => {
    return (dispatch) => {
        return axios({
            method: 'patch',
            url: `${process.env.REACT_APP_API_URL}api/user/unfollow/` + followerId,
            data: {idToUnFollow}
        })
        .then((res) => {
            dispatch({ type: UNFOLLOW_USER, payload: {idToUnFollow}});
        })
        .catch((err) => console.error(err));
    };
};