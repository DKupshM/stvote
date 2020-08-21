import React, { useState } from 'react';

import { ResponsiveBarCanvas } from '@nivo/bar';

import { RaceState } from '../../../Data_Models/Race';
import RangeSlider from 'react-bootstrap-range-slider';


function ElectionBar(props) {
    const get_round_data = (round, active_candidates) => {
        let round_data = {};
        for (let i = 0; i < active_candidates.length; i++) {
            round_data[active_candidates[i].candidate_id] = { position: i, score: round.candidate_score(active_candidates[i]) }
        }
        return round_data;
    }

    const get_candidate_position = (candidate) => {
        for (const candidate_table of candidateTable) {
            if (candidate_table.candidate.candidate_id === candidate.candidate_id) {
                return candidate_table.position;
            }
        }
        return 0;
    }

    const get_max_score = () => {
        let max_score = quota;
        for (const candidate_table of candidateTable) {
            max_score = Math.max(candidate_table.score, max_score);
        }
        return max_score
    }

    const get_candidate_by_position = (position) => {
        for (const candidate of props.race.candidates) {
            if (get_candidate_position(candidate) === position) {
                return candidate;
            }
        }
        return 0;
    }

    const final_candidate_score = (candidate) => {
        for (const candidate_table of candidateTable) {
            if (candidate_table.candidate.candidate_id === candidate.candidate_id) {
                return candidate_table.score;
            }
        }
        return 0;
    }

    const [round, setRound] = useState(1);
    const candidateTable = props.race.candidateTable();

    if (props.race.rounds === 0 || props.race.state === RaceState.ADDING)
        return <h1> Loading... </h1>

    let quota = props.race.quota();

    let data_active_candidates = [];
    // Get Candidates to Display
    let round_active_candidates = props.race.rounds[round - 1].active_candidates;
    for (let i = 0; i < round; i++) {
        data_active_candidates.push(get_round_data(props.race.rounds[i],
            round_active_candidates));
    }

    let keys = ["elected", "transferred"]
    let chart_data = [];

    for (let i = 0; i < props.race.rounds[round - 1].candidates.length; i++) {
        const candidate = get_candidate_by_position(i);
        if (round_active_candidates.includes(candidate)) {
            let data = { candidate: candidate.candidate_name };
            for (let i = 0; i < round; i++) {
                let score = data_active_candidates[i][candidate.candidate_id].score;
                if (i !== 0) {
                    score -= data_active_candidates[i - 1][candidate.candidate_id].score;
                }
                data["Round " + (i + 1)] = score;
                if (!keys.includes("Round " + (i + 1))) {
                    keys.push("Round " + (i + 1));
                }
            }
            chart_data.push(data);
        } else if (props.race.rounds[round - 1].elected_candidates.includes(candidate)) {
            chart_data.push({ candidate: candidate.candidate_name, elected: props.race.rounds[round - 1].candidate_real_scores[candidate.candidate_id] });
        } else {
            chart_data.push({ candidate: candidate.candidate_name, transferred: final_candidate_score(candidate) });
        }
    }
    return (
        <div style={{ width: '100%', height: '50vw' }}>
            <div style={{ width: '80%' }}>
                <label style={{ font: '1.3rem/1 arial, sans-serif', color: 'black', textAlign: 'center', padding: '5% 0 0 0' }}>
                    Round
                </label>
                <div style={{ margin: '0% 5% 0% 5%' }}>
                    <RangeSlider
                        min={1}
                        max={props.race.rounds.length}
                        step={1}
                        value={round}
                        variant="secondary"
                        onChange={changeEvent => setRound(changeEvent.target.value)}
                    />
                </div>
            </div>
            <div style={{ width: '100%', height: '50vw' }}>
                <ResponsiveBarCanvas
                    data={chart_data}
                    keys={keys}
                    indexBy="candidate"
                    margin={{ top: 40, right: 40, bottom: 200, left: 60 }}
                    maxValue={get_max_score()}
                    pixelRatio={2}
                    padding={0.05}
                    innerPadding={0}
                    groupMode="stacked"
                    layout="vertical"
                    reverse={false}
                    colors={{ scheme: 'nivo' }}
                    colorBy="id"
                    borderWidth={0}
                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: -60,
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Score',
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
        </div>
    );
}

export default ElectionBar;
