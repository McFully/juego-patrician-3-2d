/**
 * Dynamic Mission System — connected to gameplay.
 * Missions: Hunt Pirates, Found City, Create Land Route, Deliver Goods.
 * Integrated with PoliticalSystem for Alderman requirements.
 */

import { MissionSystem } from './PoliticalSystem';
import { CityDef } from './City';

export interface MissionTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  difficulty: number;
  requirements: { 
    rank?: number; 
    reputation?: number; 
    gold?: number; 
  };
  objectives: Record<string, any>;
  rewards: { 
    gold?: number; 
    reputation?: number; 
    rankXp?: number; 
    special?: string; 
  };
  timeLimit: number; // days
  repeatable: boolean;
}

export interface ActiveMission extends MissionTemplate {
  startedAt: number;
  status: 'active' | 'completed' | 'failed';
  progress: Record<string, any>;
}

export interface CityFoundingProject {
  missionId: string;
  cityName: string;
  x: number;
  y: number;
  phase: 'accumulation' | 'construction' | 'completed';
  resources: Record<string, number>;
  targetResources: Record<string, number>;
  daysInConstruction: number;
  totalConstructionDays: number;
}

export interface CompletedMission {
  id: string;
  type: string;
  completedAt: number;
  rewards: any;
}

export class DynamicMissionManager {
  engine: any;
  missionSystem: MissionSystem;
  activeMissions: ActiveMission[];
  completedMissions: CompletedMission[];
  missionTemplates: MissionTemplate[];
  cityFoundingProjects: CityFoundingProject[];
  generationCooldown: number;

  constructor(engine: any) {
    this.engine = engine;
    this.missionSystem = new MissionSystem();
    this.activeMissions = [];
    this.completedMissions = [];
    this.cityFoundingProjects = [];
    this.missionTemplates = this.defineTemplates();
    this.generationCooldown = 0;
  }

  defineTemplates(): MissionTemplate[] {
    return [
      {
        id: 'hunt_pirates',
        name: 'Cazar Piratas',
        description: 'Elimina flotas piratas que acechan las rutas comerciales',
        type: 'hunt_pirates',
        difficulty: 1,
        requirements: { rank: 2, reputation: 20 },
        objectives: { piratesKilled: 0, target: 5 },
        rewards: { gold: 50000, reputation: 20, rankXp: 100 },
        timeLimit: 60, // days
        repeatable: true,
      },
      {
        id: 'found_city',
        name: 'Fundar Ciudad',
        description: 'Establece un nuevo asentamiento hanseático con 1000 habitantes',
        type: 'found_city',
        difficulty: 3,
        requirements: { rank: 5, reputation: 100, gold: 200000 },
        objectives: { population: 0, target: 1000 },
        rewards: { gold: 100000, reputation: 50, rankXp: 500 },
        timeLimit: 180,
        repeatable: false,
      },
      {
        id: 'create_land_route',
        name: 'Ruta Terrestre',
        description: 'Conecta dos ciudades interiores mediante una ruta comercial por tierra',
        type: 'create_land_route',
        difficulty: 2,
        requirements: { rank: 3, reputation: 50 },
        objectives: { routeBuilt: false, fromCity: null, toCity: null },
        rewards: { gold: 30000, reputation: 15, rankXp: 200 },
        timeLimit: 90,
        repeatable: true,
      },
      {
        id: 'deliver_grain',
        name: 'Entrega de Emergencia',
        description: 'Entrega grano a una ciudad hambrienta antes de que estalle una revuelta',
        type: 'deliver_grain',
        difficulty: 1,
        requirements: { rank: 1 },
        objectives: { delivered: 0, target: 100, targetCity: null },
        rewards: { gold: 20000, reputation: 15, rankXp: 50 },
        timeLimit: 14,
        repeatable: true,
      },
      {
        id: 'build_wonder',
        name: 'Obra Maestra',
        description: 'Construye un edificio monumental que aumente el prestigio de la Hansa',
        type: 'build_wonder',
        difficulty: 3,
        requirements: { rank: 6, reputation: 150, gold: 500000 },
        objectives: { buildingType: 'town_hall', level: 3 },
        rewards: { gold: 0, reputation: 100, rankXp: 1000, special: 'alderman_credit' },
        timeLimit: 365,
        repeatable: false,
      },
    ];
  }

  /**
   * Check if player meets requirements for a mission.
   */
  canAcceptMission(template: MissionTemplate): boolean {
    const player = this.engine.player;
    const req = template.requirements;
    if (req.rank && player.rank < req.rank) return false;
    if (req.reputation && player.reputation < req.reputation) return false;
    if (req.gold && player.gold < req.gold) return false;
    return true;
  }

  /**
   * Generate available missions for the player.
   */
  generateAvailableMissions(): any[] {
    const available: any[] = [];
    for (const template of this.missionTemplates) {
      if (!template.repeatable && this.isCompleted(template.id)) continue;
      if (this.canAcceptMission(template)) {
        available.push({ ...template, generatedAt: this.engine.server.world.totalDays });
      }
    }
    return available;
  }

  /**
   * Start a mission for the player.
   */
  startMission(missionId: string): { success: boolean; reason?: string; mission?: ActiveMission } {
    const template = this.missionTemplates.find(m => m.id === missionId);
    if (!template) return { success: false, reason: 'Mission not found' };
    if (!this.canAcceptMission(template)) return { success: false, reason: 'Requirements not met' };

    // Create a copy of the objectives for the mission progress
    const objectives = JSON.parse(JSON.stringify(template.objectives));

    // Special setup for specific missions
    if (missionId === 'deliver_grain') {
      // Pick a city with famine or low grain
      const cities = this.engine.server.world.getAllCities();
      const starving = cities.filter((c: any) => 
        c.events.famine || (c.market.goods.grain?.stock || 0) < 100
      );
      objectives.targetCity = starving.length 
        ? starving[Math.floor(Math.random() * starving.length)].id 
        : cities[Math.floor(Math.random() * cities.length)].id;
    }
    if (missionId === 'create_land_route') {
      const cities = this.engine.server.world.getAllCities().filter((c: any) => c.draft === 'shallow');
      objectives.fromCity = cities[Math.floor(Math.random() * cities.length)].id;
      objectives.toCity = cities[Math.floor(Math.random() * cities.length)].id;
      if (objectives.toCity === objectives.fromCity) {
        objectives.toCity = cities[(cities.indexOf(objectives.fromCity) + 1) % cities.length].id;
      }
    }

    const mission: ActiveMission = {
      ...template,
      startedAt: this.engine.server.world.totalDays,
      status: 'active',
      progress: objectives,
    };

    if (template.type === 'found_city') {
      this.cityFoundingProjects.push({
        missionId: mission.id,
        cityName: 'Nueva Hansa',
        x: 750,
        y: 300,
        phase: 'accumulation',
        resources: { bricks: 0, timber: 0, tools: 0, grain: 0 },
        targetResources: { bricks: 200, timber: 100, tools: 50, grain: 100 },
        daysInConstruction: 0,
        totalConstructionDays: 90
      });
    }

    this.activeMissions.push(mission);
    this.missionSystem.activeMissions.push(mission);
    return { success: true, mission };
  }

  /**
   * Deliver resources to a city founding site.
   */
  deliverToFoundingSite(missionId: string, goodId: string, quantity: number): boolean {
    const project = this.cityFoundingProjects.find(p => p.missionId === missionId);
    if (!project || project.phase !== 'accumulation') return false;
    
    project.resources[goodId] = (project.resources[goodId] || 0) + quantity;
    return true;
  }

  /**
   * Update mission progress based on game events.
   */
  processDaily(): void {
    for (const mission of this.activeMissions) {
      if (mission.status !== 'active') continue;

      // Time limit check
      const elapsed = this.engine.server.world.totalDays - mission.startedAt;
      if (elapsed > mission.timeLimit) {
        mission.status = 'failed';
        continue;
      }

      // Progress based on mission type
      switch (mission.type) {
        case 'hunt_pirates':
          // Check if player killed pirates recently (tracked elsewhere)
          break;
        case 'found_city':
          const project = this.cityFoundingProjects.find(p => p.missionId === mission.id);
          if (project) {
            if (project.phase === 'accumulation') {
              let ready = true;
              for (const [res, target] of Object.entries(project.targetResources)) {
                if ((project.resources[res] || 0) < target) {
                  ready = false;
                  break;
                }
              }
              if (ready) project.phase = 'construction';
            } else if (project.phase === 'construction') {
              project.daysInConstruction++;
              if (project.daysInConstruction >= project.totalConstructionDays) {
                project.phase = 'completed';
                // Spawn the city!
                const newCityId = project.cityName.toLowerCase().replace(' ', '_');
                const newCityDef: CityDef = {
                  id: newCityId,
                  name: project.cityName,
                  x: project.x,
                  y: project.y,
                  draft: 'deep',
                  production: 'medium',
                  popPoor: 200,
                  popMiddle: 50,
                  popRich: 10,
                  popBeggar: 20
                };
                this.engine.server.world.addCity(newCityDef);
                mission.progress.population = 280; // Total starting population
              }
            } else if (project.phase === 'completed') {
                const spawnedCity = this.engine.server.world.getCity(project.cityName.toLowerCase().replace(' ', '_'));
                if (spawnedCity) {
                    mission.progress.population = spawnedCity.totalPopulation;
                }
            }
          }
          break;
        case 'create_land_route':
          // Check if player established trade office in both cities
          if (this.engine.player.tradingOffices[mission.progress.fromCity] &&
              this.engine.player.tradingOffices[mission.progress.toCity]) {
            mission.progress.routeBuilt = true;
          }
          break;
        case 'deliver_grain':
          // Progress tracked when player sells grain to target city
          break;
        case 'build_wonder':
          // Check if player built town hall to level 3
          break;
      }

      // Auto-complete if objectives met
      if (this.checkCompletion(mission)) {
        this.completeMission(mission);
      }
    }

    // Remove failed missions
    this.activeMissions = this.activeMissions.filter(m => m.status === 'active');
    this.missionSystem.activeMissions = this.activeMissions;
  }

  checkCompletion(mission: ActiveMission): boolean {
    const p = mission.progress;
    switch (mission.type) {
      case 'hunt_pirates': return p.piratesKilled >= p.target;
      case 'found_city': return p.population >= p.target;
      case 'create_land_route': return p.routeBuilt === true;
      case 'deliver_grain': return p.delivered >= p.target;
      case 'build_wonder': return p.buildingType === 'town_hall' && p.level >= 3;
    }
    return false;
  }

  /**
   * Called when player kills a pirate fleet.
   */
  onPirateKilled(): void {
    for (const m of this.activeMissions) {
      if (m.type === 'hunt_pirates' && m.status === 'active') {
        m.progress.piratesKilled = (m.progress.piratesKilled || 0) + 1;
      }
    }
  }

  /**
   * Called when player sells grain to a city.
   */
  onGrainSold(cityId: string, amount: number): void {
    for (const m of this.activeMissions) {
      if (m.type === 'deliver_grain' && m.status === 'active' && 
          m.progress.targetCity === cityId) {
        m.progress.delivered = (m.progress.delivered || 0) + amount;
      }
    }
  }

  /**
   * Called when player founds a new city.
   */
  onCityFounded(_cityId: string, population: number): void {
    for (const m of this.activeMissions) {
      if (m.type === 'found_city' && m.status === 'active') {
        m.progress.population = population;
      }
    }
  }

  /**
   * Called when player upgrades town hall.
   */
  onBuildingUpgraded(_cityId: string, buildingType: string, level: number): void {
    for (const m of this.activeMissions) {
      if (m.type === 'build_wonder' && m.status === 'active') {
        m.progress.buildingType = buildingType;
        m.progress.level = level;
      }
    }
  }

  completeMission(mission: ActiveMission): { completed: boolean; rewards: any } {
    mission.status = 'completed';
    const rewards = mission.rewards;

    // Apply rewards
    this.engine.player.gold += rewards.gold || 0;
    this.engine.player.reputation += rewards.reputation || 0;
    
    // Track for Alderman requirement
    this.completedMissions.push({ 
      id: mission.id, 
      type: mission.type, 
      completedAt: this.engine.server.world.totalDays,
      rewards 
    });

    return { completed: true, rewards };
  }

  isCompleted(missionId: string): boolean {
    return this.completedMissions.some(m => m.id === missionId);
  }

  getMissionProgress(missionId: string): any {
    const active = this.activeMissions.find(m => m.id === missionId);
    if (active) return { status: 'active', progress: active.progress };
    const completed = this.completedMissions.find(m => m.id === missionId);
    if (completed) return { status: 'completed', completedAt: completed.completedAt };
    return { status: 'available' };
  }

  getUIData(): any {
    return {
      available: this.generateAvailableMissions(),
      active: this.activeMissions.filter(m => m.status === 'active'),
      completed: this.completedMissions,
      aldermanCredits: this.missionSystem.completedMissions,
    };
  }
}

export function createMissionManager(engine: any): DynamicMissionManager {
  return new DynamicMissionManager(engine);
}
