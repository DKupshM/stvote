import React, { useState } from 'react';

import { Button, Form, Col, Row, ButtonGroup } from 'react-bootstrap';
import EditCandidate from './EditCandidate';
import EditParty from './EditParty';
import EditRace from './EditRace';

function ElectionSettings(props) {
    const resetRace = () => {
        props.running()
        props.race.reset_race()
    }

    const [showCandidate, setShowCandidate] = useState(false);
    const [showRace, setShowRace] = useState(false);
    const [showParty, setShowParty] = useState(false);
    const [party, setParty] = useState(undefined);
    const [candidate, setCandidate] = useState(undefined);

    let candidates = [...props.race.candidates, ...props.race.inactive_candidates]

    let showForCandidate = (candidate) => {
        setCandidate(candidate)
        setShowCandidate(true);
    }

    let showForParty = (party) => {
        setParty(party)
        setShowParty(true);
    }

    let showForRace = () => {
        setShowRace(true);
    }

    let candidateBoxes = candidates.map((candidate, index) => {
        return (
            <ButtonGroup key={index} style={{ paddingLeft: "1%", paddingRight: "1%" }} className="mb-2">
                <Button disabled>{candidate.candidate_name}</Button>
                <Button onClick={() => (showForCandidate(candidate))}> Edit </Button>
            </ButtonGroup>
        )
    })

    let partyBoxes = props.parties.map((party, index) => {
        return (
            <ButtonGroup key={index} style={{ paddingLeft: "1%", paddingRight: "1%" }} className="mb-2">
                <Button disabled>{party.party_name}</Button>
                <Button onClick={() => (showForParty(party))}> Edit </Button>
            </ButtonGroup>
        )
    })

    let raceBox =
        <ButtonGroup style={{ paddingLeft: "1%", paddingRight: "1%" }} className="mb-2">
            <Button disabled>{props.race.race_name}</Button>
            <Button onClick={() => (showForRace())}> Edit </Button>
        </ButtonGroup>

    return (
        <div>
            <Form>
                <Form.Group>
                    <Row>
                        <Col>
                            <Form.Label>Race</Form.Label>
                        </Col>
                        <Col style={{
                            display: 'flex',
                            flexDirection: "row",
                            flexWrap: 'wrap',
                            justifyContent: "flex-start",
                            alignItems: "flex-start"
                        }}>
                            {raceBox}
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col>
                            <Form.Label>Parties</Form.Label>
                        </Col>
                        <Col style={{
                            display: 'flex',
                            flexDirection: "row",
                            flexWrap: 'wrap',
                            justifyContent: "flex-start",
                            alignItems: "flex-start"
                        }}>
                            {partyBoxes}
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col>
                            <Form.Label>Candidates</Form.Label>
                        </Col>
                        <Col style={{
                            display: 'flex',
                            flexDirection: "row",
                            flexWrap: 'wrap',
                            justifyContent: "flex-start",
                            alignItems: "flex-start"
                        }}>
                            {candidateBoxes}
                        </Col>
                    </Row>
                </Form.Group>
                <Form.Group>
                    <Row>
                        <Col>
                            <Button variant="primary" style={{ margin: "5%" }}>
                                Reset to Default
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={resetRace} variant="primary" style={{ margin: "5%" }}>
                                {'Reset Race'}
                            </Button>
                        </Col>
                        <Col>
                            <Button variant="primary" style={{ margin: "5%" }}>
                                Save Changes
                            </Button>
                        </Col>
                    </Row>
                </Form.Group>
            </Form>

            <EditRace race={props.race} show={showRace} setShow={setShowRace} />

            <EditParty party={party} show={showParty} savePartyChanges={props.savePartyChanges} setShow={setShowParty} />

            <EditCandidate candidate={candidate} saveCandidateChanges={props.saveCandidateChanges} parties={props.parties} show={showCandidate} setShow={setShowCandidate} />
        </div>
    )
}

export default ElectionSettings;