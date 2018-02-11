const vm = require('vm');

let windowEval;
if (!process.versions.chakracore) {
  windowEval = (jsString, window, filename = 'script') => {
    if (!vm.isContext(window)) {
      vm.createContext(window);
    }
    try {
      vm.runInContext(jsString, window, {
        filename,
      });
    } catch (err) {
      console.warn(err);
    }
  };
} else {
  const _Promise = require('nano-promise'); // needed to shim chakracore
  windowEval = (jsString, window, filename = 'script') => {
    window._Promise = _Promise;
    if (!vm.isContext(window)) {
      vm.createContext(window);
    }
    try {
      vm.runInContext(`Promise = _Promise; ${jsString}`, window, {
        filename,
      });
    } catch (err) {
      console.warn(err);
    }
  };
}

module.exports = windowEval;
