import { writable } from 'svelte/store';
import { getRatings, initEngine, restoreEngine } from './engine.js';
import { VALUES } from './values.js';

const STORAGE_KEY = 'massive-ranker-state';

function createInitialState() {
    return {
        ratings: VALUES.map(() => ({ rating: 1500, rd: 350, vol: 0.06 })),
        seenCounts: new Array(VALUES.length).fill(0),
        totalClicks: 0,
        top10History: [] // snapshots of top-10 indices every 5 rounds
    };
}

function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            // Validate structure
            if (parsed.ratings && parsed.seenCounts && typeof parsed.totalClicks === 'number') {
                return parsed;
            }
        }
    } catch (e) {
        // corrupted state, start fresh
    }
    return createInitialState();
}

function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        // localStorage full or unavailable
    }
}

const initialState = loadState();

// Initialize the Glicko-2 engine with saved or fresh ratings
if (initialState.totalClicks > 0) {
    restoreEngine(initialState.ratings);
} else {
    initEngine(VALUES.length);
}

export const gameState = writable(initialState);

// Subscribe to persist on every change
gameState.subscribe(state => {
    saveState(state);
});

export function recordRound(winnerIndex, groupIndices) {
    gameState.update(state => {
        // Update seen counts for all in group
        for (const idx of groupIndices) {
            state.seenCounts[idx]++;
        }

        state.totalClicks++;

        // Sync ratings from engine
        state.ratings = getRatings();

        // Snapshot top-10 every 5 rounds
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

export function exportResults(state) {
    const ranked = state.ratings
        .map((r, i) => ({ name: VALUES[i], rating: Math.round(r.rating) }))
        .sort((a, b) => b.rating - a.rating);

    return ranked
        .map((v, i) => `${i + 1}. ${v.name} — ${v.rating}`)
        .join('\n');
}
