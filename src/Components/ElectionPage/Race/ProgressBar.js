import React from 'react';

const ProgressBar = (props) => {
    const { bgcolor, completed } = props;

    const containerStyles = {
        height: '48px',
        width: '100%',
        backgroundColor: "#fffbf5",
    }

    const fillerStyles = {
        height: '100%',
        width: `${completed}%`,
        backgroundColor: bgcolor,
        borderRadius: 'inherit',
        textAlign: 'right'
    }

    const labelStyles = {
        padding: 5,
        color: 'black',
        fontWeight: 'bold'
    }

    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${Math.floor(completed)}%`}</span>
            </div>
        </div>
    );
};

export default ProgressBar;