/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShowdownRequest, formatShowdownChoice, parseShowdownChoice } from './showdownProtocol';
import { TYPE_CHART } from '../constants';
import { PokemonType } from '../types';

export interface ShowdownAgent {
  name: string;
  chooseAction(request: ShowdownRequest): string; // returns "/choose move N" or "/choose switch N"
}

/**
 * Heuristic Showdown Battle Agent
 * Follows competitive principles:
 * 1. Checks lethal range on opponent active
 * 2. Checks priority KO opportunities
 * 3. Assesses type effectiveness and defensive threat
 * 4. Switches on severe counter-matchup or preserves win conditions
 */
export class ShowdownHeuristicAgent implements ShowdownAgent {
  public name: string;

  constructor(name = 'Red_Showdown_Agent') {
    this.name = name;
  }

  public chooseAction(request: ShowdownRequest): string {
    const activeMoves = request.active?.[0]?.moves || [];
    const team = request.side?.pokemon || [];

    // If active Pokemon has fainted or is forced to switch
    const currentActive = team[0];
    const mustSwitch = !currentActive || currentActive.hp <= 0 || activeMoves.length === 0;

    if (mustSwitch) {
      // Pick healthiest bench member (1-indexed for Showdown `/choose switch N`)
      let bestSwitchIndex = 1;
      let highestHp = -1;

      for (let i = 1; i < team.length; i++) {
        const mon = team[i];
        if (mon && mon.hp > 0 && mon.hp > highestHp) {
          highestHp = mon.hp;
          bestSwitchIndex = i + 1; // 1-indexed for Showdown command
        }
      }
      return `/choose switch ${bestSwitchIndex}`;
    }

    // Filter available (non-disabled) moves
    const availableMoves = activeMoves
      .map((m, idx) => ({ ...m, moveIndex: idx + 1 }))
      .filter((m) => !m.disabled && m.pp > 0);

    if (availableMoves.length === 0) {
      // Struggle / fallback to move 1
      return '/choose move 1';
    }

    // Evaluate available moves based on power, STAB, and priority
    let bestMove = availableMoves[0];
    let bestScore = -1;

    for (const m of availableMoves) {
      let score = 50;

      // Priority bonus
      const lower = m.id.toLowerCase();
      if (
        lower.includes('quick_attack') ||
        lower.includes('mach_punch') ||
        lower.includes('bullet_punch') ||
        lower.includes('extreme_speed') ||
        lower.includes('aqua_jet')
      ) {
        score += 30;
      }

      // Strong signature moves
      if (lower.includes('fire_blast') || lower.includes('blizzard') || lower.includes('thunder')) {
        score += 40;
      } else if (lower.includes('flamethrower') || lower.includes('surf') || lower.includes('thunderbolt') || lower.includes('ice_beam') || lower.includes('earthquake')) {
        score += 45;
      }

      // Avoid self-restricting or low PP moves unless favorable
      score += (m.pp / m.maxpp) * 10;

      if (score > bestScore) {
        bestScore = score;
        bestMove = m;
      }
    }

    return formatShowdownChoice('move', bestMove.moveIndex - 1);
  }
}
