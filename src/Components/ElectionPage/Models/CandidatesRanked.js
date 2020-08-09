import React from 'react';

import CanvasJSReact from '../../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function CandidatesRanked(props) {
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
            if (ballot.candidates[0].candidate_party.party_name !== party.party_name)
                continue;
            const num_ranked = ballot.candidates.length;
            maxChoices = Math.max(num_ranked, maxChoices);
            if (num_ranked in ranked_choices)
                ranked_choices[num_ranked] += 1;
            else
                ranked_choices[num_ranked] = 1;
        }
        return ranked_choices;
    }

    let maxChoices = 0;
    let choices = {};
    for (const party of props.parties) {
        choices[party.party_name] = get_ranked_choices(props.race, party);
    }

    let data = [];
    for (const item in choices) {
        let datapoints = [];
        for (const key in choices[item]) {
            datapoints.push({ x: key, y: choices[item][key] })
        }
        data.push({
            type: "stackedColumn",
            name: item,
            color: find_party_by_name(item).party_color,
            showInLegend: "true",
            dataPoints: datapoints,
        });
    }
    let options = {
        animationEnabled: true,
        responsive: true,
        maintainAspectRatio: true,
        axisX: {
            title: "Candidates Ranked",
            maximum: maxChoices + .5,
            offset: true,
        },
        axisY: {
            title: "Amount Of Voters",
        },
        toolTip: {
            shared: true
        },
        title: {
            text: "Candidates Ranked",
        },
        legend: {
            verticalAlign: "top"
        },
        data: data
    }

    return (
        <div style={{ position: "relative", margin: "auto", width: "100%" }}>
            <CanvasJSChart options={options} />
        </div>
    );
}

export default CandidatesRanked;
