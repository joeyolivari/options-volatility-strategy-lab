# Volatility Strategy Dashboard

Educational, hypothetical market-research project. Pairs a Tesla 2020–2021
volatility case study with a forward-looking AI-industry volatility monitor
and a long straddle/strangle strategy lab.

- Requirements: [Business Requirements Document](https://joeyolivari.atlassian.net/wiki/spaces/VSD/pages/327702/Business+Requirements+Document+Volatility+Strategy+Dashboard)
- Delivery tracking: [Jira project VSD](https://joeyolivari.atlassian.net/jira/software/projects/VSD/boards)

## Structure

- `index.html` — main site shell (GitHub Pages entry point)
- `css/styles.css` — site styles
- `js/main.js` — navigation behavior and Power BI embed wiring

Power BI reports are built and published separately, then embedded via the
`EMBED_SOURCES` map in `js/main.js` once report URLs are available
(VSD-37, VSD-38). Until then, each embed section clearly states that its report is not connected.

Each embed section also carries a data-attribution block (provider, value
classification, source/ingestion timestamps, feed/cadence, freshness state)
populated via the `DATA_ATTRIBUTION` map in `js/main.js`. It reports
"Insufficient data" until the data pipeline and datasets (VSD-17, VSD-18)
and Power BI reports (VSD-38, VSD-42) are built.

This site contains no credentials, API keys, or tokens.

## Website shell

The responsive shell follows the approved [VSD wireframe](https://joeyolivari.atlassian.net/wiki/spaces/VSD/pages/98568):
Tesla origin, AI monitor, Strategy Lab, comparison/explanation, methodology,
and project evidence. Desktop uses a navigation rail; mobile uses a keyboard-accessible
menu. Navigation remains available without JavaScript.

To preview locally, run `python -m http.server 8765 --bind 127.0.0.1` from the
repository and open `http://127.0.0.1:8765/`.

For each published report, configure an approved public-display Power BI URL:

```js
var EMBED_SOURCES = {
  "tesla-origin": {
    embedUrl: "https://app.powerbi.com/view?r=REPLACE_WITH_APPROVED_REPORT_ID",
    reportUrl: "https://app.powerbi.com/view?r=REPLACE_WITH_APPROVED_REPORT_ID"
  }
};
```

The example is a configuration template, not a working report. Supported keys are
`tesla-origin`, `ai-monitor`, `strategy-lab`, and `compare-explain`.
Only HTTPS URLs on `app.powerbi.com` are accepted. A direct Power BI link stays
available because a cross-origin iframe load event cannot confirm successful report
rendering. A 20-second loading timeout provides a fallback for stalled embeds.
Power BI mobile report layouts still require configuration and UAT in Power BI.

Site-update dates do not indicate market-data freshness. Configure verified
`DATA_ATTRIBUTION` values separately. No market data, ranking, or calculated
strategy result is fabricated by the shell.
