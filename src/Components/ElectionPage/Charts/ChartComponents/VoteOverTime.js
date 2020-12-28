import React from 'react';

import { ResponsiveLineCanvas } from '@nivo/line'
import { RaceState } from '../../../../Data_Models/Race';

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

    let increment = 1;
    if (props.race.first_scores.length > 50)
        increment = Math.floor(props.race.first_scores.length / 100);

    for (let i = 0; i < props.race.first_scores.length; i += 1) {
        const score_chart = props.race.first_scores[i];

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
                datapoints.push({ x: (i * 1), y: ((choices_over_time[item][i]) / ((i + 1) * 1) * 100) })
            }
        }
        data.push({
            id: item,
            color: find_party_by_name(item).party_color,
            data: datapoints,
        });
    }

    const getColor = bar => find_party_by_name(bar.id).party_color;

    if (props.race.state === RaceState.ADDING)
        return (<div></div>)

    return (
        <div style={props.style}>
            <h1> Party Vote Over Time </h1>
            <ResponsiveLineCanvas
                data={data}
                margin={{ top: 50, right: 160, bottom: 50, left: 60 }}
                xScale={{ type: 'linear' }}
                xFormat={',.2r'}
                yScale={{ type: 'linear', stacked: false, min: 0, max: 100 }}
                yFormat={',.2r'}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    tickValues: 5,
                    legend: 'Votes',
                    legendOffset: 36,
                    legendPosition: 'middle'
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Percentage',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                enableGridX={false}
                colors={getColor}
                lineWidth={1}
                enablePoints={false}
            />
        </div>
    );
}

export default VoteOverTime;
