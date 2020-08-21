import json


def parse_file(year, position):
    # pylint: disable=import-outside-toplevel
    ''' Pareses UCB File'''

    parser = UCDParser()
    print("Running Parser for UCD " + year)
    race_id = 201
    if position == "Senate":
        race_id = 101

    parser.configuration_txt_to_json(
        "election_data/uc_davis/" + year + "/src_data/" + position + ".txt",
        "election_data/uc_davis/" + year + "/Configuration.json", position, race_id
    )

    print("Finished Configuration")

    parser.ballots_txt_to_json(
        "election_data/uc_davis/" + year + "/src_data/" + position + ".txt",
        "election_data/uc_davis/" + year + "/Ballots.json", race_id
    )

    print("Finished Ballots")

    parser.candidates_txt_to_json(
        "election_data/uc_davis/" + year + "/src_data/" + position + ".txt",
        "election_data/uc_davis/" + year + "/Candidates.json", position
    )

    print("Finished Candidates")


class UCDParser():

    def configuration_txt_to_json(self, config_file, new_file_path, race_name, race_id):
        data = open(config_file)
        line = data.readline().strip()

        configuration = {"race_id": race_id, "race_position": race_name,
                         "race_max_winners": line.split(' ')[1]}

        with open(new_file_path, 'w') as outfile:
            json_string = json.dumps(
                {"races": [configuration]}, default=lambda o: o.__dict__, sort_keys=True,
                indent=4)
            outfile.write(json_string)

    def ballots_txt_to_json(self, ballot_file, new_file_path, race_id):
        data = open(ballot_file)
        line = data.readline().strip()
        line = data.readline().strip()

        ballots = []
        while not line == '0':
            ballot_row = line.split()
            for _ in range(int(ballot_row[0])):
                ballots.append({race_id: ballot_row[1:-1]})
            line = data.readline().strip()

        with open(new_file_path, 'w') as outfile:
            json_string = json.dumps(
                {"ballots": ballots}, default=lambda o: o.__dict__, sort_keys=True,
                indent=4)
            outfile.write(json_string)

    def candidates_txt_to_json(self, candidate_file, new_file_path, race_name):
        ''' Converts A Candidate Text File to JSON format. Easier to Parse'''
        data = open(candidate_file)
        line = data.readline()

        candidates = []
        while not line.strip() == '0':
            line = data.readline()

        line = data.readline()
        number = 1
        while not line == '' and not line.strip().strip('"').startswith('ASUCD'):
            candidate_dict = {}
            candidate_dict['name'] = line.strip().strip('"')
            candidate_dict['number'] = number
            candidate_dict['party'] = "Unknown"

            candidates.append(candidate_dict)
            number += 1
            line = data.readline()

        with open(new_file_path, 'w') as outfile:
            json_string = json.dumps(
                {race_name: candidates}, default=lambda o: o.__dict__, sort_keys=True,
                indent=4)
            outfile.write(json_string)


if __name__ == "__main__":
    parse_file("2007Fall", "Senate")
