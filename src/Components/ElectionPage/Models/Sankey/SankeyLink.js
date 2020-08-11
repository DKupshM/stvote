import React, { useState } from "react";
import { sankeyLinkHorizontal } from "d3-sankey";

const SankeyLink = ({ link, color }) => {
    const onMouseOver = (event) => {
        setOpacity(.7);
    }

    const onMouseOut = (event) => {
        setOpacity(.3);
    }

    const [opacity, setOpacity] = useState(.3);

    let sankeyLink = sankeyLinkHorizontal()(link);

    return (
        <>
            <path
                d={sankeyLink}
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                style={{
                    fill: "none",
                    strokeOpacity: opacity,
                    stroke: color,
                    strokeWidth: Math.max(1, link.width)
                }}
            />
        </>
    );
};

export default SankeyLink;