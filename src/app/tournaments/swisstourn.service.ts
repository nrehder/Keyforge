import { Injectable } from '@angular/core';

import { DatabaseService } from '../shared/database.service';

export interface deck {
    name:string,
    wins:number,
    losses:number,
    buys:number,
    games:number,
    opponents:string[]
    SoS:number,
    ESoS:number,
    chains?:number
}

@Injectable({providedIn:'root'})
export class SwissService {
    tournament:{
        name:string,
        [round:number]:{
            decks:{ [name:string]:deck},
            standings:string[]
        }
    } = {
        name:"",
        [1]:{
            decks:{},
            standings:[]
        }
    }
    round:number;

    constructor(private dataStorage:DatabaseService){}
    
    createSwiss(name:string,decks:{name:string,chains?:number}[]){
        this.dataStorage.loadTournament(name);
        this.round = 1;
        this.tournament.name=name;
        //Adds decks to the data storage
        for(let i=0;i<decks.length;i++){
            this.tournament[this.round].decks[decks[i].name] = {
                name:decks[i].name,
                wins:0,
                losses:0,
                buys:0,
                games:0,
                opponents:[],
                SoS:0,
                ESoS:0
            }
            this.tournament[this.round].standings.push(decks[i].name)
        }

        //randomizes standings for first game
        for(let i=0;i<this.tournament[this.round].standings.length;i++){
            let temp = this.tournament[this.round].standings[i];
            let rand = Math.floor(Math.random() * decks.length);
            this.tournament[this.round].standings[i] = this.tournament[this.round].standings[rand];
            this.tournament[this.round].standings[rand] = temp;
        }
        this.dataStorage.saveTournament(this.tournament)
    }

    loadSwiss(){

    }

    updateStandings(update:{name:string,opponent:string,result:string}[]){
        this.round +=1;
        for(let i=0;i<update.length;i++){
            if(update[i].result === "win"){
                this.tournament[this.round].decks[update[i].name].opponents.push(update[i].opponent);
                this.tournament[this.round].decks[update[i].name].wins += 1;
            } else if (update[i].result === "loss"){
                this.tournament[this.round].decks[update[i].name].opponents.push(update[i].opponent);
                this.tournament[this.round].decks[update[i].name].losses += 1;
            } else {
                this.tournament[this.round].decks[update[i].name].buys += 1;
            }
            this.tournament[this.round].decks[update[i].name].games += 1;
        }
        this.calculateSoS();
        this.calculateESoS();
        this.sortStandings();
    }

    //Pairs decks based off of current rank and not having faced each other yet
    getPairings(){
        let currentStandings = [...this.tournament[this.round].standings]
        let pairings:{deck1:string,deck2:string}[]=[];
        let gameNumber = 0;
        while(currentStandings.length>1){
            let i=1;
            let searching = true;
            while(searching){
                if(
                    this.tournament[this.round].decks[currentStandings[0]].opponents.indexOf(currentStandings[i])<0 &&
                    this.tournament[this.round].decks[currentStandings[i]].opponents.indexOf(currentStandings[0])
                    ){
                    pairings.push({
                        deck1:currentStandings[0],
                        deck2:currentStandings[1]
                    })
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
        for(let deck in this.tournament[this.round].decks){
            if( this.tournament[this.round].decks.hasOwnProperty(deck) && this.tournament[this.round].decks[deck].opponents.length>0){
                let sum = 0;
                for(let i=0;i<this.tournament[this.round].decks[deck].opponents.length;i++){
                    let opponent:string = this.tournament[this.round].decks[deck].opponents[i];
                    sum += (this.tournament[this.round].decks[opponent].wins + this.tournament[this.round].decks[opponent].buys)/this.tournament[this.round].decks[opponent].games
                }
                this.tournament[this.round].decks[deck].SoS = sum / this.tournament[this.round].decks[deck].opponents.length
            }
        }
    }

    private calculateESoS(){
        for(let deck in this.tournament[this.round].decks){
            if(this.tournament[this.round].decks.hasOwnProperty(deck) && this.tournament[this.round].decks[deck].opponents.length>0){
                let sum = 0;
                for(let i=0;i<this.tournament[this.round].decks[deck].opponents.length;i++){
                    let opponent:string = this.tournament[this.round].decks[deck].opponents[i];
                    sum += this.tournament[this.round].decks[opponent].SoS
                }
                this.tournament[this.round].decks[deck].ESoS = sum / this.tournament[this.round].decks[deck].opponents.length
            }
        }
    }

    private sortStandings(){
        this.tournament[this.round].standings.sort((a,b)=>{
            let a_wins = this.tournament[this.round].decks[a].wins + this.tournament[this.round].decks[a].buys;
            let b_wins = this.tournament[this.round].decks[b].wins + this.tournament[this.round].decks[b].buys;
            if(a_wins>b_wins){
                return -1;
            } else if(a_wins<b_wins) {
                return 1;
            } else {
                if(this.tournament[this.round].decks[a].SoS>this.tournament[this.round].decks[b].SoS){
                    return -1;
                } else if(this.tournament[this.round].decks[a].SoS<this.tournament[this.round].decks[b].SoS){
                    return 1;
                } else {
                    if(this.tournament[this.round].decks[a].ESoS>this.tournament[this.round].decks[b].ESoS){
                        return -1;
                    } else {
                        return 1;
                    }
                }
            }
        })
    }
}