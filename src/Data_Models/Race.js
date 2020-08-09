
import { Round, RoundState } from './Round';
import { CandidateState } from './Candidate';

export class Race {

    constructor(race_id, race_name, seats) {
        this.race_id = race_id
        this.race_name = race_name
        this.seats = seats

        this.rounds = [];

        this.state = RaceState.ADDING;

        this.candidates = []
        this.ballots = []

        this.transfer_voters = []
        this.ballots_to_apply = []
        this.candidate_ballot_rankings = {}

        this.first_scores = []

        // Set Candidate States
        this.elected = {}
        this.running = {}
        this.transferring = {}
        this.transfered = {}
    }

    add_candidate = (candidate) => {
        for (const current_candidate of this.candidates)
            if (current_candidate.candidate_id === candidate.candidate_id)
                return;
        this.running[candidate.candidate_id] = [0, this.running.length];
        this.candidates.push(candidate);
    }

    add_ballot = (ballot) => {
        if (ballot.candidates.length === 0)
            return;
        for (let i = 0; i < this.ballots.length; i++)
            if (this.ballots[i].ballot_id === ballot.ballot_id)
                return;
        this.ballots.push(ballot);
    }

    num_candidates = () => {
        return this.candidates.length;
    }

    quota = () => {
        if (this.state === RaceState.ADDING)
            throw new Error("Can't Get Quota While Adding Ballots");
        return Math.floor(this.ballots.length / (this.seats + 1)) + 1;
    }

    currentScores = () => {
        const find_candidate_by_id = (id) => {
            for (const candidate of this.candidates)
                if (candidate.candidate_id === id)
                    return candidate;
            return null;
        }
        let scores = [];
        for (const candidate in this.elected) {
            scores.push({
                candidate: find_candidate_by_id(candidate),
                score: this.elected[candidate][0],
            });
        }
        for (const candidate in this.running) {
            scores.push({
                candidate: find_candidate_by_id(candidate),
                score: this.running[candidate][0],
            });
        }
        for (const candidate in this.transferring) {
            scores.push({
                candidate: find_candidate_by_id(candidate),
                score: this.transferring[candidate][0],
            });
        }
        for (const candidate in this.transfered) {
            scores.push({
                candidate: find_candidate_by_id(candidate),
                score: this.transfered[candidate][0],
            });
        }
        return scores;
    }

    candidateTable = () => {
        const find_candidate_by_id = (id) => {
            for (const candidate of this.candidates)
                if (candidate.candidate_id === id)
                    return candidate;
            return null;
        }
        let quota = 0;
        if (this.state !== RaceState.ADDING)
            quota = this.quota();

        let candidateTable = []
        // Candidate, Status, Position, Score

        for (const candidate in this.elected) {
            candidateTable.push({
                candidate: find_candidate_by_id(candidate),
                status: CandidateState.ELECTED,
                position: this.elected[candidate][1],
                score: this.elected[candidate][0],
                quota: quota,
            });
        }
        for (const candidate in this.running) {
            candidateTable.push({
                candidate: find_candidate_by_id(candidate),
                status: CandidateState.RUNNING,
                position: this.running[candidate][1],
                score: this.running[candidate][0],
                quota: quota,
            });
        }
        for (const candidate in this.transferring) {
            candidateTable.push({
                candidate: find_candidate_by_id(candidate),
                status: CandidateState.TRANSFERRING,
                position: this.transferring[candidate][1],
                score: this.transferring[candidate][0],
                quota: quota,
            });
        }
        for (const candidate in this.transfered) {
            candidateTable.push({
                candidate: find_candidate_by_id(candidate),
                status: CandidateState.TRANSFERED,
                position: this.transfered[candidate][1],
                score: this.transfered[candidate][0],
                quota: quota,
            });
        }
        return candidateTable;
    }

    start_tabulation = () => {
        if (this.state === RaceState.ADDING)
            this.state = RaceState.TABULATING;
    }

    run_race_step = () => {
        const begin_race = () => {
            console.log("Beginning Race for", this.race_name);
            console.log("Quota is", this.quota())
            if (this.ballots.length === 0) {
                this.state = RaceState.COMPLETE;
                console.log("No Ballots Cast in Race");
            }
            else {
                let round = new Round(0);

                for (let i = 0; i < this.candidates.length; i++) {
                    round.add_candidate(this.candidates[i], CandidateState.RUNNING);
                }


                for (let i = 0; i < this.ballots.length; i++) {
                    this.ballots_to_apply.push([this.ballots[i], 1]);
                }
                this.rounds.push(round);
            }
        }

        const add_round = () => {
            const find_candidate_by_id = (id) => {
                for (const candidate of this.candidates)
                    if (candidate.candidate_id === id)
                        return candidate;
                return null;
            }
            console.log("Starting Round", this.rounds.length);
            let round = new Round(this.rounds.length);
            let previousRound = this.rounds[this.rounds.length - 1];

            for (const candidate in this.elected) {
                round.add_candidate(find_candidate_by_id(candidate), CandidateState.ELECTED);
            }
            for (const candidate in this.running) {
                round.add_candidate(find_candidate_by_id(candidate), CandidateState.RUNNING);
                for (const ballot of previousRound.candidate_ballot(candidate)) {
                    round.add_ballot(ballot[0], ballot[1]);
                }
            }
            for (const candidate in this.transferring) {
                round.add_candidate(find_candidate_by_id(candidate), CandidateState.TRANSFERRING);
            }
            for (const candidate in this.transfered) {
                round.add_candidate(find_candidate_by_id(candidate), CandidateState.TRANSFERED);
            }

            for (const ballot of previousRound.candidate_ballot(null)) {
                round.add_ballot(ballot[0], ballot[1]);
            }

            this.rounds.push(round);
        }

        const elect_candidate = (candidate, score, currentRound) => {
            console.log("Electing Candidate: ", candidate.candidate_name, " (", score, ")");
            currentRound.set_elected_candidate(candidate);

            this.elected[candidate.candidate_id] = [score, Object.keys(this.elected).length];
            delete this.running[candidate.candidate_id];

            const surplus = score - this.quota();

            let transfer_value = 1;
            if (surplus > 0) {
                transfer_value = surplus / score;
            }

            for (const ballot of currentRound.candidate_ballot(candidate)) {
                this.ballots_to_apply.push([ballot[0], ballot[1] * transfer_value]);
            }
        }

        const transfer_candidate = (candidate, score, currentRound) => {
            console.log("Transferring Candidate ", candidate.candidate_name, " (", score, ")");
            currentRound.set_eliminate_candidate(candidate);

            this.transferring[candidate.candidate_id] = [score, Object.keys(this.elected).length + Object.keys(this.running).length - 1];
            delete this.running[candidate.candidate_id];

            for (const ballot of currentRound.candidate_ballot(candidate))
                this.ballots_to_apply.push(ballot)
        }

        const complete_round = (currentRound) => {
            console.log("Completed Round", currentRound.round_number);
            currentRound.complete();

            if (currentRound.active_candidates.length === 0) {
                console.log("Race Complete");
                for (const candidate in this.transferring) {
                    this.transfered[candidate] = this.transferring[candidate];
                    delete this.transferring[candidate]
                }
                this.state = RaceState.COMPLETE;
            }
        }

        if (this.state === RaceState.COMPLETE)
            return;
        this.state = RaceState.TABULATING;

        if (this.rounds.length === 0) {
            begin_race();
            return;
        }

        let currentRound = this.rounds[this.rounds.length - 1];
        if (currentRound.state === RoundState.COMPLETE) {
            add_round();
            return;
        }

        if (this.ballots_to_apply.length > 0) {
            let ballot = this.ballots_to_apply.shift();
            currentRound.add_ballot(ballot[0], ballot[1]);

            if (this.rounds.length === 1) {
                for (let i = 0; i < ballot[0].candidates.length; i++) {
                    const candidate = ballot[0].candidates[i];
                    if (this.candidate_ballot_rankings[candidate] === undefined)
                        this.candidate_ballot_rankings[candidate] = [];
                    while (this.candidate_ballot_rankings[candidate].length < i + 1)
                        this.candidate_ballot_rankings[candidate].push(0);
                    this.candidate_ballot_rankings[candidate][i] += 1
                }

                let first_round_score = {};
                if (this.first_scores.length !== 0) {
                    first_round_score = { ...this.first_scores[this.first_scores.length - 1] };
                }
                if (ballot[0].candidates[0].candidate_id in first_round_score)
                    first_round_score[ballot[0].candidates[0].candidate_id] += 1;
                else
                    first_round_score[ballot[0].candidates[0].candidate_id] = 1;
                this.first_scores.push(first_round_score);
            }

            let activeCandidates = currentRound.active_candidates.sort((x, y) => {
                if (currentRound.candidate_score(x) > currentRound.candidate_score(y)) {
                    return -1;
                } else if (currentRound.candidate_score(y) > currentRound.candidate_score(x)) {
                    return 1;
                }
                return 0;
            });

            for (let i = 0; i < activeCandidates.length; i++) {
                this.running[activeCandidates[i].candidate_id] = [currentRound.candidate_score(activeCandidates[i]), Object.keys(this.elected).length + i];
            }

            return;
        }

        for (const candidate in this.transferring) {
            this.transfered[candidate] = this.transferring[candidate];
            delete this.transferring[candidate]
        }

        let activeCandidates = currentRound.active_candidates.sort((x, y) => {
            if (currentRound.candidate_score(x) > currentRound.candidate_score(y)) {
                return -1;
            } else if (currentRound.candidate_score(y) > currentRound.candidate_score(x)) {
                return 1;
            }
            return 0;
        });

        let roundElected = [];
        let maxElected = this.seats - Object.keys(this.elected).length;

        if (activeCandidates.length <= maxElected) {
            for (const candidate of activeCandidates) {
                roundElected.push(candidate);
            }
        } else {
            for (const candidate of activeCandidates) {
                if (currentRound.candidate_score(candidate) >= this.quota()) {
                    roundElected.push(candidate)
                }
            }
        }

        for (const candidate of roundElected) {
            elect_candidate(candidate, currentRound.candidate_score(candidate), currentRound);
        }

        if (roundElected.length > 0) {
            complete_round(currentRound);
            return;
        }

        let roundTransfer = [];
        if (Object.keys(this.elected).length === this.seats) {
            for (const candidate of activeCandidates.reverse()) {
                roundTransfer.push(candidate);
            }
        } else {
            roundTransfer.push(activeCandidates[activeCandidates.length - 1]);
        }

        for (const candidate of roundTransfer) {
            transfer_candidate(candidate, currentRound.candidate_score(candidate), currentRound);
        }

        complete_round(currentRound);
    }
};

export const RaceState = {
    ADDING: "ADDING",
    TABULATING: "TABULATING",
    COMPLETE: "COMPLETE"
};