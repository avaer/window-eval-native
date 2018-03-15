const vm = require('vm');

const parsingSymbol = Symbol();
const isParsing = window => window[parsingSymbol];

let windowEval;
if (!process.versions.chakracore) {
  const PREFIX = 'window[parsingSymbol]=false;';
  windowEval = (jsString, window, filename = 'script', lineOffset = 0, colOffset = 0) => {
    if (!vm.isContext(window)) {
      vm.createContext(window);
    }
    window[parsingSymbol] = true;
    window.parsingSymbol = parsingSymbol;
    try {
      vm.runInContext(PREFIX + jsString, window, {
        filename,
        lineOffset,
        colOffset: colOffset + PREFIX.length,
      });
    } catch (err) {
      console.warn(err);
    }
  };
  windowEval.isParsing = isParsing;
} else {
  const _Promise = require('nano-promise'); // needed to shim chakracore
  const PREFIX = 'window.onparse();window[parsingSymbol]=false;Promise=_Promise;';
  windowEval = (jsString, window, filename = 'script', lineOffset = 0, colOffset = 0) => {
    window._Promise = _Promise;
    if (!vm.isContext(window)) {
      vm.createContext(window);
    }
    window[parsingSymbol] = true;
    window.parsingSymbol = parsingSymbol;
    try {
      vm.runInContext(PREFIX + jsString, window, {
        filename,
        lineOffset,
        colOffset: colOffset + PREFIX.length,
      });
    } catch (err) {
      console.warn(err);
    }
  };
  windowEval.isParsing = isParsing;
}

module.exports = windowEval;
