import React from 'react';
import firebase from 'firebase';
import Button from 'react-bootstrap/Button'

import election_configuration from '../Data/UC_Berkeley/2018/Configuration.json';
import candidate_data from '../Data/UC_Berkeley/2018/Candidates.json';
import ballot_data from '../Data/UC_Berkeley/2018/Ballots.json';
import parties from '../Data/UC_Berkeley/2018/Parties.json';

function AddToDatabase() {
    const AddToDB = () => {
        let uc_berkeley =
            ({ election_configuration: election_configuration, candidate_data: candidate_data, ballot_data: ballot_data, parties_data: parties });
        firebase.database().ref('elections/uc_berkeley/2018').set(uc_berkeley);
        alert("Added To Database");
    }

    const DeleteFromDB = () => {
        firebase.database().ref('elections/uc_berkeley/2017').remove();
        alert("Deleted From Database");
    }

    return (
        <div className="text-center">
            <h1> Add to Database </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                <Button onClick={AddToDB}>Add To Database</Button>
                <Button onClick={DeleteFromDB}>Delete From Database</Button>
            </div>
        </div >
    );
}

export default AddToDatabase;
