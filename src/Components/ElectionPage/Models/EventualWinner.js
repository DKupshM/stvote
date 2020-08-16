import React from 'react';

import { ResponsiveLine } from '@nivo/line'

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
    for (let i = 1; i < maxChoices + 1; i++) {
        if (i in choices)
            electeddatapoints.push({ x: i, y: choices[i] })
    }

    let notelecteddatapoints = [];
    for (let i = 1; i < maxChoices + 1; i++) {
        if (i in choices)
            notelecteddatapoints.push({ x: i, y: (props.race.ballots.length - choices[i]) })
    }

    let data =
        [{
            id: "elected",
            color: "red",
            data: electeddatapoints
        },
        {
            id: "notelected",
            color: "blue",
            data: notelecteddatapoints,
        }]

    const getColor = bar => {
        console.log(bar.id);
        if (bar.id === "elected")
            return "#0d00ff";
        return '#ff0000';
    }

    return (
        <div style={props.style}>
            <ResponsiveLine
                data={data}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'linear', min: 1 }}
                yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
                axisBottom={{
                    orient: 'bottom',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Round',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Votes',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                colors={getColor}
                enablePoints={false}
                enableArea={true}
                areaOpacity={1}
                useMesh={true}
            />
        </div>
    );
}

export default CandidatesRanked;
