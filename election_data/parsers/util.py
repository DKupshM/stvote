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


def rename_uuid_year(year):
    print("Editing " + year)
    rename_race_id(
        "election_data/uc_davis/" + year + "/Configuration.json",
        "election_data/uc_davis/" + year + "/Ballots.json")
    rename_candidate_id("election_data/uc_davis/" + year + "/Candidates.json",
                        "election_data/uc_davis/" + year + "/Ballots.json")


if __name__ == "__main__":
    for i in range(2005, 2021):
        rename_uuid_year(str(i) + "Winter")
