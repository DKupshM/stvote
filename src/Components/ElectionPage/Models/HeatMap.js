import React, { useState } from 'react';

import DropdownButton from 'react-bootstrap/DropdownButton'
import { Dropdown } from 'react-bootstrap';

import { ResponsiveHeatMapCanvas } from '@nivo/heatmap'

function HeatMap(props) {
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

    const [showPercent, setShowPercent] = useState(true);

    const [xChoice, setXChoice] = useState(2);
    const [yChoice, setYChoice] = useState(1);

    let data = [];
    let keys = []

    for (const candidate of props.race.candidates) {
        let heatData = { candidate: candidate.candidate_name };
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
            if (!showPercent)
                heatData[other_candidate.candidate_name] = sum;
            else
                heatData[other_candidate.candidate_name] = Math.round((sum / ballots.length) * 100);
        }
        keys.push(candidate.candidate_name);
        data.push(heatData);
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
                <ResponsiveHeatMapCanvas
                    data={data}
                    keys={keys}
                    indexBy="candidate"
                    tooltipFormat={".0%"}
                    margin={{ top: 100, right: 60, bottom: 60, left: 60 }}
                    forceSquare={true}
                    axisTop={{ orient: 'top', tickSize: 5, tickPadding: 5, tickRotation: -90, legend: '', legendOffset: 36 }}
                    axisRight={null}
                    axisBottom={null}
                    axisLeft={{
                        orient: 'left',
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: '',
                        legendPosition: 'middle',
                        legendOffset: -40
                    }}
                    cellOpacity={1}
                    cellBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
                    labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
                    defs={[
                        {
                            id: 'lines',
                            type: 'patternLines',
                            background: 'inherit',
                            color: 'rgba(0, 0, 0, 0.1)',
                            rotation: -45,
                            lineWidth: 4,
                            spacing: 7
                        }
                    ]}
                    fill={[{ id: 'lines' }]}
                    animate={true}
                    motionStiffness={80}
                    motionDamping={9}
                    hoverTarget="cell"
                    cellHoverOthersOpacity={0.25}
                />
            </div>
        </div>
    );
}

export default HeatMap;
