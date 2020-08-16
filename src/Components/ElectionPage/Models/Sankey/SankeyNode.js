import React from "react";

import SankeyMouse from './SankeyMouse';

const SankeyNode = ({ name, value, x0, x1, y0, y1, color, size }) => {
    return (
        <>
            <rect x={x0} y={y0} width={x1 - x0} height={y1 - y0} fill={color} />
            <SankeyMouse>

            </SankeyMouse>
            <text
                x={x0 + (x1 - x0) / 2}
                y={y0 + (y1 - y0) / 2}
                textAnchor="middle"
                dominantBaseline="central"
                transform={"rotate(90, " + (x0 + (x1 - x0) / 2) + "," + (y0 + (y1 - y0) / 2) + ")"}

                style={{
                    fill: 'white',
                    fontSize: '9',
                    pointerEvents: "none",
                    userSelect: "none",
                }}>
                {Math.round(value)}
            </text>
            <text
                x={x0 < size.width / 2 ? x1 + 6 : x0 - 6}
                y={y0 + (y1 - y0) / 2}
                style={{
                    fill: 'black',
                    fontSize: '9',
                    alignmentBaseline: "middle",
                    textAnchor: x0 < size.width / 2 ? "start" : "end",
                    pointerEvents: "none",
                    userSelect: "none"
                }}
            >
                {name}
            </text>
        </>
    );
};

export default SankeyNode;
