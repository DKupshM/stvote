
export class Candidate {
    constructor(candidate_id, candidate_name, candidate_party) {
        this.candidate_id = candidate_id;
        this.candidate_name = candidate_name;
        this.candidate_party = candidate_party;
    }
}

export const CandidateState = {
    ELECTED: "ELECTED",
    RUNNING: "RUNNING",
    TRANSFERRING: "TRANSFERRING",
    TRANSFERED: "TRANSFERED",
    EXCUSED: "EXCUSED",
};