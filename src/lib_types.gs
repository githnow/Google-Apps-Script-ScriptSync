/**
 * getScriptContent
 * @typedef {Object} ScriptJson
 * @property {Array.<EntityFileData>} files Array of objects with information about files.
 */
/**
 * addFileToUserJson
 * @typedef {Object} EntityFileData
 * @property {string}   id        Unique file id.
 * @property {string}   name      User-defined file name without extension.
 * @property {string}   type      File type (example, `'json'`, `'server_js'` or `'html'`).
 * @property {string}   source    Source-code or text content of the file.
 */
/**
 * getScriptFiles
 * @typedef {Object} ListItem
 * @property {string}   name      User-defined file name without extension.
 * @property {string}   type      File type (example, `'json'`, `'server_js'` or `'html'`).
 */
