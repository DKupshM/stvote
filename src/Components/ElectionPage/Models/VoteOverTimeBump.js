import React from 'react';

import { ResponsiveBump } from '@nivo/bump'
import { RaceState } from '../../../Data_Models/Race';


function VoteOverTimeBump(props) {
    const indexOfMax = (arr) => {
        if (arr.length === 0) {
            return -1;
        }
        var max = arr[0];
        var maxIndex = 0;
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                maxIndex = i;
                max = arr[i];
            }
        }

        return maxIndex;
    }


    let choices_over_time = [];

    if (props.race.first_scores.length <= 1)
        return (<div></div>);

    let increment = 1;
    if (props.race.first_scores.length > 50)
        increment = Math.floor(props.race.first_scores.length / 50);

    for (let i = 0; i < props.race.first_scores.length; i += increment) {
        const score_chart = props.race.first_scores[i]

        let candidate_positions = {};
        let candidates = []
        let scores = []
        for (const candidate of props.race.candidates) {
            candidates.push(candidate);
            if (candidate.candidate_id in score_chart)
                scores.push(score_chart[candidate.candidate_id]);
            else
                scores.push(0);
        }

        let position = 1;
        while (scores.length > 0) {
            let i = indexOfMax(scores);
            scores.splice(i, 1);
            candidate_positions[candidates[i].candidate_id] = position;
            candidates.splice(i, 1);
            position++;
        }
        choices_over_time.push(candidate_positions);
    }


    let data = [];
    for (const candidate of props.race.candidates) {
        let datapoint = []
        for (let i = 0; i < choices_over_time.length; i++) {
            datapoint.push({ x: (i + 1) * increment, y: choices_over_time[i][candidate.candidate_id] });
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
            <h1> Candidate Rank Over Time </h1>
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
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 90,
                    tickValues: 5,
                    format: ".2s",
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

export default VoteOverTimeBump;
