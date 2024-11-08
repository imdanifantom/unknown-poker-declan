import { Player } from "./Player";
import { Hand } from "./pokersolver.js";
export class TexasHoldem {
    constructor(numSimulations) {
        this.numOpponents = 0;
        this.opponents = [];
        this.player = new Player("You", []);
        this.table = [];
        this.deadCards = 0; // the number of unknown dead cards
        // used to check for duplicates
        // prettier-ignore
        this.deck = {
            "As": true, "Ah": true, "Ad": true, "Ac": true,
            "2s": true, "2h": true, "2d": true, "2c": true,
            "3s": true, "3h": true, "3d": true, "3c": true,
            "4s": true, "4h": true, "4d": true, "4c": true,
            "5s": true, "5h": true, "5d": true, "5c": true,
            "6s": true, "6h": true, "6d": true, "6c": true,
            "7s": true, "7h": true, "7d": true, "7c": true,
            "8s": true, "8h": true, "8d": true, "8c": true,
            "9s": true, "9h": true, "9d": true, "9c": true,
            "Ts": true, "Th": true, "Td": true, "Tc": true,
            "Js": true, "Jh": true, "Jd": true, "Jc": true,
            "Qs": true, "Qh": true, "Qd": true, "Qc": true,
            "Ks": true, "Kh": true, "Kd": true, "Kc": true
        };
        this.numSimulations = numSimulations || 10000;
    }
    // couldn't remove the card return false as there is a duplicate
    removeCard(card) {
        if (this.deck[card]) {
            this.deck[card] = false;
            return true;
        }
        return false;
    }
    setPlayer(cards, name) {
        if (cards.length == 1) {
            throw new Error("You must have 2 cards");
        }
        // check for duplicates
        for (let i = 0; i < cards.length; i++) {
            if (!this.removeCard(cards[i])) {
                throw new Error(`You: [${cards}], has a duplicate card: ${cards[i]}`);
            }
        }
        this.player = new Player(name || "You", cards);
    }
    addOpponent(cards, options) {
        if (this.numOpponents >= 9) {
            throw new Error("You can only have 9 opponents");
        }
        let name = options === null || options === void 0 ? void 0 : options.name;
        if (!name) {
            name = "Opponent " + (this.numOpponents + 1);
        }
        if (cards.length > 2) {
            throw new Error(`${name} can only have 2 cards`);
        }
        if (cards.length == 1) {
            throw new Error(`${name} must have 2 cards`);
        }
        // check for duplicates
        for (let i = 0; i < cards.length; i++) {
            if (!this.removeCard(cards[i])) {
                throw new Error(`${name}: [${cards}], has a duplicate card: ${cards[i]}`);
            }
        }
        // if they've folded, they aren't considered an opponent and their cards are dead
        if ((options === null || options === void 0 ? void 0 : options.folded) && cards.length == 0) {
            this.deadCards += 2;
        }
        else {
            const player = new Player(name, cards);
            this.opponents.push(player);
            this.numOpponents++;
        }
    }
    setTable(cards) {
        for (let i = 0; i < cards.length; i++) {
            if (!this.removeCard(cards[i])) {
                throw new Error(`Table: [${cards}], has a duplicate card: ${cards[i]}`);
            }
        }
        this.table = cards;
    }
    calculate() {
        var _a;
        if (this.opponents.length == 0) {
            throw new Error("You have no opponents. Add an opponent with addOpponent()");
        }
        let results = this.runSimulation(this.player.cards, this.table);
        function frequencies(arr) {
            const result = {};
            return arr.reduce((acc, curr) => {
                var _a;
                acc[curr] = ((_a = acc[curr]) !== null && _a !== void 0 ? _a : 0) + 1;
                if (acc[curr] >= 3) {
                    result[curr] = acc[curr];
                }
                return acc;
            }, {});
        }
        let yourHandFrequencies = frequencies(results.yourhandnames);
        for (let [key, value] of Object.entries(yourHandFrequencies)) {
            yourHandFrequencies[key] = (value !== null && value !== void 0 ? value : 0) / this.numSimulations;
        }
        let oppHandFrequencies = frequencies(results.oppshandnames);
        for (let [key, value] of Object.entries(oppHandFrequencies)) {
            // every opponent has an equal chance of having these hands
            oppHandFrequencies[key] =
                (value !== null && value !== void 0 ? value : 0) / this.numSimulations / this.numOpponents;
        }
        let namedOppHandFrequencies = {};
        for (const player of this.opponents) {
            namedOppHandFrequencies[player.name] = frequencies(results.namedOppHandNames[player.name]);
        }
        let namedOppHandChances = {};
        for (const player of this.opponents) {
            namedOppHandChances[player.name] = {};
            for (let [key, value] of Object.entries(namedOppHandFrequencies[player.name])) {
                namedOppHandChances[player.name][key] =
                    (value !== null && value !== void 0 ? value : 0) / this.numSimulations;
            }
        }
        let winnerFrequencies = frequencies(results.winners);
        let winnerChances = {
            [this.player.name]: ((_a = winnerFrequencies[0]) !== null && _a !== void 0 ? _a : 0) / this.numSimulations,
        };
        for (let i = 0; i < this.numOpponents; i++) {
            const value = winnerFrequencies[i + 1];
            winnerChances[this.opponents[i].name] =
                (value !== null && value !== void 0 ? value : 0) / this.numSimulations;
        }
        return {
            winChance: results.won,
            loseChance: results.lost,
            tieChance: results.tied,
            yourHandChances: yourHandFrequencies,
            oppHandChances: oppHandFrequencies,
            namedOppHandChances,
            winnerChances,
        };
    }
    runSimulation(master_yourcards, master_tablecards) {
        // Set up counters
        let num_times_you_won = 0;
        let num_times_you_tied = 0;
        let num_times_you_lost = 0;
        const yourhandnames = [];
        const opponenthandnames = [];
        const all_winners = [];
        // contains every hand every player has ever had in the simulation, categorized by player name
        let namedOppHandNames = {};
        for (let i = 0; i < this.numOpponents; i++) {
            namedOppHandNames[this.opponents[i].name] = [];
        }
        // monte carlo simulation
        for (let simnum = 0; simnum < this.numSimulations; simnum++) {
            let deckDict = Object.assign({}, this.deck);
            // choose random dead cards to kill
            let keys = Object.keys(deckDict);
            for (let i = 0; i < this.deadCards; i++) {
                let randomKey = keys[Math.floor(Math.random() * keys.length)];
                while (!deckDict[randomKey]) {
                    randomKey = keys[Math.floor(Math.random() * keys.length)];
                }
                deckDict[randomKey] = false;
            }
            let deck = [];
            for (let key in deckDict) {
                if (deckDict[key]) {
                    deck.push(key);
                }
            }
            let yourcards = master_yourcards.slice();
            let tablecards = master_tablecards.slice();
            // fill the table
            while (tablecards.length < 5) {
                const randomIndex = Math.floor(Math.random() * deck.length);
                tablecards.push(deck[randomIndex]);
                deck.splice(randomIndex, 1);
            }
            // make copies of the oppponents array and fill in their cards
            let opponents = [];
            for (const opp of this.opponents) {
                const copiedOpp = new Player(opp.name, opp.cards.slice());
                while (copiedOpp.cards.length < 2) {
                    const randomIndex = Math.floor(Math.random() * deck.length);
                    copiedOpp.cards.push(deck[randomIndex]);
                    deck.splice(randomIndex, 1);
                }
                opponents.push(copiedOpp);
            }
            // console.log("Your cards: " + yourcards);
            // console.log("Table's cards: " + tablecards);
            // console.log("Opponents' cards: " + opponentscards);
            let hands = [];
            let yourhand = Hand.solve(yourcards.concat(tablecards));
            yourhand.id = 0;
            hands.push(yourhand);
            yourhandnames.push(yourhand.name);
            // create the opponent's hands
            for (let i = 0; i < opponents.length; i++) {
                let opphand = Hand.solve(opponents[i].cards.concat(tablecards));
                opphand.id = i + 1;
                hands.push(opphand);
                opponenthandnames.push(opphand.name);
                // add their hand to the list of hands they've had
                namedOppHandNames[opponents[i].name].push(opphand.name);
            }
            let winners = Hand.winners(hands).map((hand) => hand.id);
            if (winners.length === 1) {
                // only one winner
                let winner = winners[0];
                all_winners.push(winner);
                if (winner === 0) {
                    // 0 is player
                    num_times_you_won++;
                }
                else {
                    num_times_you_lost++;
                }
            }
            else {
                // ties
                if (winners.includes(0)) {
                    // 0 is player
                    num_times_you_tied++;
                }
                else {
                    num_times_you_lost++;
                }
            }
            // console.log("Winner: " + winners);
        }
        return {
            won: num_times_you_won / this.numSimulations,
            lost: num_times_you_lost / this.numSimulations,
            tied: num_times_you_tied / this.numSimulations,
            yourhandnames: yourhandnames,
            oppshandnames: opponenthandnames,
            namedOppHandNames,
            winners: all_winners,
        };
    }
    // in order to use this, the board must be set first
    solveHand(cards) {
        const board = this.table.slice();
        // check for duplicates
        for (const card of board) {
            if (cards.includes(card)) {
                throw new Error(`SolveHand: The board: [${board}], has a duplicate card: ${card}`);
            }
        }
        board.push(...cards);
        return Hand.solve(board);
    }
}
