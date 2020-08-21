import React from 'react';

import { ResponsiveLine } from '@nivo/line'


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
        for (let i = 1; i < maxchoices + 1; i++) {
            if (i in choices[item])
                datapoints.push({ x: i, y: choices[item][i - 1] })
        }
        data.push({
            id: item,
            color: find_party_by_name(item).party_color,
            data: datapoints,
        });
    }

    const getColor = bar => find_party_by_name(bar.id).party_color;

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

export default PartyPercentage;
