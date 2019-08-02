export interface deck {
    deckName: string;
    deckUrl: string;
    wins: number;
    losses: number;
    byes: number;
    chains: number;
    expansion: string;
    cards: { name: string; img: string }[];
    house: { name: string; img: string }[];
    tournaments?: { name: string; wins: number; losses: number; byes: number };
}
