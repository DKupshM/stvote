import React, { useState } from 'react';
import firebase from 'firebase';
import Button from 'react-bootstrap/Button'

import { Form } from 'react-bootstrap';

function AddToDatabase() {
    const AddToDB = (event) => {
        const checkStrings = (str) => {
            return str === null || str.match(/^ *$/) !== null;
        }
        event.preventDefault();
        let data = ({ election_configuration: election_configuration, candidate_data: candidate_data, ballot_data: ballot_data, parties_data: party_data });
        if (!checkStrings(electionName) && !checkStrings(year)) {
            firebase.database().ref("elections/" + electionName + "/" + year).set(data);
            alert("Added To Database: elections/" + electionName + "/" + year);
        }
        else {
            alert('Invalid Name');
        }
    }

    const onChange = async (event, callback) => {
        event.preventDefault()
        const reader = new FileReader()
        reader.onload = async (event) => {
            callback(JSON.parse(event.target.result));
        };
        if (event.target.files[0] !== null)
            reader.readAsText(event.target.files[0]);
    }

    const [electionName, setElectionName] = useState("");
    const [year, setYear] = useState("");
    const [election_configuration, setElectionConfiguration] = useState(null);
    const [party_data, setPartyData] = useState(null);
    const [candidate_data, setCandidateData] = useState(null);
    const [ballot_data, setBallotData] = useState(null);

    return (
        <div className="text-center">
            <h1> Add to Database </h1>
            <Form onSubmit={AddToDB}>
                <Form.Group>
                    <Form.Control type="text" value={electionName} onChange={(event) => setElectionName(event.target.value)} placeholder="Election Name" />
                    <Form.Control type="text" value={year} onChange={(event) => setYear(event.target.value)} placeholder="Year" />
                </Form.Group>
                <Form.Group style={{ display: 'grid', justifyItems: 'center' }}>
                    <Form.File onChange={(event) => onChange(event, setElectionConfiguration)} accept='.json' label="Election Configuration" style={{ backgroundColor: 'grey', margin: '5px' }} />
                    <Form.File onChange={(event) => onChange(event, setPartyData)} label="Party Data" style={{ backgroundColor: 'grey', margin: '5px' }} />
                    <Form.File onChange={(event) => onChange(event, setCandidateData)} label="Candidate Data" style={{ backgroundColor: 'grey', margin: '5px' }} />
                    <Form.File onChange={(event) => onChange(event, setBallotData)} label="Ballot Data" style={{ backgroundColor: 'grey', margin: '5px' }} />
                </Form.Group>
                <Form.Group>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form.Group>
            </Form>
        </div >
    );
}

export default AddToDatabase;
