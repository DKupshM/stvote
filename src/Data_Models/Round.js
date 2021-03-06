import { CandidateState } from "./Candidate";

export class Round {
    constructor(round_number, quota) {
        this.round_number = round_number;
        this.quota = quota;
        this.state = RoundState.RUNNING;

        this.candidates = []

        this.elected_candidates = []
        this.active_candidates = []
        this.start_inactive_candidates = []
        this.start_active_candidates = []
        this.eliminated_candidates = []

        this.ballots = { exhausted: 0 }
        this.ballotsToTransfer = {}
        this.candidate_ballots = { exhausted: [] }
        this.candidate_real_scores = {}
        this.candidate_scores = { exhausted: 0 }
        this.rankings = {};
    }

    add_ballot = (ballot, value) => {
        if (this.state === RoundState.COMPLETE)
            throw new Error("Can't Add Ballot to Complete Round");

        if (this.ballots[ballot.ballot_id] !== undefined)
            throw new Error("Already added Ballot");

        let candidate = this.find_next_active_candidate(ballot.candidates);
        if (candidate !== "exhausted") {
            this.candidate_ballots[candidate.candidate_id].push(ballot);
            this.candidate_scores[candidate.candidate_id] += value;
        } else {
            this.candidate_ballots[candidate].push(ballot);
            this.candidate_scores[candidate] += value;
        }
        this.ballots[ballot.ballot_id] = value;
    }

    find_next_active_candidate = (candidates) => {
        for (const candidate of candidates)
            if (this.active_candidates.includes(candidate))
                return candidate
        return "exhausted";
    }

    add_candidate = (candidate, state) => {
        if (this.state === RoundState.COMPLETE)
            throw new Error("Can't Add Ballot to Complete Round");

        this.candidates.push(candidate);
        if (state === CandidateState.ELECTED) {
            this.elected_candidates.push(candidate);
            this.start_inactive_candidates.push(candidate);
        } else if (state === CandidateState.RUNNING) {
            this.active_candidates.push(candidate);
            this.start_active_candidates.push(candidate);
        } else {
            this.eliminated_candidates.push(candidate);
            this.start_inactive_candidates.push(candidate);
        }

        this.candidate_ballots[candidate.candidate_id] = [];
        this.candidate_scores[candidate.candidate_id] = 0;
    }

    set_elected_candidate = (candidate) => {
        if (this.state === RoundState.COMPLETE)
            throw new Error("Round Complete");

        this.active_candidates = this.active_candidates.filter((value) => {
            return value !== candidate
        });

        this.ballotsToTransfer[candidate.candidate_id] = { ...this.candidate_ballots[candidate.candidate_id] }
        this.elected_candidates.push(candidate);
    }

    set_eliminate_candidate = (candidate) => {
        if (this.state === RoundState.COMPLETE)
            throw new Error("Round Complete");

        this.active_candidates = this.active_candidates.filter((value) => {
            return value !== candidate
        });

        this.ballotsToTransfer[candidate.candidate_id] = { ...this.candidate_ballots[candidate.candidate_id] }
        this.eliminated_candidates.push(candidate);
    }

    candidate_ballot = (candidate) => {
        if (candidate === null)
            candidate = "exhausted";
        else if (candidate.candidate_id !== undefined)
            candidate = candidate.candidate_id;

        let ballots = [];
        for (const ballot of this.candidate_ballots[candidate]) {
            ballots.push([ballot, this.ballots[ballot.ballot_id]]);
        }
        return ballots;
    }

    candidate_score = (candidate) => {
        if (candidate.candidate_id !== undefined)
            return this.candidate_scores[candidate.candidate_id];
        return this.candidate_scores[candidate];
    }

    complete = () => {
        const isCandidateElected = (candidate_id) => {
            for (const candidate in this.elected_candidates) {
                if (candidate_id === this.elected_candidates[candidate].candidate_id) {
                    return true;
                }
            }
            return false;
        }
        this.candidate_real_scores = { ...this.candidate_scores }
        for (const candidate_id in this.candidate_real_scores) {
            if (this.candidate_real_scores[candidate_id] === 0 && isCandidateElected(candidate_id)) {
                this.candidate_real_scores[candidate_id] = this.quota;
            }
        }

        this.state = RoundState.COMPLETE;
    }
}

export const RoundState = {
    RUNNING: "RUNNING",
    COMPLETE: "COMPLETE"
};