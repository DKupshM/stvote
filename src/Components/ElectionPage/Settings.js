import React from 'react';

import { Form } from 'react-bootstrap';
import { RaceState } from '../../Data_Models/Race';

function ElectionSettings(props) {
    let candidates = [...props.race.candidates, ...props.race.inactive_candidates]

    let excused_boxes = candidates.map((candidate, index) => {
        const check = props.race.candidates.includes(candidate);
        return <Form.Check label={candidate.candidate_name} key={index} checked={check} onChange={() => (props.excused(candidate))} />
    });

    if (props.race.state === RaceState.ADDING)
        return (
            <div>
                {excused_boxes}
            </div>
        );
    else {
        return (<h1> Race is Active </h1>)
    }

}

export default ElectionSettings;