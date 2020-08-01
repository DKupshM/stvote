import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css'
import NavBar from './Components/NavBar/NavBar';
import Home from './Components/Home';
import ElectionPage from './Components/ElectionPage/ElectionPage';
import FourZeroFour from './Components/FourZeroFour';

export class App extends Component {

    render() {
        return (
            <BrowserRouter basename='/stvote'>
                <main>
                    <NavBar />
                    <Switch>
                        <Route exact path='/' exact render={() => <Home />} />
                        <Route path='/home' render={() => <Home />} />
                        <Route path='/election' render={() => <ElectionPage />} />
                        <Route component={FourZeroFour} />
                    </Switch>
                </main>
            </BrowserRouter>
        );
    }
}
export default App;