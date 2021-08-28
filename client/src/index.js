//jshint esversion:6
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.scss';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { getUsers } from './actions/users.actions';

//avec combine reducer on recoit des donnee au plus haut de l'app pour ensuite y avoir access partout
import rootReducer from './reducers';

// outil de developpement (dev tools)
import { composeWithDevTools } from 'redux-devtools-extension';
import { getPosts } from './actions/post.actions';



const store = createStore(
  rootReducer, composeWithDevTools(applyMiddleware(thunk))
);

store.dispatch(getUsers());
store.dispatch(getPosts());


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

