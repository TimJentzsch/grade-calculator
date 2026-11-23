import { NotenspiegelParseError, parseNotenspiegel } from './parse.ts';
import { extractTextItems, PdfReadError } from './pdf-text.ts';
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
    response = {
      reason:
        error instanceof PdfReadError
          ? 'not-pdf'
          : error instanceof NotenspiegelParseError
            ? error.reason
            : 'failed',
      error: error instanceof Error ? error.message : String(error),
    };
  }
  self.postMessage(response);
};
