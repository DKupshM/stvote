import React, { useEffect, useState } from 'react';

import { SketchPicker } from 'react-color';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

import { find_party_by_name } from '../../../Data_Models/Util'

function EditCandidate(props) {
    const [candidateName, setCandidateName] = useState("Name");
    const [party, setParty] = useState(undefined);
    const [color, setColor] = useState("#fff");
    const [active, setActive] = useState(true);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    useEffect(() => {
        if (props.candidate !== undefined) {
            setParty(props.candidate.candidate_party)
            setCandidateName(props.candidate.candidate_name)
            setColor(props.candidate.candidate_color)
        }
    }, [props.candidate]);

    const changeColor = (color) => {
        setColor(color.hex)
    }
    const handleColorPickerClosed = () => setDisplayColorPicker(false);
    const handleColorPickerClicked = () => {
        setDisplayColorPicker(!displayColorPicker);
    }

    const handleEditChange = (event) => {
        setCandidateName(event.target.value)
    }

    const changeParty = (event) => {
        setParty(find_party_by_name(props.parties, event.target.value))
    }

    const changeActive = (event) => (setActive(event.target.value))

    const handleClose = () => props.setShow(false);

    const saveChanges = () => {
        props.saveCandidateChanges(props.candidate.candidate_id, candidateName, party, color, active)
        handleClose()
    }

    const onKeyPress = (e) => {
        if (e.which === 13) {
            e.preventDefault()
            saveChanges()
        }
    }

    if (props.show === false || props.candidate === undefined || party === undefined)
        return <div />

    let party_options = props.parties.map((item, index) => {
        return <option key={index} value={item.party_name}>{item.party_name}</option>
    });

    return (
        <Modal size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{"Editing: " + candidateName}</Modal.Title>
            </Modal.Header>
            <Form onKeyPress={onKeyPress}>
                <Row style={{ margin: '5%' }}>
                    <Col>
                        <Form.Label>Name</Form.Label>
                    </Col>
                    <Col>
                        <Form.Control style={{
                            width: '32vw'
                        }}
                            type="text"
                            value={candidateName}
                            onChange={handleEditChange} />
                    </Col>
                </Row>
                <Row style={{ margin: '5%' }}>
                    <Col>
                        <Form.Label>Party</Form.Label>
                    </Col>
                    <Col>
                        <Form.Control as="select" value={party.party_name}
                            onChange={changeParty}>
                            {party_options}
                        </Form.Control>
                    </Col>
                </Row>
                <Row style={{ margin: '5%' }}>
                    <Col>
                        <Form.Label>Color</Form.Label>
                    </Col>
                    <Col>
                        <div style={{
                            padding: '1vw',
                            background: '#fff',
                            borderRadius: '5px',
                            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                            display: 'inline-block',
                            cursor: 'pointer',
                        }}
                            onClick={handleColorPickerClicked}>
                            <div style={{
                                width: '30vw',
                                height: '2vw',
                                borderRadius: '2px',
                                backgroundColor: color,
                            }} />
                        </div>

                        {displayColorPicker ? <div style={{
                            position: 'absolute',
                            zIndex: '2',
                        }}>
                            <div style={{
                                position: 'fixed',
                                top: '0px',
                                right: '0px',
                                bottom: '0px',
                                left: '0px',
                            }} onClick={handleColorPickerClosed} />

                            <SketchPicker color={color} onChangeComplete={changeColor} />
                        </div> : null}
                    </Col>
                </Row>
                <Row style={{ margin: '5%' }}>
                    <Col>
                        <Form.Label>Active</Form.Label>
                    </Col>
                    <Col>
                        <Form.Control as="select" value={active} onChange={changeActive}>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                        </Form.Control>
                    </Col>
                </Row>
            </Form>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={saveChanges}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditCandidate;