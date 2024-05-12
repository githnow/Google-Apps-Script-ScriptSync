# ScriptSync

<a name="top"></a>
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

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
1. Copy the dependencies of the Apps Script ([appsscript.json](#appsscript)).

## About scopes

About the install of scopes using the library, this library requires manually installing scopes into the project that installed the library:

- `https://www.googleapis.com/auth/script.external_request`
- `https://www.googleapis.com/auth/drive.scripts`
- `https://www.googleapis.com/auth/drive.file`
- `https://www.googleapis.com/auth/drive`

> IMPORTANT: Above 4 scopes are installed in this library. If you want to use Spreadsheets, please install the scopes for it using [Manifests](https://developers.google.com/apps-script/concepts/manifests) to the project installed this library.

# Methods

<a name="methods"></a>

## Libarary

| Method                                       | Description                                                                                                                                       |
| :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| **IO_GetSamples** *                          | Saves file with code examples in the user script.                                                                                                 |
| getScriptContent                             | Retrieves the content of the script file.                                                                                                         |
| getScriptFiles                               | Retrieves a list of files associated with a script based on its script_id.                                                                        |
| getTemplateScriptFiles                       | Fetches a list of template files (script_id of the template is defined in the script properties, default template id is set to the library's id). |
| assignTemplate                               | Initializes the class and sets the ID of the template script as the data source.                                                                  |

\* - makes changes to the script file

<a name="methods_class"></a>

## Library Class

| Method                                       | Description                                                                                                                                       |
| :------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| assignTemplate                               | Initializes the class and sets the ID of the template script as the data source.                                                                  |
| **Operations**                                                                                                                                                                                   |
| AddNewFile                                   | Adds a new file or replaces an existing one within the script.                                                                                    |
| renameFile                                   | Renames a file within the script.                                                                                                                 |
| createBlankFile                              | Creates a new blank file within the script.                                                                                                       |
| setCustomSource                              | Sets the content of the source in a file within the script.                                                                                       |
| addFileToUserJson                            | Adds a file to the user's script.                                                                                                                 |
| **General**                                                                                                                                                                                      |
| **commit** *                                 | Applies the pending changes made to the script.                                                                                                   |
| drop                                         | Discards the local changes made to the script, without reverting a commit.                                                                        |
| viewChanges                                  | Displays a list of changes that will be applied to the script upon committing.                                                                    |
| getChanges                                   | Retrieves a list of changes that will be applied to the script upon committing.                                                                   |
| getTemplateId                                | Retrieves the current ID of the script's template.                                                                                                |

\* - makes changes to the script file

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
        "version": "4"
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
function samples() {
  ScriptSync.IO_GetSamples();
}
```

- The template_script_id identifier is stored in the library properties as a `SETTINGS` property, thats:
  `{"template_script_id":"1nUiajCHQReVwWPq7rNAvsIcWvPptmMUSzeytnzVHDpdoxUIvuX0e_reL"}`

You can set your script_id as follows:
`ScriptSync.assignTemplate(TemplateScriptId)`

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

[MIT](LICENSE)

<a name="author"></a>

# Author

[Githnow](https://github.com/githnow/)

If you have any questions and commissions for me, feel free to tell me.

<a name="updatehistory"></a>

# Update History

- v2.0.4 (May 12, 2024)

  1. Completely rewritten the library code based on classes.
  2. Added new methods:
     - General class methods: 6 methods of [assignTemplate](#methods_class), [commit](#methods_class), [drop](#methods_class), [viewChanges](#methods_class), [getChanges](#methods_class) and [getTemplateId](#methods_class) were added.
     - File operations: 5 methods of [AddNewFile](#methods_class), [renameFile](#methods_class), [createBlankFile](#methods_class), [setCustomSource](#methods_class) and [addFileToUserJson](#methods_class) were added.
     - [IO_GetSamples](#methods) method.

- v1.0.0 (May 5, 2024)

  1. Initial release.

[TOP](#top)
