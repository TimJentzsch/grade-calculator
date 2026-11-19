import { getBestEliminationIndicesMip } from './elimination-mip.ts';
import type { EliminationCurriculum } from './elimination.ts';

// Calculates the best elimination off the main thread, so the page stays responsive.
self.onmessage = (event: MessageEvent<EliminationCurriculum>) => {
  self.postMessage(getBestEliminationIndicesMip(event.data));
};
