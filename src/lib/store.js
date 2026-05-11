import { writable } from 'svelte/store';
import { getRatings, initEngine, restoreEngine } from './engine.js';
import { VALUES } from './values.js';

const STORAGE_KEY = 'massive-ranker-state';
const MAX_RD = 350;

function createInitialState() {
    return {
        ratings: VALUES.map(() => ({ rating: 1500, rd: 350, vol: 0.06 })),
        seenCounts: new Array(VALUES.length).fill(0),
        totalClicks: 0,
        targetRounds: 150,
        top10History: []
    };
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.ratings && parsed.seenCounts && typeof parsed.totalClicks === 'number') {
                if (!parsed.targetRounds) parsed.targetRounds = 150;
                return parsed;
            }
        }
    } catch (e) {}
    return createInitialState();
}

function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
}

const initialState = loadState();

if (initialState.totalClicks > 0) {
    restoreEngine(initialState.ratings);
} else {
    initEngine(VALUES.length);
}

export const gameState = writable(initialState);

gameState.subscribe(state => {
    saveState(state);
});

export function recordRound(winnerIndex, groupIndices) {
    gameState.update(state => {
        for (const idx of groupIndices) {
            state.seenCounts[idx]++;
        }
        state.totalClicks++;
        state.ratings = getRatings();

        if (state.totalClicks % 5 === 0) {
            const sorted = state.ratings
                .map((r, i) => ({ i, rating: r.rating }))
                .sort((a, b) => b.rating - a.rating)
                .slice(0, 10)
                .map(x => x.i);
            state.top10History = [...state.top10History, sorted];
        }

        return state;
    });
}

export function extendSession(extra) {
    gameState.update(state => {
        state.targetRounds += extra;
        return state;
    });
}

export function resetState() {
    initEngine(VALUES.length);
    const fresh = createInitialState();
    gameState.set(fresh);
}

export function getTop10Churn(state) {
    const history = state.top10History;
    if (history.length < 2) return [];
    const churns = [];
    for (let i = 1; i < history.length; i++) {
        const prev = new Set(history[i - 1]);
        const curr = history[i];
        const changed = curr.filter(idx => !prev.has(idx)).length;
        churns.push(changed);
    }
    return churns;
}

export function getConfidenceStats(state) {
    if (!state.ratings) return { confidence: 0, unranked: 0 };
    const avgRd = state.ratings.reduce((sum, r) => sum + r.rd, 0) / state.ratings.length;
    const confidence = Math.max(0, Math.round((1 - avgRd / MAX_RD) * 100));
    const unranked = state.ratings.filter(r => r.rd > MAX_RD * 0.85).length;
    return { confidence, unranked };
}

export function exportResults(state) {
    const ranked = state.ratings
        .map((r, i) => ({ name: VALUES[i], rating: Math.round(r.rating), rd: Math.round(r.rd) }))
        .sort((a, b) => b.rating - a.rating);
    return ranked
        .map((v, i) => (i + 1) + '. ' + v.name + ' \u2014 ' + v.rating + ' (\u00B1' + v.rd + ')')
        .join('\n');
}
