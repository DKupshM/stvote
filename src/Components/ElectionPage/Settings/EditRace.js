import React, { useEffect, useState } from 'react';

import { Modal, Button, Form, Row, Col } from 'react-bootstrap';


function EditRace(props) {
    const [raceName, setRaceName] = useState("Name");
    const [quota, setQuota] = useState("Droop");

    useEffect(() => {
        if (props.race !== undefined) {
            setRaceName(props.race.race_name)

        }
    }, [props.race]);

    const handleEditChange = (event) => {
        setRaceName(event.target.value)
    }

    const changeQuota = (event) => (setQuota(event.target.value))


    const handleClose = () => props.setShow(false);

    const saveChanges = () => {
        handleClose()
    }

    const onKeyPress = (e) => {
        if (e.which === 13) {
            e.preventDefault()
            saveChanges()
        }
    }

    if (props.show === false || props.race === undefined)
        return <div />

    return (
        <Modal size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{"Editing: " + raceName}</Modal.Title>
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
                            value={raceName}
                            onChange={handleEditChange} />
                    </Col>
                </Row>
                <Row style={{ margin: '5%' }}>
                    <Col>
                        <Form.Label>Quota</Form.Label>
                    </Col>
                    <Col>
                        <Form.Control as="select" value={quota} onChange={changeQuota}>
                            <option value={"Droop"}>Droop</option>
                            <option value={"Hare"}>Hare</option>
                            <option value={"Hagenbach-Bischoff"}>Hagenbach-Bischoff</option>
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

export default EditRace;