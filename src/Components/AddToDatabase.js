import React, { useRef } from 'react';
import Button from 'react-bootstrap/Button'

import { Form } from 'react-bootstrap';

function AddToDatabase() {
    const AddToDB = () => {
        console.log(election_configuration);
        alert("hello!");
    }

    const election_configuration = useRef(null);
    const party_data = useRef(null);
    const candidate_data = useRef(null);
    const ballot_data = useRef(null);

    return (
        <div className="text-center">
            <h1> Add to Database </h1>
            <Form onSubmit={AddToDB}>
                <Form.Group>

                </Form.Group>
                <Form.Group style={{ display: 'grid', justifyItems: 'center' }}>
                    <Form.File ref={election_configuration} label="Election Configuration" />
                    <Form.File ref={party_data} label="Party Data" />
                    <Form.File ref={candidate_data} label="Candidate Data" />
                    <Form.File ref={ballot_data} label="Ballot Data" />
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
