/**
 * @name private_
 */
function getRemoteScriptId_() {
  return getSetting_("template_script_id");
}

/**
 * @name private_
 */
function getSetting_(property) {
  const properties = PropertiesService.getScriptProperties();
  const settings = JSON.parse(properties.getProperty("SETTINGS"));
  return settings?.hasOwnProperty(property) ? settings[property] : null;
}

/**
 * @name private_
 */
function setSetting_(property, value) {
  try {
    const properties = PropertiesService.getScriptProperties();
    var settings = JSON.parse(properties.getProperty("SETTINGS")) || {};
    var upSettings = {
      ...settings,
      [property]: value
    }
    properties.setProperty("SETTINGS", JSON.stringify(upSettings));
  } catch (e) {
    L(e);
    return false;
  }

  return true;
}
