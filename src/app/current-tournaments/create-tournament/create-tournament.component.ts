import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormArray, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";

import {
    DeckRetrievalService,
    DeckData,
} from "../../shared/deck-retrieval.service";
import { tournament } from "../../shared/tournament.model";
import { DatabaseService } from "../../shared/database.service";
import { deck } from "../../shared/deck.model";

@Component({
    selector: "app-create-tournament",
    templateUrl: "./create-tournament.component.html",
    styleUrls: ["./create-tournament.component.css"],
})
export class CreateTournamentComponent implements OnInit, OnDestroy {
    currentSub: Subscription;
    finishedSub: Subscription;
    createForm: FormGroup;
    isloading: boolean;
    tournamentNames: string[] = [];
    numPlayers: number = 4;
    missing: string = "0";
    needByes: boolean = false;

    constructor(
        private deckService: DeckRetrievalService,
        private db: DatabaseService
    ) {}

    ngOnInit() {
        this.currentSub = this.db
            .loadCurrentTournaments()
            .subscribe((tourns: tournament[]) => {
                for (let i = 0; i < tourns.length; i++) {
                    this.tournamentNames.push(tourns[i].name);
                }
            });
        this.finishedSub = this.db
            .loadFinishedTournaments()
            .subscribe((tourns: tournament[]) => {
                for (let i = 0; i < tourns.length; i++) {
                    this.tournamentNames.push(tourns[i].name);
                }
            });

        this.createForm = new FormGroup({
            tournamentName: new FormControl(null, [
                Validators.required,
                this.validateTournamentName.bind(this),
            ]),
            tournamentType: new FormControl("swiss"),
            elimType: new FormControl("seeded"),
            chains: new FormControl("no", Validators.required),
            decks: new FormArray(
                [
                    new FormGroup({
                        name: new FormControl(null, [Validators.required]),
                        deck: new FormControl(null, [
                            Validators.required,
                            this.validateDeckUrl,
                        ]),
                    }),
                    new FormGroup({
                        name: new FormControl(null, [Validators.required]),
                        deck: new FormControl(null, [
                            Validators.required,
                            this.validateDeckUrl,
                        ]),
                    }),
                    new FormGroup({
                        name: new FormControl(null, [Validators.required]),
                        deck: new FormControl(null, [
                            Validators.required,
                            this.validateDeckUrl,
                        ]),
                    }),
                    new FormGroup({
                        name: new FormControl(null, [Validators.required]),
                        deck: new FormControl(null, [
                            Validators.required,
                            this.validateDeckUrl,
                        ]),
                    }),
                ],
                this.validateUniquePlayers
            ),
        });
    }

    onAddDeck() {
        const control = new FormGroup({
            name: new FormControl(null, [Validators.required]),
            deck: new FormControl(null, [
                Validators.required,
                this.validateDeckUrl,
            ]),
        });
        (<FormArray>this.createForm.get("decks")).push(control);
        this.numPlayers += 1;
        this.checkNum();
    }

    onDeleteDeck(index: number) {
        (<FormArray>this.createForm.get("decks")).removeAt(index);
        this.numPlayers -= 1;
        this.checkNum();
    }

    //checks if the number of players is a power of 2 for single elimination
    private checkNum() {
        let missing =
            Math.pow(2, Math.ceil(Math.log2(this.numPlayers))) -
            this.numPlayers;
        if (missing > 1) {
            this.needByes = true;
            this.missing = missing + " byes";
        } else if (missing === 1) {
            this.needByes = true;
            this.missing = "1 bye";
        } else {
            this.needByes = false;
            this.missing = "0";
        }
    }

    onSubmit() {
        const formArray = this.createForm.get("decks").value;
        let getArray: { playerName: string; url: string; index: number }[] = [];
        const deckArray: {
            playerName: string;
            deck: deck;
            index: number;
        }[] = [];
        for (let i = 0; i < formArray.length; i++) {
            getArray.push({
                playerName: formArray[i].name,
                url: formArray[i].deck,
                index: i,
            });
        }
        this.isloading = true;
        this.db
            .loadDecks()
            .pipe(take(1))
            .subscribe((deck: deck[]) => {
                for (let i = 0; i < deck.length; i++) {
                    getArray = getArray.filter(element => {
                        if (element.url === deck[i].deckUrl) {
                            deckArray.push({
                                playerName: element.playerName,
                                deck: deck[i],
                                index: element.index,
                            });
                            return false;
                        } else {
                            return true;
                        }
                    });
                }
                this.getDecks(getArray, deckArray);
            });
    }

    //gets any deck not already in database from keyforgegame.com
    private getDecks(
        get: { playerName: string; url: string; index: number }[],
        decks: { playerName: string; deck: deck; index: number }[]
    ) {
        if (get.length > 0) {
            const getArray: string[] = [];
            const nameArray: string[] = [];
            const indexArray: number[] = [];
            for (let i = 0; i < get.length; i++) {
                getArray.push(get[i].url);
                nameArray.push(get[i].playerName);
                indexArray.push(get[i].index);
            }
            this.deckService
                .getTournamentDecks(getArray)
                .subscribe((decksData: DeckData[]) => {
                    for (let i = 0; i < decksData.length; i++) {
                        let newDeck = {
                            deckName: decksData[i].data.name,
                            deckUrl:
                                "https://www.keyforgegame.com/deck-details/" +
                                decksData[i].data.id,
                            wins: 0,
                            losses: 0,
                            byes: 0,
                            chains: 0,
                            expansion: "",
                            house: [
                                {
                                    name: decksData[i]._linked.houses[0].name,
                                    img: decksData[i]._linked.houses[0].image,
                                    cards: {
                                        Action: {
                                            Common: [],
                                            Uncommon: [],
                                            Rare: [],
                                        },
                                        Artifact: {
                                            Common: [],
                                            Uncommon: [],
                                            Rare: [],
                                        },
                                        Creature: {
                                            Common: [],
                                            Uncommon: [],
                                            Rare: [],
                                        },
                                        Upgrade: {
                                            Common: [],
                                            Uncommon: [],
                                            Rare: [],
                                        },
                                    },
                                },
                                {
                                    name: decksData[i]._linked.houses[1].name,
                                    img: decksData[i]._linked.houses[1].image,
                                    cards: {
                                        Action: {
                                            Common: [],
                                            Uncommon: [],
                                            Rare: [],
                                        },
                                        Artifact: {
                                            Common: [],
                                            Uncommon: [],
                                            Rare: [],
                                        },
                                        Creature: {
                                            Common: [],
                                            Uncommon: [],
                                            Rare: [],
                                        },
                                        Upgrade: {
                                            Common: [],
                                            Uncommon: [],
                                            Rare: [],
                                        },
                                    },
                                },
                                {
                                    name: decksData[i]._linked.houses[2].name,
                                    img: decksData[i]._linked.houses[2].image,
                                    cards: {
                                        Action: {
                                            Common: [],
                                            Uncommon: [],
                                            Rare: [],
                                        },
                                        Artifact: {
                                            Common: [],
                                            Uncommon: [],
                                            Rare: [],
                                        },
                                        Creature: {
                                            Common: [],
                                            Uncommon: [],
                                            Rare: [],
                                        },
                                        Upgrade: {
                                            Common: [],
                                            Uncommon: [],
                                            Rare: [],
                                        },
                                    },
                                },
                            ],
                            cards: [],
                        };

                        switch (decksData[i].data.expansion) {
                            case 435:
                                newDeck["expansion"] = "AoA";
                                break;
                            case 341:
                                newDeck["expansion"] = "CotA";
                                break;
                            default:
                                newDeck["expansion"] = "Unknown";
                        }

                        /*
						adds cards to the correct house sorted by card type
						then rarity
						*/
                        for (
                            let j = 0;
                            j < decksData[i]._linked.cards.length;
                            j++
                        ) {
                            let card = decksData[i]._linked.cards[j];
                            let index = 0;
                            if (card.house === newDeck.house[0].name) {
                                index = 0;
                            } else if (
                                decksData[i]._linked.cards[j].house ===
                                newDeck.house[1].name
                            ) {
                                index = 1;
                            } else if (
                                decksData[i]._linked.cards[j].house ===
                                newDeck.house[2].name
                            ) {
                                index = 2;
                            }
                            let number = 0;
                            decksData[i].data._links.cards.forEach(element => {
                                if (element === card.id) {
                                    number += 1;
                                }
                            });
                            for (let k = 0; k < number; k++) {
                                newDeck.house[index].cards[card.card_type][
                                    card.rarity
                                ].push({
                                    name:
                                        decksData[i]._linked.cards[j]
                                            .card_title,
                                    img:
                                        decksData[i]._linked.cards[j]
                                            .front_image,
                                });
                            }
                        }

                        //alphabetizes the cards
                        for (let i = 0; i < 3; i++) {
                            for (let type in newDeck.house[i].cards) {
                                if (
                                    newDeck.house[i].cards.hasOwnProperty(type)
                                ) {
                                    for (let rarity in newDeck.house[i].cards[
                                        type
                                    ]) {
                                        if (
                                            newDeck.house[i].cards[
                                                type
                                            ].hasOwnProperty(rarity)
                                        ) {
                                            newDeck.house[i].cards[type][
                                                rarity
                                            ].sort((a, b) => {
                                                if (a.name > b.name) {
                                                    return 1;
                                                }
                                                return -1;
                                            });
                                        }
                                    }
                                }
                            }
                        }

                        decks.push({
                            playerName: nameArray[i],
                            deck: newDeck,
                            index: indexArray[i],
                        });
                        //saves deck to database
                        this.db.saveNewDeck(newDeck);
                    }
                    this.tournamentDecks(decks);
                });
        } else {
            this.tournamentDecks(decks);
        }
    }

    //sets up decks for tournament, removing data not needed for tournament
    private tournamentDecks(
        decks: { playerName: string; deck: deck; index: number }[]
    ) {
        //sorts decks if order matters for single elimination
        //randomizes otherwise
        if (
            this.createForm.get("tournamentType").value === "singleElim" &&
            this.createForm.get("elimType").value === "seeded"
        ) {
            decks.sort((a, b) => {
                if (a.index > b.index) {
                    return 1;
                } else {
                    return -1;
                }
            });
        } else {
            for (let i = 0; i < decks.length; i++) {
                let rand = Math.floor(Math.random() * decks.length);
                let temp = decks[i];
                decks[i] = decks[rand];
                decks[rand] = temp;
            }
        }

        //changes the decks variable to now be similar to the player that will
        //be added to the tournament
        let tournDecks = [];
        for (let i = 0; i < decks.length; i++) {
            if (this.createForm.get("chains").value === "no") {
                tournDecks.push({
                    player: decks[i].playerName,
                    deckName: decks[i].deck.deckName,
                    deckUrl: decks[i].deck.deckUrl,
                });
            } else {
                tournDecks.push({
                    player: decks[i].playerName,
                    deckName: decks[i].deck.deckName,
                    deckUrl: decks[i].deck.deckUrl,
                    chains: decks[i].deck.chains,
                });
            }
        }

        let maxRounds = 0;
        //Decides the maximum number of rounds
        if (this.createForm.get("tournamentType").value === "roundRobin") {
            if (this.tournamentDecks.length % 2 === 0) {
                maxRounds = tournDecks.length;
            } else {
                maxRounds = tournDecks.length - 1;
            }
        } else {
            maxRounds = Math.ceil(Math.log2(tournDecks.length));
        }

        this.newTournament(
            this.createForm.get("tournamentName").value,
            this.createForm.get("tournamentType").value,
            this.createForm.get("chains").value,
            maxRounds,
            tournDecks
        );
        this.isloading = false;
    }

    private newTournament(
        name: string,
        type: string,
        chainType: string,
        maxRounds: number,
        decks: {
            player: string;
            deckName: string;
            deckUrl: string;
            chains?: number;
        }[]
    ) {
        let newTourn: tournament = {
            name: name,
            type: type,
            chainType: chainType,
            curRound: 1,
            maxRounds: maxRounds,
            rounds: [
                {
                    players: [],
                    pairings: [],
                },
            ],
        };

        //adds players to the players and standings array
        for (let i = 0; i < decks.length; i++) {
            newTourn.rounds[0].players.push({
                playername: decks[i].player,
                deckname: decks[i].deckName,
                deckUrl: decks[i].deckUrl,
                wins: 0,
                losses: 0,
                byes: 0,
                games: 0,
                opponents: [],
            });

            if (typeof decks[i].chains === "number") {
                newTourn.rounds[0].players[i].chains = decks[i].chains;
            }

            //adds extra data based on type of tournament
            if (newTourn.type === "swiss") {
                newTourn.rounds[0].players[i].SoS = 0;
                newTourn.rounds[0].players[i].ESoS = 0;
            }
        }

        //sets up round 1 pairings depending on the type of tournament
        switch (newTourn.type) {
            case "swiss":
                this.swissSetup(newTourn);
                break;
            case "roundRobin":
                this.roundRobinSetup(newTourn);
                break;
            case "singleElim":
                this.singleElimSetup(newTourn);
                break;
        }
    }

    swissSetup(tourn: tournament) {
        //sets up pairings array for first round
        for (
            let i = 0;
            i < Math.floor(tourn.rounds[0].players.length / 2);
            i++
        ) {
            tourn.rounds[0].pairings.push({
                player1: {
                    name: tourn.rounds[0].players[2 * i].playername,
                    deck: tourn.rounds[0].players[2 * i].deckname,
                    winner: false,
                    wins: 0,
                    losses: 0,
                    byes: 0,
                },
                player2: {
                    name: tourn.rounds[0].players[2 * i + 1].playername,
                    deck: tourn.rounds[0].players[2 * i + 1].deckname,
                    winner: false,
                    wins: 0,
                    losses: 0,
                    byes: 0,
                },
            });
            if (
                typeof tourn.rounds[0].players[2 * i].chains === "number" &&
                typeof tourn.rounds[0].players[2 * i + 1].chains === "number"
            ) {
                tourn.rounds[0].pairings[i].player1.chains =
                    tourn.rounds[0].players[2 * i].chains;
                tourn.rounds[0].pairings[i].player2.chains =
                    tourn.rounds[0].players[2 * i + 1].chains;
            }
        }
        //accounts for odd number of players
        if (tourn.rounds[0].players.length % 2 === 1) {
            tourn.rounds[0].pairings.push({
                player1: {
                    name:
                        tourn.rounds[0].players[
                            tourn.rounds[0].players.length - 1
                        ].playername,
                    deck:
                        tourn.rounds[0].players[
                            tourn.rounds[0].players.length - 1
                        ].deckname,
                    winner: true,
                    wins: 0,
                    losses: 0,
                    byes: 0,
                },
                player2: {
                    name: "BYE",
                    deck: "",
                    winner: false,
                    wins: 0,
                    losses: 0,
                    byes: 0,
                },
            });
            if (
                typeof tourn.rounds[0].players[
                    tourn.rounds[0].players.length - 1
                ].chains === "number"
            ) {
                tourn.rounds[0].pairings[
                    tourn.rounds[0].pairings.length - 1
                ].player1.chains =
                    tourn.rounds[0].players[
                        tourn.rounds[0].players.length - 1
                    ].chains;
            }
        }
        this.db.addNewTournament(tourn);
    }

    roundRobinSetup(tourn: tournament) {
        //sets up array to track round robin players.  after each round, first
        //player in array goes to the end to ensure every player faces each other
        tourn.roundRobinArray = [];
        if (tourn.rounds[0].players.length % 2 === 1) {
            let temp = {
                name: "BYE",
                deck: "",
                wins: 0,
                losses: 0,
                byes: 0,
            };
            tourn.roundRobinArray.push(temp);
        }
        for (let i = 0; i < tourn.rounds[0].players.length; i++) {
            let temp = {
                name: tourn.rounds[0].players[i].playername,
                deck: tourn.rounds[0].players[i].deckname,
                wins: 0,
                losses: 0,
                byes: 0,
            };
            if (tourn.chainType === "unofficial") {
                temp["chains"] = tourn.rounds[0].players[i].chains;
            }
            tourn.roundRobinArray.push(temp);
        }

        //sets up pairings array for first round
        for (let i = 0; i < tourn.roundRobinArray.length / 2; i++) {
            if (
                tourn.roundRobinArray[i].name === "BYE" ||
                tourn.roundRobinArray[tourn.roundRobinArray.length - i - 1]
                    .name === "BYE"
            ) {
                tourn.rounds[0].pairings.push({
                    player1: {
                        ...tourn.roundRobinArray[i],
                        winner: false,
                        wins: 0,
                        losses: 0,
                        byes: 0,
                    },
                    player2: {
                        ...tourn.roundRobinArray[
                            tourn.roundRobinArray.length - i - 1
                        ],
                        winner: true,
                        wins: 0,
                        losses: 0,
                        byes: 0,
                    },
                });
            } else {
                tourn.rounds[0].pairings.push({
                    player1: {
                        ...tourn.roundRobinArray[i],
                        winner: false,
                        wins: 0,
                        losses: 0,
                        byes: 0,
                    },
                    player2: {
                        ...tourn.roundRobinArray[
                            tourn.roundRobinArray.length - i - 1
                        ],
                        winner: false,
                        wins: 0,
                        losses: 0,
                        byes: 0,
                    },
                });
            }
        }
        this.db.addNewTournament(tourn);
    }

    singleElimSetup(tourn: tournament) {
        let numPlayers: number = tourn.rounds[0].players.length;
        const rounds = Math.ceil(Math.log2(numPlayers));
        tourn.rounds[0].singleElim = [];

        //puts all players into the single elim array to be organized
        for (let i = 0; i < numPlayers; i++) {
            let temp = {
                name: tourn.rounds[0].players[i].playername,
                deck: tourn.rounds[0].players[i].deckname,
            };
            if (tourn.chainType === "unofficial") {
                temp["chains"] = tourn.rounds[0].players[i].chains;
            }
            tourn.rounds[0].singleElim.push(temp);
        }

        //determines first round byes to bring it to a power of 2
        let byes = Math.pow(2, rounds) - numPlayers;
        for (let i = 0; i < byes; i++) {
            tourn.rounds[0].singleElim.push({
                name: "BYE",
                deck: "",
            });
        }

        numPlayers = tourn.rounds[0].singleElim.length;
        /*
		Sorts the single elim array to match eventual pairings
		For example: 1,2,3,4,5,6,7,8 should become 1,8,5,4,2,7,6,3
		This gives round 1: 1vs8, 5vs4, 2vs7, 6vs3
		Round 2 would have the winner of 1vs8 face 5vs4, etc
		*/
        for (let i = 0; i < rounds - 1; i++) {
            let pairs = Math.pow(2, i);
            let temp = [];
            for (let j = 0; j < numPlayers / (pairs * 2); j++) {
                for (let k = 0; k < pairs; k++) {
                    temp.push(tourn.rounds[0].singleElim.shift());
                }
                for (let k = 0; k < pairs; k++) {
                    temp.push(tourn.rounds[0].singleElim.pop());
                }
            }
            tourn.rounds[0].singleElim = [...temp];
        }

        //Sets up round 1 pairings
        for (let i = 0; i < numPlayers / 2; i++) {
            if (tourn.rounds[0].singleElim[2 * i].name === "BYE") {
                tourn.rounds[0].pairings.push({
                    player1: {
                        ...tourn.rounds[0].singleElim[2 * i],
                        winner: false,
                    },
                    player2: {
                        ...tourn.rounds[0].singleElim[2 * i + 1],
                        winner: true,
                    },
                });
            } else if (tourn.rounds[0].singleElim[2 * i + 1].name === "BYE") {
                tourn.rounds[0].pairings.push({
                    player1: {
                        ...tourn.rounds[0].singleElim[2 * i],
                        winner: true,
                    },
                    player2: {
                        ...tourn.rounds[0].singleElim[2 * i + 1],
                        winner: false,
                    },
                });
            } else {
                tourn.rounds[0].pairings.push({
                    player1: {
                        ...tourn.rounds[0].singleElim[2 * i],
                        winner: false,
                    },
                    player2: {
                        ...tourn.rounds[0].singleElim[2 * i + 1],
                        winner: false,
                    },
                });
            }
        }
        this.db.addNewTournament(tourn);
    }

    ngOnDestroy() {
        this.currentSub.unsubscribe();
        this.finishedSub.unsubscribe();
    }

    //Validators
    onTest() {
        console.log(this.createForm.get("decks").value);
    }

    validateUniquePlayers(controls: FormArray) {
        let values = controls.value;

        for (let i = 0; i < values.length; i++) {
            for (let j = 0; j < values.length; j++) {
                if (i !== j) {
                    if (values[i].name === values[j].name) {
                        controls.controls[i]["controls"]["name"].setErrors({
                            notUnique: true,
                        });
                    }
                    if (values[i].deck === values[j].deck) {
                        controls.controls[i]["controls"]["deck"].setErrors({
                            notUnique: true,
                        });
                    }
                }
            }
        }
        return null;
    }

    validateDeckUrl(control: FormControl): { [s: string]: boolean } {
        if (control.value !== null) {
            if (
                control.value.length != 78 ||
                control.value.search("keyforgegame.com") === -1 ||
                control.value.search("deck-details") === -1
            ) {
                return { "Invalid URL": true };
            }
        }
        return null;
    }

    validateTournamentName(control: FormControl): { [s: string]: boolean } {
        if (this.tournamentNames.indexOf(control.value) >= 0) {
            return { "Tournament Name In Use!": true };
        }
        return null;
    }
}
