<script>
  import './app.css';
  import confetti from 'canvas-confetti';
  import { gameState, recordRound, getTop10Churn, getConfidenceStats, resetState, extendSession } from './lib/store.js';
  import { processRound } from './lib/engine.js';
  import { selectGroup } from './lib/selector.js';
  import ProgressBar from './lib/components/ProgressBar.svelte';
  import VotingCard from './lib/components/VotingCard.svelte';
  import HelpSection from './lib/components/HelpSection.svelte';
  import Results from './lib/components/Results.svelte';
  import Sparkline from './lib/components/Sparkline.svelte';
  import ConfidenceMeter from './lib/components/ConfidenceMeter.svelte';

  let showResults = $state(false);
  let currentGroup = $state([]);
  let confettiFired = $state(false);
  let showResetConfirm = $state(false);

  let state = $state({});
  gameState.subscribe(s => { state = s; });

  let churnData = $derived(getTop10Churn(state));
  let confidence = $derived(getConfidenceStats(state));

  $effect(() => {
    if (currentGroup.length === 0 && state.ratings) {
      currentGroup = selectGroup(state.ratings);
    }
  });

  function handleSelect(winnerIndex) {
    processRound(winnerIndex, currentGroup);
    recordRound(winnerIndex, currentGroup);

    const target = state.targetRounds || 150;
    if (state.totalClicks >= target && !confettiFired) {
      confettiFired = true;
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      setTimeout(() => { showResults = true; }, 1500);
    }

    currentGroup = selectGroup(state.ratings);
  }

  function handleContinue() {
    showResults = false;
  }

  function handleExtend() {
    extendSession(50);
    confettiFired = false;
    showResults = false;
  }

  function handleReset() {
    showResetConfirm = true;
  }

  function confirmReset() {
    resetState();
    confettiFired = false;
    showResults = false;
    showResetConfirm = false;
    currentGroup = selectGroup(state.ratings);
  }

  function cancelReset() {
    showResetConfirm = false;
  }

  function viewResults() {
    showResults = true;
  }
</script>

<main>
  <h1>Values Ranker</h1>

  <ProgressBar totalClicks={state.totalClicks || 0} target={state.targetRounds || 150} />

  <ConfidenceMeter confidence={confidence.confidence} unranked={confidence.unranked} />

  {#if churnData.length >= 2}
    <Sparkline data={churnData} />
  {/if}

  {#if showResetConfirm}
    <div class="reset-dialog">
      <p>This will erase all your progress. Are you sure?</p>
      <div class="reset-actions">
        <button class="btn-danger" onclick={confirmReset}>Yes, reset everything</button>
        <button class="btn-secondary" onclick={cancelReset}>Cancel</button>
      </div>
    </div>
  {:else if showResults}
    <Results {state} {churnData} onContinue={handleContinue} onExtend={handleExtend} />
  {:else}
    <VotingCard groupIndices={currentGroup} onSelect={handleSelect} />
  {/if}

  <div class="bottom-actions">
    {#if !showResults && state.totalClicks > 0}
      <button class="link-btn" onclick={viewResults}>View results so far</button>
    {/if}
    <button class="link-btn link-btn-danger" onclick={handleReset}>Reset all progress</button>
  </div>

  <HelpSection />
</main>

<style>
  .reset-dialog { border: 2px solid #d4351c; padding: 1.5rem; margin: 1rem 0; max-width: 600px; margin-left: auto; margin-right: auto; }
  .reset-dialog p { font-weight: 700; margin: 0 0 1rem; }
  .reset-actions { display: flex; gap: 0.75rem; flex-wrap: wrap; }
  .btn-danger { padding: 0.625rem 1.25rem; font-size: 1rem; font-weight: 700; background: #d4351c; color: #ffffff; border: none; cursor: pointer; }
  .btn-danger:hover { background: #942514; }
  .btn-secondary { padding: 0.625rem 1.25rem; font-size: 1rem; font-weight: 700; background: #ffffff; color: #0b0c0c; border: 2px solid #0b0c0c; cursor: pointer; }
  .btn-secondary:hover { background: #f3f2f1; }
  .bottom-actions { display: flex; gap: 1.5rem; margin-top: 1.5rem; flex-wrap: wrap; }
  .link-btn { background: none; border: none; color: #1d70b8; font-size: 0.875rem; cursor: pointer; padding: 0; text-decoration: underline; }
  .link-btn:hover { color: #003078; }
  .link-btn-danger { color: #d4351c; }
  .link-btn-danger:hover { color: #942514; }
</style>
