/**
 * Uncertainty-weighted Swiss-system selector.
 * Picks 4 values per round based on rating deviation (RD):
 *   2 highest-RD (most uncertain — need the most data)
 *   1 mid-range + high-RD (calibration anchor)
 *   1 lowest-RD (stable benchmark)
 * Shuffles first so ties are broken randomly.
 */
export function selectGroup(ratings) {
    const indices = ratings.map((r, i) => ({ i, rd: r.rd, rating: r.rating }));

    // Shuffle for random tiebreaking
    for (let k = indices.length - 1; k > 0; k--) {
        const j = Math.floor(Math.random() * (k + 1));
        [indices[k], indices[j]] = [indices[j], indices[k]];
    }

    // Sort by RD descending (most uncertain first)
    const byRd = [...indices].sort((a, b) => b.rd - a.rd);

    // 2 highest-RD
    const pick = [byRd[0], byRd[1]];
    const used = new Set([byRd[0].i, byRd[1].i]);

    // 1 mid-range rating + high RD (calibration)
    const sorted = [...indices].sort((a, b) => a.rating - b.rating);
    const mid = Math.floor(sorted.length / 2);
    for (let offset = 0; offset < sorted.length; offset++) {
        const c = sorted[mid + offset] || sorted[mid - offset];
        if (c && !used.has(c.i)) { pick.push(c); used.add(c.i); break; }
    }

    // 1 lowest-RD (stable benchmark)
    const byRdAsc = [...indices].sort((a, b) => a.rd - b.rd);
    for (const c of byRdAsc) {
        if (!used.has(c.i)) { pick.push(c); break; }
    }

    return pick.map(p => p.i);
}
