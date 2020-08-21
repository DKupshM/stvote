import React, { useState } from 'react';

import DropdownButton from 'react-bootstrap/DropdownButton'
import { Dropdown } from 'react-bootstrap';

import { ResponsiveChordCanvas } from '@nivo/chord'

function Chord(props) {
    const get_ballots_for_candidate_at_position = (candidate, position) => {
        let ballots = [];
        for (const ballot of props.race.ballots) {
            if (ballot.candidates.length > position) {
                if (ballot.candidates[position].candidate_id === candidate.candidate_id) {
                    ballots.push(ballot);
                }
            }
        }
        return ballots;
    }

    const [xChoice, setXChoice] = useState(2);
    const [yChoice, setYChoice] = useState(1);

    let data = [];
    let keys = []

    for (const candidate of props.race.candidates) {
        let chordData = [];
        let ballots = get_ballots_for_candidate_at_position(candidate, yChoice - 1);
        for (const other_candidate of props.race.candidates) {
            let sum = 0;
            if (ballots.length > 0) {
                for (const ballot of ballots) {
                    if (ballot.candidates.length > xChoice - 1)
                        if (ballot.candidates[xChoice - 1].candidate_id === other_candidate.candidate_id) {
                            sum += 1;
                        }
                }
            }
            chordData.push(sum);
        }
        keys.push(candidate.candidate_name);
        data.push(chordData);
    }

    let xButtons = props.race.rounds.map((item, index) => {
        if (item.round_number !== yChoice - 1 || item.round_number !== xChoice - 1)
            return (<Dropdown.Item key={index} as="button" onClick={() => setXChoice(item.round_number + 1)} > {"Round " + (item.round_number + 1)}</Dropdown.Item >);
        return;
    });

    let yButtons = props.race.rounds.map((item, index) => {
        if (item.round_number !== yChoice - 1 || item.round_number !== xChoice - 1)
            return (<Dropdown.Item key={index} as="button" onClick={() => setYChoice(item.round_number + 1)} > {"Round " + (item.round_number + 1)}</Dropdown.Item >);
        return;
    });

    return (
        <div style={{ width: '100%', height: "100%" }}>
            <DropdownButton id="dropdown-basic-button" title={"Round " + yChoice}>
                {yButtons}
            </DropdownButton>
            <DropdownButton id="dropdown-basic-button" title={"Round " + xChoice}>
                {xButtons}
            </DropdownButton>

            <div style={{ width: '100%', height: '100vw' }}>
                <ResponsiveChordCanvas
                    matrix={data}
                    keys={keys}
                    margin={{ top: 60, right: 200, bottom: 60, left: 60 }}
                    valueFormat=".2f"
                    pixelRatio={2}
                    padAngle={0.006}
                    innerRadiusRatio={0.86}
                    innerRadiusOffset={0}
                    arcOpacity={1}
                    arcBorderWidth={1}
                    arcBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                    ribbonOpacity={0.5}
                    ribbonBorderWidth={0}
                    ribbonBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                    enableLabel={true}
                    label="id"
                    labelOffset={9}
                    labelRotation={-90}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
                    colors={{ scheme: 'category10' }}
                    isInteractive={true}
                    arcHoverOpacity={1}
                    arcHoverOthersOpacity={0.4}
                    ribbonHoverOpacity={0.75}
                    ribbonHoverOthersOpacity={0.15}
                    legends={[
                        {
                            anchor: 'right',
                            direction: 'column',
                            justify: false,
                            translateX: 120,
                            translateY: 0,
                            itemWidth: 80,
                            itemHeight: 11,
                            itemsSpacing: 0,
                            itemTextColor: '#999',
                            itemDirection: 'left-to-right',
                            symbolSize: 12,
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemTextColor: '#000'
                                    }
                                }
                            ]
                        }
                    ]}
                />
            </div>
        </div>
    );
}

export default Chord;
