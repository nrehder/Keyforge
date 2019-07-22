import { Action } from '@ngrx/store';

import { tournament } from '../current-tournament.model';

export type CurrentTournamentActions = SaveTournaments | LoadTournaments | AddTournament | UpdateTournament | SetRecipes;

export const SAVE_TOURNAMENTS = '[Current Tournaments] Save Tournaments';
export class SaveTournaments implements Action {
    readonly type = SAVE_TOURNAMENTS;
    constructor(){}
}

export const LOAD_TOURNAMENTS = '[Current Tournaments] Load Tournaments';
export class LoadTournaments implements Action {
    readonly type = LOAD_TOURNAMENTS;
    constructor(){}
}

export const SET_RECIPES = '[Current Tournaments] Set Recipes';
export class SetRecipes implements Action {
    readonly type = SET_RECIPES;
    constructor(public payload:tournament[]){}
}

export const ADD_TOURNAMENT = '[Current Tournaments] Add Tournaments';
export class AddTournament implements Action {
    readonly type = ADD_TOURNAMENT;
    constructor(public payload:tournament){}
}

export const UPDATE_TOURNAMENT = '[Current Tournaments] Update Tournaments';
export class UpdateTournament implements Action {
    readonly type = UPDATE_TOURNAMENT;
    constructor(public payload:{id:number, newTournament:tournament}){}
}