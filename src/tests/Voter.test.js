import { Candidate } from "../Data_Models/Candidate";
import { Party } from "../Data_Models/Party";
import { Ballot } from "../Data_Models/Ballot";
import { Voter } from "../Data_Models/Voter";

const mock_party = { party_id: 1, party_name: "Test", party_color: "#fcba03" }
const party = new Party(mock_party.party_name, mock_party.party_color);

const mock_candidate = { candidate_id: 1, candidate_name: "Test", candidate_party: party }
const candidate = new Candidate(mock_candidate.candidate_id, mock_candidate.candidate_name, mock_candidate.candidate_party);
const mock_candidate_2 = { candidate_id: 2, candidate_name: "Test_2", candidate_party: party }
const candidate_2 = new Candidate(mock_candidate_2.candidate_id, mock_candidate_2.candidate_name, mock_candidate_2.candidate_party);

const mock_ballot = { ballot_id: 1, candidates: [candidate, candidate_2] }
const ballot = new Ballot(mock_ballot.ballot_id, mock_ballot.candidates);

const mock_ballot_2 = { ballot_id: 2, candidates: [candidate_2, candidate] }
const ballot_2 = new Ballot(mock_ballot_2.ballot_id, mock_ballot_2.candidates);

const mock_voter = { voter_id: 1, ballots: { 1: [ballot], 2: [ballot, ballot_2] } };

describe('Test Mock Voter', () => {

    let voter = new Voter(mock_voter.voter_id);

    test('Test Voter ID', () => {
        expect(voter.voter_id).toBe(mock_voter.voter_id);
    });

    voter.add_ballot(1, mock_voter.ballots[1][0]);
    voter.add_ballot(2, mock_voter.ballots[2][0]);
    voter.add_ballot(2, mock_voter.ballots[2][1]);


    test('Test Voter Races', () => {
        expect(voter.participating_races()).toStrictEqual(["1", "2"]);
        expect(voter.participating_in_race(0)).toBe(false);
        expect(voter.participating_in_race(1)).toBe(true);
        expect(voter.participating_in_race(2)).toBe(true);
    });

    test('Test Voter get Ballots', () => {
        expect(voter.get_ballot_for_race(0)).toStrictEqual(null);
        expect(voter.get_ballot_for_race(1)).toStrictEqual(mock_voter.ballots[1][0]);
        expect(voter.get_ballot_for_race(2)).toStrictEqual(mock_voter.ballots[2]);
    });
});