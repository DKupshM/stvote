import React, { Component } from 'react';

import CanvasJSReact from '../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export class CandidatesRanked extends Component {

    constructor(props) {
        super(props);

        let choices = this.get_ranked_choices(this.props.race);
        let dataPoints = []
        for (const key in choices) {
            dataPoints.push({ label: key, y: choices[key] });
        }

        this.state = {
            name: this.props.race.race_name + " candidates ranked",
            data: dataPoints,
        }
    }

    get_ranked_choices = (race) => {
        let ballots = race.ballots;
        let ranked_choices = {};
        for (const ballot of ballots) {
            const num_ranked = ballot.candidates.length;
            if (num_ranked in ranked_choices)
                ranked_choices[num_ranked] += 1;
            else
                ranked_choices[num_ranked] = 1;
        }
        return ranked_choices;
    }


    render() {
        const options = {
            title: {
                text: this.state.name,
            },
            data: [{
                type: "column",
                dataPoints: this.state.data,
            }]
        }

        return (
            <div>
                <CanvasJSChart options={options} />
            </div>
        );
    }
}
export default CandidatesRanked;
