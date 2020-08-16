import React, { useState } from 'react';

import CanvasJSReact from '../../../assets/canvasjs.react';

import RangeSlider from 'react-bootstrap-range-slider';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

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
    let quota = props.race.quota();

    let data_active_candidates = []
    // Get Candidates to Display
    let round_active_candidates = props.race.rounds[round - 1].active_candidates;
    for (let i = 0; i < round; i++) {
        data_active_candidates.push(get_round_data(props.race.rounds[i],
            round_active_candidates));
    }

    let chart_data = [];
    for (let i = 0; i < round; i++) {
        let dataPoints = [];
        for (const candidate of round_active_candidates) {
            let score = data_active_candidates[i][candidate.candidate_id].score;
            if (i !== 0) {
                score -= data_active_candidates[i - 1][candidate.candidate_id].score;
            }
            dataPoints.push({ x: get_candidate_position(candidate), y: score, label: candidate.candidate_name });
        }

        chart_data.push({
            type: "stackedColumn",
            name: "Round " + (i + 1),
            yValueFormatString: "#",
            showInLegend: "true",
            dataPoints: dataPoints,
        });
    }
    // Add Elected Candidates
    if (props.race.rounds[round - 1].elected_candidates.length !== 0) {
        let dataPoints = [];
        // Add Elected Candidates
        for (const candidate of props.race.rounds[round - 1].elected_candidates) {
            dataPoints.push({ x: get_candidate_position(candidate), y: props.race.rounds[round - 1].candidate_real_scores[candidate.candidate_id], label: candidate.candidate_name, toolTipContent: "{label} <br/> Elected <br/> Final Score: " + Math.round(final_candidate_score(candidate)) });
        }
        chart_data.push({
            type: "stackedColumn",
            name: "Elected",
            showInLegend: "true",
            yValueFormatString: "#",
            color: '#01A039',
            dataPoints: dataPoints,
        });
    }
    // Add Eliminated Candidates
    if (props.race.rounds[round - 1].eliminated_candidates.length !== 0) {
        let dataPoints = [];
        for (const candidate of props.race.rounds[round - 1].eliminated_candidates) {
            dataPoints.push({
                x: get_candidate_position(candidate), y: final_candidate_score(candidate), label: candidate.candidate_name,
                toolTipContent: "{label} <br/> Transfered <br/> Final Score: " + Math.round(final_candidate_score(candidate)) + " <br/> " + Math.round((final_candidate_score(candidate) / quota) * 100) + "% of Quota"
            });
        }
        chart_data.push({
            type: "stackedColumn",
            name: "Eliminated",
            color: '#FF0000',
            yValueFormatString: "#",
            showInLegend: "true",
            dataPoints: dataPoints,
        });
    }

    let options = {
        animationEnabled: true,
        responsive: true,
        maintainAspectRatio: true,
        axisX: {
            title: "Candidate",
            interval: 1,
            maximum: props.race.candidates.length - .5,
            offset: true,
        },
        axisY: {
            gridThickness: 0,
            minimum: 0,
            maximum: 1.5 * quota,
            stripLines: [{
                value: quota,
                label: "Quota",
            }]
        },
        toolTip: {
            shared: true,
        },
        legend: {
            verticalAlign: "top"
        },
        data: chart_data
    }

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <RangeSlider
                min={1}
                max={props.race.rounds.length}
                step={1}
                value={round}
                variant="secondary"
                onChange={changeEvent => setRound(changeEvent.target.value)}
            />
            <div>
                <CanvasJSChart options={options} />
            </div>
        </div>
    );
}

export default ElectionBar;
