import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'

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
                    <NavDropdown title="Election" id="collasible-nav-dropdown">
                        <NavDropdown.Item eventKey={2} href="/stvote/election/race">Election Race</NavDropdown.Item>
                        <NavDropdown.Item eventKey={3} href="/stvote/election/chart">Race Charts</NavDropdown.Item>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavBar;