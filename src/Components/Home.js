import React from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'

function Home(props) {
    const OnClick = (election_title, year) => {

        console.log("Clicked", election_title, year);
    }
    const CreateSelectButton = (election_title, years) => {
        let yearButtons = years.map((item, index) => (
            <Button key={index} href={"/stvote/election/" + "UC_Berkeley" + "/" + item} onClick={() => OnClick(election_title, item)}>{item}</Button>
        ));

        return (
            <ButtonGroup vertical size="lg" style={{ padding: '2%' }}>
                <Button variant="dark" disabled={true}>{election_title}</Button>
                {yearButtons}
            </ButtonGroup>
        );
    }

    let asuc = CreateSelectButton('ASUC Berkeley', [2015, 2019, 2020]);
    let asucsb = CreateSelectButton('ASUC Santa Barbara', [2018, 2019, 2020]);
    let asucsd = CreateSelectButton('AS UC San Diego', [2018, 2019, 2020]);
    let asucd = CreateSelectButton('AS UC Davis', [2018, 2019, 2020]);
    let asucsc = CreateSelectButton('AS UC Santa Cruz', [2018, 2019, 2020]);
    let asucla = CreateSelectButton('AS UC Los Angeles', [2018, 2019, 2020]);

    return (
        <div class="text-center">
            <h1> STVote Elections </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                {asuc}
                {asucsb}
                {asucsd}
                {asucd}
                {asucsc}
                {asucla}
            </div>
        </div >
    );
}

export default Home;
