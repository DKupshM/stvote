
import React, { Component } from 'react';
import Tab from './Tab';


export class TabList extends Component {
    render() {
        return this.props.tabs.map((tab, index) => (
            <Tab key={index} tab={tab} changeTab={this.props.changeTab} activeTab={this.props.activeTab} />
        ));
    }
}
export default TabList;