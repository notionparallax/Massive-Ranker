<script>
  let { data = [] } = $props();

  const width = 120;
  const height = 30;
  const padding = 2;

  const points = $derived(() => {
    if (data.length < 2) return '';
    const max = Math.max(...data, 10);
    const stepX = (width - padding * 2) / (data.length - 1);
    return data
      .map((val, i) => {
        const x = padding + i * stepX;
        const y = height - padding - ((val / max) * (height - padding * 2));
        return `${x},${y}`;
      })
      .join(' ');
  });
</script>

{#if data.length >= 2}
  <div class="sparkline-container">
    <span class="sparkline-label">Top-10 stability:</span>
    <svg viewBox="0 0 {width} {height}" class="sparkline" aria-label="Sparkline showing top-10 ranking stability over time">
      <polyline
        points={points()}
        fill="none"
        stroke="#1d70b8"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <span class="sparkline-hint">
      {data[data.length - 1] === 0 ? 'Stable!' : `${data[data.length - 1]} changes`}
    </span>
  </div>
{/if}

<style>
  .sparkline-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }

  .sparkline-label {
    font-size: 0.8rem;
    font-weight: 700;
    color: #505a5f;
    white-space: nowrap;
  }

  .sparkline {
    width: 120px;
    height: 30px;
  }

  .sparkline-hint {
    font-size: 0.75rem;
    color: #505a5f;
  }
</style>
