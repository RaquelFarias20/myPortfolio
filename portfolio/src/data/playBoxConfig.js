export const playBoxConfig = {
  count: 16,
  // Block size is computed at mount time from box width (responsive).
  // SIZE = clamp(sizeMin, W * sizeRatio, sizeMax)
  sizeRatio: 0.18, // 18% of box width
  sizeMin: 36, // never smaller than this
  sizeMax: 90, // never larger than this
  colors: ["#00FFFF", "#FF00FF", "#FFFF00"],
  // Initial fall — fast and bouncy
  gravitySpawn: 2.2,
  bounceSpawn: 0.24,
  frictionSpawn: 0.25,
  sleepSpawn: 0.95,
  // After first settle — subtle jelly on drag/drop
  gravity: 1.8,
  bounce: 0.3,
  friction: 0.15,
  sleep: 0.55,
  inflateScale: 2.6,
  blastScale: 500,
  inflateDelayMs: 430,
  blastDurationMs: 620,
};
