import React, { Component } from 'react';
import Candidate, { CandidateState } from '../../../Data_Models/Candidate';
import ProgressBar from 'react-bootstrap/ProgressBar'
import '../ElectionPage.css'

export class CandidatePosition extends Component {

    constructor(props) {
        super(props)
    }

    get_status_color = () => {
        if (this.props.status === CandidateState.ELECTED)
            return "#01A039";
        else if (this.props.status === CandidateState.RUNNING)
            return "#0095E0";
        else if (this.props.status === CandidateState.TRANSFERRING)
            return "#E07A00";
        else if (this.props.status === CandidateState.TRANSFERED)
            return "#FF0000";
    }

    get_progress_variant = () => {
        if (this.props.status === CandidateState.ELECTED)
            return "success";
        else if (this.props.status === CandidateState.RUNNING)
            return "info";
        else if (this.props.status === CandidateState.TRANSFERRING)
            return "warning";
        else if (this.props.status === CandidateState.TRANSFERED)
            return "danger";
    }

    get_percentage = () => {
        if (this.props.quota !== null && this.props.status !== CandidateState.TRANSFERED)
            return (this.props.score / this.props.quota) * 100
        return 0;
    }

    render() {
        return (
            <tr>
                <td className="basic-row" width="1"> {this.props.position + 1} </td>
                <td className="basic-row" width="1"> {this.props.candidate.candidate_name} </td>
                <td className="basic-row" width="1" style={{ backgroundColor: this.props.candidate.candidate_party.party_color }}> {this.props.candidate.candidate_party.party_name} </td >
                <td className="basic-row" width="1" style={{ backgroundColor: this.get_status_color() }}> {this.props.status} </td >
                <td className="basic-row" width="1" style={{ backgroundColor: this.get_status_color() }}> {Math.floor(this.props.score)} </td >
                <td style={{ padding: "0", margin: "0" }}>
                    <ProgressBar variant={this.get_progress_variant()} max={this.props.quota} min={0} now={this.props.score} style={{ height: "48px", borderRadius: 0 }} />
                </td >
            </tr >
        );
    }
}
export default CandidatePosition;
