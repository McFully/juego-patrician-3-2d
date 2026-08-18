# Deployment & Build Guide

This document describes how to compile, preview, build, and package the Patrician 3 2D application into a standalone desktop executable.

## Technical Specifications

- **Environment:** Electron + React (Vite) + TypeScript.
- **Main Process Entry:** [electron/main.cjs](file:///c:/Users/Aritz/Desktop/Proyectos%20OpenCode/Patrician%203%202D/electron/main.cjs)
- **Renderer Bundle Output:** `dist/`
- **Desktop Bundle Output:** `dist_electron/`
- **Installer Platform:** Windows (`win.target: nsis`)
- **Publisher/Copyright:** © 2026 Aritz Bahamonde Larxé. All rights reserved.

## Build Scripts

The compilation scripts are defined in `package.json`:

| Command | Action | Description |
|---|---|---|
| `npm run dev` | Spins up Vite dev server | Runs local server on port 5173 for web debugging. |
| `npm run build` | Compiles code (`tsc` + Vite) | Standard production-optimized web compilation. |
| `npm run preview` | Previews production web build | Runs local server with compiled production assets. |
| `npm run electron:dev` | Runs Dev App under Electron | Spins up web server and launches a local Electron window pointing to it. |
| `npm run electron:build` | Generates Desktop Installer | Runs `npm run build` followed by `electron-builder` to package the executable. |
| `npm run dist` | Generates Desktop Installer | Alias for `npm run electron:build`. |

## Installer Packaging Settings (NSIS)

The application packaging configurations inside `package.json` are:

- **App ID:** `com.antigravity.hanseatic.strategos`
- **Product Name:** `Hanseatic Strategos`
- **One-Click Installer:** Disabled (`oneClick: false`), ensuring a standard guided flow wizard.
- **Directory Selection:** Enabled (`allowToChangeInstallationDirectory: true`), permitting users to select their target directory on Windows.
- **Desktop Shortcut:** Enabled (`createDesktopShortcut: true`).

## Compilation Protocol

To build the executable setup installer for distribution on Windows:

1. Open a terminal.
2. Run:
   ```bash
   npm run dist
   ```
3. The packaged setup program `Hanseatic Strategos-v1.0.0-Setup.exe` will be generated in the `dist_electron/` folder.
