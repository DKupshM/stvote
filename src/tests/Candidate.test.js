import { Candidate } from "../Data_Models/Candidate";
import { Party } from "../Data_Models/Party";

const mock_party = { party_id: 1, party_name: "Test", party_color: "#fcba03" }
const party = new Party(mock_party.party_name, mock_party.party_color);
const mock_candidate = { candidate_id: 1, candidate_name: "Test", candidate_party: party }

describe('Test Mock Candidate', () => {
    let candidate = new Candidate(mock_candidate.candidate_id, mock_candidate.candidate_name, mock_candidate.candidate_party);

    test('Test Candidate ID', () => {
        expect(candidate.candidate_id).toBe(mock_candidate.candidate_id);
    });

    test('Test Candidate Name', () => {
        expect(candidate.candidate_name).toBe(mock_candidate.candidate_name);
    });

    test('Test Candidate Party', () => {
        expect(candidate.candidate_party).toBe(party);
    });
});