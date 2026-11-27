[![make.fun · news-image-20261126](https://make.fun/badge/news-image-20261126.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![rank](https://make.fun/badge/news-image-20261126/sasa-darwish-dev/world-news-image-26-nov-2026/rank.svg)](https://make.fun/bounty/news-image-20261126/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)
[![reward](https://make.fun/badge/news-image-20261126/sasa-darwish-dev/world-news-image-26-nov-2026/reward.svg)](https://make.fun/bounty/news-image-20261126?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261126)

# World news in one image · 26 November 2026

A self-contained 1024 × 1024 illustrated news sheet, using only the supplied facts. Fifteen numbered stories, additional briefs, source labels and a date-check footer separate Thursday's reports from earlier events. All illustrations are hand-drawn inline SVG; no external resources are loaded.

Render with `sh tools/render.sh` (Chrome and ImageMagick required). The PNG8 result is `assets/entry.png`. Run `node main.ts` with Node 22's TypeScript support, or `node --experimental-strip-types main.ts` where required. The entry checks PNG dimensions, size, structure and chunk CRCs before copying to `$MAKEFUN_OUTPUT_DIR/entry.png` (default `/output/entry.png`).

Chrome is the primary renderer. In sandboxes that deny Chrome's local sockets, the render script prints a warning and uses offline `wkhtmltoimage` with the page's fixed-position compatibility layout. The supplied image was inspected using that fallback because Chrome could not start in this sandbox.
