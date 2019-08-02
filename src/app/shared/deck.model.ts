export interface deck {
    deckName: string;
    deckUrl: string;
    wins: number;
    losses: number;
    byes: number;
    chains: number;
    expansion: string;
    house: {
        name: string;
        img: string;
        cards: {
            [type: string]: {
                [rarity: string]: { name: string; img: string }[];
            };
        };
    }[];
    tournaments?: { name: string; wins: number; losses: number; byes: number };
}
