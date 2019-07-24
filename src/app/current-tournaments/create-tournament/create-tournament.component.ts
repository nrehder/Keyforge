import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, Validators, FormArray, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";

import {
    DeckRetrievalService,
    DeckData,
} from "../../shared/deck-retrieval.service";
import { tournament } from "../../shared/tournament.model";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { DatabaseService } from "src/app/shared/database.service";

@Component({
    selector: "app-create-tournament",
    templateUrl: "./create-tournament.component.html",
    styleUrls: ["./create-tournament.component.css"],
})
export class CreateTournamentComponent implements OnInit, OnDestroy {
    databaseSub: Subscription;
    createForm: FormGroup;
    isloading: boolean;
    tournamentNames: string[] = [];

    constructor(
        private deckService: DeckRetrievalService,
        private db: DatabaseService
    ) {}

    ngOnInit() {
        this.databaseSub = this.db
            .loadCurrentTournaments()
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
        const getArray = [];
        for (let i = 0; i < formArray.length; i++) {
            getArray.push(formArray[i].deck);
        }

        this.isloading = true;
        this.deckService
            .getTournamentDecks(getArray)
            .subscribe((decksData: DeckData[]) => {
                let decks = [];
                for (let i = 0; i < decksData.length; i++) {
                    if (this.createForm.get("chains").value === "no") {
                        decks.push({
                            player: formArray[i].name,
                            deckName: decksData[i].data.name,
                            deckUrl: getArray[i],
                        });
                    } else if (
                        this.createForm.get("chains").value === "official"
                    ) {
                        decks.push({
                            player: formArray[i].name,
                            deckName: decksData[i].data.name,
                            chains: decksData[i].data.chains,
                            deckUrl: getArray[i],
                        });
                    } else {
                        decks.push({
                            player: formArray[i].name,
                            deckName: decksData[i].data.name,
                            deckUrl: getArray[i],
                        });
                    }
                }

                this.newTournament(
                    this.createForm.get("tournamentName").value,
                    this.createForm.get("tournamentType").value,
                    decks
                );
                this.isloading = false;
            });
    }

    private newTournament(
        name: string,
        type: string,
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

            if (newTourn.type === "swiss") {
                newTourn.rounds[0].players[i].SoS = 0;
                newTourn.rounds[0].players[i].ESoS = 0;
            } else if (newTourn.type === "singleElim") {
                newTourn.rounds[0].players[i].eliminated = false;
            }
        }

        //randomizes initial standings
        for (let i = 0; i < decks.length; i++) {
            let rand = Math.floor(Math.random() * decks.length);
            let temp = newTourn.rounds[0].players[i];
            newTourn.rounds[0].players[i] = newTourn.rounds[0].players[rand];
            newTourn.rounds[0].players[rand] = temp;
        }

        //sets up pairings array for first round
        for (let i = 0; i < newTourn.rounds[0].players.length / 2; i++) {
            newTourn.rounds[0].pairings.push({
                player1: {
                    name: newTourn.rounds[0].players[2 * i].playername,
                    deck: newTourn.rounds[0].players[2 * i].deckname,
                    winner: false,
                },
                player2: {
                    name: newTourn.rounds[0].players[2 * i + 1].playername,
                    deck: newTourn.rounds[0].players[2 * i + 1].deckname,
                    winner: false,
                },
            });
            if (
                typeof newTourn.rounds[0].players[2 * i].chains === "number" &&
                typeof newTourn.rounds[0].players[2 * i + 1].chains === "number"
            ) {
                newTourn.rounds[0].pairings[i].player1.chains =
                    newTourn.rounds[0].players[2 * i].chains;
                newTourn.rounds[0].pairings[i].player2.chains =
                    newTourn.rounds[0].players[2 * i + 1].chains;
            }
        }
        //accounts for odd number of players
        if (newTourn.rounds[0].players.length % 2 === 1) {
            newTourn.rounds[0].pairings.push({
                player1: {
                    name:
                        newTourn.rounds[0].players[
                            newTourn.rounds[0].players.length - 1
                        ].playername,
                    deck:
                        newTourn.rounds[0].players[
                            newTourn.rounds[0].players.length - 1
                        ].deckname,
                    winner: true,
                },
                player2: {
                    name: "bye",
                    deck: "",
                    winner: false,
                },
            });
        }

        //saves the new tournament to the database
        this.db.addNewTournament(newTourn);
    }

    ngOnDestroy() {
        this.databaseSub.unsubscribe();
    }
}
