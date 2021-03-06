import React from 'react';

import { ResponsivePieCanvas } from '@nivo/pie';

import { find_party_by_name } from '../../../../Data_Models/Util';

function FirstChoicePie(props) {

    const get_ranked_choices = (race, party) => {
        let ranked_choices = 0;
        for (const ballot of race.ballots) {
            if (ballot.candidates[0].candidate_party.party_name === party.party_name)
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
    let totalAmount = 0;

    for (const item in choices) {
        data.push({
            "id": item,
            "label": item,
            "value": choices[item],
            "color": find_party_by_name(props.parties, item).party_color,
        });
        totalAmount += choices[item];
    }

    const getPercentage = bar => {
        return Math.round((bar.value / totalAmount) * 100) + "%";
    }

    const getColor = bar => find_party_by_name(props.parties, bar.id).party_color;

    return (
        <div style={props.style}>
            <h1> First Vote Pie by Party </h1>
            <ResponsivePieCanvas
                data={data}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                pixelRatio={2}
                padAngle={0.7}
                cornerRadius={1}
                colors={getColor}
                borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                radialLabelsSkipAngle={10}
                radialLabelsTextXOffset={6}
                radialLabelsTextColor={{ from: 'color', modifiers: [] }}
                radialLabelsLinkOffset={0}
                radialLabelsLinkDiagonalLength={16}
                radialLabelsLinkHorizontalLength={24}
                radialLabelsLinkStrokeWidth={1}
                radialLabelsLinkColor={{ from: 'color' }}
                sliceLabel={getPercentage}
                slicesLabelsSkipAngle={20}
                slicesLabelsTextColor="#333333"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />
        </div>
    );
}

export default FirstChoicePie;
