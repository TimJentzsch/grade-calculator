import type { Notenspiegel } from './parse.ts';

/** Why a Notenspiegel could not be read, to show a translated message. */
export type ReadErrorReason = 'not-pdf' | 'no-table' | 'empty-table' | 'failed';

/** The message sent back by the worker. */
export type NotenspiegelWorkerResponse =
  { notenspiegel: Notenspiegel } | { reason: ReadErrorReason; error: string };

/** Thrown if a Notenspiegel can't be read. */
export class NotenspiegelReadError extends Error {
  readonly reason: ReadErrorReason;

  constructor(reason: ReadErrorReason, message: string) {
    super(message);
    this.name = 'NotenspiegelReadError';
    this.reason = reason;
  }
}

/**
 * Reads a Notenspiegel PDF in a web worker. The file never leaves the browser.
 * @param file The PDF exported from RWTH Online.
 * @returns The parsed Notenspiegel.
 * @throws {NotenspiegelReadError} If the file can't be read.
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
        reject(new NotenspiegelReadError(event.data.reason, event.data.error));
      } else {
        resolve(event.data.notenspiegel);
      }
    };

    worker.onerror = (event) => {
      worker.terminate();
      reject(
        new NotenspiegelReadError('failed', `The Notenspiegel could not be read: ${event.message}`),
      );
    };

    worker.onmessageerror = () => {
      worker.terminate();
      reject(new NotenspiegelReadError('failed', 'The Notenspiegel could not be read.'));
    };

    // Transferred instead of copied, the main thread doesn't need it anymore
    worker.postMessage(data, [data]);
  });
}
