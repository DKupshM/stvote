import React from 'react';

import FirstChoicePie from './ChartComponents/FirstChoicePie';
import ElectedCandidatesPie from './ChartComponents/ElectedCandidatesPie';
import CandidatesRankedPie from './ChartComponents/CandidatesRankedPie';
import CandidatesRanked from './ChartComponents/CandidatesRanked';
import PartyPercentage from './ChartComponents/PartyPercentage';
import EventualWinner from './ChartComponents/EventualWinner';
import VoteOverTime from './ChartComponents/VoteOverTime';
import VoteOverTimeBump from './ChartComponents/VoteOverTimeBump';
import RoundCandidateBump from './ChartComponents/RoundCandidateBump';


function ChartPage(props) {
    let chartStyle = {
        alignSelf: 'center', width: '50%', height: '30vw', margin: '0 0% 5% 0'
    }

    return (
        <div className="text-center" style={{ display: "flex", justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
            <FirstChoicePie race={props.race} parties={props.parties} style={chartStyle} />
            <ElectedCandidatesPie race={props.race} parties={props.parties} style={chartStyle} />
            <CandidatesRanked race={props.race} parties={props.parties} style={chartStyle} />
            <CandidatesRankedPie race={props.race} parties={props.parties} style={chartStyle} />
            <PartyPercentage race={props.race} parties={props.parties} style={chartStyle} />
            <VoteOverTime race={props.race} parties={props.parties} style={chartStyle} />
            <VoteOverTimeBump race={props.race} parties={props.parties} style={chartStyle} />
            <EventualWinner race={props.race} parties={props.parties} style={chartStyle} />
            <RoundCandidateBump race={props.race} parties={props.parties} style={chartStyle} />
        </div >
    );
}

export default ChartPage