# Metrics Widget - Copilot Coding Agent Instructions

## Repository Overview

This repository contains the **OPERAS Metrics Widget** - an embeddable HTML/React widget that displays visual metrics (graphs, tables, numerical figures) from services like Google Analytics, OPERAS, and Ubiquity. The widget is designed for maximum flexibility, allowing configuration without touching source code.

**Repository Stats:**
- **Type:** TypeScript/React library with dual distribution (UMD bundle + npm package)
- **Size:** ~187 source files
- **Languages:** TypeScript (primary), JavaScript, SCSS, JSON
- **Framework:** React 19 with TypeScript 5.9
- **Build Tools:** Webpack 5, Babel, Biome (linting/formatting)
- **Target Runtimes:** Modern browsers (ES6+), React applications via npm

## Critical Setup Instructions

### Environment Requirements
- **Node.js:** v20.x (confirmed working with v20.19.6)
- **npm:** v10.x (confirmed working with v10.8.2)
- **Package Manager:** npm (uses package-lock.json)

### Installation Process

**ALWAYS run `npm ci` (not `npm install`) for clean, reproducible builds:**

```bash
npm ci
```

This command:
- Installs exact versions from package-lock.json
- Takes ~30-40 seconds
- Automatically runs the `prepare` script which executes `npm run build` (this is expected)
- May show 1 high severity vulnerability warning (pre-existing, non-blocking)
- Will display webpack bundle size warnings (expected behavior, non-blocking)

**IMPORTANT:** The `prepare` script automatically builds the project after installation. This means `dist/` files will be generated during `npm ci`. This is normal and expected.

## Build & Validation Commands

### Linting (Biome)

**Primary linting command (ALWAYS use this):**

```bash
npm run lint
```

- Uses Biome linter/formatter (configured in `biome.json`)
- Auto-fixes issues when possible
- Takes ~1-2 seconds for 187 files
- Exit code 0 = success
- Enforces strict code style rules (see biome.json for details)

**Format code:**

```bash
npm run format
```

### Type Checking

**Type check without building:**

```bash
npm run typecheck
```

- Runs `tsc --noEmit` to validate TypeScript types
- Takes ~5-10 seconds
- No output = success
- Uses `tsconfig.json` configuration

### Combined Check (Pre-commit Equivalent)

**Run both lint and typecheck together:**

```bash
npm run check
```

- Executes: `npm run lint && npm run typecheck`
- This is what the CI pipeline runs
- Takes ~10-15 seconds total
- **ALWAYS run this before committing code changes**

### Building the Project

**Full build (creates both embed bundle and npm package):**

```bash
npm run build
```

This command runs three sub-commands sequentially:

1. `npm run build:embed` - Creates UMD bundle for HTML embedding (`dist/widget.js`, `dist/widget.css`)
2. `npm run build:npm` - Creates CommonJS bundle for npm consumers (`dist/npm/index.js`, `dist/npm/widget.css`)
3. `npm run build:types` - Generates TypeScript declaration files (`dist/npm/types/*.d.ts`)

**Build timings:**
- Full build: ~25-35 seconds
- build:embed: ~10-12 seconds
- build:npm: ~9-10 seconds
- build:types: ~5-7 seconds

**Expected webpack warnings (non-blocking):**
- "asset size limit" warnings for widget.js (447 KiB) and index.js (261 KiB) are EXPECTED
- These are performance recommendations, not errors
- Do NOT attempt to fix these warnings unless specifically requested

**Individual build commands:**

```bash
# Build only the HTML embed bundle (dist/widget.js, dist/widget.css)
npm run build:embed

# Build only the npm package (dist/npm/)
npm run build:npm

# Build only TypeScript declarations (dist/npm/types/)
npm run build:types
```

### Development Server

**Start dev server with hot reload:**

```bash
npm run dev
```

- Starts webpack-dev-server on port 8080 (default)
- Serves files from `dist/` directory
- Hot module replacement enabled
- Access at `http://localhost:8080`
- Uses `dist/index.html` as test page with sample configuration

## Build Output Structure

**After building, the `dist/` directory contains:**

```
dist/
├── widget.js              # Main UMD bundle for HTML embed (~447 KB)
├── widget.css             # Styles for widget (~4.7 KB)
├── widget.js.LICENSE.txt  # Third-party licenses
├── *.widget.js            # Code-split chunks (304, 349, 418, 692, 944)
├── images/                # Widget assets (hypothesis logo, etc.)
├── index.html             # Development test page (NOT published)
└── npm/                   # npm package output
    ├── index.js           # CommonJS entry point (~261 KB)
    ├── widget.css         # Same styles as root
    ├── *.index.js         # Code-split chunks
    └── types/             # TypeScript declarations
        └── *.d.ts
```

**IMPORTANT:** Only `dist/npm/` is published to npm (see `files` field in package.json). The root `dist/` files are uploaded to Google Cloud Storage CDN for HTML embed usage.

## CI/CD Pipeline (.github/workflows/ci.yml)

**Trigger:** Only on git tags matching `v*` pattern (e.g., `v1.1.7`)

**Jobs (in order):**

1. **lint_typecheck** (runs first)
   - Node.js 20
   - Runs `npm ci` then `npm run check`
   - Must pass before other jobs start

2. **build_embed** (after lint_typecheck passes)
   - Builds embed bundle with `npm run build:embed`
   - Uploads `dist/` as artifact (7-day retention)

3. **build_npm** (after lint_typecheck passes)
   - Builds npm package with `npm run build:npm` and `npm run build:types`
   - Uploads `dist/npm/` as artifact (7-day retention)

4. **publish_npm** (after build_npm)
   - Validates tag version matches package.json version
   - Publishes to npm with provenance/trusted publishing
   - Only runs on tags

5. **upload_cdn** (after build_embed, tags only)
   - Uploads to Google Cloud Storage bucket
   - Creates versioned path: `v{major}/{version}/` and `v{major}/latest/`
   - Requires GCP secrets (GCP_WORKLOAD_IDENTITY_PROVIDER, GCP_SERVICE_ACCOUNT_EMAIL, GCP_PROJECT, GCS_BUCKET)

**Key Validation:** The CI checks that the git tag version (e.g., `v1.1.7`) matches the version in `package.json` (e.g., `1.1.7`). Mismatch = build failure.

## Code Organization & Architecture

### Source Structure

```
src/
├── entry.tsx              # HTML embed entrypoint (pulls config from DOM)
├── react.tsx              # React/npm entrypoint (exports MetricsWidget component)
├── types/                 # Global TypeScript type definitions
├── utils/                 # Shared utilities (config parsing, etc.)
└── widget/                # Core widget implementation
    ├── events/            # Event system (widget_loading, widget_ready, etc.)
    ├── types/             # Widget-specific types (Tab, Graph, Config, etc.)
    ├── utils/             # Widget utilities (styling, versioning, HTTP)
    └── Main component
```

### Key Configuration Files

**Linting & Formatting:**
- `biome.json` - Biome configuration (linter + formatter)
  - Line width: 80 characters
  - Indent: 2 spaces
  - Semicolons: always
  - Quotes: single
  - File naming: kebab-case enforced
  - Many strict rules enabled (see file for full list)

**TypeScript:**
- `tsconfig.json` - Main config for development and type checking
  - Target: ESNext
  - Module: CommonJS
  - Strict mode: enabled
  - Path aliases: `@` maps to `src/widget`
- `tsconfig.types.json` - Config for building type declarations

**Build:**
- `webpack.config.js` - HTML embed bundle (entry.tsx → dist/widget.js)
  - CSS modules with `mw__` prefix
  - Sass support
  - Babel transpilation with core-js polyfills
- `webpack.npm.config.js` - npm package bundle (react.tsx → dist/npm/index.js)
  - Externalizes react and react-dom (peer dependencies)
  - Same CSS/Sass pipeline

**Babel:**
- `babel.config.json`
  - Presets: TypeScript, React (automatic JSX runtime), Env (with core-js 3 polyfills)
  - Uses "usage" mode for minimal bundle size

### Git Ignore Patterns

From `.gitignore`:
- `dist/widget.js*` and `dist/*.widget.js*` - Build artifacts (chunked bundles)
- `dist/npm/` - npm package build artifacts
- `node_modules/` - Dependencies
- `.DS_Store` - MacOS files

**NOTE:** Some dist files like `dist/images/` and `dist/index.html` ARE committed (used for development/examples).

## Testing

**NO automated tests exist in this repository.** The project does NOT use Jest, Vitest, or any test framework. Do NOT add test commands unless explicitly requested.

**Manual testing workflow:**
1. Build the project: `npm run build`
2. Start dev server: `npm run dev`
3. Open browser to `http://localhost:8080`
4. View `dist/index.html` which contains sample configuration
5. Inspect widget rendering, console logs, and network requests

## Common Workflows

### Making Code Changes

```bash
# 1. Install dependencies
npm ci

# 2. Make your changes to src/ files

# 3. Lint and type check
npm run check

# 4. Build
npm run build

# 5. Test locally (optional but recommended)
npm run dev
# Open http://localhost:8080 and manually verify changes
```

### Version Bump & Release

**Process:**
1. Update version in `package.json` (e.g., `1.1.7` → `1.2.0`)
2. Run `npm run build` (embeds version in build artifacts)
3. Commit changes
4. Create and push git tag: `git tag v1.2.0 && git push origin v1.2.0`
5. CI pipeline automatically publishes to npm and GCS

**Versioning scheme:** Semantic versioning (major.minor.patch[-prerelease])
- Major: Breaking changes (v1 → v2 requires CDN URL updates)
- Minor: New features (backward compatible)
- Patch: Bug fixes (backward compatible)
- Pre-release: e.g., `1.2.0-alpha.1`, `1.2.0-beta.3`

## Dependency Management

**Runtime dependencies (bundled):**
- React 19 & React DOM 19 (peer dependencies for npm package, bundled for HTML embed)
- chart.js 4.x - Charts rendering
- axios 1.x - HTTP requests
- jquery 3.x - jvectormap dependency
- jvectormap 2.x - World map rendering
- dompurify 3.x - HTML sanitization
- date-fns 4.x - Date utilities
- twitter-widgets 2.x - Tweet embeds

**Build dependencies:**
- webpack 5.x + loaders (babel, sass, css, style)
- Biome 2.x - Linting and formatting
- TypeScript 5.9 - Type checking and declaration generation
- Babel 7.x - Transpilation with React and TypeScript presets

**Package installation notes:**
- Package-lock.json ensures reproducible builds
- `npm ci` is ~10-20% faster than `npm install`
- Audit warning about 1 high severity vulnerability is pre-existing (not introduced by recent changes)

## Common Issues & Solutions

### Issue: "No root element found" error
**Cause:** The element with ID `metrics-widget` (or custom ID from config) doesn't exist in DOM.
**Solution:** Ensure HTML contains `<div id="metrics-widget"></div>` before widget script loads.

### Issue: Build warnings about asset size limits
**Cause:** Widget bundles are large (447 KB for embed, 261 KB for npm).
**Solution:** This is EXPECTED. These are warnings, not errors. Ignore unless file size becomes a project requirement.

### Issue: Biome linting fails
**Cause:** Code style violations (wrong quotes, missing semicolons, naming issues).
**Solution:** Run `npm run lint` which auto-fixes most issues. Manually fix any remaining violations.

### Issue: TypeScript errors after adding new code
**Cause:** Missing type annotations or incorrect types.
**Solution:** Run `npm run typecheck` to see exact errors. Add proper types or fix type mismatches.

### Issue: Build fails with "Cannot find module '@/...'"
**Cause:** TypeScript path alias not resolved.
**Solution:** Ensure imports use `@/` prefix correctly (maps to `src/widget/`). Check `tsconfig.json` paths.

### Issue: CSS changes not appearing
**Cause:** Webpack might be caching or CSS not imported correctly.
**Solution:** 
1. Stop dev server (Ctrl+C)
2. Clear dist: `rm -rf dist`
3. Rebuild: `npm run build`
4. Restart: `npm run dev`

## File Naming Conventions

**ENFORCED by Biome:**
- All files MUST use kebab-case naming (e.g., `my-component.tsx`, `get-widget-style.ts`)
- EXCEPTION: Type declaration files can use `.d.ts` extension
- React component files use `.tsx` extension
- Utility files use `.ts` extension
- Style files use `.scss` extension (with CSS modules)

## Important Notes for Coding Agents

1. **ALWAYS run `npm run check` before committing.** This prevents CI failures.

2. **Use `npm ci` for installation, never `npm install`.** Ensures reproducible builds matching CI.

3. **DO NOT modify `biome.json`, `tsconfig.json`, or webpack configs** unless specifically requested. These are carefully tuned.

4. **DO NOT add testing frameworks** (Jest, Vitest, etc.) unless explicitly requested. This project has no automated tests.

5. **Expect webpack bundle size warnings** during builds. These are informational and NOT errors.

6. **CSS class prefix:** All widget CSS classes use `mw__` prefix (e.g., `mw__navigation`, `mw__graph`). This is enforced by webpack CSS modules config.

7. **Path aliases:** Use `@/` to import from `src/widget/` directory. Example: `import { log } from '@/utils';`

8. **React version:** This project uses React 19 with automatic JSX runtime (no need to import React in component files).

9. **The `prepare` script in package.json runs `npm run build` after install.** This is intentional for npm publishing. When users install the package, it builds automatically.

10. **dist/ files are partially committed:** The `dist/images/` and some reference files ARE committed. The built bundles (`dist/*.js`, `dist/npm/`) are ignored. Check `.gitignore` before questioning this.

11. **Two separate entrypoints:**
    - `src/entry.tsx` - HTML embed version (reads config from DOM script tag)
    - `src/react.tsx` - npm package version (accepts config as React prop)

12. **Configuration format:** Widget expects extensive JSON configuration with `settings`, `options`, `tabs`, `locales`, and `components` fields. See `dist/index.html` for full example or README for documentation.

## Trust These Instructions

These instructions were created by thoroughly exploring the repository, running all commands, and validating the entire build process. Trust the information here and only search the codebase if:
- You need to understand implementation details not covered here
- The instructions appear outdated or incorrect based on your observations
- You need to locate specific code for modifications

**When in doubt, run `npm run check` and `npm run build` to validate your changes work correctly.**
