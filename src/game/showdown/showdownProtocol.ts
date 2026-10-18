/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pokemon, PokemonType, Move } from '../types';

export type ShowdownSideId = 'p1' | 'p2';
export type ShowdownSlotId = 'p1a' | 'p2a';

export interface ShowdownRequestMove {
  move: string;
  id: string;
  pp: number;
  maxpp: number;
  target?: string;
  disabled?: boolean;
}

export interface ShowdownRequestPokemon {
  ident: string;
  details: string;
  condition: string; // e.g. "284/284", "0 fnt", "180/300 par"
  hp: number;
  maxhp: number;
  active: boolean;
  stats: {
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  moves: string[];
  baseAbility: string;
  item: string;
  pokeball?: string;
}

export interface ShowdownRequest {
  active?: Array<{
    moves: ShowdownRequestMove[];
  }>;
  side: {
    name: string;
    id: ShowdownSideId;
    pokemon: ShowdownRequestPokemon[];
  };
  rqid?: number;
}

export interface ShowdownParsedMessage {
  raw: string;
  command: string;
  args: string[];
}

export interface ShowdownSimulatedSideState {
  id: ShowdownSideId;
  name: string;
  active: {
    species: string;
    details: string;
    currentHp: number;
    maxHp: number;
    fainted: boolean;
    status: string | null;
    boosts: Record<string, number>;
  } | null;
  team: Array<{
    species: string;
    details: string;
    currentHp: number;
    maxHp: number;
    fainted: boolean;
    status: string | null;
  }>;
  hazards: {
    spikes: number;
    stealthRock: boolean;
    toxicSpikes: number;
  };
}

export interface ShowdownProtocolState {
  gen: number;
  tier: string;
  gametype: string;
  turn: number;
  weather: string | null;
  terrain: string | null;
  p1: ShowdownSimulatedSideState;
  p2: ShowdownSimulatedSideState;
  winner: ShowdownSideId | null;
  history: string[];
}

/**
 * Builds standard Showdown `|request|` JSON payload for a given side
 */
export function generateShowdownRequest(
  sideId: ShowdownSideId,
  playerName: string,
  activeMon: Pokemon,
  team: Pokemon[],
  turnNumber: number
): ShowdownRequest {
  return {
    rqid: turnNumber,
    active: activeMon.fainted
      ? []
      : [
          {
            moves: activeMon.moves.map((m) => ({
              move: m.name,
              id: m.id,
              pp: m.pp,
              maxpp: m.maxPp,
              target: 'normal',
              disabled: m.pp <= 0,
            })),
          },
        ],
    side: {
      name: playerName,
      id: sideId,
      pokemon: team.map((p, idx) => {
        const isFnt = p.fainted || p.currentHp <= 0;
        const condition = isFnt
          ? '0 fnt'
          : p.statusCondition
          ? `${p.currentHp}/${p.maxHp} ${p.statusCondition.slice(0, 3)}`
          : `${p.currentHp}/${p.maxHp}`;

        return {
          ident: `${sideId}: ${p.species}`,
          details: `${p.species}, L${p.level}`,
          condition,
          hp: Math.max(0, p.currentHp),
          maxhp: p.maxHp,
          active: idx === 0,
          stats: {
            atk: p.baseStats.attack,
            def: p.baseStats.defense,
            spa: p.baseStats.spAtk,
            spd: p.baseStats.spDef,
            spe: p.baseStats.speed,
          },
          moves: p.moves.map((m) => m.name),
          baseAbility: p.ability,
          item: '',
        };
      }),
    },
  };
}

/**
 * Parses a standard `/choose` command into a structured action
 * E.g. "/choose move 1", "/choose switch 3", "move 2", "switch 4"
 */
export function parseShowdownChoice(choiceString: string): {
  type: 'move' | 'switch';
  index: number; // 0-indexed for internal array access
} {
  const clean = choiceString.replace(/^\/choose\s+/i, '').trim().toLowerCase();
  const parts = clean.split(/\s+/);
  const actionType = parts[0] === 'switch' ? 'switch' : 'move';
  const targetNumber = parseInt(parts[1], 10);
  const index = isNaN(targetNumber) || targetNumber < 1 ? 0 : targetNumber - 1;

  return {
    type: actionType,
    index,
  };
}

/**
 * Formats an action into a Showdown /choose command string
 */
export function formatShowdownChoice(type: 'move' | 'switch', index: number): string {
  return `/choose ${type} ${index + 1}`;
}

/**
 * Parses raw text lines from a Pokémon Showdown text stream
 */
export function parseShowdownLine(line: string): ShowdownParsedMessage | null {
  const trimmed = line.trim();
  if (!trimmed || !trimmed.startsWith('|')) return null;

  const parts = trimmed.slice(1).split('|');
  const command = parts[0];
  const args = parts.slice(1);

  return {
    raw: trimmed,
    command,
    args,
  };
}

/**
 * Full state tracker and parser for Showdown protocol streams
 */
export class ShowdownProtocolParser {
  private state: ShowdownProtocolState;

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): ShowdownProtocolState {
    const createSide = (id: ShowdownSideId): ShowdownSimulatedSideState => ({
      id,
      name: id === 'p1' ? 'Player 1' : 'Player 2',
      active: null,
      team: [],
      hazards: { spikes: 0, stealthRock: false, toxicSpikes: 0 },
    });

    return {
      gen: 9,
      tier: '[Gen 9] OU',
      gametype: 'singles',
      turn: 0,
      weather: null,
      terrain: null,
      p1: createSide('p1'),
      p2: createSide('p2'),
      winner: null,
      history: [],
    };
  }

  public reset(): void {
    this.state = this.createInitialState();
  }

  public getState(): Readonly<ShowdownProtocolState> {
    return this.state;
  }

  /**
   * Feeds a single protocol message line into the parser
   */
  public parseLine(line: string): void {
    const parsed = parseShowdownLine(line);
    if (!parsed) return;

    this.state.history.push(parsed.raw);
    const { command, args } = parsed;

    switch (command) {
      case 'gen':
        this.state.gen = parseInt(args[0], 10) || 9;
        break;
      case 'tier':
        this.state.tier = args[0] || '';
        break;
      case 'gametype':
        this.state.gametype = args[0] || 'singles';
        break;
      case 'player': {
        const sideId = args[0] as ShowdownSideId;
        const name = args[1];
        if (sideId === 'p1' || sideId === 'p2') {
          this.state[sideId].name = name || this.state[sideId].name;
        }
        break;
      }
      case 'turn':
        this.state.turn = parseInt(args[0], 10) || this.state.turn + 1;
        break;
      case 'switch':
      case 'drag': {
        // e.g. |switch|p1a: Great Tusk|Great Tusk, L100|100/100
        const slot = args[0]; // "p1a: Name"
        const sideId = (slot.slice(0, 2) as ShowdownSideId) || 'p1';
        const details = args[1] || '';
        const hpString = args[2] || '100/100';
        const species = slot.includes(': ') ? slot.split(': ')[1] : slot;

        const hpParsed = this.parseHpString(hpString);
        const side = this.state[sideId];

        side.active = {
          species,
          details,
          currentHp: hpParsed.current,
          maxHp: hpParsed.max,
          fainted: hpParsed.fainted,
          status: hpParsed.status,
          boosts: {},
        };

        const existingMember = side.team.find((m) => m.species === species);
        if (!existingMember) {
          side.team.push({
            species,
            details,
            currentHp: hpParsed.current,
            maxHp: hpParsed.max,
            fainted: hpParsed.fainted,
            status: hpParsed.status,
          });
        }
        break;
      }
      case '-damage':
      case '-heal': {
        // e.g. |-damage|p1a: Kingambit|88/100|[from] Spikes
        const slot = args[0];
        const sideId = (slot?.slice(0, 2) as ShowdownSideId) || 'p1';
        const hpString = args[1] || '0 fnt';
        const side = this.state[sideId];
        if (side?.active) {
          const hpParsed = this.parseHpString(hpString);
          side.active.currentHp = hpParsed.current;
          side.active.fainted = hpParsed.fainted;
          if (hpParsed.status) side.active.status = hpParsed.status;
        }
        break;
      }
      case '-boost': {
        // e.g. |-boost|p1a: Zarel_Test_1|spa|1
        const slot = args[0];
        const sideId = (slot?.slice(0, 2) as ShowdownSideId) || 'p1';
        const stat = args[1];
        const amount = parseInt(args[2], 10) || 1;
        const side = this.state[sideId];
        if (side?.active) {
          side.active.boosts[stat] = (side.active.boosts[stat] || 0) + amount;
        }
        break;
      }
      case '-unboost': {
        // e.g. |-unboost|p2a: Dragapult|spa|2
        const slot = args[0];
        const sideId = (slot?.slice(0, 2) as ShowdownSideId) || 'p1';
        const stat = args[1];
        const amount = parseInt(args[2], 10) || 1;
        const side = this.state[sideId];
        if (side?.active) {
          side.active.boosts[stat] = (side.active.boosts[stat] || 0) - amount;
        }
        break;
      }
      case '-sidestart': {
        // e.g. |-sidestart|p1: Agent_Alpha|Spikes
        const sideTarget = args[0];
        const sideId = (sideTarget.startsWith('p1') ? 'p1' : 'p2') as ShowdownSideId;
        const hazard = args[1]?.toLowerCase();
        if (hazard.includes('spikes')) {
          this.state[sideId].hazards.spikes = Math.min(3, this.state[sideId].hazards.spikes + 1);
        } else if (hazard.includes('stealth rock')) {
          this.state[sideId].hazards.stealthRock = true;
        }
        break;
      }
      case '-fieldstart': {
        // e.g. |-fieldstart|move: Grassy Terrain
        this.state.terrain = args[0]?.replace('move: ', '') || null;
        break;
      }
      case '-weather': {
        // e.g. |-weather|Hail
        this.state.weather = args[0] === 'none' ? null : args[0];
        break;
      }
      case 'faint': {
        // e.g. |faint|p2a: Glimmora
        const slot = args[0];
        const sideId = (slot?.slice(0, 2) as ShowdownSideId) || 'p1';
        const side = this.state[sideId];
        if (side?.active) {
          side.active.currentHp = 0;
          side.active.fainted = true;
        }
        break;
      }
      case 'win': {
        const winnerName = args[0];
        if (winnerName === 'p1' || winnerName === this.state.p1.name) {
          this.state.winner = 'p1';
        } else {
          this.state.winner = 'p2';
        }
        break;
      }
    }
  }

  /**
   * Ingests an entire multi-line Showdown protocol log
   */
  public parseStream(protocolText: string): void {
    const lines = protocolText.split(/\r?\n/);
    for (const line of lines) {
      this.parseLine(line);
    }
  }

  private parseHpString(hpStr: string): {
    current: number;
    max: number;
    fainted: boolean;
    status: string | null;
  } {
    if (!hpStr || hpStr.includes('0 fnt') || hpStr.startsWith('0')) {
      return { current: 0, max: 100, fainted: true, status: 'fnt' };
    }
    const parts = hpStr.split(' ');
    const hpFrac = parts[0];
    const status = parts[1] || null;

    if (hpFrac.includes('/')) {
      const [cur, mx] = hpFrac.split('/').map((n) => parseInt(n, 10));
      return {
        current: isNaN(cur) ? 0 : cur,
        max: isNaN(mx) ? 100 : mx,
        fainted: cur <= 0,
        status,
      };
    }

    const curVal = parseInt(hpFrac, 10);
    return {
      current: isNaN(curVal) ? 100 : curVal,
      max: 100,
      fainted: curVal <= 0,
      status,
    };
  }
}
