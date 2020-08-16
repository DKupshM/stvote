import React from 'react';

import { ResponsiveBarCanvas } from '@nivo/bar'

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
    let keys = []
    for (const party of props.parties) {
        choices[party.party_name] = get_ranked_choices(props.race, party);
        keys.push(party.party_name);
    }

    let data = [];

    for (let i = 1; i < maxChoices + 1; i++) {
        let data_to_add = { index: i };
        for (const item in choices) {
            if (i in choices[item]) {
                data_to_add[item] = choices[item][i];
                data_to_add[item + "Color"] = choices[item][i];
            }
        }
        data.push(data_to_add);
    }
    const getColor = bar => find_party_by_name(bar.id).party_color;

    return (
        <div style={props.style}>
            <ResponsiveBarCanvas
                data={data}
                keys={keys}
                indexBy="index"
                margin={{ top: 40, right: 40, bottom: 40, left: 60 }}
                pixelRatio={2}
                padding={0.05}
                innerPadding={0}
                minValue="auto"
                maxValue="auto"
                groupMode="stacked"
                layout="vertical"
                reverse={false}
                colors={getColor}
                colorBy="id"
                borderWidth={0}
                borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Candidates Ranked',
                    legendPosition: 'middle',
                    legendOffset: 30
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Number of Voters',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                enableGridX={false}
                enableGridY={true}
                enableLabel={false}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                isInteractive={true}
            />
        </div>
    );
}

export default CandidatesRanked;
