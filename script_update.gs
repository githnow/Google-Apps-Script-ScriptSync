function getScriptContent(fileID) {
  const url = "https://script.google.com/feeds/download/export?id=" + fileID + "&format=json";
  const response = UrlFetchApp.fetch(url, {
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    }
  });

  return response.getContentText();
}


function updateScriptContentV3(fileId, updatedContent) {
  const options = {
    method: "put",
    headers: {
      Authorization: "Bearer " + ScriptApp.getOAuthToken()
    },
    contentType: "application/vnd.google-apps.script+json",
    payload: updatedContent
  };

  const response = UrlFetchApp.fetch("https://www.googleapis.com/upload/drive/v2/files/" + fileId + "?uploadType=media", options);

  if (response.getResponseCode() == 200) {
    Logger.log("The contents of the script file have been successfully updated.");
    return true;
  } else {
    Logger.log("An error occurred while updating the contents of the script file.");
    return false;
  }
}


function getSourceDataFromFile(fileId='', fileName) {
  if (!fileName) throw new Error("File name is not defined.")

  fileId = fileId ? fileId : ScriptApp.getScriptId();
  var scriptContent = getScriptContent(fileId);
  var json_data = JSON.parse(scriptContent);

  // Find the file inside the json by its name
  var entitiesData = json_data.files.find(function(file) {
    return file.name === fileName;
  });

  // Check if the file is found
  if (!entitiesData.source) {
    console.log(`File ${fileName} was not found in entries the ID ${fileId}.`);
    return false;
  }
  
  return entitiesData.source;

}

function getDataById(fileId='', checkFileName='') {
  if (!fileId) throw new Error("File id is not defined.");

  const scriptContent = getScriptContent(fileId);
  var json_data = JSON.parse(scriptContent);

  if (checkFileName) {
    // Find the file inside the json by its name
    var entitiesData = json_data.files.find(function(file) {
      return file.name === checkFileName;
    });

    // Check if the file is found
    if (!entitiesData.source) {
      console.log(`File ${checkFileName} was not found in entries the ID ${fileId}.`);
      return false;
    }
  }

  return json_data;

}


function modifySourceDataObject(fileId='', fileName='', newJsonSource) {
  if (!fileId || !fileName || !newJsonSource) throw new Error("Parameter is not defined.");

  try {
    
    const scriptContent = getScriptContent(fileId);
    var json_data = JSON.parse(scriptContent);

    // Find the file inside the json by its name
    var entitiesData = json_data.files.find(function(file) {
      return file.name === fileName;
    });

    // Check if the file is found
    if (!entitiesData.source) {
      console.log(`File ${fileName} was not found in entries the ID ${fileId}.`);
      return false;
    } else {
      // Modify the contents of the "source" property in json_data
      entitiesData.source = newJsonSource;
    }

    // Convert the object back to JSON
    json_data = JSON.stringify(json_data);

  } catch (e) {
    console.log(JSON.stringify(e.message));
    return false;
  }

  return json_data;

}



function updateScriptV3() {

  // the SCRIPT file id to be modified
  const fileId = "your-file-id-should-be-here-CX999bX0xWUPtcFvRJ-iasXlvspZqYx73X5M";

  // etalon data. original_data - it is the file inside this project
  var sourceData = getSourceDataFromFile('', "original_data");

  // data receiver. modified_data - it is the file outside this project
  var receiverData = modifySourceDataObject(fileId, "modified_data", sourceData);

  // checking file is exists
  if (!receiverData) {
    console.log("Something went wrong.");
    return false;
  } else {
    var result = updateScriptContentV3(fileId, receiverData);
  }

  L(receiverData);
  L(sourceData);
  L("Result", result);

}
