import { type EliminationCurriculum, getBestEliminationIndices } from './elimination.ts';

// Calculates the best elimination off the main thread, so the page stays responsive.
self.onmessage = (event: MessageEvent<EliminationCurriculum>) => {
  self.postMessage(getBestEliminationIndices(event.data));
};
