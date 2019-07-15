import { Injectable } from '@angular/core';

export interface deck {
    name:string,
    wins:number,
    losses:number,
    buys:number,
    games:number,
    opponents:string[]
    SoS:number,
    ESoS:number,
    chains:number
}

@Injectable({providedIn:'root'})
export class SwissService {
    decks:{ [name:string]:deck};
    standings:string[];
    
    createSwiss(decks:{name:string,chains:number}[]){
        //Adds decks to the data storage
        for(let i=0;i<decks.length;i++){
            this.decks[decks[i].name] = {
                ...decks[i],
                wins:0,
                losses:0,
                buys:0,
                games:0,
                opponents:[],
                SoS:0,
                ESoS:0
            }
            this.standings[i] = decks[i].name
        }

        //randomizes standings for first game
        for(let i=0;i<this.standings.length;i++){
            let temp = this.standings[i];
            let rand = Math.floor(Math.random() * decks.length);
            this.standings[i] = this.standings[rand];
            this.standings[rand] = temp;
        }
    }

    updateStandings(update:{name:string,opponent:string,result:string}[]){
        for(let i=0;i<update.length;i++){
            if(update[i].result === "win"){
                this.decks[update[i].name].opponents.push(update[i].opponent);
                this.decks[update[i].name].wins += 1;
            } else if (update[i].result === "loss"){
                this.decks[update[i].name].opponents.push(update[i].opponent);
                this.decks[update[i].name].losses += 1;
            } else {
                this.decks[update[i].name].buys += 1;
            }
            this.decks[update[i].name].games += 1;
        }
        this.calculateSoS();
        this.calculateESoS();
        this.sortStandings();
    }

    //Pairs decks based off of current rank and not having faced each other yet
    getPairings(){
        let currentStandings = [...this.standings]
        let pairings:{[game:number]:{deck1:string,deck2:string}}
        let gameNumber = 0;
        while(currentStandings.length>1){
            let i=1;
            let searching = true;
            while(searching){
                if(
                    this.decks[currentStandings[0]].opponents.indexOf(currentStandings[i])<0 &&
                    this.decks[currentStandings[i]].opponents.indexOf(currentStandings[0])
                    ){
                    pairings[gameNumber] = {
                        deck1:currentStandings[0],
                        deck2:currentStandings[1]
                    }
                    currentStandings.shift();
                    currentStandings.shift();
                    searching = false;
                } else {
                    i++;
                }
            }

            gameNumber++;
        }
        if(currentStandings.length>0){
            pairings[gameNumber] = {
                deck1:currentStandings[0],
                deck2:'buy'
            }
        }
        return pairings;
    }

    private calculateSoS(){
        for(let deck in this.decks){
            if( this.decks.hasOwnProperty(deck) && this.decks[deck].opponents.length>0){
                let sum = 0;
                for(let i=0;i<this.decks[deck].opponents.length;i++){
                    let opponent:string = this.decks[deck].opponents[i];
                    sum += (this.decks[opponent].wins + this.decks[opponent].buys)/this.decks[opponent].games
                }
                this.decks[deck].SoS = sum / this.decks[deck].opponents.length
            }
        }
    }

    private calculateESoS(){
        for(let deck in this.decks){
            if(this.decks.hasOwnProperty(deck) && this.decks[deck].opponents.length>0){
                let sum = 0;
                for(let i=0;i<this.decks[deck].opponents.length;i++){
                    let opponent:string = this.decks[deck].opponents[i];
                    sum += this.decks[opponent].SoS
                }
                this.decks[deck].ESoS = sum / this.decks[deck].opponents.length
            }
        }
    }

    private sortStandings(){
        this.standings.sort((a,b)=>{
            let a_wins = this.decks[a].wins + this.decks[a].buys;
            let b_wins = this.decks[b].wins + this.decks[b].buys;
            if(a_wins>b_wins){
                return -1;
            } else if(a_wins<b_wins) {
                return 1;
            } else {
                if(this.decks[a].SoS>this.decks[b].SoS){
                    return -1;
                } else if(this.decks[a].SoS<this.decks[b].SoS){
                    return 1;
                } else {
                    if(this.decks[a].ESoS>this.decks[b].ESoS){
                        return -1;
                    } else {
                        return 1;
                    }
                }
            }
        })
    }
}