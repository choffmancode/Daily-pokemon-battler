# Product Vision — Battle Cynthia

## Overview
Battle Cynthia is an ad-free, mobile-first daily Pokémon champion battler built with authentic Generation 3 (Game Boy Advance / Pokémon Emerald) visual language and battle mechanics.

## Core Loop
1. **Daily Roster**: Each day, players are presented with exactly 3 strategy-tagged teams (e.g. SWEEP, STALL, BALANCE).
2. **Squad Selection**: Player selects one team for the day's challenge.
3. **Lead Selection**: Player inspects the 6-slot party list and selects their starting lead Pokémon.
4. **Champion Battle**: Player challenges Champion Cynthia's squad in a high-stakes 6v6 turn-based tactical battle powered by a deterministic Gen-3 Emerald battle engine.
5. **Results & Streak**: Win/loss recorded with daily streak tracking and optional victory reward packs.

## Design Tenets
- **Fast & Accessible**: Loads instantly on any mobile device or browser; thumb-zone primary ergonomics.
- **Authentic Gen-3 Fidelity**: Real damage formulas, type charts, priority tiers, speed mechanics, weather, and stat stages.
- **Pure GBA Aesthetics**: Strict 5-color palette, dual-lined frames, bitmap fonts, zero modern UI slop.
- **No Emulators, No ROMs**: Written in pure TypeScript with standard public Pokémon sprites and species data.
- **No Bag, No Multiplayer**: Clean, focused champion challenge.
