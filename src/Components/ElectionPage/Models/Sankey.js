import React from 'react';

import { ResponsiveSankey } from '@nivo/sankey'

function Sankey(props) {

    const GenerateData = (race) => {
        const find_candidate_by_id = (candidate_id) => {
            for (let i = 0; i < race.candidates.length; i++)
                if (String(race.candidates[i].candidate_id) === candidate_id)
                    return race.candidates[i];
            return null;
        };

        const find_next_active_candidate = (candidates, active_candidates) => {
            for (const candidate in candidates) {
                for (const active_candidate in active_candidates) {
                    if (candidates[candidate].candidate_id === active_candidates[active_candidate].candidate_id) {
                        return candidates[candidate];
                    }
                }
            }
            return "exhausted";
        }

        const prev_round = (round) => {
            return race.rounds[round.round_number - 1];
        }

        let data = { nodes: [{ id: "Total Votes", name: "Total Votes", color: "#000000" }, { id: "Elected", name: "Elected", color: "#01A039" }, { id: "Exhausted", name: "Exhausted", color: "#FF0000" }], links: [] }
        for (const round_number in race.rounds) {
            const round = race.rounds[round_number];
            for (const candidate of round.start_active_candidates) {
                data["nodes"].push({ id: candidate.candidate_name + " " + round_number, name: candidate.candidate_name, color: candidate.candidate_party.party_color });
            }
            if (round.round_number === 0) {
                // First Round so Count Vote Totals
                for (const candidate of round.start_active_candidates) {
                    let link = { source: "Total Votes", target: candidate.candidate_name + " " + round.round_number, value: round.candidate_real_scores[candidate.candidate_id] };
                    data['links'].push(link);
                    if (round.elected_candidates.includes(candidate) && round.round_number !== race.rounds.length - 1) {
                        let link = { source: candidate.candidate_name + " " + round.round_number, target: "Elected", value: round.quota, color: "#01A039" };
                        data['links'].push(link);
                    }
                }
            } else {
                // First add links from prior rounds
                for (const candidate of round.start_active_candidates) {
                    let link = { source: candidate.candidate_name + " " + (round.round_number - 1), target: candidate.candidate_name + " " + round.round_number, value: prev_round(round).candidate_real_scores[candidate.candidate_id] };
                    data['links'].push(link);
                    // Check if elected this round and add link if elected

                    if (round.elected_candidates.includes(candidate) && round.round_number !== race.rounds.length - 1) {
                        let link = { source: candidate.candidate_name + " " + round.round_number, target: "Elected", value: round.quota, color: "#01A039" };
                        data['links'].push(link);
                    }
                }

                // Then add links from eliminated or elected candidates
                for (const candidate_id in prev_round(round).ballotsToTransfer) {
                    const candidate = find_candidate_by_id(candidate_id);

                    // Find candidates that it will transfer to
                    let transfer_candidates_ballot = {};

                    let candidate_ballots = prev_round(round).ballotsToTransfer[candidate_id];
                    for (const ballot in candidate_ballots) {
                        const next_candidate = find_next_active_candidate(candidate_ballots[ballot].candidates, round.start_active_candidates);
                        if (next_candidate !== "exhausted") {
                            if (next_candidate.candidate_id in transfer_candidates_ballot)
                                transfer_candidates_ballot[next_candidate.candidate_id].push(candidate_ballots[ballot])
                            else
                                transfer_candidates_ballot[next_candidate.candidate_id] = [candidate_ballots[ballot]];
                        } else {
                            if (next_candidate in transfer_candidates_ballot)
                                transfer_candidates_ballot[next_candidate].push(candidate_ballots[ballot])
                            else
                                transfer_candidates_ballot[next_candidate] = [candidate_ballots[ballot]];
                        }
                    }


                    for (const transfer_candidate_id in transfer_candidates_ballot) {
                        if (transfer_candidate_id !== "exhausted") {
                            const transfer_candidate = find_candidate_by_id(transfer_candidate_id);

                            let value = 0;
                            for (const ballot in transfer_candidates_ballot[transfer_candidate_id]) {
                                value += round.ballots[transfer_candidates_ballot[transfer_candidate_id][ballot].ballot_id];
                            }
                            let link = { source: candidate.candidate_name + " " + (round.round_number - 1), target: transfer_candidate.candidate_name + " " + round.round_number, value: value };
                            data['links'].push(link);
                        }
                        else {
                            let value = 0;
                            for (const ballot in transfer_candidates_ballot[transfer_candidate_id]) {
                                value += round.ballots[transfer_candidates_ballot[transfer_candidate_id][ballot].ballot_id];
                            }
                            let link = { source: candidate.candidate_name + " " + (round.round_number - 1), target: "Exhausted", value: value };
                            data['links'].push(link);
                        }
                    }
                }
            }
            if (round.round_number === race.rounds.length - 1) {
                for (const candidate of round.start_active_candidates) {
                    if (round.elected_candidates.includes(candidate)) {
                        let link = { source: candidate.candidate_name + " " + round.round_number, target: "Elected", value: round.candidate_real_scores[candidate.candidate_id] };
                        data['links'].push(link);
                    }
                    else {
                        let link = { source: candidate.candidate_name + " " + round.round_number, target: "Exhausted", value: round.candidate_real_scores[candidate.candidate_id] };
                        data['links'].push(link);
                    }
                }
            }
        }
        return data;
    }

    if (props.race.rounds.length === 0)
        return (<h1>Loading</h1>)


    const data = GenerateData(props.race);

    return (
        <div style={props.style}>
            <ResponsiveSankey
                data={data}
                margin={{ top: 100, right: 40, bottom: 100, left: 40 }}
                layout="vertical"
                align="justify"
                sort="ascending"
                colors={{ scheme: 'category10' }}
                nodeTooltip={node => <span> {node.name}: {Math.round(node.value)}</span>}
                nodeOpacity={1}
                nodeThickness={10}
                nodeInnerPadding={3}
                nodeSpacing={10}
                nodeBorderWidth={0}
                nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
                linkOpacity={0.4}
                linkHoverOpacity={0.8}
                linkHoverOthersOpacity={0.1}
                enableLinkGradient={true}
                enableLabels={true}
                label={node => `${node.name}`}
                labelPosition="outside"
                labelOrientation="vertical"
                labelPadding={16}
                labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />
        </div>
    );
}

export default Sankey;