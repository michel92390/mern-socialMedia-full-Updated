//jshint esversion:6
import { BrowserRouter as Router } from 'react-router-dom';
import { Redirect, Switch, Route} from 'react-router-dom';
import React from 'react';
import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import Trending from '../../pages/Trending';
import Navbar from '../Navbar';

function index() {
    return (
        <div>
            <Router>
                <Navbar />
                <Switch>
                    {/* quand le path cest/ exact, on veut home */}
                    <Route path="/" exact component={Home} />
                    <Route path="/profil" exact component={Profil} />
                    <Route path="/trending" exact component={Trending} />
                    <Redirect to="/" />
                </Switch>
            </Router>
        </div>
    )
}

export default index;
