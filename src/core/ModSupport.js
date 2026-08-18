/**
 * Mod support: loads constants from external editable config files.
 * Falls back to defaults if config not found.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.resolve(__dirname, '../../config/game_constants.json');

let _cachedConfig = null;

const DEFAULT_CONSTANTS = {
  VERSION: "1.0.0",
  TICK_RATE: 1000,
  BASE_REPUTATION: 50,
  STARTING_GOLD: 3000,
  PIRATE_RETIRE_DAYS: 360,
  CLASS_CONSUMPTION: { poor: 1.0, middle: 1.2, rich: 1.5 }
};

export function loadConfig() {
  if (_cachedConfig) return _cachedConfig;

  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
      _cachedConfig = JSON.parse(raw);
      return _cachedConfig;
    } else {
      // Auto-repair: restore defaults if file missing
      try {
        fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
        fs.writeFileSync(CONFIG_PATH, JSON.stringify(DEFAULT_CONSTANTS, null, 2));
      } catch (e) {
        // Fallback for environments without FS write access (e.g. some CI or limited containers)
      }
      _cachedConfig = DEFAULT_CONSTANTS;
      return _cachedConfig;
    }
  } catch (err) {
    console.warn(`[ModSupport] Config error, using internal defaults: ${err.message}`);
    return DEFAULT_CONSTANTS;
  }
}

export function getConfigValue(path, defaultValue) {
  const config = loadConfig();
  const keys = path.split('.');
  let current = config;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return defaultValue;
    }
  }
  return current !== undefined ? current : defaultValue;
}

export function reloadConfig() {
  _cachedConfig = null;
  return loadConfig();
}

/**
 * Load external mod data from a mods/ directory.
 * Mods are simple JSON files that override parts of the config.
 */
export function loadMods(modDir = null) {
  const baseDir = modDir || path.resolve(__dirname, '../../mods');
  const merged = {};

  try {
    if (fs.existsSync(baseDir)) {
      const files = fs.readdirSync(baseDir).filter(f => f.endsWith('.json'));
      for (const file of files) {
        const modPath = path.join(baseDir, file);
        try {
          const modData = JSON.parse(fs.readFileSync(modPath, 'utf-8'));
          Object.assign(merged, modData);
        } catch (err) {
          console.warn(`[ModSupport] Failed to load mod ${file}: ${err.message}`);
        }
      }
    }
  } catch (err) {
    console.warn(`[ModSupport] Mod directory not found: ${baseDir}`);
  }

  return merged;
}

export { CONFIG_PATH };
