<script>
  let { confidence = 0, unranked = 0, total = 117 } = $props();
</script>

<div class="confidence-container">
  <div class="confidence-row">
    <span class="confidence-label">System confidence:</span>
    <span class="confidence-value">{confidence}%</span>
    <div class="confidence-bar-track">
      <div class="confidence-bar-fill" style="width: {confidence}%"></div>
    </div>
  </div>
  {#if unranked > 0}
    <div class="unranked-note">
      {unranked} of {total} values still uncertain
    </div>
  {/if}
</div>

<style>
  .confidence-container { margin: 0.5rem 0 1rem; }
  .confidence-row { display: flex; align-items: center; gap: 0.5rem; }
  .confidence-label { font-size: 0.8rem; font-weight: 700; color: #505a5f; white-space: nowrap; }
  .confidence-value { font-size: 0.8rem; font-weight: 700; color: #0b0c0c; min-width: 2.5rem; }
  .confidence-bar-track { flex: 1; height: 8px; background: #f3f2f1; max-width: 150px; }
  .confidence-bar-fill { height: 100%; background: #00703c; transition: width 0.3s ease; }
  .unranked-note { font-size: 0.75rem; color: #505a5f; margin-top: 0.25rem; }
</style>
