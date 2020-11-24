import React from 'react';

import { ResponsiveBump } from '@nivo/bump'
import { RaceState } from '../../../Data_Models/Race';


function RoundCandidateBump(props) {

    if (props.race.rounds.length <= 1)
        return (<div></div>);

    let data = []

    for (const candidate of props.race.candidates) {
        let datapoint = []
        for (const round of props.race.rounds) {
            if (round.elected_candidates.includes(candidate)) {
                datapoint.push({ x: round.round_number + 1, y: props.race.elected[candidate.candidate_id][1] + 1 });
            } else if (round.eliminated_candidates.includes(candidate)) {
                if (candidate.candidate_id in props.race.transferring)
                    datapoint.push({ x: round.round_number + 1, y: props.race.transferring[candidate.candidate_id][1] + 1 });
                else
                    datapoint.push({ x: round.round_number + 1, y: props.race.transfered[candidate.candidate_id][1] + 1 });
            } else {
                let active_candidates = round.active_candidates.sort((x, y) => {
                    if (round.candidate_score(x) > round.candidate_score(y)) {
                        return -1;
                    } else if (round.candidate_score(y) > round.candidate_score(x)) {
                        return 1;
                    }
                    return 0;
                });
                datapoint.push({ x: round.round_number + 1, y: active_candidates.indexOf(candidate) + round.elected_candidates.length + 1 });
            }
        }
        data.push({ id: candidate.candidate_name, data: datapoint });
    }

    const getCandidateByName = (name) => {
        for (const candidate of props.race.candidates) {
            if (candidate.candidate_name === name)
                return candidate;
        }
        return null;
    }

    const getColor = (bar) => {
        return getCandidateByName(bar.id).candidate_color
    }

    if (props.race.state === RaceState.ADDING)
        return (<div></div>)

    return (
        <div style={props.style}>
            <h1> Candidate Rank By Round </h1>
            <ResponsiveBump
                data={data}
                margin={{ top: 40, right: 100, bottom: 40, left: 60 }}
                colors={getColor}
                lineWidth={3}
                activeLineWidth={6}
                inactiveLineWidth={3}
                inactiveOpacity={0.15}
                pointSize={0}
                activePointSize={0}
                inactivePointSize={0}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={3}
                activePointBorderWidth={3}
                pointBorderColor={{ from: 'serie.color' }}
                axisTop={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '',
                    legendPosition: 'middle',
                    legendOffset: -36
                }}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: '',
                    legendPosition: 'middle',
                    legendOffset: 32
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'ranking',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
            />
        </div>
    );
}

export default RoundCandidateBump;
