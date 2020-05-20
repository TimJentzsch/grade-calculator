/**
 * Merges an array of arrays.
 * @param {T[][]} arrays - The array of arrays to merge.
 * @returns {T[]} - The merged array.
 * @template T
 */
// eslint-disable-next-line import/prefer-default-export
export function merge(arrays) {
  return [].concat(...arrays);
}
