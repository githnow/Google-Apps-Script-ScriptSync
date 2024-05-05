const isDebug = false;

const {log:L}=console;

const {warn:LW}=console;

const {error:LE}=console;

const L_ = (...args) => {
  if(isDebug) {
    const stack = new Error().stack;
    const caller = stack.split('\n')[2].trim() || '';
    L(`[DEBUG MSG ${caller}]	`, ...args);
  }
};

const LF_ = (...args) => {
  if(isDebug) {
    const stack = new Error().stack;
    const caller = stack || '';
    LW(`[DEBUG MSG ${caller}]	`, ...args);
  }
};

const LE_ = (...args) => {
  if(isDebug) {
    const stack = new Error().stack;
    const caller = stack.split('\n')[2].trim() || '';
    LE(`[DEBUG MSG ${caller}]	`, ...args);
  }
};

const LW_ = (...args) => {
  if(isDebug) {
    const stack = new Error().stack;
    const caller = stack.split('\n')[2].trim() || '';
    LW(`[DEBUG MSG ${caller}]	`, ...args);
  }
};
