import React from 'react';
import CandidatePosition from './CandidatePosition';
import '../ElectionPage.css'

function CandidateList(props) {

    let sortedCandidates = props.candidates().sort((x, y) => {
        if (x.position > y.position) {
            return 1;
        } else if (y.position > x.position) {
            return -1;
        }
        return 0;
    });

    let candidate_list = sortedCandidates.map((item, index) => (
        <CandidatePosition key={index} candidate={item.candidate} status={item.status}
            score={item.score} position={item.position} quota={item.quota} seats={props.seats} />
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

export default CandidateList;
