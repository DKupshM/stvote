import React, { useEffect, useState } from 'react';


import { ResponsivePieCanvas } from '@nivo/pie';
import { SketchPicker } from 'react-color';
import { Form, ButtonGroup, Button, Modal } from 'react-bootstrap';
import { find_candidate_by_id } from '../../Data_Models/Util';

class GroupSettings {
    constructor(groupNumber) {
        this.number = groupNumber
        this.title = "Group " + groupNumber
        this.candidates = []
        this.color = "#fff"
    }
}

function CustomGraph(props) {
    const getPercentage = bar => {
        return Math.round((bar.value / props.totalAmount) * 100) + "%";
    }

    const getColor = (bar) => {
        for (const group of props.groups) {
            console.log(group, bar.id)
            if (group.title === bar.id) {
                return group.color
            }
        }
        return "#fff"
    }

    if (props.totalAmount === 0)
        return <div />

    return (
        <div style={{ alignSelf: 'center', width: '100%', height: '100vw', margin: '0 0% 5% 0' }}>
            <ResponsivePieCanvas
                data={props.data}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                pixelRatio={2}
                padAngle={0.7}
                cornerRadius={1}
                colors={getColor}
                borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
                radialLabelsSkipAngle={10}
                radialLabelsTextXOffset={6}
                radialLabelsTextColor={{ from: 'color', modifiers: [] }}
                radialLabelsLinkOffset={0}
                radialLabelsLinkDiagonalLength={16}
                radialLabelsLinkHorizontalLength={24}
                radialLabelsLinkStrokeWidth={1}
                radialLabelsLinkColor={{ from: 'color' }}
                sliceLabel={getPercentage}
                slicesLabelsSkipAngle={20}
                slicesLabelsTextColor="#333333"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
            />
        </div >
    );
}

function CustomFirstPie(props) {
    const [color, setColor] = useState("#fff");
    const [title, setTitle] = useState("Title")
    const [selectedCandidates, setSelectedCandidates] = useState([])
    const [editTitle, setEditTitle] = useState("Title")
    const [show, setShow] = useState(false);

    const [groups, setGroups] = useState([]);
    const [activeGroupNumber, setActiveGroupNumber] = useState(-1)

    useEffect(() => {
        if (groups.length === 0)
            return
        setTitle(groups[activeGroupNumber].title)
        setEditTitle(groups[activeGroupNumber].title)
        setColor(groups[activeGroupNumber].color)
        let candidates = []
        for (const candidate of groups[activeGroupNumber].candidates) {
            candidates.push(candidate.candidate_id)
        }
        setSelectedCandidates(candidates)
    }, [activeGroupNumber])

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
            console.log(color, groups[activeGroupNumber].color)
        }
    }

    const handleShow = (groupNumber) => {
        setActiveGroupNumber(groupNumber)
        setShow(true);
    }

    const handleEditChange = (event) => {
        setEditTitle(event.target.value)
    }

    const handleSelectedChange = (event) => {
        setSelectedCandidates(Array.from(event.target.selectedOptions, option => option.value))
    }

    const candidates = props.race.candidates

    const addGroup = () => {
        setGroups(groups.concat(new GroupSettings(groups.length)))
    }

    let group_buttons = groups.map((item, index) => (
        <ButtonGroup key={index} className="mb-2">
            <Button disabled>{item.title}</Button>
            <Button onClick={() => (handleShow(item.number))}> Edit </Button>
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
            <Button onClick={addGroup}>Add Group</Button>
            {group_buttons}

            <Modal size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Editing {title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Label>Group Name</Form.Label>
                        <Form.Control type="text" value={editTitle} onChange={handleEditChange} />
                        <Form.Label>Candidates in Group</Form.Label>
                        <Form.Control as="select" value={selectedCandidates}
                            onChange={handleSelectedChange} multiple>
                            {candidate_options}
                        </Form.Control>
                        <Form.Label>Group Color</Form.Label>
                        <SketchPicker color={color} onChangeComplete={changeColor} />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose(false)}>
                        Close
            </Button>
                    <Button variant="primary" onClick={() => handleClose(true)}>
                        Save Changes
            </Button>
                </Modal.Footer>
            </Modal>

            <CustomGraph totalAmount={totalAmount} data={data} groups={groups} />
        </div >
    );
}

export default CustomFirstPie;
