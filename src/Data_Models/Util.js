/*
    Input: List of Races, A Race Name to find
    Output: A Race, based upon the Race Name (first occurance)
*/
export const find_race_by_name = (races, name) => {
    for (let i = 0; i < races.length; i++) {
        if (races[i].race_name === name)
            return races[i];
    }
    return null;
};

/*
    Input: List of Races, A Race ID to find
    Output: A Race, based upon the Race Id (first occurance)
*/
export const find_race_by_id = (races, race_id) => {
    for (let i = 0; i < races.length; i++) {
        if (String(races[i].race_id) === race_id)
            return races[i];
    }
    return null;
};

/*
    Input: List of Candidates, A candidate ID to find
    Output: A Candidate, based upon the candidate_id (first occurance)
*/
export const find_candidate_by_id = (candidates, candidate_id) => {
    for (const candidate of candidates)
        if (String(candidate.candidate_id) === candidate_id)
            return candidate;
    return null;
};

/*
    Input: List of Candidates, A candidate Name to find
    Output: A Candidate, based upon the candidate name (first occurance)
*/
export const find_candidate_by_name = (candidates, candidate_name) => {
    for (let i = 0; i < candidates.length; i++)
        if (String(candidates[i].candidate_name) === candidate_name)
            return candidates[i];
    return null;
};

/*
    Input: List of Parties, A party name to find
    Output: A party, based upon the party name (first occurance)
*/
export const find_party_by_name = (parties, party_name) => {
    for (const party of parties)
        if (String(party.party_name) === party_name)
            return party;
    return null
};

/*
    Input: List of Parties, A party name to find
    Output: A party, based upon the party name (first occurance)
*/
export const find_party_by_id = (parties, party_id) => {
    for (const party of parties)
        if (String(party.party_id) === party_id)
            return party;
    return null
};

/*
    Input: List of Races, Find Races that include candidate name
    Output: List of Races that include the candidate name
*/
export const find_races_by_candidate_name = (races, candidate_name) => {
    let candidate_races = []
    for (const race of races) {
        let candidate = find_candidate_by_name(race.candidates, candidate_name)
        if (candidate != null) {
            candidate_races.push(race);
        }
    }
    return candidate_races;
};

/*
    Input: List of Races, Find Races that include candidate name
    Output: List of Races that include the candidate name
*/
export const find_races_by_candidate_id = (races, candidate_id) => {
    let candidate_races = []
    for (const race of races) {
        let candidate = find_candidate_by_id(race.candidates, candidate_id)
        if (candidate != null) {
            candidate_races.push(race);
        }
    }
    return candidate_races;
};

/*
    Input: Color, Percent of that Color
    Output: Returns a color shade
*/
export const shadeColor = (color, percent) => {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}