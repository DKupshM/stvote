import React, { Component } from 'react';
import { Candidate, CandidateState } from '../../../Data_Models/Candidate';
import { Party } from '../../../Data_Models/Party';
import CandidatePosition from './CandidatePosition';
import '../ElectionPage.css'

export class CandidateList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            candidates: [],
            quota: null,
        }
    }

    addCandidates = (candidates) => {
        console.log(candidates);
        return new Promise((resolve) => {
            candidates.map((candidate) => {
                this.setState((state) => {
                    return {
                        candidates: [...state.candidates,
                        {
                            candidate: candidate, status: CandidateState.RUNNING, score: 0,
                            position: state.candidates.length,
                        }],
                    }
                })
            })
            resolve(true);
        });
    }

    updateCandidates = (candidateTable) => {
        candidateTable = candidateTable.sort((x, y) => {
            if (x.position > y.position) {
                return 1;
            } else if (y.position > x.position) {
                return -1;
            }
            return 0;
        });
        this.setState({ candidates: candidateTable });
    }

    clearCandidates = () => {
        return new Promise((resolve) => {
            this.setState({ candidates: [], }, () => (resolve(true)))
        })
    }

    render() {
        let candidate_list = this.state.candidates.map((item, index) => (
            <CandidatePosition key={index} candidate={item.candidate} status={item.status}
                score={item.score} position={item.position} quota={item.quota} />
        ));

        return (
            <div className="table-responsive">
                <table className="table table-bordered" >
                    <thead className="thead-dark">
                        <tr>
                            <th className="title-row" scope="col" width="1" >#</th>
                            <th className="title-row" scope="col" width="1" >Name</th>
                            <th className="title-row" scope="col" width="1" >Party</th>
                            <th className="title-row" scope="col" width="1">Status</th>
                            <th className="title-row" scope="col" width="1" > Score</th >
                            <th className="title-row" scope="col">Quota Percentage</th>
                        </tr >
                    </thead >
                    <tbody>
                        {candidate_list}
                    </tbody>
                </table >

            </div >
        );
    }
}
export default CandidateList;
