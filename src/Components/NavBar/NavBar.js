import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

function NavBar(props) {

    const [activeKey, setActiveKey] = useState(1);

    const handleSelect = (eventKey) => {
        if (Number.isInteger(eventKey))
            setActiveKey(eventKey);
        else
            setActiveKey(0);
    };


    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Brand href="/stvote/home" onClick={handleSelect}>STVote</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav activeKey={activeKey} className="mr-auto" onSelect={handleSelect}>
                    <Nav.Link eventKey={1} href="/stvote/home">Home</Nav.Link>
                    <Nav.Link eventKey={1} href="/stvote/election">Election</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar;