/**
 * Least Seen selection algorithm.
 * Picks 4 values with the lowest seenCount, breaking ties randomly.
 */
export function selectGroup(seenCounts) {
    const indices = seenCounts.map((count, i) => ({ i, count }));

    // Shuffle first so ties are broken randomly
    for (let k = indices.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        [indices[k], indices[j]] = [indices[j], indices[k]];
    }

    // Sort by seenCount ascending (stable within the shuffle)
    indices.sort((a, b) => a.count - b.count);

    return indices.slice(0, 4).map(x => x.i);
}
