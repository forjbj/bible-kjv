/* tslint:disable */
/* eslint-disable */
/**
 * @param {number} test
 * @param {number} book
 * @returns {string}
 */
export function render(test: number, book: number): string;
/**
 * @param {number} searches
 * @param {string} inp
 * @param {number} acc
 * @returns {string}
 */
export function search(searches: number, inp: string, acc: number): string;
/**
 * @param {number} searches
 * @param {string} inp
 * @param {number} acc
 * @returns {string}
 */
export function search_book(searches: number, inp: string, acc: number): string;
/**
 * @returns {string}
 */
export function render_widget(): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly render: (a: number, b: number) => Array;
  readonly search: (a: number, b: number, c: number, d: number) => Array;
  readonly search_book: (a: number, b: number, c: number, d: number) => Array;
  readonly render_widget: () => Array;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
