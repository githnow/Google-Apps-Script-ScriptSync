# ScriptSync

<a name="top"></a>
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENCE)

<a name="overview"></a>

# Overview

**This library helps maintain the relevance of a script on the user's end.**

<a name="description"></a>

# Description

ScriptSync is a library designed to make it easier for developers to quickly deploy scripts on the user side. It allows to update script files without requiring any direct involvement from the user.

# Library's project key

```
1nUiajCHQReVwWPq7rNAvsIcWvPptmMUSzeytnzVHDpdoxUIvuX0e_reL
```

<a name="Howtoinstall"></a>

# How to install

In order to use this library, please install this library.

1. [Install library](https://developers.google.com/apps-script/guides/libraries).
   - Library's project key is **`1nUiajCHQReVwWPq7rNAvsIcWvPptmMUSzeytnzVHDpdoxUIvuX0e_reL`**.

## About scopes

About the install of scopes using the library, this library requires manually installing scopes into the project that installed the library:

- `https://www.googleapis.com/auth/script.external_request`
- `https://www.googleapis.com/auth/drive.scripts`
- `https://www.googleapis.com/auth/drive.file`
- `https://www.googleapis.com/auth/drive`

> IMPORTANT: Above 4 scopes are installed in this library. If you want to use Spreadsheets, please install the scopes for it using [Manifests](https://developers.google.com/apps-script/concepts/manifests) to the project installed this library.

# Methods

| Method                                       | Description                                                                                                                                                                                                                                                                                                                                           |
| :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| getScriptContent                             | Allows fetching the content of a script file based on its script_id.                                                                              |
| IO_GetScriptFiles                            | Retrieves a list of files associated with a script based on its script_id.                                                                        |
| IO_GetTemplateScriptFiles                    | Fetches a list of template files (script_id of the template is defined in the script properties; default template id is set to the library's id). |
| IO_UpdateFile                                | Updates an existing file within the script.                                                                                                       |
| IO_AddNewFile                                | Adds a new file or replaces an existing one within the script.                                                                                    |

# Usage

<a name="appsscript"></a>

## User appsscript.json:

appsscript file, json:
```json
{
  "timeZone": "Europe/Moscow",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "dependencies": {
    "enabledAdvancedServices": [
      {
        "userSymbol": "Drive",
        "serviceId": "drive",
        "version": "v3"
      }
    ],
    "libraries": [
      {
        "userSymbol": "ScriptSync",
        "libraryId": "1nUiajCHQReVwWPq7rNAvsIcWvPptmMUSzeytnzVHDpdoxUIvuX0e_reL",
        "version": "3"
      }
    ]
  },
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets.currentonly",
    "https://www.googleapis.com/auth/script.external_request",
    "https://www.googleapis.com/auth/drive.scripts",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/drive"
  ]
}
```

<a name="deploy"></a>

## User deploy.gs:

A sample script is as follows. This sample script copying the library to current project.

```javascript
function deploy() {
  const filesToCopy = ["lib_common", "lib_main", "lib_sett", "lib_types"];

  for (let file of filesToCopy) {
    const res = ScriptSync.IO_AddNewFile(file); 
    if (!res) break;
  }
}
```

- The template_script_id identifier is stored in the library properties as a `SETTINGS` property, thats:
  `{"template_script_id":"1nUiajCHQReVwWPq7rNAvsIcWvPptmMUSzeytnzVHDpdoxUIvuX0e_reL"}`

You can set your script_id as follows:
`ScriptSync.IO_AddNewFile(fromFile, toFile, ScriptId)`

You can copy the library and set the property manually or using the method (inside your library):

`setSetting_('template_script_id', 'my_template_id')`

Like this:
```javascript
function setMyTemplateId() {
  setSetting_('template_script_id', 'my_template_id');
}
```

# Also

The library and your script template must be shared.

# Important

- If you want to use it, please add a star.

---

<a name="licence"></a>

# Licence

[MIT](LICENCE)

<a name="author"></a>

# Author

[Githnow](https://github.com/githnow/)

If you have any questions and commissions for me, feel free to tell me.

<a name="updatehistory"></a>

# Update History

- v1.0.0 (May 5, 2024)

  1. Initial release.

[TOP](#top)
