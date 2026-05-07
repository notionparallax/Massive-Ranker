<script>
  import { VALUES } from '../values.js';

  let { groupIndices = [], onSelect = () => {} } = $props();
  let selected = $state(null);

  function handleSelect(idx) {
    if (selected !== null) return; // prevent double-click
    selected = idx;
    setTimeout(() => {
      onSelect(idx);
      selected = null;
    }, 250);
  }

  function handleKeydown(e, idx) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(idx);
    }
  }
</script>

<div class="voting-question">
  <h2>Which of these 4 values is most important to you?</h2>
</div>

<div class="cards-grid">
  {#each groupIndices as idx}
    <button
      class="card"
      class:card-selected={selected === idx}
      onclick={() => handleSelect(idx)}
      onkeydown={(e) => handleKeydown(e, idx)}
      disabled={selected !== null}
    >
      {VALUES[idx]}
    </button>
  {/each}
</div>

<style>
  .voting-question h2 {
    font-size: 0.9375rem;
    font-weight: 400;
    margin-bottom: 1.5rem;
    color: #505a5f;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    max-width: 600px;
    margin: 0 auto;
    padding: 0.5rem 0;
  }

  @media (max-width: 480px) {
    .cards-grid {
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
  }

  .card {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80px;
    padding: 1rem;
    font-size: 1.125rem;
    font-weight: 700;
    color: #0b0c0c;
    background: #ffffff;
    border: 3px solid #0b0c0c;
    cursor: pointer;
    text-align: center;
    transition: background 0.15s, border-color 0.15s, transform 0.1s;
    -webkit-tap-highlight-color: transparent;
  }

  .card:hover:not(:disabled) {
    background: #f3f2f1;
    border-color: #1d70b8;
  }

  .card:focus-visible {
    outline: 3px solid #ffdd00;
    outline-offset: 0;
  }

  .card:active:not(:disabled) {
    transform: scale(0.97);
  }

  .card-selected {
    background: #1d70b8 !important;
    color: #ffffff !important;
    border-color: #1d70b8 !important;
  }

  .card:disabled:not(.card-selected) {
    opacity: 0.6;
    cursor: default;
  }
</style>
