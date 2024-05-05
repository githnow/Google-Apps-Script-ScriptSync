/**
 * @name ScriptSync
 * @version 1.0
 * @description This script performs an update, 
 * adding new files from the template project 
 * to the current user script.
 * @author https://t.me/sergnovi
 * @see https://github.com/githnow
 */
function __init__() {}

/**
 * ### Description
 * Gets script file content.
 * 
 * @param {string}          scriptId          The script project's ID (script file_id), 
 *                                            from which the content will be received.
 * @throws {Error}                            If the script file is not found or there 
 *                                            is an error fetching the content.
 * @return {ScriptJson}     Content of the script (parsed to ScriptJson).
 */
function getScriptContent(scriptId) {
  const url = `https://script.google.com/feeds/download/export?id=${scriptId}&format=json`;
  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken(),
    },
    muteHttpExceptions: false,
  });

  return JSON.parse(response.getContentText());
}


/**
 * Sending the new contents of the script file.
 * 
 * @name _
 * @param {string}          scriptId          Id of the script file that needs to be updated.
 * @param {ScriptJson}      updatedContent    New content of the script file.
 * 
 * @return {boolean}        Update result.
 */
function updateScriptContentV3(scriptId, updatedContent) {
  const url = `https://www.googleapis.com/upload/drive/v2/files/${scriptId}?uploadType=media`;
  const options = {
    method: "put",
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    },
    muteHttpExceptions: false,
    contentType: "application/vnd.google-apps.script+json",
    payload: JSON.stringify(updatedContent)
  };

  let result = false;
  var response;

  try {
    response = UrlFetchApp.fetch(url, options);
    const status_code = response.getResponseCode();
    if (status_code == 200) {
      L("The contents of the script file have been successfully updated.");
      result = true;
    } else {
      LW("Result is not ordinary. Status code:", status_code);
      LW_(JSON.stringify(response.getContentText()));
    }
  } catch {
    LE("An error occurred while updating the contents of the script file.");
  }

  return result;
}


/**
 * Retrieves source of file inside the script file.
 * 
 * @name _
 * @param {string}          scriptId          Id of the script file that needs to be updated.
 * @param {string}          fileName          The name of the Id of the script file that needs to be updated.
 * @param {boolean}         returnSourceOnly  **optional**: New content of the script file. Default - true.
 * @throws {Error}                            File was not found inside the template script.
 * 
 * @return {EntityFileData|string}            If `returnSourceOnly` is true, returns the source property of 
 *                                            the file data. Otherwise, returns the entire file data.
 */
function getSourceDataFromTemplate(scriptId, fileName, returnSourceOnly=true) {
  if (!fileName && !scriptId) throw new Error("File name is not defined.");

  const scriptContent = getScriptContent(scriptId);

  // Find the file inside the json by its name
  var entitiesData = scriptContent.files.find(file => {
    return file.name === fileName 
  });

  // Check if the file is found
  if (!entitiesData) {
    throw new Error(`No such the file name: '${fileName}'`);
  } else {
    if (!entitiesData.source) {
      LW(`File '${fileName}' on the template scpipt is blank.`);
      if (returnSourceOnly) entitiesData.source = "// No data.";
    }
  }

  return returnSourceOnly ? entitiesData.source : (delete entitiesData.id, entitiesData);
}


/**
 * Replaces the source code in the file inside the target script with a new one.
 * 
 * The function only prepares a new script file without making changes!
 * 
 * @name _
 * @param {string}          scriptId          Target Id of the script file that needs to be updated.
 * @param {string}          fileName          The filename inside the script file that needs to be updated.
 * @param {string}          newJsonSource     New source content data from template script file (EntityFileData.source).
 * @throws {Error}                            File was not found inside the target script or the source was empty.
 * 
 * @return {ScriptJson}                       New ScriptJson with the updated source code.
 */
function modifySourceDataObject(scriptId, fileName, newJsonSource) {
  if (!scriptId || !fileName || !newJsonSource) throw new Error("Parameter is not defined.");

  var scriptContent = getScriptContent(scriptId);

  // Find the file inside the json by its name
  var entitiesData = scriptContent.files.find(file => {
    return file.name === fileName;
  });

  // Check if the file is found
  if (entitiesData) {
    // Modify the contents of the "source" property in json_data
    entitiesData.source = newJsonSource;
    L("The source code of the '%s' file will be updated", fileName);
  } else {
    let error_msg = `File '${fileName}' was not found in entries of the ID: ${scriptId} or file is blank.`;
    error_msg += "\nUse 'IO_AddNewFile' method instead this.";
    throw new Error(error_msg);
  }

  return scriptContent;
}


/**
 * Replaces the target script file with a new one.
 * 
 * The function only prepares a new script file without making changes!
 * 
 * @name _
 * @param {string}          scriptId          Target Id of the script file that needs to be updated.
 * @param {string}          savedFileName     The filename inside the script file that needs to be updated.
 * @param {EntityFileData}  newJson           The new file that will be added to target script file.
 * 
 * @return {ModResult}                        Object with a new ScriptJson and added file.
 */
function modifyOrAddFileToDataObject(scriptId, savedFileName, newJson) {
  if (!scriptId || !savedFileName || !newJson) throw new Error("Parameter is not defined.");
  
  let result = { result: false, isAdd: undefined, data: "" };

  try {
    var scriptContent = getScriptContent(scriptId);

    // Find INDEX of the file inside the json by its name
    const fileIndex = scriptContent.files.findIndex(file => {
      return file.name === savedFileName;
    });

    if (fileIndex === -1) {
      // If file is not found, create a new entry
      newJson.name = savedFileName;
      scriptContent.files.push(newJson);
      result.isAdd = true;
      L("File '%s' will be added", savedFileName);
    } else {
      // Modify the contents of the "source" property in json_data
      scriptContent.files[fileIndex].source = newJson.source;
      result.isAdd = false;
      L("File '%s' will be updated", savedFileName);
    }

    result.data = scriptContent;
    result.result = true;

  } catch (e) {
    LE(e.message);
  }

  return result;
}


/**
 * Returns a list of the script files.
 * 
 * @public LIB User execution
 * @param {string}              scriptId        **optional**: The script project's ID (script file_id).
 *                                              Default - current script.
 * @throws {Error}                              If the script file is not found or there 
 *                                              is an error fetching the content.
 * @return {Array.<ListItem>}   Array of objects.
 */
function IO_GetScriptFiles(scriptId) {
  var scriptFiles = [];
  try {
    scriptId = scriptId || ScriptApp.getScriptId();
    var scriptContent = getScriptContent(scriptId);
    if (scriptContent) {
      scriptContent.files.forEach(function(file) {
        scriptFiles.push({
          'file': file.name,
          'type': file.type
        });
      });
    }
  } catch (e) {
    throw new Error("Error getting script content: " + e.message);
  }

  return scriptFiles;
}


/**
 * Returns a list of the template script files.
 * 
 * @public LIB User execution
 * @throws {Error}                              If the script file is not found or there 
 *                                              is an error fetching the content.
 * @return {Array.<ListItem>}   Array of objects.
 */
function IO_GetTemplateScriptFiles(launchedFromScript=false) {
  if ( !launchedFromScript ) throw new Error("Parameter is not defined.");
  return IO_GetScriptFiles(getRemoteScriptId_());
}


/**
 * Updates any file of the current script from a template script file.
 * 
 * **The function makes changes to the current script file!**
 * 
 * @public LIB User execution
 * @param {string}        fromFileName        Filename (in template script) from which the new data is copied.
 * @param {string}        toFileName          **optional**: Filename (in this script) to which the new data is being copied.
 *                                            If empty, the file name specified in the remote script is used.
 * @param {string}        templateScriptId    **optional**: Script file_id from where to copy the file. Default value is 
 *                                            defined by the library if it is empty.
 *                                            You can get ScriptId: `ScriptApp.getScriptId()`.
 * 
 * @return {boolean}      Result of the function execution.
 */
function IO_UpdateFile(fromFileName, toFileName, templateScriptId) {
  if (!fromFileName) {
    LE("Value of 'fromFileName' parameter is not defined.");
    return false;
  }

  let result = false;
  const user_file_name = toFileName || fromFileName;

  try {
    // New project (user) file of the SCRIPT which will be modified
    const user_script_id  = ScriptApp.getScriptId();

    // Template data file
    const source_script_id = templateScriptId || getRemoteScriptId_() || '';
    const source_file_name = fromFileName;
    var source_file_data = getSourceDataFromTemplate(source_script_id, source_file_name);

    // Modified script data of the user_script_id
    const receiverData = modifySourceDataObject(user_script_id, user_file_name, source_file_data);

    if (receiverData) {
      result = updateScriptContentV3(user_script_id, receiverData);
    } else {
      LE("Something went wrong. Check the current script file.");
    }
  } catch(e) {
    LE(e.message);
  } finally {
    if (result) {
      L("File '%s' succefully updated. Reload the tab.", user_file_name);
    } else {
      LW("Nothing changed. Please check the source file and permissions.");
    }
  }

  return result;
}


/**
 * Adds a new file from a template to the current script. from another third-party script.
 * If the file exists, it will be updated.
 * 
 * **The function makes changes to the current script file!**
 * 
 * @public LIB User execution
 * @param {string}        fromFileName        Filename (in template script) from which the new data is copied.
 * @param {string}        toFileName          **optional**: Filename (in this script) to which the new data is being copied.
 *                                            If empty, the file name specified in the remote script is used.
 * @param {string}        templateScriptId    **optional**: Script file_id from where to copy the file. Default value is 
 *                                            defined by the library if it is empty.
 *                                            You can get ScriptId: `ScriptApp.getScriptId()`.
 * 
 * @return {boolean}      Result of the function execution.
 * 
 */
function IO_AddNewFile(fromFileName, toFileName, templateScriptId) {
  if (!fromFileName) {
    LE("Value of 'fromFileName' parameter is not defined.");
    return false;
  }

  let result = false;
  var receiverData = {};

  try {
    // New project (user) file of the SCRIPT which will be modified
    const user_script_id = ScriptApp.getScriptId();
    const user_file_name = toFileName || fromFileName;

    // Template data file
    const source_script_id = templateScriptId || getRemoteScriptId_() || '';
    const source_file_name = fromFileName;
    var source_file_data_j = getSourceDataFromTemplate(source_script_id, source_file_name, false);

    // Modified script data of the user_script_id
    receiverData = modifyOrAddFileToDataObject(user_script_id, user_file_name, source_file_data_j);

    // checking
    if (receiverData?.data && receiverData?.result === true) {
      result = updateScriptContentV3(user_script_id, receiverData.data);
    } else {
      LE("Something went wrong. Check the current script file.");
    }
  } catch(e) {
    LE(e.message);
  } finally {
    if (result) {
      if(receiverData.isAdd) L("File '%s' succefully added. Reload the tab.", user_file_name);
      if(!receiverData.isAdd) L("File '%s' succefully updated. Reload the tab.", user_file_name);
    } else {
      LW("Nothing changed. Please check the source file and permissions.");
    }
  }

  return result;
}


