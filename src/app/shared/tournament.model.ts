export interface player {
    playername: string;
    deckname: string;
    deckUrl: string;
    wins: number;
    losses: number;
    byes: number;
    games: number;
    opponents: string[];
    chains?: number;
    SoS?: number;
    ESoS?: number;
}

export interface pairing {
    player1: {
        name: string;
        deck: string;
        winner: boolean;
        chains?: number;
        wins?: number;
        losses?: number;
        byes?: number;
    };
    player2: {
        name: string;
        deck: string;
        winner: boolean;
        chains?: number;
        wins?: number;
        losses?: number;
        byes?: number;
    };
}

export interface round {
    pairings: pairing[];
    players: player[];
    singleElim?: {
        name: string;
        deck: string;
        chains?: number;
    }[];
}

export interface tournament {
    name: string;
    type: string;
    chainType: string;
    curRound: number;
    maxRounds: number;
    rounds: round[];
    roundRobinArray?: {
        name: string;
        deck: string;
        chains?: number;
        wins: number;
        losses: number;
        byes: number;
    }[];
}
