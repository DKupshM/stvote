import React, { useEffect, useState } from 'react';


import { ResponsivePieCanvas } from '@nivo/pie';
import { SketchPicker } from 'react-color';
import { exportComponentAsPNG } from 'react-component-export-image';

import { Form, Row, Col, ButtonGroup, Button, Modal } from 'react-bootstrap';
import { find_candidate_by_id } from '../../Data_Models/Util';
import useWindowSize from '../Hooks/useWindowSize';

class GroupSettings {
    constructor(groupNumber) {
        this.number = groupNumber
        this.title = "Group " + groupNumber
        this.candidates = []
        this.color = "#" + Math.floor(Math.random() * 16777215).toString(16);
    }
}

function CustomGraph(props) {
    const getPercentage = bar => {
        return Math.round((bar.value / props.totalAmount) * 100) + "%";
    }

    const getColor = (bar) => {
        for (const group of props.groups) {
            if (group.title === bar.id) {
                return group.color
            }
        }
        return "#fff"
    }

    if (props.totalAmount === 0)
        return <div />

    return (
        <ResponsivePieCanvas
            data={props.data}
            margin={{ top: 40, right: 100, bottom: 40, left: 80 }}
            innerRadius={0}
            padAngle={0.7}
            cornerRadius={3}
            colors={getColor}
            borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
            enableRadialLabels={false}
            sliceLabel={getPercentage}
            slicesLabelsSkipAngle={20}
            slicesLabelsTextColor="#000000"
            legends={[
                {
                    text: {
                        fontSize: 20,
                        fontWeight: 900,
                        color: "#000000"
                    },
                    anchor: 'top-right',
                    direction: 'column',
                    justify: false,
                    translateX: 0,
                    translateY: 0,
                    itemsSpacing: 10,
                    itemWidth: 60,
                    itemHeight: 14,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 20,
                    symbolShape: 'square',
                    itemTextColor: '#000000'
                }
            ]}
        />
    );
}

function CustomFirstPie(props) {
    const size = useWindowSize();
    const [color, setColor] = useState("#fff");
    const [title, setTitle] = useState("Title")
    const [selectedCandidates, setSelectedCandidates] = useState([])
    const [editTitle, setEditTitle] = useState("Title")
    const [show, setShow] = useState(false);
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    const imageRef = React.createRef();
    const [groups, setGroups] = useState([]);
    const [activeGroupNumber, setActiveGroupNumber] = useState(-1)

    useEffect(() => {
        if (groups.length === 0 || activeGroupNumber === -1)
            return
        setTitle(groups[activeGroupNumber].title)
        setEditTitle(groups[activeGroupNumber].title)
        setColor(groups[activeGroupNumber].color)
        let candidates = []
        for (const candidate of groups[activeGroupNumber].candidates) {
            candidates.push(candidate.candidate_id)
        }
        setSelectedCandidates(candidates)
    }, [activeGroupNumber, groups])

    const changeColor = (color) => {
        setColor(color.hex)
    }

    const handleClose = (saveChanges) => {
        setShow(false);
        if (saveChanges) {
            if (groups.length === 0)
                return
            groups[activeGroupNumber].title = editTitle;
            groups[activeGroupNumber].color = color;
            let candidates = []
            for (const candidate of selectedCandidates) {
                candidates.push(find_candidate_by_id(props.race.candidates, candidate))
            }
            groups[activeGroupNumber].candidates = candidates
        }
    }

    const handleShow = (groupNumber) => {
        setActiveGroupNumber(groupNumber)
        setShow(true);
    }

    const handleEditChange = (event) => {
        setEditTitle(event.target.value)
    }

    const handleDelete = () => {
        const index = groups.indexOf(groups[activeGroupNumber])
        if (index > -1) {
            let copy = [].concat(groups);
            copy.splice(index, 1)
            setGroups(copy)
        }
        setShow(false)
        setActiveGroupNumber(-1)
    }

    const handleSelectedChange = (event) => {
        setSelectedCandidates(Array.from(event.target.selectedOptions, option => option.value))
    }

    const handleColorPickerClicked = () => {
        setDisplayColorPicker(!displayColorPicker);
    }

    const handleColorPickerClosed = () => setDisplayColorPicker(false);

    const handleExportClicked = () => {
        if (totalAmount > 0)
            exportComponentAsPNG(imageRef)
    }

    const candidates = props.race.candidates

    const addGroup = () => {
        setGroups(groups.concat(new GroupSettings(groups.length)))
    }

    const onKeyPress = (e) => {
        if (e.which === 13) {
            e.preventDefault();
            handleClose(true)
        }
    }

    let group_buttons = groups.map((item, index) => (
        <ButtonGroup key={index} style={{ paddingLeft: "1%", paddingRight: "1%" }} className="mb-2">
            <Button disabled>{item.title}</Button>
            <Button onClick={() => (handleShow(groups.indexOf(item)))}> Edit </Button>
        </ButtonGroup>
    ));

    let candidate_options = candidates.map((item, index) => {
        if (groups.length === 0 || activeGroupNumber === -1)
            return <div key={index} />
        return <option key={index} value={item.candidate_id}>{item.candidate_name} </option>
    });

    let data = []

    let totalAmount = 0;
    const scores = props.race.first_scores[props.race.first_scores.length - 1]

    for (const group of groups) {
        let groupScore = 0;
        for (const candidate of group.candidates) {
            if (scores !== undefined)
                groupScore += scores[candidate.candidate_id]
        }
        if (groupScore > 0) {
            data.push({
                "id": group.title,
                "label": group.title,
                "value": groupScore,
                "color": group.color,
            });

            totalAmount += groupScore;
        }
    }

    return (
        <div style={props.style}>
            <Row>
                <Col md="3">
                    <Button style={{}} onClick={addGroup}>Add Group</Button>
                </Col>
                <Col style={{ flexDirection: "row" }}>
                    {group_buttons}
                </Col>
            </Row>
            <Row style={{ width: size.width, height: "50vw" }}>
                <div style={{ width: size.width, height: "50vw" }} ref={imageRef}>
                    <CustomGraph style={{ margin: '5%' }} totalAmount={totalAmount} data={data} groups={groups} />
                </div>
            </Row>
            <Row style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
                <Button style={{ margin: "1%" }} onClick={handleExportClicked}>
                    Export As PNG
                </Button>
            </Row>

            <Modal size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editing {title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onKeyPress={onKeyPress}>
                        <Row style={{ margin: '5%' }}>
                            <Col>
                                <Form.Label>Group Name</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control style={{
                                    width: '32vw'
                                }}
                                    type="text"
                                    value={editTitle}
                                    onChange={handleEditChange} />
                            </Col>
                        </Row>
                        <Row style={{ margin: '5%' }}>
                            <Col>
                                <Form.Label>Candidates</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control as="select" value={selectedCandidates}
                                    onChange={handleSelectedChange} style={{
                                        width: '32vw'
                                    }} multiple>
                                    {candidate_options}
                                </Form.Control>
                            </Col>
                        </Row>
                        <Row style={{ margin: '5%' }}>
                            <Col>
                                <Form.Label>Group Color</Form.Label>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" style={{}} onClick={handleDelete}>
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={() => handleClose(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleClose(true)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    );
}

export default CustomFirstPie;
