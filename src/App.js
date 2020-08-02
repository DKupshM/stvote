import React, { Fragment } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Redirect, withRouter } from "react-router";
import './App.css'

import NavBar from './Components/NavBar/NavBar';
import Home from './Components/Home';
import ElectionPage from './Components/ElectionPage/ElectionPage';
import FourZeroFour from './Components/FourZeroFour';

const NavBarWithRouter = withRouter(NavBar);

function App() {
    return (
        <BrowserRouter basename='/stvote'>
            <Fragment>
                <NavBarWithRouter />
                <main>
                    <Switch>
                        <Route exact path='/'> <Redirect to="/home" /> </Route>
                        <Route path='/home' component={Home} />
                        <Route path='/election' component={ElectionPage} />
                        <Route component={FourZeroFour} />
                    </Switch>
                </main>
            </Fragment>
        </BrowserRouter>
    );
}

export default App;