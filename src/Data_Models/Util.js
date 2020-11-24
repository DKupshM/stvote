export const find_race_by_name = (races, name) => {
    for (let i = 0; i < races.length; i++) {
        if (races[i].race_name === name)
            return races[i];
    }
    return null;
};

export const find_race_by_id = (races, id) => {
    for (let i = 0; i < races.length; i++) {
        if (String(races[i].race_id) === id)
            return races[i];
    }
    return null;
};

export const find_candidate_by_id = (candidates, candidate_id) => {
    for (let i = 0; i < candidates.length; i++)
        if (String(candidates[i].candidate_id) === candidate_id)
            return candidates[i];
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