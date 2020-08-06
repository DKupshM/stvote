import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import uuid from 'react-uuid'

import DropdownButton from 'react-bootstrap/DropdownButton'
import { Dropdown } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import useInterval from '../Hooks/useInterval';
import CandidateList from './Race/CandidateList';

import FirstChoicePie from './Models/FirstChoicePie';
import ElectedCandidatesPie from './Models/ElectedCandidatesPie';
import CandidatesRanked from './Models/CandidatesRanked';
import PartyPercentage from './Models/PartyPercentage';
import EventualWinner from './Models/EventualWinner';

import { Race } from '../../Data_Models/Race';
import { Voter } from '../../Data_Models/Voter';
import { Ballot } from '../../Data_Models/Ballot';
import { Party } from '../../Data_Models/Party';
import { Candidate } from '../../Data_Models/Candidate';

import './ElectionPage.css'
import { RoundState } from '../../Data_Models/Round';

function ElectionPage(props) {

    // Helper Functions
    const find_race_by_id = (id) => {
        for (let i = 0; i < races.length; i++) {
            if (String(races[i].race_id) === id)
                return races[i];
        }
        return null;
    };

    const find_race_by_name = (name) => {
        for (let i = 0; i < races.length; i++) {
            if (races[i].race_name === name)
                return races[i];
        }
        return null;
    };

    const find_candidate_by_id = (race_id, candidate_id) => {
        let race = find_race_by_id(race_id);
        if (race !== null)
            for (let i = 0; i < race.candidates.length; i++)
                if (String(race.candidates[i].candidate_id) === candidate_id)
                    return race.candidates[i];
        return null;
    };

    const find_party_by_name = (name) => {
        for (let i = 0; i < parties.length; i++)
            if (parties[i].party_name === name)
                return parties[i];
        return null
    };

    const loadParties = (party_data) => {
        let partiesToAdd = []
        for (const party of party_data.parties) {
            for (let i = 0; i < partiesToAdd.length; i++)
                if (partiesToAdd.party_name === party.party_name)
                    continue;
            partiesToAdd.push(new Party(party.party_name, party.party_color));
        }
        return partiesToAdd;

        return [new Party("CalSERVE", "21c46b"),
        new Party("Cooperative Movement Party (CMP)", "009933"), new Party("Student Action", "1779e3"),
        new Party("Independent", "818285"), new Party("Pirate Party", "9d00e6"),
        new Party("Defend Affirmative Action Party (DAAP)", "f00b07"), new Party("SQUELCH!", "ffd900")];
    }

    const loadRaces = (election_configuration) => {
        let racesToAdd = []
        for (const race of election_configuration.races) {
            for (let i = 0; i < racesToAdd.length; i++)
                if (racesToAdd.race_id === race.race_id)
                    continue;
            racesToAdd.push(new Race(race.race_id, race.race_position, race.race_max_winners));
        }
        return racesToAdd;
    }

    const loadCandidates = (candidate_data) => {
        for (let key in candidate_data) {
            const race = find_race_by_name(key);
            if (race === null)
                continue;
            for (const candidate of candidate_data[key]) {
                let party = find_party_by_name(candidate.party);
                if (party === null) {
                    party = new Party(candidate.party, "FFFFFF");
                    setParties(parties.push(party));
                }
                race.add_candidate(new Candidate(candidate.number, candidate.name, party));
            }
        }
        setCandidatesLoaded(true);

        return;
    }

    const loadVoters = (ballot_data) => {
        let voters = []
        for (const item of ballot_data.ballots) {
            let voter = new Voter(uuid())
            for (let key in item) {
                let candidateOrder = []
                for (let candidate_id of item[key]) {
                    let candidate = find_candidate_by_id(key, candidate_id);
                    candidateOrder.push(candidate);
                };

                const ballot = new Ballot(uuid(), candidateOrder);
                const race = find_race_by_id(key);
                if (race !== null) {
                    race.add_ballot(ballot);
                }
                voter.add_ballot(key, ballot);
            }
            voters.push(voter);
        }
        return voters;
    }

    const [election_configuration, setElectionConfiguration] = useState([]);
    const [candidate_data, setCandidateData] = useState([]);
    const [party_data, setPartyData] = useState([]);
    const [ballot_data, setBallotData] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const [partiesLoaded, setPartiesLoaded] = useState(false);
    const [racesLoaded, setRacesLoaded] = useState(false);
    const [candidatesLoaded, setCandidatesLoaded] = useState(false);
    const [votersLoaded, setVotersLoaded] = useState(false);

    const [parties, setParties] = useState([]);
    const [races, setRaces] = useState([]);
    const [voters, setVoters] = useState([]);

    const [activeRace, setActiveRace] = useState(null);
    const [speed] = useState(1000);
    const [refresh, setRefresh] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [page, setPage] = useState(0);

    useEffect(() => {
        if (!isLoading)
            setPartiesLoaded(true);
    }, [parties]);

    useEffect(() => {
        if (!isLoading) {
            if (activeRace === null)
                setActiveRace(races[0]);
            setRacesLoaded(true);
        }
    }, [races]);

    useEffect(() => {
        if (!isLoading)
            setVotersLoaded(true);
    }, [voters]);


    useEffect(() => {
        const loadData = async () => {
            let electionId = props.match.params.electionId;

            if (typeof (electionId) === "undefined") {
                electionId = "uc_berkeley";
            }

            let yearId = props.match.params.yearId;
            if (typeof (yearId) === "undefined") {
                yearId = "2015";
            }

            let databaseString = 'elections/' + electionId + "/" + yearId;

            console.log("Loading Data From DataBase");
            await firebase.database().ref(databaseString).once('value', snapshot => {
                if (!snapshot.exists()) {
                    console.log("Path Doesn't Exist, Loading Default Reference");
                    databaseString = 'elections/uc_berkeley/2015';
                }
            });

            firebase.database().ref(databaseString).once('value', snapshot => {
                setElectionConfiguration(snapshot.child('election_configuration').val());
                setCandidateData(snapshot.child('candidate_data').val());
                setPartyData(snapshot.child('parties_data').val());
                setBallotData(snapshot.child('ballot_data').val());
                setIsLoading(false);
            });
        }

        if (isLoading) {
            loadData();
            return;
        }
        if (!partiesLoaded) {
            console.log("Loading Parties")
            setParties(loadParties(party_data));
        }

        if (partiesLoaded && !racesLoaded) {
            console.log("Loading Races");
            setRaces(loadRaces(election_configuration));
            return;
        }

        if (racesLoaded && !candidatesLoaded) {
            console.log("Loading Candidates");
            loadCandidates(candidate_data);
            return;
        }

        if (candidatesLoaded && !votersLoaded) {
            console.log("Loading Voters");
            setVoters(loadVoters(ballot_data));
        }
        if (votersLoaded) {
            console.log("Finished Loading");
        }
        console.log("Finished");
    }, [isLoading, partiesLoaded, racesLoaded, candidatesLoaded, votersLoaded]);

    useInterval(() => {
        if (activeRace.state !== RoundState.COMPLETE && isRunning) {

            for (let i = 0; i < Math.floor(speed / 50); i++)
                activeRace.run_race_step();
            setRefresh(!refresh);
        } else {
            setIsRunning(false)
        }
    }, isRunning ? Math.min(1000 / speed, 20) : null)

    const switchActiveRace = (race) => {
        setIsRunning(false);
        setActiveRace(race);
    }

    const finishRaces = () => {
        for (const race of races) {
            while (race.state !== RoundState.COMPLETE) {
                race.run_race_step();
            }
        }
        setRefresh(!refresh);
    }

    // Render Everything
    if (isLoading || activeRace == null)
        return <h1> Loading... </h1>

    if (page === 0) {
        let electionButton = null;
        if (!isRunning) {
            electionButton =
                <Button onClick={() => setIsRunning(true)} disabled={false} variant="primary" size="lg">
                    {'Run Election'}
                </Button>
        }
        else {
            electionButton =
                <Button onClick={null} disabled={true} variant="primary" size="lg">
                    {'Election is Running...'}
                </Button>
        }

        let dropdownItems = races.map((item, index) => (
            <Dropdown.Item key={index} as="button" onClick={() => switchActiveRace(item)} > {item.race_name}</Dropdown.Item >
        ));

        return (
            <div className="text-center">
                <ButtonGroup size="lg" style={{ padding: "0% 0% 5% 0%" }}>
                    <Button disabled={true} variant="primary" size="lg">
                        {'Election'}
                    </Button>
                    <Button onClick={() => setPage(1)} disabled={false} variant="primary" size="lg">
                        {'Charts'}
                    </Button>
                </ButtonGroup>
                <div className="title-text">
                    <h1> {activeRace.race_name} </h1>
                </div>
                <div className="election-table">
                    <CandidateList candidates={activeRace.candidateTable} refresh={refresh} />
                </div>
                <ButtonGroup size="lg" style={{ padding: "0% 0% 5% 0%" }}>
                    <DropdownButton id="dropdown-item-button" as={ButtonGroup} title="Change Race" variant="primary" size="lg">
                        {dropdownItems}
                    </DropdownButton>
                    {electionButton}
                    <Button onClick={finishRaces} disabled={false} variant="primary" size="lg">
                        {'Finish Races'}
                    </Button>
                </ButtonGroup>
            </div >
        );
    } else {
        return (
            <div className="text-center">
                <ButtonGroup size="lg" style={{ padding: "0% 0% 5% 0%" }}>
                    <Button onClick={() => setPage(0)} disabled={false} variant="primary" size="lg">
                        {'Election'}
                    </Button>
                    <Button disabled={true} variant="primary" size="lg">
                        {'Charts'}
                    </Button>
                </ButtonGroup>
                <div className="title-text">
                    <h1> {activeRace.race_name} </h1>
                </div>
                <div>
                    <FirstChoicePie race={activeRace} parties={parties} style={{ width: "200 px" }} />
                    <ElectedCandidatesPie race={activeRace} parties={parties} style={{ width: "200 px" }} />
                    <CandidatesRanked race={activeRace} parties={parties} style={{ width: "200 px" }} />
                    <PartyPercentage race={activeRace} parties={parties} style={{ width: "200 px" }} />
                    <EventualWinner race={activeRace} style={{ width: "200 px" }} />
                </div>
            </div >
        );
    }
}

export default ElectionPage;