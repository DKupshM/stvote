import json
import csv


class WriteInInvalid:
    pass


class CandidateDroppedOut:
    pass


def parse_file(year):
    # pylint: disable=import-outside-toplevel
    ''' Pareses UCB File'''

    parser = UCSBParser()

    races = parser.parse_configuration(
        "election_data/uc_santa_barbara/" + year + "/src_data/configuration.json",
        "election_data/uc_santa_barbara/" + year + "/Configuration.json")
    candidates = parser.parse_candidates(
        "election_data/uc_santa_barbara/" + year + "/src_data/" + year + "-Results.csv",
        "election_data/uc_santa_barbara/" + year + "/Candidates.json", races)

    parser.parse_ballots(
        "election_data/uc_santa_barbara/" + year + "/src_data/" + year + "-Results.csv",
        "election_data/uc_santa_barbara/" + year + "/Ballots.json", candidates,
        races)


class UCSBParser():
    def parse_configuration(self, configuration_file_path, new_file_path):
        races = []

        with open(configuration_file_path,
                  encoding="UTF-8", errors="ignore") as configuration_file:
            configuration_file_data = json.loads(
                configuration_file.read())
            for race in configuration_file_data["races"]:
                races.append({
                    "id": race["race_id"],
                    "name": race["race_position"],
                    "seats": int(race["race_max_winners"]),
                    "race_extended_data": race["race_extended_data"]})
        new_races = []
        for race in races:
            new_races.append({
                "race_id": race["id"],
                "race_position": race["name"],
                "race_max_winners": int(race["seats"]),
            })

        with open(new_file_path, 'w') as outfile:
            json_string = json.dumps(
                {"races": new_races}, default=lambda o: o.__dict__, sort_keys=True,
                indent=4)
            outfile.write(json_string)
        return races

    def parse_candidates(self, candidate_file_path, new_file_path, races):
        def find_race_by_id(race_id):
            for race in races:
                if race['id'] == race_id:
                    return race
            return None

        def find_race_by_column(column_name):
            if column_name == "A.S. President":
                return 'race_president'
            if column_name == "A.S. Internal VP":
                return 'race_ivp'
            if column_name == "A.S. External VP - Local":
                return 'race_evpla'
            if column_name == "A.S. External VP - Statewide":
                return 'race_evpsa'
            if column_name == "A.S. Student Advocate General":
                return 'race_sa'
            if column_name == "Collegiate Senator - Letters":
                return 'race_csls'
            if column_name == "Collegiate Senator - CCS":
                return 'race_cscs'
            if column_name == "Collegiate Senator - Engineering":
                return 'race_cse'
            if column_name == "A.S. Off Campus Senator":
                return 'race_offcs'
            if column_name == "A.S. On-Campus Senator":
                return 'race_oncs'
            if column_name == "A.S. University Owned Off Campus":
                return 'race_ocuos'
            if column_name == "A.S. Transfer Senator":
                return 'race_trans'
            return None
        candidates_data = {}

        # Open the ballot file.
        with open(candidate_file_path, encoding="UTF-8", errors="ignore") as candidate_file:
            candidate_file_csv = csv.reader(candidate_file)
            candidate_file_data = list(candidate_file_csv)
            race_columns = {}

            parser_groups = {}
            for race in races:
                parser_groups[str(race['race_extended_data']
                                  ["parser_group"])] = race
                race_columns[race['id']] = []

            for column_index in range(len(candidate_file_data[0])):
                if find_race_by_column(
                        candidate_file_data[0][column_index]) is not None:
                    race_columns[find_race_by_column(
                        candidate_file_data[0][column_index])].append(column_index)
                else:
                    print(candidate_file_data[0][column_index])

            for race in races:
                candidates = []
                if "parser_writein_whitelist" in race['race_extended_data']:
                    write_in_whitelist = race['race_extended_data'][
                        "parser_writein_whitelist"]
                    for candidate in write_in_whitelist:
                        candidates.append({
                            "candidate_id": candidate,
                            "candidate_name": candidate,
                            "candidate_party": "Independent"
                        })

                for column_index in race_columns[race['id']]:
                    if candidate_file_data[1][column_index].startswith("Write-In"):
                        continue
                    (candidate_name, candidate_party) = candidate_file_data[1][column_index].rsplit(
                        "-", 1)
                    candidates.append({
                        "candidate_id": candidate_file_data[1][column_index],
                        "candidate_name": candidate_name.strip(),
                        "candidate_party": candidate_party.strip()
                    })

                candidates_data[race['id']] = candidates

        new_candidates_data = {}
        for race_id in candidates_data:
            candidates = []
            for candidate in candidates_data[race_id]:
                candidates.append({
                    "number": candidate["candidate_id"],
                    "name": candidate["candidate_name"],
                    "party": candidate["candidate_party"]
                })
            new_candidates_data[find_race_by_id(race_id)['name']] = candidates
        with open(new_file_path, 'w') as outfile:
            json_string = json.dumps(
                new_candidates_data, default=lambda o: o.__dict__, sort_keys=True,
                indent=4)
            outfile.write(json_string)
        return candidates_data

    def parse_ballots(self, ballot_file_path, new_file_path, candidates, races):
        def find_race_by_column(column_name):
            if column_name == "A.S. President":
                return 'race_president'
            if column_name == "A.S. Internal VP":
                return 'race_ivp'
            if column_name == "A.S. External VP - Local":
                return 'race_evpla'
            if column_name == "A.S. External VP - Statewide":
                return 'race_evpsa'
            if column_name == "A.S. Student Advocate General":
                return 'race_sa'
            if column_name == "Collegiate Senator - Letters":
                return 'race_csls'
            if column_name == "Collegiate Senator - CCS":
                return 'race_cscs'
            if column_name == "Collegiate Senator - Engineering":
                return 'race_cse'
            if column_name == "A.S. Off Campus Senator":
                return 'race_offcs'
            if column_name == "A.S. On-Campus Senator":
                return 'race_oncs'
            if column_name == "A.S. University Owned Off Campus":
                return 'race_ocuos'
            if column_name == "A.S. Transfer Senator":
                return 'race_trans'
            return None

        def get_candidate(candidate_to_find, race):
            for candidate in candidates[race]:
                if candidate_to_find in candidate["candidate_id"]:
                    return candidate
            return None

        def valid_write_in(candidate_id, writein_candidates):
            for candidate in writein_candidates:
                if candidate in candidate_id:
                    return True
            return False

        ballots_data = []
        invalid_writein = WriteInInvalid()
        candidate_dropped_out = CandidateDroppedOut()

        # Open the ballot file.
        with open(ballot_file_path, encoding="UTF-8", errors="ignore") as ballot_file:
            ballot_file_csv = csv.reader(ballot_file)
            ballot_file_data = list(ballot_file_csv)
            ballot_columns = {}

            parser_groups = {}
            for race in races:
                parser_groups[race['race_extended_data']
                              ["parser_group"]] = race
                ballot_columns[race['id']] = []

            for column_index in range(len(ballot_file_data[0])):
                if find_race_by_column(ballot_file_data[0][column_index]) is not None:
                    ballot_columns[find_race_by_column(
                        ballot_file_data[0][column_index])].append(column_index)
                else:
                    print(ballot_file_data[0][column_index])

            for row in range(2, len(ballot_file_data)):
                # Process each individual voter.
                ballot_data = {}

                # Loop through each race and get preferences.
                ballot_race_data = {}
                for race in races:
                    # Get list of candidates that have dropped out after ballots have been cast.
                    candidates_dropped_out = []
                    if "parser_candidates_droppedout" in race['race_extended_data']:
                        candidates_dropped_out = race['race_extended_data'][
                            "parser_candidates_droppedout"]

                    # Note: The size of the race_preferences array must be calculated as:
                    # 1 + number_of_candidates + number_of_write_in_spots
                    #
                    # This is because the race_preferences array is zero indexed, the
                    # zeroth element is popped off the list prior to submitting the ballot
                    # and the number_of_write_in_spots is necessary to account for their
                    # indices even though there many not be any valid write-ins.

                    # By default, races do not have write ins.
                    write_in_count = 0
                    if "parser_writein_fields" in race['race_extended_data']:
                        write_in_count = race['race_extended_data'][
                            "parser_writein_fields"]
                    race_preferences = [
                        None] * (1 + len(candidates[race["id"]]) + write_in_count)
                    for column in ballot_columns[race['id']]:
                        try:
                            if ballot_file_data[1][column].strip() == "Write-In":
                                race_order = int(ballot_file_data[row][column])
                                candidate_id = ballot_file_data[row][column + 1].strip()
                                candidate = get_candidate(
                                    candidate_id, race['id'])
                                if candidate and valid_write_in(candidate['candidate_id'], race['race_extended_data'][
                                        "parser_writein_whitelist"]):
                                    race_preferences[race_order] = candidate['candidate_id']
                                else:
                                    race_preferences[race_order] = invalid_writein
                            else:
                                race_order = int(ballot_file_data[row][column])
                                candidate_id = ballot_file_data[1][column].strip(
                                )
                                if candidate_id not in candidates_dropped_out:
                                    race_preferences[race_order] = get_candidate(
                                        ballot_file_data[1][column].strip(), race['id'])['candidate_id']
                                else:
                                    race_preferences[race_order] = candidate_dropped_out
                        except ValueError:
                            pass
                    # Remove zeroth index (None) since candidates are ordered from 1 to N.
                    race_preferences.pop(0)

                    # Filter write-ins that are invalid.
                    race_preferences = list(
                        filter(lambda element: element is not invalid_writein, race_preferences))
                    # Filter candidates that have dropped out.
                    race_preferences = list(
                        filter(lambda element: element is not candidate_dropped_out, race_preferences))

                    try:
                        preference_max = race_preferences.index(None)
                        race_preferences = race_preferences[0: preference_max]
                    except ValueError:
                        pass
                    ballot_race_data[race["id"]] = race_preferences

                ballot_data["ballot_id"] = ballot_file_data[row][0]
                ballot_data["ballot_data"] = ballot_race_data
                ballots_data.append(ballot_race_data)

        print(len(ballots_data))

        with open(new_file_path, 'w') as outfile:
            json_string = json.dumps(
                {"ballots": ballots_data}, default=lambda o: o.__dict__, sort_keys=True,
                indent=4)
            outfile.write(json_string)

        return ballots_data


if __name__ == "__main__":
    for i in range(2016, 2021):
        print("Parsing", i)
        parse_file(str(i))
