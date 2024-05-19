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
/**
 * Library Info
 * @typedef {Object} LibraryInfo
 * @property {string}   userSymbol        User-defined library name.
 * @property {string}   libraryId         The unique library ID.
 * @property {string}   version           Version of the library.
 * @property {string}   developmentMode   The flag of development mode.
 */
