/**
 * @name ScriptSync
 * @version 2.0.4
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
 * Returns a list of the script files.
 * 
 * @public LIB User execution
 * @param {string}              scriptId        **optional**: The script project's ID (script file_id).
 *                                              Default - current script.
 * @throws {Error}                              If the script file is not found or there 
 *                                              is an error fetching the content.
 * @return {Array.<ListItem>}   Array of objects.
 */
function getScriptFiles(scriptId) {
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
function getTemplateScriptFiles(launchedFromScript=false) {
  if ( !launchedFromScript ) throw new Error("Parameter is not defined.");
  return getScriptFiles(getRemoteScriptId_());
}


/**
 * Saves file with code examples in the user script.
 * **The function makes changes to the current script file!**
 * @name _
 */
function IO_GetSamples() {
  const fn = 'examples';
  const samples = assignTemplate(getRemoteScriptId_());
  samples._AddNewFile(fn)
    ._renameFile(fn, 'lib_example', 'gs')
    ._viewChanges(10)
    ._commit(false);
}
