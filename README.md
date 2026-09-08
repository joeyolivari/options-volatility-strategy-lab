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
(VSD-37, VSD-38). Until then, each embed section shows a loading state.

This site contains no credentials, API keys, or tokens.
