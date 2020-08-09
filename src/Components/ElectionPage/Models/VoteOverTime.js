import React from 'react';

import CanvasJSReact from '../../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function VoteOverTime(props) {
    const find_party_by_name = (name) => {
        for (let i = 0; i < props.parties.length; i++)
            if (props.parties[i].party_name === name)
                return props.parties[i];
        return null
    };

    const find_candidate_by_id = (candidate_id) => {
        for (let i = 0; i < props.race.candidates.length; i++)
            if (String(props.race.candidates[i].candidate_id) === candidate_id)
                return props.race.candidates[i];
        return null;
    };

    let choices_over_time = {};
    for (const party of props.parties) {
        choices_over_time[party.party_name] = [];
    }

    for (const score_chart of props.race.first_scores) {
        let choices = {}
        for (const party of props.parties) {
            choices[party.party_name] = 0;
        }

        for (const candidate_id in score_chart) {
            const candidate = find_candidate_by_id(candidate_id);
            choices[candidate.candidate_party.party_name] += score_chart[candidate_id];
        }

        for (const party of props.parties) {
            choices_over_time[party.party_name] = [...choices_over_time[party.party_name], choices[party.party_name]];
        }
    }

    let data = [];
    for (const item in choices_over_time) {
        let datapoints = [];
        for (let i = 0; i < choices_over_time[item].length; i++) {
            if (choices_over_time[item][i] !== 0) {
                datapoints.push({ x: i + 1, y: (choices_over_time[item][i] / (i + 1) * 100), toolTipContent: "{name}: " + choices_over_time[item][i] + " ({y}%)", })
            }
        }
        data.push({
            type: "line",
            markerType: "none",
            fill: false,
            name: item,
            yValueFormatString: '##.00',
            color: find_party_by_name(item).party_color,
            showInLegend: "true",
            dataPoints: datapoints,
        });
    }

    let options = {
        responsive: true,
        zoomEnabled: true,
        maintainAspectRatio: false,
        animationEnabled: true,
        axisX: {
            title: "Amount",
            offset: true,
            minimum: 1
        },
        axisY: {
            title: "Percentage Captured",
            minimum: 0,
            maximum: 100,
        },
        toolTip: {
            shared: true
        },
        title: {
            text: "Vote Percentage Over Time",
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

export default VoteOverTime;
