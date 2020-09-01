import { Candidate } from "../Data_Models/Candidate";
import { Party } from "../Data_Models/Party";
import { Ballot } from "../Data_Models/Ballot";

const mock_party = { party_id: 1, party_name: "Test", party_color: "#fcba03" }
const party = new Party(mock_party.party_name, mock_party.party_color);

const mock_candidate = { candidate_id: 1, candidate_name: "Test", candidate_party: party }
const candidate = new Candidate(mock_candidate.candidate_id, mock_candidate.candidate_name, mock_candidate.candidate_party);
const mock_candidate_2 = { candidate_id: 2, candidate_name: "Test_2", candidate_party: party }
const candidate_2 = new Candidate(mock_candidate_2.candidate_id, mock_candidate_2.candidate_name, mock_candidate_2.candidate_party);

const mock_ballot = { ballot_id: 1, candidates: [candidate, candidate_2] }

describe('Test Mock Ballot', () => {

    let ballot = new Ballot(mock_ballot.ballot_id, mock_ballot.candidates);

    test('Test Ballot ID', () => {
        expect(ballot.ballot_id).toBe(mock_ballot.ballot_id);
    });

    test('Test Ballot Candidates', () => {
        expect(ballot.candidates).toBe(mock_ballot.candidates);
    });

    test('Test Ballot Candidate Order', () => {
        expect(ballot.candidates[0]).toBe(mock_ballot.candidates[0]);
        expect(ballot.candidates[1]).toBe(mock_ballot.candidates[1]);
    });
});