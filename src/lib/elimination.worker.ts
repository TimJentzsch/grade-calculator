import { getBestEliminationIndices } from './elimination.ts';
import Curriculum, { type CurriculumObject } from './model/curriculum.svelte.ts';

// Calculates the best elimination off the main thread, so the page stays responsive.
self.onmessage = (event: MessageEvent<CurriculumObject>) => {
  self.postMessage(getBestEliminationIndices(Curriculum.fromObject(event.data)));
};
