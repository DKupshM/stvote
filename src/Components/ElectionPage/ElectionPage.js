import React, { useState } from 'react';
import uuid from 'react-uuid'

import DropdownButton from 'react-bootstrap/DropdownButton'
import { Dropdown } from 'react-bootstrap';
import Button from 'react-bootstrap/Button'
import ButtonGroup from 'react-bootstrap/ButtonGroup'

import useInterval from '../Hooks/useInterval';
import CandidateList from './Race/CandidateList';

import { Race } from '../../Data_Models/Race';
import { Voter } from '../../Data_Models/Voter';
import { Ballot } from '../../Data_Models/Ballot';
import { Party } from '../../Data_Models/Party';
import { Candidate } from '../../Data_Models/Candidate';

import election_configuration from '../../Data/UC_Berkeley/2015/Configuration.json';
import candidate_data from '../../Data/UC_Berkeley/2015/Candidates.json';
import ballot_data from '../../Data/UC_Berkeley/2015/Ballots.json';

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

    // Load Parties
    const [parties, setParties] = useState(() => {
        return [new Party("CalSERVE", "21c46b"), new Party("Student Action", "1779e3"),
        new Party("Independent", "818285"), new Party("Pirate Party", "9d00e6"),
        new Party("DAAP", "f00b07"), new Party("SQUELCH!", "ffd900")]
    });

    // Load Races
    const [races] = useState(() => {
        let racesToAdd = []
        for (const race of election_configuration.races) {
            for (let i = 0; i < racesToAdd.length; i++)
                if (racesToAdd.race_id === race.race_id)
                    continue;
            racesToAdd.push(new Race(race.race_id, race.race_position, race.race_max_winners));
        }
        console.log(racesToAdd);
        return racesToAdd;
    });

    // Load Voters
    const [voters] = useState(() => {
        console.log("Loading Candidates")
        // Load Candidates
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

        console.log("Loading Voters")
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
        console.log(voters);
        return voters;
    });

    const [activeRace, setActiveRace] = useState(races[0]);
    const [speed] = useState(1);
    const [refresh, setRefresh] = useState(false);

    const [isRunning, setIsRunning] = useState(false);

    useInterval(() => {
        if (activeRace.state !== RoundState.COMPLETE && isRunning) {
            activeRace.run_race_step();
            setRefresh(!refresh);
        } else {
            setIsRunning(false)
        }
    }, isRunning ? speed : null)

    const switchActiveRace = (race) => {
        setIsRunning(false);
        setActiveRace(race);
    }

    // Render Everything
    let dropdownItems = races.map((item, index) => (
        <Dropdown.Item key={index} as="button" onClick={() => switchActiveRace(item)} > {item.race_name}</Dropdown.Item >
    ));

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

    return (
        <div class="text-center">
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
            </ButtonGroup>
        </div >
    );
}

/*
export class ElectionPage extends Component {

    constructor(props) {
        super(props)

        // Load Configuration File
        const races = this.loadConfiguration();
        // Load Custom Parties
        const parties = this.loadParties();
        // Load Candidates
        this.loadCandidates(races, parties);

        this.state = {
            races: races,
            voters: [],
            parties: parties,
            step_per_sec: 1000,
            activeRace: null,
            running: false,
            loaded: false,
        }
        this.candidate_list = React.createRef();
        const { match: { params } } = this.props;
        console.log(params.page + " constructor");
    }



    loadConfiguration = () => {
        let racesToAdd = []
        let races = election_configuration.races;
        races.map(async (item) => {
            for (let i = 0; i < racesToAdd.length; i++)
                if (racesToAdd.race_id === item.race_id)
                    continue;
            racesToAdd.push(new Race(item.race_id, item.race_position, item.race_max_winners));
        });
        return racesToAdd;
    }

    loadParties = () => {
        return [new Party("CalSERVE", "21c46b"), new Party("Student Action", "1779e3"),
        new Party("Independent", "818285"), new Party("Pirate Party", "9d00e6"),
        new Party("DAAP", "f00b07"), new Party("SQUELCH!", "ffd900")]
    }

    loadCandidates = (races, parties) => {
        const find_by_race_name = (name) => {
            for (let i = 0; i < races.length; i++)
                if (races[i].race_name === name)
                    return races[i];
            return null;
        }

        const find_party_by_name = (name) => {
            for (let i = 0; i < parties.length; i++)
                if (parties[i].party_name === name)
                    return parties[i];
            return null
        }

        for (let key in candidate_data) {
            const race = find_by_race_name(key)
            if (race === null)
                continue;
            candidate_data[key].map(async (item) => {
                let party = find_party_by_name(item.party);
                if (party === null) {
                    party = new Party(item.party, "FFFFFF");
                    parties.push(party);
                }
                race.add_candidate(new Candidate(item.number, item.name, party))
            });
        }
    }

    componentDidMount = () => {
        if (this.state.activeRace === null && this.state.races.length > 0) {
            this.set_active_race(this.state.races[0]);
        }

        const { match: { params } } = this.props;
        console.log(params.page);
    }

    set_active_race = async (race) => {
        await this.candidate_list.current.clearCandidates();
        await this.candidate_list.current.addCandidates(race.candidates);
        if (race.state !== RaceState.ADDING) {
            this.candidate_list.current.updateCandidates(race.candidateTable());
        }

        return new Promise(resolve => {
            this.setState({ activeRace: race }
                , () => (resolve(true)));
        });
    }

    find_race_by_id = (id) => {
        for (let i = 0; i < this.state.races.length; i++) {
            if (String(this.state.races[i].race_id) === id)
                return this.state.races[i];
        }
        return null;
    }

    find_candidate_by_id = (race_id, candidate_id) => {
        let race = this.find_race_by_id(race_id);
        if (race !== null)
            for (let i = 0; i < race.candidates.length; i++)
                if (String(race.candidates[i].candidate_id) === candidate_id)
                    return race.candidates[i];
        return null;
    }

    loadVoters = () => {
        if (!this.state.loaded) {
            console.log("Loading Voters")
            let ballots = ballot_data.ballots;

            ballots.map((item) => {
                let voter = new Voter(uuid())
                for (let key in item) {
                    let candidateOrder = []
                    item[key].map((candidate_id) => {
                        let candidate = this.find_candidate_by_id(key, candidate_id);
                        candidateOrder.push(candidate)
                    });

                    const ballot = new Ballot(uuid(), candidateOrder);
                    const race = this.find_race_by_id(key);
                    if (race !== null) {
                        race.add_ballot(ballot);
                    }
                    voter.add_ballot(key, ballot);
                }

                this.setState(function (state) {
                    for (let i = 0; i < state.voters.length; i++) {
                        if (state.voters[i].voter_id === voter.voter_id)
                            return { ...state }
                    }
                    return { voters: [...state.voters, voter] }
                });
            });

            this.setState({ loaded: true }, () => {
                console.log("Loaded Voters");
                console.log(this.state.voters);
            });
        }
    }

    runElection = () => {
        this.setState({ running: true }, () => {
            this.interval = setInterval(() => {
                this.runStep();
            }, 10);
        });
    }

    runStep = () => {
        if (this.state.activeRace.state !== RoundState.COMPLETE) {
            for (let i = 0; i < (this.state.step_per_sec / 100); i++) {
                this.state.activeRace.run_race_step();
            }
            this.candidate_list.current.updateCandidates(this.state.activeRace.candidateTable());
        }
        else {
            clearInterval(this.interval);
            this.setState({ running: false });
        }
    }

    render() {
        let ElectionTitle = <h1> Election Title </h1>
        if (this.state.activeRace !== null) {
            ElectionTitle = <h1> {this.state.activeRace.race_name} </h1>
        }
        let dropdownItems = this.state.races.map((item, index) => (
            <Dropdown.Item key={index} as="button" onClick={() => this.set_active_race(item)} > {item.race_name}</Dropdown.Item >
        ));

        let electionButton = null;
        if (!this.state.loaded) {
            electionButton =
                <Button onClick={null} disabled={true} variant="primary" size="lg">
                    {'Waiting to Load Election...'}
                </Button>
        }
        else if (!this.state.running) {
            electionButton =
                <Button onClick={this.runElection} disabled={false} variant="primary" size="lg">
                    {'Run Election'}
                </Button>
        }
        else {
            electionButton =
                <Button onClick={null} disabled={true} variant="primary" size="lg">
                    {'Election is Running...'}
                </Button>
        }

        return (
            <div class="text-center">
                <div className="title-text">
                    {ElectionTitle}
                </div>
                <div className="election-table">
                    <CandidateList candidates={race.candidates} ref={this.candidate_list} />
                </div>
                <ButtonGroup size="lg" style={{ padding: "0% 0% 5% 0%" }}>
                    <DropdownButton id="dropdown-item-button" as={ButtonGroup} title="Change Race" variant="primary" size="lg">
                        {dropdownItems}
                    </DropdownButton>
                    <Button onClick={this.loadVoters} variant="primary">
                        Set Up Election
                            </Button>{' '}
                    {electionButton}
                </ButtonGroup>
            </div >
        );
    }
}
*/

export default ElectionPage;