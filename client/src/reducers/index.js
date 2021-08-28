//jshint esversion:6
//regroupe tous les reducers et les envois vers le store dans index.js
import { combineReducers } from 'redux';
import userReducer from './user.reducer';
import usersReducer from './users.reducer';
import postReducer from './post.reducer';
import errorReducer from './error.reducer';
import allPostsReducer from './allPosts.reducer';
import trendingReducer from './trending.reducer';

//donc on importe tous nos reducer ici et on exporte lui (combineReducer) meme dans index.js
export default combineReducers({
    userReducer,
    usersReducer,
    postReducer,
    errorReducer,
    allPostsReducer,
    trendingReducer
});