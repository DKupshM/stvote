
export class Voter {
    constructor(voter_id) {
        this.voter_id = voter_id;

        // Format
        // {id: Ballot}
        this.races = {};
    }

    participating_races = () => {
        return Object.keys(this.races);
    }

    participating_in_race = (race_id) => {
        return race_id in this.races;
    }

    get_ballot_for_race = (race_id) => {
        if (race_id in this.races) {
            if (this.races[race_id].length === 1)
                return this.races[race_id][0]
            return this.races[race_id];
        }
        return null;
    }

    add_ballot = (race_id, ballot) => {
        if (ballot.candidates.length > 0) {
            if (race_id in this.races) {
                this.races[race_id] = [...this.races[race_id], ballot]
            } else {
                this.races[race_id] = [ballot];
            }
        }
    }
}