import React from 'react';
import { CandidateState } from '../../../Data_Models/Candidate';
import ProgressBar from './ProgressBar';
import '../ElectionPage.css'

function CandidatePosition(props) {
    const get_status_color = () => {
        if (props.status === CandidateState.ELECTED)
            return "#01A039";
        else if (props.status === CandidateState.RUNNING)
            return "#0095E0";
        else if (props.status === CandidateState.TRANSFERRING)
            return "#E07A00";
        else if (props.status === CandidateState.TRANSFERED)
            return "#FF0000";
    }

    const get_status_text = () => {
        if (props.status === CandidateState.ELECTED)
            return "ELECTED";
        else if (props.status === CandidateState.RUNNING)
            return "RUNNING";
        else if (props.status === CandidateState.TRANSFERRING)
            return "TRANSFERRING";
        else if (props.status === CandidateState.TRANSFERED)
            return "TRANSFERED";
    }

    const get_position = () => {
        if (Number.isInteger(props.position) && !Number.isNaN(props.position))
            return props.position + 1;
        return 0;
    }

    const get_percentage = () => {
        if (props.quota === 0)
            return 0;
        return Math.min(100, (props.score / props.quota) * 100);
    }

    return (
        <tr>
            <td className="basic-row" width="1"> {get_position()} </td>
            <td className="basic-row" width="1"> {props.candidate.candidate_name} </td>
            <td className="basic-row" width="1" style={{ backgroundColor: props.candidate.candidate_party.party_color }}> {props.candidate.candidate_party.party_name} </td >
            <td className="basic-row" width="150" style={{ backgroundColor: get_status_color() }}> {get_status_text()} </td >
            <td className="basic-row" width="100" style={{ backgroundColor: get_status_color() }}> {Math.floor(props.score)} </td >
            <td style={{ padding: "0 0 0 0", margin: "0 0 0 0" }}>
                <div style={{ display: 'inline-block', width: '100%', height: '100%' }}>
                    <ProgressBar bgcolor={get_status_color()} completed={get_percentage()} />
                </div>
            </td >
        </tr >
    );
}

export default CandidatePosition;
