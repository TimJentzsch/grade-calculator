import type { Notenspiegel } from './parse.ts';

/** The message sent back by the worker. */
export type NotenspiegelWorkerResponse = { notenspiegel: Notenspiegel } | { error: string };

/**
 * Reads a Notenspiegel PDF in a web worker. The file never leaves the browser.
 * @param file The PDF exported from RWTH Online.
 * @returns The parsed Notenspiegel.
 * @throws {Error} With a message for the user if the file can't be read.
 */
export default async function readNotenspiegel(file: Blob): Promise<Notenspiegel> {
  const data = await file.arrayBuffer();

  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./notenspiegel.worker.ts', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event: MessageEvent<NotenspiegelWorkerResponse>) => {
      worker.terminate();
      if ('error' in event.data) {
        reject(new Error(event.data.error));
      } else {
        resolve(event.data.notenspiegel);
      }
    };

    worker.onerror = (event) => {
      worker.terminate();
      reject(new Error(`The Notenspiegel could not be read: ${event.message}`));
    };

    worker.onmessageerror = () => {
      worker.terminate();
      reject(new Error('The Notenspiegel could not be read.'));
    };

    // Transferred instead of copied, the main thread doesn't need it anymore
    worker.postMessage(data, [data]);
  });
}
