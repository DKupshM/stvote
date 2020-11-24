import React from 'react';

import { ResponsivePieCanvas } from '@nivo/pie';

function CustomGraph(props) {
    const getPercentage = bar => {
        return Math.round((bar.value / props.totalAmount) * 100) + "%";
    }

    const getColor = (bar) => {
        for (const group of props.groups) {
            if (group.title === bar.id) {
                return group.color
            }
        }
        return "#fff"
    }

    if (props.totalAmount === 0)
        return <div />

    return (
        <div>
            <ResponsivePieCanvas
                data={props.data}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                pixelRatio={2}
                padAngle={0.7}
                cornerRadius={1}
                colors={getColor}
                borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                radialLabelsSkipAngle={10}
                radialLabelsTextXOffset={6}
                radialLabelsTextColor={{ from: 'color', modifiers: [] }}
                radialLabelsLinkOffset={0}
                radialLabelsLinkDiagonalLength={16}
                radialLabelsLinkHorizontalLength={24}
                radialLabelsLinkStrokeWidth={1}
                radialLabelsLinkColor={{ from: 'color' }}
                sliceLabel={getPercentage}
                slicesLabelsSkipAngle={20}
                slicesLabelsTextColor="#333333"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />
        </div >
    );
}

export default CustomGraph;
