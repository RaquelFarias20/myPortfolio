export const playBoxConfig = {
  count:           16,
  // Block size is computed at mount time from box width (responsive).
  // SIZE = clamp(sizeMin, W * sizeRatio, sizeMax)
  sizeRatio:       0.18,   // 18% of box width
  sizeMin:         36,     // never smaller than this
  sizeMax:         90,     // never larger than this
  colors:          ['#00FFFF', '#FF00FF', '#FFFF00'],
  gravity:         0.9,
  bounce:          0.26,
  friction:        0.86,
  sleep:           0.9,
  inflateScale:    2.6,
  blastScale:      500,
  inflateDelayMs:  430,
  blastDurationMs: 620,
}
