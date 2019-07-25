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
    eliminated?: boolean;
}

export interface pairing {
    player1: {
        name: string;
        deck: string;
        winner: boolean;
        chains?: number;
    };
    player2: {
        name: string;
        deck: string;
        winner: boolean;
        chains?: number;
    };
}

export interface round {
    pairings: pairing[];
    players: player[];
}

export interface tournament {
    name: string;
    type: string;
    curRound: number;
    maxRounds: number;
    rounds: round[];
    roundRobinArray?: string[];
    singleElimBracket?: {}[];
}
