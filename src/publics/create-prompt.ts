import type { AutomatonPromptFunction } from '../models/automaton.js';

export function createPrompt(callback: AutomatonPromptFunction): AutomatonPromptFunction {
  return callback;
}
