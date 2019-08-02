import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormArray, FormControl } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
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
            tournamentType: new FormControl("swiss", Validators.required),
            chains: new FormControl("no", Validators.required),
            decks: new FormArray([
                new FormGroup({
                    name: new FormControl(1, [
                        Validators.required,
                        RxwebValidators.unique(),
                    ]),
                    deck: new FormControl(
                        "https://www.keyforgegame.com/deck-details/18374c28-ad98-4d1f-9a61-938fdeed0d4c",
                        [Validators.required, this.validateDeckUrl]
                    ),
                }),
                new FormGroup({
                    name: new FormControl(2, [
                        Validators.required,
                        RxwebValidators.unique(),
                    ]),
                    deck: new FormControl(
                        "https://www.keyforgegame.com/deck-details/289a7505-141b-4ab9-9963-4dd83c657126",
                        [Validators.required, this.validateDeckUrl]
                    ),
                }),
                new FormGroup({
                    name: new FormControl(3, [
                        Validators.required,
                        RxwebValidators.unique(),
                    ]),
                    deck: new FormControl(
                        "https://www.keyforgegame.com/deck-details/b2d1936e-7b6a-48db-a9f0-cd951e7ba79f",
                        [Validators.required, this.validateDeckUrl]
                    ),
                }),
                new FormGroup({
                    name: new FormControl(4, [
                        Validators.required,
                        RxwebValidators.unique(),
                    ]),
                    deck: new FormControl(
                        "https://www.keyforgegame.com/deck-details/a27134ae-523f-4954-ab1b-675b4ed72709",
                        [Validators.required, this.validateDeckUrl]
                    ),
                }),
            ]),
        });
    }

    onAddDeck() {
        const control = new FormGroup({
            name: new FormControl(null, [
                Validators.required,
                RxwebValidators.unique(),
            ]),
            deck: new FormControl(
                "https://www.keyforgegame.com/deck-details/a27134ae-523f-4954-ab1b-675b4ed72709",
                [Validators.required, this.validateDeckUrl]
            ),
        });
        (<FormArray>this.createForm.get("decks")).push(control);
    }

    onDeleteDeck(index: number) {
        (<FormArray>this.createForm.get("decks")).removeAt(index);
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

    onSubmit() {
        const formArray = this.createForm.get("decks").value;
        let getArray: { playerName: string; url: string }[] = [];
        const deckArray: { playerName: string; deck: deck }[] = [];
        for (let i = 0; i < formArray.length; i++) {
            getArray.push({
                playerName: formArray[i].name,
                url: formArray[i].deck,
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
        get: { playerName: string; url: string }[],
        decks: { playerName: string; deck: deck }[]
    ) {
        if (get.length > 0) {
            const getArray: string[] = [];
            const nameArray: string[] = [];
            for (let i = 0; i < get.length; i++) {
                getArray.push(get[i].url);
                nameArray.push(get[i].playerName);
            }
            this.deckService
                .getTournamentDecks(getArray)
                .subscribe((decksData: DeckData[]) => {
                    for (let i = 0; i < decksData.length; i++) {
                        console.log(decksData[i].data.name);
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

                        console.log(decksData[i]);
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

                        console.log(newDeck);
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
    private tournamentDecks(decks: { playerName: string; deck: deck }[]) {
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

        this.newTournament(
            this.createForm.get("tournamentName").value,
            this.createForm.get("tournamentType").value,
            this.createForm.get("chains").value,
            tournDecks
        );
        this.isloading = false;
    }

    private newTournament(
        name: string,
        type: string,
        chainType: string,
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
            maxRounds: Math.ceil(Math.log2(decks.length)),
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
            } else if (newTourn.type === "singleElim") {
                newTourn.rounds[0].players[i].eliminated = false;
            }
        }

        //sets up round 1 pairings depending on the type of tournament
        if (newTourn.type === "swiss") {
            this.swissSetup(newTourn);
        } else if (newTourn.type === "singleElim") {
            this.singleElimSetup();
        } else {
            this.roundRobinSetup();
        }
    }

    swissSetup(tourn: tournament) {
        //randomizes initial standings
        for (let i = 0; i < tourn.rounds[0].players.length; i++) {
            let rand = Math.floor(
                Math.random() * tourn.rounds[0].players.length
            );
            let temp = tourn.rounds[0].players[i];
            tourn.rounds[0].players[i] = tourn.rounds[0].players[rand];
            tourn.rounds[0].players[rand] = temp;
        }

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
                },
                player2: {
                    name: tourn.rounds[0].players[2 * i + 1].playername,
                    deck: tourn.rounds[0].players[2 * i + 1].deckname,
                    winner: false,
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
                },
                player2: {
                    name: "BYE",
                    deck: "",
                    winner: false,
                },
            });
        }
        this.db.addNewTournament(tourn);
    }

    singleElimSetup() {}

    roundRobinSetup() {}

    ngOnDestroy() {
        this.currentSub.unsubscribe();
        this.finishedSub.unsubscribe();
    }
}
