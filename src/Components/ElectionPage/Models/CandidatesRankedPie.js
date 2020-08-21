import React from 'react';

import { ResponsivePieCanvas } from '@nivo/pie';

function PartyPercentage(props) {

    const get_ranked_choices = (race) => {
        let ballots = race.ballots;
        let ranked_choices = {};
        for (const ballot of ballots) {
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
    let choices = get_ranked_choices(props.race);

    let data = [];
    let totalAmount = 0;

    for (const item in choices) {
        data.push({
            "id": item,
            "label": item,
            "value": choices[item]
        });
        totalAmount += choices[item];
    }

    const getPercentage = bar => {
        return Math.round((bar.value / totalAmount) * 100) + "%";
    }

    return (
        <div style={props.style}>
            <ResponsivePieCanvas
                data={data}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                pixelRatio={2}
                padAngle={0.3}
                cornerRadius={1}
                colors={{ scheme: 'nivo' }}
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

export default PartyPercentage;
