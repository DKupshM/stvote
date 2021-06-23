import React from "react";
import { useRef, useMemo, useState, useCallback } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import RangeSlider from "react-bootstrap-range-slider";

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

	const Generate_Data = (race, exhausted) => {
		if (race.rounds.length === 0) return;
		let data = {
			nodes: [],
			links: [],
		};

		if (exhausted) {
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
					} else if (exhausted) {
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

	const [highlightNodes, setHighlightNodes] = useState(new Set());
	const [highlightLinks, setHighlightLinks] = useState(new Set());
	const [is2D, set2D] = useState(true);
	const [exhausted, setExhausted] = useState(false);
	const [rValue, setRValue] = useState(is2D ? 0.25 : 1);

	const data = useMemo(
		() => Generate_Data(props.race, exhausted),
		[props.race, exhausted]
	);

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
			return link.value * rValue * 0.2;
		} else {
			return link.value * rValue * 0.1;
		}
	};

	const drawNode = (node, ctx) => {
		const adaptLabelFontSize = (diameter, text) => {
			var xPadding, diameter, labelAvailableWidth, labelWidth;

			xPadding = 5;
			labelAvailableWidth = diameter - xPadding;

			labelWidth = ctx.measureText(text);

			// There is enough space for the label so leave it as is.
			if (labelWidth < labelAvailableWidth) {
				return null;
			}

			return labelAvailableWidth / labelWidth + "em";
		};

		let node_radius = Math.sqrt(Math.max(0, node.value || 1)) * rValue + 1;

		if (highlightNodes.has(node)) {
			ctx.beginPath();
			ctx.fillStyle = "red";
			ctx.arc(node.x, node.y, node_radius, 0, 2 * Math.PI, false);
			ctx.stroke();

			ctx.beginPath();
			ctx.fillStyle = node.color;
			ctx.arc(node.x, node.y, node_radius, 0, 2 * Math.PI, false);
			ctx.fill();
		} else {
			ctx.beginPath();
			ctx.fillStyle = "black";
			ctx.arc(node.x, node.y, node_radius, 0, 2 * Math.PI, false);
			ctx.stroke();

			ctx.beginPath();
			ctx.fillStyle = node.color;
			ctx.arc(node.x, node.y, node_radius, 0, 2 * Math.PI, false);
			ctx.fill();
		}

		ctx.fillStyle = "black";
		ctx.font = Math.round(node_radius / 4) + "px Sans-Serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(node.name, node.x, node.y, node_radius * 2);
	};

	const fgRef = useRef();

	let forceGraph;
	if (is2D) {
		forceGraph = (
			<ForceGraph2D
				ref={fgRef}
				graphData={data}
				autoPauseRedraw={false}
				nodeRelSize={rValue}
				nodeVal={getValue}
				nodeLabel={getNodeLabel}
				nodeColor={getColor}
				nodeVisibility={isVisible}
				nodeCanvasObject={drawNode}
				linkWidth={linkSize}
				linkLabel={getLinkLabel}
				linkAutoColorBy={getLinkValue}
				linkCurvature={0.25}
				onNodeHover={handleNodeHover}
				onLinkHover={handleLinkHover}
			/>
		);
	} else {
		forceGraph = (
			<ForceGraph3D
				ref={fgRef}
				graphData={data}
				autoPauseRedraw={false}
				nodeRelSize={rValue}
				nodeVal={getValue}
				nodeLabel={getNodeLabel}
				nodeColor={getColor}
				nodeVisibility={isVisible}
				linkWidth={linkSize}
				linkLabel={getLinkLabel}
				linkAutoColorBy={getLinkValue}
				linkCurvature={0.25}
				onNodeHover={handleNodeHover}
				onLinkHover={handleLinkHover}
			/>
		);
	}
	return (
		<div>
			{forceGraph}
			<ButtonGroup
				size="lg"
				style={{
					width: "100%",
					height: "50",
					padding: 0,
					margin: 0,
				}}
			>
				<Button
					onClick={() => set2D(!is2D)}
					disabled={false}
					variant="primary"
					style={{ boxShadow: "0 0 0 1px black", width: "5%" }}
				>
					{"Change Dimensions"}
				</Button>
				<Button
					onClick={() => setExhausted(!exhausted)}
					disabled={false}
					variant="primary"
					style={{ boxShadow: "0 0 0 1px black", width: "5%" }}
				>
					{"Add Exhausted"}
				</Button>
				<div
					style={{
						boxShadow: "0 0 0 1px black",
						backgroundColor: "#007bff",
						width: "30%",
						borderRadius: "0px 5px 5px 0px",
					}}
				>
					<label
						style={{
							font: "1.3rem/1 arial, sans-serif",
							color: "white",
							textAlign: "center",
							padding: "5% 0 0 0",
						}}
					>
						Node Size
					</label>
					<div style={{ margin: "0% 5% 0% 5%" }}>
						<RangeSlider
							min={0}
							max={1}
							step={0.01}
							value={rValue}
							variant="secondary"
							onChange={(changeEvent) =>
								setRValue(changeEvent.target.value)
							}
						/>
					</div>
				</div>
			</ButtonGroup>
		</div>
	);
}

export default ForceGraph;
