import React from 'react';

import CanvasJSReact from '../../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function PartyPercentage(props) {
    const find_party_by_name = (name) => {
        for (let i = 0; i < props.parties.length; i++)
            if (props.parties[i].party_name === name)
                return props.parties[i];
        return null
    };

    const get_ranked_choices = (race, party) => {
        let ballots = race.ballots;
        let ranked_choices = {};
        for (const ballot of ballots) {
            for (let i = 0; i < ballot.candidates.length; i++) {
                maxchoices = Math.max(i, maxchoices);
                if (ballot.candidates[i].candidate_party.party_name === party.party_name)
                    if (i in ranked_choices)
                        ranked_choices[i] += 1;
                    else
                        ranked_choices[i] = 1;
            }
        }
        return ranked_choices;
    }
    let maxchoices = 0;
    let choices = {};
    for (const party of props.parties) {
        choices[party.party_name] = get_ranked_choices(props.race, party);
    }

    let data = [];
    for (const item in choices) {
        let datapoints = [];
        for (const key in choices[item]) {
            let x = parseInt(key) + 1
            datapoints.push({ x: x, y: choices[item][key] })
        }
        data.push({
            type: "stackedArea100",
            markerType: "none",
            name: item,
            toolTipContent: "{name}: {y} (#percent %)",
            color: find_party_by_name(item).party_color,
            showInLegend: "true",
            dataPoints: datapoints,
        });
    }

    let options = {
        animationEnabled: true,
        axisX: {
            title: "Round",
            interval: 1,
            minimum: 1,
            maximum: maxchoices + 1,
            offset: true,
        },
        axisY: {
            title: "Percentage Captured",
            interval: 10,
        },
        toolTip: {
            shared: true
        },
        title: {
            text: props.race.race_name + " Vote Distribution by Round",
        },
        legend: {
            verticalAlign: "top"
        },
        data: data
    }

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );
}

export default PartyPercentage;
