# SCREEN: SHIPYARD TECH TREE (Árbol Tecnológico del Astillero)

## 1. Overview
The **Shipyard Tech Tree** allows players to research and unlock new vessel types, hull reinforcements, and maritime technologies. It transforms the Shipyard from a simple shop into a strategic progression system.

## 2. Component Structure
- **Root**: `ShipyardTechTree.tsx`
- **Internal Modules**:
  - `Tech Node`: Individual research items with icons and status.
  - `Dependency Connector`: SVG lines showing the research path.
  - `Research Info Panel`: Detail view of costs and benefits.

## 3. Data Flow
### 3.1 Sources
- **`useGame()`**: Current tech progress from the engine.
- **`TECH_TREE_DATA`**: The structure of the research branches.

### 3.2 Sinks (Engine Calls)
- `engine.startResearch(techId)`
- `engine.cancelResearch(techId)`

## 4. State Management
| State | Type | Description |
|---|---|---|
| `selectedTech` | `string | null` | The tech currently being inspected. |
| `zoomLevel` | `number` | Controls the scale of the tech tree view. |

## 5. UI Layout (Wireframe)
```text
+-------------------------------------------------------------+
| [Back]   INVESTIGACIÓN NAVAL           Presupuesto: 50,000g |
+-------------------------------------------------------------+
| [ Naval Architecture ] -> [ Caravels ] -> [ Galleons ]      |
|           |                                                 |
|           +-------------> [ Reinforced Hulls ]              |
|                                                             |
+-------------------------------------------------------------+
| INFO: Galleons                                              |
| Cost: 25,000g / 10 Days                                     |
| Benefit: +50% Cargo, +2 Cannons                             |
| [ START RESEARCH ]                                          |
+-------------------------------------------------------------+
```

## 6. Logic & Rules
- **Prerequisites**: Nodes remain locked until parent technologies are researched.
- **Resource Consumption**: Research consumes gold per tick until completion.
- **Efficiency**: Research speed can be boosted by building a Merchant Guild in the city.

## 7. Forensic Audit Notes (QA)
- **Visuals**: Use `glass-panel-active` for currently researched nodes.
- **Optimization**: The dependency lines (SVG) should be memoized to prevent re-renders on every tick.
