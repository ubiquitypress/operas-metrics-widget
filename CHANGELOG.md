## [2.0.2](https://github.com/paradigm-publishing/operas-metrics-widget/compare/v2.0.1...v2.0.2) (2026-05-27)

### Bug Fixes

* export GraphRowObject type from package entry point ([cb69a92](https://github.com/paradigm-publishing/operas-metrics-widget/commit/cb69a92d793447c18e1993e15f3f238c444aeb0c))

## [2.0.1](https://github.com/paradigm-publishing/operas-metrics-widget/compare/v2.0.0...v2.0.1) (2026-05-27)

### Bug Fixes

* widen GraphTab to allow mixing Graph and GraphRowObject entries ([22b3ccb](https://github.com/paradigm-publishing/operas-metrics-widget/commit/22b3ccb4ad57ef2fbfbdac6d9a536394e6d8f2fc))

## [2.0.0](https://github.com/ubiquitypress/operas-metrics-widget/compare/v1.4.0...v2.0.0) (2026-05-14)

### ⚠ BREAKING CHANGES

* This release drops the webpack-era polyfill stack
(@babel/preset-env + core-js@usage). The embed and npm bundles now
target the browsers Vite considers "baseline widely available" --
roughly the last ~30 months of major browsers. Consumers on older
browsers (notably Safari < 16, Chrome/Edge < 100, anything pre-2022)
will see new failures; React 19 already excludes most of these, so the
practical impact should be small, but the contract has changed.

Two other observable changes that may matter to integrators:

- Subresource Integrity hashes change. Anyone pinning the embed via
  <script integrity="sha384-..."> needs to regenerate the hash.

- The CDN no longer emits the lazy chunk files (e.g. 304.widget.js,
  349.widget.js, ...). New versions ship widget.js + widget.css only.
  The versioned CDN layout means cached old loaders keep resolving
  their chunks at their original version path, so this only breaks if
  historical CDN versions get wiped. Initial widget.js payload is
  ~75% larger than the previous main chunk, but total bytes for a
  user who opens a graph are lower (no second fetch).

### Features

* line-graph tooltip restyle + drop conflicting world-map title ([ee50d0e](https://github.com/ubiquitypress/operas-metrics-widget/commit/ee50d0ee6aac3710809b0d083b9bdedf8ca30741))

### Bug Fixes

* **ci:** bump runner Node to 24 to satisfy pnpm 11 ([0280213](https://github.com/ubiquitypress/operas-metrics-widget/commit/0280213d4fba2f37656bafed0594d9b522a8a1dc))

### Miscellaneous Chores

* migrate build from webpack to vite ([110e392](https://github.com/ubiquitypress/operas-metrics-widget/commit/110e392bfb1d664e17f55ec466ef575902177621))

## [1.4.0](https://github.com/ubiquitypress/operas-metrics-widget/compare/v1.3.17...v1.4.0) (2026-04-29)

### Features

* add semantic-release with conventional-commit enforcement ([1afe5ad](https://github.com/ubiquitypress/operas-metrics-widget/commit/1afe5ad5168144687189da0b6ad4ce3e4c74608b))

### Bug Fixes

* **a11y:** tab keyboard nav, contrast, region labels, focusable regions ([eeef315](https://github.com/ubiquitypress/operas-metrics-widget/commit/eeef315c88d0b61fc2e29e4aff5c127329c39391))
* **ci:** split npm publish from semantic-release, opt into Node 24 ([ef18975](https://github.com/ubiquitypress/operas-metrics-widget/commit/ef18975e3214d74519ebe17dbd292609194ee6c6))
