//jshint esversion:6

import { 
    GET_POSTS, 
    LIKE_POST, 
    UNLIKE_POST, 
    UPDATE_POST, 
    DELETE_POST, 
    EDIT_COMMENT, 
    DELETE_COMMENT 
} from "../actions/post.actions";

//stocker les information du user que l'on pourra ensuite utiliser ou l'on veut

const initialState = {};

export default function postReducer(state = initialState, action) {
    switch (action.type) {
        case GET_POSTS:
            return action.payload;
        case LIKE_POST:
            return state.map((post) => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        likers: [action.payload.userId, ...post.likers]
                    };
                }
                //sinon il ne retourne pas les post, uniquement celui liker
                return post;
            });
        case UNLIKE_POST:
            return state.map((post) => {
                if (post._id === action.payload.postId) {
                    return {
                        //tu retourne le post tel quil est et...
                        ...post,
                        // ... le tableau des likers en retirant le id
                        likers: post.likers.filter((id) => id !== action.payload.userId)
                    };
                }
                //sinon il ne retourne pas les post, uniquement celui liker
                return post;
            });
        case UPDATE_POST:
            return state.map((post) => {
                // on sidentifie le msg en question
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        message: action.payload.message
                    };
                } else return post;
            });
        case DELETE_POST:
            return state.filter((post) => post._id !== action.payload.postId);
        case EDIT_COMMENT:
            // 1 recherche pour trouver le post
            return state.map((post) => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        // 1 recherche pour trouver le commentaire
                        comments: post.comments.map((comment) => {
                            if (comment._id === action.payload.commentId) {
                                return {
                                    ...comment,
                                    text: action.payload.text
                                }
                            } else {
                                return comment;
                            }
                        }),
                    };
                } else return post;
            });
        case DELETE_COMMENT:
            return state.map((post) => {
                if (post._id === action.payload.postId) {
                    return {
                        ...post,
                        comments: post.comments.filter((comment) => comment._id !== action.payload.commentId)
                    };
                } else return post;
            });
        
        default:
            return state;
    }
}