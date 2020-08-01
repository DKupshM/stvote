import React, { Component } from 'react';
import ElectionPage from './ElectionPage/ElectionPage';
import Home from './Home';

export class Body extends Component {

    displayContent = () => {
        var activeTab = this.props.activeTab;
        if (activeTab === 1)
            return <Home />
        else
            return <ElectionPage />
    }

    render() {
        return this.displayContent();
    }
}
export default Body;
