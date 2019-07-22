import { tournament } from '../current-tournament.model';
import * as CurrentTournamentsActions from './current-tournaments.actions';

export interface State {
    tournaments:tournament[]
}

const initialState:State = {
    tournaments:[]
}

export function CurrentTournamentsReducer (
    state:State = initialState,
    action:CurrentTournamentsActions.CurrentTournamentActions
){
    switch(action.type){
        case CurrentTournamentsActions.SET_RECIPES:
            return {
                ...state,
                tournaments:action.payload
            }
        case CurrentTournamentsActions.ADD_TOURNAMENT:
            return {
                ...state,
                tournaments:[
                    ...state.tournaments,
                    action.payload
                ]
            };
        case CurrentTournamentsActions.UPDATE_TOURNAMENT:

            const updatedTournaments = [
                ...state.tournaments
            ]

            updatedTournaments[action.payload.id] = {
                ...updatedTournaments[action.payload.id],
                ...action.payload.newTournament
            };

            return {
                ...state,
                updatedTournaments
            }
        default:
            return state;
    }
}