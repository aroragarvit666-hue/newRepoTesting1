# Hello World — Adobe App Builder

An ExC Shell SPA with a single web action (`hello`) that greets you, called from an
Adobe React Spectrum UI with IMS authentication.

## Structure
- `actions/hello/index.js` — web action, returns a greeting (`require-adobe-auth: true`)
- `web-src/` — React SPA served from Adobe's CDN
  - `src/components/App.js` — Spectrum UI that calls the action
  - `src/config.json` — action URLs (filled in by `aio app deploy` / preview)
- `test/hello.test.js` — unit tests for the action (200 / greeting / 500)

## Develop
```bash
npm install
aio app use          # select org / project / workspace
aio app run          # local dev
npm test             # run action tests
```

## Deploy
```bash
aio app deploy
```
`aio app deploy` writes the action URLs into `web-src/src/config.json`, then builds and
deploys the frontend to Adobe's CDN.
