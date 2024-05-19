/**
 * ScriptSync Library
 * @version 2.0.6
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
 * Undo any non-committed changes in the instance.
 * @memberof {ScriptSync}
 * @returns {ScriptSync}
 */
function drop() { return this._drop(...arguments) }
ScriptSync.prototype.drop = function(...args) { return drop.apply(this,[...args]) };


/**
 * ### This function makes changes to the current script file!
 * Save changes in the user script file.
 * @memberof {ScriptSync}
 * @param {boolean}   ignoreErrors  **optional**: Whether to perform a forced 
 *                                  commit operation, even in case of errors.
 *                                  Default - true.
 * @returns {boolean} Result of the function execution.
 */
function commit(ignoreErrors=true) { return this._commit(...arguments) }
ScriptSync.prototype.commit = function(...args) { return commit.apply(this,[...args]) };


/**
 * Get the changes in a user script file.
 * @memberof {ScriptSync}
 * @param {number}    slice_number  **optional**: Trim source code for viewing.
 *                                  Number of characters to display.
 * @returns {Object}
 */
function getChanges(slice_number) { return this._getChanges(...arguments) }
ScriptSync.prototype.getChanges  = function(...args) { return getChanges.apply(this,[...args]) };


/**
 * Shows the changes in a user script file.
 * @memberof {ScriptSync}
 * @param {number}    slice_number  **optional**: Trim source code for viewing.
 *                                  Number of characters to display.
 * @returns {ScriptSync}
 */
function viewChanges(slice_number) { return this._viewChanges(...arguments) }
ScriptSync.prototype.viewChanges = function(...args) { return viewChanges.apply(this,[...args]) };


// ► ╒═════════════════════════╕
// ► │ ═  FILE OPERATIONS  ═ │
// ► ╘═════════════════════════╛

// *** READ ***
/**
 * Compares the content of two files.
 * @memberof {ScriptSync}
 * @param {string}    fn1           The name of the file 1 (default, in the template script).
 * @param {string}    fn2           The name of the file 2 (default, in the user script).
 * @param {string}    compare_to    __optional__:
 * Defines the source for comparison:
 * - `script` - compare files in the user script.
 * - `template` - compare files in the template script.
 * - (default, template file to script file)
 * @returns {boolean} True if the contents are equal, false otherwise.
 */
function compareFilesByContent(fn1, fn2, compare_to) { return this._compareFilesByContent(...arguments) }
ScriptSync.prototype.compareFilesByContent = function(...args) { return compareFilesByContent.apply(this,[...args]) };


/**
 * Retrieves a JSON file from a template.
 * @memberof {ScriptSync}
 * @param {string}    fn            The name of the Id of the script file that needs to be updated.
 * @param {boolean}   sourceOnly    **optional**: Retrieves source only. Default - true.
 *                                  If true, source will be marked `// No data.` if source is empty.
 * @throws {Error}                  File was not found inside the template script.
 * 
 * @return {string|EntityFileData}  If `sourceOnly` is true, returns the source property of 
 *                                  the file data. Otherwise, returns the entire file data.
 */
function getFileFromTemplate(fn, sourceOnly=true) { return this._jsonGetFileFromTemplate(...arguments) }
ScriptSync.prototype.getFileFromTemplate = function(...args) { return getFileFromTemplate.apply(this,[...args]) };


// *** WRITE ***
/**
 * ### Description
 * Adds a new file from a template to the current script.
 * If the file exists, it will be updated.
 * 
 * Sets an error flag in case of failure.
 * @memberof {ScriptSync}
 * @param {string}      fromFileName      Filename (in template script) from which the new data is copied.
 * @param {string}      toFileName        **optional**: Filename (in this script) to which the new data is being copied.
 *                                        If empty, the file name specified in the remote script is used.
 * @param {boolean}     throwWithError    **optional**: Interrupt with an error. Default - false.
 * @throws {Error}      If cannot add the file to user script (if 'throwWithError' is enabled).
 * @returns {ScriptSync}
 */
function AddNewFile(fromFileName, toFileName, throwWithError=false) { return this._AddNewFile(...arguments) }
ScriptSync.prototype.AddNewFile = function(...args) { return AddNewFile.apply(this,[...args]) };


/**
 * Renames a file in the file object.
 * 
 * Sets an error flag in case of failure.
 * @memberof {ScriptSync}
 * @param {string}    fn              The name of the file to rename.
 * @param {string}    toFn            The new name of the file.
 * @param {string}    extension       **optional**: The file extension, if it needs to be changed. \
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
 * @param {string}    extension       **optional**: The file extension if needed. \
 *                                    (`'json'`, `'gs'` or `'html'`)
 * @param {string}    custom_source   Source code.
 * @returns {ScriptSync}
 */
function setCustomSource(fn, extension, custom_source) { return this._setCustomSource(...arguments) }
ScriptSync.prototype.setCustomSource = function(...args) { return setCustomSource.apply(this,[...args]) };


/**
 * Delete a file in the file object.
 * @memberof {ScriptSync}
 * @param {string}    fn              The name of the file to delete.
 * @param {string}    extension       **optional**: The file extension, if it needs. \
 *                                    (`'json'`, `'gs'` or `'html'`)
 * @returns {ScriptSync}
 */
function deleteFile(fn, extension) { return this._deleteFile(...arguments) }
ScriptSync.prototype.deleteFile = function(...args) { return deleteFile.apply(this,[...args]) };


// *** ADVANCED ***
/**
 * Set whole the source a file in the user script object.
 * @memberof {ScriptSync}
 * @param {string}          savedFileName     The filename inside the script file that needs to be updated or added.
 * @param {EntityFileData}  newJson           The new file that will be added to target script file.\
 * __EntityFileData__:
 *  - {string}  **id**      Unique file id.
 *  - {string}  **name**    User-defined file name without extension.
 *  - {string}  **type**    File type (example, `'json'`, `'server_js'` or `'html'`).
 *  - {string}  **source**  Source-code or text content of the file.
 * 
 * @returns {boolean}       Result of the function execution.
 */
function addFileToUserJson(savedFileName, newJson) { return this._addFileToUserJson(...arguments) }
ScriptSync.prototype.addFileToUserJson = function(...args) { return addFileToUserJson.apply(this,[...args]) };


/**
 * Retrieves information about a library based on its ID or user-defined name.
 * @memberof {ScriptSync}
 * @param {string} target         - The target environment, either '**script**' or '**template**'.
 *                                  This determines whether to fetch information from the
 *                                  script or the template file.
 * @param {string} libraryId      - __Optional__: The unique identifier of the library to retrieve.
 *                                  If provided, the function will search for a library with
 *                                  this ID.
 * @param {string} libraryName    - __Optional__: The user-defined name (userSymbol) of the library to retrieve.
 *                                  If provided, the function will search for a library with
 *                                  this user-defined name.
 * @returns {LibraryInfo|null}    - Returns an object containing information about the library
 *                                  if found, or null if the library is not found.
 */
function getLibraryInfo(target, libraryId, libraryName) { return this._getLibraryInfo(...arguments) }
ScriptSync.prototype.getLibraryInfo = function(...args) { return getLibraryInfo.apply(this,[...args]) };


/**
 * Update library information.
 * @memberof {ScriptSync}
 * @param {LibraryInfo} libraryInfo   - A structured JSON object: `{ userSymbol: 'string', 
 *                                      libraryId: 'string', version: 'number', 
 *                                      developmentMode: boolean }`.\
 *                                      It will be used to update the library information.
 * @param {string}      libraryId     - The unique ID of the library.\
 *                                      __Optional parameter__. If this parameter is provided, 
 *                                      it will be used to identify the library in the update process.
 * @param {string}      libraryName   - User-defined library name (userSymbol).\
 *                                      __Optional parameter__. If '`libraryId`' is not provided, 
 *                                      and this parameter is present, it will be used 
 *                                      to identify the library in the update process.
 * @returns {ScriptSync}                Returns an instance of ScriptSync for method chaining.
 */
function updateLibraryInfo(libraryInfo, libraryId, libraryName) { return this._updateLibraryInfo(...arguments) }
ScriptSync.prototype.updateLibraryInfo = function(...args) { return updateLibraryInfo.apply(this,[...args]) };

