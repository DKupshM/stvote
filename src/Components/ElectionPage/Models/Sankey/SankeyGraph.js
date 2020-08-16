import React from "react";
import { sankey } from "d3-sankey";

import SankeyNode from "./SankeyNode";
import SankeyLink from "./SankeyLink";
import { Stage } from "./Stage";
import { ZoomContainer } from "./ZoomContainer";

const SankeyGraph = ({ race, width, height }) => {
    const GenerateData = (race) => {
        const find_candidate_by_id = (candidate_id) => {
            for (let i = 0; i < race.candidates.length; i++)
                if (String(race.candidates[i].candidate_id) === candidate_id)
                    return race.candidates[i];
            return null;
        };

        const find_node = (candidate_name, round_number) => {
            const nodes = data['nodes'];
            for (let i = 2; i < nodes.length; i++) {
                if (nodes[i]['name'] === candidate_name && nodes[i]['round'] === round_number)
                    return i;
            };
            return 0;
        }

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

        let data = { nodes: [{ name: "Total Votes", color: "#000000" }, { name: "Elected", score: 0, color: "#01A039" }, { name: "Exhausted", score: 0, color: "#FF0000" }], links: [] }
        for (const round_number in race.rounds) {
            const round = race.rounds[round_number];
            for (const candidate of round.start_active_candidates) {
                data["nodes"].push({ name: candidate.candidate_name, round: round.round_number, color: candidate.candidate_party.party_color });
            }
            if (round.round_number === 0) {
                // First Round so Count Vote Totals
                for (const candidate of round.start_active_candidates) {
                    let link = { source: 0, target: find_node(candidate.candidate_name, round.round_number), value: round.candidate_real_scores[candidate.candidate_id], color: candidate.candidate_party.party_color };
                    data['links'].push(link);
                }
            } else {
                // First add links from prior rounds
                for (const candidate of round.start_active_candidates) {
                    let link = { source: find_node(candidate.candidate_name, round.round_number - 1), target: find_node(candidate.candidate_name, round.round_number), value: prev_round(round).candidate_real_scores[candidate.candidate_id], color: candidate.candidate_party.party_color };
                    data['links'].push(link);
                    // Check if elected this round and add link if elected
                    if (round.elected_candidates.includes(candidate) && round.round_number !== race.rounds.length - 1) {
                        let link = { source: find_node(candidate.candidate_name, round.round_number), target: 1, value: round.quota, color: "#01A039" };
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
                            let link = { source: find_node(candidate.candidate_name, round.round_number - 1), target: find_node(transfer_candidate.candidate_name, round.round_number), value: value, color: candidate.candidate_party.party_color };
                            data['links'].push(link);
                        }
                        else {
                            let value = 0;
                            for (const ballot in transfer_candidates_ballot[transfer_candidate_id]) {
                                value += round.ballots[transfer_candidates_ballot[transfer_candidate_id][ballot].ballot_id];
                            }
                            let link = { source: find_node(candidate.candidate_name, round.round_number - 1), target: 2, value: value, color: '#FF0000' };
                            data['links'].push(link);
                        }
                    }
                }
            }
            if (round.round_number === race.rounds.length - 1) {
                for (const candidate of round.start_active_candidates) {
                    if (round.elected_candidates.includes(candidate)) {
                        let link = { source: find_node(candidate.candidate_name, round.round_number), target: 1, value: round.candidate_real_scores[candidate.candidate_id], color: "#01A039" };
                        data['links'].push(link);
                    }
                    else {
                        let link = { source: find_node(candidate.candidate_name, round.round_number), target: 2, value: round.candidate_real_scores[candidate.candidate_id], color: "#FF0000" };
                        data['links'].push(link);
                    }
                }
            }
        }
        return data;
    }

    if (race.rounds.length === 0 || width === 0 || height === 0)
        return (<h1>Loading</h1>)


    const data = GenerateData(race);
    const { nodes, links } = sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 1], [width - 1, height - 5]])(data);



    return (
        <Stage width={"100%"} height={"100%"}>
            <ZoomContainer>
                {nodes.map((node, i) => (
                    <SankeyNode
                        {...node}
                        color={node.color}
                        size={{ width: width, height: height }}
                        key={i}
                    />
                ))}
                {links.map((link, i) => (
                    <SankeyLink
                        link={link}
                        color={link.color}
                        key={i}
                    />
                ))}
            </ZoomContainer>
        </Stage>
    );
}

export default SankeyGraph;