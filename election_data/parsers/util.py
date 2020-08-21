import json
import uuid
from os import path


def rename_candidate_id(candidate_file_path, ballot_file_path):
    if not path.exists(candidate_file_path) or not path.exists(ballot_file_path):
        print(candidate_file_path + " Does not Exist")
        return
    old_ids = {}

    new_candidate_file = {}
    new_ballot_file = {}

    with open(candidate_file_path,
              encoding="UTF-8", errors="ignore") as candidate_file:
        candidate_file_data = json.loads(candidate_file.read())
        for race in candidate_file_data:
            race_candidates = []
            candidates = candidate_file_data[race]
            for candidate in candidates:
                new_id = str(uuid.uuid4())
                old_ids[str(candidate["number"])] = new_id
                race_candidates.append(
                    {"name": candidate["name"], "number": new_id, "party": candidate["party"]})
            new_candidate_file[race] = race_candidates

    with open(ballot_file_path,
              encoding="UTF-8", errors="ignore") as ballot_file:
        ballot_file_data = json.loads(ballot_file.read())

        new_ballots = []
        for ballot in ballot_file_data["ballots"]:
            new_ballot = {}
            for race in ballot:
                new_candidates = []
                candidates = ballot[race]
                for candidate in candidates:
                    new_candidates.append(old_ids[candidate])
                new_ballot[race] = new_candidates
            new_ballots.append(new_ballot)
        new_ballot_file = {"ballots": new_ballots}

    with open(candidate_file_path, 'w') as outfile:
        json_string = json.dumps(
            new_candidate_file, default=lambda o: o.__dict__, sort_keys=True,
            indent=4)
        outfile.write(json_string)

    with open(ballot_file_path, 'w') as outfile:
        json_string = json.dumps(
            new_ballot_file, default=lambda o: o.__dict__, sort_keys=True,
            indent=4)
        outfile.write(json_string)


def rename_race_id(configuration_file_path, ballot_file_path):
    if not path.exists(configuration_file_path) or not path.exists(ballot_file_path):
        print(configuration_file_path + " Does not Exist")
        return
    old_ids = {}

    new_configuration_file = {}
    new_ballot_file = {}

    with open(configuration_file_path,
              encoding="UTF-8", errors="ignore") as configuration_file:
        configuration_file_data = json.loads(configuration_file.read())
        races = []
        for race in configuration_file_data["races"]:
            new_id = str(uuid.uuid4())
            old_ids[str(race["race_id"])] = new_id
            races.append(
                {"race_id": new_id, "race_position": race["race_position"],
                 "race_max_winners": race["race_max_winners"]})
        new_configuration_file["races"] = races

    with open(ballot_file_path,
              encoding="UTF-8", errors="ignore") as ballot_file:
        ballot_file_data = json.loads(ballot_file.read())

        new_ballots = []
        for ballot in ballot_file_data["ballots"]:
            new_ballot = {}
            for race in ballot:
                new_ballot[str(old_ids[race])] = ballot[race]
            new_ballots.append(new_ballot)
        new_ballot_file = {"ballots": new_ballots}

    with open(configuration_file_path, 'w') as outfile:
        json_string = json.dumps(
            new_configuration_file, default=lambda o: o.__dict__, sort_keys=True,
            indent=4)
        outfile.write(json_string)

    with open(ballot_file_path, 'w') as outfile:
        json_string = json.dumps(
            new_ballot_file, default=lambda o: o.__dict__, sort_keys=True,
            indent=4)
        outfile.write(json_string)


def rename_race_name(configuration_file_path, candidate_file_path, new_name_modiefier):
    if not path.exists(configuration_file_path) or not path.exists(candidate_file_path):
        print(configuration_file_path + " Does not Exist")
        return
    old_names = {}

    new_configuration_file = {}
    new_candidate_file = {}

    with open(configuration_file_path,
              encoding="UTF-8", errors="ignore") as configuration_file:
        configuration_file_data = json.loads(configuration_file.read())
        races = []
        for race in configuration_file_data["races"]:
            new_name = str(race["race_position"]) + new_name_modiefier
            old_names[str(race["race_position"])] = new_name
            races.append(
                {"race_id": race["race_id"], "race_position": new_name,
                 "race_max_winners": race["race_max_winners"]})
        new_configuration_file["races"] = races

    with open(candidate_file_path,
              encoding="UTF-8", errors="ignore") as candidate_file:
        candidate_file_data = json.loads(candidate_file.read())
        for race in candidate_file_data:
            new_candidate_file[old_names[race]] = candidate_file_data[race]

    with open(configuration_file_path, 'w') as outfile:
        json_string = json.dumps(
            new_configuration_file, default=lambda o: o.__dict__, sort_keys=True,
            indent=4)
        outfile.write(json_string)

    with open(candidate_file_path, 'w') as outfile:
        json_string = json.dumps(
            new_candidate_file, default=lambda o: o.__dict__, sort_keys=True,
            indent=4)
        outfile.write(json_string)


def combine_configurations(config_path_one, config_path_two, new_config_path):
    new_configuration_file = {"races": []}

    with open(config_path_one,
              encoding="UTF-8", errors="ignore") as configuration_file:
        configuration_file_data = json.loads(configuration_file.read())
        for race in configuration_file_data["races"]:
            new_configuration_file["races"].append(race)

    with open(config_path_two,
              encoding="UTF-8", errors="ignore") as configuration_file:
        configuration_file_data = json.loads(configuration_file.read())
        for race in configuration_file_data["races"]:
            new_configuration_file["races"].append(race)

    with open(new_config_path, 'w') as outfile:
        json_string = json.dumps(
            new_configuration_file, default=lambda o: o.__dict__, sort_keys=True,
            indent=4)
        outfile.write(json_string)


def combine_candidates(candidates_path_one, candidates_path_two, new_candidates_path):
    new_candidates_file = {}

    with open(candidates_path_one,
              encoding="UTF-8", errors="ignore") as candidates_file:
        candidates_file_data = json.loads(candidates_file.read())
        for race in candidates_file_data:
            new_candidates_file[race] = candidates_file_data[race]

    with open(candidates_path_two,
              encoding="UTF-8", errors="ignore") as candidates_file:
        candidates_file_data = json.loads(candidates_file.read())
        for race in candidates_file_data:
            new_candidates_file[race] = candidates_file_data[race]

    with open(new_candidates_path, 'w') as outfile:
        json_string = json.dumps(
            new_candidates_file, default=lambda o: o.__dict__, sort_keys=True,
            indent=4)
        outfile.write(json_string)


def combine_ballots(ballots_path_one, ballots_path_two, new_ballots_path):
    new_ballots_file = {"ballots": []}

    with open(ballots_path_one,
              encoding="UTF-8", errors="ignore") as ballot_file:
        ballot_file_data = json.loads(ballot_file.read())
        for ballot in ballot_file_data["ballots"]:
            new_ballots_file["ballots"].append(ballot)

    with open(ballots_path_two,
              encoding="UTF-8", errors="ignore") as ballot_file:
        ballot_file_data = json.loads(ballot_file.read())
        for ballot in ballot_file_data["ballots"]:
            new_ballots_file["ballots"].append(ballot)

    with open(new_ballots_path, 'w') as outfile:
        json_string = json.dumps(
            new_ballots_file, default=lambda o: o.__dict__, sort_keys=True,
            indent=4)
        outfile.write(json_string)


def combine_race(year_one, year_two, new_year):
    combine_ballots("election_data/uc_davis/" + year_one + "/Ballots.json",
                    "election_data/uc_davis/" + year_two + "/Ballots.json",
                    "election_data/uc_davis/" + new_year + "/Ballots.json")

    combine_candidates("election_data/uc_davis/" + year_one + "/Candidates.json",
                       "election_data/uc_davis/" + year_two + "/Candidates.json",
                       "election_data/uc_davis/" + new_year + "/Candidates.json")

    combine_configurations("election_data/uc_davis/" + year_one + "/Configuration.json",
                           "election_data/uc_davis/" + year_two + "/Configuration.json",
                           "election_data/uc_davis/" + new_year + "/Configuration.json")


def rename_race(year):
    rename_race_name("election_data/uc_davis/" + year + "/Configuration.json",
                     "election_data/uc_davis/" + year + "/Candidates.json", " Fall")


def rename_uuid_year(year):
    print("Editing " + year)
    rename_race_id(
        "election_data/uc_davis/" + year + "/Configuration.json",
        "election_data/uc_davis/" + year + "/Ballots.json")
    rename_candidate_id("election_data/uc_davis/" + year + "/Candidates.json",
                        "election_data/uc_davis/" + year + "/Ballots.json")


if __name__ == "__main__":
    rename_uuid_year("2007")
    '''
    combine_race("2007Fall", "2007WinterSenate", "2007")
    combine_race("2007", "2007WinterPres", "2007")
    '''
