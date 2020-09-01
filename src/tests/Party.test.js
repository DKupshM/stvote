import { Party } from "../Data_Models/Party";

const mock_party = { party_id: 1, party_name: "Test", party_color: "#fcba03" }

describe('Test Basic Mock_Party', () => {
    let party = new Party(mock_party.party_name, mock_party.party_color);

    test('Test Party Name', () => {
        expect(party.party_name).toBe(party.party_name);
    });

    test('Test Party Color', () => {
        expect(party.party_color).toBe(party.party_color);
    });
});

describe('Test Invalid Color Mock_Party', () => {
    let party = new Party(mock_party.party_name, "#Test");

    test('Test Party Name', () => {
        expect(party.party_name).toBe(party.party_name);
    });

    test('Test Party Color', () => {
        expect(party.party_color).toBe("#FFFFFF");
    });
});