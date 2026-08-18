# Testing Strategy

This document outlines the testing framework, test types, and quality assurance strategy for Patrician 3 2D.

## Test Framework Overview

We use **Playwright** as our primary End-to-End (E2E) testing framework, alongside Node-based simulation validation scripts.

- **Config File:** [playwright.config.ts](file:///c:/Users/Aritz/Desktop/Proyectos%20OpenCode/Patrician%203%202D/playwright.config.ts)
- **Base URL:** `http://localhost:5173`
- **Target Browser:** Chromium (Desktop Chrome)
- **Auto-Server:** Dev command `npm run dev` is spun up automatically during tests.

## Test Directory Structure

```
test/
├── e2e/
│   └── basic_flow.test.ts        # Playwright E2E UI path test
├── unit/                         # Unit tests directory
├── balance_verification.mjs      # Simulation & pricing balance verification script
├── extended_test.mjs             # Long run logic verification script
├── longevity_test.ts             # Performance over time/leak testing script
└── scalability_test.mjs          # High load capacity simulation verification script
```

## Running Tests

### End-to-End Tests
To run the Playwright UI suites:
```bash
npx playwright test
```

### Simulation & Verification Scripts
To verify economic balance, pricing stability, and performance:
```bash
node test/balance_verification.mjs
node test/scalability_test.mjs
```

## Strategy & Core Assertions

1. **Navigation Health:** The E2E tests ensure that opening the Title Screen, navigating to the City Overview, and clicking the sub-modals does not crash the React engine (averting black screen regressions).
2. **Economic Stability:** The `balance_verification.mjs` script acts as a headless simulation validator ensuring that goods consumption and production rates do not cause runaway inflation or complete market crashes within simulated game months.
3. **Responsive Scaling:** Tests verify that the container maintains a clean 16:9 viewport ratio without breaking the UI.
