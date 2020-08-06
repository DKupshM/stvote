import json
import csv
import uuid


def parse_file(year):
    # pylint: disable=import-outside-toplevel
    ''' Pareses UCB File'''

    parser = UCBParser()

    configuration = parser.parse_configuration(
        "../uc_berkeley/" + year + "/Configuration.json")

    parser.convert_candidate_text_to_json(
        "../uc_berkeley/" + year + "/candidates2018.txt",
        "../uc_berkeley/" + year + "/Candidates.json")

    candidates_data = parser.parse_candidates(
        "../uc_berkeley/" + year + "/Candidates.json", configuration)

    parser.convert_ballot_csv_to_json(
        "../uc_berkeley/" + year + "/2018_Election_Results.csv",
        "../uc_berkeley/" + year + "/Ballots.json", configuration,
        candidates_data)


class UCBParser():
    ''' Parse Ballots Files'''

    def parse_configuration(self, configuration_file_path):
        # pylint: disable=no-self-use
        ''' Parse Candidate'''
        races = []

        with open(configuration_file_path,
                  encoding="UTF-8", errors="ignore") as configuration_file:
            configuration_file_data = json.loads(
                configuration_file.read())
            for race in configuration_file_data["races"]:
                races.append({
                    "id": race["race_id"],
                    "name": race["race_position"],
                    "seats": int(race["race_max_winners"])})
        return races

    def parse_candidates(self, candidate_file_path, races):
        # pylint: disable=no-self-use
        ''' Parse Candidate'''
        candidates_data = {}

        # Open the ballot file.
        with open(candidate_file_path,
                  encoding="UTF-8", errors="ignore") as candidate_file:
            candidate_file_data = json.loads(candidate_file.read())

            for race in races:
                race_candidates_data = []
                for race_data_candidate in candidate_file_data[race["name"]]:
                    race_candidates_data.append({
                        "candidate_id": race_data_candidate["number"],
                        "candidate_name": race_data_candidate["name"],
                        "candidate_party": race_data_candidate["party"]
                    })
                candidates_data[race["id"]] = race_candidates_data
        return candidates_data

    def parse_ballots(self, ballot_file_path, races):
        # pylint: disable=no-self-use
        ''' Ballot Paser'''
        print("Parsing:", ballot_file_path)
        ballots_data = []

        # Open the ballot file.
        with open(ballot_file_path, encoding="UTF-8",
                  errors="ignore") as ballot_file:
            ballot_file_data = json.loads(ballot_file.read())
            i = 0
            for ballot in ballot_file_data["ballots"]:
                ballot_data = {}
                ballot_data["ballot_id"] = str(uuid.uuid4())
                ballot_data = {}
                for race in races:
                    if str(race["id"]) in ballot:
                        ballot_data[race["id"]] = ballot[str(
                            race["id"])]
                ballots_data.append(ballot_data)
                i += 1
        return ballots_data

    def convert_candidate_text_to_json(self, candidate_file, new_file_path):
        # pylint: disable=no-self-use
        ''' Converts A Candidate Text File to JSON format. Easier to Parse'''

        def find_position_value(position):
            # pylint: disable=too-many-return-statements
            ''' docstring '''
            if "Executive Vice President" in position or "EVP" in position:
                return "Executive Vice President"
            if "External Affairs Vice President" in position or \
                    "EAVP" in position:
                return "External Affairs Vice President"
            if "Academic Affairs Vice President" in position or \
                    "AAVP" in position:
                return "Academic Affairs Vice President"
            if "President" in position:
                return "President"
            if "Student Advocate" in position:
                return "Student Advocate"
            if "Senate" in position:
                return "Senator"
            if "Transfer Student Representative" in position:
                return "Transfer Student Representative"
            return 0

        data = open(candidate_file)
        line = data.readline()
        number = 1
        old_position = None

        candidates = {}
        while not line == '':
            position = find_position_value(line.split(':')[0])
            if position == 0:
                name = line.split('|', 1)[0][:-1]
                name = name.lstrip()
                name = name.rstrip()
                party = line.split('|', 2)[1][0:-1]
                party = party.lstrip()
                party = party.rstrip()

                candidate_dict = {}
                candidate_dict['name'] = name
                candidate_dict['number'] = str(number)
                candidate_dict['party'] = party

                if old_position in candidates:
                    candidates[old_position].append(candidate_dict)
                else:
                    candidates[old_position] = [candidate_dict]

                number += 1
            else:
                old_position = position
            line = data.readline()

        with open(new_file_path, 'w') as outfile:
            json_string = json.dumps(
                candidates, default=lambda o: o.__dict__, sort_keys=True,
                indent=4)
            outfile.write(json_string)

    def convert_ballot_csv_to_json(self, path_to_csv,
                                   json_file_name, races, candidates):
        # pylint: disable=no-self-use
        # pylint: disable=too-many-locals
        ''' Docstring'''
        def find_position_value(position):
            for race in races:
                if race["name"] in position:
                    return race["id"]
            return -1

        def find_position_string_value(position):
            # pylint: disable=too-many-return-statements
            ''' docstring '''
            if "Executive Vice President" in position:
                return "Executive Vice President"
            if "External Affairs Vice President" in position or \
                    "EAVP" in position:
                return "External Affairs Vice President"
            if "Academic Affairs Vice President" in position or \
                    "AAVP" in position:
                return "Academic Affairs Vice President"
            if "President" in position:
                return "President"
            if "Student Advocate" in position:
                return "Student Advocate"
            if "Senate" in position:
                return "Senator"
            if "Transfer Student Representative" in position:
                return "Transfer Student Representative"
            return -1

        def find_old_candidate_number(candidate_name):
            for race_data in candidates:
                race_candidates = candidates[race_data]
                for candidate in race_candidates:
                    if candidate['candidate_name'] in candidate_name:
                        return candidate['candidate_id']
            return -1

        def find_candidate_number(candidate_name, position_name):
            for candidate in candidates[position_name]:
                if candidate['candidate_name'] in candidate_name:
                    return candidate['candidate_id']
            return -1

        ballots = []
        with open(path_to_csv) as csv_data:
            data = csv.reader(csv_data, delimiter=',')
            header = 0

            for rownum, row in enumerate(data):
                votes = {}

                for race in races:
                    votes[race["id"]] = []

                # Skip through two empty rows on top and save header row.
                if rownum < 2:
                    continue
                if rownum == 2:
                    header = row
                    continue
                for colnum, col in enumerate(row):
                    # print '%-8s: %s' % (header[colnum], col)
                    # Look for the position asked in the question
                    position_name = find_position_string_value(header[colnum])
                    if position_name == -1:
                        continue
                    position = find_position_value(position_name)
                    # Find the candidates number based on the answer
                    # Returns None if candidate not found
                    value = col.split('|', 1)[0][:-1]
                    number = find_candidate_number(
                        value, position)

                    if number == -1:
                        continue
                    votes[position].append(number)
                    colnum += 1
                ballots.append(votes)

        ballot_csv = {"ballots": ballots}
        with open(json_file_name, 'w') as outfile:
            json_string = json.dumps(
                ballot_csv, default=lambda o: o.__dict__, sort_keys=True,
                indent=4)
            outfile.write(json_string)


if __name__ == "__main__":
    parse_file('2018')
