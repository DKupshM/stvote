import React from "react";
import { useRef, useMemo, useState, useCallback } from "react";

import { ForceGraph2D, ForceGraph3D } from "react-force-graph";
import { find_candidate_by_id } from "../../../../Data_Models/Util";

function ForceGraph(props) {
	const find_next_active_candidate = (candidates, active_candidates) => {
		for (const candidate in candidates) {
			for (const active_candidate in active_candidates) {
				if (
					candidates[candidate].candidate_id ===
					active_candidates[active_candidate].candidate_id
				) {
					return candidates[candidate];
				}
			}
		}
		return "exhausted";
	};

	const find_node_by_id = (nodes, id) => {
		for (const node of nodes) {
			if (String(node.id) === String(id)) {
				return node;
			}
		}
		return undefined;
	};

	const get_final_active_round = (candidate, race) => {
		let round_number = race.rounds.length - 1;
		while (
			round_number > 0 &&
			!race.rounds[round_number].start_active_candidates.includes(
				candidate
			)
		) {
			round_number--;
		}
		return round_number;
	};

	const Generate_Data = (race) => {
		if (race.rounds.length === 0) return;
		let data = {
			nodes: [],
			links: [],
		};

		if (props.exhausted) {
			data.nodes.push({
				id: "exhausted",
				name: "exhausted",
				value: race.rounds[race.rounds.length - 1].candidate_scores[
					"exhausted"
				],
				neighbors: [],
				color: "#FF0000",
			});
		}

		for (const candidate of race.candidates) {
			const last_round = get_final_active_round(candidate, race);

			// Last Round so only generate nodes
			if (last_round === race.rounds.length - 1) {
				data.nodes.push({
					id: candidate.candidate_id,
					name: candidate.candidate_name,
					value: race.rounds[last_round].candidate_scores[
						candidate.candidate_id
					],
					neighbors: [],
					color: candidate.candidate_party.party_color,
				});
			} else {
				// Generate Nodes
				if (
					race.rounds[last_round].elected_candidates.includes(
						candidate
					)
				) {
					data.nodes.push({
						id: candidate.candidate_id,
						name: candidate.candidate_name,
						value: race.quota(),
						neighbors: [],
						color: candidate.candidate_party.party_color,
					});
				} else {
					data.nodes.push({
						id: candidate.candidate_id,
						name: candidate.candidate_name,
						value: race.rounds[last_round].candidate_scores[
							candidate.candidate_id
						],
						neighbors: [],
						color: candidate.candidate_party.party_color,
					});
				}

				// Generate Links

				// Find candidates that it will transfer to
				let transfer_candidates_ballot = {};

				let candidate_ballots =
					race.rounds[last_round].ballotsToTransfer[
						candidate.candidate_id
					];
				for (const ballot in candidate_ballots) {
					const next_candidate = find_next_active_candidate(
						candidate_ballots[ballot].candidates,
						race.rounds[last_round + 1].start_active_candidates
					);
					if (next_candidate !== "exhausted") {
						if (
							next_candidate.candidate_id in
							transfer_candidates_ballot
						)
							transfer_candidates_ballot[
								next_candidate.candidate_id
							].push(candidate_ballots[ballot]);
						else
							transfer_candidates_ballot[
								next_candidate.candidate_id
							] = [candidate_ballots[ballot]];
					} else {
						if (next_candidate in transfer_candidates_ballot)
							transfer_candidates_ballot[next_candidate].push(
								candidate_ballots[ballot]
							);
						else
							transfer_candidates_ballot[next_candidate] = [
								candidate_ballots[ballot],
							];
					}
				}

				for (const transfer_candidate_id in transfer_candidates_ballot) {
					if (transfer_candidate_id !== "exhausted") {
						const transfer_candidate = find_candidate_by_id(
							race.candidates,
							transfer_candidate_id
						);

						let value = 0;
						for (const ballot in transfer_candidates_ballot[
							transfer_candidate_id
						]) {
							value +=
								race.rounds[last_round].ballots[
									transfer_candidates_ballot[
										transfer_candidate_id
									][ballot].ballot_id
								];
						}

						data.links.push({
							source: candidate.candidate_id,
							source_name: candidate.candidate_name,
							target: transfer_candidate.candidate_id,
							target_name: transfer_candidate.candidate_name,
							value: value,
						});
					} else if (props.exhausted) {
						let value = 0;
						for (const ballot in transfer_candidates_ballot[
							transfer_candidate_id
						]) {
							value +=
								race.rounds[last_round].ballots[
									transfer_candidates_ballot[
										transfer_candidate_id
									][ballot].ballot_id
								];
						}
						data.links.push({
							source: candidate.candidate_id,
							source_name: candidate.candidate_name,
							target: "exhausted",
							target_name: "Exhausted",
							value: value,
						});
					}
				}
			}
		}

		if (data.links.length > 0) {
			data.links.forEach((link) => {
				const a = find_node_by_id(data.nodes, link.source);
				const b = find_node_by_id(data.nodes, link.target);

				!a.neighbors && (a.neighbors = []);
				!b.neighbors && (b.neighbors = []);
				a.neighbors.push(b);
				b.neighbors.push(a);

				!a.links && (a.links = []);
				!b.links && (b.links = []);
				a.links.push(link);
				b.links.push(link);
			});
		}

		return data;
	};

	const data = useMemo(() => Generate_Data(props.race), [props.race]);

	const [highlightNodes, setHighlightNodes] = useState(new Set());
	const [highlightLinks, setHighlightLinks] = useState(new Set());

	const updateHighlight = () => {
		setHighlightNodes(highlightNodes);
		setHighlightLinks(highlightLinks);
	};

	const handleNodeHover = (node) => {
		highlightNodes.clear();
		highlightLinks.clear();
		if (node) {
			highlightNodes.add(node);
			node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor));
			if (node.links)
				node.links.forEach((link) => highlightLinks.add(link));
		}

		updateHighlight();
	};

	const handleLinkHover = (link) => {
		highlightNodes.clear();
		highlightLinks.clear();

		if (link) {
			highlightLinks.add(link);
			highlightNodes.add(link.source);
			highlightNodes.add(link.target);
		}

		updateHighlight();
	};

	const paintRing = useCallback((node, ctx) => {
		// add ring just for highlighted nodes
		ctx.beginPath();
		ctx.arc(node.x, node.y, 1, 0, 2 * Math.PI, false);
		ctx.fillStyle = node === "red";
		ctx.fill();
	}, []);

	const getColor = (node) => node.color;
	const getNodeLabel = (node) => node.name + ": " + Math.round(node.value);
	const getLinkLabel = (link) =>
		link.source_name +
		" to " +
		link.target_name +
		": " +
		Math.round(link.value);
	const getValue = (node) => node.value;
	const getLinkValue = (link) => link.value;
	const isVisible = (node) => {
		return node.value !== 0;
	};

	const linkSize = (link) => {
		if (highlightLinks.has(link)) {
			return link.value * 0.2;
		} else {
			return link.value * 0.1;
		}
	};

	const fgRef = useRef();

	if (props.is2D) {
		return (
			<ForceGraph2D
				ref={fgRef}
				graphData={data}
				autoPauseRedraw={false}
				nodeRelSize={0.25}
				nodeVal={getValue}
				nodeLabel={getNodeLabel}
				nodeColor={getColor}
				nodeVisibility={isVisible}
				linkWidth={linkSize}
				linkLabel={getLinkLabel}
				linkAutoColorBy={getLinkValue}
				linkCurvature={0.25}
				nodeCanvasObjectMode={(node) =>
					highlightNodes.has(node) ? "before" : undefined
				}
				nodeCanvasObject={paintRing}
				onNodeHover={handleNodeHover}
				onLinkHover={handleLinkHover}
			/>
		);
	} else {
		return (
			<ForceGraph3D
				ref={fgRef}
				graphData={data}
				autoPauseRedraw={false}
				nodeRelSize={1}
				nodeVal={getValue}
				nodeLabel={getNodeLabel}
				nodeColor={getColor}
				nodeVisibility={isVisible}
				linkWidth={linkSize}
				linkAutoColorBy={linkSize}
				linkCurvature={0.25}
			/>
		);
	}
}

export default ForceGraph;
