import React from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

function Home(props) {
    const OnClick = (election_title, year) => {

        console.log("Clicked", election_title, year);
    }
    const CreateSelectButton = (election_title, filename, years) => {
        let yearButtons = years.map((item, index) => (
            <Button key={index} href={"/stvote/election/" + filename + "/" + item} onClick={() => OnClick(election_title, item)}>{item}</Button>
        ));

        return (
            <ButtonGroup vertical size="lg" style={{ padding: '2%' }}>
                <Button variant="dark" disabled={true}>{election_title}</Button>
                {yearButtons}
            </ButtonGroup>
        );
    }

    let asuc = CreateSelectButton('ASUC Berkeley', "uc_berkeley", [2015, 2016, 2017, 2018, 2019, 2020]);
    let asucsb = CreateSelectButton('ASUC Santa Barbara', "uc_santa_barbara", [2016, 2017, 2018, 2019, 2020]);
    let asucd = CreateSelectButton('AS UC Davis', "uc_davis", [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020]);
    let asucsc = CreateSelectButton('AS UC Santa Cruz', "uc_berkeley", [2018, 2019, 2020]);
    let asucla = CreateSelectButton('AS UC Los Angeles', "uc_berkeley", [2018, 2019, 2020]);

    return (
        <div className="text-center">
            <h1> STVote Elections </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                {asuc}
                {asucsb}
                {asucd}
                {asucsc}
                {asucla}
            </div>
        </div >
    );
}

export default Home;
