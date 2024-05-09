/**
 * modifyOrAddFileToDataObject
 * @typedef {Object} ModResult
 * @property {boolean}      ModResult.result  Result of the function execution.
 * @property {boolean}      ModResult.isAdd   True if the file has been added, false - updated.
 * @property {ScriptJson}   ModResult.data    The new ScriptJson with the updated source code.
 */
/**
 * updateScriptContentV3
 * @typedef {Object} ScriptJson
 * @property {Array.<EntityFileData>} files Array of objects with information about files.
 */
/**
 * @typedef {Object} EntityFileData
 * @property {string}   id        Unique file id.
 * @property {string}   name      User-defined file name without extension.
 * @property {string}   type      File type (example, `'json'`, `'server_js'` or `'html'`).
 * @property {string}   source    Source-code or text content of the file.
 */

/**
 * IO_GetScriptFiles
 * @typedef {Object} ListItem
 * @property {string}   name      User-defined file name without extension.
 * @property {string}   type      File type (example, `'json'`, `'server_js'` or `'html'`).
 */
