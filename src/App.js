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

import election_configuration from './Data/Configuration.json';
import candidate_data from './Data/Candidates.json';
import parties_data from './Data/Parties.json';
import ballot_data from './Data/Ballots.json';

const NavBarWithRouter = withRouter(NavBar);

function App() {
    return (
        <BrowserRouter basename='/stvote' style={{ width: '100%', height: '100%' }}>
            <Fragment >
                <NavBarWithRouter style={{ width: '100%', height: '100%' }} />
                <main style={{ width: '100%', height: '100%' }}>
                    <Switch>
                        <Route exact path='/'> <Redirect to="/home" /> </Route>
                        <Route path='/home' component={Home} />
                        <Route exact path='/election' render={() => (<ElectionPage data={{ election_configuration: election_configuration, candidate_data: candidate_data, parties_data: parties_data, ballot_data: ballot_data }} />)} />
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