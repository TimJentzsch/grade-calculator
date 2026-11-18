import { applyElimination, toEliminationCurriculum } from './elimination.ts';
import type Curriculum from './model/curriculum.svelte.ts';

/**
 * Calculates the best possible elimination for the given curriculum in a web worker,
 * so that the main thread is not blocked while the calculation runs.
 * @param curriculum The curriculum to calculate the elimination for. It is not modified.
 * @returns A copy of the curriculum with the best elimination applied.
 */
export default function runAutoElimination(curriculum: Curriculum): Promise<Curriculum> {
  const snapshot = curriculum.clone();

  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./elimination.worker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event: MessageEvent<number[]>) => {
      worker.terminate();

      applyElimination(snapshot, event.data);
      resolve(snapshot);
    };

    worker.onerror = (event) => {
      worker.terminate();
      reject(new Error(`Elimination worker failed: ${event.message}`));
    };

    worker.onmessageerror = () => {
      worker.terminate();
      reject(new Error('Elimination worker sent an unreadable message'));
    };

    worker.postMessage(toEliminationCurriculum(snapshot));
  });
}
