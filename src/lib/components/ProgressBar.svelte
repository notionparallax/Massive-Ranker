<script>
  let { totalClicks = 0 } = $props();

  const target = 100;
  const percent = $derived(Math.min((totalClicks / target) * 100, 100));
  const label = $derived(
    totalClicks >= target
      ? `${totalClicks} rounds (100%+)`
      : `${totalClicks} of ${target} rounds`
  );
</script>

<div class="progress-container">
  <div
    class="progress-bar"
    style="width: {percent}%"
    role="progressbar"
    aria-valuenow={totalClicks}
    aria-valuemin={0}
    aria-valuemax={target}
  ></div>
  <span class="progress-label">{label}</span>
</div>

<style>
  .progress-container {
    position: relative;
    width: 100%;
    height: 2rem;
    background: #f3f2f1;
    border-radius: 0;
    margin-bottom: 1.5rem;
  }

  .progress-bar {
    height: 100%;
    background: #1d70b8;
    transition: width 0.3s ease;
    min-width: 0;
  }

  .progress-label {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 0.875rem;
    font-weight: 700;
    color: #0b0c0c;
  }
</style>
