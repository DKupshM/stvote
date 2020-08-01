
export class Party {
    constructor(party_name, party_color) {
        this.party_name = party_name;

        if (!this.isValidColor(party_color)) {
            party_color = "#" + party_color
            if (!this.isValidColor(party_color)) {
                console.log("Error Color Isn't Valid", party_color)
            }
        }
        this.party_color = party_color;
    }

    isValidColor = (color) => {
        var s = new Option().style;
        s.color = color;
        return s.color !== '';
    }
}