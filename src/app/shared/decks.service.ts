import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

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
    getDeckName(key:string){
        return this.http.get<DeckData>('https://cors-anywhere.herokuapp.com/https://www.keyforgegame.com/api/decks/' + key + '/?links=cards,notes')
        .pipe(map(resData=>{
            return resData.data.name
        }))
    }
}