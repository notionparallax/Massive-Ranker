<script>
  import { exportResults } from "../store.js";
  import { VALUES } from "../values.js";
  import Sparkline from "./Sparkline.svelte";

  let { state = {}, churnData = [], onContinue = () => {} } = $props();

  const ranked = $derived(
    state.ratings
      .map((r, i) => ({ name: VALUES[i], rating: Math.round(r.rating) }))
      .sort((a, b) => b.rating - a.rating)
  );

  function downloadExport() {
    const text = exportResults(state);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-values-ranking.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="results">
  <h2>Your Values Ranking</h2>
  <p class="results-subtitle">{state.totalClicks} rounds completed</p>

  <Sparkline data={churnData} />

  <div class="results-actions">
    <button class="btn-primary" onclick={downloadExport}
      >Download as .txt</button
    >
    <button class="btn-secondary" onclick={onContinue}>Keep ranking</button>
  </div>

  <ol class="results-list">
    {#each ranked as value, i}
      <li class:top-value={i < 5}>
        <span class="value-name">{value.name}</span>
        <span class="value-score">{value.rating}</span>
      </li>
    {/each}
  </ol>
</div>

<style>
  .results {
    max-width: 600px;
    margin: 0 auto;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.25rem;
    color: #0b0c0c;
  }

  .results-subtitle {
    font-size: 0.9375rem;
    color: #505a5f;
    margin-bottom: 1rem;
  }

  .results-actions {
    display: flex;
    gap: 0.75rem;
    margin: 1rem 0 1.5rem;
    flex-wrap: wrap;
  }

  .btn-primary {
    padding: 0.625rem 1.25rem;
    font-size: 1rem;
    font-weight: 700;
    background: #1d70b8;
    color: #ffffff;
    border: none;
    cursor: pointer;
  }

  .btn-primary:hover {
    background: #003078;
  }

  .btn-primary:focus-visible {
    outline: 3px solid #ffdd00;
    outline-offset: 0;
  }

  .btn-secondary {
    padding: 0.625rem 1.25rem;
    font-size: 1rem;
    font-weight: 700;
    background: #ffffff;
    color: #0b0c0c;
    border: 2px solid #0b0c0c;
    cursor: pointer;
  }

  .btn-secondary:hover {
    background: #f3f2f1;
  }

  .btn-secondary:focus-visible {
    outline: 3px solid #ffdd00;
    outline-offset: 0;
  }

  .results-list {
    list-style: none;
    padding: 0;
    margin: 0;
    counter-reset: rank;
  }

  .results-list li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid #f3f2f1;
    counter-increment: rank;
  }

  .results-list li::before {
    content: counter(rank) ".";
    font-weight: 700;
    min-width: 2.5rem;
    color: #505a5f;
  }

  .results-list li.top-value {
    background: #f8f8f8;
  }

  .results-list li.top-value .value-name {
    font-weight: 700;
  }

  .value-name {
    flex: 1;
  }

  .value-score {
    font-size: 0.875rem;
    color: #505a5f;
    font-variant-numeric: tabular-nums;
  }
</style>
