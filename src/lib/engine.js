import Glicko2 from 'glicko2';

const settings = {
    tau: 0.5,
    rating: 1500,
    rd: 350,
    vol: 0.06
};

let ranking = new Glicko2.Glicko2(settings);
let players = [];

export function initEngine(count) {
    ranking = new Glicko2.Glicko2(settings);
    players = [];
    for (let i = 0; i < count; i++) {
        players.push(ranking.makePlayer(settings.rating, settings.rd, settings.vol));
    }
    return players;
}

export function restoreEngine(ratingsData) {
    ranking = new Glicko2.Glicko2(settings);
    players = [];
    for (const data of ratingsData) {
        players.push(ranking.makePlayer(data.rating, data.rd, data.vol));
    }
    return players;
}

export function processRound(winnerIndex, groupIndices) {
    const matches = [];
    const winner = players[winnerIndex];

    for (const idx of groupIndices) {
        if (idx === winnerIndex) continue;
        matches.push([winner, players[idx], 1]);
    }

    ranking.updateRatings(matches);
}

export function getRatings() {
    return players.map(p => ({
        rating: p.getRating(),
        rd: p.getRd(),
        vol: p.getVol()
    }));
}

export function getPlayers() {
    return players;
}
