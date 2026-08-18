# SAVE SYSTEM

**Source file:** `src/core/SaveManager.js`

---

## Overview

The `SaveManager` class provides serialization, integrity verification, and restoration of the complete game state. It uses **localStorage** as the persistence backend via a `storage` utility wrapper. Save files are signed with an **HMAC-SHA256 checksum** to detect unauthorized modifications.

---

## Dependencies

| Dependency | Purpose |
|---|---|
| `crypto-js` | HMAC-SHA256 checksumming |
| `../utils/storage` | localStorage abstraction layer |

---

## Security

```js
const SECRET_KEY = 'hanseatic-strategos-integrity-key-2026';
```

Each save is signed using `CryptoJS.HmacSHA256(dataString, SECRET_KEY)`. On load, the checksum is recomputed and compared. If it does not match, the save is rejected with an error log and `null` is returned.

> **Note:** The key is hardcoded in the source. This prevents casual tampering but is not secure against determined reverse-engineering.

---

## Save Format (Envelope)

The file stored in localStorage has this JSON structure:

```json
{
  "data": { ... },       // Full game state payload
  "signature": "abc123"  // HMAC-SHA256 of JSON.stringify(data)
}
```

---

## Payload Structure (`data` field)

### Root Fields

| Field | Type | Description |
|---|---|---|
| `version` | `number` | Save format version (currently `1`) |
| `timestamp` | `number` | Unix timestamp of save (ms) |
| `world` | `object` | World state |
| `player` | `object \| null` | Player state |
| `aiAgents` | `array` | AI competitor states |

### `world` Object

| Field | Type | Description |
|---|---|---|
| `day` | `number` | Current day of month |
| `month` | `number` | Current month (1-12) |
| `year` | `number` | Current year |
| `totalDays` | `number` | Total elapsed days since game start |
| `cities` | `Record<cityId, CityData>` | Per-city serialized state |

### `world.cities[cityId]` Object

| Field | Type | Description |
|---|---|---|
| `popPoor` | `number` | Poor population count |
| `popMiddle` | `number` | Middle class population count |
| `popRich` | `number` | Rich population count |
| `popBeggar` | `number` | Beggar/refugee population count |
| `housingPoor` | `number` | Poor housing units |
| `housingMiddle` | `number` | Middle housing units |
| `housingRich` | `number` | Rich housing units |
| `cityChest` | `number` | City treasury (gold) |
| `reputation` | `number` | City's general reputation |
| `hasWell` | `boolean` | Well constructed |
| `hasHospital` | `boolean` | Hospital constructed |
| `hasBathHouse` | `boolean` | Bath house constructed |
| `wallLevel` | `number` | City wall upgrade level |
| `events` | `CityEvents` | Active events (plague, fire, siege, famine) |
| `factories` | `FactorySave[]` | Factory states (id, built, workers) |
| `market.goods` | `Record<goodId, { stock: number }>` | Current market stock per good |

### `player` Object

| Field | Type | Description |
|---|---|---|
| `name` | `string` | Player character name |
| `gold` | `number` | Current gold |
| `rank` | `number` | Rank index (0-7) |
| `reputation` | `number` | Global reputation |
| `homeCityId` | `string` | Home city ID |
| `currentCityId` | `string` | Current location ID |
| `reputationByCity` | `Record<cityId, number>` | Per-city reputation scores |
| `fleet` | `ShipSave[]` | Fleet serialized state |

### `player.fleet[n]` (Ship Save)

| Field | Type | Description |
|---|---|---|
| `typeId` | `string` | Ship type |
| `name` | `string` | Ship name |
| `cargoCapacity` | `number` | Max cargo |
| `crew / crewMax` | `number` | Crew state |
| `hp / hpMax` | `number` | Hull state |
| `upgradeLevel` | `number` | Upgrade tier |
| `sabers` | `number` | Sabers armed |
| `fightingSkill` | `number` | Combat skill |
| `currentCityId` | `string` | Current port |
| `targetCityId` | `string` | Destination (if sailing) |
| `inTransit` | `boolean` | Transit flag |
| `transitHours / transitTotalHours` | `number` | Transit progress |
| `cargo` | `Record<goodId, number>` | Current cargo contents |
| `x / y` | `number` | World map position |
| `weaponSlots` | `number` | Weapon slots |

### `aiAgents[n]` Object

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Agent identifier |
| `name` | `string` | Display name |
| `homeCityId` | `string` | Home city |
| `gold` | `number` | Treasury |
| `reputation` | `number` | Reputation |
| `aggression` | `number` | Aggression level |
| `active` | `boolean` | Is agent still active |

> **Not serialized:** `politicalSystem` and `eventSystem` are passed to the constructor but their state is not included in the current save payload. This is a known limitation.

---

## API Methods

### `new SaveManager(world, player, aiAgents, politicalSystem, eventSystem)`

Constructor. Receives all game subsystems as dependencies.

### `save(saveName: string): { name: string, size: number }`

1. Calls `serialize()` to build the payload.
2. Signs with HMAC-SHA256.
3. Calls `storage.save(saveName, json)`.
4. Returns `{ name, size }` (size in bytes).

### `load(saveName: string): object | null`

1. Reads JSON string from `storage.load(saveName)`.
2. Parses envelope `{ data, signature }`.
3. Recomputes checksum on `JSON.stringify(data)`.
4. If checksum mismatch → logs error, returns `null`.
5. Returns `data` on success.

### `restore(world, data): World`

Applies loaded data back to a `World` instance:
1. Restores `day`, `month`, `year`, `totalDays`.
2. For each city in `data.world.cities`:
   - Restores all population, housing, infrastructure flags.
   - Restores factory `built` and `workers` state.
   - Restores market stock per good.
3. Returns mutated `world`.

> **Note:** `player` and `aiAgents` restoration is **not implemented** in `restore()`. It only restores the `World` object. Player restoration must be handled separately in `GameEngine`.

### `listSaves(): { name: string, modified: number }[]`

Returns all save names from `storage.list()`. The `modified` field always returns `Date.now()` because localStorage does not provide file modification timestamps.

### `serialize(): { data: object, signature: string }`

Internal. Builds the full payload and signs it. Called by `save()`.

### `generateChecksum(data: string): string`

Returns `CryptoJS.HmacSHA256(data, SECRET_KEY).toString()`.

---

## Save Slots

The number of save slots is **unlimited** - determined by the `storage` utility. Each save is stored under a user-provided name key. There is no built-in slot limit in `SaveManager`.

---

## Storage Backend (`src/utils/storage`)

`SaveManager` delegates to an environment-agnostic `storage` utility:
- In browser/Electron: wraps `localStorage`
- API: `save(key, json)`, `load(key)`, `list()`

---

## Limitations

| Limitation | Description |
|---|---|
| Political system not saved | `politicalSystem` state is not serialized |
| Event system not saved | `eventSystem` state is not serialized |
| Player not restored in `restore()` | Only `World` is restored; player restore is separate |
| No metadata (date, play time) | Only `version` and `timestamp` stored |
| localStorage size limit | ~5MB per origin; large games may hit limit |
| No auto-save | Must be triggered explicitly via `engine.saveGame(name)` |
