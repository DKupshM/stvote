import React from 'react';
import firebase from 'firebase';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

import election_configuration from '../Data/UC_Berkeley/2015/Configuration.json';
import candidate_data from '../Data/UC_Berkeley/2015/Candidates.json';
import ballot_data from '../Data/UC_Berkeley/2015/Ballots.json';

function AddToDatabase() {
    const AddToDB = () => {
        let UC_Berkeley_2015 =
            { election_configuration: election_configuration, candidate_data: candidate_data, ballot_data: ballot_data }
        firebase.database().ref('elections/uc_berkeley/2015').set(UC_Berkeley_2015);
        alert("Added To Database");
    }

    const DeleteFromDB = () => {
        firebase.database().ref('elections/UC_Berkeley_2015').remove();
        alert("Deleted From Database");
    }

    return (
        <div class="text-center">
            <h1> Add to Database </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                <Button onClick={AddToDB}>Add To Database</Button>
                <Button onClick={DeleteFromDB}>Delete From Database</Button>
            </div>
        </div >
    );
}

export default AddToDatabase;
