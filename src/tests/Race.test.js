import { Candidate, CandidateState } from "../Data_Models/Candidate";
import { Party } from "../Data_Models/Party";
import { Ballot } from "../Data_Models/Ballot";
import { Race, RaceState } from "../Data_Models/Race";

const create_candidate_list = (num, start_id) => {
    let candidates = []
    const party = new Party("Independant", "#fcba03");
    for (let i = 0; i < num; i++) {
        candidates.push(new Candidate(i + start_id, "Test " + i, party));
    }
    return candidates
}

const create_ballot_list = (num, candidates, start_id) => {
    let ballots = []

    for (let i = 0; i < num; i++) {
        const ballot_items = Math.floor(Math.random() * (candidates.length - 2)) + 1;
        let new_candidates = [];
        while (new_candidates.length < ballot_items - 1) {
            let candidate = candidates[Math.floor(Math.random() * candidates.length)];
            if (!new_candidates.includes(candidate))
                new_candidates.push(candidate);
        }
        ballots.push(new Ballot(i + start_id, new_candidates));
    }

    return ballots;
}

describe('Test Round', () => {
    let race = new Race(1, "Test", 5);

    test('Test Race Initial State', () => {
        expect(race.state).toBe(RaceState.ADDING);
    });

    test('Test Race Seats', () => {
        expect(race.seats).toBe(5);
    });

    test('Test Round Quota', () => {
        expect(() => { race.quota() }).toThrow();
    });

    let active_candidates = create_candidate_list(10, 0);
    let elected_candidates = create_candidate_list(10, 10);
    let eliminated_candidates = create_candidate_list(10, 20);
    let ballots = create_ballot_list(100, active_candidates, 0);

    for (const candidate of active_candidates) {
        race.add_candidate(candidate);
    }

    for (const candidate of elected_candidates) {
        race.add_candidate(candidate);
    }

    for (const candidate of eliminated_candidates) {
        race.add_candidate(candidate);
    }

    test('Test Race Start Candidates', () => {
        expect(race.candidates).toBe([...active_candidates, ...elected_candidates, ...eliminated_candidates]);
    });

    for (const ballot of ballots) {
        race.add_ballot(ballot);
    }

    test('Test Race Add Ballots', () => {
        expect(Object.keys(round.ballots).length).toBe(ballots.length + 1);
        expect(round.ballots["exhausted"]).toBe(0);

        for (const key of Object.keys(round.ballots))
            if (key != "exhausted")
                expect(round.ballots[key]).toBe(1);

        let totalScore = round.candidate_score("exhausted");
        for (const candidate of active_candidates)
            totalScore += round.candidate_score(candidate);
        expect(totalScore).toBe(ballots.length);
    });

    test('Test Round Elect Candidate', () => {
        for (const ballot of new_ballots) {
            round.add_ballot(ballot, .5);
        }
        for (const ballot of new_ballots)
            expect(round.ballots[ballot.ballot_id]).toBe(.5);
    });

    test('Test Round Elect Candidate', () => {
        for (const candidate of active_candidates) {
            round.set_elected_candidate(candidate);
        }
        expect(round.active_candidates).toStrictEqual([]);
        expect(round.elected_candidates).toStrictEqual([...elected_candidates, ...active_candidates]);
    });

    test('Test Complete Round', () => {
        round.complete()
        expect(round.state).toStrictEqual(RoundState.COMPLETE);
        expect(() => { round.add_ballot(ballots[0]) }).toThrow();
        expect(() => { round.add_ballot(ballots[0], 1) }).toThrow();
        expect(() => { round.add_candidate(active_candidates[0]) }).toThrow();
    });
});