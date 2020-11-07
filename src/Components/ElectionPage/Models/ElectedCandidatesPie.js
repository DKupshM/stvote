import React from 'react';

import { ResponsivePieCanvas } from '@nivo/pie';
import { RaceState } from '../../../Data_Models/Race';

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
    let totalAmount = 0;

    for (const item in choices) {
        data.push({
            "id": item,
            "label": item,
            "value": choices[item],
            "color": find_party_by_name(item).party_color,
        });
        totalAmount += choices[item];
    }

    const getPercentage = bar => {
        return Math.round((bar.value / totalAmount) * 100) + "%";
    }

    const getColor = bar => find_party_by_name(bar.id).party_color;

    // Wait until a candidate is actually elected to display
    if (Object.entries(props.race.elected).length === 0 && props.race.elected.constructor === Object)
        return (<div></div>)

    return (
        <div style={props.style}>
            <h1> Candidates Elected By Party </h1>
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

export default PartyPercentage;
