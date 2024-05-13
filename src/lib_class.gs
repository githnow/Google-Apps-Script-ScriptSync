/**
 * ScriptSync Library
 * @version 2.0.5
 * @description This script performs an update, 
 * adding new files from the template project 
 * to the current user script.
 * @author https://t.me/sergnovi
 * @see https://github.com/githnow
 */

/**
 * Sets the ID of the template script as the data source.
 * If no ID is provided, retrieves the ID from the library.
 * @param {string}  [template_script_id]  **optional**: Script file_id from where to copy the file.
 * Default value is defined by the library if it is empty. You can get ScriptId: `ScriptApp.getScriptId()`.
 * @returns {ScriptSync}  An instance of ScriptSync.
 */
function assignTemplate(template_script_id) {
    return new ScriptSync(template_script_id || getRemoteScriptId_());
}


/**
 * @global
 * @class
 */
class ScriptSync {
  /**
   * @constructor
   */
  constructor(template_script_id) {
    /** @private */
    this.template_script_id = template_script_id || null;
    /** @private */
    this.template_json_file = this._getScriptContent(template_script_id);
    
    /** @private */
    this.user_script_id = ScriptApp.getScriptId();
    /** @private */
    this.user_json_file = this._getScriptContent(this.user_script_id);
    
    /** @private */
    this.changes = [];
    /** @private */
    this.backup_json = JSON.parse(JSON.stringify(this.user_json_file));
    if(!(this.template_script_id || this.user_script_id)) throw new Error("Cannot access to script files.");

    this.result = true;
  }


  // ► ╒════════════════╕
  // ► │ ══ GENERAL ══ │
  // ► ╘════════════════╛

  /**
   * Returns current script_id of the template.
   * @public LIB User execution
   * @returns {string} template_script_id.
   */
  _getTemplateId() {
    return (this.template_script_id === getRemoteScriptId_()
        ? `${getRemoteScriptId_().slice(0, 10)}***`
        : this.template_script_id
    );
  };

  /**
   * Undo any non-committed changes in files.
   * @public LIB User execution
   * @returns {ScriptSync}
   */
  _drop() {
    this.user_json_file =  JSON.parse(JSON.stringify(this.backup_json));
    this.changes = [];
    this.result = true;
    L("Changes reverted.");
    return this;
  }

  /**
   * **This function makes changes to the current script file!**
   * Save changes in the user script file.
   * @public LIB User execution
   * @param {boolean}   ignoreErrors  Whether to perform a forced commit 
   *                                  operation, even in case of errors.
   * @returns {boolean} Result of the function execution.
   */
  _commit(ignoreErrors=true) {
    const doCommit = (
      !ignoreErrors
        ? ( this.result 
          ? this.request(this.user_script_id, JSON.stringify(this.user_json_file))
          : (LE('Some previous operations have failed. No commit.'), false)
        )
        : this.request(this.user_script_id, JSON.stringify(this.user_json_file))
    );
    this.result = true;
    if (doCommit)
      L('All changes successfully applied. Reload the tab.');

    return doCommit;
  }

  /**
   * Get the changes in a user script file.
   * @public LIB User execution
   * @param {number}    slice_number  Trim source code for viewing.
   *                                  Number of characters to display.
   * @returns {Object}
   */
  _getChanges(slice_number) {
    let scriptContent = {...this.user_json_file};
    let scriptFiles = [];

    if (scriptContent.files) {
      scriptContent.files.forEach(function(file) {
        scriptFiles.push({
          'id'  : file.id || '',
          'name': file.name,
          'type': file.type,
          'source': file.source 
            ? ( slice_number && file.source.length > slice_number
                ? `Cropped: ${file.source.slice(0, slice_number)}...`
                : file.source
              )
            : ''
        });
      });
    }
    scriptContent.files = scriptFiles;
    
    return {
        errors: !this.result,
        content: JSON.stringify(scriptContent, null, 2),
        changes: JSON.stringify(this.changes)
    };
  }

  /**
   * Shows the changes in a user script file.
   * @public LIB User execution
   * @param {number}    slice_number  Trim source code for viewing.
   *                                  Number of characters to display.
   * @returns {ScriptSync}
   */
  _viewChanges(slice_number) {
      const changes = this._getChanges(slice_number);
      L("Script content:", changes.content);
      L("Changes:", changes.changes);
      return this;
  }


  // ► ╒═════════════════════════╕
  // ► │ ═  FILE OPERATIONS  ═ │
  // ► ╘═════════════════════════╛

  // *** READ ***
  /**
   * ### Description
   * Returns script file content.
   * @public LIB User execution
   * @param {string} script_id  The script project's ID (script file_id),
   *                            from which the content will be received.
   * @throws {Error}            If the script file is not found or there is an error fetching.
   * @returns {ScriptJson}      Content of the script (parsed to ScriptJson).
   */
  _getScriptContent(script_id) {
    return this.request(script_id);
  }

  /**
   * Compares the content of two files.
   * @public LIB User execution
   * @param {string}    fn1             The name of the file 1 (default, in the template script).
   * @param {string}    fn2             The name of the file 2 (default, in the user script).
   * @param {string}    [compare_to]    Compare into:
   *                                    - `script` - compare files in the user script.
   *                                    - `template` - compare files in the template script.
   *                                    - (default, template file to script file)
   * @returns {boolean} True if the contents are equal, false otherwise.
   */
  _compareFilesByContent(fn1, fn2, compare_to) {
      let file1, file2;
      switch (compare_to) {
        case 'script':
          file1 = this.user_json_file.files.find(file => file.name === fn1);
          file2 = this.user_json_file.files.find(file => file.name === fn2);
          break;
        case 'template':
          file1 = this.template_json_file.files.find(file => file.name === fn1);
          file2 = this.template_json_file.files.find(file => file.name === fn2);
          break;
        default:
          file1 = this.template_json_file.files.find(file => file.name === fn1);
          file2 = this.user_json_file.files.find(file => file.name === fn2);
      }
      
      if (!(file1 && file2)) {
        let missingFile = !file1 ? fn1 : '';
        missingFile += !file2 ? (missingFile ? `' and '${fn2}`: fn2) : '';
        LE(`One or both files '${missingFile}' were not found.`);
        L("Please use the `ScriptSync.getScriptFiles()` function to get the list of files.");
        return false;
      }
      const match = file1.source === file2.source;
      match
        ? L(`Contents of '${fn1}' and '${fn2}' are the same.`)
        : L(`Contents of '${fn1}' and '${fn2}' are different.`)

      return match;
  }

  // *** WRITE ***
  /**
   * ### Description
   * Adds a new file from a template to the current script. from another third-party script.
   * If the file exists, it will be updated.
   * 
   * Sets an error flag in case of failure.
   * @public LIB User execution
   * @param {string}      fromFileName      Filename (in template script) from which the new data is copied.
   * @param {string}      [toFileName]      **optional**: Filename (in this script) to which the new data is being copied.
   *                                        If empty, the file name specified in the remote script is used.
   * @param {boolean}     [throwWithError]  Interrupt with an error. Default - false.
   * @throws {Error}      If cannot add the file to user script (if 'throwWithError' is enabled).
   * @returns {ScriptSync}
   */
  _AddNewFile(fromFileName, toFileName, throwWithError=false) {
    if (!fromFileName) {
      throw new Error("Value of 'fromFileName' parameter is not defined.");
    }
    var receiverData = {};
    try {
      // new project (user) file of the SCRIPT which will be modified
      const user_file_name = toFileName || fromFileName;

      // template data file
      const source_file_name = fromFileName;
      const source_file_data_j = this._jsonGetFileFromTemplate(source_file_name, false);

      // modified script data of the user_script_id
      receiverData = this._addFileToUserJson(user_file_name, source_file_data_j);
    } catch(e) {
      LE(e.message);
    }
    
    if (!receiverData) {
      this.result = false;
      if (throwWithError) throw new Error("Data of the receiver was not found.");
    }

    return this;
  }

  /**
   * Renames a file in the file object.
   * 
   * Sets an error flag in case of failure.
   * @public LIB User execution
   * @param {string}    fn              The name of the file to rename.
   * @param {string}    toFn            The new name of the file.
   * @param {string}    [extension]     The file extension, if it needs to be changed. \
   *                                    (`'json'`, `'gs'` or `'html'`)
   * @returns {ScriptSync}
   */
  _renameFile(fn, toFn, extension) {
    if (!fn) throw new Error("Filename is not defined.");
    if (extension === 'gs') extension = 'server_js';
    const fileIndex = this.user_json_file.files.findIndex(file => {
        return file.name === toFn
    });

    if (fileIndex === -1) {
      var entitiesData = this.user_json_file.files.find(file => {
          return file.name === fn
      });
      if (entitiesData) {
        const renamed_ext = fileTypes.get(extension)
          || extension
          || fileTypes.get(entitiesData.type)
          || entitiesData.type;
        const msg_text = (
          `File '${fn}.${fileTypes.get(entitiesData.type)||entitiesData.type}' `+
          `will be renamed to '${toFn}.${renamed_ext}'.`
        );
        this.changes.push(msg_text);
        L(msg_text);
        entitiesData.name = toFn;
        entitiesData.type = extension ? extension : entitiesData.type;
      } else {
        this.result = false;
        LW(`File '${fn}' was not found.`);
      }
    } else {
      this.result = false;
      LE(`File '${toFn}' is exists in the user script. Set a different name.`);
    }

    return this;
  }

  /**
   * Delete a file in the file object.
   * @public LIB User execution
   * @param {string}    fn              The name of the file to delete.
   * @param {string}    [extension]     The file extension, if it needs. \
   *                                    (`'json'`, `'gs'` or `'html'`)
   * @returns {ScriptSync}
   */
  _deleteFile(fn, extension) {
    if (!fn) throw new Error("Value of 'fn' parameter is not defined.");
    if (extension === 'gs') extension = 'server_js';
    const fileIndex = this.user_json_file.files.findIndex(file => {
        return file.name === fn && (extension ? file.type === extension : true)
    });

    const ext = extension ? `.${fileTypes.get(extension) || extension}` : '';

    if (fileIndex !== -1) {
        this.user_json_file.files.splice(fileIndex, 1);
        const msg_text = `File '${fn}${ext}' will be deleted.`;
        this.changes.push(msg_text);
        L(msg_text);
    } else {
        LW(`File '${fn}${ext}' was not found.`);
    }

    return this;
  }

  /**
   * Creates a blank file for further processing.
   * @public LIB User execution
   * @param {string}    fn              Filename in the user script.
   * @param {string}    extension       The file extension. \
   *                                    (`'json'`, `'gs'` or `'html'`)
   * @returns {ScriptSync}
   */
  _createBlankFile(fn, extension) {
    if (!fn) throw new Error("File name is not defined.");
    if (!extension) throw new Error("Extension is not defined.");

    if (extension === 'gs') extension = 'server_js';

    // find the file inside the json by its name
    var entitiesData = this.user_json_file.files.find(file => {
      return file.name === fn
    });

    // check if the file is found
    if (!entitiesData) {
      this.user_json_file.files.push({
        id: '', name: fn, type: extension, source: ''
      })
      this.changes.push(`Blank file '${fn}.${fileTypes.get(extension)||extension}' will be added.`);
    } else {
      LW(`File '${fn}' already exists.`);
    }

    return this;
  }

  /**
   * Sets a custom data source for the script file.
   * @public LIB User execution
   * @param {string}    fn              Filename in the user script.
   * @param {string}    [extension]     The file extension if needed. \
   *                                    (`'json'`, `'gs'` or `'html'`)
   * @param {string}    custom_source   Source code.
   * @returns {ScriptSync}
   */
  _setCustomSource(fn, extension, custom_source) {
    if (!fn) throw new Error("File name is not defined.");
    if (!custom_source) throw new Error("The source code is incorrect.");

    if (typeof(custom_source) === 'object') {
        custom_source = JSON.stringify(custom_source);
    } else if (typeof(custom_source) === 'function') {
        custom_source = custom_source.toString();
    }

    if (extension === 'gs') extension = 'server_js';

    // Find the file inside the json by its name
    var entitiesData = this.user_json_file.files.find(file => {
      return file.name === fn && (extension ? file.type === extension : true)
    });

    // Check if the file is found
    if (entitiesData) {
      entitiesData.source = custom_source;
      this.changes.push(`Custom source will be added to '${fn}' file.`);
    } else {
      LE(`File '${fn}' on the user script is not found.`);
    }

    return this;
  }

  // *** ADVANCED ***
  /**
   * Set whole the source a file in the user script object.
   * @public LIB User execution
   * @param {string}          savedFileName     The filename inside the script file that needs to be updated or added.
   * @param {EntityFileData}  newJson           The new file that will be added to target script file.
   * @returns {boolean}       Result of the function execution.
   */
  _addFileToUserJson(savedFileName, newJson) {
    if (!savedFileName || !newJson) throw new Error("Parameter is not defined.");
    
    let result = false;
    let newJson_ = { ...newJson };

    try {
      // Find INDEX of the file inside the json by its name
      const fileIndex = this.user_json_file.files.findIndex(file => {
        return file.name === savedFileName;
      });

      if (fileIndex === -1) {
        // If file is not found, create a new entry
        newJson_.name = savedFileName;
        this.user_json_file.files.push(newJson_);
        this.changes.push(`File '${savedFileName}' will be added.`);
        L("File '%s' will be added", savedFileName);
      }
      else {
        // Modify the contents of the "source" property in json_data
        this.user_json_file.files[fileIndex].source = newJson_.source;
        this.changes.push(`File '${savedFileName}' will be updated.`);
        L("File '%s' will be updated", savedFileName);
      }
      result = true;
    } catch (e) {
      LE(e.message);
    }

    return result;
  }

  /**
   * Retrieves a JSON file from a template.
   * @param {string}    fn            The name of the Id of the script file that needs to be updated.
   * @param {boolean}   [sourceOnly]  **optional**: New content of the script file. Default - true.
   * @throws {Error}                  File was not found inside the template script.
   * 
   * @return {string|EntityFileData}  If `sourceOnly` is true, returns the source property of 
   *                                  the file data. Otherwise, returns the entire file data.
   */
  _jsonGetFileFromTemplate(fn, sourceOnly=true) {
    if (!fn) throw new Error("File name is not defined.");

    // Find the file inside the json by its name
    var entitiesData = this.template_json_file.files.find(file => {
      return file.name === fn 
    });

    // Check if the file is found
    if (!entitiesData) {
      throw new Error(`No such file name in the template script: '${fn}'.`);
    } else {
      if (!entitiesData.source) {
        LW(`File '${fn}' on the template script is blank.`);
        if (sourceOnly) entitiesData.source = "// No data.";
      }
    }

    return sourceOnly ? entitiesData.source : (delete entitiesData.id, entitiesData);
  }


  // ► ╒════════════════╕
  // ► │ ══ PRIVATE ══ │
  // ► ╘════════════════╛

  /**
   * Makes a request to a server.
   * @private
   * @param {string}        script_id   The script project's ID (script file_id).
   * @param {ScriptJson}    [payload]   New content of the script file (if update needed).
   * @returns {UrlFetchApp.HTTPResponse|boolean} The response object or result.
   */
  request(script_id, payload) {
      const url = payload
          ? `https://www.googleapis.com/upload/drive/v2/files/${script_id}?uploadType=media`
          : `https://script.google.com/feeds/download/export?id=${script_id}&format=json`

      if (payload) JSON.stringify(payload);

      const options = {
          method: payload ? 'put' : 'get',
          headers: {
              Authorization: "Bearer " + ScriptApp.getOAuthToken()
          },
          muteHttpExceptions: true,
          contentType: payload ? 'application/vnd.google-apps.script+json' : 'application/json',
          payload
      };

      const response = UrlFetchApp.fetch(url, options);
      const status_code = response.getResponseCode();

      if (status_code == 200) {
          return !payload
            ? JSON.parse(response.getContentText())
            : true
      }
      else if (status_code == 403) {
          LW("Status code:", status_code);
          L("Make sure that you have added a dependency:");
          L(JSON.stringify({dependencies}, null, 2));
      }
      else {
          LW("Result is not ordinary. Status code:", status_code);
          LW(JSON.stringify(response.getContentText()));
      }
      this.result = this.result && false;
      return false;
  }
}

// for log changes
const fileTypes = new Map([
  ["server_js", "gs"],
  ["json", "json"],
  ["html", "html"],
]);

// for warning to user
const dependencies = {
  "enabledAdvancedServices": [
    {
      "userSymbol": "Drive",
      "serviceId": "drive",
      "version": "v3"
    },
  ]
}

