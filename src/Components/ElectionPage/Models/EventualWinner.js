import React from 'react';

import CanvasJSReact from '../../../assets/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function CandidatesRanked(props) {
    const get_ranked_choices = (race) => {
        let ranked_choices = {};
        for (const ballot of race.ballots) {
            maxChoices = Math.max(ballot.candidates.length, maxChoices);
        }
        for (let i = 0; i < maxChoices; i++) {
            ranked_choices[i] = 0;
        }

        for (const ballot of race.ballots) {
            let eventualElected = false;
            for (let i = 0; i < maxChoices; i++) {
                if (i < ballot.candidates.length && !eventualElected) {
                    for (const candidate in race.elected) {
                        if (candidate === ballot.candidates[i].candidate_id)
                            eventualElected = true;
                    }
                }

                if (eventualElected)
                    ranked_choices[i] += 1;
            }
        }
        return ranked_choices;
    }

    let maxChoices = 0;
    let choices = get_ranked_choices(props.race);

    let electeddatapoints = [];
    for (const key in choices) {
        let x = parseInt(key) + 1
        electeddatapoints.push({ x: x, y: choices[key] })
    }

    let notelecteddatapoints = [];
    for (const key in choices) {
        let x = parseInt(key) + 1
        notelecteddatapoints.push({ x: x, y: (props.race.ballots.length - choices[key]) })
    }

    let options = {
        responsive: true,
        maintainAspectRatio: true,
        animationEnabled: true,
        axisX: {
            title: "Round",
            maximum: maxChoices,
            minimum: 1,
            offset: true,
        },
        axisY: {
            title: "Percentage",
            interval: 10,
        },
        toolTip: {
            shared: true
        },
        title: {
            text: "Voters that Ranked an Elected Candidate",
        },
        legend: {
            verticalAlign: "top"
        },
        data:
            [{
                type: "stackedArea100",
                markerType: "none",
                name: "A Choice Elected",
                toolTipContent: "{name}: {y} (#percent %)",
                showInLegend: "true",
                dataPoints: electeddatapoints,
            },
            {
                type: "stackedArea100",
                markerType: "none",
                name: "No Choice Elected",
                toolTipContent: "{name}: {y} (#percent %)",
                showInLegend: "true",
                dataPoints: notelecteddatapoints,
            }]
    }

    return (
        <div style={{ position: "relative", margin: "auto", width: "100%" }}>
            <CanvasJSChart options={options} />
        </div>
    );
}

export default CandidatesRanked;
