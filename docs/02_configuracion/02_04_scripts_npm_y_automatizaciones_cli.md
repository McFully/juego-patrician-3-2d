# SCRIPTS NPM Y AUTOMATIZACIONES CLI

## 1. COMANDOS REGISTRADOS
| Comando | Script Ejecutado |
| :--- | :--- |
| `npm run dev` | `vite` |
| `npm run build` | `tsc && vite build` |
| `npm run preview` | `vite preview` |
| `npm run test` | `vitest` |
| `npm run lint` | `eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0` |
| `npm run electron:dev` | `concurrently "npm run dev" "electron ."` |
| `npm run electron:build` | `npm run build && electron-builder` |
| `npm run dist` | `npm run build && electron-builder` |
