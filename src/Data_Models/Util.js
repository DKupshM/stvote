/*
    Input: List of Races, A Race Name to find
    Output: A Race, based upon the Race Name
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
    Output: A Race, based upon the Race Id
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
    Output: A Candidate, based upon the candidate_id
*/
export const find_candidate_by_id = (candidates, candidate_id) => {
    for (const candidate of candidates)
        if (String(candidate.candidate_id) === candidate_id)
            return candidate;
    return null;
};

export const find_candidate_by_name = (candidates, candidate_name) => {
    for (let i = 0; i < candidates.length; i++)
        if (String(candidates[i].candidate_name) === candidate_name)
            return candidates[i];
    return null;
};

export const find_party_by_name = (parties, name) => {
    for (let i = 0; i < parties.length; i++)
        if (parties[i].party_name === name)
            return parties[i];
    return null
};