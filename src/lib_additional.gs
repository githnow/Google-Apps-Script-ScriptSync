/**
 * Creates a map of function calls within a script, optionally visualizing it.
 * @param {string}    script_id   - The ID of the script containing the functions.\
 *                                  Optional parameter. If this parameter is not provided,
 *                                  script_id will be the current user script.
 * @param {string}    filename    - The name of the file in the script containing the functions.
 * @param {boolean}   isDraw      - Optional parameter. Determines whether to visualize 
 *                                  the function call map.\
 *                                  If set to 'true', the function call map will be visualized.
 * @returns {Object}                Returns a map of function calls within the script.
 */
function createCalleeMap(script_id, filename, isDraw) {
  
  var lines = [];

  function getLineNumber(position) {
    let lineNumber = 0;
    let currentPos = 0;

    for (let i = 0; i < lines.length; i++) {
      currentPos += lines[i].length + 1;
      if (currentPos > position) {
        lineNumber = i + 1;
        break;
      }
    }
    return lineNumber;
  }

  function findFunctionsInSource(sourceCode) {
    //regex for searching function and class defs
    const functionRegex = /(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)\s*{/g;
    const arrowFunctionRegex = /(?:const\s+)?(\w+)\s*=\s*\(([^)]*)\)\s*=>\s*{/g;
    const classRegex = /class\s+(\w+)\s*{/g;

    let functions = [];
    let classes = [];
    let match;

    //searching for functions using regex
    while ((match = functionRegex.exec(sourceCode)) !== null) {
      const name = match[1];
      const args = match[2] !== '' ? match[2].split(',').map(arg => arg.trim()) : [];
      functions.push({
          name: name,
          type: 'function',
          args: args,
          startAt: match.index,
          line: getLineNumber(match.index)
      });
    }
    while ((match = arrowFunctionRegex.exec(sourceCode)) !== null) {
      const name = match[1];
      const args = match[2] !== '' ? match[2].split(',').map(arg => arg.trim()) : [];
      functions.push({
          name: name,
          type: 'arrow function',
          args: args,
          startAt: match.index,
          line: getLineNumber(match.index)
      });
    }
    //searching for classes using regex
    while ((match = classRegex.exec(sourceCode)) !== null) {
      classes.push({
          name: match[1]
      });
    }

    functions.sort((a, b) => a.startAt - b.startAt);

    return {functions, classes};
  }

  function addCalleeMap(sourceCode, mapFunctions) {

    function parseFunctionCode(functionBody) {
      let [level, i] = [0, 0];
      let result = '';
      while (i < functionBody.length) {
        const char = functionBody[i];
        if (char === '{') {
          level++;
          result += '{';
        } else if (char === '}') {
          level--;
          result += '}';
          if (level === 0) break;
        } else {
          result += char;
        }
        i++;
      }
      return result;
    }

    //searching for function calls inside the source code
    function findFunctionCalls(code, functionName, startAt) {
      const regex = new RegExp(`(?<!\\w)${functionName}\\s*\\((?<functionArguments>(?:[^()]+).*)?\\s*\\)`, 'g');
      let matches = [];
      let match;
      while ((match = regex.exec(code)) !== null && matches.length < 10) {
        matches.push({
            arguments: (match?.groups?.functionArguments ?? "")
                .split(",")
                .map(arg => arg.trim())
                .filter(arg => arg !== "")
                .join(','),
            position: match.index + startAt + 1,
            line: getLineNumber(match.index + startAt + 1)
        });
      }
      return matches;
    }

    //building a chain of function calls
    let allCallee = [];
    sourceCode = sourceCode.trim();

    mapFunctions.forEach((func, idx) => {
      const nxStartAt = mapFunctions[idx+1]?.startAt || sourceCode.length;
      let funcBody = parseFunctionCode(sourceCode.slice(func.startAt, nxStartAt));

      if (funcBody) {
        //looking for function calls inside the function body
        let calls = [];
        for (const calleeFunc of mapFunctions) {
          if (calleeFunc.name !== func.name) {
            let callArguments = findFunctionCalls(funcBody, calleeFunc.name, func.startAt);
            if (callArguments.length > 0) {
              calls.push({
                  name: calleeFunc.name,
                  calls: callArguments,
                  counts: callArguments.length
              });
              allCallee.push(calleeFunc.name);
            }
          }
        }
        //add call information to the 'callee' field of the function
        func.callee = calls;
      }
    });

    //check if functions are included in the 'callee'
    mapFunctions.forEach(func => {
      func.unused = !allCallee.includes(func.name);
    });

    //functions with callee
    return mapFunctions;
  }

  function drawFunctionCallMap(calleeMap) {

    const LOG_LIMIT = 7800;
    const LINE_FILLER = '═';
    const BLOCK_SIDE = '║'.padStart(6);
    const BLOCK_LB = '╚'.padStart(6);
    const BLOCK_RB = '╝';
    const BLOCK_RT = '╗';
    const BLOCK_LT = '╔';
    const ARROW_UP = '▲'.padStart(10);
    const ARROW_DOWN = '▼'.padStart(10);
    const V_LINE = '│'.padStart(10);

    //object for storing positions & res draw
    const positions = {};
    let drawMap = [""];
    let printFunctions = [];

    function addLine(text, count = 1) {
      drawMap[drawMap.length - 1] += (text + '\n').repeat(count);
    }
    
    //calculating block position by function
    let _position = (name) => {
      if (!positions[name])
        positions[name] = Object.keys(positions).length + 1;
      return positions[name];
    }

    //draw blocks for each function and linking
    calleeMap.forEach(func => {
        const position = _position(func.name).toString().padStart(3);
        const tag = func.unused ? '*' : BLOCK_RT;
        const filler = LINE_FILLER.repeat(Math.max(func.name.length+5, 36));
        addLine(`${position}. ${BLOCK_LT}${filler}${tag}`);
        addLine(`${BLOCK_SIDE} ${func.name.padEnd(31)} ${BLOCK_SIDE.trim()}`);
        addLine(BLOCK_LB + filler + BLOCK_RB);
        func.callee.forEach((call, _) => {
            const thisType = _ == 0 ? func.type + ', at: ' + func.line : ''
            const calleePosition = _position(call.name);
            addLine(`${ARROW_UP} ${thisType}`);
            addLine(V_LINE, 3);
            addLine(ARROW_DOWN);
            addLine(`${position} ────── ${calleePosition} (${call.name})`);
        });
        printFunctions.push(`${_position(func.name)}. ${func.name}`);
        if (drawMap[drawMap.length - 1].length > LOG_LIMIT) drawMap.push("");
    });

    drawMap[drawMap.length - 1] += drawMap[drawMap.length - 1].length > 0
      || drawMap.length > 1
          ? `* - Likely unused functions` 
          : `Nothing to view`;

    L('Function list:', printFunctions);
    drawMap.forEach(chunk => {
        L(chunk);
    });
  }

  script_id = script_id ? script_id : ScriptApp.getScriptId();
  const scriptData = getScriptContent(script_id);

  if(!scriptData) throw new Error("Unable to access the contents of the script.");

  const fileData = scriptData.files.find(file => {
    return file.name === filename
  });

  L("Script file:", filename);
  if (fileData && fileData.source) {
    lines = fileData.source.split('\n');
    const map_functions = findFunctionsInSource(fileData.source);
    const callee_map = addCalleeMap(fileData.source, map_functions.functions);
    if (isDraw) drawFunctionCallMap(callee_map);
    return {classes: map_functions.classes, functions: callee_map};
  } else {
    L("The file was not found or does not contain the source.");
  }

  return { classes:[], functions:[] };
}

