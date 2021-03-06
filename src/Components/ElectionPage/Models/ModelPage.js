import React from "react";

import { useState } from "react";

import NivoSankey from "./ModelComponents/Sankey";
import HeatMap from "./ModelComponents/HeatMap";
import ElectionBar from "./ModelComponents/ElectionBar";
import Chord from "./ModelComponents/Chord";
import Force from "./ModelComponents/ForceGraph";

function ModelPage(props) {
	const [exhausted, setExhausted] = useState(false);
	const [is2D, set2D] = useState(true);

	if (props.model === 0) {
		return (
			<div
				style={{
					display: "flex",
					flexWrap: "wrap",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
				}}
			>
				<ElectionBar
					race={props.race}
					style={{ alignSelf: "center", width: "40vw" }}
				/>
			</div>
		);
	} else if (props.model === 1) {
		return (
			<div
				className="text-center"
				style={{
					height: "100%",
					minHeight: "100%",
					display: "flex",
					justifyContent: "center",
					flexWrap: "wrap",
				}}
			>
				<HeatMap race={props.race} />
				<Chord race={props.race} />
			</div>
		);
	} else if (props.model === 2) {
		console.log("Sankey");
		return (
			<div
				className="text-center"
				style={{
					backgroundColor: "grey",
					height: "60vw",
					display: "flex",
					justifyContent: "center",
					flexWrap: "wrap",
				}}
			>
				<NivoSankey
					race={props.race}
					style={{
						width: "90%",
						height: "60vw",
					}}
				/>
			</div>
		);
	} else if (props.model === 3) {
		console.log("Force Graph");

		return (
			<div
				className="text-center"
				style={{
					height: "60vw",
					display: "flex",
					justifyContent: "center",
					flexWrap: "wrap",
				}}
			>
				<Force race={props.race} exhausted={exhausted} is2D={is2D} />
			</div>
		);
	}
}

export default ModelPage;
