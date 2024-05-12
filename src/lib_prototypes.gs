/**
 * ScriptSync Library
 * @version 2.0.4
 * @description This script performs an update, 
 * adding new files from the template project 
 * to the current user script.
 * @author https://t.me/sergnovi
 * @see https://github.com/githnow
 */
// external calls for class methods
// ► ╒════════════════╕
// ► │ ══ GENERAL ══ │
// ► ╘════════════════╛

/**
 * Returns current script_id of the template.
 * @memberof {ScriptSync}
 * @returns {string} template_script_id.
 */
function getTemplateId() { return this._getTemplateId(...arguments) }
ScriptSync.prototype.getTemplateId = function(...args) { return getTemplateId.apply(this,[...args]) };


/**
 * Undo any non-committed changes in files.
 * @memberof {ScriptSync}
 * @returns {ScriptSync}
 */
function drop() { return this._drop(...arguments) }
ScriptSync.prototype.drop = function(...args) { return drop.apply(this,[...args]) };


/**
 * ### This function makes changes to the current script file!
 * Save changes in the user script file.
 * @memberof {ScriptSync}
 * @param {boolean}   forceCommit   Whether to perform a forced commit 
 *                                  operation, even in case of errors.
 * @returns {boolean} Result of the function execution.
 */
function commit(forceCommit=true) { return this._commit(...arguments) }
ScriptSync.prototype.commit = function(...args) { return commit.apply(this,[...args]) };


/**
 * Get the changes in a user script file.
 * @memberof {ScriptSync}
 * @param {number}    slice_number  Trim source code for viewing.
 *                                  Number of characters to display.
 * @returns {Object}
 */
function getChanges(slice_number) { return this._getChanges(...arguments) }
ScriptSync.prototype.getChanges  = function(...args) { return getChanges.apply(this,[...args]) };


/**
 * Shows the changes in a user script file.
 * @memberof {ScriptSync}
 * @param {number}    slice_number  Trim source code for viewing.
 *                                  Number of characters to display.
 * @returns {ScriptSync}
 */
function viewChanges(slice_number) { return this._viewChanges(...arguments) }
ScriptSync.prototype.viewChanges = function(...args) { return viewChanges.apply(this,[...args]) };


// ► ╒═════════════════════════╕
// ► │ ═  FILE OPERATIONS  ═ │
// ► ╘═════════════════════════╛

// *** WRITE ***
/**
 * ### Description
 * Adds a new file from a template to the current script. from another third-party script.
 * If the file exists, it will be updated.
 * @memberof {ScriptSync}
 * @param {string}      fromFileName      Filename (in template script) from which the new data is copied.
 * @param {string}      [toFileName]      **optional**: Filename (in this script) to which the new data is being copied.
 *                                        If empty, the file name specified in the remote script is used.
 * @param {boolean}     [throwWithError]  Interrupt with an error. Default - false.
 * @throws {Error}      If cannot add the file to user script (if 'throwWithError' is enabled).
 * @returns {ScriptSync}
 */
function AddNewFile(fromFileName, toFileName, throwWithError=false) { return this._AddNewFile(...arguments) }
ScriptSync.prototype.AddNewFile = function(...args) { return AddNewFile.apply(this,[...args]) };


/**
 * Renames a file in the file object.
 * @memberof {ScriptSync}
 * @param {string}    fn              The name of the file to rename.
 * @param {string}    toFn            The new name of the file.
 * @param {string}    [extension]     The file extension, if it needs to be changed. \
 *                                    (`'json'`, `'gs'` or `'html'`)
 * @returns {ScriptSync}
 */
function renameFile(fn, toFn, extension) { return this._renameFile(...arguments) }
ScriptSync.prototype.renameFile = function(...args) { return renameFile.apply(this,[...args]) };


/**
 * Creates a blank file for further processing.
 * @memberof {ScriptSync}
 * @param {string}    fn              Filename in the user script.
 * @param {string}    extension       The file extension. \
 *                                    (`'json'`, `'gs'` or `'html'`)
 * @returns {ScriptSync}
 */
function createBlankFile(fn, extension) { return this._createBlankFile(...arguments) }
ScriptSync.prototype.createBlankFile = function(...args) { return createBlankFile.apply(this,[...args]) };


/**
 * Sets a custom data source for the script file.
 * @memberof {ScriptSync}
 * @param {string}    fn              Filename in the user script.
 * @param {string}    [extension]     The file extension if needed. \
 *                                    (`'json'`, `'gs'` or `'html'`)
 * @param {string}    custom_source   Source code.
 * @returns {ScriptSync}
 */
function setCustomSource(fn, extension, custom_source) { return this._setCustomSource(...arguments) }
ScriptSync.prototype.setCustomSource = function(...args) { return setCustomSource.apply(this,[...args]) };


// *** ADVANCED ***
/**
 * Set whole the source a file in the user script object.
 * @param {string}          savedFileName     The filename inside the script file that needs to be updated or added.
 * @param {EntityFileData}  newJson           The new file that will be added to target script file.
 * @returns {boolean}       Result of the function execution.
 */
function addFileToUserJson(savedFileName, newJson) { return this._addFileToUserJson(...arguments) }
ScriptSync.prototype.addFileToUserJson = function(...args) { return addFileToUserJson.apply(this,[...args]) };
