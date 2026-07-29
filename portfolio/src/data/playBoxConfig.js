export const playBoxConfig = {
  count: 14,
  // Block size is computed at mount time from box width (responsive).
  // SIZE = clamp(sizeMin, W * sizeRatio, sizeMax)
  sizeRatio: 0.15, // 15% of box width
  sizeMin: 36, // never smaller than this
  sizeMax: 90, // never larger than this
  // 14 distinct hues (12-step color wheel + black + white).
  // count matches colors.length so every block gets a unique color.
  colors: [
    "#FF0000", // red
    "#FF8000", // orange
    "#FFFF00", // yellow
    "#80FF00", // chartreuse
    "#00FF00", // green
    "#00FF80", // spring green
    "#00FFFF", // cyan
    "#0080FF", // azure
    "#0000FF", // blue
    "#8000FF", // violet
    "#FF00FF", // magenta
    "#FF0080", // rose
    "#000000", // black
    "#FFFFFF", // white
  ],
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
