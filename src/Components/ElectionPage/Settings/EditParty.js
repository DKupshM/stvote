import React, { useEffect, useState } from 'react';

import { SketchPicker } from 'react-color';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';


function EditParty(props) {
    const [partyName, setPartyName] = useState("Name");
    const [color, setColor] = useState("#fff");
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    useEffect(() => {
        if (props.party !== undefined) {
            setPartyName(props.party.party_name)
            setColor(props.party.party_color)
        }
    }, [props.party]);

    const changeColor = (color) => {
        setColor(color.hex)
    }
    const handleColorPickerClosed = () => setDisplayColorPicker(false);
    const handleColorPickerClicked = () => {
        setDisplayColorPicker(!displayColorPicker);
    }

    const handleEditChange = (event) => {
        setPartyName(event.target.value)
    }


    const handleClose = () => props.setShow(false);

    const saveChanges = () => {
        props.savePartyChanges(props.party.party_id, partyName, color)
        handleClose()
    }

    const onKeyPress = (e) => {
        if (e.which === 13) {
            e.preventDefault()
            saveChanges()
        }
    }

    if (props.show === false || props.party === undefined)
        return <div />

    return (
        <Modal size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={props.show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{"Editing: " + partyName}</Modal.Title>
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
                            value={partyName}
                            onChange={handleEditChange} />
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

export default EditParty;