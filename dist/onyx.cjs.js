'use strict';function _interopDefault(e){return(e&&(typeof e==='object')&&'default'in e)?e['default']:e}var http=_interopDefault(require('http')),https=_interopDefault(require('https')),url=_interopDefault(require('url')),assert=_interopDefault(require('assert')),stream$1=_interopDefault(require('stream')),ms=_interopDefault(require('ms')),tty=_interopDefault(require('tty')),util=_interopDefault(require('util')),os=_interopDefault(require('os')),zlib=_interopDefault(require('zlib')),events=_interopDefault(require('events')),buffer=_interopDefault(require('buffer')),string_decoder$1=_interopDefault(require('string_decoder'));var bind = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

var isBuffer = function isBuffer (obj) {
  return obj != null && obj.constructor != null &&
    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
};/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

var utils = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
var buildURL = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

var InterceptorManager_1 = InterceptorManager;/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
var transformData = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};var isCancel = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
var enhanceError = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
var createError = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
var settle = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

function getCjsExportFromNamespace (n) {
	return n && n['default'] || n;
}var debug = createCommonjsModule(function (module, exports) {
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = ms;

/**
 * Active `debug` instances.
 */
exports.instances = [];

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  var prevTime;

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);
  debug.destroy = destroy;

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  exports.instances.push(debug);

  return debug;
}

function destroy () {
  var index = exports.instances.indexOf(this);
  if (index !== -1) {
    exports.instances.splice(index, 1);
    return true;
  } else {
    return false;
  }
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var i;
  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }

  for (i = 0; i < exports.instances.length; i++) {
    var instance = exports.instances[i];
    instance.enabled = exports.enabled(instance.namespace);
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  if (name[name.length - 1] === '*') {
    return true;
  }
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}
});
var debug_1 = debug.coerce;
var debug_2 = debug.disable;
var debug_3 = debug.enable;
var debug_4 = debug.enabled;
var debug_5 = debug.humanize;
var debug_6 = debug.instances;
var debug_7 = debug.names;
var debug_8 = debug.skips;
var debug_9 = debug.formatters;var browser = createCommonjsModule(function (module, exports) {
/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  '#0000CC', '#0000FF', '#0033CC', '#0033FF', '#0066CC', '#0066FF', '#0099CC',
  '#0099FF', '#00CC00', '#00CC33', '#00CC66', '#00CC99', '#00CCCC', '#00CCFF',
  '#3300CC', '#3300FF', '#3333CC', '#3333FF', '#3366CC', '#3366FF', '#3399CC',
  '#3399FF', '#33CC00', '#33CC33', '#33CC66', '#33CC99', '#33CCCC', '#33CCFF',
  '#6600CC', '#6600FF', '#6633CC', '#6633FF', '#66CC00', '#66CC33', '#9900CC',
  '#9900FF', '#9933CC', '#9933FF', '#99CC00', '#99CC33', '#CC0000', '#CC0033',
  '#CC0066', '#CC0099', '#CC00CC', '#CC00FF', '#CC3300', '#CC3333', '#CC3366',
  '#CC3399', '#CC33CC', '#CC33FF', '#CC6600', '#CC6633', '#CC9900', '#CC9933',
  '#CCCC00', '#CCCC33', '#FF0000', '#FF0033', '#FF0066', '#FF0099', '#FF00CC',
  '#FF00FF', '#FF3300', '#FF3333', '#FF3366', '#FF3399', '#FF33CC', '#FF33FF',
  '#FF6600', '#FF6633', '#FF9900', '#FF9933', '#FFCC00', '#FFCC33'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // Internet Explorer and Edge do not support colors.
  if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
    return false;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit');

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}
});
var browser_1 = browser.log;
var browser_2 = browser.formatArgs;
var browser_3 = browser.save;
var browser_4 = browser.load;
var browser_5 = browser.useColors;
var browser_6 = browser.storage;
var browser_7 = browser.colors;var hasFlag = (flag, argv) => {
	argv = argv || process.argv;
	const prefix = flag.startsWith('-') ? '' : (flag.length === 1 ? '-' : '--');
	const pos = argv.indexOf(prefix + flag);
	const terminatorPos = argv.indexOf('--');
	return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos);
};const env = process.env;

let forceColor;
if (hasFlag('no-color') ||
	hasFlag('no-colors') ||
	hasFlag('color=false')) {
	forceColor = false;
} else if (hasFlag('color') ||
	hasFlag('colors') ||
	hasFlag('color=true') ||
	hasFlag('color=always')) {
	forceColor = true;
}
if ('FORCE_COLOR' in env) {
	forceColor = env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0;
}

function translateLevel(level) {
	if (level === 0) {
		return false;
	}

	return {
		level,
		hasBasic: true,
		has256: level >= 2,
		has16m: level >= 3
	};
}

function supportsColor(stream) {
	if (forceColor === false) {
		return 0;
	}

	if (hasFlag('color=16m') ||
		hasFlag('color=full') ||
		hasFlag('color=truecolor')) {
		return 3;
	}

	if (hasFlag('color=256')) {
		return 2;
	}

	if (stream && !stream.isTTY && forceColor !== true) {
		return 0;
	}

	const min = forceColor ? 1 : 0;

	if (process.platform === 'win32') {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first Windows
		// release that supports 256 colors. Windows 10 build 14931 is the first release
		// that supports 16m/TrueColor.
		const osRelease = os.release().split('.');
		if (
			Number(process.versions.node.split('.')[0]) >= 8 &&
			Number(osRelease[0]) >= 10 &&
			Number(osRelease[2]) >= 10586
		) {
			return Number(osRelease[2]) >= 14931 ? 3 : 2;
		}

		return 1;
	}

	if ('CI' in env) {
		if (['TRAVIS', 'CIRCLECI', 'APPVEYOR', 'GITLAB_CI'].some(sign => sign in env) || env.CI_NAME === 'codeship') {
			return 1;
		}

		return min;
	}

	if ('TEAMCITY_VERSION' in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
	}

	if (env.COLORTERM === 'truecolor') {
		return 3;
	}

	if ('TERM_PROGRAM' in env) {
		const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10);

		switch (env.TERM_PROGRAM) {
			case 'iTerm.app':
				return version >= 3 ? 3 : 2;
			case 'Apple_Terminal':
				return 2;
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return 2;
	}

	if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return 1;
	}

	if ('COLORTERM' in env) {
		return 1;
	}

	if (env.TERM === 'dumb') {
		return min;
	}

	return min;
}

function getSupportLevel(stream) {
	const level = supportsColor(stream);
	return translateLevel(level);
}

var supportsColor_1 = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
};var node = createCommonjsModule(function (module, exports) {
/**
 * Module dependencies.
 */




/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [ 6, 2, 3, 4, 5, 1 ];

try {
  var supportsColor = supportsColor_1;
  if (supportsColor && supportsColor.level >= 2) {
    exports.colors = [
      20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63, 68,
      69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128, 129, 134,
      135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171,
      172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200, 201, 202, 203, 204,
      205, 206, 207, 208, 209, 214, 215, 220, 221
    ];
  }
} catch (err) {
  // swallow - we only care if `supports-color` is available; it doesn't have to be.
}

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(process.stderr.fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var colorCode = '\u001b[3' + (c < 8 ? c : '8;5;' + c);
    var prefix = '  ' + colorCode + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push(colorCode + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = getDate() + name + ' ' + args[0];
  }
}

function getDate() {
  if (exports.inspectOpts.hideDate) {
    return '';
  } else {
    return new Date().toISOString() + ' ';
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */

function log() {
  return process.stderr.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());
});
var node_1 = node.init;
var node_2 = node.log;
var node_3 = node.formatArgs;
var node_4 = node.save;
var node_5 = node.load;
var node_6 = node.useColors;
var node_7 = node.colors;
var node_8 = node.inspectOpts;var src = createCommonjsModule(function (module) {
/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process === 'undefined' || process.type === 'renderer') {
  module.exports = browser;
} else {
  module.exports = node;
}
});var Writable = stream$1.Writable;
var debug$1 = src("follow-redirects");

// RFC7231§4.2.1: Of the request methods defined by this specification,
// the GET, HEAD, OPTIONS, and TRACE methods are defined to be safe.
var SAFE_METHODS = { GET: true, HEAD: true, OPTIONS: true, TRACE: true };

// Create handlers that pass events from native requests
var eventHandlers = Object.create(null);
["abort", "aborted", "error", "socket", "timeout"].forEach(function (event) {
  eventHandlers[event] = function (arg) {
    this._redirectable.emit(event, arg);
  };
});

// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
  // Initialize the request
  Writable.call(this);
  options.headers = options.headers || {};
  this._options = options;
  this._redirectCount = 0;
  this._redirects = [];
  this._requestBodyLength = 0;
  this._requestBodyBuffers = [];

  // Since http.request treats host as an alias of hostname,
  // but the url module interprets host as hostname plus port,
  // eliminate the host property to avoid confusion.
  if (options.host) {
    // Use hostname if set, because it has precedence
    if (!options.hostname) {
      options.hostname = options.host;
    }
    delete options.host;
  }

  // Attach a callback if passed
  if (responseCallback) {
    this.on("response", responseCallback);
  }

  // React to responses of native requests
  var self = this;
  this._onNativeResponse = function (response) {
    self._processResponse(response);
  };

  // Complete the URL object when necessary
  if (!options.pathname && options.path) {
    var searchPos = options.path.indexOf("?");
    if (searchPos < 0) {
      options.pathname = options.path;
    }
    else {
      options.pathname = options.path.substring(0, searchPos);
      options.search = options.path.substring(searchPos);
    }
  }

  // Perform the first request
  this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);

// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function (data, encoding, callback) {
  // Validate input and shift parameters if necessary
  if (!(typeof data === "string" || typeof data === "object" && ("length" in data))) {
    throw new Error("data should be a string, Buffer or Uint8Array");
  }
  if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Ignore empty buffers, since writing them doesn't invoke the callback
  // https://github.com/nodejs/node/issues/22066
  if (data.length === 0) {
    if (callback) {
      callback();
    }
    return;
  }
  // Only write when we don't exceed the maximum body length
  if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
    this._requestBodyLength += data.length;
    this._requestBodyBuffers.push({ data: data, encoding: encoding });
    this._currentRequest.write(data, encoding, callback);
  }
  // Error when we exceed the maximum body length
  else {
    this.emit("error", new Error("Request body larger than maxBodyLength limit"));
    this.abort();
  }
};

// Ends the current native request
RedirectableRequest.prototype.end = function (data, encoding, callback) {
  // Shift parameters if necessary
  if (typeof data === "function") {
    callback = data;
    data = encoding = null;
  }
  else if (typeof encoding === "function") {
    callback = encoding;
    encoding = null;
  }

  // Write data and end
  var currentRequest = this._currentRequest;
  this.write(data || "", encoding, function () {
    currentRequest.end(null, null, callback);
  });
};

// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function (name, value) {
  this._options.headers[name] = value;
  this._currentRequest.setHeader(name, value);
};

// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function (name) {
  delete this._options.headers[name];
  this._currentRequest.removeHeader(name);
};

// Proxy all other public ClientRequest methods
[
  "abort", "flushHeaders", "getHeader",
  "setNoDelay", "setSocketKeepAlive", "setTimeout",
].forEach(function (method) {
  RedirectableRequest.prototype[method] = function (a, b) {
    return this._currentRequest[method](a, b);
  };
});

// Proxy all public ClientRequest properties
["aborted", "connection", "socket"].forEach(function (property) {
  Object.defineProperty(RedirectableRequest.prototype, property, {
    get: function () { return this._currentRequest[property]; },
  });
});

// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function () {
  // Load the native protocol
  var protocol = this._options.protocol;
  var nativeProtocol = this._options.nativeProtocols[protocol];
  if (!nativeProtocol) {
    this.emit("error", new Error("Unsupported protocol " + protocol));
    return;
  }

  // If specified, use the agent corresponding to the protocol
  // (HTTP and HTTPS use different types of agents)
  if (this._options.agents) {
    var scheme = protocol.substr(0, protocol.length - 1);
    this._options.agent = this._options.agents[scheme];
  }

  // Create the native request
  var request = this._currentRequest =
        nativeProtocol.request(this._options, this._onNativeResponse);
  this._currentUrl = url.format(this._options);

  // Set up event handlers
  request._redirectable = this;
  for (var event in eventHandlers) {
    /* istanbul ignore else */
    if (event) {
      request.on(event, eventHandlers[event]);
    }
  }

  // End a redirected request
  // (The first request must be ended explicitly with RedirectableRequest#end)
  if (this._isRedirect) {
    // Write the request entity and end.
    var i = 0;
    var buffers = this._requestBodyBuffers;
    (function writeNext() {
      if (i < buffers.length) {
        var buffer = buffers[i++];
        request.write(buffer.data, buffer.encoding, writeNext);
      }
      else {
        request.end();
      }
    }());
  }
};

// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function (response) {
  // Store the redirected response
  if (this._options.trackRedirects) {
    this._redirects.push({
      url: this._currentUrl,
      headers: response.headers,
      statusCode: response.statusCode,
    });
  }

  // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
  // that further action needs to be taken by the user agent in order to
  // fulfill the request. If a Location header field is provided,
  // the user agent MAY automatically redirect its request to the URI
  // referenced by the Location field value,
  // even if the specific status code is not understood.
  var location = response.headers.location;
  if (location && this._options.followRedirects !== false &&
      response.statusCode >= 300 && response.statusCode < 400) {
    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
      this.emit("error", new Error("Max redirects exceeded."));
      return;
    }

    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe […],
    // since the user might not wish to redirect an unsafe request.
    // RFC7231§6.4.7: The 307 (Temporary Redirect) status code indicates
    // that the target resource resides temporarily under a different URI
    // and the user agent MUST NOT change the request method
    // if it performs an automatic redirection to that URI.
    var header;
    var headers = this._options.headers;
    if (response.statusCode !== 307 && !(this._options.method in SAFE_METHODS)) {
      this._options.method = "GET";
      // Drop a possible entity and headers related to it
      this._requestBodyBuffers = [];
      for (header in headers) {
        if (/^content-/i.test(header)) {
          delete headers[header];
        }
      }
    }

    // Drop the Host header, as the redirect might lead to a different host
    if (!this._isRedirect) {
      for (header in headers) {
        if (/^host$/i.test(header)) {
          delete headers[header];
        }
      }
    }

    // Perform the redirected request
    var redirectUrl = url.resolve(this._currentUrl, location);
    debug$1("redirecting to", redirectUrl);
    Object.assign(this._options, url.parse(redirectUrl));
    this._isRedirect = true;
    this._performRequest();

    // Discard the remainder of the response to avoid waiting for data
    response.destroy();
  }
  else {
    // The response is not a redirect; return it as-is
    response.responseUrl = this._currentUrl;
    response.redirects = this._redirects;
    this.emit("response", response);

    // Clean up
    this._requestBodyBuffers = [];
  }
};

// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
  // Default settings
  var exports = {
    maxRedirects: 21,
    maxBodyLength: 10 * 1024 * 1024,
  };

  // Wrap each protocol
  var nativeProtocols = {};
  Object.keys(protocols).forEach(function (scheme) {
    var protocol = scheme + ":";
    var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
    var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);

    // Executes a request, following redirects
    wrappedProtocol.request = function (options, callback) {
      if (typeof options === "string") {
        options = url.parse(options);
        options.maxRedirects = exports.maxRedirects;
      }
      else {
        options = Object.assign({
          protocol: protocol,
          maxRedirects: exports.maxRedirects,
          maxBodyLength: exports.maxBodyLength,
        }, options);
      }
      options.nativeProtocols = nativeProtocols;
      assert.equal(options.protocol, protocol, "protocol mismatch");
      debug$1("options", options);
      return new RedirectableRequest(options, callback);
    };

    // Executes a GET request, following redirects
    wrappedProtocol.get = function (options, callback) {
      var request = wrappedProtocol.request(options, callback);
      request.end();
      return request;
    };
  });
  return exports;
}

// Exports
var followRedirects = wrap({ http: http, https: https });
var wrap_1 = wrap;
followRedirects.wrap = wrap_1;const _from="axios";const _id="axios@0.19.0";const _inBundle=false;const _integrity="sha512-1uvKqKQta3KBxIz14F2v06AEHZ/dIoeKfbTRkK1E5oqjDnuEerLmYTgJB5AiQZHJcljpg1TuRzdjDR06qNk0DQ==";const _location="/axios";const _phantomChildren={};const _requested={type:"tag",registry:true,raw:"axios",name:"axios",escapedName:"axios",rawSpec:"",saveSpec:null,fetchSpec:"latest"};const _requiredBy=["#DEV:/","#USER"];const _resolved="https://registry.npmjs.org/axios/-/axios-0.19.0.tgz";const _shasum="8e09bff3d9122e133f7b8101c8fbdd00ed3d2ab8";const _spec="axios";const _where="/Users/duncanpierce/dev/projects/neural_network/onyx";const author={name:"Matt Zabriskie"};const browser$1={"./lib/adapters/http.js":"./lib/adapters/xhr.js"};const bugs={url:"https://github.com/axios/axios/issues"};const bundleDependencies=false;const bundlesize=[{path:"./dist/axios.min.js",threshold:"5kB"}];const dependencies={"follow-redirects":"1.5.10","is-buffer":"^2.0.2"};const deprecated=false;const description="Promise based HTTP client for the browser and node.js";const devDependencies={bundlesize:"^0.17.0",coveralls:"^3.0.0","es6-promise":"^4.2.4",grunt:"^1.0.2","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^20.1.0","grunt-karma":"^2.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^1.0.18","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1",karma:"^1.3.0","karma-chrome-launcher":"^2.2.0","karma-coverage":"^1.1.1","karma-firefox-launcher":"^1.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-opera-launcher":"^1.0.0","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^1.2.0","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.7","karma-webpack":"^1.7.0","load-grunt-tasks":"^3.5.2",minimist:"^1.2.0",mocha:"^5.2.0",sinon:"^4.5.0",typescript:"^2.8.1","url-search-params":"^0.10.0",webpack:"^1.13.1","webpack-dev-server":"^1.14.1"};const homepage="https://github.com/axios/axios";const keywords=["xhr","http","ajax","promise","node"];const license="MIT";const main="index.js";const name="axios";const repository={type:"git",url:"git+https://github.com/axios/axios.git"};const scripts={build:"NODE_ENV=production grunt build",coveralls:"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js",examples:"node ./examples/server.js",fix:"eslint --fix lib/**/*.js",postversion:"git push && git push --tags",preversion:"npm test",start:"node ./sandbox/server.js",test:"grunt test && bundlesize",version:"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"};const typings="./index.d.ts";const version="0.19.0";var _package = {_from:_from,_id:_id,_inBundle:_inBundle,_integrity:_integrity,_location:_location,_phantomChildren:_phantomChildren,_requested:_requested,_requiredBy:_requiredBy,_resolved:_resolved,_shasum:_shasum,_spec:_spec,_where:_where,author:author,browser:browser$1,bugs:bugs,bundleDependencies:bundleDependencies,bundlesize:bundlesize,dependencies:dependencies,deprecated:deprecated,description:description,devDependencies:devDependencies,homepage:homepage,keywords:keywords,license:license,main:main,name:name,repository:repository,scripts:scripts,typings:typings,version:version};
var _package$1 = /*#__PURE__*/Object.freeze({_from: _from,_id: _id,_inBundle: _inBundle,_integrity: _integrity,_location: _location,_phantomChildren: _phantomChildren,_requested: _requested,_requiredBy: _requiredBy,_resolved: _resolved,_shasum: _shasum,_spec: _spec,_where: _where,author: author,browser: browser$1,bugs: bugs,bundleDependencies: bundleDependencies,bundlesize: bundlesize,dependencies: dependencies,deprecated: deprecated,description: description,devDependencies: devDependencies,homepage: homepage,keywords: keywords,license: license,main: main,name: name,repository: repository,scripts: scripts,typings: typings,version: version,'default': _package});var pkg = getCjsExportFromNamespace(_package$1);var httpFollow = followRedirects.http;
var httpsFollow = followRedirects.https;






var isHttps = /https:?/;

/*eslint consistent-return:0*/
var http_1 = function httpAdapter(config) {
  return new Promise(function dispatchHttpRequest(resolvePromise, rejectPromise) {
    var timer;
    var resolve = function resolve(value) {
      clearTimeout(timer);
      resolvePromise(value);
    };
    var reject = function reject(value) {
      clearTimeout(timer);
      rejectPromise(value);
    };
    var data = config.data;
    var headers = config.headers;

    // Set User-Agent (required by some servers)
    // Only set header if it hasn't been set in config
    // See https://github.com/axios/axios/issues/69
    if (!headers['User-Agent'] && !headers['user-agent']) {
      headers['User-Agent'] = 'axios/' + pkg.version;
    }

    if (data && !utils.isStream(data)) {
      if (Buffer.isBuffer(data)) ; else if (utils.isArrayBuffer(data)) {
        data = Buffer.from(new Uint8Array(data));
      } else if (utils.isString(data)) {
        data = Buffer.from(data, 'utf-8');
      } else {
        return reject(createError(
          'Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream',
          config
        ));
      }

      // Add Content-Length header if data exists
      headers['Content-Length'] = data.length;
    }

    // HTTP basic authentication
    var auth = undefined;
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      auth = username + ':' + password;
    }

    // Parse url
    var parsed = url.parse(config.url);
    var protocol = parsed.protocol || 'http:';

    if (!auth && parsed.auth) {
      var urlAuth = parsed.auth.split(':');
      var urlUsername = urlAuth[0] || '';
      var urlPassword = urlAuth[1] || '';
      auth = urlUsername + ':' + urlPassword;
    }

    if (auth) {
      delete headers.Authorization;
    }

    var isHttpsRequest = isHttps.test(protocol);
    var agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;

    var options = {
      path: buildURL(parsed.path, config.params, config.paramsSerializer).replace(/^\?/, ''),
      method: config.method.toUpperCase(),
      headers: headers,
      agent: agent,
      auth: auth
    };

    if (config.socketPath) {
      options.socketPath = config.socketPath;
    } else {
      options.hostname = parsed.hostname;
      options.port = parsed.port;
    }

    var proxy = config.proxy;
    if (!proxy && proxy !== false) {
      var proxyEnv = protocol.slice(0, -1) + '_proxy';
      var proxyUrl = process.env[proxyEnv] || process.env[proxyEnv.toUpperCase()];
      if (proxyUrl) {
        var parsedProxyUrl = url.parse(proxyUrl);
        var noProxyEnv = process.env.no_proxy || process.env.NO_PROXY;
        var shouldProxy = true;

        if (noProxyEnv) {
          var noProxy = noProxyEnv.split(',').map(function trim(s) {
            return s.trim();
          });

          shouldProxy = !noProxy.some(function proxyMatch(proxyElement) {
            if (!proxyElement) {
              return false;
            }
            if (proxyElement === '*') {
              return true;
            }
            if (proxyElement[0] === '.' &&
                parsed.hostname.substr(parsed.hostname.length - proxyElement.length) === proxyElement &&
                proxyElement.match(/\./g).length === parsed.hostname.match(/\./g).length) {
              return true;
            }

            return parsed.hostname === proxyElement;
          });
        }


        if (shouldProxy) {
          proxy = {
            host: parsedProxyUrl.hostname,
            port: parsedProxyUrl.port
          };

          if (parsedProxyUrl.auth) {
            var proxyUrlAuth = parsedProxyUrl.auth.split(':');
            proxy.auth = {
              username: proxyUrlAuth[0],
              password: proxyUrlAuth[1]
            };
          }
        }
      }
    }

    if (proxy) {
      options.hostname = proxy.host;
      options.host = proxy.host;
      options.headers.host = parsed.hostname + (parsed.port ? ':' + parsed.port : '');
      options.port = proxy.port;
      options.path = protocol + '//' + parsed.hostname + (parsed.port ? ':' + parsed.port : '') + options.path;

      // Basic proxy authorization
      if (proxy.auth) {
        var base64 = Buffer.from(proxy.auth.username + ':' + proxy.auth.password, 'utf8').toString('base64');
        options.headers['Proxy-Authorization'] = 'Basic ' + base64;
      }
    }

    var transport;
    var isHttpsProxy = isHttpsRequest && (proxy ? isHttps.test(proxy.protocol) : true);
    if (config.transport) {
      transport = config.transport;
    } else if (config.maxRedirects === 0) {
      transport = isHttpsProxy ? https : http;
    } else {
      if (config.maxRedirects) {
        options.maxRedirects = config.maxRedirects;
      }
      transport = isHttpsProxy ? httpsFollow : httpFollow;
    }

    if (config.maxContentLength && config.maxContentLength > -1) {
      options.maxBodyLength = config.maxContentLength;
    }

    // Create the request
    var req = transport.request(options, function handleResponse(res) {
      if (req.aborted) return;

      // uncompress the response body transparently if required
      var stream = res;
      switch (res.headers['content-encoding']) {
      /*eslint default-case:0*/
      case 'gzip':
      case 'compress':
      case 'deflate':
        // add the unzipper to the body stream processing pipeline
        stream = (res.statusCode === 204) ? stream : stream.pipe(zlib.createUnzip());

        // remove the content-encoding in order to not confuse downstream operations
        delete res.headers['content-encoding'];
        break;
      }

      // return the last request in case of redirects
      var lastRequest = res.req || req;

      var response = {
        status: res.statusCode,
        statusText: res.statusMessage,
        headers: res.headers,
        config: config,
        request: lastRequest
      };

      if (config.responseType === 'stream') {
        response.data = stream;
        settle(resolve, reject, response);
      } else {
        var responseBuffer = [];
        stream.on('data', function handleStreamData(chunk) {
          responseBuffer.push(chunk);

          // make sure the content length is not over the maxContentLength if specified
          if (config.maxContentLength > -1 && Buffer.concat(responseBuffer).length > config.maxContentLength) {
            stream.destroy();
            reject(createError('maxContentLength size of ' + config.maxContentLength + ' exceeded',
              config, null, lastRequest));
          }
        });

        stream.on('error', function handleStreamError(err) {
          if (req.aborted) return;
          reject(enhanceError(err, config, null, lastRequest));
        });

        stream.on('end', function handleStreamEnd() {
          var responseData = Buffer.concat(responseBuffer);
          if (config.responseType !== 'arraybuffer') {
            responseData = responseData.toString(config.responseEncoding);
          }

          response.data = responseData;
          settle(resolve, reject, response);
        });
      }
    });

    // Handle errors
    req.on('error', function handleRequestError(err) {
      if (req.aborted) return;
      reject(enhanceError(err, config, null, req));
    });

    // Handle request timeout
    if (config.timeout) {
      timer = setTimeout(function handleRequestTimeout() {
        req.abort();
        reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED', req));
      }, config.timeout);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (req.aborted) return;

        req.abort();
        reject(cancel);
      });
    }

    // Send the request
    if (utils.isStream(data)) {
      data.on('error', function handleStreamError(err) {
        reject(enhanceError(err, config, null, req));
      }).pipe(req);
    } else {
      req.end(data);
    }
  });
};// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
var parseHeaders = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};var isURLSameOrigin = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);var cookies = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);var xhr = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies$1 = cookies;

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
        cookies$1.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  // Only Node.JS has a process variable that is of [[Class]] process
  if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = http_1;
  } else if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = xhr;
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

var defaults_1 = defaults;/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
var isAbsoluteURL = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
var combineURLs = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
var dispatchRequest = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults_1.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
var mergeConfig = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  utils.forEach(['url', 'method', 'params', 'data'], function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(['headers', 'auth', 'proxy'], function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach([
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'maxContentLength',
    'validateStatus', 'maxRedirects', 'httpAgent', 'httpsAgent', 'cancelToken',
    'socketPath'
  ], function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager_1(),
    response: new InterceptorManager_1()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);
  config.method = config.method ? config.method.toLowerCase() : 'get';

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

var Axios_1 = Axios;/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

var Cancel_1 = Cancel;/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel_1(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

var CancelToken_1 = CancelToken;/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
var spread = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios_1(defaultConfig);
  var instance = bind(Axios_1.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios_1.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults_1);

// Expose Axios class to allow class inheritance
axios.Axios = Axios_1;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = Cancel_1;
axios.CancelToken = CancelToken_1;
axios.isCancel = isCancel;

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;

var axios_1 = axios;

// Allow use of default import syntax in TypeScript
var default_1 = axios;
axios_1.default = default_1;var axios$1 = axios_1;var decode = {"0":65533,"128":8364,"130":8218,"131":402,"132":8222,"133":8230,"134":8224,"135":8225,"136":710,"137":8240,"138":352,"139":8249,"140":338,"142":381,"145":8216,"146":8217,"147":8220,"148":8221,"149":8226,"150":8211,"151":8212,"152":732,"153":8482,"154":353,"155":8250,"156":339,"158":382,"159":376};var decode$1 = /*#__PURE__*/Object.freeze({'default': decode});var decodeMap = getCjsExportFromNamespace(decode$1);var decode_codepoint = decodeCodePoint;

// modified version of https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
function decodeCodePoint(codePoint) {
    if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
        return "\uFFFD";
    }

    if (codePoint in decodeMap) {
        codePoint = decodeMap[codePoint];
    }

    var output = "";

    if (codePoint > 0xffff) {
        codePoint -= 0x10000;
        output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
        codePoint = 0xdc00 | (codePoint & 0x3ff);
    }

    output += String.fromCharCode(codePoint);
    return output;
}const Aacute="Á";const aacute="á";const Abreve="Ă";const abreve="ă";const ac="∾";const acd="∿";const acE="∾̳";const Acirc="Â";const acirc="â";const acute="´";const Acy="А";const acy="а";const AElig="Æ";const aelig="æ";const af="⁡";const Afr="𝔄";const afr="𝔞";const Agrave="À";const agrave="à";const alefsym="ℵ";const aleph="ℵ";const Alpha="Α";const alpha="α";const Amacr="Ā";const amacr="ā";const amalg="⨿";const amp="&";const AMP="&";const andand="⩕";const And="⩓";const and="∧";const andd="⩜";const andslope="⩘";const andv="⩚";const ang="∠";const ange="⦤";const angle="∠";const angmsdaa="⦨";const angmsdab="⦩";const angmsdac="⦪";const angmsdad="⦫";const angmsdae="⦬";const angmsdaf="⦭";const angmsdag="⦮";const angmsdah="⦯";const angmsd="∡";const angrt="∟";const angrtvb="⊾";const angrtvbd="⦝";const angsph="∢";const angst="Å";const angzarr="⍼";const Aogon="Ą";const aogon="ą";const Aopf="𝔸";const aopf="𝕒";const apacir="⩯";const ap="≈";const apE="⩰";const ape="≊";const apid="≋";const apos="'";const ApplyFunction="⁡";const approx="≈";const approxeq="≊";const Aring="Å";const aring="å";const Ascr="𝒜";const ascr="𝒶";const Assign="≔";const ast="*";const asymp="≈";const asympeq="≍";const Atilde="Ã";const atilde="ã";const Auml="Ä";const auml="ä";const awconint="∳";const awint="⨑";const backcong="≌";const backepsilon="϶";const backprime="‵";const backsim="∽";const backsimeq="⋍";const Backslash="∖";const Barv="⫧";const barvee="⊽";const barwed="⌅";const Barwed="⌆";const barwedge="⌅";const bbrk="⎵";const bbrktbrk="⎶";const bcong="≌";const Bcy="Б";const bcy="б";const bdquo="„";const becaus="∵";const because="∵";const Because="∵";const bemptyv="⦰";const bepsi="϶";const bernou="ℬ";const Bernoullis="ℬ";const Beta="Β";const beta="β";const beth="ℶ";const between="≬";const Bfr="𝔅";const bfr="𝔟";const bigcap="⋂";const bigcirc="◯";const bigcup="⋃";const bigodot="⨀";const bigoplus="⨁";const bigotimes="⨂";const bigsqcup="⨆";const bigstar="★";const bigtriangledown="▽";const bigtriangleup="△";const biguplus="⨄";const bigvee="⋁";const bigwedge="⋀";const bkarow="⤍";const blacklozenge="⧫";const blacksquare="▪";const blacktriangle="▴";const blacktriangledown="▾";const blacktriangleleft="◂";const blacktriangleright="▸";const blank="␣";const blk12="▒";const blk14="░";const blk34="▓";const block="█";const bne="=⃥";const bnequiv="≡⃥";const bNot="⫭";const bnot="⌐";const Bopf="𝔹";const bopf="𝕓";const bot="⊥";const bottom="⊥";const bowtie="⋈";const boxbox="⧉";const boxdl="┐";const boxdL="╕";const boxDl="╖";const boxDL="╗";const boxdr="┌";const boxdR="╒";const boxDr="╓";const boxDR="╔";const boxh="─";const boxH="═";const boxhd="┬";const boxHd="╤";const boxhD="╥";const boxHD="╦";const boxhu="┴";const boxHu="╧";const boxhU="╨";const boxHU="╩";const boxminus="⊟";const boxplus="⊞";const boxtimes="⊠";const boxul="┘";const boxuL="╛";const boxUl="╜";const boxUL="╝";const boxur="└";const boxuR="╘";const boxUr="╙";const boxUR="╚";const boxv="│";const boxV="║";const boxvh="┼";const boxvH="╪";const boxVh="╫";const boxVH="╬";const boxvl="┤";const boxvL="╡";const boxVl="╢";const boxVL="╣";const boxvr="├";const boxvR="╞";const boxVr="╟";const boxVR="╠";const bprime="‵";const breve="˘";const Breve="˘";const brvbar="¦";const bscr="𝒷";const Bscr="ℬ";const bsemi="⁏";const bsim="∽";const bsime="⋍";const bsolb="⧅";const bsol="\\";const bsolhsub="⟈";const bull="•";const bullet="•";const bump="≎";const bumpE="⪮";const bumpe="≏";const Bumpeq="≎";const bumpeq="≏";const Cacute="Ć";const cacute="ć";const capand="⩄";const capbrcup="⩉";const capcap="⩋";const cap="∩";const Cap="⋒";const capcup="⩇";const capdot="⩀";const CapitalDifferentialD="ⅅ";const caps="∩︀";const caret="⁁";const caron="ˇ";const Cayleys="ℭ";const ccaps="⩍";const Ccaron="Č";const ccaron="č";const Ccedil="Ç";const ccedil="ç";const Ccirc="Ĉ";const ccirc="ĉ";const Cconint="∰";const ccups="⩌";const ccupssm="⩐";const Cdot="Ċ";const cdot="ċ";const cedil="¸";const Cedilla="¸";const cemptyv="⦲";const cent="¢";const centerdot="·";const CenterDot="·";const cfr="𝔠";const Cfr="ℭ";const CHcy="Ч";const chcy="ч";const check="✓";const checkmark="✓";const Chi="Χ";const chi="χ";const circ="ˆ";const circeq="≗";const circlearrowleft="↺";const circlearrowright="↻";const circledast="⊛";const circledcirc="⊚";const circleddash="⊝";const CircleDot="⊙";const circledR="®";const circledS="Ⓢ";const CircleMinus="⊖";const CirclePlus="⊕";const CircleTimes="⊗";const cir="○";const cirE="⧃";const cire="≗";const cirfnint="⨐";const cirmid="⫯";const cirscir="⧂";const ClockwiseContourIntegral="∲";const CloseCurlyDoubleQuote="”";const CloseCurlyQuote="’";const clubs="♣";const clubsuit="♣";const colon=":";const Colon="∷";const Colone="⩴";const colone="≔";const coloneq="≔";const comma=",";const commat="@";const comp="∁";const compfn="∘";const complement="∁";const complexes="ℂ";const cong="≅";const congdot="⩭";const Congruent="≡";const conint="∮";const Conint="∯";const ContourIntegral="∮";const copf="𝕔";const Copf="ℂ";const coprod="∐";const Coproduct="∐";const copy="©";const COPY="©";const copysr="℗";const CounterClockwiseContourIntegral="∳";const crarr="↵";const cross="✗";const Cross="⨯";const Cscr="𝒞";const cscr="𝒸";const csub="⫏";const csube="⫑";const csup="⫐";const csupe="⫒";const ctdot="⋯";const cudarrl="⤸";const cudarrr="⤵";const cuepr="⋞";const cuesc="⋟";const cularr="↶";const cularrp="⤽";const cupbrcap="⩈";const cupcap="⩆";const CupCap="≍";const cup="∪";const Cup="⋓";const cupcup="⩊";const cupdot="⊍";const cupor="⩅";const cups="∪︀";const curarr="↷";const curarrm="⤼";const curlyeqprec="⋞";const curlyeqsucc="⋟";const curlyvee="⋎";const curlywedge="⋏";const curren="¤";const curvearrowleft="↶";const curvearrowright="↷";const cuvee="⋎";const cuwed="⋏";const cwconint="∲";const cwint="∱";const cylcty="⌭";const dagger="†";const Dagger="‡";const daleth="ℸ";const darr="↓";const Darr="↡";const dArr="⇓";const dash="‐";const Dashv="⫤";const dashv="⊣";const dbkarow="⤏";const dblac="˝";const Dcaron="Ď";const dcaron="ď";const Dcy="Д";const dcy="д";const ddagger="‡";const ddarr="⇊";const DD="ⅅ";const dd="ⅆ";const DDotrahd="⤑";const ddotseq="⩷";const deg="°";const Del="∇";const Delta="Δ";const delta="δ";const demptyv="⦱";const dfisht="⥿";const Dfr="𝔇";const dfr="𝔡";const dHar="⥥";const dharl="⇃";const dharr="⇂";const DiacriticalAcute="´";const DiacriticalDot="˙";const DiacriticalDoubleAcute="˝";const DiacriticalGrave="`";const DiacriticalTilde="˜";const diam="⋄";const diamond="⋄";const Diamond="⋄";const diamondsuit="♦";const diams="♦";const die="¨";const DifferentialD="ⅆ";const digamma="ϝ";const disin="⋲";const div="÷";const divide="÷";const divideontimes="⋇";const divonx="⋇";const DJcy="Ђ";const djcy="ђ";const dlcorn="⌞";const dlcrop="⌍";const dollar="$";const Dopf="𝔻";const dopf="𝕕";const Dot="¨";const dot="˙";const DotDot="⃜";const doteq="≐";const doteqdot="≑";const DotEqual="≐";const dotminus="∸";const dotplus="∔";const dotsquare="⊡";const doublebarwedge="⌆";const DoubleContourIntegral="∯";const DoubleDot="¨";const DoubleDownArrow="⇓";const DoubleLeftArrow="⇐";const DoubleLeftRightArrow="⇔";const DoubleLeftTee="⫤";const DoubleLongLeftArrow="⟸";const DoubleLongLeftRightArrow="⟺";const DoubleLongRightArrow="⟹";const DoubleRightArrow="⇒";const DoubleRightTee="⊨";const DoubleUpArrow="⇑";const DoubleUpDownArrow="⇕";const DoubleVerticalBar="∥";const DownArrowBar="⤓";const downarrow="↓";const DownArrow="↓";const Downarrow="⇓";const DownArrowUpArrow="⇵";const DownBreve="̑";const downdownarrows="⇊";const downharpoonleft="⇃";const downharpoonright="⇂";const DownLeftRightVector="⥐";const DownLeftTeeVector="⥞";const DownLeftVectorBar="⥖";const DownLeftVector="↽";const DownRightTeeVector="⥟";const DownRightVectorBar="⥗";const DownRightVector="⇁";const DownTeeArrow="↧";const DownTee="⊤";const drbkarow="⤐";const drcorn="⌟";const drcrop="⌌";const Dscr="𝒟";const dscr="𝒹";const DScy="Ѕ";const dscy="ѕ";const dsol="⧶";const Dstrok="Đ";const dstrok="đ";const dtdot="⋱";const dtri="▿";const dtrif="▾";const duarr="⇵";const duhar="⥯";const dwangle="⦦";const DZcy="Џ";const dzcy="џ";const dzigrarr="⟿";const Eacute="É";const eacute="é";const easter="⩮";const Ecaron="Ě";const ecaron="ě";const Ecirc="Ê";const ecirc="ê";const ecir="≖";const ecolon="≕";const Ecy="Э";const ecy="э";const eDDot="⩷";const Edot="Ė";const edot="ė";const eDot="≑";const ee="ⅇ";const efDot="≒";const Efr="𝔈";const efr="𝔢";const eg="⪚";const Egrave="È";const egrave="è";const egs="⪖";const egsdot="⪘";const el="⪙";const Element="∈";const elinters="⏧";const ell="ℓ";const els="⪕";const elsdot="⪗";const Emacr="Ē";const emacr="ē";const empty="∅";const emptyset="∅";const EmptySmallSquare="◻";const emptyv="∅";const EmptyVerySmallSquare="▫";const emsp13=" ";const emsp14=" ";const emsp=" ";const ENG="Ŋ";const eng="ŋ";const ensp=" ";const Eogon="Ę";const eogon="ę";const Eopf="𝔼";const eopf="𝕖";const epar="⋕";const eparsl="⧣";const eplus="⩱";const epsi="ε";const Epsilon="Ε";const epsilon="ε";const epsiv="ϵ";const eqcirc="≖";const eqcolon="≕";const eqsim="≂";const eqslantgtr="⪖";const eqslantless="⪕";const Equal="⩵";const equals="=";const EqualTilde="≂";const equest="≟";const Equilibrium="⇌";const equiv="≡";const equivDD="⩸";const eqvparsl="⧥";const erarr="⥱";const erDot="≓";const escr="ℯ";const Escr="ℰ";const esdot="≐";const Esim="⩳";const esim="≂";const Eta="Η";const eta="η";const ETH="Ð";const eth="ð";const Euml="Ë";const euml="ë";const euro="€";const excl="!";const exist="∃";const Exists="∃";const expectation="ℰ";const exponentiale="ⅇ";const ExponentialE="ⅇ";const fallingdotseq="≒";const Fcy="Ф";const fcy="ф";const female="♀";const ffilig="ﬃ";const fflig="ﬀ";const ffllig="ﬄ";const Ffr="𝔉";const ffr="𝔣";const filig="ﬁ";const FilledSmallSquare="◼";const FilledVerySmallSquare="▪";const fjlig="fj";const flat="♭";const fllig="ﬂ";const fltns="▱";const fnof="ƒ";const Fopf="𝔽";const fopf="𝕗";const forall="∀";const ForAll="∀";const fork="⋔";const forkv="⫙";const Fouriertrf="ℱ";const fpartint="⨍";const frac12="½";const frac13="⅓";const frac14="¼";const frac15="⅕";const frac16="⅙";const frac18="⅛";const frac23="⅔";const frac25="⅖";const frac34="¾";const frac35="⅗";const frac38="⅜";const frac45="⅘";const frac56="⅚";const frac58="⅝";const frac78="⅞";const frasl="⁄";const frown="⌢";const fscr="𝒻";const Fscr="ℱ";const gacute="ǵ";const Gamma="Γ";const gamma="γ";const Gammad="Ϝ";const gammad="ϝ";const gap="⪆";const Gbreve="Ğ";const gbreve="ğ";const Gcedil="Ģ";const Gcirc="Ĝ";const gcirc="ĝ";const Gcy="Г";const gcy="г";const Gdot="Ġ";const gdot="ġ";const ge="≥";const gE="≧";const gEl="⪌";const gel="⋛";const geq="≥";const geqq="≧";const geqslant="⩾";const gescc="⪩";const ges="⩾";const gesdot="⪀";const gesdoto="⪂";const gesdotol="⪄";const gesl="⋛︀";const gesles="⪔";const Gfr="𝔊";const gfr="𝔤";const gg="≫";const Gg="⋙";const ggg="⋙";const gimel="ℷ";const GJcy="Ѓ";const gjcy="ѓ";const gla="⪥";const gl="≷";const glE="⪒";const glj="⪤";const gnap="⪊";const gnapprox="⪊";const gne="⪈";const gnE="≩";const gneq="⪈";const gneqq="≩";const gnsim="⋧";const Gopf="𝔾";const gopf="𝕘";const grave="`";const GreaterEqual="≥";const GreaterEqualLess="⋛";const GreaterFullEqual="≧";const GreaterGreater="⪢";const GreaterLess="≷";const GreaterSlantEqual="⩾";const GreaterTilde="≳";const Gscr="𝒢";const gscr="ℊ";const gsim="≳";const gsime="⪎";const gsiml="⪐";const gtcc="⪧";const gtcir="⩺";const gt=">";const GT=">";const Gt="≫";const gtdot="⋗";const gtlPar="⦕";const gtquest="⩼";const gtrapprox="⪆";const gtrarr="⥸";const gtrdot="⋗";const gtreqless="⋛";const gtreqqless="⪌";const gtrless="≷";const gtrsim="≳";const gvertneqq="≩︀";const gvnE="≩︀";const Hacek="ˇ";const hairsp=" ";const half="½";const hamilt="ℋ";const HARDcy="Ъ";const hardcy="ъ";const harrcir="⥈";const harr="↔";const hArr="⇔";const harrw="↭";const Hat="^";const hbar="ℏ";const Hcirc="Ĥ";const hcirc="ĥ";const hearts="♥";const heartsuit="♥";const hellip="…";const hercon="⊹";const hfr="𝔥";const Hfr="ℌ";const HilbertSpace="ℋ";const hksearow="⤥";const hkswarow="⤦";const hoarr="⇿";const homtht="∻";const hookleftarrow="↩";const hookrightarrow="↪";const hopf="𝕙";const Hopf="ℍ";const horbar="―";const HorizontalLine="─";const hscr="𝒽";const Hscr="ℋ";const hslash="ℏ";const Hstrok="Ħ";const hstrok="ħ";const HumpDownHump="≎";const HumpEqual="≏";const hybull="⁃";const hyphen="‐";const Iacute="Í";const iacute="í";const ic="⁣";const Icirc="Î";const icirc="î";const Icy="И";const icy="и";const Idot="İ";const IEcy="Е";const iecy="е";const iexcl="¡";const iff="⇔";const ifr="𝔦";const Ifr="ℑ";const Igrave="Ì";const igrave="ì";const ii="ⅈ";const iiiint="⨌";const iiint="∭";const iinfin="⧜";const iiota="℩";const IJlig="Ĳ";const ijlig="ĳ";const Imacr="Ī";const imacr="ī";const image="ℑ";const ImaginaryI="ⅈ";const imagline="ℐ";const imagpart="ℑ";const imath="ı";const Im="ℑ";const imof="⊷";const imped="Ƶ";const Implies="⇒";const incare="℅";const infin="∞";const infintie="⧝";const inodot="ı";const intcal="⊺";const int="∫";const Int="∬";const integers="ℤ";const Integral="∫";const intercal="⊺";const Intersection="⋂";const intlarhk="⨗";const intprod="⨼";const InvisibleComma="⁣";const InvisibleTimes="⁢";const IOcy="Ё";const iocy="ё";const Iogon="Į";const iogon="į";const Iopf="𝕀";const iopf="𝕚";const Iota="Ι";const iota="ι";const iprod="⨼";const iquest="¿";const iscr="𝒾";const Iscr="ℐ";const isin="∈";const isindot="⋵";const isinE="⋹";const isins="⋴";const isinsv="⋳";const isinv="∈";const it="⁢";const Itilde="Ĩ";const itilde="ĩ";const Iukcy="І";const iukcy="і";const Iuml="Ï";const iuml="ï";const Jcirc="Ĵ";const jcirc="ĵ";const Jcy="Й";const jcy="й";const Jfr="𝔍";const jfr="𝔧";const jmath="ȷ";const Jopf="𝕁";const jopf="𝕛";const Jscr="𝒥";const jscr="𝒿";const Jsercy="Ј";const jsercy="ј";const Jukcy="Є";const jukcy="є";const Kappa="Κ";const kappa="κ";const kappav="ϰ";const Kcedil="Ķ";const kcedil="ķ";const Kcy="К";const kcy="к";const Kfr="𝔎";const kfr="𝔨";const kgreen="ĸ";const KHcy="Х";const khcy="х";const KJcy="Ќ";const kjcy="ќ";const Kopf="𝕂";const kopf="𝕜";const Kscr="𝒦";const kscr="𝓀";const lAarr="⇚";const Lacute="Ĺ";const lacute="ĺ";const laemptyv="⦴";const lagran="ℒ";const Lambda="Λ";const lambda="λ";const lang="⟨";const Lang="⟪";const langd="⦑";const langle="⟨";const lap="⪅";const Laplacetrf="ℒ";const laquo="«";const larrb="⇤";const larrbfs="⤟";const larr="←";const Larr="↞";const lArr="⇐";const larrfs="⤝";const larrhk="↩";const larrlp="↫";const larrpl="⤹";const larrsim="⥳";const larrtl="↢";const latail="⤙";const lAtail="⤛";const lat="⪫";const late="⪭";const lates="⪭︀";const lbarr="⤌";const lBarr="⤎";const lbbrk="❲";const lbrace="{";const lbrack="[";const lbrke="⦋";const lbrksld="⦏";const lbrkslu="⦍";const Lcaron="Ľ";const lcaron="ľ";const Lcedil="Ļ";const lcedil="ļ";const lceil="⌈";const lcub="{";const Lcy="Л";const lcy="л";const ldca="⤶";const ldquo="“";const ldquor="„";const ldrdhar="⥧";const ldrushar="⥋";const ldsh="↲";const le="≤";const lE="≦";const LeftAngleBracket="⟨";const LeftArrowBar="⇤";const leftarrow="←";const LeftArrow="←";const Leftarrow="⇐";const LeftArrowRightArrow="⇆";const leftarrowtail="↢";const LeftCeiling="⌈";const LeftDoubleBracket="⟦";const LeftDownTeeVector="⥡";const LeftDownVectorBar="⥙";const LeftDownVector="⇃";const LeftFloor="⌊";const leftharpoondown="↽";const leftharpoonup="↼";const leftleftarrows="⇇";const leftrightarrow="↔";const LeftRightArrow="↔";const Leftrightarrow="⇔";const leftrightarrows="⇆";const leftrightharpoons="⇋";const leftrightsquigarrow="↭";const LeftRightVector="⥎";const LeftTeeArrow="↤";const LeftTee="⊣";const LeftTeeVector="⥚";const leftthreetimes="⋋";const LeftTriangleBar="⧏";const LeftTriangle="⊲";const LeftTriangleEqual="⊴";const LeftUpDownVector="⥑";const LeftUpTeeVector="⥠";const LeftUpVectorBar="⥘";const LeftUpVector="↿";const LeftVectorBar="⥒";const LeftVector="↼";const lEg="⪋";const leg="⋚";const leq="≤";const leqq="≦";const leqslant="⩽";const lescc="⪨";const les="⩽";const lesdot="⩿";const lesdoto="⪁";const lesdotor="⪃";const lesg="⋚︀";const lesges="⪓";const lessapprox="⪅";const lessdot="⋖";const lesseqgtr="⋚";const lesseqqgtr="⪋";const LessEqualGreater="⋚";const LessFullEqual="≦";const LessGreater="≶";const lessgtr="≶";const LessLess="⪡";const lesssim="≲";const LessSlantEqual="⩽";const LessTilde="≲";const lfisht="⥼";const lfloor="⌊";const Lfr="𝔏";const lfr="𝔩";const lg="≶";const lgE="⪑";const lHar="⥢";const lhard="↽";const lharu="↼";const lharul="⥪";const lhblk="▄";const LJcy="Љ";const ljcy="љ";const llarr="⇇";const ll="≪";const Ll="⋘";const llcorner="⌞";const Lleftarrow="⇚";const llhard="⥫";const lltri="◺";const Lmidot="Ŀ";const lmidot="ŀ";const lmoustache="⎰";const lmoust="⎰";const lnap="⪉";const lnapprox="⪉";const lne="⪇";const lnE="≨";const lneq="⪇";const lneqq="≨";const lnsim="⋦";const loang="⟬";const loarr="⇽";const lobrk="⟦";const longleftarrow="⟵";const LongLeftArrow="⟵";const Longleftarrow="⟸";const longleftrightarrow="⟷";const LongLeftRightArrow="⟷";const Longleftrightarrow="⟺";const longmapsto="⟼";const longrightarrow="⟶";const LongRightArrow="⟶";const Longrightarrow="⟹";const looparrowleft="↫";const looparrowright="↬";const lopar="⦅";const Lopf="𝕃";const lopf="𝕝";const loplus="⨭";const lotimes="⨴";const lowast="∗";const lowbar="_";const LowerLeftArrow="↙";const LowerRightArrow="↘";const loz="◊";const lozenge="◊";const lozf="⧫";const lpar="(";const lparlt="⦓";const lrarr="⇆";const lrcorner="⌟";const lrhar="⇋";const lrhard="⥭";const lrm="‎";const lrtri="⊿";const lsaquo="‹";const lscr="𝓁";const Lscr="ℒ";const lsh="↰";const Lsh="↰";const lsim="≲";const lsime="⪍";const lsimg="⪏";const lsqb="[";const lsquo="‘";const lsquor="‚";const Lstrok="Ł";const lstrok="ł";const ltcc="⪦";const ltcir="⩹";const lt="<";const LT="<";const Lt="≪";const ltdot="⋖";const lthree="⋋";const ltimes="⋉";const ltlarr="⥶";const ltquest="⩻";const ltri="◃";const ltrie="⊴";const ltrif="◂";const ltrPar="⦖";const lurdshar="⥊";const luruhar="⥦";const lvertneqq="≨︀";const lvnE="≨︀";const macr="¯";const male="♂";const malt="✠";const maltese="✠";const map="↦";const mapsto="↦";const mapstodown="↧";const mapstoleft="↤";const mapstoup="↥";const marker="▮";const mcomma="⨩";const Mcy="М";const mcy="м";const mdash="—";const mDDot="∺";const measuredangle="∡";const MediumSpace=" ";const Mellintrf="ℳ";const Mfr="𝔐";const mfr="𝔪";const mho="℧";const micro="µ";const midast="*";const midcir="⫰";const mid="∣";const middot="·";const minusb="⊟";const minus="−";const minusd="∸";const minusdu="⨪";const MinusPlus="∓";const mlcp="⫛";const mldr="…";const mnplus="∓";const models="⊧";const Mopf="𝕄";const mopf="𝕞";const mp="∓";const mscr="𝓂";const Mscr="ℳ";const mstpos="∾";const Mu="Μ";const mu="μ";const multimap="⊸";const mumap="⊸";const nabla="∇";const Nacute="Ń";const nacute="ń";const nang="∠⃒";const nap="≉";const napE="⩰̸";const napid="≋̸";const napos="ŉ";const napprox="≉";const natural="♮";const naturals="ℕ";const natur="♮";const nbsp=" ";const nbump="≎̸";const nbumpe="≏̸";const ncap="⩃";const Ncaron="Ň";const ncaron="ň";const Ncedil="Ņ";const ncedil="ņ";const ncong="≇";const ncongdot="⩭̸";const ncup="⩂";const Ncy="Н";const ncy="н";const ndash="–";const nearhk="⤤";const nearr="↗";const neArr="⇗";const nearrow="↗";const ne="≠";const nedot="≐̸";const NegativeMediumSpace="​";const NegativeThickSpace="​";const NegativeThinSpace="​";const NegativeVeryThinSpace="​";const nequiv="≢";const nesear="⤨";const nesim="≂̸";const NestedGreaterGreater="≫";const NestedLessLess="≪";const NewLine="\n";const nexist="∄";const nexists="∄";const Nfr="𝔑";const nfr="𝔫";const ngE="≧̸";const nge="≱";const ngeq="≱";const ngeqq="≧̸";const ngeqslant="⩾̸";const nges="⩾̸";const nGg="⋙̸";const ngsim="≵";const nGt="≫⃒";const ngt="≯";const ngtr="≯";const nGtv="≫̸";const nharr="↮";const nhArr="⇎";const nhpar="⫲";const ni="∋";const nis="⋼";const nisd="⋺";const niv="∋";const NJcy="Њ";const njcy="њ";const nlarr="↚";const nlArr="⇍";const nldr="‥";const nlE="≦̸";const nle="≰";const nleftarrow="↚";const nLeftarrow="⇍";const nleftrightarrow="↮";const nLeftrightarrow="⇎";const nleq="≰";const nleqq="≦̸";const nleqslant="⩽̸";const nles="⩽̸";const nless="≮";const nLl="⋘̸";const nlsim="≴";const nLt="≪⃒";const nlt="≮";const nltri="⋪";const nltrie="⋬";const nLtv="≪̸";const nmid="∤";const NoBreak="⁠";const NonBreakingSpace=" ";const nopf="𝕟";const Nopf="ℕ";const Not="⫬";const not="¬";const NotCongruent="≢";const NotCupCap="≭";const NotDoubleVerticalBar="∦";const NotElement="∉";const NotEqual="≠";const NotEqualTilde="≂̸";const NotExists="∄";const NotGreater="≯";const NotGreaterEqual="≱";const NotGreaterFullEqual="≧̸";const NotGreaterGreater="≫̸";const NotGreaterLess="≹";const NotGreaterSlantEqual="⩾̸";const NotGreaterTilde="≵";const NotHumpDownHump="≎̸";const NotHumpEqual="≏̸";const notin="∉";const notindot="⋵̸";const notinE="⋹̸";const notinva="∉";const notinvb="⋷";const notinvc="⋶";const NotLeftTriangleBar="⧏̸";const NotLeftTriangle="⋪";const NotLeftTriangleEqual="⋬";const NotLess="≮";const NotLessEqual="≰";const NotLessGreater="≸";const NotLessLess="≪̸";const NotLessSlantEqual="⩽̸";const NotLessTilde="≴";const NotNestedGreaterGreater="⪢̸";const NotNestedLessLess="⪡̸";const notni="∌";const notniva="∌";const notnivb="⋾";const notnivc="⋽";const NotPrecedes="⊀";const NotPrecedesEqual="⪯̸";const NotPrecedesSlantEqual="⋠";const NotReverseElement="∌";const NotRightTriangleBar="⧐̸";const NotRightTriangle="⋫";const NotRightTriangleEqual="⋭";const NotSquareSubset="⊏̸";const NotSquareSubsetEqual="⋢";const NotSquareSuperset="⊐̸";const NotSquareSupersetEqual="⋣";const NotSubset="⊂⃒";const NotSubsetEqual="⊈";const NotSucceeds="⊁";const NotSucceedsEqual="⪰̸";const NotSucceedsSlantEqual="⋡";const NotSucceedsTilde="≿̸";const NotSuperset="⊃⃒";const NotSupersetEqual="⊉";const NotTilde="≁";const NotTildeEqual="≄";const NotTildeFullEqual="≇";const NotTildeTilde="≉";const NotVerticalBar="∤";const nparallel="∦";const npar="∦";const nparsl="⫽⃥";const npart="∂̸";const npolint="⨔";const npr="⊀";const nprcue="⋠";const nprec="⊀";const npreceq="⪯̸";const npre="⪯̸";const nrarrc="⤳̸";const nrarr="↛";const nrArr="⇏";const nrarrw="↝̸";const nrightarrow="↛";const nRightarrow="⇏";const nrtri="⋫";const nrtrie="⋭";const nsc="⊁";const nsccue="⋡";const nsce="⪰̸";const Nscr="𝒩";const nscr="𝓃";const nshortmid="∤";const nshortparallel="∦";const nsim="≁";const nsime="≄";const nsimeq="≄";const nsmid="∤";const nspar="∦";const nsqsube="⋢";const nsqsupe="⋣";const nsub="⊄";const nsubE="⫅̸";const nsube="⊈";const nsubset="⊂⃒";const nsubseteq="⊈";const nsubseteqq="⫅̸";const nsucc="⊁";const nsucceq="⪰̸";const nsup="⊅";const nsupE="⫆̸";const nsupe="⊉";const nsupset="⊃⃒";const nsupseteq="⊉";const nsupseteqq="⫆̸";const ntgl="≹";const Ntilde="Ñ";const ntilde="ñ";const ntlg="≸";const ntriangleleft="⋪";const ntrianglelefteq="⋬";const ntriangleright="⋫";const ntrianglerighteq="⋭";const Nu="Ν";const nu="ν";const num="#";const numero="№";const numsp=" ";const nvap="≍⃒";const nvdash="⊬";const nvDash="⊭";const nVdash="⊮";const nVDash="⊯";const nvge="≥⃒";const nvgt=">⃒";const nvHarr="⤄";const nvinfin="⧞";const nvlArr="⤂";const nvle="≤⃒";const nvlt="<⃒";const nvltrie="⊴⃒";const nvrArr="⤃";const nvrtrie="⊵⃒";const nvsim="∼⃒";const nwarhk="⤣";const nwarr="↖";const nwArr="⇖";const nwarrow="↖";const nwnear="⤧";const Oacute="Ó";const oacute="ó";const oast="⊛";const Ocirc="Ô";const ocirc="ô";const ocir="⊚";const Ocy="О";const ocy="о";const odash="⊝";const Odblac="Ő";const odblac="ő";const odiv="⨸";const odot="⊙";const odsold="⦼";const OElig="Œ";const oelig="œ";const ofcir="⦿";const Ofr="𝔒";const ofr="𝔬";const ogon="˛";const Ograve="Ò";const ograve="ò";const ogt="⧁";const ohbar="⦵";const ohm="Ω";const oint="∮";const olarr="↺";const olcir="⦾";const olcross="⦻";const oline="‾";const olt="⧀";const Omacr="Ō";const omacr="ō";const Omega="Ω";const omega="ω";const Omicron="Ο";const omicron="ο";const omid="⦶";const ominus="⊖";const Oopf="𝕆";const oopf="𝕠";const opar="⦷";const OpenCurlyDoubleQuote="“";const OpenCurlyQuote="‘";const operp="⦹";const oplus="⊕";const orarr="↻";const Or="⩔";const or="∨";const ord="⩝";const order="ℴ";const orderof="ℴ";const ordf="ª";const ordm="º";const origof="⊶";const oror="⩖";const orslope="⩗";const orv="⩛";const oS="Ⓢ";const Oscr="𝒪";const oscr="ℴ";const Oslash="Ø";const oslash="ø";const osol="⊘";const Otilde="Õ";const otilde="õ";const otimesas="⨶";const Otimes="⨷";const otimes="⊗";const Ouml="Ö";const ouml="ö";const ovbar="⌽";const OverBar="‾";const OverBrace="⏞";const OverBracket="⎴";const OverParenthesis="⏜";const para="¶";const parallel="∥";const par="∥";const parsim="⫳";const parsl="⫽";const part="∂";const PartialD="∂";const Pcy="П";const pcy="п";const percnt="%";const period=".";const permil="‰";const perp="⊥";const pertenk="‱";const Pfr="𝔓";const pfr="𝔭";const Phi="Φ";const phi="φ";const phiv="ϕ";const phmmat="ℳ";const phone="☎";const Pi="Π";const pi="π";const pitchfork="⋔";const piv="ϖ";const planck="ℏ";const planckh="ℎ";const plankv="ℏ";const plusacir="⨣";const plusb="⊞";const pluscir="⨢";const plus="+";const plusdo="∔";const plusdu="⨥";const pluse="⩲";const PlusMinus="±";const plusmn="±";const plussim="⨦";const plustwo="⨧";const pm="±";const Poincareplane="ℌ";const pointint="⨕";const popf="𝕡";const Popf="ℙ";const pound="£";const prap="⪷";const Pr="⪻";const pr="≺";const prcue="≼";const precapprox="⪷";const prec="≺";const preccurlyeq="≼";const Precedes="≺";const PrecedesEqual="⪯";const PrecedesSlantEqual="≼";const PrecedesTilde="≾";const preceq="⪯";const precnapprox="⪹";const precneqq="⪵";const precnsim="⋨";const pre="⪯";const prE="⪳";const precsim="≾";const prime="′";const Prime="″";const primes="ℙ";const prnap="⪹";const prnE="⪵";const prnsim="⋨";const prod="∏";const Product="∏";const profalar="⌮";const profline="⌒";const profsurf="⌓";const prop="∝";const Proportional="∝";const Proportion="∷";const propto="∝";const prsim="≾";const prurel="⊰";const Pscr="𝒫";const pscr="𝓅";const Psi="Ψ";const psi="ψ";const puncsp=" ";const Qfr="𝔔";const qfr="𝔮";const qint="⨌";const qopf="𝕢";const Qopf="ℚ";const qprime="⁗";const Qscr="𝒬";const qscr="𝓆";const quaternions="ℍ";const quatint="⨖";const quest="?";const questeq="≟";const quot="\"";const QUOT="\"";const rAarr="⇛";const race="∽̱";const Racute="Ŕ";const racute="ŕ";const radic="√";const raemptyv="⦳";const rang="⟩";const Rang="⟫";const rangd="⦒";const range="⦥";const rangle="⟩";const raquo="»";const rarrap="⥵";const rarrb="⇥";const rarrbfs="⤠";const rarrc="⤳";const rarr="→";const Rarr="↠";const rArr="⇒";const rarrfs="⤞";const rarrhk="↪";const rarrlp="↬";const rarrpl="⥅";const rarrsim="⥴";const Rarrtl="⤖";const rarrtl="↣";const rarrw="↝";const ratail="⤚";const rAtail="⤜";const ratio="∶";const rationals="ℚ";const rbarr="⤍";const rBarr="⤏";const RBarr="⤐";const rbbrk="❳";const rbrace="}";const rbrack="]";const rbrke="⦌";const rbrksld="⦎";const rbrkslu="⦐";const Rcaron="Ř";const rcaron="ř";const Rcedil="Ŗ";const rcedil="ŗ";const rceil="⌉";const rcub="}";const Rcy="Р";const rcy="р";const rdca="⤷";const rdldhar="⥩";const rdquo="”";const rdquor="”";const rdsh="↳";const real="ℜ";const realine="ℛ";const realpart="ℜ";const reals="ℝ";const Re="ℜ";const rect="▭";const reg="®";const REG="®";const ReverseElement="∋";const ReverseEquilibrium="⇋";const ReverseUpEquilibrium="⥯";const rfisht="⥽";const rfloor="⌋";const rfr="𝔯";const Rfr="ℜ";const rHar="⥤";const rhard="⇁";const rharu="⇀";const rharul="⥬";const Rho="Ρ";const rho="ρ";const rhov="ϱ";const RightAngleBracket="⟩";const RightArrowBar="⇥";const rightarrow="→";const RightArrow="→";const Rightarrow="⇒";const RightArrowLeftArrow="⇄";const rightarrowtail="↣";const RightCeiling="⌉";const RightDoubleBracket="⟧";const RightDownTeeVector="⥝";const RightDownVectorBar="⥕";const RightDownVector="⇂";const RightFloor="⌋";const rightharpoondown="⇁";const rightharpoonup="⇀";const rightleftarrows="⇄";const rightleftharpoons="⇌";const rightrightarrows="⇉";const rightsquigarrow="↝";const RightTeeArrow="↦";const RightTee="⊢";const RightTeeVector="⥛";const rightthreetimes="⋌";const RightTriangleBar="⧐";const RightTriangle="⊳";const RightTriangleEqual="⊵";const RightUpDownVector="⥏";const RightUpTeeVector="⥜";const RightUpVectorBar="⥔";const RightUpVector="↾";const RightVectorBar="⥓";const RightVector="⇀";const ring="˚";const risingdotseq="≓";const rlarr="⇄";const rlhar="⇌";const rlm="‏";const rmoustache="⎱";const rmoust="⎱";const rnmid="⫮";const roang="⟭";const roarr="⇾";const robrk="⟧";const ropar="⦆";const ropf="𝕣";const Ropf="ℝ";const roplus="⨮";const rotimes="⨵";const RoundImplies="⥰";const rpar=")";const rpargt="⦔";const rppolint="⨒";const rrarr="⇉";const Rrightarrow="⇛";const rsaquo="›";const rscr="𝓇";const Rscr="ℛ";const rsh="↱";const Rsh="↱";const rsqb="]";const rsquo="’";const rsquor="’";const rthree="⋌";const rtimes="⋊";const rtri="▹";const rtrie="⊵";const rtrif="▸";const rtriltri="⧎";const RuleDelayed="⧴";const ruluhar="⥨";const rx="℞";const Sacute="Ś";const sacute="ś";const sbquo="‚";const scap="⪸";const Scaron="Š";const scaron="š";const Sc="⪼";const sc="≻";const sccue="≽";const sce="⪰";const scE="⪴";const Scedil="Ş";const scedil="ş";const Scirc="Ŝ";const scirc="ŝ";const scnap="⪺";const scnE="⪶";const scnsim="⋩";const scpolint="⨓";const scsim="≿";const Scy="С";const scy="с";const sdotb="⊡";const sdot="⋅";const sdote="⩦";const searhk="⤥";const searr="↘";const seArr="⇘";const searrow="↘";const sect="§";const semi=";";const seswar="⤩";const setminus="∖";const setmn="∖";const sext="✶";const Sfr="𝔖";const sfr="𝔰";const sfrown="⌢";const sharp="♯";const SHCHcy="Щ";const shchcy="щ";const SHcy="Ш";const shcy="ш";const ShortDownArrow="↓";const ShortLeftArrow="←";const shortmid="∣";const shortparallel="∥";const ShortRightArrow="→";const ShortUpArrow="↑";const shy="­";const Sigma="Σ";const sigma="σ";const sigmaf="ς";const sigmav="ς";const sim="∼";const simdot="⩪";const sime="≃";const simeq="≃";const simg="⪞";const simgE="⪠";const siml="⪝";const simlE="⪟";const simne="≆";const simplus="⨤";const simrarr="⥲";const slarr="←";const SmallCircle="∘";const smallsetminus="∖";const smashp="⨳";const smeparsl="⧤";const smid="∣";const smile="⌣";const smt="⪪";const smte="⪬";const smtes="⪬︀";const SOFTcy="Ь";const softcy="ь";const solbar="⌿";const solb="⧄";const sol="/";const Sopf="𝕊";const sopf="𝕤";const spades="♠";const spadesuit="♠";const spar="∥";const sqcap="⊓";const sqcaps="⊓︀";const sqcup="⊔";const sqcups="⊔︀";const Sqrt="√";const sqsub="⊏";const sqsube="⊑";const sqsubset="⊏";const sqsubseteq="⊑";const sqsup="⊐";const sqsupe="⊒";const sqsupset="⊐";const sqsupseteq="⊒";const square="□";const Square="□";const SquareIntersection="⊓";const SquareSubset="⊏";const SquareSubsetEqual="⊑";const SquareSuperset="⊐";const SquareSupersetEqual="⊒";const SquareUnion="⊔";const squarf="▪";const squ="□";const squf="▪";const srarr="→";const Sscr="𝒮";const sscr="𝓈";const ssetmn="∖";const ssmile="⌣";const sstarf="⋆";const Star="⋆";const star="☆";const starf="★";const straightepsilon="ϵ";const straightphi="ϕ";const strns="¯";const sub="⊂";const Sub="⋐";const subdot="⪽";const subE="⫅";const sube="⊆";const subedot="⫃";const submult="⫁";const subnE="⫋";const subne="⊊";const subplus="⪿";const subrarr="⥹";const subset="⊂";const Subset="⋐";const subseteq="⊆";const subseteqq="⫅";const SubsetEqual="⊆";const subsetneq="⊊";const subsetneqq="⫋";const subsim="⫇";const subsub="⫕";const subsup="⫓";const succapprox="⪸";const succ="≻";const succcurlyeq="≽";const Succeeds="≻";const SucceedsEqual="⪰";const SucceedsSlantEqual="≽";const SucceedsTilde="≿";const succeq="⪰";const succnapprox="⪺";const succneqq="⪶";const succnsim="⋩";const succsim="≿";const SuchThat="∋";const sum="∑";const Sum="∑";const sung="♪";const sup1="¹";const sup2="²";const sup3="³";const sup="⊃";const Sup="⋑";const supdot="⪾";const supdsub="⫘";const supE="⫆";const supe="⊇";const supedot="⫄";const Superset="⊃";const SupersetEqual="⊇";const suphsol="⟉";const suphsub="⫗";const suplarr="⥻";const supmult="⫂";const supnE="⫌";const supne="⊋";const supplus="⫀";const supset="⊃";const Supset="⋑";const supseteq="⊇";const supseteqq="⫆";const supsetneq="⊋";const supsetneqq="⫌";const supsim="⫈";const supsub="⫔";const supsup="⫖";const swarhk="⤦";const swarr="↙";const swArr="⇙";const swarrow="↙";const swnwar="⤪";const szlig="ß";const Tab="\t";const target="⌖";const Tau="Τ";const tau="τ";const tbrk="⎴";const Tcaron="Ť";const tcaron="ť";const Tcedil="Ţ";const tcedil="ţ";const Tcy="Т";const tcy="т";const tdot="⃛";const telrec="⌕";const Tfr="𝔗";const tfr="𝔱";const there4="∴";const therefore="∴";const Therefore="∴";const Theta="Θ";const theta="θ";const thetasym="ϑ";const thetav="ϑ";const thickapprox="≈";const thicksim="∼";const ThickSpace="  ";const ThinSpace=" ";const thinsp=" ";const thkap="≈";const thksim="∼";const THORN="Þ";const thorn="þ";const tilde="˜";const Tilde="∼";const TildeEqual="≃";const TildeFullEqual="≅";const TildeTilde="≈";const timesbar="⨱";const timesb="⊠";const times="×";const timesd="⨰";const tint="∭";const toea="⤨";const topbot="⌶";const topcir="⫱";const top="⊤";const Topf="𝕋";const topf="𝕥";const topfork="⫚";const tosa="⤩";const tprime="‴";const trade="™";const TRADE="™";const triangle="▵";const triangledown="▿";const triangleleft="◃";const trianglelefteq="⊴";const triangleq="≜";const triangleright="▹";const trianglerighteq="⊵";const tridot="◬";const trie="≜";const triminus="⨺";const TripleDot="⃛";const triplus="⨹";const trisb="⧍";const tritime="⨻";const trpezium="⏢";const Tscr="𝒯";const tscr="𝓉";const TScy="Ц";const tscy="ц";const TSHcy="Ћ";const tshcy="ћ";const Tstrok="Ŧ";const tstrok="ŧ";const twixt="≬";const twoheadleftarrow="↞";const twoheadrightarrow="↠";const Uacute="Ú";const uacute="ú";const uarr="↑";const Uarr="↟";const uArr="⇑";const Uarrocir="⥉";const Ubrcy="Ў";const ubrcy="ў";const Ubreve="Ŭ";const ubreve="ŭ";const Ucirc="Û";const ucirc="û";const Ucy="У";const ucy="у";const udarr="⇅";const Udblac="Ű";const udblac="ű";const udhar="⥮";const ufisht="⥾";const Ufr="𝔘";const ufr="𝔲";const Ugrave="Ù";const ugrave="ù";const uHar="⥣";const uharl="↿";const uharr="↾";const uhblk="▀";const ulcorn="⌜";const ulcorner="⌜";const ulcrop="⌏";const ultri="◸";const Umacr="Ū";const umacr="ū";const uml="¨";const UnderBar="_";const UnderBrace="⏟";const UnderBracket="⎵";const UnderParenthesis="⏝";const Union="⋃";const UnionPlus="⊎";const Uogon="Ų";const uogon="ų";const Uopf="𝕌";const uopf="𝕦";const UpArrowBar="⤒";const uparrow="↑";const UpArrow="↑";const Uparrow="⇑";const UpArrowDownArrow="⇅";const updownarrow="↕";const UpDownArrow="↕";const Updownarrow="⇕";const UpEquilibrium="⥮";const upharpoonleft="↿";const upharpoonright="↾";const uplus="⊎";const UpperLeftArrow="↖";const UpperRightArrow="↗";const upsi="υ";const Upsi="ϒ";const upsih="ϒ";const Upsilon="Υ";const upsilon="υ";const UpTeeArrow="↥";const UpTee="⊥";const upuparrows="⇈";const urcorn="⌝";const urcorner="⌝";const urcrop="⌎";const Uring="Ů";const uring="ů";const urtri="◹";const Uscr="𝒰";const uscr="𝓊";const utdot="⋰";const Utilde="Ũ";const utilde="ũ";const utri="▵";const utrif="▴";const uuarr="⇈";const Uuml="Ü";const uuml="ü";const uwangle="⦧";const vangrt="⦜";const varepsilon="ϵ";const varkappa="ϰ";const varnothing="∅";const varphi="ϕ";const varpi="ϖ";const varpropto="∝";const varr="↕";const vArr="⇕";const varrho="ϱ";const varsigma="ς";const varsubsetneq="⊊︀";const varsubsetneqq="⫋︀";const varsupsetneq="⊋︀";const varsupsetneqq="⫌︀";const vartheta="ϑ";const vartriangleleft="⊲";const vartriangleright="⊳";const vBar="⫨";const Vbar="⫫";const vBarv="⫩";const Vcy="В";const vcy="в";const vdash="⊢";const vDash="⊨";const Vdash="⊩";const VDash="⊫";const Vdashl="⫦";const veebar="⊻";const vee="∨";const Vee="⋁";const veeeq="≚";const vellip="⋮";const verbar="|";const Verbar="‖";const vert="|";const Vert="‖";const VerticalBar="∣";const VerticalLine="|";const VerticalSeparator="❘";const VerticalTilde="≀";const VeryThinSpace=" ";const Vfr="𝔙";const vfr="𝔳";const vltri="⊲";const vnsub="⊂⃒";const vnsup="⊃⃒";const Vopf="𝕍";const vopf="𝕧";const vprop="∝";const vrtri="⊳";const Vscr="𝒱";const vscr="𝓋";const vsubnE="⫋︀";const vsubne="⊊︀";const vsupnE="⫌︀";const vsupne="⊋︀";const Vvdash="⊪";const vzigzag="⦚";const Wcirc="Ŵ";const wcirc="ŵ";const wedbar="⩟";const wedge="∧";const Wedge="⋀";const wedgeq="≙";const weierp="℘";const Wfr="𝔚";const wfr="𝔴";const Wopf="𝕎";const wopf="𝕨";const wp="℘";const wr="≀";const wreath="≀";const Wscr="𝒲";const wscr="𝓌";const xcap="⋂";const xcirc="◯";const xcup="⋃";const xdtri="▽";const Xfr="𝔛";const xfr="𝔵";const xharr="⟷";const xhArr="⟺";const Xi="Ξ";const xi="ξ";const xlarr="⟵";const xlArr="⟸";const xmap="⟼";const xnis="⋻";const xodot="⨀";const Xopf="𝕏";const xopf="𝕩";const xoplus="⨁";const xotime="⨂";const xrarr="⟶";const xrArr="⟹";const Xscr="𝒳";const xscr="𝓍";const xsqcup="⨆";const xuplus="⨄";const xutri="△";const xvee="⋁";const xwedge="⋀";const Yacute="Ý";const yacute="ý";const YAcy="Я";const yacy="я";const Ycirc="Ŷ";const ycirc="ŷ";const Ycy="Ы";const ycy="ы";const yen="¥";const Yfr="𝔜";const yfr="𝔶";const YIcy="Ї";const yicy="ї";const Yopf="𝕐";const yopf="𝕪";const Yscr="𝒴";const yscr="𝓎";const YUcy="Ю";const yucy="ю";const yuml="ÿ";const Yuml="Ÿ";const Zacute="Ź";const zacute="ź";const Zcaron="Ž";const zcaron="ž";const Zcy="З";const zcy="з";const Zdot="Ż";const zdot="ż";const zeetrf="ℨ";const ZeroWidthSpace="​";const Zeta="Ζ";const zeta="ζ";const zfr="𝔷";const Zfr="ℨ";const ZHcy="Ж";const zhcy="ж";const zigrarr="⇝";const zopf="𝕫";const Zopf="ℤ";const Zscr="𝒵";const zscr="𝓏";const zwj="‍";const zwnj="‌";var entities = {Aacute:Aacute,aacute:aacute,Abreve:Abreve,abreve:abreve,ac:ac,acd:acd,acE:acE,Acirc:Acirc,acirc:acirc,acute:acute,Acy:Acy,acy:acy,AElig:AElig,aelig:aelig,af:af,Afr:Afr,afr:afr,Agrave:Agrave,agrave:agrave,alefsym:alefsym,aleph:aleph,Alpha:Alpha,alpha:alpha,Amacr:Amacr,amacr:amacr,amalg:amalg,amp:amp,AMP:AMP,andand:andand,And:And,and:and,andd:andd,andslope:andslope,andv:andv,ang:ang,ange:ange,angle:angle,angmsdaa:angmsdaa,angmsdab:angmsdab,angmsdac:angmsdac,angmsdad:angmsdad,angmsdae:angmsdae,angmsdaf:angmsdaf,angmsdag:angmsdag,angmsdah:angmsdah,angmsd:angmsd,angrt:angrt,angrtvb:angrtvb,angrtvbd:angrtvbd,angsph:angsph,angst:angst,angzarr:angzarr,Aogon:Aogon,aogon:aogon,Aopf:Aopf,aopf:aopf,apacir:apacir,ap:ap,apE:apE,ape:ape,apid:apid,apos:apos,ApplyFunction:ApplyFunction,approx:approx,approxeq:approxeq,Aring:Aring,aring:aring,Ascr:Ascr,ascr:ascr,Assign:Assign,ast:ast,asymp:asymp,asympeq:asympeq,Atilde:Atilde,atilde:atilde,Auml:Auml,auml:auml,awconint:awconint,awint:awint,backcong:backcong,backepsilon:backepsilon,backprime:backprime,backsim:backsim,backsimeq:backsimeq,Backslash:Backslash,Barv:Barv,barvee:barvee,barwed:barwed,Barwed:Barwed,barwedge:barwedge,bbrk:bbrk,bbrktbrk:bbrktbrk,bcong:bcong,Bcy:Bcy,bcy:bcy,bdquo:bdquo,becaus:becaus,because:because,Because:Because,bemptyv:bemptyv,bepsi:bepsi,bernou:bernou,Bernoullis:Bernoullis,Beta:Beta,beta:beta,beth:beth,between:between,Bfr:Bfr,bfr:bfr,bigcap:bigcap,bigcirc:bigcirc,bigcup:bigcup,bigodot:bigodot,bigoplus:bigoplus,bigotimes:bigotimes,bigsqcup:bigsqcup,bigstar:bigstar,bigtriangledown:bigtriangledown,bigtriangleup:bigtriangleup,biguplus:biguplus,bigvee:bigvee,bigwedge:bigwedge,bkarow:bkarow,blacklozenge:blacklozenge,blacksquare:blacksquare,blacktriangle:blacktriangle,blacktriangledown:blacktriangledown,blacktriangleleft:blacktriangleleft,blacktriangleright:blacktriangleright,blank:blank,blk12:blk12,blk14:blk14,blk34:blk34,block:block,bne:bne,bnequiv:bnequiv,bNot:bNot,bnot:bnot,Bopf:Bopf,bopf:bopf,bot:bot,bottom:bottom,bowtie:bowtie,boxbox:boxbox,boxdl:boxdl,boxdL:boxdL,boxDl:boxDl,boxDL:boxDL,boxdr:boxdr,boxdR:boxdR,boxDr:boxDr,boxDR:boxDR,boxh:boxh,boxH:boxH,boxhd:boxhd,boxHd:boxHd,boxhD:boxhD,boxHD:boxHD,boxhu:boxhu,boxHu:boxHu,boxhU:boxhU,boxHU:boxHU,boxminus:boxminus,boxplus:boxplus,boxtimes:boxtimes,boxul:boxul,boxuL:boxuL,boxUl:boxUl,boxUL:boxUL,boxur:boxur,boxuR:boxuR,boxUr:boxUr,boxUR:boxUR,boxv:boxv,boxV:boxV,boxvh:boxvh,boxvH:boxvH,boxVh:boxVh,boxVH:boxVH,boxvl:boxvl,boxvL:boxvL,boxVl:boxVl,boxVL:boxVL,boxvr:boxvr,boxvR:boxvR,boxVr:boxVr,boxVR:boxVR,bprime:bprime,breve:breve,Breve:Breve,brvbar:brvbar,bscr:bscr,Bscr:Bscr,bsemi:bsemi,bsim:bsim,bsime:bsime,bsolb:bsolb,bsol:bsol,bsolhsub:bsolhsub,bull:bull,bullet:bullet,bump:bump,bumpE:bumpE,bumpe:bumpe,Bumpeq:Bumpeq,bumpeq:bumpeq,Cacute:Cacute,cacute:cacute,capand:capand,capbrcup:capbrcup,capcap:capcap,cap:cap,Cap:Cap,capcup:capcup,capdot:capdot,CapitalDifferentialD:CapitalDifferentialD,caps:caps,caret:caret,caron:caron,Cayleys:Cayleys,ccaps:ccaps,Ccaron:Ccaron,ccaron:ccaron,Ccedil:Ccedil,ccedil:ccedil,Ccirc:Ccirc,ccirc:ccirc,Cconint:Cconint,ccups:ccups,ccupssm:ccupssm,Cdot:Cdot,cdot:cdot,cedil:cedil,Cedilla:Cedilla,cemptyv:cemptyv,cent:cent,centerdot:centerdot,CenterDot:CenterDot,cfr:cfr,Cfr:Cfr,CHcy:CHcy,chcy:chcy,check:check,checkmark:checkmark,Chi:Chi,chi:chi,circ:circ,circeq:circeq,circlearrowleft:circlearrowleft,circlearrowright:circlearrowright,circledast:circledast,circledcirc:circledcirc,circleddash:circleddash,CircleDot:CircleDot,circledR:circledR,circledS:circledS,CircleMinus:CircleMinus,CirclePlus:CirclePlus,CircleTimes:CircleTimes,cir:cir,cirE:cirE,cire:cire,cirfnint:cirfnint,cirmid:cirmid,cirscir:cirscir,ClockwiseContourIntegral:ClockwiseContourIntegral,CloseCurlyDoubleQuote:CloseCurlyDoubleQuote,CloseCurlyQuote:CloseCurlyQuote,clubs:clubs,clubsuit:clubsuit,colon:colon,Colon:Colon,Colone:Colone,colone:colone,coloneq:coloneq,comma:comma,commat:commat,comp:comp,compfn:compfn,complement:complement,complexes:complexes,cong:cong,congdot:congdot,Congruent:Congruent,conint:conint,Conint:Conint,ContourIntegral:ContourIntegral,copf:copf,Copf:Copf,coprod:coprod,Coproduct:Coproduct,copy:copy,COPY:COPY,copysr:copysr,CounterClockwiseContourIntegral:CounterClockwiseContourIntegral,crarr:crarr,cross:cross,Cross:Cross,Cscr:Cscr,cscr:cscr,csub:csub,csube:csube,csup:csup,csupe:csupe,ctdot:ctdot,cudarrl:cudarrl,cudarrr:cudarrr,cuepr:cuepr,cuesc:cuesc,cularr:cularr,cularrp:cularrp,cupbrcap:cupbrcap,cupcap:cupcap,CupCap:CupCap,cup:cup,Cup:Cup,cupcup:cupcup,cupdot:cupdot,cupor:cupor,cups:cups,curarr:curarr,curarrm:curarrm,curlyeqprec:curlyeqprec,curlyeqsucc:curlyeqsucc,curlyvee:curlyvee,curlywedge:curlywedge,curren:curren,curvearrowleft:curvearrowleft,curvearrowright:curvearrowright,cuvee:cuvee,cuwed:cuwed,cwconint:cwconint,cwint:cwint,cylcty:cylcty,dagger:dagger,Dagger:Dagger,daleth:daleth,darr:darr,Darr:Darr,dArr:dArr,dash:dash,Dashv:Dashv,dashv:dashv,dbkarow:dbkarow,dblac:dblac,Dcaron:Dcaron,dcaron:dcaron,Dcy:Dcy,dcy:dcy,ddagger:ddagger,ddarr:ddarr,DD:DD,dd:dd,DDotrahd:DDotrahd,ddotseq:ddotseq,deg:deg,Del:Del,Delta:Delta,delta:delta,demptyv:demptyv,dfisht:dfisht,Dfr:Dfr,dfr:dfr,dHar:dHar,dharl:dharl,dharr:dharr,DiacriticalAcute:DiacriticalAcute,DiacriticalDot:DiacriticalDot,DiacriticalDoubleAcute:DiacriticalDoubleAcute,DiacriticalGrave:DiacriticalGrave,DiacriticalTilde:DiacriticalTilde,diam:diam,diamond:diamond,Diamond:Diamond,diamondsuit:diamondsuit,diams:diams,die:die,DifferentialD:DifferentialD,digamma:digamma,disin:disin,div:div,divide:divide,divideontimes:divideontimes,divonx:divonx,DJcy:DJcy,djcy:djcy,dlcorn:dlcorn,dlcrop:dlcrop,dollar:dollar,Dopf:Dopf,dopf:dopf,Dot:Dot,dot:dot,DotDot:DotDot,doteq:doteq,doteqdot:doteqdot,DotEqual:DotEqual,dotminus:dotminus,dotplus:dotplus,dotsquare:dotsquare,doublebarwedge:doublebarwedge,DoubleContourIntegral:DoubleContourIntegral,DoubleDot:DoubleDot,DoubleDownArrow:DoubleDownArrow,DoubleLeftArrow:DoubleLeftArrow,DoubleLeftRightArrow:DoubleLeftRightArrow,DoubleLeftTee:DoubleLeftTee,DoubleLongLeftArrow:DoubleLongLeftArrow,DoubleLongLeftRightArrow:DoubleLongLeftRightArrow,DoubleLongRightArrow:DoubleLongRightArrow,DoubleRightArrow:DoubleRightArrow,DoubleRightTee:DoubleRightTee,DoubleUpArrow:DoubleUpArrow,DoubleUpDownArrow:DoubleUpDownArrow,DoubleVerticalBar:DoubleVerticalBar,DownArrowBar:DownArrowBar,downarrow:downarrow,DownArrow:DownArrow,Downarrow:Downarrow,DownArrowUpArrow:DownArrowUpArrow,DownBreve:DownBreve,downdownarrows:downdownarrows,downharpoonleft:downharpoonleft,downharpoonright:downharpoonright,DownLeftRightVector:DownLeftRightVector,DownLeftTeeVector:DownLeftTeeVector,DownLeftVectorBar:DownLeftVectorBar,DownLeftVector:DownLeftVector,DownRightTeeVector:DownRightTeeVector,DownRightVectorBar:DownRightVectorBar,DownRightVector:DownRightVector,DownTeeArrow:DownTeeArrow,DownTee:DownTee,drbkarow:drbkarow,drcorn:drcorn,drcrop:drcrop,Dscr:Dscr,dscr:dscr,DScy:DScy,dscy:dscy,dsol:dsol,Dstrok:Dstrok,dstrok:dstrok,dtdot:dtdot,dtri:dtri,dtrif:dtrif,duarr:duarr,duhar:duhar,dwangle:dwangle,DZcy:DZcy,dzcy:dzcy,dzigrarr:dzigrarr,Eacute:Eacute,eacute:eacute,easter:easter,Ecaron:Ecaron,ecaron:ecaron,Ecirc:Ecirc,ecirc:ecirc,ecir:ecir,ecolon:ecolon,Ecy:Ecy,ecy:ecy,eDDot:eDDot,Edot:Edot,edot:edot,eDot:eDot,ee:ee,efDot:efDot,Efr:Efr,efr:efr,eg:eg,Egrave:Egrave,egrave:egrave,egs:egs,egsdot:egsdot,el:el,Element:Element,elinters:elinters,ell:ell,els:els,elsdot:elsdot,Emacr:Emacr,emacr:emacr,empty:empty,emptyset:emptyset,EmptySmallSquare:EmptySmallSquare,emptyv:emptyv,EmptyVerySmallSquare:EmptyVerySmallSquare,emsp13:emsp13,emsp14:emsp14,emsp:emsp,ENG:ENG,eng:eng,ensp:ensp,Eogon:Eogon,eogon:eogon,Eopf:Eopf,eopf:eopf,epar:epar,eparsl:eparsl,eplus:eplus,epsi:epsi,Epsilon:Epsilon,epsilon:epsilon,epsiv:epsiv,eqcirc:eqcirc,eqcolon:eqcolon,eqsim:eqsim,eqslantgtr:eqslantgtr,eqslantless:eqslantless,Equal:Equal,equals:equals,EqualTilde:EqualTilde,equest:equest,Equilibrium:Equilibrium,equiv:equiv,equivDD:equivDD,eqvparsl:eqvparsl,erarr:erarr,erDot:erDot,escr:escr,Escr:Escr,esdot:esdot,Esim:Esim,esim:esim,Eta:Eta,eta:eta,ETH:ETH,eth:eth,Euml:Euml,euml:euml,euro:euro,excl:excl,exist:exist,Exists:Exists,expectation:expectation,exponentiale:exponentiale,ExponentialE:ExponentialE,fallingdotseq:fallingdotseq,Fcy:Fcy,fcy:fcy,female:female,ffilig:ffilig,fflig:fflig,ffllig:ffllig,Ffr:Ffr,ffr:ffr,filig:filig,FilledSmallSquare:FilledSmallSquare,FilledVerySmallSquare:FilledVerySmallSquare,fjlig:fjlig,flat:flat,fllig:fllig,fltns:fltns,fnof:fnof,Fopf:Fopf,fopf:fopf,forall:forall,ForAll:ForAll,fork:fork,forkv:forkv,Fouriertrf:Fouriertrf,fpartint:fpartint,frac12:frac12,frac13:frac13,frac14:frac14,frac15:frac15,frac16:frac16,frac18:frac18,frac23:frac23,frac25:frac25,frac34:frac34,frac35:frac35,frac38:frac38,frac45:frac45,frac56:frac56,frac58:frac58,frac78:frac78,frasl:frasl,frown:frown,fscr:fscr,Fscr:Fscr,gacute:gacute,Gamma:Gamma,gamma:gamma,Gammad:Gammad,gammad:gammad,gap:gap,Gbreve:Gbreve,gbreve:gbreve,Gcedil:Gcedil,Gcirc:Gcirc,gcirc:gcirc,Gcy:Gcy,gcy:gcy,Gdot:Gdot,gdot:gdot,ge:ge,gE:gE,gEl:gEl,gel:gel,geq:geq,geqq:geqq,geqslant:geqslant,gescc:gescc,ges:ges,gesdot:gesdot,gesdoto:gesdoto,gesdotol:gesdotol,gesl:gesl,gesles:gesles,Gfr:Gfr,gfr:gfr,gg:gg,Gg:Gg,ggg:ggg,gimel:gimel,GJcy:GJcy,gjcy:gjcy,gla:gla,gl:gl,glE:glE,glj:glj,gnap:gnap,gnapprox:gnapprox,gne:gne,gnE:gnE,gneq:gneq,gneqq:gneqq,gnsim:gnsim,Gopf:Gopf,gopf:gopf,grave:grave,GreaterEqual:GreaterEqual,GreaterEqualLess:GreaterEqualLess,GreaterFullEqual:GreaterFullEqual,GreaterGreater:GreaterGreater,GreaterLess:GreaterLess,GreaterSlantEqual:GreaterSlantEqual,GreaterTilde:GreaterTilde,Gscr:Gscr,gscr:gscr,gsim:gsim,gsime:gsime,gsiml:gsiml,gtcc:gtcc,gtcir:gtcir,gt:gt,GT:GT,Gt:Gt,gtdot:gtdot,gtlPar:gtlPar,gtquest:gtquest,gtrapprox:gtrapprox,gtrarr:gtrarr,gtrdot:gtrdot,gtreqless:gtreqless,gtreqqless:gtreqqless,gtrless:gtrless,gtrsim:gtrsim,gvertneqq:gvertneqq,gvnE:gvnE,Hacek:Hacek,hairsp:hairsp,half:half,hamilt:hamilt,HARDcy:HARDcy,hardcy:hardcy,harrcir:harrcir,harr:harr,hArr:hArr,harrw:harrw,Hat:Hat,hbar:hbar,Hcirc:Hcirc,hcirc:hcirc,hearts:hearts,heartsuit:heartsuit,hellip:hellip,hercon:hercon,hfr:hfr,Hfr:Hfr,HilbertSpace:HilbertSpace,hksearow:hksearow,hkswarow:hkswarow,hoarr:hoarr,homtht:homtht,hookleftarrow:hookleftarrow,hookrightarrow:hookrightarrow,hopf:hopf,Hopf:Hopf,horbar:horbar,HorizontalLine:HorizontalLine,hscr:hscr,Hscr:Hscr,hslash:hslash,Hstrok:Hstrok,hstrok:hstrok,HumpDownHump:HumpDownHump,HumpEqual:HumpEqual,hybull:hybull,hyphen:hyphen,Iacute:Iacute,iacute:iacute,ic:ic,Icirc:Icirc,icirc:icirc,Icy:Icy,icy:icy,Idot:Idot,IEcy:IEcy,iecy:iecy,iexcl:iexcl,iff:iff,ifr:ifr,Ifr:Ifr,Igrave:Igrave,igrave:igrave,ii:ii,iiiint:iiiint,iiint:iiint,iinfin:iinfin,iiota:iiota,IJlig:IJlig,ijlig:ijlig,Imacr:Imacr,imacr:imacr,image:image,ImaginaryI:ImaginaryI,imagline:imagline,imagpart:imagpart,imath:imath,Im:Im,imof:imof,imped:imped,Implies:Implies,incare:incare,"in":"∈",infin:infin,infintie:infintie,inodot:inodot,intcal:intcal,int:int,Int:Int,integers:integers,Integral:Integral,intercal:intercal,Intersection:Intersection,intlarhk:intlarhk,intprod:intprod,InvisibleComma:InvisibleComma,InvisibleTimes:InvisibleTimes,IOcy:IOcy,iocy:iocy,Iogon:Iogon,iogon:iogon,Iopf:Iopf,iopf:iopf,Iota:Iota,iota:iota,iprod:iprod,iquest:iquest,iscr:iscr,Iscr:Iscr,isin:isin,isindot:isindot,isinE:isinE,isins:isins,isinsv:isinsv,isinv:isinv,it:it,Itilde:Itilde,itilde:itilde,Iukcy:Iukcy,iukcy:iukcy,Iuml:Iuml,iuml:iuml,Jcirc:Jcirc,jcirc:jcirc,Jcy:Jcy,jcy:jcy,Jfr:Jfr,jfr:jfr,jmath:jmath,Jopf:Jopf,jopf:jopf,Jscr:Jscr,jscr:jscr,Jsercy:Jsercy,jsercy:jsercy,Jukcy:Jukcy,jukcy:jukcy,Kappa:Kappa,kappa:kappa,kappav:kappav,Kcedil:Kcedil,kcedil:kcedil,Kcy:Kcy,kcy:kcy,Kfr:Kfr,kfr:kfr,kgreen:kgreen,KHcy:KHcy,khcy:khcy,KJcy:KJcy,kjcy:kjcy,Kopf:Kopf,kopf:kopf,Kscr:Kscr,kscr:kscr,lAarr:lAarr,Lacute:Lacute,lacute:lacute,laemptyv:laemptyv,lagran:lagran,Lambda:Lambda,lambda:lambda,lang:lang,Lang:Lang,langd:langd,langle:langle,lap:lap,Laplacetrf:Laplacetrf,laquo:laquo,larrb:larrb,larrbfs:larrbfs,larr:larr,Larr:Larr,lArr:lArr,larrfs:larrfs,larrhk:larrhk,larrlp:larrlp,larrpl:larrpl,larrsim:larrsim,larrtl:larrtl,latail:latail,lAtail:lAtail,lat:lat,late:late,lates:lates,lbarr:lbarr,lBarr:lBarr,lbbrk:lbbrk,lbrace:lbrace,lbrack:lbrack,lbrke:lbrke,lbrksld:lbrksld,lbrkslu:lbrkslu,Lcaron:Lcaron,lcaron:lcaron,Lcedil:Lcedil,lcedil:lcedil,lceil:lceil,lcub:lcub,Lcy:Lcy,lcy:lcy,ldca:ldca,ldquo:ldquo,ldquor:ldquor,ldrdhar:ldrdhar,ldrushar:ldrushar,ldsh:ldsh,le:le,lE:lE,LeftAngleBracket:LeftAngleBracket,LeftArrowBar:LeftArrowBar,leftarrow:leftarrow,LeftArrow:LeftArrow,Leftarrow:Leftarrow,LeftArrowRightArrow:LeftArrowRightArrow,leftarrowtail:leftarrowtail,LeftCeiling:LeftCeiling,LeftDoubleBracket:LeftDoubleBracket,LeftDownTeeVector:LeftDownTeeVector,LeftDownVectorBar:LeftDownVectorBar,LeftDownVector:LeftDownVector,LeftFloor:LeftFloor,leftharpoondown:leftharpoondown,leftharpoonup:leftharpoonup,leftleftarrows:leftleftarrows,leftrightarrow:leftrightarrow,LeftRightArrow:LeftRightArrow,Leftrightarrow:Leftrightarrow,leftrightarrows:leftrightarrows,leftrightharpoons:leftrightharpoons,leftrightsquigarrow:leftrightsquigarrow,LeftRightVector:LeftRightVector,LeftTeeArrow:LeftTeeArrow,LeftTee:LeftTee,LeftTeeVector:LeftTeeVector,leftthreetimes:leftthreetimes,LeftTriangleBar:LeftTriangleBar,LeftTriangle:LeftTriangle,LeftTriangleEqual:LeftTriangleEqual,LeftUpDownVector:LeftUpDownVector,LeftUpTeeVector:LeftUpTeeVector,LeftUpVectorBar:LeftUpVectorBar,LeftUpVector:LeftUpVector,LeftVectorBar:LeftVectorBar,LeftVector:LeftVector,lEg:lEg,leg:leg,leq:leq,leqq:leqq,leqslant:leqslant,lescc:lescc,les:les,lesdot:lesdot,lesdoto:lesdoto,lesdotor:lesdotor,lesg:lesg,lesges:lesges,lessapprox:lessapprox,lessdot:lessdot,lesseqgtr:lesseqgtr,lesseqqgtr:lesseqqgtr,LessEqualGreater:LessEqualGreater,LessFullEqual:LessFullEqual,LessGreater:LessGreater,lessgtr:lessgtr,LessLess:LessLess,lesssim:lesssim,LessSlantEqual:LessSlantEqual,LessTilde:LessTilde,lfisht:lfisht,lfloor:lfloor,Lfr:Lfr,lfr:lfr,lg:lg,lgE:lgE,lHar:lHar,lhard:lhard,lharu:lharu,lharul:lharul,lhblk:lhblk,LJcy:LJcy,ljcy:ljcy,llarr:llarr,ll:ll,Ll:Ll,llcorner:llcorner,Lleftarrow:Lleftarrow,llhard:llhard,lltri:lltri,Lmidot:Lmidot,lmidot:lmidot,lmoustache:lmoustache,lmoust:lmoust,lnap:lnap,lnapprox:lnapprox,lne:lne,lnE:lnE,lneq:lneq,lneqq:lneqq,lnsim:lnsim,loang:loang,loarr:loarr,lobrk:lobrk,longleftarrow:longleftarrow,LongLeftArrow:LongLeftArrow,Longleftarrow:Longleftarrow,longleftrightarrow:longleftrightarrow,LongLeftRightArrow:LongLeftRightArrow,Longleftrightarrow:Longleftrightarrow,longmapsto:longmapsto,longrightarrow:longrightarrow,LongRightArrow:LongRightArrow,Longrightarrow:Longrightarrow,looparrowleft:looparrowleft,looparrowright:looparrowright,lopar:lopar,Lopf:Lopf,lopf:lopf,loplus:loplus,lotimes:lotimes,lowast:lowast,lowbar:lowbar,LowerLeftArrow:LowerLeftArrow,LowerRightArrow:LowerRightArrow,loz:loz,lozenge:lozenge,lozf:lozf,lpar:lpar,lparlt:lparlt,lrarr:lrarr,lrcorner:lrcorner,lrhar:lrhar,lrhard:lrhard,lrm:lrm,lrtri:lrtri,lsaquo:lsaquo,lscr:lscr,Lscr:Lscr,lsh:lsh,Lsh:Lsh,lsim:lsim,lsime:lsime,lsimg:lsimg,lsqb:lsqb,lsquo:lsquo,lsquor:lsquor,Lstrok:Lstrok,lstrok:lstrok,ltcc:ltcc,ltcir:ltcir,lt:lt,LT:LT,Lt:Lt,ltdot:ltdot,lthree:lthree,ltimes:ltimes,ltlarr:ltlarr,ltquest:ltquest,ltri:ltri,ltrie:ltrie,ltrif:ltrif,ltrPar:ltrPar,lurdshar:lurdshar,luruhar:luruhar,lvertneqq:lvertneqq,lvnE:lvnE,macr:macr,male:male,malt:malt,maltese:maltese,"Map":"⤅",map:map,mapsto:mapsto,mapstodown:mapstodown,mapstoleft:mapstoleft,mapstoup:mapstoup,marker:marker,mcomma:mcomma,Mcy:Mcy,mcy:mcy,mdash:mdash,mDDot:mDDot,measuredangle:measuredangle,MediumSpace:MediumSpace,Mellintrf:Mellintrf,Mfr:Mfr,mfr:mfr,mho:mho,micro:micro,midast:midast,midcir:midcir,mid:mid,middot:middot,minusb:minusb,minus:minus,minusd:minusd,minusdu:minusdu,MinusPlus:MinusPlus,mlcp:mlcp,mldr:mldr,mnplus:mnplus,models:models,Mopf:Mopf,mopf:mopf,mp:mp,mscr:mscr,Mscr:Mscr,mstpos:mstpos,Mu:Mu,mu:mu,multimap:multimap,mumap:mumap,nabla:nabla,Nacute:Nacute,nacute:nacute,nang:nang,nap:nap,napE:napE,napid:napid,napos:napos,napprox:napprox,natural:natural,naturals:naturals,natur:natur,nbsp:nbsp,nbump:nbump,nbumpe:nbumpe,ncap:ncap,Ncaron:Ncaron,ncaron:ncaron,Ncedil:Ncedil,ncedil:ncedil,ncong:ncong,ncongdot:ncongdot,ncup:ncup,Ncy:Ncy,ncy:ncy,ndash:ndash,nearhk:nearhk,nearr:nearr,neArr:neArr,nearrow:nearrow,ne:ne,nedot:nedot,NegativeMediumSpace:NegativeMediumSpace,NegativeThickSpace:NegativeThickSpace,NegativeThinSpace:NegativeThinSpace,NegativeVeryThinSpace:NegativeVeryThinSpace,nequiv:nequiv,nesear:nesear,nesim:nesim,NestedGreaterGreater:NestedGreaterGreater,NestedLessLess:NestedLessLess,NewLine:NewLine,nexist:nexist,nexists:nexists,Nfr:Nfr,nfr:nfr,ngE:ngE,nge:nge,ngeq:ngeq,ngeqq:ngeqq,ngeqslant:ngeqslant,nges:nges,nGg:nGg,ngsim:ngsim,nGt:nGt,ngt:ngt,ngtr:ngtr,nGtv:nGtv,nharr:nharr,nhArr:nhArr,nhpar:nhpar,ni:ni,nis:nis,nisd:nisd,niv:niv,NJcy:NJcy,njcy:njcy,nlarr:nlarr,nlArr:nlArr,nldr:nldr,nlE:nlE,nle:nle,nleftarrow:nleftarrow,nLeftarrow:nLeftarrow,nleftrightarrow:nleftrightarrow,nLeftrightarrow:nLeftrightarrow,nleq:nleq,nleqq:nleqq,nleqslant:nleqslant,nles:nles,nless:nless,nLl:nLl,nlsim:nlsim,nLt:nLt,nlt:nlt,nltri:nltri,nltrie:nltrie,nLtv:nLtv,nmid:nmid,NoBreak:NoBreak,NonBreakingSpace:NonBreakingSpace,nopf:nopf,Nopf:Nopf,Not:Not,not:not,NotCongruent:NotCongruent,NotCupCap:NotCupCap,NotDoubleVerticalBar:NotDoubleVerticalBar,NotElement:NotElement,NotEqual:NotEqual,NotEqualTilde:NotEqualTilde,NotExists:NotExists,NotGreater:NotGreater,NotGreaterEqual:NotGreaterEqual,NotGreaterFullEqual:NotGreaterFullEqual,NotGreaterGreater:NotGreaterGreater,NotGreaterLess:NotGreaterLess,NotGreaterSlantEqual:NotGreaterSlantEqual,NotGreaterTilde:NotGreaterTilde,NotHumpDownHump:NotHumpDownHump,NotHumpEqual:NotHumpEqual,notin:notin,notindot:notindot,notinE:notinE,notinva:notinva,notinvb:notinvb,notinvc:notinvc,NotLeftTriangleBar:NotLeftTriangleBar,NotLeftTriangle:NotLeftTriangle,NotLeftTriangleEqual:NotLeftTriangleEqual,NotLess:NotLess,NotLessEqual:NotLessEqual,NotLessGreater:NotLessGreater,NotLessLess:NotLessLess,NotLessSlantEqual:NotLessSlantEqual,NotLessTilde:NotLessTilde,NotNestedGreaterGreater:NotNestedGreaterGreater,NotNestedLessLess:NotNestedLessLess,notni:notni,notniva:notniva,notnivb:notnivb,notnivc:notnivc,NotPrecedes:NotPrecedes,NotPrecedesEqual:NotPrecedesEqual,NotPrecedesSlantEqual:NotPrecedesSlantEqual,NotReverseElement:NotReverseElement,NotRightTriangleBar:NotRightTriangleBar,NotRightTriangle:NotRightTriangle,NotRightTriangleEqual:NotRightTriangleEqual,NotSquareSubset:NotSquareSubset,NotSquareSubsetEqual:NotSquareSubsetEqual,NotSquareSuperset:NotSquareSuperset,NotSquareSupersetEqual:NotSquareSupersetEqual,NotSubset:NotSubset,NotSubsetEqual:NotSubsetEqual,NotSucceeds:NotSucceeds,NotSucceedsEqual:NotSucceedsEqual,NotSucceedsSlantEqual:NotSucceedsSlantEqual,NotSucceedsTilde:NotSucceedsTilde,NotSuperset:NotSuperset,NotSupersetEqual:NotSupersetEqual,NotTilde:NotTilde,NotTildeEqual:NotTildeEqual,NotTildeFullEqual:NotTildeFullEqual,NotTildeTilde:NotTildeTilde,NotVerticalBar:NotVerticalBar,nparallel:nparallel,npar:npar,nparsl:nparsl,npart:npart,npolint:npolint,npr:npr,nprcue:nprcue,nprec:nprec,npreceq:npreceq,npre:npre,nrarrc:nrarrc,nrarr:nrarr,nrArr:nrArr,nrarrw:nrarrw,nrightarrow:nrightarrow,nRightarrow:nRightarrow,nrtri:nrtri,nrtrie:nrtrie,nsc:nsc,nsccue:nsccue,nsce:nsce,Nscr:Nscr,nscr:nscr,nshortmid:nshortmid,nshortparallel:nshortparallel,nsim:nsim,nsime:nsime,nsimeq:nsimeq,nsmid:nsmid,nspar:nspar,nsqsube:nsqsube,nsqsupe:nsqsupe,nsub:nsub,nsubE:nsubE,nsube:nsube,nsubset:nsubset,nsubseteq:nsubseteq,nsubseteqq:nsubseteqq,nsucc:nsucc,nsucceq:nsucceq,nsup:nsup,nsupE:nsupE,nsupe:nsupe,nsupset:nsupset,nsupseteq:nsupseteq,nsupseteqq:nsupseteqq,ntgl:ntgl,Ntilde:Ntilde,ntilde:ntilde,ntlg:ntlg,ntriangleleft:ntriangleleft,ntrianglelefteq:ntrianglelefteq,ntriangleright:ntriangleright,ntrianglerighteq:ntrianglerighteq,Nu:Nu,nu:nu,num:num,numero:numero,numsp:numsp,nvap:nvap,nvdash:nvdash,nvDash:nvDash,nVdash:nVdash,nVDash:nVDash,nvge:nvge,nvgt:nvgt,nvHarr:nvHarr,nvinfin:nvinfin,nvlArr:nvlArr,nvle:nvle,nvlt:nvlt,nvltrie:nvltrie,nvrArr:nvrArr,nvrtrie:nvrtrie,nvsim:nvsim,nwarhk:nwarhk,nwarr:nwarr,nwArr:nwArr,nwarrow:nwarrow,nwnear:nwnear,Oacute:Oacute,oacute:oacute,oast:oast,Ocirc:Ocirc,ocirc:ocirc,ocir:ocir,Ocy:Ocy,ocy:ocy,odash:odash,Odblac:Odblac,odblac:odblac,odiv:odiv,odot:odot,odsold:odsold,OElig:OElig,oelig:oelig,ofcir:ofcir,Ofr:Ofr,ofr:ofr,ogon:ogon,Ograve:Ograve,ograve:ograve,ogt:ogt,ohbar:ohbar,ohm:ohm,oint:oint,olarr:olarr,olcir:olcir,olcross:olcross,oline:oline,olt:olt,Omacr:Omacr,omacr:omacr,Omega:Omega,omega:omega,Omicron:Omicron,omicron:omicron,omid:omid,ominus:ominus,Oopf:Oopf,oopf:oopf,opar:opar,OpenCurlyDoubleQuote:OpenCurlyDoubleQuote,OpenCurlyQuote:OpenCurlyQuote,operp:operp,oplus:oplus,orarr:orarr,Or:Or,or:or,ord:ord,order:order,orderof:orderof,ordf:ordf,ordm:ordm,origof:origof,oror:oror,orslope:orslope,orv:orv,oS:oS,Oscr:Oscr,oscr:oscr,Oslash:Oslash,oslash:oslash,osol:osol,Otilde:Otilde,otilde:otilde,otimesas:otimesas,Otimes:Otimes,otimes:otimes,Ouml:Ouml,ouml:ouml,ovbar:ovbar,OverBar:OverBar,OverBrace:OverBrace,OverBracket:OverBracket,OverParenthesis:OverParenthesis,para:para,parallel:parallel,par:par,parsim:parsim,parsl:parsl,part:part,PartialD:PartialD,Pcy:Pcy,pcy:pcy,percnt:percnt,period:period,permil:permil,perp:perp,pertenk:pertenk,Pfr:Pfr,pfr:pfr,Phi:Phi,phi:phi,phiv:phiv,phmmat:phmmat,phone:phone,Pi:Pi,pi:pi,pitchfork:pitchfork,piv:piv,planck:planck,planckh:planckh,plankv:plankv,plusacir:plusacir,plusb:plusb,pluscir:pluscir,plus:plus,plusdo:plusdo,plusdu:plusdu,pluse:pluse,PlusMinus:PlusMinus,plusmn:plusmn,plussim:plussim,plustwo:plustwo,pm:pm,Poincareplane:Poincareplane,pointint:pointint,popf:popf,Popf:Popf,pound:pound,prap:prap,Pr:Pr,pr:pr,prcue:prcue,precapprox:precapprox,prec:prec,preccurlyeq:preccurlyeq,Precedes:Precedes,PrecedesEqual:PrecedesEqual,PrecedesSlantEqual:PrecedesSlantEqual,PrecedesTilde:PrecedesTilde,preceq:preceq,precnapprox:precnapprox,precneqq:precneqq,precnsim:precnsim,pre:pre,prE:prE,precsim:precsim,prime:prime,Prime:Prime,primes:primes,prnap:prnap,prnE:prnE,prnsim:prnsim,prod:prod,Product:Product,profalar:profalar,profline:profline,profsurf:profsurf,prop:prop,Proportional:Proportional,Proportion:Proportion,propto:propto,prsim:prsim,prurel:prurel,Pscr:Pscr,pscr:pscr,Psi:Psi,psi:psi,puncsp:puncsp,Qfr:Qfr,qfr:qfr,qint:qint,qopf:qopf,Qopf:Qopf,qprime:qprime,Qscr:Qscr,qscr:qscr,quaternions:quaternions,quatint:quatint,quest:quest,questeq:questeq,quot:quot,QUOT:QUOT,rAarr:rAarr,race:race,Racute:Racute,racute:racute,radic:radic,raemptyv:raemptyv,rang:rang,Rang:Rang,rangd:rangd,range:range,rangle:rangle,raquo:raquo,rarrap:rarrap,rarrb:rarrb,rarrbfs:rarrbfs,rarrc:rarrc,rarr:rarr,Rarr:Rarr,rArr:rArr,rarrfs:rarrfs,rarrhk:rarrhk,rarrlp:rarrlp,rarrpl:rarrpl,rarrsim:rarrsim,Rarrtl:Rarrtl,rarrtl:rarrtl,rarrw:rarrw,ratail:ratail,rAtail:rAtail,ratio:ratio,rationals:rationals,rbarr:rbarr,rBarr:rBarr,RBarr:RBarr,rbbrk:rbbrk,rbrace:rbrace,rbrack:rbrack,rbrke:rbrke,rbrksld:rbrksld,rbrkslu:rbrkslu,Rcaron:Rcaron,rcaron:rcaron,Rcedil:Rcedil,rcedil:rcedil,rceil:rceil,rcub:rcub,Rcy:Rcy,rcy:rcy,rdca:rdca,rdldhar:rdldhar,rdquo:rdquo,rdquor:rdquor,rdsh:rdsh,real:real,realine:realine,realpart:realpart,reals:reals,Re:Re,rect:rect,reg:reg,REG:REG,ReverseElement:ReverseElement,ReverseEquilibrium:ReverseEquilibrium,ReverseUpEquilibrium:ReverseUpEquilibrium,rfisht:rfisht,rfloor:rfloor,rfr:rfr,Rfr:Rfr,rHar:rHar,rhard:rhard,rharu:rharu,rharul:rharul,Rho:Rho,rho:rho,rhov:rhov,RightAngleBracket:RightAngleBracket,RightArrowBar:RightArrowBar,rightarrow:rightarrow,RightArrow:RightArrow,Rightarrow:Rightarrow,RightArrowLeftArrow:RightArrowLeftArrow,rightarrowtail:rightarrowtail,RightCeiling:RightCeiling,RightDoubleBracket:RightDoubleBracket,RightDownTeeVector:RightDownTeeVector,RightDownVectorBar:RightDownVectorBar,RightDownVector:RightDownVector,RightFloor:RightFloor,rightharpoondown:rightharpoondown,rightharpoonup:rightharpoonup,rightleftarrows:rightleftarrows,rightleftharpoons:rightleftharpoons,rightrightarrows:rightrightarrows,rightsquigarrow:rightsquigarrow,RightTeeArrow:RightTeeArrow,RightTee:RightTee,RightTeeVector:RightTeeVector,rightthreetimes:rightthreetimes,RightTriangleBar:RightTriangleBar,RightTriangle:RightTriangle,RightTriangleEqual:RightTriangleEqual,RightUpDownVector:RightUpDownVector,RightUpTeeVector:RightUpTeeVector,RightUpVectorBar:RightUpVectorBar,RightUpVector:RightUpVector,RightVectorBar:RightVectorBar,RightVector:RightVector,ring:ring,risingdotseq:risingdotseq,rlarr:rlarr,rlhar:rlhar,rlm:rlm,rmoustache:rmoustache,rmoust:rmoust,rnmid:rnmid,roang:roang,roarr:roarr,robrk:robrk,ropar:ropar,ropf:ropf,Ropf:Ropf,roplus:roplus,rotimes:rotimes,RoundImplies:RoundImplies,rpar:rpar,rpargt:rpargt,rppolint:rppolint,rrarr:rrarr,Rrightarrow:Rrightarrow,rsaquo:rsaquo,rscr:rscr,Rscr:Rscr,rsh:rsh,Rsh:Rsh,rsqb:rsqb,rsquo:rsquo,rsquor:rsquor,rthree:rthree,rtimes:rtimes,rtri:rtri,rtrie:rtrie,rtrif:rtrif,rtriltri:rtriltri,RuleDelayed:RuleDelayed,ruluhar:ruluhar,rx:rx,Sacute:Sacute,sacute:sacute,sbquo:sbquo,scap:scap,Scaron:Scaron,scaron:scaron,Sc:Sc,sc:sc,sccue:sccue,sce:sce,scE:scE,Scedil:Scedil,scedil:scedil,Scirc:Scirc,scirc:scirc,scnap:scnap,scnE:scnE,scnsim:scnsim,scpolint:scpolint,scsim:scsim,Scy:Scy,scy:scy,sdotb:sdotb,sdot:sdot,sdote:sdote,searhk:searhk,searr:searr,seArr:seArr,searrow:searrow,sect:sect,semi:semi,seswar:seswar,setminus:setminus,setmn:setmn,sext:sext,Sfr:Sfr,sfr:sfr,sfrown:sfrown,sharp:sharp,SHCHcy:SHCHcy,shchcy:shchcy,SHcy:SHcy,shcy:shcy,ShortDownArrow:ShortDownArrow,ShortLeftArrow:ShortLeftArrow,shortmid:shortmid,shortparallel:shortparallel,ShortRightArrow:ShortRightArrow,ShortUpArrow:ShortUpArrow,shy:shy,Sigma:Sigma,sigma:sigma,sigmaf:sigmaf,sigmav:sigmav,sim:sim,simdot:simdot,sime:sime,simeq:simeq,simg:simg,simgE:simgE,siml:siml,simlE:simlE,simne:simne,simplus:simplus,simrarr:simrarr,slarr:slarr,SmallCircle:SmallCircle,smallsetminus:smallsetminus,smashp:smashp,smeparsl:smeparsl,smid:smid,smile:smile,smt:smt,smte:smte,smtes:smtes,SOFTcy:SOFTcy,softcy:softcy,solbar:solbar,solb:solb,sol:sol,Sopf:Sopf,sopf:sopf,spades:spades,spadesuit:spadesuit,spar:spar,sqcap:sqcap,sqcaps:sqcaps,sqcup:sqcup,sqcups:sqcups,Sqrt:Sqrt,sqsub:sqsub,sqsube:sqsube,sqsubset:sqsubset,sqsubseteq:sqsubseteq,sqsup:sqsup,sqsupe:sqsupe,sqsupset:sqsupset,sqsupseteq:sqsupseteq,square:square,Square:Square,SquareIntersection:SquareIntersection,SquareSubset:SquareSubset,SquareSubsetEqual:SquareSubsetEqual,SquareSuperset:SquareSuperset,SquareSupersetEqual:SquareSupersetEqual,SquareUnion:SquareUnion,squarf:squarf,squ:squ,squf:squf,srarr:srarr,Sscr:Sscr,sscr:sscr,ssetmn:ssetmn,ssmile:ssmile,sstarf:sstarf,Star:Star,star:star,starf:starf,straightepsilon:straightepsilon,straightphi:straightphi,strns:strns,sub:sub,Sub:Sub,subdot:subdot,subE:subE,sube:sube,subedot:subedot,submult:submult,subnE:subnE,subne:subne,subplus:subplus,subrarr:subrarr,subset:subset,Subset:Subset,subseteq:subseteq,subseteqq:subseteqq,SubsetEqual:SubsetEqual,subsetneq:subsetneq,subsetneqq:subsetneqq,subsim:subsim,subsub:subsub,subsup:subsup,succapprox:succapprox,succ:succ,succcurlyeq:succcurlyeq,Succeeds:Succeeds,SucceedsEqual:SucceedsEqual,SucceedsSlantEqual:SucceedsSlantEqual,SucceedsTilde:SucceedsTilde,succeq:succeq,succnapprox:succnapprox,succneqq:succneqq,succnsim:succnsim,succsim:succsim,SuchThat:SuchThat,sum:sum,Sum:Sum,sung:sung,sup1:sup1,sup2:sup2,sup3:sup3,sup:sup,Sup:Sup,supdot:supdot,supdsub:supdsub,supE:supE,supe:supe,supedot:supedot,Superset:Superset,SupersetEqual:SupersetEqual,suphsol:suphsol,suphsub:suphsub,suplarr:suplarr,supmult:supmult,supnE:supnE,supne:supne,supplus:supplus,supset:supset,Supset:Supset,supseteq:supseteq,supseteqq:supseteqq,supsetneq:supsetneq,supsetneqq:supsetneqq,supsim:supsim,supsub:supsub,supsup:supsup,swarhk:swarhk,swarr:swarr,swArr:swArr,swarrow:swarrow,swnwar:swnwar,szlig:szlig,Tab:Tab,target:target,Tau:Tau,tau:tau,tbrk:tbrk,Tcaron:Tcaron,tcaron:tcaron,Tcedil:Tcedil,tcedil:tcedil,Tcy:Tcy,tcy:tcy,tdot:tdot,telrec:telrec,Tfr:Tfr,tfr:tfr,there4:there4,therefore:therefore,Therefore:Therefore,Theta:Theta,theta:theta,thetasym:thetasym,thetav:thetav,thickapprox:thickapprox,thicksim:thicksim,ThickSpace:ThickSpace,ThinSpace:ThinSpace,thinsp:thinsp,thkap:thkap,thksim:thksim,THORN:THORN,thorn:thorn,tilde:tilde,Tilde:Tilde,TildeEqual:TildeEqual,TildeFullEqual:TildeFullEqual,TildeTilde:TildeTilde,timesbar:timesbar,timesb:timesb,times:times,timesd:timesd,tint:tint,toea:toea,topbot:topbot,topcir:topcir,top:top,Topf:Topf,topf:topf,topfork:topfork,tosa:tosa,tprime:tprime,trade:trade,TRADE:TRADE,triangle:triangle,triangledown:triangledown,triangleleft:triangleleft,trianglelefteq:trianglelefteq,triangleq:triangleq,triangleright:triangleright,trianglerighteq:trianglerighteq,tridot:tridot,trie:trie,triminus:triminus,TripleDot:TripleDot,triplus:triplus,trisb:trisb,tritime:tritime,trpezium:trpezium,Tscr:Tscr,tscr:tscr,TScy:TScy,tscy:tscy,TSHcy:TSHcy,tshcy:tshcy,Tstrok:Tstrok,tstrok:tstrok,twixt:twixt,twoheadleftarrow:twoheadleftarrow,twoheadrightarrow:twoheadrightarrow,Uacute:Uacute,uacute:uacute,uarr:uarr,Uarr:Uarr,uArr:uArr,Uarrocir:Uarrocir,Ubrcy:Ubrcy,ubrcy:ubrcy,Ubreve:Ubreve,ubreve:ubreve,Ucirc:Ucirc,ucirc:ucirc,Ucy:Ucy,ucy:ucy,udarr:udarr,Udblac:Udblac,udblac:udblac,udhar:udhar,ufisht:ufisht,Ufr:Ufr,ufr:ufr,Ugrave:Ugrave,ugrave:ugrave,uHar:uHar,uharl:uharl,uharr:uharr,uhblk:uhblk,ulcorn:ulcorn,ulcorner:ulcorner,ulcrop:ulcrop,ultri:ultri,Umacr:Umacr,umacr:umacr,uml:uml,UnderBar:UnderBar,UnderBrace:UnderBrace,UnderBracket:UnderBracket,UnderParenthesis:UnderParenthesis,Union:Union,UnionPlus:UnionPlus,Uogon:Uogon,uogon:uogon,Uopf:Uopf,uopf:uopf,UpArrowBar:UpArrowBar,uparrow:uparrow,UpArrow:UpArrow,Uparrow:Uparrow,UpArrowDownArrow:UpArrowDownArrow,updownarrow:updownarrow,UpDownArrow:UpDownArrow,Updownarrow:Updownarrow,UpEquilibrium:UpEquilibrium,upharpoonleft:upharpoonleft,upharpoonright:upharpoonright,uplus:uplus,UpperLeftArrow:UpperLeftArrow,UpperRightArrow:UpperRightArrow,upsi:upsi,Upsi:Upsi,upsih:upsih,Upsilon:Upsilon,upsilon:upsilon,UpTeeArrow:UpTeeArrow,UpTee:UpTee,upuparrows:upuparrows,urcorn:urcorn,urcorner:urcorner,urcrop:urcrop,Uring:Uring,uring:uring,urtri:urtri,Uscr:Uscr,uscr:uscr,utdot:utdot,Utilde:Utilde,utilde:utilde,utri:utri,utrif:utrif,uuarr:uuarr,Uuml:Uuml,uuml:uuml,uwangle:uwangle,vangrt:vangrt,varepsilon:varepsilon,varkappa:varkappa,varnothing:varnothing,varphi:varphi,varpi:varpi,varpropto:varpropto,varr:varr,vArr:vArr,varrho:varrho,varsigma:varsigma,varsubsetneq:varsubsetneq,varsubsetneqq:varsubsetneqq,varsupsetneq:varsupsetneq,varsupsetneqq:varsupsetneqq,vartheta:vartheta,vartriangleleft:vartriangleleft,vartriangleright:vartriangleright,vBar:vBar,Vbar:Vbar,vBarv:vBarv,Vcy:Vcy,vcy:vcy,vdash:vdash,vDash:vDash,Vdash:Vdash,VDash:VDash,Vdashl:Vdashl,veebar:veebar,vee:vee,Vee:Vee,veeeq:veeeq,vellip:vellip,verbar:verbar,Verbar:Verbar,vert:vert,Vert:Vert,VerticalBar:VerticalBar,VerticalLine:VerticalLine,VerticalSeparator:VerticalSeparator,VerticalTilde:VerticalTilde,VeryThinSpace:VeryThinSpace,Vfr:Vfr,vfr:vfr,vltri:vltri,vnsub:vnsub,vnsup:vnsup,Vopf:Vopf,vopf:vopf,vprop:vprop,vrtri:vrtri,Vscr:Vscr,vscr:vscr,vsubnE:vsubnE,vsubne:vsubne,vsupnE:vsupnE,vsupne:vsupne,Vvdash:Vvdash,vzigzag:vzigzag,Wcirc:Wcirc,wcirc:wcirc,wedbar:wedbar,wedge:wedge,Wedge:Wedge,wedgeq:wedgeq,weierp:weierp,Wfr:Wfr,wfr:wfr,Wopf:Wopf,wopf:wopf,wp:wp,wr:wr,wreath:wreath,Wscr:Wscr,wscr:wscr,xcap:xcap,xcirc:xcirc,xcup:xcup,xdtri:xdtri,Xfr:Xfr,xfr:xfr,xharr:xharr,xhArr:xhArr,Xi:Xi,xi:xi,xlarr:xlarr,xlArr:xlArr,xmap:xmap,xnis:xnis,xodot:xodot,Xopf:Xopf,xopf:xopf,xoplus:xoplus,xotime:xotime,xrarr:xrarr,xrArr:xrArr,Xscr:Xscr,xscr:xscr,xsqcup:xsqcup,xuplus:xuplus,xutri:xutri,xvee:xvee,xwedge:xwedge,Yacute:Yacute,yacute:yacute,YAcy:YAcy,yacy:yacy,Ycirc:Ycirc,ycirc:ycirc,Ycy:Ycy,ycy:ycy,yen:yen,Yfr:Yfr,yfr:yfr,YIcy:YIcy,yicy:yicy,Yopf:Yopf,yopf:yopf,Yscr:Yscr,yscr:yscr,YUcy:YUcy,yucy:yucy,yuml:yuml,Yuml:Yuml,Zacute:Zacute,zacute:zacute,Zcaron:Zcaron,zcaron:zcaron,Zcy:Zcy,zcy:zcy,Zdot:Zdot,zdot:zdot,zeetrf:zeetrf,ZeroWidthSpace:ZeroWidthSpace,Zeta:Zeta,zeta:zeta,zfr:zfr,Zfr:Zfr,ZHcy:ZHcy,zhcy:zhcy,zigrarr:zigrarr,zopf:zopf,Zopf:Zopf,Zscr:Zscr,zscr:zscr,zwj:zwj,zwnj:zwnj};var entities$1 = /*#__PURE__*/Object.freeze({Aacute: Aacute,aacute: aacute,Abreve: Abreve,abreve: abreve,ac: ac,acd: acd,acE: acE,Acirc: Acirc,acirc: acirc,acute: acute,Acy: Acy,acy: acy,AElig: AElig,aelig: aelig,af: af,Afr: Afr,afr: afr,Agrave: Agrave,agrave: agrave,alefsym: alefsym,aleph: aleph,Alpha: Alpha,alpha: alpha,Amacr: Amacr,amacr: amacr,amalg: amalg,amp: amp,AMP: AMP,andand: andand,And: And,and: and,andd: andd,andslope: andslope,andv: andv,ang: ang,ange: ange,angle: angle,angmsdaa: angmsdaa,angmsdab: angmsdab,angmsdac: angmsdac,angmsdad: angmsdad,angmsdae: angmsdae,angmsdaf: angmsdaf,angmsdag: angmsdag,angmsdah: angmsdah,angmsd: angmsd,angrt: angrt,angrtvb: angrtvb,angrtvbd: angrtvbd,angsph: angsph,angst: angst,angzarr: angzarr,Aogon: Aogon,aogon: aogon,Aopf: Aopf,aopf: aopf,apacir: apacir,ap: ap,apE: apE,ape: ape,apid: apid,apos: apos,ApplyFunction: ApplyFunction,approx: approx,approxeq: approxeq,Aring: Aring,aring: aring,Ascr: Ascr,ascr: ascr,Assign: Assign,ast: ast,asymp: asymp,asympeq: asympeq,Atilde: Atilde,atilde: atilde,Auml: Auml,auml: auml,awconint: awconint,awint: awint,backcong: backcong,backepsilon: backepsilon,backprime: backprime,backsim: backsim,backsimeq: backsimeq,Backslash: Backslash,Barv: Barv,barvee: barvee,barwed: barwed,Barwed: Barwed,barwedge: barwedge,bbrk: bbrk,bbrktbrk: bbrktbrk,bcong: bcong,Bcy: Bcy,bcy: bcy,bdquo: bdquo,becaus: becaus,because: because,Because: Because,bemptyv: bemptyv,bepsi: bepsi,bernou: bernou,Bernoullis: Bernoullis,Beta: Beta,beta: beta,beth: beth,between: between,Bfr: Bfr,bfr: bfr,bigcap: bigcap,bigcirc: bigcirc,bigcup: bigcup,bigodot: bigodot,bigoplus: bigoplus,bigotimes: bigotimes,bigsqcup: bigsqcup,bigstar: bigstar,bigtriangledown: bigtriangledown,bigtriangleup: bigtriangleup,biguplus: biguplus,bigvee: bigvee,bigwedge: bigwedge,bkarow: bkarow,blacklozenge: blacklozenge,blacksquare: blacksquare,blacktriangle: blacktriangle,blacktriangledown: blacktriangledown,blacktriangleleft: blacktriangleleft,blacktriangleright: blacktriangleright,blank: blank,blk12: blk12,blk14: blk14,blk34: blk34,block: block,bne: bne,bnequiv: bnequiv,bNot: bNot,bnot: bnot,Bopf: Bopf,bopf: bopf,bot: bot,bottom: bottom,bowtie: bowtie,boxbox: boxbox,boxdl: boxdl,boxdL: boxdL,boxDl: boxDl,boxDL: boxDL,boxdr: boxdr,boxdR: boxdR,boxDr: boxDr,boxDR: boxDR,boxh: boxh,boxH: boxH,boxhd: boxhd,boxHd: boxHd,boxhD: boxhD,boxHD: boxHD,boxhu: boxhu,boxHu: boxHu,boxhU: boxhU,boxHU: boxHU,boxminus: boxminus,boxplus: boxplus,boxtimes: boxtimes,boxul: boxul,boxuL: boxuL,boxUl: boxUl,boxUL: boxUL,boxur: boxur,boxuR: boxuR,boxUr: boxUr,boxUR: boxUR,boxv: boxv,boxV: boxV,boxvh: boxvh,boxvH: boxvH,boxVh: boxVh,boxVH: boxVH,boxvl: boxvl,boxvL: boxvL,boxVl: boxVl,boxVL: boxVL,boxvr: boxvr,boxvR: boxvR,boxVr: boxVr,boxVR: boxVR,bprime: bprime,breve: breve,Breve: Breve,brvbar: brvbar,bscr: bscr,Bscr: Bscr,bsemi: bsemi,bsim: bsim,bsime: bsime,bsolb: bsolb,bsol: bsol,bsolhsub: bsolhsub,bull: bull,bullet: bullet,bump: bump,bumpE: bumpE,bumpe: bumpe,Bumpeq: Bumpeq,bumpeq: bumpeq,Cacute: Cacute,cacute: cacute,capand: capand,capbrcup: capbrcup,capcap: capcap,cap: cap,Cap: Cap,capcup: capcup,capdot: capdot,CapitalDifferentialD: CapitalDifferentialD,caps: caps,caret: caret,caron: caron,Cayleys: Cayleys,ccaps: ccaps,Ccaron: Ccaron,ccaron: ccaron,Ccedil: Ccedil,ccedil: ccedil,Ccirc: Ccirc,ccirc: ccirc,Cconint: Cconint,ccups: ccups,ccupssm: ccupssm,Cdot: Cdot,cdot: cdot,cedil: cedil,Cedilla: Cedilla,cemptyv: cemptyv,cent: cent,centerdot: centerdot,CenterDot: CenterDot,cfr: cfr,Cfr: Cfr,CHcy: CHcy,chcy: chcy,check: check,checkmark: checkmark,Chi: Chi,chi: chi,circ: circ,circeq: circeq,circlearrowleft: circlearrowleft,circlearrowright: circlearrowright,circledast: circledast,circledcirc: circledcirc,circleddash: circleddash,CircleDot: CircleDot,circledR: circledR,circledS: circledS,CircleMinus: CircleMinus,CirclePlus: CirclePlus,CircleTimes: CircleTimes,cir: cir,cirE: cirE,cire: cire,cirfnint: cirfnint,cirmid: cirmid,cirscir: cirscir,ClockwiseContourIntegral: ClockwiseContourIntegral,CloseCurlyDoubleQuote: CloseCurlyDoubleQuote,CloseCurlyQuote: CloseCurlyQuote,clubs: clubs,clubsuit: clubsuit,colon: colon,Colon: Colon,Colone: Colone,colone: colone,coloneq: coloneq,comma: comma,commat: commat,comp: comp,compfn: compfn,complement: complement,complexes: complexes,cong: cong,congdot: congdot,Congruent: Congruent,conint: conint,Conint: Conint,ContourIntegral: ContourIntegral,copf: copf,Copf: Copf,coprod: coprod,Coproduct: Coproduct,copy: copy,COPY: COPY,copysr: copysr,CounterClockwiseContourIntegral: CounterClockwiseContourIntegral,crarr: crarr,cross: cross,Cross: Cross,Cscr: Cscr,cscr: cscr,csub: csub,csube: csube,csup: csup,csupe: csupe,ctdot: ctdot,cudarrl: cudarrl,cudarrr: cudarrr,cuepr: cuepr,cuesc: cuesc,cularr: cularr,cularrp: cularrp,cupbrcap: cupbrcap,cupcap: cupcap,CupCap: CupCap,cup: cup,Cup: Cup,cupcup: cupcup,cupdot: cupdot,cupor: cupor,cups: cups,curarr: curarr,curarrm: curarrm,curlyeqprec: curlyeqprec,curlyeqsucc: curlyeqsucc,curlyvee: curlyvee,curlywedge: curlywedge,curren: curren,curvearrowleft: curvearrowleft,curvearrowright: curvearrowright,cuvee: cuvee,cuwed: cuwed,cwconint: cwconint,cwint: cwint,cylcty: cylcty,dagger: dagger,Dagger: Dagger,daleth: daleth,darr: darr,Darr: Darr,dArr: dArr,dash: dash,Dashv: Dashv,dashv: dashv,dbkarow: dbkarow,dblac: dblac,Dcaron: Dcaron,dcaron: dcaron,Dcy: Dcy,dcy: dcy,ddagger: ddagger,ddarr: ddarr,DD: DD,dd: dd,DDotrahd: DDotrahd,ddotseq: ddotseq,deg: deg,Del: Del,Delta: Delta,delta: delta,demptyv: demptyv,dfisht: dfisht,Dfr: Dfr,dfr: dfr,dHar: dHar,dharl: dharl,dharr: dharr,DiacriticalAcute: DiacriticalAcute,DiacriticalDot: DiacriticalDot,DiacriticalDoubleAcute: DiacriticalDoubleAcute,DiacriticalGrave: DiacriticalGrave,DiacriticalTilde: DiacriticalTilde,diam: diam,diamond: diamond,Diamond: Diamond,diamondsuit: diamondsuit,diams: diams,die: die,DifferentialD: DifferentialD,digamma: digamma,disin: disin,div: div,divide: divide,divideontimes: divideontimes,divonx: divonx,DJcy: DJcy,djcy: djcy,dlcorn: dlcorn,dlcrop: dlcrop,dollar: dollar,Dopf: Dopf,dopf: dopf,Dot: Dot,dot: dot,DotDot: DotDot,doteq: doteq,doteqdot: doteqdot,DotEqual: DotEqual,dotminus: dotminus,dotplus: dotplus,dotsquare: dotsquare,doublebarwedge: doublebarwedge,DoubleContourIntegral: DoubleContourIntegral,DoubleDot: DoubleDot,DoubleDownArrow: DoubleDownArrow,DoubleLeftArrow: DoubleLeftArrow,DoubleLeftRightArrow: DoubleLeftRightArrow,DoubleLeftTee: DoubleLeftTee,DoubleLongLeftArrow: DoubleLongLeftArrow,DoubleLongLeftRightArrow: DoubleLongLeftRightArrow,DoubleLongRightArrow: DoubleLongRightArrow,DoubleRightArrow: DoubleRightArrow,DoubleRightTee: DoubleRightTee,DoubleUpArrow: DoubleUpArrow,DoubleUpDownArrow: DoubleUpDownArrow,DoubleVerticalBar: DoubleVerticalBar,DownArrowBar: DownArrowBar,downarrow: downarrow,DownArrow: DownArrow,Downarrow: Downarrow,DownArrowUpArrow: DownArrowUpArrow,DownBreve: DownBreve,downdownarrows: downdownarrows,downharpoonleft: downharpoonleft,downharpoonright: downharpoonright,DownLeftRightVector: DownLeftRightVector,DownLeftTeeVector: DownLeftTeeVector,DownLeftVectorBar: DownLeftVectorBar,DownLeftVector: DownLeftVector,DownRightTeeVector: DownRightTeeVector,DownRightVectorBar: DownRightVectorBar,DownRightVector: DownRightVector,DownTeeArrow: DownTeeArrow,DownTee: DownTee,drbkarow: drbkarow,drcorn: drcorn,drcrop: drcrop,Dscr: Dscr,dscr: dscr,DScy: DScy,dscy: dscy,dsol: dsol,Dstrok: Dstrok,dstrok: dstrok,dtdot: dtdot,dtri: dtri,dtrif: dtrif,duarr: duarr,duhar: duhar,dwangle: dwangle,DZcy: DZcy,dzcy: dzcy,dzigrarr: dzigrarr,Eacute: Eacute,eacute: eacute,easter: easter,Ecaron: Ecaron,ecaron: ecaron,Ecirc: Ecirc,ecirc: ecirc,ecir: ecir,ecolon: ecolon,Ecy: Ecy,ecy: ecy,eDDot: eDDot,Edot: Edot,edot: edot,eDot: eDot,ee: ee,efDot: efDot,Efr: Efr,efr: efr,eg: eg,Egrave: Egrave,egrave: egrave,egs: egs,egsdot: egsdot,el: el,Element: Element,elinters: elinters,ell: ell,els: els,elsdot: elsdot,Emacr: Emacr,emacr: emacr,empty: empty,emptyset: emptyset,EmptySmallSquare: EmptySmallSquare,emptyv: emptyv,EmptyVerySmallSquare: EmptyVerySmallSquare,emsp13: emsp13,emsp14: emsp14,emsp: emsp,ENG: ENG,eng: eng,ensp: ensp,Eogon: Eogon,eogon: eogon,Eopf: Eopf,eopf: eopf,epar: epar,eparsl: eparsl,eplus: eplus,epsi: epsi,Epsilon: Epsilon,epsilon: epsilon,epsiv: epsiv,eqcirc: eqcirc,eqcolon: eqcolon,eqsim: eqsim,eqslantgtr: eqslantgtr,eqslantless: eqslantless,Equal: Equal,equals: equals,EqualTilde: EqualTilde,equest: equest,Equilibrium: Equilibrium,equiv: equiv,equivDD: equivDD,eqvparsl: eqvparsl,erarr: erarr,erDot: erDot,escr: escr,Escr: Escr,esdot: esdot,Esim: Esim,esim: esim,Eta: Eta,eta: eta,ETH: ETH,eth: eth,Euml: Euml,euml: euml,euro: euro,excl: excl,exist: exist,Exists: Exists,expectation: expectation,exponentiale: exponentiale,ExponentialE: ExponentialE,fallingdotseq: fallingdotseq,Fcy: Fcy,fcy: fcy,female: female,ffilig: ffilig,fflig: fflig,ffllig: ffllig,Ffr: Ffr,ffr: ffr,filig: filig,FilledSmallSquare: FilledSmallSquare,FilledVerySmallSquare: FilledVerySmallSquare,fjlig: fjlig,flat: flat,fllig: fllig,fltns: fltns,fnof: fnof,Fopf: Fopf,fopf: fopf,forall: forall,ForAll: ForAll,fork: fork,forkv: forkv,Fouriertrf: Fouriertrf,fpartint: fpartint,frac12: frac12,frac13: frac13,frac14: frac14,frac15: frac15,frac16: frac16,frac18: frac18,frac23: frac23,frac25: frac25,frac34: frac34,frac35: frac35,frac38: frac38,frac45: frac45,frac56: frac56,frac58: frac58,frac78: frac78,frasl: frasl,frown: frown,fscr: fscr,Fscr: Fscr,gacute: gacute,Gamma: Gamma,gamma: gamma,Gammad: Gammad,gammad: gammad,gap: gap,Gbreve: Gbreve,gbreve: gbreve,Gcedil: Gcedil,Gcirc: Gcirc,gcirc: gcirc,Gcy: Gcy,gcy: gcy,Gdot: Gdot,gdot: gdot,ge: ge,gE: gE,gEl: gEl,gel: gel,geq: geq,geqq: geqq,geqslant: geqslant,gescc: gescc,ges: ges,gesdot: gesdot,gesdoto: gesdoto,gesdotol: gesdotol,gesl: gesl,gesles: gesles,Gfr: Gfr,gfr: gfr,gg: gg,Gg: Gg,ggg: ggg,gimel: gimel,GJcy: GJcy,gjcy: gjcy,gla: gla,gl: gl,glE: glE,glj: glj,gnap: gnap,gnapprox: gnapprox,gne: gne,gnE: gnE,gneq: gneq,gneqq: gneqq,gnsim: gnsim,Gopf: Gopf,gopf: gopf,grave: grave,GreaterEqual: GreaterEqual,GreaterEqualLess: GreaterEqualLess,GreaterFullEqual: GreaterFullEqual,GreaterGreater: GreaterGreater,GreaterLess: GreaterLess,GreaterSlantEqual: GreaterSlantEqual,GreaterTilde: GreaterTilde,Gscr: Gscr,gscr: gscr,gsim: gsim,gsime: gsime,gsiml: gsiml,gtcc: gtcc,gtcir: gtcir,gt: gt,GT: GT,Gt: Gt,gtdot: gtdot,gtlPar: gtlPar,gtquest: gtquest,gtrapprox: gtrapprox,gtrarr: gtrarr,gtrdot: gtrdot,gtreqless: gtreqless,gtreqqless: gtreqqless,gtrless: gtrless,gtrsim: gtrsim,gvertneqq: gvertneqq,gvnE: gvnE,Hacek: Hacek,hairsp: hairsp,half: half,hamilt: hamilt,HARDcy: HARDcy,hardcy: hardcy,harrcir: harrcir,harr: harr,hArr: hArr,harrw: harrw,Hat: Hat,hbar: hbar,Hcirc: Hcirc,hcirc: hcirc,hearts: hearts,heartsuit: heartsuit,hellip: hellip,hercon: hercon,hfr: hfr,Hfr: Hfr,HilbertSpace: HilbertSpace,hksearow: hksearow,hkswarow: hkswarow,hoarr: hoarr,homtht: homtht,hookleftarrow: hookleftarrow,hookrightarrow: hookrightarrow,hopf: hopf,Hopf: Hopf,horbar: horbar,HorizontalLine: HorizontalLine,hscr: hscr,Hscr: Hscr,hslash: hslash,Hstrok: Hstrok,hstrok: hstrok,HumpDownHump: HumpDownHump,HumpEqual: HumpEqual,hybull: hybull,hyphen: hyphen,Iacute: Iacute,iacute: iacute,ic: ic,Icirc: Icirc,icirc: icirc,Icy: Icy,icy: icy,Idot: Idot,IEcy: IEcy,iecy: iecy,iexcl: iexcl,iff: iff,ifr: ifr,Ifr: Ifr,Igrave: Igrave,igrave: igrave,ii: ii,iiiint: iiiint,iiint: iiint,iinfin: iinfin,iiota: iiota,IJlig: IJlig,ijlig: ijlig,Imacr: Imacr,imacr: imacr,image: image,ImaginaryI: ImaginaryI,imagline: imagline,imagpart: imagpart,imath: imath,Im: Im,imof: imof,imped: imped,Implies: Implies,incare: incare,infin: infin,infintie: infintie,inodot: inodot,intcal: intcal,int: int,Int: Int,integers: integers,Integral: Integral,intercal: intercal,Intersection: Intersection,intlarhk: intlarhk,intprod: intprod,InvisibleComma: InvisibleComma,InvisibleTimes: InvisibleTimes,IOcy: IOcy,iocy: iocy,Iogon: Iogon,iogon: iogon,Iopf: Iopf,iopf: iopf,Iota: Iota,iota: iota,iprod: iprod,iquest: iquest,iscr: iscr,Iscr: Iscr,isin: isin,isindot: isindot,isinE: isinE,isins: isins,isinsv: isinsv,isinv: isinv,it: it,Itilde: Itilde,itilde: itilde,Iukcy: Iukcy,iukcy: iukcy,Iuml: Iuml,iuml: iuml,Jcirc: Jcirc,jcirc: jcirc,Jcy: Jcy,jcy: jcy,Jfr: Jfr,jfr: jfr,jmath: jmath,Jopf: Jopf,jopf: jopf,Jscr: Jscr,jscr: jscr,Jsercy: Jsercy,jsercy: jsercy,Jukcy: Jukcy,jukcy: jukcy,Kappa: Kappa,kappa: kappa,kappav: kappav,Kcedil: Kcedil,kcedil: kcedil,Kcy: Kcy,kcy: kcy,Kfr: Kfr,kfr: kfr,kgreen: kgreen,KHcy: KHcy,khcy: khcy,KJcy: KJcy,kjcy: kjcy,Kopf: Kopf,kopf: kopf,Kscr: Kscr,kscr: kscr,lAarr: lAarr,Lacute: Lacute,lacute: lacute,laemptyv: laemptyv,lagran: lagran,Lambda: Lambda,lambda: lambda,lang: lang,Lang: Lang,langd: langd,langle: langle,lap: lap,Laplacetrf: Laplacetrf,laquo: laquo,larrb: larrb,larrbfs: larrbfs,larr: larr,Larr: Larr,lArr: lArr,larrfs: larrfs,larrhk: larrhk,larrlp: larrlp,larrpl: larrpl,larrsim: larrsim,larrtl: larrtl,latail: latail,lAtail: lAtail,lat: lat,late: late,lates: lates,lbarr: lbarr,lBarr: lBarr,lbbrk: lbbrk,lbrace: lbrace,lbrack: lbrack,lbrke: lbrke,lbrksld: lbrksld,lbrkslu: lbrkslu,Lcaron: Lcaron,lcaron: lcaron,Lcedil: Lcedil,lcedil: lcedil,lceil: lceil,lcub: lcub,Lcy: Lcy,lcy: lcy,ldca: ldca,ldquo: ldquo,ldquor: ldquor,ldrdhar: ldrdhar,ldrushar: ldrushar,ldsh: ldsh,le: le,lE: lE,LeftAngleBracket: LeftAngleBracket,LeftArrowBar: LeftArrowBar,leftarrow: leftarrow,LeftArrow: LeftArrow,Leftarrow: Leftarrow,LeftArrowRightArrow: LeftArrowRightArrow,leftarrowtail: leftarrowtail,LeftCeiling: LeftCeiling,LeftDoubleBracket: LeftDoubleBracket,LeftDownTeeVector: LeftDownTeeVector,LeftDownVectorBar: LeftDownVectorBar,LeftDownVector: LeftDownVector,LeftFloor: LeftFloor,leftharpoondown: leftharpoondown,leftharpoonup: leftharpoonup,leftleftarrows: leftleftarrows,leftrightarrow: leftrightarrow,LeftRightArrow: LeftRightArrow,Leftrightarrow: Leftrightarrow,leftrightarrows: leftrightarrows,leftrightharpoons: leftrightharpoons,leftrightsquigarrow: leftrightsquigarrow,LeftRightVector: LeftRightVector,LeftTeeArrow: LeftTeeArrow,LeftTee: LeftTee,LeftTeeVector: LeftTeeVector,leftthreetimes: leftthreetimes,LeftTriangleBar: LeftTriangleBar,LeftTriangle: LeftTriangle,LeftTriangleEqual: LeftTriangleEqual,LeftUpDownVector: LeftUpDownVector,LeftUpTeeVector: LeftUpTeeVector,LeftUpVectorBar: LeftUpVectorBar,LeftUpVector: LeftUpVector,LeftVectorBar: LeftVectorBar,LeftVector: LeftVector,lEg: lEg,leg: leg,leq: leq,leqq: leqq,leqslant: leqslant,lescc: lescc,les: les,lesdot: lesdot,lesdoto: lesdoto,lesdotor: lesdotor,lesg: lesg,lesges: lesges,lessapprox: lessapprox,lessdot: lessdot,lesseqgtr: lesseqgtr,lesseqqgtr: lesseqqgtr,LessEqualGreater: LessEqualGreater,LessFullEqual: LessFullEqual,LessGreater: LessGreater,lessgtr: lessgtr,LessLess: LessLess,lesssim: lesssim,LessSlantEqual: LessSlantEqual,LessTilde: LessTilde,lfisht: lfisht,lfloor: lfloor,Lfr: Lfr,lfr: lfr,lg: lg,lgE: lgE,lHar: lHar,lhard: lhard,lharu: lharu,lharul: lharul,lhblk: lhblk,LJcy: LJcy,ljcy: ljcy,llarr: llarr,ll: ll,Ll: Ll,llcorner: llcorner,Lleftarrow: Lleftarrow,llhard: llhard,lltri: lltri,Lmidot: Lmidot,lmidot: lmidot,lmoustache: lmoustache,lmoust: lmoust,lnap: lnap,lnapprox: lnapprox,lne: lne,lnE: lnE,lneq: lneq,lneqq: lneqq,lnsim: lnsim,loang: loang,loarr: loarr,lobrk: lobrk,longleftarrow: longleftarrow,LongLeftArrow: LongLeftArrow,Longleftarrow: Longleftarrow,longleftrightarrow: longleftrightarrow,LongLeftRightArrow: LongLeftRightArrow,Longleftrightarrow: Longleftrightarrow,longmapsto: longmapsto,longrightarrow: longrightarrow,LongRightArrow: LongRightArrow,Longrightarrow: Longrightarrow,looparrowleft: looparrowleft,looparrowright: looparrowright,lopar: lopar,Lopf: Lopf,lopf: lopf,loplus: loplus,lotimes: lotimes,lowast: lowast,lowbar: lowbar,LowerLeftArrow: LowerLeftArrow,LowerRightArrow: LowerRightArrow,loz: loz,lozenge: lozenge,lozf: lozf,lpar: lpar,lparlt: lparlt,lrarr: lrarr,lrcorner: lrcorner,lrhar: lrhar,lrhard: lrhard,lrm: lrm,lrtri: lrtri,lsaquo: lsaquo,lscr: lscr,Lscr: Lscr,lsh: lsh,Lsh: Lsh,lsim: lsim,lsime: lsime,lsimg: lsimg,lsqb: lsqb,lsquo: lsquo,lsquor: lsquor,Lstrok: Lstrok,lstrok: lstrok,ltcc: ltcc,ltcir: ltcir,lt: lt,LT: LT,Lt: Lt,ltdot: ltdot,lthree: lthree,ltimes: ltimes,ltlarr: ltlarr,ltquest: ltquest,ltri: ltri,ltrie: ltrie,ltrif: ltrif,ltrPar: ltrPar,lurdshar: lurdshar,luruhar: luruhar,lvertneqq: lvertneqq,lvnE: lvnE,macr: macr,male: male,malt: malt,maltese: maltese,map: map,mapsto: mapsto,mapstodown: mapstodown,mapstoleft: mapstoleft,mapstoup: mapstoup,marker: marker,mcomma: mcomma,Mcy: Mcy,mcy: mcy,mdash: mdash,mDDot: mDDot,measuredangle: measuredangle,MediumSpace: MediumSpace,Mellintrf: Mellintrf,Mfr: Mfr,mfr: mfr,mho: mho,micro: micro,midast: midast,midcir: midcir,mid: mid,middot: middot,minusb: minusb,minus: minus,minusd: minusd,minusdu: minusdu,MinusPlus: MinusPlus,mlcp: mlcp,mldr: mldr,mnplus: mnplus,models: models,Mopf: Mopf,mopf: mopf,mp: mp,mscr: mscr,Mscr: Mscr,mstpos: mstpos,Mu: Mu,mu: mu,multimap: multimap,mumap: mumap,nabla: nabla,Nacute: Nacute,nacute: nacute,nang: nang,nap: nap,napE: napE,napid: napid,napos: napos,napprox: napprox,natural: natural,naturals: naturals,natur: natur,nbsp: nbsp,nbump: nbump,nbumpe: nbumpe,ncap: ncap,Ncaron: Ncaron,ncaron: ncaron,Ncedil: Ncedil,ncedil: ncedil,ncong: ncong,ncongdot: ncongdot,ncup: ncup,Ncy: Ncy,ncy: ncy,ndash: ndash,nearhk: nearhk,nearr: nearr,neArr: neArr,nearrow: nearrow,ne: ne,nedot: nedot,NegativeMediumSpace: NegativeMediumSpace,NegativeThickSpace: NegativeThickSpace,NegativeThinSpace: NegativeThinSpace,NegativeVeryThinSpace: NegativeVeryThinSpace,nequiv: nequiv,nesear: nesear,nesim: nesim,NestedGreaterGreater: NestedGreaterGreater,NestedLessLess: NestedLessLess,NewLine: NewLine,nexist: nexist,nexists: nexists,Nfr: Nfr,nfr: nfr,ngE: ngE,nge: nge,ngeq: ngeq,ngeqq: ngeqq,ngeqslant: ngeqslant,nges: nges,nGg: nGg,ngsim: ngsim,nGt: nGt,ngt: ngt,ngtr: ngtr,nGtv: nGtv,nharr: nharr,nhArr: nhArr,nhpar: nhpar,ni: ni,nis: nis,nisd: nisd,niv: niv,NJcy: NJcy,njcy: njcy,nlarr: nlarr,nlArr: nlArr,nldr: nldr,nlE: nlE,nle: nle,nleftarrow: nleftarrow,nLeftarrow: nLeftarrow,nleftrightarrow: nleftrightarrow,nLeftrightarrow: nLeftrightarrow,nleq: nleq,nleqq: nleqq,nleqslant: nleqslant,nles: nles,nless: nless,nLl: nLl,nlsim: nlsim,nLt: nLt,nlt: nlt,nltri: nltri,nltrie: nltrie,nLtv: nLtv,nmid: nmid,NoBreak: NoBreak,NonBreakingSpace: NonBreakingSpace,nopf: nopf,Nopf: Nopf,Not: Not,not: not,NotCongruent: NotCongruent,NotCupCap: NotCupCap,NotDoubleVerticalBar: NotDoubleVerticalBar,NotElement: NotElement,NotEqual: NotEqual,NotEqualTilde: NotEqualTilde,NotExists: NotExists,NotGreater: NotGreater,NotGreaterEqual: NotGreaterEqual,NotGreaterFullEqual: NotGreaterFullEqual,NotGreaterGreater: NotGreaterGreater,NotGreaterLess: NotGreaterLess,NotGreaterSlantEqual: NotGreaterSlantEqual,NotGreaterTilde: NotGreaterTilde,NotHumpDownHump: NotHumpDownHump,NotHumpEqual: NotHumpEqual,notin: notin,notindot: notindot,notinE: notinE,notinva: notinva,notinvb: notinvb,notinvc: notinvc,NotLeftTriangleBar: NotLeftTriangleBar,NotLeftTriangle: NotLeftTriangle,NotLeftTriangleEqual: NotLeftTriangleEqual,NotLess: NotLess,NotLessEqual: NotLessEqual,NotLessGreater: NotLessGreater,NotLessLess: NotLessLess,NotLessSlantEqual: NotLessSlantEqual,NotLessTilde: NotLessTilde,NotNestedGreaterGreater: NotNestedGreaterGreater,NotNestedLessLess: NotNestedLessLess,notni: notni,notniva: notniva,notnivb: notnivb,notnivc: notnivc,NotPrecedes: NotPrecedes,NotPrecedesEqual: NotPrecedesEqual,NotPrecedesSlantEqual: NotPrecedesSlantEqual,NotReverseElement: NotReverseElement,NotRightTriangleBar: NotRightTriangleBar,NotRightTriangle: NotRightTriangle,NotRightTriangleEqual: NotRightTriangleEqual,NotSquareSubset: NotSquareSubset,NotSquareSubsetEqual: NotSquareSubsetEqual,NotSquareSuperset: NotSquareSuperset,NotSquareSupersetEqual: NotSquareSupersetEqual,NotSubset: NotSubset,NotSubsetEqual: NotSubsetEqual,NotSucceeds: NotSucceeds,NotSucceedsEqual: NotSucceedsEqual,NotSucceedsSlantEqual: NotSucceedsSlantEqual,NotSucceedsTilde: NotSucceedsTilde,NotSuperset: NotSuperset,NotSupersetEqual: NotSupersetEqual,NotTilde: NotTilde,NotTildeEqual: NotTildeEqual,NotTildeFullEqual: NotTildeFullEqual,NotTildeTilde: NotTildeTilde,NotVerticalBar: NotVerticalBar,nparallel: nparallel,npar: npar,nparsl: nparsl,npart: npart,npolint: npolint,npr: npr,nprcue: nprcue,nprec: nprec,npreceq: npreceq,npre: npre,nrarrc: nrarrc,nrarr: nrarr,nrArr: nrArr,nrarrw: nrarrw,nrightarrow: nrightarrow,nRightarrow: nRightarrow,nrtri: nrtri,nrtrie: nrtrie,nsc: nsc,nsccue: nsccue,nsce: nsce,Nscr: Nscr,nscr: nscr,nshortmid: nshortmid,nshortparallel: nshortparallel,nsim: nsim,nsime: nsime,nsimeq: nsimeq,nsmid: nsmid,nspar: nspar,nsqsube: nsqsube,nsqsupe: nsqsupe,nsub: nsub,nsubE: nsubE,nsube: nsube,nsubset: nsubset,nsubseteq: nsubseteq,nsubseteqq: nsubseteqq,nsucc: nsucc,nsucceq: nsucceq,nsup: nsup,nsupE: nsupE,nsupe: nsupe,nsupset: nsupset,nsupseteq: nsupseteq,nsupseteqq: nsupseteqq,ntgl: ntgl,Ntilde: Ntilde,ntilde: ntilde,ntlg: ntlg,ntriangleleft: ntriangleleft,ntrianglelefteq: ntrianglelefteq,ntriangleright: ntriangleright,ntrianglerighteq: ntrianglerighteq,Nu: Nu,nu: nu,num: num,numero: numero,numsp: numsp,nvap: nvap,nvdash: nvdash,nvDash: nvDash,nVdash: nVdash,nVDash: nVDash,nvge: nvge,nvgt: nvgt,nvHarr: nvHarr,nvinfin: nvinfin,nvlArr: nvlArr,nvle: nvle,nvlt: nvlt,nvltrie: nvltrie,nvrArr: nvrArr,nvrtrie: nvrtrie,nvsim: nvsim,nwarhk: nwarhk,nwarr: nwarr,nwArr: nwArr,nwarrow: nwarrow,nwnear: nwnear,Oacute: Oacute,oacute: oacute,oast: oast,Ocirc: Ocirc,ocirc: ocirc,ocir: ocir,Ocy: Ocy,ocy: ocy,odash: odash,Odblac: Odblac,odblac: odblac,odiv: odiv,odot: odot,odsold: odsold,OElig: OElig,oelig: oelig,ofcir: ofcir,Ofr: Ofr,ofr: ofr,ogon: ogon,Ograve: Ograve,ograve: ograve,ogt: ogt,ohbar: ohbar,ohm: ohm,oint: oint,olarr: olarr,olcir: olcir,olcross: olcross,oline: oline,olt: olt,Omacr: Omacr,omacr: omacr,Omega: Omega,omega: omega,Omicron: Omicron,omicron: omicron,omid: omid,ominus: ominus,Oopf: Oopf,oopf: oopf,opar: opar,OpenCurlyDoubleQuote: OpenCurlyDoubleQuote,OpenCurlyQuote: OpenCurlyQuote,operp: operp,oplus: oplus,orarr: orarr,Or: Or,or: or,ord: ord,order: order,orderof: orderof,ordf: ordf,ordm: ordm,origof: origof,oror: oror,orslope: orslope,orv: orv,oS: oS,Oscr: Oscr,oscr: oscr,Oslash: Oslash,oslash: oslash,osol: osol,Otilde: Otilde,otilde: otilde,otimesas: otimesas,Otimes: Otimes,otimes: otimes,Ouml: Ouml,ouml: ouml,ovbar: ovbar,OverBar: OverBar,OverBrace: OverBrace,OverBracket: OverBracket,OverParenthesis: OverParenthesis,para: para,parallel: parallel,par: par,parsim: parsim,parsl: parsl,part: part,PartialD: PartialD,Pcy: Pcy,pcy: pcy,percnt: percnt,period: period,permil: permil,perp: perp,pertenk: pertenk,Pfr: Pfr,pfr: pfr,Phi: Phi,phi: phi,phiv: phiv,phmmat: phmmat,phone: phone,Pi: Pi,pi: pi,pitchfork: pitchfork,piv: piv,planck: planck,planckh: planckh,plankv: plankv,plusacir: plusacir,plusb: plusb,pluscir: pluscir,plus: plus,plusdo: plusdo,plusdu: plusdu,pluse: pluse,PlusMinus: PlusMinus,plusmn: plusmn,plussim: plussim,plustwo: plustwo,pm: pm,Poincareplane: Poincareplane,pointint: pointint,popf: popf,Popf: Popf,pound: pound,prap: prap,Pr: Pr,pr: pr,prcue: prcue,precapprox: precapprox,prec: prec,preccurlyeq: preccurlyeq,Precedes: Precedes,PrecedesEqual: PrecedesEqual,PrecedesSlantEqual: PrecedesSlantEqual,PrecedesTilde: PrecedesTilde,preceq: preceq,precnapprox: precnapprox,precneqq: precneqq,precnsim: precnsim,pre: pre,prE: prE,precsim: precsim,prime: prime,Prime: Prime,primes: primes,prnap: prnap,prnE: prnE,prnsim: prnsim,prod: prod,Product: Product,profalar: profalar,profline: profline,profsurf: profsurf,prop: prop,Proportional: Proportional,Proportion: Proportion,propto: propto,prsim: prsim,prurel: prurel,Pscr: Pscr,pscr: pscr,Psi: Psi,psi: psi,puncsp: puncsp,Qfr: Qfr,qfr: qfr,qint: qint,qopf: qopf,Qopf: Qopf,qprime: qprime,Qscr: Qscr,qscr: qscr,quaternions: quaternions,quatint: quatint,quest: quest,questeq: questeq,quot: quot,QUOT: QUOT,rAarr: rAarr,race: race,Racute: Racute,racute: racute,radic: radic,raemptyv: raemptyv,rang: rang,Rang: Rang,rangd: rangd,range: range,rangle: rangle,raquo: raquo,rarrap: rarrap,rarrb: rarrb,rarrbfs: rarrbfs,rarrc: rarrc,rarr: rarr,Rarr: Rarr,rArr: rArr,rarrfs: rarrfs,rarrhk: rarrhk,rarrlp: rarrlp,rarrpl: rarrpl,rarrsim: rarrsim,Rarrtl: Rarrtl,rarrtl: rarrtl,rarrw: rarrw,ratail: ratail,rAtail: rAtail,ratio: ratio,rationals: rationals,rbarr: rbarr,rBarr: rBarr,RBarr: RBarr,rbbrk: rbbrk,rbrace: rbrace,rbrack: rbrack,rbrke: rbrke,rbrksld: rbrksld,rbrkslu: rbrkslu,Rcaron: Rcaron,rcaron: rcaron,Rcedil: Rcedil,rcedil: rcedil,rceil: rceil,rcub: rcub,Rcy: Rcy,rcy: rcy,rdca: rdca,rdldhar: rdldhar,rdquo: rdquo,rdquor: rdquor,rdsh: rdsh,real: real,realine: realine,realpart: realpart,reals: reals,Re: Re,rect: rect,reg: reg,REG: REG,ReverseElement: ReverseElement,ReverseEquilibrium: ReverseEquilibrium,ReverseUpEquilibrium: ReverseUpEquilibrium,rfisht: rfisht,rfloor: rfloor,rfr: rfr,Rfr: Rfr,rHar: rHar,rhard: rhard,rharu: rharu,rharul: rharul,Rho: Rho,rho: rho,rhov: rhov,RightAngleBracket: RightAngleBracket,RightArrowBar: RightArrowBar,rightarrow: rightarrow,RightArrow: RightArrow,Rightarrow: Rightarrow,RightArrowLeftArrow: RightArrowLeftArrow,rightarrowtail: rightarrowtail,RightCeiling: RightCeiling,RightDoubleBracket: RightDoubleBracket,RightDownTeeVector: RightDownTeeVector,RightDownVectorBar: RightDownVectorBar,RightDownVector: RightDownVector,RightFloor: RightFloor,rightharpoondown: rightharpoondown,rightharpoonup: rightharpoonup,rightleftarrows: rightleftarrows,rightleftharpoons: rightleftharpoons,rightrightarrows: rightrightarrows,rightsquigarrow: rightsquigarrow,RightTeeArrow: RightTeeArrow,RightTee: RightTee,RightTeeVector: RightTeeVector,rightthreetimes: rightthreetimes,RightTriangleBar: RightTriangleBar,RightTriangle: RightTriangle,RightTriangleEqual: RightTriangleEqual,RightUpDownVector: RightUpDownVector,RightUpTeeVector: RightUpTeeVector,RightUpVectorBar: RightUpVectorBar,RightUpVector: RightUpVector,RightVectorBar: RightVectorBar,RightVector: RightVector,ring: ring,risingdotseq: risingdotseq,rlarr: rlarr,rlhar: rlhar,rlm: rlm,rmoustache: rmoustache,rmoust: rmoust,rnmid: rnmid,roang: roang,roarr: roarr,robrk: robrk,ropar: ropar,ropf: ropf,Ropf: Ropf,roplus: roplus,rotimes: rotimes,RoundImplies: RoundImplies,rpar: rpar,rpargt: rpargt,rppolint: rppolint,rrarr: rrarr,Rrightarrow: Rrightarrow,rsaquo: rsaquo,rscr: rscr,Rscr: Rscr,rsh: rsh,Rsh: Rsh,rsqb: rsqb,rsquo: rsquo,rsquor: rsquor,rthree: rthree,rtimes: rtimes,rtri: rtri,rtrie: rtrie,rtrif: rtrif,rtriltri: rtriltri,RuleDelayed: RuleDelayed,ruluhar: ruluhar,rx: rx,Sacute: Sacute,sacute: sacute,sbquo: sbquo,scap: scap,Scaron: Scaron,scaron: scaron,Sc: Sc,sc: sc,sccue: sccue,sce: sce,scE: scE,Scedil: Scedil,scedil: scedil,Scirc: Scirc,scirc: scirc,scnap: scnap,scnE: scnE,scnsim: scnsim,scpolint: scpolint,scsim: scsim,Scy: Scy,scy: scy,sdotb: sdotb,sdot: sdot,sdote: sdote,searhk: searhk,searr: searr,seArr: seArr,searrow: searrow,sect: sect,semi: semi,seswar: seswar,setminus: setminus,setmn: setmn,sext: sext,Sfr: Sfr,sfr: sfr,sfrown: sfrown,sharp: sharp,SHCHcy: SHCHcy,shchcy: shchcy,SHcy: SHcy,shcy: shcy,ShortDownArrow: ShortDownArrow,ShortLeftArrow: ShortLeftArrow,shortmid: shortmid,shortparallel: shortparallel,ShortRightArrow: ShortRightArrow,ShortUpArrow: ShortUpArrow,shy: shy,Sigma: Sigma,sigma: sigma,sigmaf: sigmaf,sigmav: sigmav,sim: sim,simdot: simdot,sime: sime,simeq: simeq,simg: simg,simgE: simgE,siml: siml,simlE: simlE,simne: simne,simplus: simplus,simrarr: simrarr,slarr: slarr,SmallCircle: SmallCircle,smallsetminus: smallsetminus,smashp: smashp,smeparsl: smeparsl,smid: smid,smile: smile,smt: smt,smte: smte,smtes: smtes,SOFTcy: SOFTcy,softcy: softcy,solbar: solbar,solb: solb,sol: sol,Sopf: Sopf,sopf: sopf,spades: spades,spadesuit: spadesuit,spar: spar,sqcap: sqcap,sqcaps: sqcaps,sqcup: sqcup,sqcups: sqcups,Sqrt: Sqrt,sqsub: sqsub,sqsube: sqsube,sqsubset: sqsubset,sqsubseteq: sqsubseteq,sqsup: sqsup,sqsupe: sqsupe,sqsupset: sqsupset,sqsupseteq: sqsupseteq,square: square,Square: Square,SquareIntersection: SquareIntersection,SquareSubset: SquareSubset,SquareSubsetEqual: SquareSubsetEqual,SquareSuperset: SquareSuperset,SquareSupersetEqual: SquareSupersetEqual,SquareUnion: SquareUnion,squarf: squarf,squ: squ,squf: squf,srarr: srarr,Sscr: Sscr,sscr: sscr,ssetmn: ssetmn,ssmile: ssmile,sstarf: sstarf,Star: Star,star: star,starf: starf,straightepsilon: straightepsilon,straightphi: straightphi,strns: strns,sub: sub,Sub: Sub,subdot: subdot,subE: subE,sube: sube,subedot: subedot,submult: submult,subnE: subnE,subne: subne,subplus: subplus,subrarr: subrarr,subset: subset,Subset: Subset,subseteq: subseteq,subseteqq: subseteqq,SubsetEqual: SubsetEqual,subsetneq: subsetneq,subsetneqq: subsetneqq,subsim: subsim,subsub: subsub,subsup: subsup,succapprox: succapprox,succ: succ,succcurlyeq: succcurlyeq,Succeeds: Succeeds,SucceedsEqual: SucceedsEqual,SucceedsSlantEqual: SucceedsSlantEqual,SucceedsTilde: SucceedsTilde,succeq: succeq,succnapprox: succnapprox,succneqq: succneqq,succnsim: succnsim,succsim: succsim,SuchThat: SuchThat,sum: sum,Sum: Sum,sung: sung,sup1: sup1,sup2: sup2,sup3: sup3,sup: sup,Sup: Sup,supdot: supdot,supdsub: supdsub,supE: supE,supe: supe,supedot: supedot,Superset: Superset,SupersetEqual: SupersetEqual,suphsol: suphsol,suphsub: suphsub,suplarr: suplarr,supmult: supmult,supnE: supnE,supne: supne,supplus: supplus,supset: supset,Supset: Supset,supseteq: supseteq,supseteqq: supseteqq,supsetneq: supsetneq,supsetneqq: supsetneqq,supsim: supsim,supsub: supsub,supsup: supsup,swarhk: swarhk,swarr: swarr,swArr: swArr,swarrow: swarrow,swnwar: swnwar,szlig: szlig,Tab: Tab,target: target,Tau: Tau,tau: tau,tbrk: tbrk,Tcaron: Tcaron,tcaron: tcaron,Tcedil: Tcedil,tcedil: tcedil,Tcy: Tcy,tcy: tcy,tdot: tdot,telrec: telrec,Tfr: Tfr,tfr: tfr,there4: there4,therefore: therefore,Therefore: Therefore,Theta: Theta,theta: theta,thetasym: thetasym,thetav: thetav,thickapprox: thickapprox,thicksim: thicksim,ThickSpace: ThickSpace,ThinSpace: ThinSpace,thinsp: thinsp,thkap: thkap,thksim: thksim,THORN: THORN,thorn: thorn,tilde: tilde,Tilde: Tilde,TildeEqual: TildeEqual,TildeFullEqual: TildeFullEqual,TildeTilde: TildeTilde,timesbar: timesbar,timesb: timesb,times: times,timesd: timesd,tint: tint,toea: toea,topbot: topbot,topcir: topcir,top: top,Topf: Topf,topf: topf,topfork: topfork,tosa: tosa,tprime: tprime,trade: trade,TRADE: TRADE,triangle: triangle,triangledown: triangledown,triangleleft: triangleleft,trianglelefteq: trianglelefteq,triangleq: triangleq,triangleright: triangleright,trianglerighteq: trianglerighteq,tridot: tridot,trie: trie,triminus: triminus,TripleDot: TripleDot,triplus: triplus,trisb: trisb,tritime: tritime,trpezium: trpezium,Tscr: Tscr,tscr: tscr,TScy: TScy,tscy: tscy,TSHcy: TSHcy,tshcy: tshcy,Tstrok: Tstrok,tstrok: tstrok,twixt: twixt,twoheadleftarrow: twoheadleftarrow,twoheadrightarrow: twoheadrightarrow,Uacute: Uacute,uacute: uacute,uarr: uarr,Uarr: Uarr,uArr: uArr,Uarrocir: Uarrocir,Ubrcy: Ubrcy,ubrcy: ubrcy,Ubreve: Ubreve,ubreve: ubreve,Ucirc: Ucirc,ucirc: ucirc,Ucy: Ucy,ucy: ucy,udarr: udarr,Udblac: Udblac,udblac: udblac,udhar: udhar,ufisht: ufisht,Ufr: Ufr,ufr: ufr,Ugrave: Ugrave,ugrave: ugrave,uHar: uHar,uharl: uharl,uharr: uharr,uhblk: uhblk,ulcorn: ulcorn,ulcorner: ulcorner,ulcrop: ulcrop,ultri: ultri,Umacr: Umacr,umacr: umacr,uml: uml,UnderBar: UnderBar,UnderBrace: UnderBrace,UnderBracket: UnderBracket,UnderParenthesis: UnderParenthesis,Union: Union,UnionPlus: UnionPlus,Uogon: Uogon,uogon: uogon,Uopf: Uopf,uopf: uopf,UpArrowBar: UpArrowBar,uparrow: uparrow,UpArrow: UpArrow,Uparrow: Uparrow,UpArrowDownArrow: UpArrowDownArrow,updownarrow: updownarrow,UpDownArrow: UpDownArrow,Updownarrow: Updownarrow,UpEquilibrium: UpEquilibrium,upharpoonleft: upharpoonleft,upharpoonright: upharpoonright,uplus: uplus,UpperLeftArrow: UpperLeftArrow,UpperRightArrow: UpperRightArrow,upsi: upsi,Upsi: Upsi,upsih: upsih,Upsilon: Upsilon,upsilon: upsilon,UpTeeArrow: UpTeeArrow,UpTee: UpTee,upuparrows: upuparrows,urcorn: urcorn,urcorner: urcorner,urcrop: urcrop,Uring: Uring,uring: uring,urtri: urtri,Uscr: Uscr,uscr: uscr,utdot: utdot,Utilde: Utilde,utilde: utilde,utri: utri,utrif: utrif,uuarr: uuarr,Uuml: Uuml,uuml: uuml,uwangle: uwangle,vangrt: vangrt,varepsilon: varepsilon,varkappa: varkappa,varnothing: varnothing,varphi: varphi,varpi: varpi,varpropto: varpropto,varr: varr,vArr: vArr,varrho: varrho,varsigma: varsigma,varsubsetneq: varsubsetneq,varsubsetneqq: varsubsetneqq,varsupsetneq: varsupsetneq,varsupsetneqq: varsupsetneqq,vartheta: vartheta,vartriangleleft: vartriangleleft,vartriangleright: vartriangleright,vBar: vBar,Vbar: Vbar,vBarv: vBarv,Vcy: Vcy,vcy: vcy,vdash: vdash,vDash: vDash,Vdash: Vdash,VDash: VDash,Vdashl: Vdashl,veebar: veebar,vee: vee,Vee: Vee,veeeq: veeeq,vellip: vellip,verbar: verbar,Verbar: Verbar,vert: vert,Vert: Vert,VerticalBar: VerticalBar,VerticalLine: VerticalLine,VerticalSeparator: VerticalSeparator,VerticalTilde: VerticalTilde,VeryThinSpace: VeryThinSpace,Vfr: Vfr,vfr: vfr,vltri: vltri,vnsub: vnsub,vnsup: vnsup,Vopf: Vopf,vopf: vopf,vprop: vprop,vrtri: vrtri,Vscr: Vscr,vscr: vscr,vsubnE: vsubnE,vsubne: vsubne,vsupnE: vsupnE,vsupne: vsupne,Vvdash: Vvdash,vzigzag: vzigzag,Wcirc: Wcirc,wcirc: wcirc,wedbar: wedbar,wedge: wedge,Wedge: Wedge,wedgeq: wedgeq,weierp: weierp,Wfr: Wfr,wfr: wfr,Wopf: Wopf,wopf: wopf,wp: wp,wr: wr,wreath: wreath,Wscr: Wscr,wscr: wscr,xcap: xcap,xcirc: xcirc,xcup: xcup,xdtri: xdtri,Xfr: Xfr,xfr: xfr,xharr: xharr,xhArr: xhArr,Xi: Xi,xi: xi,xlarr: xlarr,xlArr: xlArr,xmap: xmap,xnis: xnis,xodot: xodot,Xopf: Xopf,xopf: xopf,xoplus: xoplus,xotime: xotime,xrarr: xrarr,xrArr: xrArr,Xscr: Xscr,xscr: xscr,xsqcup: xsqcup,xuplus: xuplus,xutri: xutri,xvee: xvee,xwedge: xwedge,Yacute: Yacute,yacute: yacute,YAcy: YAcy,yacy: yacy,Ycirc: Ycirc,ycirc: ycirc,Ycy: Ycy,ycy: ycy,yen: yen,Yfr: Yfr,yfr: yfr,YIcy: YIcy,yicy: yicy,Yopf: Yopf,yopf: yopf,Yscr: Yscr,yscr: yscr,YUcy: YUcy,yucy: yucy,yuml: yuml,Yuml: Yuml,Zacute: Zacute,zacute: zacute,Zcaron: Zcaron,zcaron: zcaron,Zcy: Zcy,zcy: zcy,Zdot: Zdot,zdot: zdot,zeetrf: zeetrf,ZeroWidthSpace: ZeroWidthSpace,Zeta: Zeta,zeta: zeta,zfr: zfr,Zfr: Zfr,ZHcy: ZHcy,zhcy: zhcy,zigrarr: zigrarr,zopf: zopf,Zopf: Zopf,Zscr: Zscr,zscr: zscr,zwj: zwj,zwnj: zwnj,'default': entities});const Aacute$1="Á";const aacute$1="á";const Acirc$1="Â";const acirc$1="â";const acute$1="´";const AElig$1="Æ";const aelig$1="æ";const Agrave$1="À";const agrave$1="à";const amp$1="&";const AMP$1="&";const Aring$1="Å";const aring$1="å";const Atilde$1="Ã";const atilde$1="ã";const Auml$1="Ä";const auml$1="ä";const brvbar$1="¦";const Ccedil$1="Ç";const ccedil$1="ç";const cedil$1="¸";const cent$1="¢";const copy$1="©";const COPY$1="©";const curren$1="¤";const deg$1="°";const divide$1="÷";const Eacute$1="É";const eacute$1="é";const Ecirc$1="Ê";const ecirc$1="ê";const Egrave$1="È";const egrave$1="è";const ETH$1="Ð";const eth$1="ð";const Euml$1="Ë";const euml$1="ë";const frac12$1="½";const frac14$1="¼";const frac34$1="¾";const gt$1=">";const GT$1=">";const Iacute$1="Í";const iacute$1="í";const Icirc$1="Î";const icirc$1="î";const iexcl$1="¡";const Igrave$1="Ì";const igrave$1="ì";const iquest$1="¿";const Iuml$1="Ï";const iuml$1="ï";const laquo$1="«";const lt$1="<";const LT$1="<";const macr$1="¯";const micro$1="µ";const middot$1="·";const nbsp$1=" ";const not$1="¬";const Ntilde$1="Ñ";const ntilde$1="ñ";const Oacute$1="Ó";const oacute$1="ó";const Ocirc$1="Ô";const ocirc$1="ô";const Ograve$1="Ò";const ograve$1="ò";const ordf$1="ª";const ordm$1="º";const Oslash$1="Ø";const oslash$1="ø";const Otilde$1="Õ";const otilde$1="õ";const Ouml$1="Ö";const ouml$1="ö";const para$1="¶";const plusmn$1="±";const pound$1="£";const quot$1="\"";const QUOT$1="\"";const raquo$1="»";const reg$1="®";const REG$1="®";const sect$1="§";const shy$1="­";const sup1$1="¹";const sup2$1="²";const sup3$1="³";const szlig$1="ß";const THORN$1="Þ";const thorn$1="þ";const times$1="×";const Uacute$1="Ú";const uacute$1="ú";const Ucirc$1="Û";const ucirc$1="û";const Ugrave$1="Ù";const ugrave$1="ù";const uml$1="¨";const Uuml$1="Ü";const uuml$1="ü";const Yacute$1="Ý";const yacute$1="ý";const yen$1="¥";const yuml$1="ÿ";var legacy = {Aacute:Aacute$1,aacute:aacute$1,Acirc:Acirc$1,acirc:acirc$1,acute:acute$1,AElig:AElig$1,aelig:aelig$1,Agrave:Agrave$1,agrave:agrave$1,amp:amp$1,AMP:AMP$1,Aring:Aring$1,aring:aring$1,Atilde:Atilde$1,atilde:atilde$1,Auml:Auml$1,auml:auml$1,brvbar:brvbar$1,Ccedil:Ccedil$1,ccedil:ccedil$1,cedil:cedil$1,cent:cent$1,copy:copy$1,COPY:COPY$1,curren:curren$1,deg:deg$1,divide:divide$1,Eacute:Eacute$1,eacute:eacute$1,Ecirc:Ecirc$1,ecirc:ecirc$1,Egrave:Egrave$1,egrave:egrave$1,ETH:ETH$1,eth:eth$1,Euml:Euml$1,euml:euml$1,frac12:frac12$1,frac14:frac14$1,frac34:frac34$1,gt:gt$1,GT:GT$1,Iacute:Iacute$1,iacute:iacute$1,Icirc:Icirc$1,icirc:icirc$1,iexcl:iexcl$1,Igrave:Igrave$1,igrave:igrave$1,iquest:iquest$1,Iuml:Iuml$1,iuml:iuml$1,laquo:laquo$1,lt:lt$1,LT:LT$1,macr:macr$1,micro:micro$1,middot:middot$1,nbsp:nbsp$1,not:not$1,Ntilde:Ntilde$1,ntilde:ntilde$1,Oacute:Oacute$1,oacute:oacute$1,Ocirc:Ocirc$1,ocirc:ocirc$1,Ograve:Ograve$1,ograve:ograve$1,ordf:ordf$1,ordm:ordm$1,Oslash:Oslash$1,oslash:oslash$1,Otilde:Otilde$1,otilde:otilde$1,Ouml:Ouml$1,ouml:ouml$1,para:para$1,plusmn:plusmn$1,pound:pound$1,quot:quot$1,QUOT:QUOT$1,raquo:raquo$1,reg:reg$1,REG:REG$1,sect:sect$1,shy:shy$1,sup1:sup1$1,sup2:sup2$1,sup3:sup3$1,szlig:szlig$1,THORN:THORN$1,thorn:thorn$1,times:times$1,Uacute:Uacute$1,uacute:uacute$1,Ucirc:Ucirc$1,ucirc:ucirc$1,Ugrave:Ugrave$1,ugrave:ugrave$1,uml:uml$1,Uuml:Uuml$1,uuml:uuml$1,Yacute:Yacute$1,yacute:yacute$1,yen:yen$1,yuml:yuml$1};var legacy$1 = /*#__PURE__*/Object.freeze({Aacute: Aacute$1,aacute: aacute$1,Acirc: Acirc$1,acirc: acirc$1,acute: acute$1,AElig: AElig$1,aelig: aelig$1,Agrave: Agrave$1,agrave: agrave$1,amp: amp$1,AMP: AMP$1,Aring: Aring$1,aring: aring$1,Atilde: Atilde$1,atilde: atilde$1,Auml: Auml$1,auml: auml$1,brvbar: brvbar$1,Ccedil: Ccedil$1,ccedil: ccedil$1,cedil: cedil$1,cent: cent$1,copy: copy$1,COPY: COPY$1,curren: curren$1,deg: deg$1,divide: divide$1,Eacute: Eacute$1,eacute: eacute$1,Ecirc: Ecirc$1,ecirc: ecirc$1,Egrave: Egrave$1,egrave: egrave$1,ETH: ETH$1,eth: eth$1,Euml: Euml$1,euml: euml$1,frac12: frac12$1,frac14: frac14$1,frac34: frac34$1,gt: gt$1,GT: GT$1,Iacute: Iacute$1,iacute: iacute$1,Icirc: Icirc$1,icirc: icirc$1,iexcl: iexcl$1,Igrave: Igrave$1,igrave: igrave$1,iquest: iquest$1,Iuml: Iuml$1,iuml: iuml$1,laquo: laquo$1,lt: lt$1,LT: LT$1,macr: macr$1,micro: micro$1,middot: middot$1,nbsp: nbsp$1,not: not$1,Ntilde: Ntilde$1,ntilde: ntilde$1,Oacute: Oacute$1,oacute: oacute$1,Ocirc: Ocirc$1,ocirc: ocirc$1,Ograve: Ograve$1,ograve: ograve$1,ordf: ordf$1,ordm: ordm$1,Oslash: Oslash$1,oslash: oslash$1,Otilde: Otilde$1,otilde: otilde$1,Ouml: Ouml$1,ouml: ouml$1,para: para$1,plusmn: plusmn$1,pound: pound$1,quot: quot$1,QUOT: QUOT$1,raquo: raquo$1,reg: reg$1,REG: REG$1,sect: sect$1,shy: shy$1,sup1: sup1$1,sup2: sup2$1,sup3: sup3$1,szlig: szlig$1,THORN: THORN$1,thorn: thorn$1,times: times$1,Uacute: Uacute$1,uacute: uacute$1,Ucirc: Ucirc$1,ucirc: ucirc$1,Ugrave: Ugrave$1,ugrave: ugrave$1,uml: uml$1,Uuml: Uuml$1,uuml: uuml$1,Yacute: Yacute$1,yacute: yacute$1,yen: yen$1,yuml: yuml$1,'default': legacy});const amp$2="&";const apos$1="'";const gt$2=">";const lt$2="<";const quot$2="\"";var xml = {amp:amp$2,apos:apos$1,gt:gt$2,lt:lt$2,quot:quot$2};var xml$1 = /*#__PURE__*/Object.freeze({amp: amp$2,apos: apos$1,gt: gt$2,lt: lt$2,quot: quot$2,'default': xml});var entityMap = getCjsExportFromNamespace(entities$1);var legacyMap = getCjsExportFromNamespace(legacy$1);var xmlMap = getCjsExportFromNamespace(xml$1);var Tokenizer_1 = Tokenizer;






var i = 0;

var TEXT = i++;
var BEFORE_TAG_NAME = i++; //after <
var IN_TAG_NAME = i++;
var IN_SELF_CLOSING_TAG = i++;
var BEFORE_CLOSING_TAG_NAME = i++;
var IN_CLOSING_TAG_NAME = i++;
var AFTER_CLOSING_TAG_NAME = i++;

//attributes
var BEFORE_ATTRIBUTE_NAME = i++;
var IN_ATTRIBUTE_NAME = i++;
var AFTER_ATTRIBUTE_NAME = i++;
var BEFORE_ATTRIBUTE_VALUE = i++;
var IN_ATTRIBUTE_VALUE_DQ = i++; // "
var IN_ATTRIBUTE_VALUE_SQ = i++; // '
var IN_ATTRIBUTE_VALUE_NQ = i++;

//declarations
var BEFORE_DECLARATION = i++; // !
var IN_DECLARATION = i++;

//processing instructions
var IN_PROCESSING_INSTRUCTION = i++; // ?

//comments
var BEFORE_COMMENT = i++;
var IN_COMMENT = i++;
var AFTER_COMMENT_1 = i++;
var AFTER_COMMENT_2 = i++;

//cdata
var BEFORE_CDATA_1 = i++; // [
var BEFORE_CDATA_2 = i++; // C
var BEFORE_CDATA_3 = i++; // D
var BEFORE_CDATA_4 = i++; // A
var BEFORE_CDATA_5 = i++; // T
var BEFORE_CDATA_6 = i++; // A
var IN_CDATA = i++; // [
var AFTER_CDATA_1 = i++; // ]
var AFTER_CDATA_2 = i++; // ]

//special tags
var BEFORE_SPECIAL = i++; //S
var BEFORE_SPECIAL_END = i++; //S

var BEFORE_SCRIPT_1 = i++; //C
var BEFORE_SCRIPT_2 = i++; //R
var BEFORE_SCRIPT_3 = i++; //I
var BEFORE_SCRIPT_4 = i++; //P
var BEFORE_SCRIPT_5 = i++; //T
var AFTER_SCRIPT_1 = i++; //C
var AFTER_SCRIPT_2 = i++; //R
var AFTER_SCRIPT_3 = i++; //I
var AFTER_SCRIPT_4 = i++; //P
var AFTER_SCRIPT_5 = i++; //T

var BEFORE_STYLE_1 = i++; //T
var BEFORE_STYLE_2 = i++; //Y
var BEFORE_STYLE_3 = i++; //L
var BEFORE_STYLE_4 = i++; //E
var AFTER_STYLE_1 = i++; //T
var AFTER_STYLE_2 = i++; //Y
var AFTER_STYLE_3 = i++; //L
var AFTER_STYLE_4 = i++; //E

var BEFORE_ENTITY = i++; //&
var BEFORE_NUMERIC_ENTITY = i++; //#
var IN_NAMED_ENTITY = i++;
var IN_NUMERIC_ENTITY = i++;
var IN_HEX_ENTITY = i++; //X

var j = 0;

var SPECIAL_NONE = j++;
var SPECIAL_SCRIPT = j++;
var SPECIAL_STYLE = j++;

function whitespace(c) {
    return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
}

function ifElseState(upper, SUCCESS, FAILURE) {
    var lower = upper.toLowerCase();

    if (upper === lower) {
        return function(c) {
            if (c === lower) {
                this._state = SUCCESS;
            } else {
                this._state = FAILURE;
                this._index--;
            }
        };
    } else {
        return function(c) {
            if (c === lower || c === upper) {
                this._state = SUCCESS;
            } else {
                this._state = FAILURE;
                this._index--;
            }
        };
    }
}

function consumeSpecialNameChar(upper, NEXT_STATE) {
    var lower = upper.toLowerCase();

    return function(c) {
        if (c === lower || c === upper) {
            this._state = NEXT_STATE;
        } else {
            this._state = IN_TAG_NAME;
            this._index--; //consume the token again
        }
    };
}

function Tokenizer(options, cbs) {
    this._state = TEXT;
    this._buffer = "";
    this._sectionStart = 0;
    this._index = 0;
    this._bufferOffset = 0; //chars removed from _buffer
    this._baseState = TEXT;
    this._special = SPECIAL_NONE;
    this._cbs = cbs;
    this._running = true;
    this._ended = false;
    this._xmlMode = !!(options && options.xmlMode);
    this._decodeEntities = !!(options && options.decodeEntities);
}

Tokenizer.prototype._stateText = function(c) {
    if (c === "<") {
        if (this._index > this._sectionStart) {
            this._cbs.ontext(this._getSection());
        }
        this._state = BEFORE_TAG_NAME;
        this._sectionStart = this._index;
    } else if (
        this._decodeEntities &&
        this._special === SPECIAL_NONE &&
        c === "&"
    ) {
        if (this._index > this._sectionStart) {
            this._cbs.ontext(this._getSection());
        }
        this._baseState = TEXT;
        this._state = BEFORE_ENTITY;
        this._sectionStart = this._index;
    }
};

Tokenizer.prototype._stateBeforeTagName = function(c) {
    if (c === "/") {
        this._state = BEFORE_CLOSING_TAG_NAME;
    } else if (c === "<") {
        this._cbs.ontext(this._getSection());
        this._sectionStart = this._index;
    } else if (c === ">" || this._special !== SPECIAL_NONE || whitespace(c)) {
        this._state = TEXT;
    } else if (c === "!") {
        this._state = BEFORE_DECLARATION;
        this._sectionStart = this._index + 1;
    } else if (c === "?") {
        this._state = IN_PROCESSING_INSTRUCTION;
        this._sectionStart = this._index + 1;
    } else {
        this._state =
            !this._xmlMode && (c === "s" || c === "S")
                ? BEFORE_SPECIAL
                : IN_TAG_NAME;
        this._sectionStart = this._index;
    }
};

Tokenizer.prototype._stateInTagName = function(c) {
    if (c === "/" || c === ">" || whitespace(c)) {
        this._emitToken("onopentagname");
        this._state = BEFORE_ATTRIBUTE_NAME;
        this._index--;
    }
};

Tokenizer.prototype._stateBeforeCloseingTagName = function(c) {
    if (whitespace(c));
    else if (c === ">") {
        this._state = TEXT;
    } else if (this._special !== SPECIAL_NONE) {
        if (c === "s" || c === "S") {
            this._state = BEFORE_SPECIAL_END;
        } else {
            this._state = TEXT;
            this._index--;
        }
    } else {
        this._state = IN_CLOSING_TAG_NAME;
        this._sectionStart = this._index;
    }
};

Tokenizer.prototype._stateInCloseingTagName = function(c) {
    if (c === ">" || whitespace(c)) {
        this._emitToken("onclosetag");
        this._state = AFTER_CLOSING_TAG_NAME;
        this._index--;
    }
};

Tokenizer.prototype._stateAfterCloseingTagName = function(c) {
    //skip everything until ">"
    if (c === ">") {
        this._state = TEXT;
        this._sectionStart = this._index + 1;
    }
};

Tokenizer.prototype._stateBeforeAttributeName = function(c) {
    if (c === ">") {
        this._cbs.onopentagend();
        this._state = TEXT;
        this._sectionStart = this._index + 1;
    } else if (c === "/") {
        this._state = IN_SELF_CLOSING_TAG;
    } else if (!whitespace(c)) {
        this._state = IN_ATTRIBUTE_NAME;
        this._sectionStart = this._index;
    }
};

Tokenizer.prototype._stateInSelfClosingTag = function(c) {
    if (c === ">") {
        this._cbs.onselfclosingtag();
        this._state = TEXT;
        this._sectionStart = this._index + 1;
    } else if (!whitespace(c)) {
        this._state = BEFORE_ATTRIBUTE_NAME;
        this._index--;
    }
};

Tokenizer.prototype._stateInAttributeName = function(c) {
    if (c === "=" || c === "/" || c === ">" || whitespace(c)) {
        this._cbs.onattribname(this._getSection());
        this._sectionStart = -1;
        this._state = AFTER_ATTRIBUTE_NAME;
        this._index--;
    }
};

Tokenizer.prototype._stateAfterAttributeName = function(c) {
    if (c === "=") {
        this._state = BEFORE_ATTRIBUTE_VALUE;
    } else if (c === "/" || c === ">") {
        this._cbs.onattribend();
        this._state = BEFORE_ATTRIBUTE_NAME;
        this._index--;
    } else if (!whitespace(c)) {
        this._cbs.onattribend();
        this._state = IN_ATTRIBUTE_NAME;
        this._sectionStart = this._index;
    }
};

Tokenizer.prototype._stateBeforeAttributeValue = function(c) {
    if (c === '"') {
        this._state = IN_ATTRIBUTE_VALUE_DQ;
        this._sectionStart = this._index + 1;
    } else if (c === "'") {
        this._state = IN_ATTRIBUTE_VALUE_SQ;
        this._sectionStart = this._index + 1;
    } else if (!whitespace(c)) {
        this._state = IN_ATTRIBUTE_VALUE_NQ;
        this._sectionStart = this._index;
        this._index--; //reconsume token
    }
};

Tokenizer.prototype._stateInAttributeValueDoubleQuotes = function(c) {
    if (c === '"') {
        this._emitToken("onattribdata");
        this._cbs.onattribend();
        this._state = BEFORE_ATTRIBUTE_NAME;
    } else if (this._decodeEntities && c === "&") {
        this._emitToken("onattribdata");
        this._baseState = this._state;
        this._state = BEFORE_ENTITY;
        this._sectionStart = this._index;
    }
};

Tokenizer.prototype._stateInAttributeValueSingleQuotes = function(c) {
    if (c === "'") {
        this._emitToken("onattribdata");
        this._cbs.onattribend();
        this._state = BEFORE_ATTRIBUTE_NAME;
    } else if (this._decodeEntities && c === "&") {
        this._emitToken("onattribdata");
        this._baseState = this._state;
        this._state = BEFORE_ENTITY;
        this._sectionStart = this._index;
    }
};

Tokenizer.prototype._stateInAttributeValueNoQuotes = function(c) {
    if (whitespace(c) || c === ">") {
        this._emitToken("onattribdata");
        this._cbs.onattribend();
        this._state = BEFORE_ATTRIBUTE_NAME;
        this._index--;
    } else if (this._decodeEntities && c === "&") {
        this._emitToken("onattribdata");
        this._baseState = this._state;
        this._state = BEFORE_ENTITY;
        this._sectionStart = this._index;
    }
};

Tokenizer.prototype._stateBeforeDeclaration = function(c) {
    this._state =
        c === "["
            ? BEFORE_CDATA_1
            : c === "-"
                ? BEFORE_COMMENT
                : IN_DECLARATION;
};

Tokenizer.prototype._stateInDeclaration = function(c) {
    if (c === ">") {
        this._cbs.ondeclaration(this._getSection());
        this._state = TEXT;
        this._sectionStart = this._index + 1;
    }
};

Tokenizer.prototype._stateInProcessingInstruction = function(c) {
    if (c === ">") {
        this._cbs.onprocessinginstruction(this._getSection());
        this._state = TEXT;
        this._sectionStart = this._index + 1;
    }
};

Tokenizer.prototype._stateBeforeComment = function(c) {
    if (c === "-") {
        this._state = IN_COMMENT;
        this._sectionStart = this._index + 1;
    } else {
        this._state = IN_DECLARATION;
    }
};

Tokenizer.prototype._stateInComment = function(c) {
    if (c === "-") this._state = AFTER_COMMENT_1;
};

Tokenizer.prototype._stateAfterComment1 = function(c) {
    if (c === "-") {
        this._state = AFTER_COMMENT_2;
    } else {
        this._state = IN_COMMENT;
    }
};

Tokenizer.prototype._stateAfterComment2 = function(c) {
    if (c === ">") {
        //remove 2 trailing chars
        this._cbs.oncomment(
            this._buffer.substring(this._sectionStart, this._index - 2)
        );
        this._state = TEXT;
        this._sectionStart = this._index + 1;
    } else if (c !== "-") {
        this._state = IN_COMMENT;
    }
    // else: stay in AFTER_COMMENT_2 (`--->`)
};

Tokenizer.prototype._stateBeforeCdata1 = ifElseState(
    "C",
    BEFORE_CDATA_2,
    IN_DECLARATION
);
Tokenizer.prototype._stateBeforeCdata2 = ifElseState(
    "D",
    BEFORE_CDATA_3,
    IN_DECLARATION
);
Tokenizer.prototype._stateBeforeCdata3 = ifElseState(
    "A",
    BEFORE_CDATA_4,
    IN_DECLARATION
);
Tokenizer.prototype._stateBeforeCdata4 = ifElseState(
    "T",
    BEFORE_CDATA_5,
    IN_DECLARATION
);
Tokenizer.prototype._stateBeforeCdata5 = ifElseState(
    "A",
    BEFORE_CDATA_6,
    IN_DECLARATION
);

Tokenizer.prototype._stateBeforeCdata6 = function(c) {
    if (c === "[") {
        this._state = IN_CDATA;
        this._sectionStart = this._index + 1;
    } else {
        this._state = IN_DECLARATION;
        this._index--;
    }
};

Tokenizer.prototype._stateInCdata = function(c) {
    if (c === "]") this._state = AFTER_CDATA_1;
};

Tokenizer.prototype._stateAfterCdata1 = function(c) {
    if (c === "]") this._state = AFTER_CDATA_2;
    else this._state = IN_CDATA;
};

Tokenizer.prototype._stateAfterCdata2 = function(c) {
    if (c === ">") {
        //remove 2 trailing chars
        this._cbs.oncdata(
            this._buffer.substring(this._sectionStart, this._index - 2)
        );
        this._state = TEXT;
        this._sectionStart = this._index + 1;
    } else if (c !== "]") {
        this._state = IN_CDATA;
    }
    //else: stay in AFTER_CDATA_2 (`]]]>`)
};

Tokenizer.prototype._stateBeforeSpecial = function(c) {
    if (c === "c" || c === "C") {
        this._state = BEFORE_SCRIPT_1;
    } else if (c === "t" || c === "T") {
        this._state = BEFORE_STYLE_1;
    } else {
        this._state = IN_TAG_NAME;
        this._index--; //consume the token again
    }
};

Tokenizer.prototype._stateBeforeSpecialEnd = function(c) {
    if (this._special === SPECIAL_SCRIPT && (c === "c" || c === "C")) {
        this._state = AFTER_SCRIPT_1;
    } else if (this._special === SPECIAL_STYLE && (c === "t" || c === "T")) {
        this._state = AFTER_STYLE_1;
    } else this._state = TEXT;
};

Tokenizer.prototype._stateBeforeScript1 = consumeSpecialNameChar(
    "R",
    BEFORE_SCRIPT_2
);
Tokenizer.prototype._stateBeforeScript2 = consumeSpecialNameChar(
    "I",
    BEFORE_SCRIPT_3
);
Tokenizer.prototype._stateBeforeScript3 = consumeSpecialNameChar(
    "P",
    BEFORE_SCRIPT_4
);
Tokenizer.prototype._stateBeforeScript4 = consumeSpecialNameChar(
    "T",
    BEFORE_SCRIPT_5
);

Tokenizer.prototype._stateBeforeScript5 = function(c) {
    if (c === "/" || c === ">" || whitespace(c)) {
        this._special = SPECIAL_SCRIPT;
    }
    this._state = IN_TAG_NAME;
    this._index--; //consume the token again
};

Tokenizer.prototype._stateAfterScript1 = ifElseState("R", AFTER_SCRIPT_2, TEXT);
Tokenizer.prototype._stateAfterScript2 = ifElseState("I", AFTER_SCRIPT_3, TEXT);
Tokenizer.prototype._stateAfterScript3 = ifElseState("P", AFTER_SCRIPT_4, TEXT);
Tokenizer.prototype._stateAfterScript4 = ifElseState("T", AFTER_SCRIPT_5, TEXT);

Tokenizer.prototype._stateAfterScript5 = function(c) {
    if (c === ">" || whitespace(c)) {
        this._special = SPECIAL_NONE;
        this._state = IN_CLOSING_TAG_NAME;
        this._sectionStart = this._index - 6;
        this._index--; //reconsume the token
    } else this._state = TEXT;
};

Tokenizer.prototype._stateBeforeStyle1 = consumeSpecialNameChar(
    "Y",
    BEFORE_STYLE_2
);
Tokenizer.prototype._stateBeforeStyle2 = consumeSpecialNameChar(
    "L",
    BEFORE_STYLE_3
);
Tokenizer.prototype._stateBeforeStyle3 = consumeSpecialNameChar(
    "E",
    BEFORE_STYLE_4
);

Tokenizer.prototype._stateBeforeStyle4 = function(c) {
    if (c === "/" || c === ">" || whitespace(c)) {
        this._special = SPECIAL_STYLE;
    }
    this._state = IN_TAG_NAME;
    this._index--; //consume the token again
};

Tokenizer.prototype._stateAfterStyle1 = ifElseState("Y", AFTER_STYLE_2, TEXT);
Tokenizer.prototype._stateAfterStyle2 = ifElseState("L", AFTER_STYLE_3, TEXT);
Tokenizer.prototype._stateAfterStyle3 = ifElseState("E", AFTER_STYLE_4, TEXT);

Tokenizer.prototype._stateAfterStyle4 = function(c) {
    if (c === ">" || whitespace(c)) {
        this._special = SPECIAL_NONE;
        this._state = IN_CLOSING_TAG_NAME;
        this._sectionStart = this._index - 5;
        this._index--; //reconsume the token
    } else this._state = TEXT;
};

Tokenizer.prototype._stateBeforeEntity = ifElseState(
    "#",
    BEFORE_NUMERIC_ENTITY,
    IN_NAMED_ENTITY
);
Tokenizer.prototype._stateBeforeNumericEntity = ifElseState(
    "X",
    IN_HEX_ENTITY,
    IN_NUMERIC_ENTITY
);

//for entities terminated with a semicolon
Tokenizer.prototype._parseNamedEntityStrict = function() {
    //offset = 1
    if (this._sectionStart + 1 < this._index) {
        var entity = this._buffer.substring(
                this._sectionStart + 1,
                this._index
            ),
            map = this._xmlMode ? xmlMap : entityMap;

        if (map.hasOwnProperty(entity)) {
            this._emitPartial(map[entity]);
            this._sectionStart = this._index + 1;
        }
    }
};

//parses legacy entities (without trailing semicolon)
Tokenizer.prototype._parseLegacyEntity = function() {
    var start = this._sectionStart + 1,
        limit = this._index - start;

    if (limit > 6) limit = 6; //the max length of legacy entities is 6

    while (limit >= 2) {
        //the min length of legacy entities is 2
        var entity = this._buffer.substr(start, limit);

        if (legacyMap.hasOwnProperty(entity)) {
            this._emitPartial(legacyMap[entity]);
            this._sectionStart += limit + 1;
            return;
        } else {
            limit--;
        }
    }
};

Tokenizer.prototype._stateInNamedEntity = function(c) {
    if (c === ";") {
        this._parseNamedEntityStrict();
        if (this._sectionStart + 1 < this._index && !this._xmlMode) {
            this._parseLegacyEntity();
        }
        this._state = this._baseState;
    } else if (
        (c < "a" || c > "z") &&
        (c < "A" || c > "Z") &&
        (c < "0" || c > "9")
    ) {
        if (this._xmlMode);
        else if (this._sectionStart + 1 === this._index);
        else if (this._baseState !== TEXT) {
            if (c !== "=") {
                this._parseNamedEntityStrict();
            }
        } else {
            this._parseLegacyEntity();
        }

        this._state = this._baseState;
        this._index--;
    }
};

Tokenizer.prototype._decodeNumericEntity = function(offset, base) {
    var sectionStart = this._sectionStart + offset;

    if (sectionStart !== this._index) {
        //parse entity
        var entity = this._buffer.substring(sectionStart, this._index);
        var parsed = parseInt(entity, base);

        this._emitPartial(decode_codepoint(parsed));
        this._sectionStart = this._index;
    } else {
        this._sectionStart--;
    }

    this._state = this._baseState;
};

Tokenizer.prototype._stateInNumericEntity = function(c) {
    if (c === ";") {
        this._decodeNumericEntity(2, 10);
        this._sectionStart++;
    } else if (c < "0" || c > "9") {
        if (!this._xmlMode) {
            this._decodeNumericEntity(2, 10);
        } else {
            this._state = this._baseState;
        }
        this._index--;
    }
};

Tokenizer.prototype._stateInHexEntity = function(c) {
    if (c === ";") {
        this._decodeNumericEntity(3, 16);
        this._sectionStart++;
    } else if (
        (c < "a" || c > "f") &&
        (c < "A" || c > "F") &&
        (c < "0" || c > "9")
    ) {
        if (!this._xmlMode) {
            this._decodeNumericEntity(3, 16);
        } else {
            this._state = this._baseState;
        }
        this._index--;
    }
};

Tokenizer.prototype._cleanup = function() {
    if (this._sectionStart < 0) {
        this._buffer = "";
        this._bufferOffset += this._index;
        this._index = 0;
    } else if (this._running) {
        if (this._state === TEXT) {
            if (this._sectionStart !== this._index) {
                this._cbs.ontext(this._buffer.substr(this._sectionStart));
            }
            this._buffer = "";
            this._bufferOffset += this._index;
            this._index = 0;
        } else if (this._sectionStart === this._index) {
            //the section just started
            this._buffer = "";
            this._bufferOffset += this._index;
            this._index = 0;
        } else {
            //remove everything unnecessary
            this._buffer = this._buffer.substr(this._sectionStart);
            this._index -= this._sectionStart;
            this._bufferOffset += this._sectionStart;
        }

        this._sectionStart = 0;
    }
};

//TODO make events conditional
Tokenizer.prototype.write = function(chunk) {
    if (this._ended) this._cbs.onerror(Error(".write() after done!"));

    this._buffer += chunk;
    this._parse();
};

Tokenizer.prototype._parse = function() {
    while (this._index < this._buffer.length && this._running) {
        var c = this._buffer.charAt(this._index);
        if (this._state === TEXT) {
            this._stateText(c);
        } else if (this._state === BEFORE_TAG_NAME) {
            this._stateBeforeTagName(c);
        } else if (this._state === IN_TAG_NAME) {
            this._stateInTagName(c);
        } else if (this._state === BEFORE_CLOSING_TAG_NAME) {
            this._stateBeforeCloseingTagName(c);
        } else if (this._state === IN_CLOSING_TAG_NAME) {
            this._stateInCloseingTagName(c);
        } else if (this._state === AFTER_CLOSING_TAG_NAME) {
            this._stateAfterCloseingTagName(c);
        } else if (this._state === IN_SELF_CLOSING_TAG) {
            this._stateInSelfClosingTag(c);
        } else if (this._state === BEFORE_ATTRIBUTE_NAME) {

        /*
		*	attributes
		*/
            this._stateBeforeAttributeName(c);
        } else if (this._state === IN_ATTRIBUTE_NAME) {
            this._stateInAttributeName(c);
        } else if (this._state === AFTER_ATTRIBUTE_NAME) {
            this._stateAfterAttributeName(c);
        } else if (this._state === BEFORE_ATTRIBUTE_VALUE) {
            this._stateBeforeAttributeValue(c);
        } else if (this._state === IN_ATTRIBUTE_VALUE_DQ) {
            this._stateInAttributeValueDoubleQuotes(c);
        } else if (this._state === IN_ATTRIBUTE_VALUE_SQ) {
            this._stateInAttributeValueSingleQuotes(c);
        } else if (this._state === IN_ATTRIBUTE_VALUE_NQ) {
            this._stateInAttributeValueNoQuotes(c);
        } else if (this._state === BEFORE_DECLARATION) {

        /*
		*	declarations
		*/
            this._stateBeforeDeclaration(c);
        } else if (this._state === IN_DECLARATION) {
            this._stateInDeclaration(c);
        } else if (this._state === IN_PROCESSING_INSTRUCTION) {

        /*
		*	processing instructions
		*/
            this._stateInProcessingInstruction(c);
        } else if (this._state === BEFORE_COMMENT) {

        /*
		*	comments
		*/
            this._stateBeforeComment(c);
        } else if (this._state === IN_COMMENT) {
            this._stateInComment(c);
        } else if (this._state === AFTER_COMMENT_1) {
            this._stateAfterComment1(c);
        } else if (this._state === AFTER_COMMENT_2) {
            this._stateAfterComment2(c);
        } else if (this._state === BEFORE_CDATA_1) {

        /*
		*	cdata
		*/
            this._stateBeforeCdata1(c);
        } else if (this._state === BEFORE_CDATA_2) {
            this._stateBeforeCdata2(c);
        } else if (this._state === BEFORE_CDATA_3) {
            this._stateBeforeCdata3(c);
        } else if (this._state === BEFORE_CDATA_4) {
            this._stateBeforeCdata4(c);
        } else if (this._state === BEFORE_CDATA_5) {
            this._stateBeforeCdata5(c);
        } else if (this._state === BEFORE_CDATA_6) {
            this._stateBeforeCdata6(c);
        } else if (this._state === IN_CDATA) {
            this._stateInCdata(c);
        } else if (this._state === AFTER_CDATA_1) {
            this._stateAfterCdata1(c);
        } else if (this._state === AFTER_CDATA_2) {
            this._stateAfterCdata2(c);
        } else if (this._state === BEFORE_SPECIAL) {

        /*
		* special tags
		*/
            this._stateBeforeSpecial(c);
        } else if (this._state === BEFORE_SPECIAL_END) {
            this._stateBeforeSpecialEnd(c);
        } else if (this._state === BEFORE_SCRIPT_1) {

        /*
		* script
		*/
            this._stateBeforeScript1(c);
        } else if (this._state === BEFORE_SCRIPT_2) {
            this._stateBeforeScript2(c);
        } else if (this._state === BEFORE_SCRIPT_3) {
            this._stateBeforeScript3(c);
        } else if (this._state === BEFORE_SCRIPT_4) {
            this._stateBeforeScript4(c);
        } else if (this._state === BEFORE_SCRIPT_5) {
            this._stateBeforeScript5(c);
        } else if (this._state === AFTER_SCRIPT_1) {
            this._stateAfterScript1(c);
        } else if (this._state === AFTER_SCRIPT_2) {
            this._stateAfterScript2(c);
        } else if (this._state === AFTER_SCRIPT_3) {
            this._stateAfterScript3(c);
        } else if (this._state === AFTER_SCRIPT_4) {
            this._stateAfterScript4(c);
        } else if (this._state === AFTER_SCRIPT_5) {
            this._stateAfterScript5(c);
        } else if (this._state === BEFORE_STYLE_1) {

        /*
		* style
		*/
            this._stateBeforeStyle1(c);
        } else if (this._state === BEFORE_STYLE_2) {
            this._stateBeforeStyle2(c);
        } else if (this._state === BEFORE_STYLE_3) {
            this._stateBeforeStyle3(c);
        } else if (this._state === BEFORE_STYLE_4) {
            this._stateBeforeStyle4(c);
        } else if (this._state === AFTER_STYLE_1) {
            this._stateAfterStyle1(c);
        } else if (this._state === AFTER_STYLE_2) {
            this._stateAfterStyle2(c);
        } else if (this._state === AFTER_STYLE_3) {
            this._stateAfterStyle3(c);
        } else if (this._state === AFTER_STYLE_4) {
            this._stateAfterStyle4(c);
        } else if (this._state === BEFORE_ENTITY) {

        /*
		* entities
		*/
            this._stateBeforeEntity(c);
        } else if (this._state === BEFORE_NUMERIC_ENTITY) {
            this._stateBeforeNumericEntity(c);
        } else if (this._state === IN_NAMED_ENTITY) {
            this._stateInNamedEntity(c);
        } else if (this._state === IN_NUMERIC_ENTITY) {
            this._stateInNumericEntity(c);
        } else if (this._state === IN_HEX_ENTITY) {
            this._stateInHexEntity(c);
        } else {
            this._cbs.onerror(Error("unknown _state"), this._state);
        }

        this._index++;
    }

    this._cleanup();
};

Tokenizer.prototype.pause = function() {
    this._running = false;
};
Tokenizer.prototype.resume = function() {
    this._running = true;

    if (this._index < this._buffer.length) {
        this._parse();
    }
    if (this._ended) {
        this._finish();
    }
};

Tokenizer.prototype.end = function(chunk) {
    if (this._ended) this._cbs.onerror(Error(".end() after done!"));
    if (chunk) this.write(chunk);

    this._ended = true;

    if (this._running) this._finish();
};

Tokenizer.prototype._finish = function() {
    //if there is remaining data, emit it in a reasonable way
    if (this._sectionStart < this._index) {
        this._handleTrailingData();
    }

    this._cbs.onend();
};

Tokenizer.prototype._handleTrailingData = function() {
    var data = this._buffer.substr(this._sectionStart);

    if (
        this._state === IN_CDATA ||
        this._state === AFTER_CDATA_1 ||
        this._state === AFTER_CDATA_2
    ) {
        this._cbs.oncdata(data);
    } else if (
        this._state === IN_COMMENT ||
        this._state === AFTER_COMMENT_1 ||
        this._state === AFTER_COMMENT_2
    ) {
        this._cbs.oncomment(data);
    } else if (this._state === IN_NAMED_ENTITY && !this._xmlMode) {
        this._parseLegacyEntity();
        if (this._sectionStart < this._index) {
            this._state = this._baseState;
            this._handleTrailingData();
        }
    } else if (this._state === IN_NUMERIC_ENTITY && !this._xmlMode) {
        this._decodeNumericEntity(2, 10);
        if (this._sectionStart < this._index) {
            this._state = this._baseState;
            this._handleTrailingData();
        }
    } else if (this._state === IN_HEX_ENTITY && !this._xmlMode) {
        this._decodeNumericEntity(3, 16);
        if (this._sectionStart < this._index) {
            this._state = this._baseState;
            this._handleTrailingData();
        }
    } else if (
        this._state !== IN_TAG_NAME &&
        this._state !== BEFORE_ATTRIBUTE_NAME &&
        this._state !== BEFORE_ATTRIBUTE_VALUE &&
        this._state !== AFTER_ATTRIBUTE_NAME &&
        this._state !== IN_ATTRIBUTE_NAME &&
        this._state !== IN_ATTRIBUTE_VALUE_SQ &&
        this._state !== IN_ATTRIBUTE_VALUE_DQ &&
        this._state !== IN_ATTRIBUTE_VALUE_NQ &&
        this._state !== IN_CLOSING_TAG_NAME
    ) {
        this._cbs.ontext(data);
    }
    //else, ignore remaining data
    //TODO add a way to remove current tag
};

Tokenizer.prototype.reset = function() {
    Tokenizer.call(
        this,
        { xmlMode: this._xmlMode, decodeEntities: this._decodeEntities },
        this._cbs
    );
};

Tokenizer.prototype.getAbsoluteIndex = function() {
    return this._bufferOffset + this._index;
};

Tokenizer.prototype._getSection = function() {
    return this._buffer.substring(this._sectionStart, this._index);
};

Tokenizer.prototype._emitToken = function(name) {
    this._cbs[name](this._getSection());
    this._sectionStart = -1;
};

Tokenizer.prototype._emitPartial = function(value) {
    if (this._baseState !== TEXT) {
        this._cbs.onattribdata(value); //TODO implement the new event
    } else {
        this._cbs.ontext(value);
    }
};var inherits_browser = createCommonjsModule(function (module) {
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
          value: ctor,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
    }
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    if (superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }
  };
}
});var inherits = createCommonjsModule(function (module) {
try {
  var util$1 = util;
  /* istanbul ignore next */
  if (typeof util$1.inherits !== 'function') throw '';
  module.exports = util$1.inherits;
} catch (e) {
  /* istanbul ignore next */
  module.exports = inherits_browser;
}
});var Tokenizer$1 = Tokenizer_1;

/*
	Options:

	xmlMode: Disables the special behavior for script/style tags (false by default)
	lowerCaseAttributeNames: call .toLowerCase for each attribute name (true if xmlMode is `false`)
	lowerCaseTags: call .toLowerCase for each tag name (true if xmlMode is `false`)
*/

/*
	Callbacks:

	oncdataend,
	oncdatastart,
	onclosetag,
	oncomment,
	oncommentend,
	onerror,
	onopentag,
	onprocessinginstruction,
	onreset,
	ontext
*/

var formTags = {
    input: true,
    option: true,
    optgroup: true,
    select: true,
    button: true,
    datalist: true,
    textarea: true
};

var openImpliesClose = {
    tr: { tr: true, th: true, td: true },
    th: { th: true },
    td: { thead: true, th: true, td: true },
    body: { head: true, link: true, script: true },
    li: { li: true },
    p: { p: true },
    h1: { p: true },
    h2: { p: true },
    h3: { p: true },
    h4: { p: true },
    h5: { p: true },
    h6: { p: true },
    select: formTags,
    input: formTags,
    output: formTags,
    button: formTags,
    datalist: formTags,
    textarea: formTags,
    option: { option: true },
    optgroup: { optgroup: true }
};

var voidElements = {
    __proto__: null,
    area: true,
    base: true,
    basefont: true,
    br: true,
    col: true,
    command: true,
    embed: true,
    frame: true,
    hr: true,
    img: true,
    input: true,
    isindex: true,
    keygen: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true
};

var foreignContextElements = {
    __proto__: null,
    math: true,
    svg: true
};
var htmlIntegrationElements = {
    __proto__: null,
    mi: true,
    mo: true,
    mn: true,
    ms: true,
    mtext: true,
    "annotation-xml": true,
    foreignObject: true,
    desc: true,
    title: true
};

var re_nameEnd = /\s|\//;

function Parser(cbs, options) {
    this._options = options || {};
    this._cbs = cbs || {};

    this._tagname = "";
    this._attribname = "";
    this._attribvalue = "";
    this._attribs = null;
    this._stack = [];
    this._foreignContext = [];

    this.startIndex = 0;
    this.endIndex = null;

    this._lowerCaseTagNames =
        "lowerCaseTags" in this._options
            ? !!this._options.lowerCaseTags
            : !this._options.xmlMode;
    this._lowerCaseAttributeNames =
        "lowerCaseAttributeNames" in this._options
            ? !!this._options.lowerCaseAttributeNames
            : !this._options.xmlMode;

    if (this._options.Tokenizer) {
        Tokenizer$1 = this._options.Tokenizer;
    }
    this._tokenizer = new Tokenizer$1(this._options, this);

    if (this._cbs.onparserinit) this._cbs.onparserinit(this);
}

inherits(Parser, events.EventEmitter);

Parser.prototype._updatePosition = function(initialOffset) {
    if (this.endIndex === null) {
        if (this._tokenizer._sectionStart <= initialOffset) {
            this.startIndex = 0;
        } else {
            this.startIndex = this._tokenizer._sectionStart - initialOffset;
        }
    } else this.startIndex = this.endIndex + 1;
    this.endIndex = this._tokenizer.getAbsoluteIndex();
};

//Tokenizer event handlers
Parser.prototype.ontext = function(data) {
    this._updatePosition(1);
    this.endIndex--;

    if (this._cbs.ontext) this._cbs.ontext(data);
};

Parser.prototype.onopentagname = function(name) {
    if (this._lowerCaseTagNames) {
        name = name.toLowerCase();
    }

    this._tagname = name;

    if (!this._options.xmlMode && name in openImpliesClose) {
        for (
            var el;
            (el = this._stack[this._stack.length - 1]) in
            openImpliesClose[name];
            this.onclosetag(el)
        );
    }

    if (this._options.xmlMode || !(name in voidElements)) {
        this._stack.push(name);
        if (name in foreignContextElements) this._foreignContext.push(true);
        else if (name in htmlIntegrationElements)
            this._foreignContext.push(false);
    }

    if (this._cbs.onopentagname) this._cbs.onopentagname(name);
    if (this._cbs.onopentag) this._attribs = {};
};

Parser.prototype.onopentagend = function() {
    this._updatePosition(1);

    if (this._attribs) {
        if (this._cbs.onopentag)
            this._cbs.onopentag(this._tagname, this._attribs);
        this._attribs = null;
    }

    if (
        !this._options.xmlMode &&
        this._cbs.onclosetag &&
        this._tagname in voidElements
    ) {
        this._cbs.onclosetag(this._tagname);
    }

    this._tagname = "";
};

Parser.prototype.onclosetag = function(name) {
    this._updatePosition(1);

    if (this._lowerCaseTagNames) {
        name = name.toLowerCase();
    }
    
    if (name in foreignContextElements || name in htmlIntegrationElements) {
        this._foreignContext.pop();
    }

    if (
        this._stack.length &&
        (!(name in voidElements) || this._options.xmlMode)
    ) {
        var pos = this._stack.lastIndexOf(name);
        if (pos !== -1) {
            if (this._cbs.onclosetag) {
                pos = this._stack.length - pos;
                while (pos--) this._cbs.onclosetag(this._stack.pop());
            } else this._stack.length = pos;
        } else if (name === "p" && !this._options.xmlMode) {
            this.onopentagname(name);
            this._closeCurrentTag();
        }
    } else if (!this._options.xmlMode && (name === "br" || name === "p")) {
        this.onopentagname(name);
        this._closeCurrentTag();
    }
};

Parser.prototype.onselfclosingtag = function() {
    if (
        this._options.xmlMode ||
        this._options.recognizeSelfClosing ||
        this._foreignContext[this._foreignContext.length - 1]
    ) {
        this._closeCurrentTag();
    } else {
        this.onopentagend();
    }
};

Parser.prototype._closeCurrentTag = function() {
    var name = this._tagname;

    this.onopentagend();

    //self-closing tags will be on the top of the stack
    //(cheaper check than in onclosetag)
    if (this._stack[this._stack.length - 1] === name) {
        if (this._cbs.onclosetag) {
            this._cbs.onclosetag(name);
        }
        this._stack.pop();
        
    }
};

Parser.prototype.onattribname = function(name) {
    if (this._lowerCaseAttributeNames) {
        name = name.toLowerCase();
    }
    this._attribname = name;
};

Parser.prototype.onattribdata = function(value) {
    this._attribvalue += value;
};

Parser.prototype.onattribend = function() {
    if (this._cbs.onattribute)
        this._cbs.onattribute(this._attribname, this._attribvalue);
    if (
        this._attribs &&
        !Object.prototype.hasOwnProperty.call(this._attribs, this._attribname)
    ) {
        this._attribs[this._attribname] = this._attribvalue;
    }
    this._attribname = "";
    this._attribvalue = "";
};

Parser.prototype._getInstructionName = function(value) {
    var idx = value.search(re_nameEnd),
        name = idx < 0 ? value : value.substr(0, idx);

    if (this._lowerCaseTagNames) {
        name = name.toLowerCase();
    }

    return name;
};

Parser.prototype.ondeclaration = function(value) {
    if (this._cbs.onprocessinginstruction) {
        var name = this._getInstructionName(value);
        this._cbs.onprocessinginstruction("!" + name, "!" + value);
    }
};

Parser.prototype.onprocessinginstruction = function(value) {
    if (this._cbs.onprocessinginstruction) {
        var name = this._getInstructionName(value);
        this._cbs.onprocessinginstruction("?" + name, "?" + value);
    }
};

Parser.prototype.oncomment = function(value) {
    this._updatePosition(4);

    if (this._cbs.oncomment) this._cbs.oncomment(value);
    if (this._cbs.oncommentend) this._cbs.oncommentend();
};

Parser.prototype.oncdata = function(value) {
    this._updatePosition(1);

    if (this._options.xmlMode || this._options.recognizeCDATA) {
        if (this._cbs.oncdatastart) this._cbs.oncdatastart();
        if (this._cbs.ontext) this._cbs.ontext(value);
        if (this._cbs.oncdataend) this._cbs.oncdataend();
    } else {
        this.oncomment("[CDATA[" + value + "]]");
    }
};

Parser.prototype.onerror = function(err) {
    if (this._cbs.onerror) this._cbs.onerror(err);
};

Parser.prototype.onend = function() {
    if (this._cbs.onclosetag) {
        for (
            var i = this._stack.length;
            i > 0;
            this._cbs.onclosetag(this._stack[--i])
        );
    }
    if (this._cbs.onend) this._cbs.onend();
};

//Resets the parser to a blank state, ready to parse a new HTML document
Parser.prototype.reset = function() {
    if (this._cbs.onreset) this._cbs.onreset();
    this._tokenizer.reset();

    this._tagname = "";
    this._attribname = "";
    this._attribs = null;
    this._stack = [];

    if (this._cbs.onparserinit) this._cbs.onparserinit(this);
};

//Parses a complete HTML document and pushes it to the handler
Parser.prototype.parseComplete = function(data) {
    this.reset();
    this.end(data);
};

Parser.prototype.write = function(chunk) {
    this._tokenizer.write(chunk);
};

Parser.prototype.end = function(chunk) {
    this._tokenizer.end(chunk);
};

Parser.prototype.pause = function() {
    this._tokenizer.pause();
};

Parser.prototype.resume = function() {
    this._tokenizer.resume();
};

//alias for backwards compat
Parser.prototype.parseChunk = Parser.prototype.write;
Parser.prototype.done = Parser.prototype.end;

var Parser_1 = Parser;//Types of elements found in the DOM
var domelementtype = {
	Text: "text", //Text
	Directive: "directive", //<? ... ?>
	Comment: "comment", //<!-- ... -->
	Script: "script", //<script> tags
	Style: "style", //<style> tags
	Tag: "tag", //Any tag
	CDATA: "cdata", //<![CDATA[ ... ]]>
	Doctype: "doctype",

	isTag: function(elem){
		return elem.type === "tag" || elem.type === "script" || elem.type === "style";
	}
};var node$1 = createCommonjsModule(function (module) {
// This object will be used as the prototype for Nodes when creating a
// DOM-Level-1-compliant structure.
var NodePrototype = module.exports = {
	get firstChild() {
		var children = this.children;
		return children && children[0] || null;
	},
	get lastChild() {
		var children = this.children;
		return children && children[children.length - 1] || null;
	},
	get nodeType() {
		return nodeTypes[this.type] || nodeTypes.element;
	}
};

var domLvl1 = {
	tagName: "name",
	childNodes: "children",
	parentNode: "parent",
	previousSibling: "prev",
	nextSibling: "next",
	nodeValue: "data"
};

var nodeTypes = {
	element: 1,
	text: 3,
	cdata: 4,
	comment: 8
};

Object.keys(domLvl1).forEach(function(key) {
	var shorthand = domLvl1[key];
	Object.defineProperty(NodePrototype, key, {
		get: function() {
			return this[shorthand] || null;
		},
		set: function(val) {
			this[shorthand] = val;
			return val;
		}
	});
});
});
var node_1$1 = node$1.firstChild;
var node_2$1 = node$1.lastChild;
var node_3$1 = node$1.nodeType;var element = createCommonjsModule(function (module) {
// DOM-Level-1-compliant structure

var ElementPrototype = module.exports = Object.create(node$1);

var domLvl1 = {
	tagName: "name"
};

Object.keys(domLvl1).forEach(function(key) {
	var shorthand = domLvl1[key];
	Object.defineProperty(ElementPrototype, key, {
		get: function() {
			return this[shorthand] || null;
		},
		set: function(val) {
			this[shorthand] = val;
			return val;
		}
	});
});
});var re_whitespace = /\s+/g;



function DomHandler(callback, options, elementCB){
	if(typeof callback === "object"){
		elementCB = options;
		options = callback;
		callback = null;
	} else if(typeof options === "function"){
		elementCB = options;
		options = defaultOpts;
	}
	this._callback = callback;
	this._options = options || defaultOpts;
	this._elementCB = elementCB;
	this.dom = [];
	this._done = false;
	this._tagStack = [];
	this._parser = this._parser || null;
}

//default options
var defaultOpts = {
	normalizeWhitespace: false, //Replace all whitespace with single spaces
	withStartIndices: false, //Add startIndex properties to nodes
	withEndIndices: false, //Add endIndex properties to nodes
};

DomHandler.prototype.onparserinit = function(parser){
	this._parser = parser;
};

//Resets the handler back to starting state
DomHandler.prototype.onreset = function(){
	DomHandler.call(this, this._callback, this._options, this._elementCB);
};

//Signals the handler that parsing is done
DomHandler.prototype.onend = function(){
	if(this._done) return;
	this._done = true;
	this._parser = null;
	this._handleCallback(null);
};

DomHandler.prototype._handleCallback =
DomHandler.prototype.onerror = function(error){
	if(typeof this._callback === "function"){
		this._callback(error, this.dom);
	} else {
		if(error) throw error;
	}
};

DomHandler.prototype.onclosetag = function(){
	//if(this._tagStack.pop().name !== name) this._handleCallback(Error("Tagname didn't match!"));
	
	var elem = this._tagStack.pop();

	if(this._options.withEndIndices && elem){
		elem.endIndex = this._parser.endIndex;
	}

	if(this._elementCB) this._elementCB(elem);
};

DomHandler.prototype._createDomElement = function(properties){
	if (!this._options.withDomLvl1) return properties;

	var element$1;
	if (properties.type === "tag") {
		element$1 = Object.create(element);
	} else {
		element$1 = Object.create(node$1);
	}

	for (var key in properties) {
		if (properties.hasOwnProperty(key)) {
			element$1[key] = properties[key];
		}
	}

	return element$1;
};

DomHandler.prototype._addDomElement = function(element){
	var parent = this._tagStack[this._tagStack.length - 1];
	var siblings = parent ? parent.children : this.dom;
	var previousSibling = siblings[siblings.length - 1];

	element.next = null;

	if(this._options.withStartIndices){
		element.startIndex = this._parser.startIndex;
	}
	if(this._options.withEndIndices){
		element.endIndex = this._parser.endIndex;
	}

	if(previousSibling){
		element.prev = previousSibling;
		previousSibling.next = element;
	} else {
		element.prev = null;
	}

	siblings.push(element);
	element.parent = parent || null;
};

DomHandler.prototype.onopentag = function(name, attribs){
	var properties = {
		type: name === "script" ? domelementtype.Script : name === "style" ? domelementtype.Style : domelementtype.Tag,
		name: name,
		attribs: attribs,
		children: []
	};

	var element = this._createDomElement(properties);

	this._addDomElement(element);

	this._tagStack.push(element);
};

DomHandler.prototype.ontext = function(data){
	//the ignoreWhitespace is officially dropped, but for now,
	//it's an alias for normalizeWhitespace
	var normalize = this._options.normalizeWhitespace || this._options.ignoreWhitespace;

	var lastTag;

	if(!this._tagStack.length && this.dom.length && (lastTag = this.dom[this.dom.length-1]).type === domelementtype.Text){
		if(normalize){
			lastTag.data = (lastTag.data + data).replace(re_whitespace, " ");
		} else {
			lastTag.data += data;
		}
	} else {
		if(
			this._tagStack.length &&
			(lastTag = this._tagStack[this._tagStack.length - 1]) &&
			(lastTag = lastTag.children[lastTag.children.length - 1]) &&
			lastTag.type === domelementtype.Text
		){
			if(normalize){
				lastTag.data = (lastTag.data + data).replace(re_whitespace, " ");
			} else {
				lastTag.data += data;
			}
		} else {
			if(normalize){
				data = data.replace(re_whitespace, " ");
			}

			var element = this._createDomElement({
				data: data,
				type: domelementtype.Text
			});

			this._addDomElement(element);
		}
	}
};

DomHandler.prototype.oncomment = function(data){
	var lastTag = this._tagStack[this._tagStack.length - 1];

	if(lastTag && lastTag.type === domelementtype.Comment){
		lastTag.data += data;
		return;
	}

	var properties = {
		data: data,
		type: domelementtype.Comment
	};

	var element = this._createDomElement(properties);

	this._addDomElement(element);
	this._tagStack.push(element);
};

DomHandler.prototype.oncdatastart = function(){
	var properties = {
		children: [{
			data: "",
			type: domelementtype.Text
		}],
		type: domelementtype.CDATA
	};

	var element = this._createDomElement(properties);

	this._addDomElement(element);
	this._tagStack.push(element);
};

DomHandler.prototype.oncommentend = DomHandler.prototype.oncdataend = function(){
	this._tagStack.pop();
};

DomHandler.prototype.onprocessinginstruction = function(name, data){
	var element = this._createDomElement({
		name: name,
		data: data,
		type: domelementtype.Directive
	});

	this._addDomElement(element);
};

var domhandler = DomHandler;var inverseXML = getInverseObj(xmlMap),
    xmlReplacer = getInverseReplacer(inverseXML);

var XML = getInverse(inverseXML, xmlReplacer);

var inverseHTML = getInverseObj(entityMap),
    htmlReplacer = getInverseReplacer(inverseHTML);

var HTML = getInverse(inverseHTML, htmlReplacer);

function getInverseObj(obj) {
    return Object.keys(obj)
        .sort()
        .reduce(function(inverse, name) {
            inverse[obj[name]] = "&" + name + ";";
            return inverse;
        }, {});
}

function getInverseReplacer(inverse) {
    var single = [],
        multiple = [];

    Object.keys(inverse).forEach(function(k) {
        if (k.length === 1) {
            single.push("\\" + k);
        } else {
            multiple.push(k);
        }
    });

    //TODO add ranges
    multiple.unshift("[" + single.join("") + "]");

    return new RegExp(multiple.join("|"), "g");
}

var re_nonASCII = /[^\0-\x7F]/g,
    re_astralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

function singleCharReplacer(c) {
    return (
        "&#x" +
        c
            .charCodeAt(0)
            .toString(16)
            .toUpperCase() +
        ";"
    );
}

function astralReplacer(c) {
    // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
    var high = c.charCodeAt(0);
    var low = c.charCodeAt(1);
    var codePoint = (high - 0xd800) * 0x400 + low - 0xdc00 + 0x10000;
    return "&#x" + codePoint.toString(16).toUpperCase() + ";";
}

function getInverse(inverse, re) {
    function func(name) {
        return inverse[name];
    }

    return function(data) {
        return data
            .replace(re, func)
            .replace(re_astralSymbols, astralReplacer)
            .replace(re_nonASCII, singleCharReplacer);
    };
}

var re_xmlChars = getInverseReplacer(inverseXML);

function escapeXML(data) {
    return data
        .replace(re_xmlChars, singleCharReplacer)
        .replace(re_astralSymbols, astralReplacer)
        .replace(re_nonASCII, singleCharReplacer);
}

var escape = escapeXML;

var encode$1 = {
	XML: XML,
	HTML: HTML,
	escape: escape
};var decodeXMLStrict = getStrictDecoder(xmlMap),
    decodeHTMLStrict = getStrictDecoder(entityMap);

function getStrictDecoder(map) {
    var keys = Object.keys(map).join("|"),
        replace = getReplacer(map);

    keys += "|#[xX][\\da-fA-F]+|#\\d+";

    var re = new RegExp("&(?:" + keys + ");", "g");

    return function(str) {
        return String(str).replace(re, replace);
    };
}

var decodeHTML = (function() {
    var legacy = Object.keys(legacyMap).sort(sorter);

    var keys = Object.keys(entityMap).sort(sorter);

    for (var i = 0, j = 0; i < keys.length; i++) {
        if (legacy[j] === keys[i]) {
            keys[i] += ";?";
            j++;
        } else {
            keys[i] += ";";
        }
    }

    var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g"),
        replace = getReplacer(entityMap);

    function replacer(str) {
        if (str.substr(-1) !== ";") str += ";";
        return replace(str);
    }

    //TODO consider creating a merged map
    return function(str) {
        return String(str).replace(re, replacer);
    };
})();

function sorter(a, b) {
    return a < b ? 1 : -1;
}

function getReplacer(map) {
    return function replace(str) {
        if (str.charAt(1) === "#") {
            if (str.charAt(2) === "X" || str.charAt(2) === "x") {
                return decode_codepoint(parseInt(str.substr(3), 16));
            }
            return decode_codepoint(parseInt(str.substr(2), 10));
        }
        return map[str.slice(1, -1)];
    };
}

var decode$2 = {
    XML: decodeXMLStrict,
    HTML: decodeHTML,
    HTMLStrict: decodeHTMLStrict
};var entities$2 = createCommonjsModule(function (module, exports) {
exports.decode = function(data, level) {
    return (!level || level <= 0 ? decode$2.XML : decode$2.HTML)(data);
};

exports.decodeStrict = function(data, level) {
    return (!level || level <= 0 ? decode$2.XML : decode$2.HTMLStrict)(data);
};

exports.encode = function(data, level) {
    return (!level || level <= 0 ? encode$1.XML : encode$1.HTML)(data);
};

exports.encodeXML = encode$1.XML;

exports.encodeHTML4 = exports.encodeHTML5 = exports.encodeHTML = encode$1.HTML;

exports.decodeXML = exports.decodeXMLStrict = decode$2.XML;

exports.decodeHTML4 = exports.decodeHTML5 = exports.decodeHTML = decode$2.HTML;

exports.decodeHTML4Strict = exports.decodeHTML5Strict = exports.decodeHTMLStrict = decode$2.HTMLStrict;

exports.escape = encode$1.escape;
});
var entities_1 = entities$2.decode;
var entities_2 = entities$2.decodeStrict;
var entities_3 = entities$2.encode;
var entities_4 = entities$2.encodeXML;
var entities_5 = entities$2.encodeHTML4;
var entities_6 = entities$2.encodeHTML5;
var entities_7 = entities$2.encodeHTML;
var entities_8 = entities$2.decodeXML;
var entities_9 = entities$2.decodeXMLStrict;
var entities_10 = entities$2.decodeHTML4;
var entities_11 = entities$2.decodeHTML5;
var entities_12 = entities$2.decodeHTML;
var entities_13 = entities$2.decodeHTML4Strict;
var entities_14 = entities$2.decodeHTML5Strict;
var entities_15 = entities$2.decodeHTMLStrict;
var entities_16 = entities$2.escape;var domSerializer = createCommonjsModule(function (module) {
/*
  Module dependencies
*/



var unencodedElements = {
  __proto__: null,
  style: true,
  script: true,
  xmp: true,
  iframe: true,
  noembed: true,
  noframes: true,
  plaintext: true,
  noscript: true
};

/*
  Format attributes
*/
function formatAttrs(attributes, opts) {
  if (!attributes) return;

  var output = '',
      value;

  // Loop through the attributes
  for (var key in attributes) {
    value = attributes[key];
    if (output) {
      output += ' ';
    }

    output += key;
    if ((value !== null && value !== '') || opts.xmlMode) {
        output += '="' + (opts.decodeEntities ? entities$2.encodeXML(value) : value) + '"';
    }
  }

  return output;
}

/*
  Self-enclosing tags (stolen from node-htmlparser)
*/
var singleTag = {
  __proto__: null,
  area: true,
  base: true,
  basefont: true,
  br: true,
  col: true,
  command: true,
  embed: true,
  frame: true,
  hr: true,
  img: true,
  input: true,
  isindex: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true,
};


var render = module.exports = function(dom, opts) {
  if (!Array.isArray(dom) && !dom.cheerio) dom = [dom];
  opts = opts || {};

  var output = '';

  for(var i = 0; i < dom.length; i++){
    var elem = dom[i];

    if (elem.type === 'root')
      output += render(elem.children, opts);
    else if (domelementtype.isTag(elem))
      output += renderTag(elem, opts);
    else if (elem.type === domelementtype.Directive)
      output += renderDirective(elem);
    else if (elem.type === domelementtype.Comment)
      output += renderComment(elem);
    else if (elem.type === domelementtype.CDATA)
      output += renderCdata(elem);
    else
      output += renderText(elem, opts);
  }

  return output;
};

function renderTag(elem, opts) {
  // Handle SVG
  if (elem.name === "svg") opts = {decodeEntities: opts.decodeEntities, xmlMode: true};

  var tag = '<' + elem.name,
      attribs = formatAttrs(elem.attribs, opts);

  if (attribs) {
    tag += ' ' + attribs;
  }

  if (
    opts.xmlMode
    && (!elem.children || elem.children.length === 0)
  ) {
    tag += '/>';
  } else {
    tag += '>';
    if (elem.children) {
      tag += render(elem.children, opts);
    }

    if (!singleTag[elem.name] || opts.xmlMode) {
      tag += '</' + elem.name + '>';
    }
  }

  return tag;
}

function renderDirective(elem) {
  return '<' + elem.data + '>';
}

function renderText(elem, opts) {
  var data = elem.data || '';

  // if entities weren't decoded, no need to encode them back
  if (opts.decodeEntities && !(elem.parent && elem.parent.name in unencodedElements)) {
    data = entities$2.encodeXML(data);
  }

  return data;
}

function renderCdata(elem) {
  return '<![CDATA[' + elem.children[0].data + ']]>';
}

function renderComment(elem) {
  return '<!--' + elem.data + '-->';
}
});var isTag = domelementtype.isTag;

var stringify = {
	getInnerHTML: getInnerHTML,
	getOuterHTML: domSerializer,
	getText: getText
};

function getInnerHTML(elem, opts){
	return elem.children ? elem.children.map(function(elem){
		return domSerializer(elem, opts);
	}).join("") : "";
}

function getText(elem){
	if(Array.isArray(elem)) return elem.map(getText).join("");
	if(isTag(elem)) return elem.name === "br" ? "\n" : getText(elem.children);
	if(elem.type === domelementtype.CDATA) return getText(elem.children);
	if(elem.type === domelementtype.Text) return elem.data;
	return "";
}var traversal = createCommonjsModule(function (module, exports) {
var getChildren = exports.getChildren = function(elem){
	return elem.children;
};

var getParent = exports.getParent = function(elem){
	return elem.parent;
};

exports.getSiblings = function(elem){
	var parent = getParent(elem);
	return parent ? getChildren(parent) : [elem];
};

exports.getAttributeValue = function(elem, name){
	return elem.attribs && elem.attribs[name];
};

exports.hasAttrib = function(elem, name){
	return !!elem.attribs && hasOwnProperty.call(elem.attribs, name);
};

exports.getName = function(elem){
	return elem.name;
};
});
var traversal_1 = traversal.getChildren;
var traversal_2 = traversal.getParent;
var traversal_3 = traversal.getSiblings;
var traversal_4 = traversal.getAttributeValue;
var traversal_5 = traversal.hasAttrib;
var traversal_6 = traversal.getName;var removeElement = function(elem){
	if(elem.prev) elem.prev.next = elem.next;
	if(elem.next) elem.next.prev = elem.prev;

	if(elem.parent){
		var childs = elem.parent.children;
		childs.splice(childs.lastIndexOf(elem), 1);
	}
};

var replaceElement = function(elem, replacement){
	var prev = replacement.prev = elem.prev;
	if(prev){
		prev.next = replacement;
	}

	var next = replacement.next = elem.next;
	if(next){
		next.prev = replacement;
	}

	var parent = replacement.parent = elem.parent;
	if(parent){
		var childs = parent.children;
		childs[childs.lastIndexOf(elem)] = replacement;
	}
};

var appendChild = function(elem, child){
	child.parent = elem;

	if(elem.children.push(child) !== 1){
		var sibling = elem.children[elem.children.length - 2];
		sibling.next = child;
		child.prev = sibling;
		child.next = null;
	}
};

var append = function(elem, next){
	var parent = elem.parent,
		currNext = elem.next;

	next.next = currNext;
	next.prev = elem;
	elem.next = next;
	next.parent = parent;

	if(currNext){
		currNext.prev = next;
		if(parent){
			var childs = parent.children;
			childs.splice(childs.lastIndexOf(currNext), 0, next);
		}
	} else if(parent){
		parent.children.push(next);
	}
};

var prepend = function(elem, prev){
	var parent = elem.parent;
	if(parent){
		var childs = parent.children;
		childs.splice(childs.lastIndexOf(elem), 0, prev);
	}

	if(elem.prev){
		elem.prev.next = prev;
	}
	
	prev.parent = parent;
	prev.prev = elem.prev;
	prev.next = elem;
	elem.prev = prev;
};

var manipulation = {
	removeElement: removeElement,
	replaceElement: replaceElement,
	appendChild: appendChild,
	append: append,
	prepend: prepend
};var isTag$1 = domelementtype.isTag;

var querying = {
	filter: filter,
	find: find,
	findOneChild: findOneChild,
	findOne: findOne,
	existsOne: existsOne,
	findAll: findAll
};

function filter(test, element, recurse, limit){
	if(!Array.isArray(element)) element = [element];

	if(typeof limit !== "number" || !isFinite(limit)){
		limit = Infinity;
	}
	return find(test, element, recurse !== false, limit);
}

function find(test, elems, recurse, limit){
	var result = [], childs;

	for(var i = 0, j = elems.length; i < j; i++){
		if(test(elems[i])){
			result.push(elems[i]);
			if(--limit <= 0) break;
		}

		childs = elems[i].children;
		if(recurse && childs && childs.length > 0){
			childs = find(test, childs, recurse, limit);
			result = result.concat(childs);
			limit -= childs.length;
			if(limit <= 0) break;
		}
	}

	return result;
}

function findOneChild(test, elems){
	for(var i = 0, l = elems.length; i < l; i++){
		if(test(elems[i])) return elems[i];
	}

	return null;
}

function findOne(test, elems){
	var elem = null;

	for(var i = 0, l = elems.length; i < l && !elem; i++){
		if(!isTag$1(elems[i])){
			continue;
		} else if(test(elems[i])){
			elem = elems[i];
		} else if(elems[i].children.length > 0){
			elem = findOne(test, elems[i].children);
		}
	}

	return elem;
}

function existsOne(test, elems){
	for(var i = 0, l = elems.length; i < l; i++){
		if(
			isTag$1(elems[i]) && (
				test(elems[i]) || (
					elems[i].children.length > 0 &&
					existsOne(test, elems[i].children)
				)
			)
		){
			return true;
		}
	}

	return false;
}

function findAll(test, rootElems){
	var result = [];
	var stack = rootElems.slice();
	while(stack.length){
		var elem = stack.shift();
		if(!isTag$1(elem)) continue;
		if (elem.children && elem.children.length > 0) {
			stack.unshift.apply(stack, elem.children);
		}
		if(test(elem)) result.push(elem);
	}
	return result;
}var legacy$2 = createCommonjsModule(function (module, exports) {
var isTag = exports.isTag = domelementtype.isTag;

exports.testElement = function(options, element){
	for(var key in options){
		if(!options.hasOwnProperty(key));
		else if(key === "tag_name"){
			if(!isTag(element) || !options.tag_name(element.name)){
				return false;
			}
		} else if(key === "tag_type"){
			if(!options.tag_type(element.type)) return false;
		} else if(key === "tag_contains"){
			if(isTag(element) || !options.tag_contains(element.data)){
				return false;
			}
		} else if(!element.attribs || !options[key](element.attribs[key])){
			return false;
		}
	}
	return true;
};

var Checks = {
	tag_name: function(name){
		if(typeof name === "function"){
			return function(elem){ return isTag(elem) && name(elem.name); };
		} else if(name === "*"){
			return isTag;
		} else {
			return function(elem){ return isTag(elem) && elem.name === name; };
		}
	},
	tag_type: function(type){
		if(typeof type === "function"){
			return function(elem){ return type(elem.type); };
		} else {
			return function(elem){ return elem.type === type; };
		}
	},
	tag_contains: function(data){
		if(typeof data === "function"){
			return function(elem){ return !isTag(elem) && data(elem.data); };
		} else {
			return function(elem){ return !isTag(elem) && elem.data === data; };
		}
	}
};

function getAttribCheck(attrib, value){
	if(typeof value === "function"){
		return function(elem){ return elem.attribs && value(elem.attribs[attrib]); };
	} else {
		return function(elem){ return elem.attribs && elem.attribs[attrib] === value; };
	}
}

function combineFuncs(a, b){
	return function(elem){
		return a(elem) || b(elem);
	};
}

exports.getElements = function(options, element, recurse, limit){
	var funcs = Object.keys(options).map(function(key){
		var value = options[key];
		return key in Checks ? Checks[key](value) : getAttribCheck(key, value);
	});

	return funcs.length === 0 ? [] : this.filter(
		funcs.reduce(combineFuncs),
		element, recurse, limit
	);
};

exports.getElementById = function(id, element, recurse){
	if(!Array.isArray(element)) element = [element];
	return this.findOne(getAttribCheck("id", id), element, recurse !== false);
};

exports.getElementsByTagName = function(name, element, recurse, limit){
	return this.filter(Checks.tag_name(name), element, recurse, limit);
};

exports.getElementsByTagType = function(type, element, recurse, limit){
	return this.filter(Checks.tag_type(type), element, recurse, limit);
};
});
var legacy_1 = legacy$2.isTag;
var legacy_2 = legacy$2.testElement;
var legacy_3 = legacy$2.getElements;
var legacy_4 = legacy$2.getElementById;
var legacy_5 = legacy$2.getElementsByTagName;
var legacy_6 = legacy$2.getElementsByTagType;var helpers = createCommonjsModule(function (module, exports) {
// removeSubsets
// Given an array of nodes, remove any member that is contained by another.
exports.removeSubsets = function(nodes) {
	var idx = nodes.length, node, ancestor, replace;

	// Check if each node (or one of its ancestors) is already contained in the
	// array.
	while (--idx > -1) {
		node = ancestor = nodes[idx];

		// Temporarily remove the node under consideration
		nodes[idx] = null;
		replace = true;

		while (ancestor) {
			if (nodes.indexOf(ancestor) > -1) {
				replace = false;
				nodes.splice(idx, 1);
				break;
			}
			ancestor = ancestor.parent;
		}

		// If the node has been found to be unique, re-insert it.
		if (replace) {
			nodes[idx] = node;
		}
	}

	return nodes;
};

// Source: http://dom.spec.whatwg.org/#dom-node-comparedocumentposition
var POSITION = {
	DISCONNECTED: 1,
	PRECEDING: 2,
	FOLLOWING: 4,
	CONTAINS: 8,
	CONTAINED_BY: 16
};

// Compare the position of one node against another node in any other document.
// The return value is a bitmask with the following values:
//
// document order:
// > There is an ordering, document order, defined on all the nodes in the
// > document corresponding to the order in which the first character of the
// > XML representation of each node occurs in the XML representation of the
// > document after expansion of general entities. Thus, the document element
// > node will be the first node. Element nodes occur before their children.
// > Thus, document order orders element nodes in order of the occurrence of
// > their start-tag in the XML (after expansion of entities). The attribute
// > nodes of an element occur after the element and before its children. The
// > relative order of attribute nodes is implementation-dependent./
// Source:
// http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
//
// @argument {Node} nodaA The first node to use in the comparison
// @argument {Node} nodeB The second node to use in the comparison
//
// @return {Number} A bitmask describing the input nodes' relative position.
//         See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
//         a description of these values.
var comparePos = exports.compareDocumentPosition = function(nodeA, nodeB) {
	var aParents = [];
	var bParents = [];
	var current, sharedParent, siblings, aSibling, bSibling, idx;

	if (nodeA === nodeB) {
		return 0;
	}

	current = nodeA;
	while (current) {
		aParents.unshift(current);
		current = current.parent;
	}
	current = nodeB;
	while (current) {
		bParents.unshift(current);
		current = current.parent;
	}

	idx = 0;
	while (aParents[idx] === bParents[idx]) {
		idx++;
	}

	if (idx === 0) {
		return POSITION.DISCONNECTED;
	}

	sharedParent = aParents[idx - 1];
	siblings = sharedParent.children;
	aSibling = aParents[idx];
	bSibling = bParents[idx];

	if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
		if (sharedParent === nodeB) {
			return POSITION.FOLLOWING | POSITION.CONTAINED_BY;
		}
		return POSITION.FOLLOWING;
	} else {
		if (sharedParent === nodeA) {
			return POSITION.PRECEDING | POSITION.CONTAINS;
		}
		return POSITION.PRECEDING;
	}
};

// Sort an array of nodes based on their relative position in the document and
// remove any duplicate nodes. If the array contains nodes that do not belong
// to the same document, sort order is unspecified.
//
// @argument {Array} nodes Array of DOM nodes
//
// @returns {Array} collection of unique nodes, sorted in document order
exports.uniqueSort = function(nodes) {
	var idx = nodes.length, node, position;

	nodes = nodes.slice();

	while (--idx > -1) {
		node = nodes[idx];
		position = nodes.indexOf(node);
		if (position > -1 && position < idx) {
			nodes.splice(idx, 1);
		}
	}
	nodes.sort(function(a, b) {
		var relative = comparePos(a, b);
		if (relative & POSITION.PRECEDING) {
			return -1;
		} else if (relative & POSITION.FOLLOWING) {
			return 1;
		}
		return 0;
	});

	return nodes;
};
});
var helpers_1 = helpers.removeSubsets;
var helpers_2 = helpers.compareDocumentPosition;
var helpers_3 = helpers.uniqueSort;var domutils = createCommonjsModule(function (module) {
var DomUtils = module.exports;

[
	stringify,
	traversal,
	manipulation,
	querying,
	legacy$2,
	helpers
].forEach(function(ext){
	Object.keys(ext).forEach(function(key){
		DomUtils[key] = ext[key].bind(DomUtils);
	});
});
});//TODO: make this a streamable handler
function FeedHandler(callback, options) {
    this.init(callback, options);
}

inherits(FeedHandler, domhandler);

FeedHandler.prototype.init = domhandler;

function getElements(what, where) {
    return domutils.getElementsByTagName(what, where, true);
}
function getOneElement(what, where) {
    return domutils.getElementsByTagName(what, where, true, 1)[0];
}
function fetch(what, where, recurse) {
    return domutils.getText(
        domutils.getElementsByTagName(what, where, recurse, 1)
    ).trim();
}

function addConditionally(obj, prop, what, where, recurse) {
    var tmp = fetch(what, where, recurse);
    if (tmp) obj[prop] = tmp;
}

var isValidFeed = function(value) {
    return value === "rss" || value === "feed" || value === "rdf:RDF";
};

FeedHandler.prototype.onend = function() {
    var feed = {},
        feedRoot = getOneElement(isValidFeed, this.dom),
        tmp,
        childs;

    if (feedRoot) {
        if (feedRoot.name === "feed") {
            childs = feedRoot.children;

            feed.type = "atom";
            addConditionally(feed, "id", "id", childs);
            addConditionally(feed, "title", "title", childs);
            if (
                (tmp = getOneElement("link", childs)) &&
                (tmp = tmp.attribs) &&
                (tmp = tmp.href)
            )
                feed.link = tmp;
            addConditionally(feed, "description", "subtitle", childs);
            if ((tmp = fetch("updated", childs))) feed.updated = new Date(tmp);
            addConditionally(feed, "author", "email", childs, true);

            feed.items = getElements("entry", childs).map(function(item) {
                var entry = {},
                    tmp;

                item = item.children;

                addConditionally(entry, "id", "id", item);
                addConditionally(entry, "title", "title", item);
                if (
                    (tmp = getOneElement("link", item)) &&
                    (tmp = tmp.attribs) &&
                    (tmp = tmp.href)
                )
                    entry.link = tmp;
                if ((tmp = fetch("summary", item) || fetch("content", item)))
                    entry.description = tmp;
                if ((tmp = fetch("updated", item)))
                    entry.pubDate = new Date(tmp);
                return entry;
            });
        } else {
            childs = getOneElement("channel", feedRoot.children).children;

            feed.type = feedRoot.name.substr(0, 3);
            feed.id = "";
            addConditionally(feed, "title", "title", childs);
            addConditionally(feed, "link", "link", childs);
            addConditionally(feed, "description", "description", childs);
            if ((tmp = fetch("lastBuildDate", childs)))
                feed.updated = new Date(tmp);
            addConditionally(feed, "author", "managingEditor", childs, true);

            feed.items = getElements("item", feedRoot.children).map(function(
                item
            ) {
                var entry = {},
                    tmp;

                item = item.children;

                addConditionally(entry, "id", "guid", item);
                addConditionally(entry, "title", "title", item);
                addConditionally(entry, "link", "link", item);
                addConditionally(entry, "description", "description", item);
                if ((tmp = fetch("pubDate", item)))
                    entry.pubDate = new Date(tmp);
                return entry;
            });
        }
    }
    this.dom = feed;
    domhandler.prototype._handleCallback.call(
        this,
        feedRoot ? null : Error("couldn't find root of feed")
    );
};

var FeedHandler_1 = FeedHandler;var stream = stream$1;function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Buffer$1 = buffer.Buffer;

var inspect = util.inspect;

var custom = inspect && inspect.custom || 'inspect';

function copyBuffer(src, target, offset) {
  Buffer$1.prototype.copy.call(src, target, offset);
}

var buffer_list =
/*#__PURE__*/
function () {
  function BufferList() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  var _proto = BufferList.prototype;

  _proto.push = function push(v) {
    var entry = {
      data: v,
      next: null
    };
    if (this.length > 0) this.tail.next = entry;else this.head = entry;
    this.tail = entry;
    ++this.length;
  };

  _proto.unshift = function unshift(v) {
    var entry = {
      data: v,
      next: this.head
    };
    if (this.length === 0) this.tail = entry;
    this.head = entry;
    ++this.length;
  };

  _proto.shift = function shift() {
    if (this.length === 0) return;
    var ret = this.head.data;
    if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
    --this.length;
    return ret;
  };

  _proto.clear = function clear() {
    this.head = this.tail = null;
    this.length = 0;
  };

  _proto.join = function join(s) {
    if (this.length === 0) return '';
    var p = this.head;
    var ret = '' + p.data;

    while (p = p.next) {
      ret += s + p.data;
    }

    return ret;
  };

  _proto.concat = function concat(n) {
    if (this.length === 0) return Buffer$1.alloc(0);
    var ret = Buffer$1.allocUnsafe(n >>> 0);
    var p = this.head;
    var i = 0;

    while (p) {
      copyBuffer(p.data, ret, i);
      i += p.data.length;
      p = p.next;
    }

    return ret;
  } // Consumes a specified amount of bytes or characters from the buffered data.
  ;

  _proto.consume = function consume(n, hasStrings) {
    var ret;

    if (n < this.head.data.length) {
      // `slice` is the same for buffers and strings.
      ret = this.head.data.slice(0, n);
      this.head.data = this.head.data.slice(n);
    } else if (n === this.head.data.length) {
      // First chunk is a perfect match.
      ret = this.shift();
    } else {
      // Result spans more than one buffer.
      ret = hasStrings ? this._getString(n) : this._getBuffer(n);
    }

    return ret;
  };

  _proto.first = function first() {
    return this.head.data;
  } // Consumes a specified amount of characters from the buffered data.
  ;

  _proto._getString = function _getString(n) {
    var p = this.head;
    var c = 1;
    var ret = p.data;
    n -= ret.length;

    while (p = p.next) {
      var str = p.data;
      var nb = n > str.length ? str.length : n;
      if (nb === str.length) ret += str;else ret += str.slice(0, n);
      n -= nb;

      if (n === 0) {
        if (nb === str.length) {
          ++c;
          if (p.next) this.head = p.next;else this.head = this.tail = null;
        } else {
          this.head = p;
          p.data = str.slice(nb);
        }

        break;
      }

      ++c;
    }

    this.length -= c;
    return ret;
  } // Consumes a specified amount of bytes from the buffered data.
  ;

  _proto._getBuffer = function _getBuffer(n) {
    var ret = Buffer$1.allocUnsafe(n);
    var p = this.head;
    var c = 1;
    p.data.copy(ret);
    n -= p.data.length;

    while (p = p.next) {
      var buf = p.data;
      var nb = n > buf.length ? buf.length : n;
      buf.copy(ret, ret.length - n, 0, nb);
      n -= nb;

      if (n === 0) {
        if (nb === buf.length) {
          ++c;
          if (p.next) this.head = p.next;else this.head = this.tail = null;
        } else {
          this.head = p;
          p.data = buf.slice(nb);
        }

        break;
      }

      ++c;
    }

    this.length -= c;
    return ret;
  } // Make sure the linked list only shows the minimal necessary information.
  ;

  _proto[custom] = function (_, options) {
    return inspect(this, _objectSpread({}, options, {
      // Only inspect one level.
      depth: 0,
      // It should not recurse.
      customInspect: false
    }));
  };

  return BufferList;
}();function destroy(err, cb) {
  var _this = this;

  var readableDestroyed = this._readableState && this._readableState.destroyed;
  var writableDestroyed = this._writableState && this._writableState.destroyed;

  if (readableDestroyed || writableDestroyed) {
    if (cb) {
      cb(err);
    } else if (err && (!this._writableState || !this._writableState.errorEmitted)) {
      process.nextTick(emitErrorNT, this, err);
    }

    return this;
  } // we set destroyed to true before firing error callbacks in order
  // to make it re-entrance safe in case destroy() is called within callbacks


  if (this._readableState) {
    this._readableState.destroyed = true;
  } // if this is a duplex stream mark the writable part as destroyed as well


  if (this._writableState) {
    this._writableState.destroyed = true;
  }

  this._destroy(err || null, function (err) {
    if (!cb && err) {
      process.nextTick(emitErrorAndCloseNT, _this, err);

      if (_this._writableState) {
        _this._writableState.errorEmitted = true;
      }
    } else if (cb) {
      process.nextTick(emitCloseNT, _this);
      cb(err);
    } else {
      process.nextTick(emitCloseNT, _this);
    }
  });

  return this;
}

function emitErrorAndCloseNT(self, err) {
  emitErrorNT(self, err);
  emitCloseNT(self);
}

function emitCloseNT(self) {
  if (self._writableState && !self._writableState.emitClose) return;
  if (self._readableState && !self._readableState.emitClose) return;
  self.emit('close');
}

function undestroy() {
  if (this._readableState) {
    this._readableState.destroyed = false;
    this._readableState.reading = false;
    this._readableState.ended = false;
    this._readableState.endEmitted = false;
  }

  if (this._writableState) {
    this._writableState.destroyed = false;
    this._writableState.ended = false;
    this._writableState.ending = false;
    this._writableState.finalCalled = false;
    this._writableState.prefinished = false;
    this._writableState.finished = false;
    this._writableState.errorEmitted = false;
  }
}

function emitErrorNT(self, err) {
  self.emit('error', err);
}

var destroy_1 = {
  destroy: destroy,
  undestroy: undestroy
};const codes = {};

function createErrorType(code, message, Base) {
  if (!Base) {
    Base = Error;
  }

  function getMessage (arg1, arg2, arg3) {
    if (typeof message === 'string') {
      return message
    } else {
      return message(arg1, arg2, arg3)
    }
  }

  class NodeError extends Base {
    constructor (arg1, arg2, arg3) {
      super(getMessage(arg1, arg2, arg3));
    }
  }

  NodeError.prototype.name = Base.name;
  NodeError.prototype.code = code;

  codes[code] = NodeError;
}

// https://github.com/nodejs/node/blob/v10.8.0/lib/internal/errors.js
function oneOf(expected, thing) {
  if (Array.isArray(expected)) {
    const len = expected.length;
    expected = expected.map((i) => String(i));
    if (len > 2) {
      return `one of ${thing} ${expected.slice(0, len - 1).join(', ')}, or ` +
             expected[len - 1];
    } else if (len === 2) {
      return `one of ${thing} ${expected[0]} or ${expected[1]}`;
    } else {
      return `of ${thing} ${expected[0]}`;
    }
  } else {
    return `of ${thing} ${String(expected)}`;
  }
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
function startsWith(str, search, pos) {
	return str.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith
function endsWith(str, search, this_len) {
	if (this_len === undefined || this_len > str.length) {
		this_len = str.length;
	}
	return str.substring(this_len - search.length, this_len) === search;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/includes
function includes(str, search, start) {
  if (typeof start !== 'number') {
    start = 0;
  }

  if (start + search.length > str.length) {
    return false;
  } else {
    return str.indexOf(search, start) !== -1;
  }
}

createErrorType('ERR_INVALID_OPT_VALUE', function (name, value) {
  return 'The value "' + value + '" is invalid for option "' + name + '"'
}, TypeError);
createErrorType('ERR_INVALID_ARG_TYPE', function (name, expected, actual) {
  // determiner: 'must be' or 'must not be'
  let determiner;
  if (typeof expected === 'string' && startsWith(expected, 'not ')) {
    determiner = 'must not be';
    expected = expected.replace(/^not /, '');
  } else {
    determiner = 'must be';
  }

  let msg;
  if (endsWith(name, ' argument')) {
    // For cases like 'first argument'
    msg = `The ${name} ${determiner} ${oneOf(expected, 'type')}`;
  } else {
    const type = includes(name, '.') ? 'property' : 'argument';
    msg = `The "${name}" ${type} ${determiner} ${oneOf(expected, 'type')}`;
  }

  msg += `. Received type ${typeof actual}`;
  return msg;
}, TypeError);
createErrorType('ERR_STREAM_PUSH_AFTER_EOF', 'stream.push() after EOF');
createErrorType('ERR_METHOD_NOT_IMPLEMENTED', function (name) {
  return 'The ' + name + ' method is not implemented'
});
createErrorType('ERR_STREAM_PREMATURE_CLOSE', 'Premature close');
createErrorType('ERR_STREAM_DESTROYED', function (name) {
  return 'Cannot call ' + name + ' after a stream was destroyed';
});
createErrorType('ERR_MULTIPLE_CALLBACK', 'Callback called multiple times');
createErrorType('ERR_STREAM_CANNOT_PIPE', 'Cannot pipe, not readable');
createErrorType('ERR_STREAM_WRITE_AFTER_END', 'write after end');
createErrorType('ERR_STREAM_NULL_VALUES', 'May not write null values to stream', TypeError);
createErrorType('ERR_UNKNOWN_ENCODING', function (arg) {
  return 'Unknown encoding: ' + arg
}, TypeError);
createErrorType('ERR_STREAM_UNSHIFT_AFTER_END_EVENT', 'stream.unshift() after end event');

var codes_1 = codes;

var errors = {
	codes: codes_1
};var ERR_INVALID_OPT_VALUE = errors.codes.ERR_INVALID_OPT_VALUE;

function highWaterMarkFrom(options, isDuplex, duplexKey) {
  return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
}

function getHighWaterMark(state, options, duplexKey, isDuplex) {
  var hwm = highWaterMarkFrom(options, isDuplex, duplexKey);

  if (hwm != null) {
    if (!(isFinite(hwm) && Math.floor(hwm) === hwm) || hwm < 0) {
      var name = isDuplex ? duplexKey : 'highWaterMark';
      throw new ERR_INVALID_OPT_VALUE(name, hwm);
    }

    return Math.floor(hwm);
  } // Default value


  return state.objectMode ? 16 : 16 * 1024;
}

var state = {
  getHighWaterMark: getHighWaterMark
};var experimentalWarnings = new Set();

function emitExperimentalWarning(feature) {
  if (experimentalWarnings.has(feature)) return;
  var msg = feature + ' is an experimental feature. This feature could ' +
       'change at any time';
  experimentalWarnings.add(feature);
  process.emitWarning(msg, 'ExperimentalWarning');
}

function noop() {}

var emitExperimentalWarning_1 = process.emitWarning
  ? emitExperimentalWarning
  : noop;

var experimentalWarning = {
	emitExperimentalWarning: emitExperimentalWarning_1
};/**
 * For Node.js, simply re-export the core `util.deprecate` function.
 */

var node$2 = util.deprecate;var _stream_writable = Writable$1;
// there will be only 2 of these for each stream


function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;

  this.finish = function () {
    onCorkedFinish(_this, state);
  };
}
/* </replacement> */

/*<replacement>*/


var Duplex;
/*</replacement>*/

Writable$1.WritableState = WritableState;
/*<replacement>*/

var internalUtil = {
  deprecate: node$2
};
/*</replacement>*/

/*<replacement>*/


/*</replacement>*/


var Buffer$2 = buffer.Buffer;

var OurUint8Array = commonjsGlobal.Uint8Array || function () {};

function _uint8ArrayToBuffer(chunk) {
  return Buffer$2.from(chunk);
}

function _isUint8Array(obj) {
  return Buffer$2.isBuffer(obj) || obj instanceof OurUint8Array;
}



var getHighWaterMark$1 = state.getHighWaterMark;

var _require$codes = errors.codes,
    ERR_INVALID_ARG_TYPE = _require$codes.ERR_INVALID_ARG_TYPE,
    ERR_METHOD_NOT_IMPLEMENTED = _require$codes.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK = _require$codes.ERR_MULTIPLE_CALLBACK,
    ERR_STREAM_CANNOT_PIPE = _require$codes.ERR_STREAM_CANNOT_PIPE,
    ERR_STREAM_DESTROYED = _require$codes.ERR_STREAM_DESTROYED,
    ERR_STREAM_NULL_VALUES = _require$codes.ERR_STREAM_NULL_VALUES,
    ERR_STREAM_WRITE_AFTER_END = _require$codes.ERR_STREAM_WRITE_AFTER_END,
    ERR_UNKNOWN_ENCODING = _require$codes.ERR_UNKNOWN_ENCODING;

inherits(Writable$1, stream);

function nop() {}

function WritableState(options, stream, isDuplex) {
  Duplex = Duplex || _stream_duplex;
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream,
  // e.g. options.readableObjectMode vs. options.writableObjectMode, etc.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex; // object stream flag to indicate whether or not this stream
  // contains buffers or objects.

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.writableObjectMode; // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()

  this.highWaterMark = getHighWaterMark$1(this, options, 'writableHighWaterMark', isDuplex); // if _final has been called

  this.finalCalled = false; // drain event flag.

  this.needDrain = false; // at the start of calling end()

  this.ending = false; // when end() has been called, and returned

  this.ended = false; // when 'finish' is emitted

  this.finished = false; // has it been destroyed

  this.destroyed = false; // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.

  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.

  this.length = 0; // a flag to see when we're in the middle of a write.

  this.writing = false; // when true all writes will be buffered until .uncork() call

  this.corked = 0; // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.

  this.sync = true; // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.

  this.bufferProcessing = false; // the callback that's passed to _write(chunk,cb)

  this.onwrite = function (er) {
    onwrite(stream, er);
  }; // the callback that the user supplies to write(chunk,encoding,cb)


  this.writecb = null; // the amount that is being written when _write is called.

  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null; // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted

  this.pendingcb = 0; // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams

  this.prefinished = false; // True if the error was already emitted and should not be thrown again

  this.errorEmitted = false; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // count buffered requests

  this.bufferedRequestCount = 0; // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two

  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];

  while (current) {
    out.push(current);
    current = current.next;
  }

  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function writableStateBufferGetter() {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.', 'DEP0003')
    });
  } catch (_) {}
})(); // Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.


var realHasInstance;

if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable$1, Symbol.hasInstance, {
    value: function value(object) {
      if (realHasInstance.call(this, object)) return true;
      if (this !== Writable$1) return false;
      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function realHasInstance(object) {
    return object instanceof this;
  };
}

function Writable$1(options) {
  Duplex = Duplex || _stream_duplex; // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.
  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  // Checking for a Stream.Duplex instance is faster here instead of inside
  // the WritableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex;
  if (!isDuplex && !realHasInstance.call(Writable$1, this)) return new Writable$1(options);
  this._writableState = new WritableState(options, this, isDuplex); // legacy.

  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;
    if (typeof options.writev === 'function') this._writev = options.writev;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
    if (typeof options.final === 'function') this._final = options.final;
  }

  stream.call(this);
} // Otherwise people can pipe Writable streams, which is just wrong.


Writable$1.prototype.pipe = function () {
  this.emit('error', new ERR_STREAM_CANNOT_PIPE());
};

function writeAfterEnd(stream, cb) {
  var er = new ERR_STREAM_WRITE_AFTER_END(); // TODO: defer error events consistently everywhere, not just the cb

  stream.emit('error', er);
  process.nextTick(cb, er);
} // Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.


function validChunk(stream, state, chunk, cb) {
  var er;

  if (chunk === null) {
    er = new ERR_STREAM_NULL_VALUES();
  } else if (typeof chunk !== 'string' && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk);
  }

  if (er) {
    stream.emit('error', er);
    process.nextTick(cb, er);
    return false;
  }

  return true;
}

Writable$1.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;

  var isBuf = !state.objectMode && _isUint8Array(chunk);

  if (isBuf && !Buffer$2.isBuffer(chunk)) {
    chunk = _uint8ArrayToBuffer(chunk);
  }

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
  if (typeof cb !== 'function') cb = nop;
  if (state.ending) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }
  return ret;
};

Writable$1.prototype.cork = function () {
  this._writableState.corked++;
};

Writable$1.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;
    if (!state.writing && !state.corked && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable$1.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new ERR_UNKNOWN_ENCODING(encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

Object.defineProperty(Writable$1.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = Buffer$2.from(chunk, encoding);
  }

  return chunk;
}

Object.defineProperty(Writable$1.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
}); // if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.

function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    var newChunk = decodeChunk(state, chunk, encoding);

    if (chunk !== newChunk) {
      isBuf = true;
      encoding = 'buffer';
      chunk = newChunk;
    }
  }

  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark; // we must ensure that previous needDrain will not be reset to false.

  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = {
      chunk: chunk,
      encoding: encoding,
      isBuf: isBuf,
      callback: cb,
      next: null
    };

    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }

    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (state.destroyed) state.onwrite(new ERR_STREAM_DESTROYED('write'));else if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;

  if (sync) {
    // defer the callback if we are being called synchronously
    // to avoid piling up things on the stack
    process.nextTick(cb, er); // this can emit finish, and it will always happen
    // after error

    process.nextTick(finishMaybe, stream, state);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  } else {
    // the caller expect this to happen before if
    // it is async
    cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er); // this can emit finish, but finish must
    // always follow error

    finishMaybe(stream, state);
  }
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  if (typeof cb !== 'function') throw new ERR_MULTIPLE_CALLBACK();
  onwriteStateUpdate(state);
  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state) || stream.destroyed;

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      process.nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
} // Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.


function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
} // if there's something in the buffer waiting, then process it


function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    var allBuffers = true;

    while (entry) {
      buffer[count] = entry;
      if (!entry.isBuf) allBuffers = false;
      entry = entry.next;
      count += 1;
    }

    buffer.allBuffers = allBuffers;
    doWrite(stream, state, true, state.length, buffer, '', holder.finish); // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite

    state.pendingcb++;
    state.lastBufferedRequest = null;

    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }

    state.bufferedRequestCount = 0;
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      state.bufferedRequestCount--; // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.

      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable$1.prototype._write = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED('_write()'));
};

Writable$1.prototype._writev = null;

Writable$1.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding); // .end() fully uncorks

  if (state.corked) {
    state.corked = 1;
    this.uncork();
  } // ignore unnecessary end() calls.


  if (!state.ending) endWritable(this, state, cb);
  return this;
};

Object.defineProperty(Writable$1.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
});

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function callFinal(stream, state) {
  stream._final(function (err) {
    state.pendingcb--;

    if (err) {
      stream.emit('error', err);
    }

    state.prefinished = true;
    stream.emit('prefinish');
    finishMaybe(stream, state);
  });
}

function prefinish(stream, state) {
  if (!state.prefinished && !state.finalCalled) {
    if (typeof stream._final === 'function' && !state.destroyed) {
      state.pendingcb++;
      state.finalCalled = true;
      process.nextTick(callFinal, stream, state);
    } else {
      state.prefinished = true;
      stream.emit('prefinish');
    }
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);

  if (need) {
    prefinish(stream, state);

    if (state.pendingcb === 0) {
      state.finished = true;
      stream.emit('finish');
    }
  }

  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);

  if (cb) {
    if (state.finished) process.nextTick(cb);else stream.once('finish', cb);
  }

  state.ended = true;
  stream.writable = false;
}

function onCorkedFinish(corkReq, state, err) {
  var entry = corkReq.entry;
  corkReq.entry = null;

  while (entry) {
    var cb = entry.callback;
    state.pendingcb--;
    cb(err);
    entry = entry.next;
  } // reuse the free corkReq.


  state.corkedRequestsFree.next = corkReq;
}

Object.defineProperty(Writable$1.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._writableState === undefined) {
      return false;
    }

    return this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._writableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._writableState.destroyed = value;
  }
});
Writable$1.prototype.destroy = destroy_1.destroy;
Writable$1.prototype._undestroy = destroy_1.undestroy;

Writable$1.prototype._destroy = function (err, cb) {
  cb(err);
};/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  return keys;
};
/*</replacement>*/


var _stream_duplex = Duplex$1;





inherits(Duplex$1, _stream_readable);

{
  // Allow the keys array to be GC'ed.
  var keys = objectKeys(_stream_writable.prototype);

  for (var v = 0; v < keys.length; v++) {
    var method = keys[v];
    if (!Duplex$1.prototype[method]) Duplex$1.prototype[method] = _stream_writable.prototype[method];
  }
}

function Duplex$1(options) {
  if (!(this instanceof Duplex$1)) return new Duplex$1(options);
  _stream_readable.call(this, options);
  _stream_writable.call(this, options);
  this.allowHalfOpen = true;

  if (options) {
    if (options.readable === false) this.readable = false;
    if (options.writable === false) this.writable = false;

    if (options.allowHalfOpen === false) {
      this.allowHalfOpen = false;
      this.once('end', onend);
    }
  }
}

Object.defineProperty(Duplex$1.prototype, 'writableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.highWaterMark;
  }
});
Object.defineProperty(Duplex$1.prototype, 'writableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState && this._writableState.getBuffer();
  }
});
Object.defineProperty(Duplex$1.prototype, 'writableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._writableState.length;
  }
}); // the no-half-open enforcer

function onend() {
  // If the writable side ended, then we're ok.
  if (this._writableState.ended) return; // no more data can be written.
  // But allow more writes to happen in this tick.

  process.nextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

Object.defineProperty(Duplex$1.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined || this._writableState === undefined) {
      return false;
    }

    return this._readableState.destroyed && this._writableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (this._readableState === undefined || this._writableState === undefined) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
    this._writableState.destroyed = value;
  }
});var safeBuffer = createCommonjsModule(function (module, exports) {
/* eslint-disable node/no-deprecated-api */

var Buffer = buffer.Buffer;

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key];
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer;
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports);
  exports.Buffer = SafeBuffer;
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer);

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
};

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size);
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding);
    } else {
      buf.fill(fill);
    }
  } else {
    buf.fill(0);
  }
  return buf
};

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
};

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
};
});
var safeBuffer_1 = safeBuffer.Buffer;/*<replacement>*/

var Buffer$3 = safeBuffer.Buffer;
/*</replacement>*/

var isEncoding = Buffer$3.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
}
// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer$3.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
var StringDecoder_1 = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer$3.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

var string_decoder = {
	StringDecoder: StringDecoder_1
};var ERR_STREAM_PREMATURE_CLOSE = errors.codes.ERR_STREAM_PREMATURE_CLOSE;

function once(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    callback.apply(this, args);
  };
}

function noop$1() {}

function isRequest(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function eos(stream, opts, callback) {
  if (typeof opts === 'function') return eos(stream, null, opts);
  if (!opts) opts = {};
  callback = once(callback || noop$1);
  var readable = opts.readable || opts.readable !== false && stream.readable;
  var writable = opts.writable || opts.writable !== false && stream.writable;

  var onlegacyfinish = function onlegacyfinish() {
    if (!stream.writable) onfinish();
  };

  var writableEnded = stream._writableState && stream._writableState.finished;

  var onfinish = function onfinish() {
    writable = false;
    writableEnded = true;
    if (!readable) callback.call(stream);
  };

  var readableEnded = stream._readableState && stream._readableState.endEmitted;

  var onend = function onend() {
    readable = false;
    readableEnded = true;
    if (!writable) callback.call(stream);
  };

  var onerror = function onerror(err) {
    callback.call(stream, err);
  };

  var onclose = function onclose() {
    var err;

    if (readable && !readableEnded) {
      if (!stream._readableState || !stream._readableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }

    if (writable && !writableEnded) {
      if (!stream._writableState || !stream._writableState.ended) err = new ERR_STREAM_PREMATURE_CLOSE();
      return callback.call(stream, err);
    }
  };

  var onrequest = function onrequest() {
    stream.req.on('finish', onfinish);
  };

  if (isRequest(stream)) {
    stream.on('complete', onfinish);
    stream.on('abort', onclose);
    if (stream.req) onrequest();else stream.on('request', onrequest);
  } else if (writable && !stream._writableState) {
    // legacy streams
    stream.on('end', onlegacyfinish);
    stream.on('close', onlegacyfinish);
  }

  stream.on('end', onend);
  stream.on('finish', onfinish);
  if (opts.error !== false) stream.on('error', onerror);
  stream.on('close', onclose);
  return function () {
    stream.removeListener('complete', onfinish);
    stream.removeListener('abort', onclose);
    stream.removeListener('request', onrequest);
    if (stream.req) stream.req.removeListener('finish', onfinish);
    stream.removeListener('end', onlegacyfinish);
    stream.removeListener('close', onlegacyfinish);
    stream.removeListener('finish', onfinish);
    stream.removeListener('end', onend);
    stream.removeListener('error', onerror);
    stream.removeListener('close', onclose);
  };
}

var endOfStream = eos;var _Object$setPrototypeO;

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



var kLastResolve = Symbol('lastResolve');
var kLastReject = Symbol('lastReject');
var kError = Symbol('error');
var kEnded = Symbol('ended');
var kLastPromise = Symbol('lastPromise');
var kHandlePromise = Symbol('handlePromise');
var kStream = Symbol('stream');

function createIterResult(value, done) {
  return {
    value: value,
    done: done
  };
}

function readAndResolve(iter) {
  var resolve = iter[kLastResolve];

  if (resolve !== null) {
    var data = iter[kStream].read(); // we defer if data is null
    // we can be expecting either 'end' or
    // 'error'

    if (data !== null) {
      iter[kLastPromise] = null;
      iter[kLastResolve] = null;
      iter[kLastReject] = null;
      resolve(createIterResult(data, false));
    }
  }
}

function onReadable(iter) {
  // we wait for the next tick, because it might
  // emit an error with process.nextTick
  process.nextTick(readAndResolve, iter);
}

function wrapForNext(lastPromise, iter) {
  return function (resolve, reject) {
    lastPromise.then(function () {
      if (iter[kEnded]) {
        resolve(createIterResult(undefined, true));
        return;
      }

      iter[kHandlePromise](resolve, reject);
    }, reject);
  };
}

var AsyncIteratorPrototype = Object.getPrototypeOf(function () {});
var ReadableStreamAsyncIteratorPrototype = Object.setPrototypeOf((_Object$setPrototypeO = {
  get stream() {
    return this[kStream];
  },

  next: function next() {
    var _this = this;

    // if we have detected an error in the meanwhile
    // reject straight away
    var error = this[kError];

    if (error !== null) {
      return Promise.reject(error);
    }

    if (this[kEnded]) {
      return Promise.resolve(createIterResult(undefined, true));
    }

    if (this[kStream].destroyed) {
      // We need to defer via nextTick because if .destroy(err) is
      // called, the error will be emitted via nextTick, and
      // we cannot guarantee that there is no error lingering around
      // waiting to be emitted.
      return new Promise(function (resolve, reject) {
        process.nextTick(function () {
          if (_this[kError]) {
            reject(_this[kError]);
          } else {
            resolve(createIterResult(undefined, true));
          }
        });
      });
    } // if we have multiple next() calls
    // we will wait for the previous Promise to finish
    // this logic is optimized to support for await loops,
    // where next() is only called once at a time


    var lastPromise = this[kLastPromise];
    var promise;

    if (lastPromise) {
      promise = new Promise(wrapForNext(lastPromise, this));
    } else {
      // fast path needed to support multiple this.push()
      // without triggering the next() queue
      var data = this[kStream].read();

      if (data !== null) {
        return Promise.resolve(createIterResult(data, false));
      }

      promise = new Promise(this[kHandlePromise]);
    }

    this[kLastPromise] = promise;
    return promise;
  }
}, _defineProperty$1(_Object$setPrototypeO, Symbol.asyncIterator, function () {
  return this;
}), _defineProperty$1(_Object$setPrototypeO, "return", function _return() {
  var _this2 = this;

  // destroy(err, cb) is a private API
  // we can guarantee we have that here, because we control the
  // Readable class this is attached to
  return new Promise(function (resolve, reject) {
    _this2[kStream].destroy(null, function (err) {
      if (err) {
        reject(err);
        return;
      }

      resolve(createIterResult(undefined, true));
    });
  });
}), _Object$setPrototypeO), AsyncIteratorPrototype);

var createReadableStreamAsyncIterator = function createReadableStreamAsyncIterator(stream) {
  var _Object$create;

  var iterator = Object.create(ReadableStreamAsyncIteratorPrototype, (_Object$create = {}, _defineProperty$1(_Object$create, kStream, {
    value: stream,
    writable: true
  }), _defineProperty$1(_Object$create, kLastResolve, {
    value: null,
    writable: true
  }), _defineProperty$1(_Object$create, kLastReject, {
    value: null,
    writable: true
  }), _defineProperty$1(_Object$create, kError, {
    value: null,
    writable: true
  }), _defineProperty$1(_Object$create, kEnded, {
    value: stream._readableState.endEmitted,
    writable: true
  }), _defineProperty$1(_Object$create, kHandlePromise, {
    value: function value(resolve, reject) {
      var data = iterator[kStream].read();

      if (data) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        resolve(createIterResult(data, false));
      } else {
        iterator[kLastResolve] = resolve;
        iterator[kLastReject] = reject;
      }
    },
    writable: true
  }), _Object$create));
  iterator[kLastPromise] = null;
  endOfStream(stream, function (err) {
    if (err && err.code !== 'ERR_STREAM_PREMATURE_CLOSE') {
      var reject = iterator[kLastReject]; // reject if we are waiting for data in the Promise
      // returned by next() and store the error

      if (reject !== null) {
        iterator[kLastPromise] = null;
        iterator[kLastResolve] = null;
        iterator[kLastReject] = null;
        reject(err);
      }

      iterator[kError] = err;
      return;
    }

    var resolve = iterator[kLastResolve];

    if (resolve !== null) {
      iterator[kLastPromise] = null;
      iterator[kLastResolve] = null;
      iterator[kLastReject] = null;
      resolve(createIterResult(undefined, true));
    }

    iterator[kEnded] = true;
  });
  stream.on('readable', onReadable.bind(null, iterator));
  return iterator;
};

var async_iterator = createReadableStreamAsyncIterator;var _stream_readable = Readable;
/*<replacement>*/

var Duplex$2;
/*</replacement>*/

Readable.ReadableState = ReadableState;
/*<replacement>*/

var EE = events.EventEmitter;

var EElistenerCount = function EElistenerCount(emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/



/*</replacement>*/


var Buffer$4 = buffer.Buffer;

var OurUint8Array$1 = commonjsGlobal.Uint8Array || function () {};

function _uint8ArrayToBuffer$1(chunk) {
  return Buffer$4.from(chunk);
}

function _isUint8Array$1(obj) {
  return Buffer$4.isBuffer(obj) || obj instanceof OurUint8Array$1;
}
/*<replacement>*/




var debug$2;

if (util && util.debuglog) {
  debug$2 = util.debuglog('stream');
} else {
  debug$2 = function debug() {};
}
/*</replacement>*/






var getHighWaterMark$2 = state.getHighWaterMark;

var _require$codes$1 = errors.codes,
    ERR_INVALID_ARG_TYPE$1 = _require$codes$1.ERR_INVALID_ARG_TYPE,
    ERR_STREAM_PUSH_AFTER_EOF = _require$codes$1.ERR_STREAM_PUSH_AFTER_EOF,
    ERR_METHOD_NOT_IMPLEMENTED$1 = _require$codes$1.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_STREAM_UNSHIFT_AFTER_END_EVENT = _require$codes$1.ERR_STREAM_UNSHIFT_AFTER_END_EVENT;

var emitExperimentalWarning$1 = experimentalWarning.emitExperimentalWarning; // Lazy loaded to improve the startup performance.


var StringDecoder$1;
var createReadableStreamAsyncIterator$1;

inherits(Readable, stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') return emitter.prependListener(event, fn); // This is a hack to make sure that our error handler is attached before any
  // userland ones.  NEVER DO THIS. This is here only because this code needs
  // to continue to work with older versions of Node.js that do not include
  // the prependListener() method. The goal is to eventually remove this hack.

  if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (Array.isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
}

function ReadableState(options, stream, isDuplex) {
  Duplex$2 = Duplex$2 || _stream_duplex;
  options = options || {}; // Duplex streams are both readable and writable, but share
  // the same options object.
  // However, some cases require setting options to different
  // values for the readable and the writable sides of the duplex stream.
  // These options can be provided separately as readableXXX and writableXXX.

  if (typeof isDuplex !== 'boolean') isDuplex = stream instanceof Duplex$2; // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away

  this.objectMode = !!options.objectMode;
  if (isDuplex) this.objectMode = this.objectMode || !!options.readableObjectMode; // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"

  this.highWaterMark = getHighWaterMark$2(this, options, 'readableHighWaterMark', isDuplex); // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()

  this.buffer = new buffer_list();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false; // a flag to be able to tell if the event 'readable'/'data' is emitted
  // immediately, or on a later tick.  We set this to true at first, because
  // any actions that shouldn't happen until "later" should generally also
  // not happen before the first read call.

  this.sync = true; // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.

  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.paused = true; // Should close be emitted on destroy. Defaults to true.

  this.emitClose = options.emitClose !== false; // has it been destroyed

  this.destroyed = false; // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.

  this.defaultEncoding = options.defaultEncoding || 'utf8'; // the number of writers that are awaiting a drain event in .pipe()s

  this.awaitDrain = 0; // if true, a maybeReadMore has been scheduled

  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;

  if (options.encoding) {
    if (!StringDecoder$1) StringDecoder$1 = string_decoder.StringDecoder;
    this.decoder = new StringDecoder$1(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex$2 = Duplex$2 || _stream_duplex;
  if (!(this instanceof Readable)) return new Readable(options); // Checking for a Stream.Duplex instance is faster here instead of inside
  // the ReadableState constructor, at least with V8 6.5

  var isDuplex = this instanceof Duplex$2;
  this._readableState = new ReadableState(options, this, isDuplex); // legacy

  this.readable = true;

  if (options) {
    if (typeof options.read === 'function') this._read = options.read;
    if (typeof options.destroy === 'function') this._destroy = options.destroy;
  }

  stream.call(this);
}

Object.defineProperty(Readable.prototype, 'destroyed', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    if (this._readableState === undefined) {
      return false;
    }

    return this._readableState.destroyed;
  },
  set: function set(value) {
    // we ignore the value if the stream
    // has not been initialized yet
    if (!this._readableState) {
      return;
    } // backward compatibility, the user is explicitly
    // managing destroyed


    this._readableState.destroyed = value;
  }
});
Readable.prototype.destroy = destroy_1.destroy;
Readable.prototype._undestroy = destroy_1.undestroy;

Readable.prototype._destroy = function (err, cb) {
  cb(err);
}; // Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.


Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;
  var skipChunkCheck;

  if (!state.objectMode) {
    if (typeof chunk === 'string') {
      encoding = encoding || state.defaultEncoding;

      if (encoding !== state.encoding) {
        chunk = Buffer$4.from(chunk, encoding);
        encoding = '';
      }

      skipChunkCheck = true;
    }
  } else {
    skipChunkCheck = true;
  }

  return readableAddChunk(this, chunk, encoding, false, skipChunkCheck);
}; // Unshift should *always* be something directly out of read()


Readable.prototype.unshift = function (chunk) {
  return readableAddChunk(this, chunk, null, true, false);
};

function readableAddChunk(stream, chunk, encoding, addToFront, skipChunkCheck) {
  debug$2('readableAddChunk', chunk);
  var state = stream._readableState;

  if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else {
    var er;
    if (!skipChunkCheck) er = chunkInvalid(state, chunk);

    if (er) {
      stream.emit('error', er);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (typeof chunk !== 'string' && !state.objectMode && Object.getPrototypeOf(chunk) !== Buffer$4.prototype) {
        chunk = _uint8ArrayToBuffer$1(chunk);
      }

      if (addToFront) {
        if (state.endEmitted) stream.emit('error', new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());else addChunk(stream, state, chunk, true);
      } else if (state.ended) {
        stream.emit('error', new ERR_STREAM_PUSH_AFTER_EOF());
      } else if (state.destroyed) {
        return false;
      } else {
        state.reading = false;

        if (state.decoder && !encoding) {
          chunk = state.decoder.write(chunk);
          if (state.objectMode || chunk.length !== 0) addChunk(stream, state, chunk, false);else maybeReadMore(stream, state);
        } else {
          addChunk(stream, state, chunk, false);
        }
      }
    } else if (!addToFront) {
      state.reading = false;
      maybeReadMore(stream, state);
    }
  } // We can push more data if we are below the highWaterMark.
  // Also, if we have no data yet, we can stand some more bytes.
  // This is to work around cases where hwm=0, such as the repl.


  return !state.ended && (state.length < state.highWaterMark || state.length === 0);
}

function addChunk(stream, state, chunk, addToFront) {
  if (state.flowing && state.length === 0 && !state.sync) {
    state.awaitDrain = 0;
    stream.emit('data', chunk);
  } else {
    // update the buffer info.
    state.length += state.objectMode ? 1 : chunk.length;
    if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
    if (state.needReadable) emitReadable(stream);
  }

  maybeReadMore(stream, state);
}

function chunkInvalid(state, chunk) {
  var er;

  if (!_isUint8Array$1(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new ERR_INVALID_ARG_TYPE$1('chunk', ['string', 'Buffer', 'Uint8Array'], chunk);
  }

  return er;
}

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
}; // backwards compatibility.


Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder$1) StringDecoder$1 = string_decoder.StringDecoder;
  this._readableState.decoder = new StringDecoder$1(enc); // if setEncoding(null), decoder.encoding equals utf8

  this._readableState.encoding = this._readableState.decoder.encoding;
  return this;
}; // Don't raise the hwm > 8MB


var MAX_HWM = 0x800000;

function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }

  return n;
} // This function is designed to be inlinable, so please take care when making
// changes to the function body.


function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;

  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  } // If we're asking for more than the current hwm, then raise the hwm.


  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n; // Don't have enough

  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }

  return state.length;
} // you can override either this method, or the async _read(n) below.


Readable.prototype.read = function (n) {
  debug$2('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;
  if (n !== 0) state.emittedReadable = false; // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.

  if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
    debug$2('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state); // if we've ended, and we're now clear, then finish it up.

  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  } // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.
  // if we need a readable event, then we need to do some reading.


  var doRead = state.needReadable;
  debug$2('need readable', doRead); // if we currently have less than the highWaterMark, then also read some

  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug$2('length less than watermark', doRead);
  } // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.


  if (state.ended || state.reading) {
    doRead = false;
    debug$2('reading or ended', doRead);
  } else if (doRead) {
    debug$2('do read');
    state.reading = true;
    state.sync = true; // if the length is currently zero, then we *need* a readable event.

    if (state.length === 0) state.needReadable = true; // call internal read method

    this._read(state.highWaterMark);

    state.sync = false; // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.

    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
    state.awaitDrain = 0;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true; // If we tried to read() past the EOF, then emit end on the next tick.

    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);
  return ret;
};

function onEofChunk(stream, state) {
  if (state.ended) return;

  if (state.decoder) {
    var chunk = state.decoder.end();

    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }

  state.ended = true;

  if (state.sync) {
    // if we are sync, wait until next tick to emit the data.
    // Otherwise we risk emitting data in the flow()
    // the readable code triggers during a read() call
    emitReadable(stream);
  } else {
    // emit 'readable' now to make sure it gets picked up.
    state.needReadable = false;

    if (!state.emittedReadable) {
      state.emittedReadable = true;
      emitReadable_(stream);
    }
  }
} // Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.


function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;

  if (!state.emittedReadable) {
    debug$2('emitReadable', state.flowing);
    state.emittedReadable = true;
    process.nextTick(emitReadable_, stream);
  }
}

function emitReadable_(stream) {
  var state = stream._readableState;
  debug$2('emitReadable_', state.destroyed, state.length, state.ended);

  if (!state.destroyed && (state.length || state.ended)) {
    stream.emit('readable');
  } // The stream needs another readable event if
  // 1. It is not flowing, as the flow mechanism will take
  //    care of it.
  // 2. It is not ended.
  // 3. It is below the highWaterMark, so we can schedule
  //    another readable later.


  state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
  flow(stream);
} // at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.


function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    process.nextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  // Attempt to read more data if we should.
  //
  // The conditions for reading more data are (one of):
  // - Not enough data buffered (state.length < state.highWaterMark). The loop
  //   is responsible for filling the buffer with enough data if such data
  //   is available. If highWaterMark is 0 and we are not in the flowing mode
  //   we should _not_ attempt to buffer any extra data. We'll get more data
  //   when the stream consumer calls read() instead.
  // - No data in the buffer, and the stream is in flowing mode. In this mode
  //   the loop below is responsible for ensuring read() is called. Failing to
  //   call read here would abort the flow and there's no other mechanism for
  //   continuing the flow if the stream consumer has just subscribed to the
  //   'data' event.
  //
  // In addition to the above conditions to keep reading data, the following
  // conditions prevent the data from being read:
  // - The stream has ended (state.ended).
  // - There is already a pending 'read' operation (state.reading). This is a
  //   case where the the stream has called the implementation defined _read()
  //   method, but they are processing the call asynchronously and have _not_
  //   called push() with new data. In this case we skip performing more
  //   read()s. The execution ends in this method again after the _read() ends
  //   up calling push() with more data.
  while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
    var len = state.length;
    debug$2('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length) // didn't get any data, stop spinning.
      break;
  }

  state.readingMore = false;
} // abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.


Readable.prototype._read = function (n) {
  this.emit('error', new ERR_METHOD_NOT_IMPLEMENTED$1('_read()'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;

    case 1:
      state.pipes = [state.pipes, dest];
      break;

    default:
      state.pipes.push(dest);
      break;
  }

  state.pipesCount += 1;
  debug$2('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
  var endFn = doEnd ? onend : unpipe;
  if (state.endEmitted) process.nextTick(endFn);else src.once('end', endFn);
  dest.on('unpipe', onunpipe);

  function onunpipe(readable, unpipeInfo) {
    debug$2('onunpipe');

    if (readable === src) {
      if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
        unpipeInfo.hasUnpiped = true;
        cleanup();
      }
    }
  }

  function onend() {
    debug$2('onend');
    dest.end();
  } // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.


  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);
  var cleanedUp = false;

  function cleanup() {
    debug$2('cleanup'); // cleanup event handlers once the pipe is broken

    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', unpipe);
    src.removeListener('data', ondata);
    cleanedUp = true; // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.

    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  src.on('data', ondata);

  function ondata(chunk) {
    debug$2('ondata');
    var ret = dest.write(chunk);
    debug$2('dest.write', ret);

    if (ret === false) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug$2('false write response, pause', state.awaitDrain);
        state.awaitDrain++;
      }

      src.pause();
    }
  } // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.


  function onerror(er) {
    debug$2('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  } // Make sure our error handler is attached before userland ones.


  prependListener(dest, 'error', onerror); // Both close and finish should trigger unpipe, but only once.

  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }

  dest.once('close', onclose);

  function onfinish() {
    debug$2('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }

  dest.once('finish', onfinish);

  function unpipe() {
    debug$2('unpipe');
    src.unpipe(dest);
  } // tell the dest that it's being piped to


  dest.emit('pipe', src); // start the flow if it hasn't been started already.

  if (!state.flowing) {
    debug$2('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function pipeOnDrainFunctionResult() {
    var state = src._readableState;
    debug$2('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;

    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;
  var unpipeInfo = {
    hasUnpiped: false
  }; // if we're not piping anywhere, then do nothing.

  if (state.pipesCount === 0) return this; // just one destination.  most common case.

  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;
    if (!dest) dest = state.pipes; // got a match.

    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this, unpipeInfo);
    return this;
  } // slow case. multiple pipe destinations.


  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this, {
        hasUnpiped: false
      });
    }

    return this;
  } // try to find the right one.


  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;
  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];
  dest.emit('unpipe', this, unpipeInfo);
  return this;
}; // set up data events if they are asked for
// Ensure readable listeners eventually get something


Readable.prototype.on = function (ev, fn) {
  var res = stream.prototype.on.call(this, ev, fn);
  var state = this._readableState;

  if (ev === 'data') {
    // update readableListening so that resume() may be a no-op
    // a few lines down. This is needed to support once('readable').
    state.readableListening = this.listenerCount('readable') > 0; // Try start flowing on next tick if stream isn't explicitly paused

    if (state.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.flowing = false;
      state.emittedReadable = false;
      debug$2('on readable', state.length, state.reading);

      if (state.length) {
        emitReadable(this);
      } else if (!state.reading) {
        process.nextTick(nReadingNextTick, this);
      }
    }
  }

  return res;
};

Readable.prototype.addListener = Readable.prototype.on;

Readable.prototype.removeListener = function (ev, fn) {
  var res = stream.prototype.removeListener.call(this, ev, fn);

  if (ev === 'readable') {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

Readable.prototype.removeAllListeners = function (ev) {
  var res = stream.prototype.removeAllListeners.apply(this, arguments);

  if (ev === 'readable' || ev === undefined) {
    // We need to check if there is someone still listening to
    // readable and reset the state. However this needs to happen
    // after readable has been emitted but before I/O (nextTick) to
    // support once('readable', fn) cycles. This means that calling
    // resume within the same tick will have no
    // effect.
    process.nextTick(updateReadableListening, this);
  }

  return res;
};

function updateReadableListening(self) {
  var state = self._readableState;
  state.readableListening = self.listenerCount('readable') > 0;

  if (state.resumeScheduled && !state.paused) {
    // flowing needs to be set to true now, otherwise
    // the upcoming resume will not flow.
    state.flowing = true; // crude way to check if we should resume
  } else if (self.listenerCount('data') > 0) {
    self.resume();
  }
}

function nReadingNextTick(self) {
  debug$2('readable nexttick read 0');
  self.read(0);
} // pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.


Readable.prototype.resume = function () {
  var state = this._readableState;

  if (!state.flowing) {
    debug$2('resume'); // we flow only if there is no one listening
    // for readable, but we still have to call
    // resume()

    state.flowing = !state.readableListening;
    resume(this, state);
  }

  state.paused = false;
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    process.nextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  debug$2('resume', state.reading);

  if (!state.reading) {
    stream.read(0);
  }

  state.resumeScheduled = false;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug$2('call pause flowing=%j', this._readableState.flowing);

  if (this._readableState.flowing !== false) {
    debug$2('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }

  this._readableState.paused = true;
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug$2('flow', state.flowing);

  while (state.flowing && stream.read() !== null) {
  }
} // wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.


Readable.prototype.wrap = function (stream) {
  var _this = this;

  var state = this._readableState;
  var paused = false;
  stream.on('end', function () {
    debug$2('wrapped end');

    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) _this.push(chunk);
    }

    _this.push(null);
  });
  stream.on('data', function (chunk) {
    debug$2('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk); // don't skip over falsy values in objectMode

    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = _this.push(chunk);

    if (!ret) {
      paused = true;
      stream.pause();
    }
  }); // proxy all the other methods.
  // important when wrapping filters and duplexes.

  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function methodWrap(method) {
        return function methodWrapReturnFunction() {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  } // proxy certain important events.


  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], this.emit.bind(this, kProxyEvents[n]));
  } // when we try to consume some more bytes, simply unpause the
  // underlying stream.


  this._read = function (n) {
    debug$2('wrapped _read', n);

    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return this;
};

if (typeof Symbol === 'function') {
  Readable.prototype[Symbol.asyncIterator] = function () {
    emitExperimentalWarning$1('Readable[Symbol.asyncIterator]');

    if (createReadableStreamAsyncIterator$1 === undefined) {
      createReadableStreamAsyncIterator$1 = async_iterator;
    }

    return createReadableStreamAsyncIterator$1(this);
  };
}

Object.defineProperty(Readable.prototype, 'readableHighWaterMark', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.highWaterMark;
  }
});
Object.defineProperty(Readable.prototype, 'readableBuffer', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState && this._readableState.buffer;
  }
});
Object.defineProperty(Readable.prototype, 'readableFlowing', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.flowing;
  },
  set: function set(state) {
    if (this._readableState) {
      this._readableState.flowing = state;
    }
  }
}); // exposed for testing purposes only.

Readable._fromList = fromList;
Object.defineProperty(Readable.prototype, 'readableLength', {
  // making it explicit this property is not enumerable
  // because otherwise some prototype manipulation in
  // userland will fail
  enumerable: false,
  get: function get() {
    return this._readableState.length;
  }
}); // Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.

function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;
  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.first();else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = state.buffer.consume(n, state.decoder);
  }
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;
  debug$2('endReadable', state.endEmitted);

  if (!state.endEmitted) {
    state.ended = true;
    process.nextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  debug$2('endReadableNT', state.endEmitted, state.length); // Check that we didn't get one last unshift.

  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }

  return -1;
}var _stream_transform = Transform;

var _require$codes$2 = errors.codes,
    ERR_METHOD_NOT_IMPLEMENTED$2 = _require$codes$2.ERR_METHOD_NOT_IMPLEMENTED,
    ERR_MULTIPLE_CALLBACK$1 = _require$codes$2.ERR_MULTIPLE_CALLBACK,
    ERR_TRANSFORM_ALREADY_TRANSFORMING = _require$codes$2.ERR_TRANSFORM_ALREADY_TRANSFORMING,
    ERR_TRANSFORM_WITH_LENGTH_0 = _require$codes$2.ERR_TRANSFORM_WITH_LENGTH_0;



inherits(Transform, _stream_duplex);

function afterTransform(er, data) {
  var ts = this._transformState;
  ts.transforming = false;
  var cb = ts.writecb;

  if (cb === null) {
    return this.emit('error', new ERR_MULTIPLE_CALLBACK$1());
  }

  ts.writechunk = null;
  ts.writecb = null;
  if (data != null) // single equals check for both `null` and `undefined`
    this.push(data);
  cb(er);
  var rs = this._readableState;
  rs.reading = false;

  if (rs.needReadable || rs.length < rs.highWaterMark) {
    this._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);
  _stream_duplex.call(this, options);
  this._transformState = {
    afterTransform: afterTransform.bind(this),
    needTransform: false,
    transforming: false,
    writecb: null,
    writechunk: null,
    writeencoding: null
  }; // start out asking for a readable event once data is transformed.

  this._readableState.needReadable = true; // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.

  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;
    if (typeof options.flush === 'function') this._flush = options.flush;
  } // When the writable side finishes, then flush out anything remaining.


  this.on('prefinish', prefinish$1);
}

function prefinish$1() {
  var _this = this;

  if (typeof this._flush === 'function' && !this._readableState.destroyed) {
    this._flush(function (er, data) {
      done(_this, er, data);
    });
  } else {
    done(this, null, null);
  }
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return _stream_duplex.prototype.push.call(this, chunk, encoding);
}; // This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.


Transform.prototype._transform = function (chunk, encoding, cb) {
  cb(new ERR_METHOD_NOT_IMPLEMENTED$2('_transform()'));
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;

  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
}; // Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.


Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && !ts.transforming) {
    ts.transforming = true;

    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

Transform.prototype._destroy = function (err, cb) {
  _stream_duplex.prototype._destroy.call(this, err, function (err2) {
    cb(err2);
  });
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);
  if (data != null) // single equals check for both `null` and `undefined`
    stream.push(data); // TODO(BridgeAR): Write a test for these two error cases
  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided

  if (stream._writableState.length) throw new ERR_TRANSFORM_WITH_LENGTH_0();
  if (stream._transformState.transforming) throw new ERR_TRANSFORM_ALREADY_TRANSFORMING();
  return stream.push(null);
}var _stream_passthrough = PassThrough;



inherits(PassThrough, _stream_transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);
  _stream_transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};var eos$1;

function once$1(callback) {
  var called = false;
  return function () {
    if (called) return;
    called = true;
    callback.apply(void 0, arguments);
  };
}

var _require$codes$3 = errors.codes,
    ERR_MISSING_ARGS = _require$codes$3.ERR_MISSING_ARGS,
    ERR_STREAM_DESTROYED$1 = _require$codes$3.ERR_STREAM_DESTROYED;

function noop$2(err) {
  // Rethrow the error if it exists to avoid swallowing it
  if (err) throw err;
}

function isRequest$1(stream) {
  return stream.setHeader && typeof stream.abort === 'function';
}

function destroyer(stream, reading, writing, callback) {
  callback = once$1(callback);
  var closed = false;
  stream.on('close', function () {
    closed = true;
  });
  if (eos$1 === undefined) eos$1 = endOfStream;
  eos$1(stream, {
    readable: reading,
    writable: writing
  }, function (err) {
    if (err) return callback(err);
    closed = true;
    callback();
  });
  var destroyed = false;
  return function (err) {
    if (closed) return;
    if (destroyed) return;
    destroyed = true; // request.destroy just do .end - .abort is what we want

    if (isRequest$1(stream)) return stream.abort();
    if (typeof stream.destroy === 'function') return stream.destroy();
    callback(err || new ERR_STREAM_DESTROYED$1('pipe'));
  };
}

function call(fn) {
  fn();
}

function pipe(from, to) {
  return from.pipe(to);
}

function popCallback(streams) {
  if (!streams.length) return noop$2;
  if (typeof streams[streams.length - 1] !== 'function') return noop$2;
  return streams.pop();
}

function pipeline() {
  for (var _len = arguments.length, streams = new Array(_len), _key = 0; _key < _len; _key++) {
    streams[_key] = arguments[_key];
  }

  var callback = popCallback(streams);
  if (Array.isArray(streams[0])) streams = streams[0];

  if (streams.length < 2) {
    throw new ERR_MISSING_ARGS('streams');
  }

  var error;
  var destroys = streams.map(function (stream, i) {
    var reading = i < streams.length - 1;
    var writing = i > 0;
    return destroyer(stream, reading, writing, function (err) {
      if (!error) error = err;
      if (err) destroys.forEach(call);
      if (reading) return;
      destroys.forEach(call);
      callback(error);
    });
  });
  return streams.reduce(pipe);
}

var pipeline_1 = pipeline;var readable = createCommonjsModule(function (module, exports) {
if (process.env.READABLE_STREAM === 'disable' && stream$1) {
  module.exports = stream$1.Readable;
  Object.assign(module.exports, stream$1);
  module.exports.Stream = stream$1;
} else {
  exports = module.exports = _stream_readable;
  exports.Stream = stream$1 || exports;
  exports.Readable = exports;
  exports.Writable = _stream_writable;
  exports.Duplex = _stream_duplex;
  exports.Transform = _stream_transform;
  exports.PassThrough = _stream_passthrough;
  exports.finished = endOfStream;
  exports.pipeline = pipeline_1;
}
});
var readable_1 = readable.Stream;
var readable_2 = readable.Readable;
var readable_3 = readable.Writable;
var readable_4 = readable.Duplex;
var readable_5 = readable.Transform;
var readable_6 = readable.PassThrough;
var readable_7 = readable.finished;
var readable_8 = readable.pipeline;var WritableStream_1 = Stream;


var WritableStream = readable.Writable;
var StringDecoder$2 = string_decoder$1.StringDecoder;
var Buffer$5 = buffer.Buffer;

function Stream(cbs, options) {
    var parser = (this._parser = new Parser_1(cbs, options));
    var decoder = (this._decoder = new StringDecoder$2());

    WritableStream.call(this, { decodeStrings: false });

    this.once("finish", function() {
        parser.end(decoder.end());
    });
}

inherits(Stream, WritableStream);

Stream.prototype._write = function(chunk, encoding, cb) {
    if (chunk instanceof Buffer$5) chunk = this._decoder.write(chunk);
    this._parser.write(chunk);
    cb();
};var Stream_1 = Stream$1;



function Stream$1(options) {
    WritableStream_1.call(this, new Cbs(this), options);
}

inherits(Stream$1, WritableStream_1);

Stream$1.prototype.readable = true;

function Cbs(scope) {
    this.scope = scope;
}

var EVENTS = lib.EVENTS;

Object.keys(EVENTS).forEach(function(name) {
    if (EVENTS[name] === 0) {
        Cbs.prototype["on" + name] = function() {
            this.scope.emit(name);
        };
    } else if (EVENTS[name] === 1) {
        Cbs.prototype["on" + name] = function(a) {
            this.scope.emit(name, a);
        };
    } else if (EVENTS[name] === 2) {
        Cbs.prototype["on" + name] = function(a, b) {
            this.scope.emit(name, a, b);
        };
    } else {
        throw Error("wrong number of arguments!");
    }
});var ProxyHandler_1 = ProxyHandler;

function ProxyHandler(cbs) {
    this._cbs = cbs || {};
}

var EVENTS$1 = lib.EVENTS;
Object.keys(EVENTS$1).forEach(function(name) {
    if (EVENTS$1[name] === 0) {
        name = "on" + name;
        ProxyHandler.prototype[name] = function() {
            if (this._cbs[name]) this._cbs[name]();
        };
    } else if (EVENTS$1[name] === 1) {
        name = "on" + name;
        ProxyHandler.prototype[name] = function(a) {
            if (this._cbs[name]) this._cbs[name](a);
        };
    } else if (EVENTS$1[name] === 2) {
        name = "on" + name;
        ProxyHandler.prototype[name] = function(a, b) {
            if (this._cbs[name]) this._cbs[name](a, b);
        };
    } else {
        throw Error("wrong number of arguments");
    }
});var CollectingHandler_1 = CollectingHandler;

function CollectingHandler(cbs) {
    this._cbs = cbs || {};
    this.events = [];
}

var EVENTS$2 = lib.EVENTS;
Object.keys(EVENTS$2).forEach(function(name) {
    if (EVENTS$2[name] === 0) {
        name = "on" + name;
        CollectingHandler.prototype[name] = function() {
            this.events.push([name]);
            if (this._cbs[name]) this._cbs[name]();
        };
    } else if (EVENTS$2[name] === 1) {
        name = "on" + name;
        CollectingHandler.prototype[name] = function(a) {
            this.events.push([name, a]);
            if (this._cbs[name]) this._cbs[name](a);
        };
    } else if (EVENTS$2[name] === 2) {
        name = "on" + name;
        CollectingHandler.prototype[name] = function(a, b) {
            this.events.push([name, a, b]);
            if (this._cbs[name]) this._cbs[name](a, b);
        };
    } else {
        throw Error("wrong number of arguments");
    }
});

CollectingHandler.prototype.onreset = function() {
    this.events = [];
    if (this._cbs.onreset) this._cbs.onreset();
};

CollectingHandler.prototype.restart = function() {
    if (this._cbs.onreset) this._cbs.onreset();

    for (var i = 0, len = this.events.length; i < len; i++) {
        if (this._cbs[this.events[i][0]]) {
            var num = this.events[i].length;

            if (num === 1) {
                this._cbs[this.events[i][0]]();
            } else if (num === 2) {
                this._cbs[this.events[i][0]](this.events[i][1]);
            } else {
                this._cbs[this.events[i][0]](
                    this.events[i][1],
                    this.events[i][2]
                );
            }
        }
    }
};var lib = createCommonjsModule(function (module) {
function defineProp(name, value) {
    delete module.exports[name];
    module.exports[name] = value;
    return value;
}

module.exports = {
    Parser: Parser_1,
    Tokenizer: Tokenizer_1,
    ElementType: domelementtype,
    DomHandler: domhandler,
    get FeedHandler() {
        return defineProp("FeedHandler", FeedHandler_1);
    },
    get Stream() {
        return defineProp("Stream", Stream_1);
    },
    get WritableStream() {
        return defineProp("WritableStream", WritableStream_1);
    },
    get ProxyHandler() {
        return defineProp("ProxyHandler", ProxyHandler_1);
    },
    get DomUtils() {
        return defineProp("DomUtils", domutils);
    },
    get CollectingHandler() {
        return defineProp(
            "CollectingHandler",
            CollectingHandler_1
        );
    },
    // For legacy support
    DefaultHandler: domhandler,
    get RssHandler() {
        return defineProp("RssHandler", this.FeedHandler);
    },
    //helper methods
    parseDOM: function(data, options) {
        var handler = new domhandler(options);
        new Parser_1(handler, options).end(data);
        return handler.dom;
    },
    parseFeed: function(feed, options) {
        var handler = new module.exports.FeedHandler(options);
        new Parser_1(handler, options).end(feed);
        return handler.dom;
    },
    createDomStream: function(cb, options, elementCb) {
        var handler = new domhandler(cb, options, elementCb);
        return new Parser_1(handler, options);
    },
    // List of all events that the parser emits
    EVENTS: {
        /* Format: eventname: number of arguments */
        attribute: 2,
        cdatastart: 0,
        cdataend: 0,
        text: 1,
        processinginstruction: 2,
        comment: 1,
        commentend: 0,
        closetag: 1,
        opentag: 2,
        opentagname: 1,
        error: 1,
        end: 0
    }
};
});
var lib_1 = lib.Parser;
var lib_2 = lib.Tokenizer;
var lib_3 = lib.ElementType;
var lib_4 = lib.DomHandler;
var lib_5 = lib.FeedHandler;
var lib_6 = lib.Stream;
var lib_7 = lib.WritableStream;
var lib_8 = lib.ProxyHandler;
var lib_9 = lib.DomUtils;
var lib_10 = lib.CollectingHandler;
var lib_11 = lib.DefaultHandler;
var lib_12 = lib.RssHandler;
var lib_13 = lib.parseDOM;
var lib_14 = lib.parseFeed;
var lib_15 = lib.createDomStream;
var lib_16 = lib.EVENTS;class OnyxScrape {
  constructor(url, targetAttr, includeString = false) {
    this.url = url;
    this.targetAttr = targetAttr;
    switch (includeString) {
      case false:
        break;
      default:
        this.includeString = includeString;
    }
    return new Promise(async resolve => {
      const content = await this.__requestData();
      const parse = await this.__parseData(content);
      resolve(parse);
    });
  }

  async __requestData() {
    const data = await axios$1
      .get(this.url)
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        return [false, error];
      });
    return data;
  }

  async __parseData(htmlToParse) {
    let text;
    const targetAttr = this.targetAttr;
    let handler = new lib.DomHandler(function(error, dom) {
      if(error) return false;
      const output = lib.DomUtils.getElementsByTagName(targetAttr, dom);
      text = lib.DomUtils.getText(output);
    }, {normalizeWhitespace: true});
    let parser = new lib.Parser(handler, {decodeEntities: true});
    parser.write(htmlToParse.data);
    parser.end();
    text = text.split(" ");
    return text;
  }
}/**
 * @author Duncan Pierce
 * @param {string} hex
 */
const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
};

/**
 * @author Duncan Pierce
 * @param {array} rgb
 */
const rgbToHex = rgb => {
  if (rgb.length !== 3) {
    return false;
  }

  let results = [];

  rgb.forEach(value => {
    if (value > 255 || value < 0) {
      return false;
    }
    results.push(valueToHex(value));
  });
  results = results.join("").toUpperCase();
  return results;
};

/**
 * @author Duncan Pierce
 * @param {int} rgbValue
 */
const valueToHex = rgbValue => {
  const hex = Math.round(rgbValue).toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};module.exports = {
   OnyxScrape,
   rgbToHex,
   hexToRgb,
   valueToHex
};