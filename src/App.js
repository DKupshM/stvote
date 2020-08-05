import React, { Fragment } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Redirect, withRouter } from "react-router";
import './firebase';
import './App.css'

import NavBar from './Components/NavBar/NavBar';
import Home from './Components/Home';
import ElectionPage from './Components/ElectionPage/ElectionPage';
import FourZeroFour from './Components/FourZeroFour';
import AddToDatabase from './Components/AddToDatabase';

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
                        <Route exact path='/election' component={ElectionPage} />
                        <Route exact path='/election/:electionId' component={ElectionPage} />
                        <Route path='/election/:electionId/:yearId' component={ElectionPage} />
                        <Route path='/add' component={AddToDatabase} />
                        <Route component={FourZeroFour} />
                    </Switch>
                </main>
            </Fragment>
        </BrowserRouter>
    );
}

export default App;