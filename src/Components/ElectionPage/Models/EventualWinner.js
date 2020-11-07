import React from 'react';

import { ResponsivePieCanvas } from '@nivo/pie';
import { RaceState } from '../../../Data_Models/Race';

function CandidatesRanked(props) {

    const get_first_elected = (ballot, elected) => {
        for (let i = 0; i < ballot.candidates.length; i++) {
            for (const candidate in elected) {
                if (candidate === ballot.candidates[i].candidate_id) {
                    return i + 1
                }
            }
        }
        return "Exhausted"
    }

    const get_ranked_choices = (race) => {
        let ranked_choices = {};
        for (const ballot of race.ballots) {
            maxChoices = Math.max(ballot.candidates.length, maxChoices);
        }

        for (let i = 1; i < maxChoices + 1; i++) {
            ranked_choices[i] = 0
        }
        ranked_choices["Exhausted"] = 0

        for (const ballot of race.ballots) {
            ranked_choices[get_first_elected(ballot, race.elected)] += 1;
        }

        return ranked_choices
    }

    let maxChoices = 0;
    let choices = get_ranked_choices(props.race);

    let data = [];
    let totalAmount = 0;

    for (const item in choices) {
        if (choices[item] > 0) {
            data.push({
                "id": item,
                "label": item,
                "value": choices[item]
            });
            totalAmount += choices[item];
        }
    }

    const getPercentage = bar => {
        return Math.round((bar.value / totalAmount) * 100) + "%";
    }

    if (Object.entries(props.race.elected).length === 0 && props.race.elected.constructor === Object)
        return (<div></div>)

    return (
        <div style={props.style}>
            <h1> Voter Satisfaction </h1>
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

export default CandidatesRanked;
