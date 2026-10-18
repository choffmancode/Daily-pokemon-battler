/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type, Schema } from '@google/genai';
import { ShowdownRequest, formatShowdownChoice } from './showdownProtocol';
import { ShowdownAgent, ShowdownHeuristicAgent } from './showdownAgent';

export interface GeminiBattleDecision {
  choice: string; // e.g. "/choose move 1" or "/choose switch 3"
  actionType: 'move' | 'switch';
  index: number; // 0-indexed
  tacticalReasoning: string;
  predictedOpponentAction: string;
  winConditionPath: string;
}

const BATTLE_DECISION_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    actionType: {
      type: Type.STRING,
      enum: ['move', 'switch'],
      description: 'Whether to execute a move or switch to a bench Pokémon',
    },
    targetNumber: {
      type: Type.INTEGER,
      description: '1-indexed move slot (1-4) or bench Pokémon slot (1-6)',
    },
    tacticalReasoning: {
      type: Type.STRING,
      description: 'Concise explanation of damage tiers, speed bracket, or defensive pivot',
    },
    predictedOpponentAction: {
      type: Type.STRING,
      description: 'Predicted incoming attack, status move, or switch from opponent',
    },
    winConditionPath: {
      type: Type.STRING,
      description: 'Strategic route to preserve remaining team health and secure win',
    },
  },
  required: ['actionType', 'targetNumber', 'tacticalReasoning', 'predictedOpponentAction', 'winConditionPath'],
};

/**
 * Gemini-powered competitive Pokémon Showdown agent
 * Generalizes battle state representation and utilizes Gemini 2.5/3.8 Flash structured output.
 */
export class GeminiBattleAgent implements ShowdownAgent {
  public name: string;
  private heuristicFallback: ShowdownHeuristicAgent;
  private aiClient: GoogleGenAI | null = null;
  private modelName: string;

  constructor(apiKey?: string, modelName = 'gemini-3.8-flash') {
    this.name = 'Gemini_Showdown_Agent';
    this.heuristicFallback = new ShowdownHeuristicAgent('Heuristic_Fallback');
    this.modelName = modelName;

    const key = apiKey || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : undefined);
    if (key) {
      this.aiClient = new GoogleGenAI({ apiKey: key });
    }
  }

  /**
   * Synchronous interface adhering to standard ShowdownAgent contract
   * Uses heuristic decision by default, or calls async `chooseActionWithGemini` when available
   */
  public chooseAction(request: ShowdownRequest): string {
    return this.heuristicFallback.chooseAction(request);
  }

  /**
   * Asynchronous Gemini agent decision flow with structured responseSchema
   */
  public async chooseActionWithGemini(
    request: ShowdownRequest,
    protocolHistory: string[] = []
  ): Promise<GeminiBattleDecision> {
    if (!this.aiClient) {
      const fallbackChoice = this.heuristicFallback.chooseAction(request);
      const isSwitch = fallbackChoice.includes('switch');
      const num = parseInt(fallbackChoice.replace(/[^0-9]/g, ''), 10) || 1;

      return {
        choice: fallbackChoice,
        actionType: isSwitch ? 'switch' : 'move',
        index: Math.max(0, num - 1),
        tacticalReasoning: 'Heuristic calculation based on type match and lethal range.',
        predictedOpponentAction: 'Highest base power attack',
        winConditionPath: 'Maintain offensive momentum and preserve win condition.',
      };
    }

    const systemPrompt = `You are a competitive Pokémon Showdown AI Agent operating inside a live battle simulator.
Analyze the provided Showdown |request| JSON payload and recent battle protocol stream.
Determine the highest-probability winning action:
- Priority moves, speed tiers, and lethal damage kill ranges
- Defensive pivoting when active is weak to incoming super-effective damage
- Preserving critical sweepers and win conditions
Respond strictly adhering to the JSON schema.`;

    const recentLogs = protocolHistory.slice(-20).join('\n');
    const userPrompt = `RECENT BATTLE PROTOCOL LOGS:
${recentLogs || '(Match start)'}

CURRENT SHOWDOWN REQUEST PAYLOAD:
${JSON.stringify(request, null, 2)}

Provide your strategic /choose action.`;

    try {
      const generatePromise = this.aiClient.models.generateContent({
        model: this.modelName,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: BATTLE_DECISION_SCHEMA,
          temperature: 0.2,
        },
      });

      let timeoutHandle: NodeJS.Timeout | undefined;
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error('Gemini API timeout')), 1200);
        if (typeof timeoutHandle?.unref === 'function') timeoutHandle.unref();
      });

      const response = await Promise.race([generatePromise, timeoutPromise]);
      if (timeoutHandle) clearTimeout(timeoutHandle);

      const parsed = JSON.parse(response.text || '{}');
      const actionType = parsed.actionType === 'switch' ? 'switch' : 'move';
      const targetNumber = typeof parsed.targetNumber === 'number' ? parsed.targetNumber : 1;
      const index = Math.max(0, targetNumber - 1);
      const choice = formatShowdownChoice(actionType, index);

      return {
        choice,
        actionType,
        index,
        tacticalReasoning: parsed.tacticalReasoning || 'Calculated optimal play.',
        predictedOpponentAction: parsed.predictedOpponentAction || 'Expected attack.',
        winConditionPath: parsed.winConditionPath || 'Execute game plan.',
      };
    } catch {
      // Graceful fallback to deterministic heuristic on error/rate limit
      const fallbackChoice = this.heuristicFallback.chooseAction(request);
      const isSwitch = fallbackChoice.includes('switch');
      const num = parseInt(fallbackChoice.replace(/[^0-9]/g, ''), 10) || 1;

      return {
        choice: fallbackChoice,
        actionType: isSwitch ? 'switch' : 'move',
        index: Math.max(0, num - 1),
        tacticalReasoning: 'Deterministic rule evaluation (fallback active).',
        predictedOpponentAction: 'Standard damage move',
        winConditionPath: 'Standard battle execution',
      };
    }
  }
}
