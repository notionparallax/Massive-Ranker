<script>
  let { open = false } = $props();
</script>

<details class="help-section" bind:open>
  <summary>Help — How does this work?</summary>

  <div class="help-content">
    <h3>Why 1 of 4?</h3>
    <p>
      We don't ask you to rank all 117 values at once because "Decision Fatigue"
      is real. Comparing 4 items at a time is the sweet spot — it provides 3×
      more mathematical data than a simple 1-vs-1 choice, but doesn't overwhelm
      your brain like a full list would.
    </p>

    <h3>What is Ranked Choice?</h3>
    <p>
      Traditional voting (picking just 1) often ignores what people almost
      liked. Our system uses ranked choice logic to see not just what you love,
      but what you consistently prioritize over other specific alternatives.
    </p>

    <h3>The Elo System</h3>
    <p>
      Just like in Chess or competitive video games, every value has a "Skill
      Rating." When you pick Honesty over Wealth, Honesty takes points from
      Wealth. Over many matches, the most fundamental values naturally climb the
      ladder to the top.
    </p>

    <h3>How long does it take?</h3>
    <p>
      A session of 100 clicks covers enough ground for your top values to
      stabilize. You can close the tab and come back later — your progress is
      saved automatically.
    </p>
  </div>
</details>

<style>
  .help-section {
    margin-top: 2rem;
    border-top: 1px solid #b1b4b6;
    padding-top: 1rem;
  }

  summary {
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    color: #1d70b8;
    padding: 0.5rem 0;
  }

  summary:hover {
    color: #003078;
  }

  .help-content {
    padding: 0.5rem 0;
  }

  .help-content h3 {
    font-size: 1rem;
    font-weight: 700;
    margin: 1rem 0 0.25rem;
    color: #0b0c0c;
  }

  .help-content p {
    font-size: 0.9375rem;
    line-height: 1.5;
    color: #0b0c0c;
    margin: 0 0 0.75rem;
  }
</style>
