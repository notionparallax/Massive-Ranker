<script>
  import './app.css';
  import confetti from 'canvas-confetti';
  import { gameState, recordRound, getTop10Churn } from './lib/store.js';
  import { processRound } from './lib/engine.js';
  import { selectGroup } from './lib/selector.js';
  import ProgressBar from './lib/components/ProgressBar.svelte';
  import VotingCard from './lib/components/VotingCard.svelte';
  import HelpSection from './lib/components/HelpSection.svelte';
  import Results from './lib/components/Results.svelte';
  import Sparkline from './lib/components/Sparkline.svelte';

  let showResults = $state(false);
  let currentGroup = $state([]);
  let confettiFired = $state(false);

  // Derive from store
  let state = $state({});
  gameState.subscribe(s => { state = s; });

  // Derive churn data
  let churnData = $derived(getTop10Churn(state));

  // Initial group selection
  $effect(() => {
    if (currentGroup.length === 0 && state.seenCounts) {
      currentGroup = selectGroup(state.seenCounts);
    }
  });

  function handleSelect(winnerIndex) {
    processRound(winnerIndex, currentGroup);
    recordRound(winnerIndex, currentGroup);

    // Check for confetti milestone
    if (state.totalClicks >= 100 && !confettiFired) {
      confettiFired = true;
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      // Show results after confetti
      setTimeout(() => { showResults = true; }, 1500);
    }

    // Next group
    currentGroup = selectGroup(state.seenCounts);
  }

  function handleContinue() {
    showResults = false;
  }
</script>

<main>
  <h1>Values Ranker</h1>

  <ProgressBar totalClicks={state.totalClicks || 0} />

  {#if churnData.length >= 2}
    <Sparkline data={churnData} />
  {/if}

  {#if showResults}
    <Results {state} {churnData} onContinue={handleContinue} />
  {:else}
    <VotingCard groupIndices={currentGroup} onSelect={handleSelect} />
  {/if}

  <HelpSection />
</main>
