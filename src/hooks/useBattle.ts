/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { BattleState, Pokemon, UserCosmeticInventory, BattleTurnLog } from '../game/types';
import { executeBattleTurn, selectAIMoveOrSwitch, calculateEffectiveSpeed } from '../game/battleEngine';
import { soundFX } from '../components/AudioEngine';
import { haptics } from '../audio/useHaptics';
import { ActiveMoveVFX, FloatingDamageIndicator } from '../components/battle/MoveVFX';

interface UseBattleProps {
  battleState: BattleState;
  onUpdateBattle: (state: BattleState) => void;
  inventory: UserCosmeticInventory;
  onInventoryUpdate: (inv: UserCosmeticInventory) => void;
  onRestartBattle: () => void;
}

/**
 * Partitions new turn logs into distinct animation phases for synchronous Showdown streaming
 */
function partitionTurnLogs(newLogs: BattleTurnLog[]) {
  const secondMoveIdx = newLogs.findIndex((l, idx) => idx > 0 && l.message.includes('used '));

  let firstAttackLogs: BattleTurnLog[] = [];
  let secondAttackLogs: BattleTurnLog[] = [];
  let endTurnLogs: BattleTurnLog[] = [];

  if (secondMoveIdx !== -1) {
    firstAttackLogs = newLogs.slice(0, secondMoveIdx);
    const remainder = newLogs.slice(secondMoveIdx);
    const weatherIdx = remainder.findIndex(
      (l) => l.actor === 'weather' || (l.actor === 'system' && l.message.includes('Hail'))
    );
    if (weatherIdx !== -1) {
      secondAttackLogs = remainder.slice(0, weatherIdx);
      endTurnLogs = remainder.slice(weatherIdx);
    } else {
      secondAttackLogs = remainder;
    }
  } else {
    const weatherIdx = newLogs.findIndex(
      (l) => l.actor === 'weather' || (l.actor === 'system' && l.message.includes('Hail'))
    );
    if (weatherIdx !== -1) {
      firstAttackLogs = newLogs.slice(0, weatherIdx);
      endTurnLogs = newLogs.slice(weatherIdx);
    } else {
      firstAttackLogs = newLogs;
    }
  }

  const firstInitiate = firstAttackLogs.filter((l) => l.message.includes('used '));
  const firstImpact = firstAttackLogs.filter((l) => !l.message.includes('used '));

  const secondInitiate = secondAttackLogs.filter((l) => l.message.includes('used '));
  const secondImpact = secondAttackLogs.filter((l) => !l.message.includes('used '));

  return {
    firstInitiate,
    firstImpact,
    secondInitiate,
    secondImpact,
    endTurnLogs,
  };
}

export function useBattle({
  battleState,
  onUpdateBattle,
  inventory,
  onInventoryUpdate,
  onRestartBattle,
}: UseBattleProps) {
  const [selectedSubMenu, setSelectedSubMenu] = useState<'moves' | 'switch'>('moves');
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isTurnProcessing, setIsTurnProcessing] = useState<boolean>(false);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [hasAwardedVictoryPacks, setHasAwardedVictoryPacks] = useState<boolean>(false);

  // In-battle Pokémon Summary inspection state
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [summaryMon, setSummaryMon] = useState<Pokemon | null>(null);
  const [isSummaryOpponentInitial, setIsSummaryOpponentInitial] = useState<boolean>(false);

  // Showdown Combat Feed Drawer / Modal State
  const [isFeedOpen, setIsFeedOpen] = useState<boolean>(false);

  // Live synchronizing action feed log stream
  const [liveCombatLog, setLiveCombatLog] = useState<BattleTurnLog[]>(battleState.combatLog);

  // Synchronize base combat logs on battle reset or team change
  useEffect(() => {
    setLiveCombatLog(battleState.combatLog);
    setMidTurnPlayerHp(null);
    setMidTurnOpponentHp(null);
    if (battleState.phase === 'faint_switch_player') {
      setSelectedSubMenu('switch');
    }
  }, [battleState]);

  // Pokémon Showdown Move Animation & Damage States
  const [activeVFX, setActiveVFX] = useState<ActiveMoveVFX | null>(null);
  const [floatingDamage, setFloatingDamage] = useState<FloatingDamageIndicator | null>(null);
  const [playerAnimClass, setPlayerAnimClass] = useState<string>('');
  const [opponentAnimClass, setOpponentAnimClass] = useState<string>('');
  const [isScreenFlareActive, setIsScreenFlareActive] = useState<boolean>(false);

  // Dynamic mid-turn HP states for immediate HP bar feedback as hits land
  const [midTurnPlayerHp, setMidTurnPlayerHp] = useState<number | null>(null);
  const [midTurnOpponentHp, setMidTurnOpponentHp] = useState<number | null>(null);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Clear pending animation timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      timeoutsRef.current = [];
    };
  }, []);

  const addTimeout = (fn: () => void, delayMs: number) => {
    const t = setTimeout(fn, delayMs);
    timeoutsRef.current.push(t);
    return t;
  };

  const rawPlayerMon = battleState.playerTeam[battleState.playerActiveIndex];
  const rawOpponentMon = battleState.opponentTeam[battleState.opponentActiveIndex];

  const playerMon: Pokemon = midTurnPlayerHp !== null
    ? { ...rawPlayerMon, currentHp: midTurnPlayerHp, fainted: midTurnPlayerHp <= 0 }
    : rawPlayerMon;

  const opponentMon: Pokemon = midTurnOpponentHp !== null
    ? { ...rawOpponentMon, currentHp: midTurnOpponentHp, fainted: midTurnOpponentHp <= 0 }
    : rawOpponentMon;

  const handleOpenSummary = useCallback((mon: Pokemon, isOpponent: boolean = false) => {
    soundFX.playSelect();
    haptics.tap();
    setSummaryMon(mon);
    setIsSummaryOpponentInitial(isOpponent);
    setIsSummaryOpen(true);
  }, []);

  // Award victory packs once
  useEffect(() => {
    if (battleState.phase === 'battle_over' && battleState.winner === 'player' && !hasAwardedVictoryPacks) {
      setHasAwardedVictoryPacks(true);
      const updatedInv: UserCosmeticInventory = {
        ...inventory,
        availablePacks: inventory.availablePacks + 2,
        stardust: inventory.stardust + 100,
      };
      onInventoryUpdate(updatedInv);
    }
  }, [battleState.phase, battleState.winner, hasAwardedVictoryPacks, inventory, onInventoryUpdate]);

  // Handle attacking with a move (with Pokémon Showdown synchronized animations & live logs)
  const handleSelectMove = useCallback(
    (moveIndex: number) => {
      if (isTurnProcessing || battleState.phase !== 'action_select') return;

      const playerMove = playerMon.moves[moveIndex];
      if (!playerMove || playerMove.pp <= 0) {
        haptics.faint();
        return;
      }

      setIsTurnProcessing(true);
      soundFX.playSelect();

      // Clean existing animations
      setPlayerAnimClass('');
      setOpponentAnimClass('');
      setActiveVFX(null);
      setFloatingDamage(null);

      const aiAction = selectAIMoveOrSwitch(
        opponentMon,
        playerMon,
        battleState.opponentTeam,
        battleState.playerSideConditions,
        battleState.weather
      );
      const nextState = executeBattleTurn(
        battleState,
        { type: 'move', moveIndex },
        aiAction
      );

      const turnMoves = nextState.turnMoves || [];
      const newTurnLogs = nextState.combatLog.slice(battleState.combatLog.length);
      const { firstInitiate, firstImpact, secondInitiate, secondImpact } = partitionTurnLogs(newTurnLogs);

      // If no damage moves were executed (e.g. status move or misses)
      if (turnMoves.length === 0) {
        setLiveCombatLog(nextState.combatLog);
        addTimeout(() => {
          onUpdateBattle(nextState);
          setIsTurnProcessing(false);
          if (nextState.phase === 'faint_switch_player') {
            setSelectedSubMenu('switch');
          }
        }, 500);
        return;
      }

      const firstMove = turnMoves[0];
      const secondMove = turnMoves[1];
      const firstIsPlayer = firstMove.userSide === 'player';

      // --- PHASE A: FIRST ATTACKER EXECUTES MOVE ---
      if (firstIsPlayer) {
        setPlayerAnimClass(firstMove.moveCategory === 'Physical' ? 'anim-tackle-player' : 'anim-special-pulse');
      } else {
        setOpponentAnimClass(firstMove.moveCategory === 'Physical' ? 'anim-tackle-opponent' : 'anim-special-pulse');
      }

      if (firstInitiate.length > 0) {
        setLiveCombatLog((prev) => [...prev, ...firstInitiate]);
      }

      // First Impact (240ms): VFX + IMMEDIATE HP BAR DRAIN
      addTimeout(() => {
        setActiveVFX({
          id: `vfx_1_${Date.now()}`,
          moveName: firstMove.moveName,
          type: firstMove.moveType || 'Normal',
          category: firstMove.moveCategory || 'Physical',
          targetSide: firstMove.targetSide,
        });

        if (firstMove.targetSide === 'opponent') {
          setOpponentAnimClass('anim-damage-shake');
          // Immediate HP bar calculation & drain right as hit connects
          setMidTurnOpponentHp(firstMove.defenderHpRemaining);
        } else {
          setPlayerAnimClass('anim-damage-shake');
          // Immediate HP bar calculation & drain right as hit connects
          setMidTurnPlayerHp(firstMove.defenderHpRemaining);
        }

        setFloatingDamage({
          id: `dmg_1_${Date.now()}`,
          side: firstMove.targetSide,
          damage: firstMove.damageDealt,
          isCrit: firstMove.isCrit,
          effectiveness: firstMove.effectiveness,
        });

        if (firstMove.isCrit || firstMove.effectiveness > 1) {
          setIsScreenFlareActive(true);
          addTimeout(() => setIsScreenFlareActive(false), 500);
        }

        if (firstMove.effectiveness > 1) {
          soundFX.playSuperEffective();
        } else {
          soundFX.playHit();
        }

        setScreenShake(true);
        haptics.hit();
        addTimeout(() => setScreenShake(false), 240);

        if (firstImpact.length > 0) {
          setLiveCombatLog((prev) => [...prev, ...firstImpact]);
        }
      }, 240);

      // First Recoil & Knockout Evaluation (620ms)
      addTimeout(() => {
        setActiveVFX(null);
        setPlayerAnimClass('');
        setOpponentAnimClass('');

        const firstDefenderDied = Boolean(firstMove.defenderFainted || firstMove.defenderHpRemaining <= 0);

        if (firstDefenderDied) {
          // Defender fainted from the first hit: THE DEFENDER MUST NOT ATTACK BACK!
          if (firstMove.targetSide === 'opponent') {
            setOpponentAnimClass('anim-faint-sink');
          } else {
            setPlayerAnimClass('anim-faint-sink');
          }

          soundFX.playFaint();
          haptics.faint();

          // After faint sink completes, finalize state and transition
          addTimeout(() => {
            setLiveCombatLog(nextState.combatLog);
            onUpdateBattle(nextState);
            setIsTurnProcessing(false);
            if (firstMove.targetSide === 'player' || nextState.phase === 'faint_switch_player' || nextState.pendingPivot) {
              setSelectedSubMenu('switch');
            }
          }, 550);
          return;
        }

        // --- PHASE B: DEFENDER SURVIVED — COUNTER-ATTACK EXECUTES ---
        if (secondMove) {
          const secondIsPlayer = secondMove.userSide === 'player';

          if (secondIsPlayer) {
            setPlayerAnimClass(secondMove.moveCategory === 'Physical' ? 'anim-tackle-player' : 'anim-special-pulse');
          } else {
            setOpponentAnimClass(secondMove.moveCategory === 'Physical' ? 'anim-tackle-opponent' : 'anim-special-pulse');
          }

          if (secondInitiate.length > 0) {
            setLiveCombatLog((prev) => [...prev, ...secondInitiate]);
          }

          // Second Impact (240ms later): VFX + IMMEDIATE HP BAR DRAIN
          addTimeout(() => {
            setActiveVFX({
              id: `vfx_2_${Date.now()}`,
              moveName: secondMove.moveName,
              type: secondMove.moveType || 'Normal',
              category: secondMove.moveCategory || 'Physical',
              targetSide: secondMove.targetSide,
            });

            if (secondMove.targetSide === 'player') {
              setPlayerAnimClass('anim-damage-shake');
              // Immediate HP bar calculation & drain right as counter-hit connects
              setMidTurnPlayerHp(secondMove.defenderHpRemaining);
            } else {
              setOpponentAnimClass('anim-damage-shake');
              // Immediate HP bar calculation & drain right as counter-hit connects
              setMidTurnOpponentHp(secondMove.defenderHpRemaining);
            }

            setFloatingDamage({
              id: `dmg_2_${Date.now()}`,
              side: secondMove.targetSide,
              damage: secondMove.damageDealt,
              isCrit: secondMove.isCrit,
              effectiveness: secondMove.effectiveness,
            });

            if (secondMove.isCrit || secondMove.effectiveness > 1) {
              setIsScreenFlareActive(true);
              addTimeout(() => setIsScreenFlareActive(false), 500);
            }

            if (secondMove.effectiveness > 1) {
              soundFX.playSuperEffective();
            } else {
              soundFX.playHit();
            }

            setScreenShake(true);
            haptics.hit();
            addTimeout(() => setScreenShake(false), 240);

            if (secondImpact.length > 0) {
              setLiveCombatLog((prev) => [...prev, ...secondImpact]);
            }

            // Second Recoil & End of Turn Evaluation (620ms later)
            addTimeout(() => {
              setActiveVFX(null);
              setPlayerAnimClass('');
              setOpponentAnimClass('');

              const secondDefenderDied = Boolean(secondMove.defenderFainted || secondMove.defenderHpRemaining <= 0);

              if (secondDefenderDied) {
                if (secondMove.targetSide === 'player') {
                  setPlayerAnimClass('anim-faint-sink');
                } else {
                  setOpponentAnimClass('anim-faint-sink');
                }

                soundFX.playFaint();
                haptics.faint();

                addTimeout(() => {
                  setLiveCombatLog(nextState.combatLog);
                  onUpdateBattle(nextState);
                  setIsTurnProcessing(false);
                  if (secondMove.targetSide === 'player') {
                    setSelectedSubMenu('switch');
                  }
                }, 550);
              } else {
                // Both Pokémon survived initial hits; finalize state (recoil/weather/status residuals resolve)
                setLiveCombatLog(nextState.combatLog);
                onUpdateBattle(nextState);
                setIsTurnProcessing(false);
                if (nextState.phase === 'faint_switch_player' || nextState.pendingPivot) {
                  setSelectedSubMenu('switch');
                }
              }
            }, 620);
          }, 240);
        } else {
          // No second move scheduled (e.g. status or single switch / pivot)
          setLiveCombatLog(nextState.combatLog);
          onUpdateBattle(nextState);
          setIsTurnProcessing(false);
          if (nextState.phase === 'faint_switch_player' || nextState.pendingPivot) {
            setSelectedSubMenu('switch');
          }
        }
      }, secondMove ? 620 : 360);
    },
    [isTurnProcessing, battleState, playerMon, opponentMon, onUpdateBattle]
  );

  // Handle switching Pokémon (Free replacement when fainted, or full turn when switching mid-battle)
  const handleSwitchPokemon = useCallback(
    (targetIndex: number) => {
      if (isTurnProcessing || targetIndex === battleState.playerActiveIndex) return;

      const target = battleState.playerTeam[targetIndex];
      if (!target || target.fainted || target.currentHp <= 0) return;

      setIsTurnProcessing(true);
      soundFX.playSelect();

      // Clear any existing animations and mid-turn HP overrides
      setPlayerAnimClass('');
      setOpponentAnimClass('');
      setActiveVFX(null);
      setFloatingDamage(null);
      setMidTurnPlayerHp(null);
      setMidTurnOpponentHp(null);

      const isPostFaintSwitch =
        battleState.phase === 'faint_switch_player' ||
        battleState.pendingPivot ||
        rawPlayerMon.fainted ||
        rawPlayerMon.currentHp <= 0;

      // On a post-faint replacement switch, the opponent does not get a free attack
      const aiAction = isPostFaintSwitch
        ? { type: 'switch' as const, targetPokemonIndex: battleState.opponentActiveIndex }
        : selectAIMoveOrSwitch(
            opponentMon,
            target,
            battleState.opponentTeam,
            battleState.playerSideConditions,
            battleState.weather
          );

      const nextState = executeBattleTurn(
        battleState,
        { type: 'switch', targetPokemonIndex: targetIndex },
        aiAction
      );

      // If the switch was from a fast pivot (Volt Switch/U-turn) and opponent attacked the incoming Pokémon:
      if (nextState.turnMoves && nextState.turnMoves.length > 0) {
        const oppMove = nextState.turnMoves[0];
        // 1. Immediately place the new incoming Pokémon onto the field
        setLiveCombatLog(nextState.combatLog);
        onUpdateBattle({
          ...nextState,
          playerTeam: nextState.playerTeam.map((p, idx) =>
            idx === targetIndex ? { ...p, currentHp: target.currentHp, fainted: false } : p
          ),
        });

        // 2. Play opponent counter-attack animation against incoming Pokémon
        setOpponentAnimClass(oppMove.moveCategory === 'Physical' ? 'anim-tackle-opponent' : 'anim-special-pulse');

        addTimeout(() => {
          setActiveVFX({
            id: `vfx_pivot_${Date.now()}`,
            moveName: oppMove.moveName,
            type: oppMove.moveType || 'Normal',
            category: oppMove.moveCategory || 'Physical',
            targetSide: 'player',
          });

          setPlayerAnimClass('anim-damage-shake');
          setMidTurnPlayerHp(oppMove.defenderHpRemaining);

          setFloatingDamage({
            id: `dmg_pivot_${Date.now()}`,
            side: 'player',
            damage: oppMove.damageDealt,
            isCrit: oppMove.isCrit,
            effectiveness: oppMove.effectiveness,
          });

          if (oppMove.isCrit || oppMove.effectiveness > 1) {
            setIsScreenFlareActive(true);
            addTimeout(() => setIsScreenFlareActive(false), 500);
          }

          if (oppMove.effectiveness > 1) {
            soundFX.playSuperEffective();
          } else {
            soundFX.playHit();
          }

          setScreenShake(true);
          haptics.hit();
          addTimeout(() => setScreenShake(false), 240);
        }, 240);

        addTimeout(() => {
          setActiveVFX(null);
          setPlayerAnimClass('');
          setOpponentAnimClass('');

          const incomingFainted = Boolean(oppMove.defenderFainted || oppMove.defenderHpRemaining <= 0);
          if (incomingFainted) {
            setPlayerAnimClass('anim-faint-sink');
            soundFX.playFaint();
            haptics.faint();
          }

          addTimeout(() => {
            setLiveCombatLog(nextState.combatLog);
            onUpdateBattle(nextState);
            setSelectedSubMenu(nextState.phase === 'faint_switch_player' ? 'switch' : 'moves');
            setIsTurnProcessing(false);
          }, 350);
        }, 620);
        return;
      }

      // Update combat log & state immediately so the new Pokémon's sprite appears without delay
      setLiveCombatLog(nextState.combatLog);
      onUpdateBattle(nextState);
      setSelectedSubMenu(nextState.phase === 'faint_switch_player' ? 'switch' : 'moves');

      addTimeout(() => {
        setIsTurnProcessing(false);
      }, 150);
    },
    [isTurnProcessing, battleState, rawPlayerMon, opponentMon, onUpdateBattle]
  );

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSummaryOpen || isPaused || isTurnProcessing) return;

      if (e.key === 'Escape') {
        setIsPaused((prev) => !prev);
        return;
      }

      if (e.key === 'l' || e.key === 'L') {
        setIsFeedOpen((prev) => !prev);
        return;
      }

      if (battleState.phase === 'action_select') {
        if (e.key === '1') handleSelectMove(0);
        else if (e.key === '2') handleSelectMove(1);
        else if (e.key === '3') handleSelectMove(2);
        else if (e.key === '4') handleSelectMove(3);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [battleState.phase, handleSelectMove, isPaused, isSummaryOpen, isTurnProcessing]);

  return {
    playerMon,
    opponentMon,
    selectedSubMenu,
    setSelectedSubMenu,
    isPaused,
    setIsPaused,
    isTurnProcessing,
    screenShake,
    isSummaryOpen,
    setIsSummaryOpen,
    summaryMon,
    isSummaryOpponentInitial,
    handleOpenSummary,
    handleSelectMove,
    handleSwitchPokemon,
    // Pokémon Showdown Synchronized Combat Feed and Animations
    liveCombatLog,
    isFeedOpen,
    setIsFeedOpen,
    activeVFX,
    floatingDamage,
    playerAnimClass,
    opponentAnimClass,
    isScreenFlareActive,
  };
}
