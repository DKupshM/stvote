import React from 'react';

import CanvasJSReact from '../../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function PartyPercentage(props) {
    const find_candidate_by_id = (race, id) => {
        for (const candidate of race.candidates)
            if (candidate.candidate_id === id)
                return candidate;
        return null;
    }

    const find_party_by_name = (name) => {
        for (let i = 0; i < props.parties.length; i++)
            if (props.parties[i].party_name === name)
                return props.parties[i];
        return null
    };

    const get_ranked_choices = (race, party) => {
        let ranked_choices = 0;
        for (const candidate in race.elected) {
            if (find_candidate_by_id(race, candidate).candidate_party === party)
                ranked_choices += 1;
        }
        return ranked_choices;
    }

    let choices = {};
    for (const party of props.parties) {
        let ranked_choices = get_ranked_choices(props.race, party);
        if (ranked_choices > 0)
            choices[party.party_name] = get_ranked_choices(props.race, party);
    }

    let data = [];
    for (const item in choices) {
        data.push({
            y: choices[item], label: item,
            color: find_party_by_name(item).party_color,
        })
    }
    let options = {
        animationEnabled: true,
        title: {
            text: props.race.race_name + " Elected Seat Distribution",
        },
        legend: {
            verticalAlign: "top"
        },
        data: [{
            type: "pie",
            startAngle: 75,
            showInLegend: true,
            toolTipContent: "{label}: {y} - #percent %",
            legendText: "{label}",
            dataPoints: data
        }]
    }

    return (
        <div>
            <CanvasJSChart options={options} />
        </div>
    );
}

export default PartyPercentage;
