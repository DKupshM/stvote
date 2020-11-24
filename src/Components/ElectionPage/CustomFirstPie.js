import React, { useState } from 'react';

import { ResponsivePieCanvas } from '@nivo/pie';
import FormControl from 'react-bootstrap/FormControl'
import Form from 'react-bootstrap/Form'
import { SketchPicker } from 'react-color';
import { ButtonGroup, Button, Modal } from 'react-bootstrap';

class GroupSettings {
    constructor(groupNumber) {
        this.number = groupNumber
        this.title = "Group " + groupNumber
        this.candidates = []
        this.color = "#fff"
    }
}

function CustomFirstPie(props) {
    const [groups, setGroups] = useState([]);
    const [activeGroupNumber, setActiveGroupNumber] = useState(0);

    const [show, setShow] = useState(false);
    const [color, setColor] = useState("#fff");

    const changeColor = (color) => setColor(color.hex);

    const handleClose = () => setShow(false);
    const handleShow = (groupNumber) => {
        setActiveGroupNumber(groupNumber)
        setShow(true);
    }

    const candidates = props.race.candidates

    const addGroup = () => {
        setGroups(groups.concat(new GroupSettings(groups.length)))
    }

    const getActiveGroupTitle = () => {
        if (groups.length === 0)
            return ""
        return groups[activeGroupNumber].title
    }

    let group_buttons = groups.map((item, index) => (
        <ButtonGroup key={index} size="lg" className="mb-2">
            <Button disabled>{item.title}</Button>
            <Button onClick={() => (handleShow(item.number))}> Edit </Button>
        </ButtonGroup>
    ));

    let candidate_options = candidates.map((item, index) => {
        if (groups.length === 0)
            return <div />
        if (groups[activeGroupNumber].candidates.includes(item)) {
            return <option selected key={index}>{item.candidate_name} </option>
        } else {
            return <option key={index}>{item.candidate_name} </option>
        }
    });

    return (
        <div style={props.style}>
            <Button onClick={addGroup}>Add Group</Button>
            {group_buttons}

            <Modal size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editing {getActiveGroupTitle()}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Label>Group Name</Form.Label>
                        <Form.Control type="text" placeholder={getActiveGroupTitle()} />
                        <Form.Label>Candidates in Group</Form.Label>
                        <Form.Control as="select" multiple>
                            {candidate_options}
                        </Form.Control>
                        <Form.Label>Group Color</Form.Label>
                        <SketchPicker color={color} onChangeComplete={changeColor} />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
            </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save Changes
            </Button>
                </Modal.Footer>
            </Modal>
            <br></br>
            <h1> First Vote Pie by Party </h1>

        </div>
    );
}

export default CustomFirstPie;
