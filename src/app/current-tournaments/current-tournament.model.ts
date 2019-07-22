export interface player {
    playername:string,
    deckname:string,
    wins:number,
    losses:number,
    byes:number,
    games:number,
    opponents:string[],
    chains?:number,
    SoS?:number,
    ESoS?:number,
    eliminated?:boolean
  }
  
  export interface players {
    [name:string]:player
  }
  
  export interface tournament {
    name:string,
    type:string,
    curRound:number,
    maxRounds:number,
    [roundNumber:number]:{
      standings:string[],
      players:players
    }
  }