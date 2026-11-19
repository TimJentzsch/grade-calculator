import { parseNotenspiegel } from './parse.ts';
import { extractTextItems } from './pdf-text.ts';
import type { NotenspiegelWorkerResponse } from './read-notenspiegel.ts';

// Reads the PDF off the main thread, so the page stays responsive.
// The PDF library is only loaded here, so it is not part of the main bundle.
self.onmessage = (event: MessageEvent<ArrayBuffer>) => {
  let response: NotenspiegelWorkerResponse;
  try {
    response = {
      notenspiegel: parseNotenspiegel(extractTextItems(new Uint8Array(event.data))),
    };
  } catch (error) {
    response = { error: error instanceof Error ? error.message : String(error) };
  }
  self.postMessage(response);
};
