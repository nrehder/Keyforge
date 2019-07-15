import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';

export interface DeckData {
    data:{
        casual_losses:number,
        casual_wins:number,
        chains:number,
        expansion:number,
        id:string,
        is_my_deck:boolean,
        is_my_favorite:boolean,
        losses:number,
        name:string,
        power_level:number,
        wins:number,
        set_era_cards:{
            Anomaly:string[],
            Legacy:string[]
        },
        _links:{
            cards:string[],
            houses:string[],
            notes:string[]
        }
    },
    _linked:{
        cards:{
            amber:number,
            armor:string,
            card_number:string,
            card_text:string,
            card_title:string,
            expansion:number,
            flavor_text:string,
            front_image:string,
            house:string,
            id:string,
            is_maverick:boolean,
            power:string,
            rarity:string,
            traits:string
        }[],
        houses:{
            id:string,
            image:string,
            name:string
        }[],
        notes:string[]
    }
}

@Injectable({providedIn:'root'})
export class DecksService {
    constructor(private http:HttpClient){}

    getTournamentDecks(urls:string[]){
        let deckHttpRequests = [];
        for(let i=0;i<urls.length;i++){
            let key = urls[i].substr(urls[i].search('deck-details')+13,36);
            deckHttpRequests.push(this.http.get('https://cors-anywhere.herokuapp.com/https://www.keyforgegame.com/api/decks/' + key + '/?links=cards,notes'))
        }
        return forkJoin(deckHttpRequests)
    }

    // getTournamentDeck(key:string,chains:boolean){
    //     return this.http.get<DeckData>('https://cors-anywhere.herokuapp.com/https://www.keyforgegame.com/api/decks/' + key + '/?links=cards,notes')
    //     .pipe(map(resData=>{
    //         if(chains){
    //             return {
    //                 name:resData.data.name,
    //                 chains:resData.data.chains
    //             }
    //         }
    //         return resData.data.name
    //     }))
    // }
}