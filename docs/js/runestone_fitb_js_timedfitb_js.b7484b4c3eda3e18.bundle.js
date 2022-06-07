(self["webpackChunkWebComponents"] = self["webpackChunkWebComponents"] || []).push([["runestone_fitb_js_timedfitb_js"],{

/***/ 68007:
/*!*************************************!*\
  !*** ./runestone/fitb/css/fitb.css ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 15544:
/*!******************************************!*\
  !*** ./runestone/fitb/js/ejs/lib/ejs.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/



/**
 * @file Embedded JavaScript templating engine. {@link http://ejs.co}
 * @author Matthew Eernisse <mde@fleegix.org>
 * @author Tiancheng "Timothy" Gu <timothygu99@gmail.com>
 * @project EJS
 * @license {@link http://www.apache.org/licenses/LICENSE-2.0 Apache License, Version 2.0}
 */

/**
 * EJS internal functions.
 *
 * Technically this "module" lies in the same file as {@link module:ejs}, for
 * the sake of organization all the private functions re grouped into this
 * module.
 *
 * @module ejs-internal
 * @private
 */

/**
 * Embedded JavaScript templating engine.
 *
 * @module ejs
 * @public
 */

var fs = __webpack_require__(/*! fs */ 11513);
var path = __webpack_require__(/*! path */ 95362);
var utils = __webpack_require__(/*! ./utils */ 27190);

var scopeOptionWarned = false;
/** @type {string} */
var _VERSION_STRING = __webpack_require__(/*! ../package.json */ 43264).version;
var _DEFAULT_OPEN_DELIMITER = '<';
var _DEFAULT_CLOSE_DELIMITER = '>';
var _DEFAULT_DELIMITER = '%';
var _DEFAULT_LOCALS_NAME = 'locals';
var _NAME = 'ejs';
var _REGEX_STRING = '(<%%|%%>|<%=|<%-|<%_|<%#|<%|%>|-%>|_%>)';
var _OPTS_PASSABLE_WITH_DATA = ['delimiter', 'scope', 'context', 'debug', 'compileDebug',
  'client', '_with', 'rmWhitespace', 'strict', 'filename', 'async'];
// We don't allow 'cache' option to be passed in the data obj for
// the normal `render` call, but this is where Express 2 & 3 put it
// so we make an exception for `renderFile`
var _OPTS_PASSABLE_WITH_DATA_EXPRESS = _OPTS_PASSABLE_WITH_DATA.concat('cache');
var _BOM = /^\uFEFF/;

/**
 * EJS template function cache. This can be a LRU object from lru-cache NPM
 * module. By default, it is {@link module:utils.cache}, a simple in-process
 * cache that grows continuously.
 *
 * @type {Cache}
 */

exports.cache = utils.cache;

/**
 * Custom file loader. Useful for template preprocessing or restricting access
 * to a certain part of the filesystem.
 *
 * @type {fileLoader}
 */

exports.fileLoader = fs.readFileSync;

/**
 * Name of the object containing the locals.
 *
 * This variable is overridden by {@link Options}`.localsName` if it is not
 * `undefined`.
 *
 * @type {String}
 * @public
 */

exports.localsName = _DEFAULT_LOCALS_NAME;

/**
 * Promise implementation -- defaults to the native implementation if available
 * This is mostly just for testability
 *
 * @type {PromiseConstructorLike}
 * @public
 */

exports.promiseImpl = (new Function('return this;'))().Promise;

/**
 * Get the path to the included file from the parent file path and the
 * specified path.
 *
 * @param {String}  name     specified path
 * @param {String}  filename parent file path
 * @param {Boolean} [isDir=false] whether the parent file path is a directory
 * @return {String}
 */
exports.resolveInclude = function(name, filename, isDir) {
  var dirname = path.dirname;
  var extname = path.extname;
  var resolve = path.resolve;
  var includePath = resolve(isDir ? filename : dirname(filename), name);
  var ext = extname(name);
  if (!ext) {
    includePath += '.ejs';
  }
  return includePath;
};

/**
 * Try to resolve file path on multiple directories
 *
 * @param  {String}        name  specified path
 * @param  {Array<String>} paths list of possible parent directory paths
 * @return {String}
 */
function resolvePaths(name, paths) {
  var filePath;
  if (paths.some(function (v) {
    filePath = exports.resolveInclude(name, v, true);
    return fs.existsSync(filePath);
  })) {
    return filePath;
  }
}

/**
 * Get the path to the included file by Options
 *
 * @param  {String}  path    specified path
 * @param  {Options} options compilation options
 * @return {String}
 */
function getIncludePath(path, options) {
  var includePath;
  var filePath;
  var views = options.views;
  var match = /^[A-Za-z]+:\\|^\//.exec(path);

  // Abs path
  if (match && match.length) {
    path = path.replace(/^\/*/, '');
    if (Array.isArray(options.root)) {
      includePath = resolvePaths(path, options.root);
    } else {
      includePath = exports.resolveInclude(path, options.root || '/', true);
    }
  }
  // Relative paths
  else {
    // Look relative to a passed filename first
    if (options.filename) {
      filePath = exports.resolveInclude(path, options.filename);
      if (fs.existsSync(filePath)) {
        includePath = filePath;
      }
    }
    // Then look in any views directories
    if (!includePath && Array.isArray(views)) {
      includePath = resolvePaths(path, views);
    }
    if (!includePath && typeof options.includer !== 'function') {
      throw new Error('Could not find the include file "' +
          options.escapeFunction(path) + '"');
    }
  }
  return includePath;
}

/**
 * Get the template from a string or a file, either compiled on-the-fly or
 * read from cache (if enabled), and cache the template if needed.
 *
 * If `template` is not set, the file specified in `options.filename` will be
 * read.
 *
 * If `options.cache` is true, this function reads the file from
 * `options.filename` so it must be set prior to calling this function.
 *
 * @memberof module:ejs-internal
 * @param {Options} options   compilation options
 * @param {String} [template] template source
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned.
 * @static
 */

function handleCache(options, template) {
  var func;
  var filename = options.filename;
  var hasTemplate = arguments.length > 1;

  if (options.cache) {
    if (!filename) {
      throw new Error('cache option requires a filename');
    }
    func = exports.cache.get(filename);
    if (func) {
      return func;
    }
    if (!hasTemplate) {
      template = fileLoader(filename).toString().replace(_BOM, '');
    }
  }
  else if (!hasTemplate) {
    // istanbul ignore if: should not happen at all
    if (!filename) {
      throw new Error('Internal EJS error: no file name or template '
                    + 'provided');
    }
    template = fileLoader(filename).toString().replace(_BOM, '');
  }
  func = exports.compile(template, options);
  if (options.cache) {
    exports.cache.set(filename, func);
  }
  return func;
}

/**
 * Try calling handleCache with the given options and data and call the
 * callback with the result. If an error occurs, call the callback with
 * the error. Used by renderFile().
 *
 * @memberof module:ejs-internal
 * @param {Options} options    compilation options
 * @param {Object} data        template data
 * @param {RenderFileCallback} cb callback
 * @static
 */

function tryHandleCache(options, data, cb) {
  var result;
  if (!cb) {
    if (typeof exports.promiseImpl == 'function') {
      return new exports.promiseImpl(function (resolve, reject) {
        try {
          result = handleCache(options)(data);
          resolve(result);
        }
        catch (err) {
          reject(err);
        }
      });
    }
    else {
      throw new Error('Please provide a callback function');
    }
  }
  else {
    try {
      result = handleCache(options)(data);
    }
    catch (err) {
      return cb(err);
    }

    cb(null, result);
  }
}

/**
 * fileLoader is independent
 *
 * @param {String} filePath ejs file path.
 * @return {String} The contents of the specified file.
 * @static
 */

function fileLoader(filePath){
  return exports.fileLoader(filePath);
}

/**
 * Get the template function.
 *
 * If `options.cache` is `true`, then the template is cached.
 *
 * @memberof module:ejs-internal
 * @param {String}  path    path for the specified file
 * @param {Options} options compilation options
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `options.client`, either type might be returned
 * @static
 */

function includeFile(path, options) {
  var opts = utils.shallowCopy({}, options);
  opts.filename = getIncludePath(path, opts);
  if (typeof options.includer === 'function') {
    var includerResult = options.includer(path, opts.filename);
    if (includerResult) {
      if (includerResult.filename) {
        opts.filename = includerResult.filename;
      }
      if (includerResult.template) {
        return handleCache(opts, includerResult.template);
      }
    }
  }
  return handleCache(opts);
}

/**
 * Re-throw the given `err` in context to the `str` of ejs, `filename`, and
 * `lineno`.
 *
 * @implements {RethrowCallback}
 * @memberof module:ejs-internal
 * @param {Error}  err      Error object
 * @param {String} str      EJS source
 * @param {String} flnm     file name of the EJS file
 * @param {Number} lineno   line number of the error
 * @param {EscapeCallback} esc
 * @static
 */

function rethrow(err, str, flnm, lineno, esc) {
  var lines = str.split('\n');
  var start = Math.max(lineno - 3, 0);
  var end = Math.min(lines.length, lineno + 3);
  var filename = esc(flnm);
  // Error context
  var context = lines.slice(start, end).map(function (line, i){
    var curr = i + start + 1;
    return (curr == lineno ? ' >> ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'ejs') + ':'
    + lineno + '\n'
    + context + '\n\n'
    + err.message;

  throw err;
}

function stripSemi(str){
  return str.replace(/;(\s*$)/, '$1');
}

/**
 * Compile the given `str` of ejs into a template function.
 *
 * @param {String}  template EJS template
 *
 * @param {Options} [opts] compilation options
 *
 * @return {(TemplateFunction|ClientFunction)}
 * Depending on the value of `opts.client`, either type might be returned.
 * Note that the return type of the function also depends on the value of `opts.async`.
 * @public
 */

exports.compile = function compile(template, opts) {
  var templ;

  // v1 compat
  // 'scope' is 'context'
  // FIXME: Remove this in a future version
  if (opts && opts.scope) {
    if (!scopeOptionWarned){
      console.warn('`scope` option is deprecated and will be removed in EJS 3');
      scopeOptionWarned = true;
    }
    if (!opts.context) {
      opts.context = opts.scope;
    }
    delete opts.scope;
  }
  templ = new Template(template, opts);
  return templ.compile();
};

/**
 * Render the given `template` of ejs.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}   template EJS template
 * @param {Object}  [data={}] template data
 * @param {Options} [opts={}] compilation and rendering options
 * @return {(String|Promise<String>)}
 * Return value type depends on `opts.async`.
 * @public
 */

exports.render = function (template, d, o) {
  var data = d || {};
  var opts = o || {};

  // No options object -- if there are optiony names
  // in the data, copy them to options
  if (arguments.length == 2) {
    utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA);
  }

  return handleCache(opts, template)(data);
};

/**
 * Render an EJS file at the given `path` and callback `cb(err, str)`.
 *
 * If you would like to include options but not data, you need to explicitly
 * call this function with `data` being an empty object or `null`.
 *
 * @param {String}             path     path to the EJS file
 * @param {Object}            [data={}] template data
 * @param {Options}           [opts={}] compilation and rendering options
 * @param {RenderFileCallback} cb callback
 * @public
 */

exports.renderFile = function () {
  var args = Array.prototype.slice.call(arguments);
  var filename = args.shift();
  var cb;
  var opts = {filename: filename};
  var data;
  var viewOpts;

  // Do we have a callback?
  if (typeof arguments[arguments.length - 1] == 'function') {
    cb = args.pop();
  }
  // Do we have data/opts?
  if (args.length) {
    // Should always have data obj
    data = args.shift();
    // Normal passed opts (data obj + opts obj)
    if (args.length) {
      // Use shallowCopy so we don't pollute passed in opts obj with new vals
      utils.shallowCopy(opts, args.pop());
    }
    // Special casing for Express (settings + opts-in-data)
    else {
      // Express 3 and 4
      if (data.settings) {
        // Pull a few things from known locations
        if (data.settings.views) {
          opts.views = data.settings.views;
        }
        if (data.settings['view cache']) {
          opts.cache = true;
        }
        // Undocumented after Express 2, but still usable, esp. for
        // items that are unsafe to be passed along with data, like `root`
        viewOpts = data.settings['view options'];
        if (viewOpts) {
          utils.shallowCopy(opts, viewOpts);
        }
      }
      // Express 2 and lower, values set in app.locals, or people who just
      // want to pass options in their data. NOTE: These values will override
      // anything previously set in settings  or settings['view options']
      utils.shallowCopyFromList(opts, data, _OPTS_PASSABLE_WITH_DATA_EXPRESS);
    }
    opts.filename = filename;
  }
  else {
    data = {};
  }

  return tryHandleCache(opts, data, cb);
};

/**
 * Clear intermediate JavaScript cache. Calls {@link Cache#reset}.
 * @public
 */

/**
 * EJS template class
 * @public
 */
exports.Template = Template;

exports.clearCache = function () {
  exports.cache.reset();
};

function Template(text, opts) {
  opts = opts || {};
  var options = {};
  this.templateText = text;
  /** @type {string | null} */
  this.mode = null;
  this.truncate = false;
  this.currentLine = 1;
  this.source = '';
  options.client = opts.client || false;
  options.escapeFunction = opts.escape || opts.escapeFunction || utils.escapeXML;
  options.compileDebug = opts.compileDebug !== false;
  options.debug = !!opts.debug;
  options.filename = opts.filename;
  options.openDelimiter = opts.openDelimiter || exports.openDelimiter || _DEFAULT_OPEN_DELIMITER;
  options.closeDelimiter = opts.closeDelimiter || exports.closeDelimiter || _DEFAULT_CLOSE_DELIMITER;
  options.delimiter = opts.delimiter || exports.delimiter || _DEFAULT_DELIMITER;
  options.strict = opts.strict || false;
  options.context = opts.context;
  options.cache = opts.cache || false;
  options.rmWhitespace = opts.rmWhitespace;
  options.root = opts.root;
  options.includer = opts.includer;
  options.outputFunctionName = opts.outputFunctionName;
  options.localsName = opts.localsName || exports.localsName || _DEFAULT_LOCALS_NAME;
  options.views = opts.views;
  options.async = opts.async;
  options.destructuredLocals = opts.destructuredLocals;
  options.legacyInclude = typeof opts.legacyInclude != 'undefined' ? !!opts.legacyInclude : true;

  if (options.strict) {
    options._with = false;
  }
  else {
    options._with = typeof opts._with != 'undefined' ? opts._with : true;
  }

  this.opts = options;

  this.regex = this.createRegex();
}

Template.modes = {
  EVAL: 'eval',
  ESCAPED: 'escaped',
  RAW: 'raw',
  COMMENT: 'comment',
  LITERAL: 'literal'
};

Template.prototype = {
  createRegex: function () {
    var str = _REGEX_STRING;
    var delim = utils.escapeRegExpChars(this.opts.delimiter);
    var open = utils.escapeRegExpChars(this.opts.openDelimiter);
    var close = utils.escapeRegExpChars(this.opts.closeDelimiter);
    str = str.replace(/%/g, delim)
      .replace(/</g, open)
      .replace(/>/g, close);
    return new RegExp(str);
  },

  compile: function () {
    /** @type {string} */
    var src;
    /** @type {ClientFunction} */
    var fn;
    var opts = this.opts;
    var prepended = '';
    var appended = '';
    /** @type {EscapeCallback} */
    var escapeFn = opts.escapeFunction;
    /** @type {FunctionConstructor} */
    var ctor;
    /** @type {string} */
    var sanitizedFilename = opts.filename ? JSON.stringify(opts.filename) : 'undefined';

    if (!this.source) {
      this.generateSource();
      prepended +=
        '  var __output = "";\n' +
        '  function __append(s) { if (s !== undefined && s !== null) __output += s }\n';
      if (opts.outputFunctionName) {
        prepended += '  var ' + opts.outputFunctionName + ' = __append;' + '\n';
      }
      if (opts.destructuredLocals && opts.destructuredLocals.length) {
        var destructuring = '  var __locals = (' + opts.localsName + ' || {}),\n';
        for (var i = 0; i < opts.destructuredLocals.length; i++) {
          var name = opts.destructuredLocals[i];
          if (i > 0) {
            destructuring += ',\n  ';
          }
          destructuring += name + ' = __locals.' + name;
        }
        prepended += destructuring + ';\n';
      }
      if (opts._with === false) {
        prepended += '  Function.apply(null, ["__append", "escapeFn"].concat(Object.keys(' + opts.localsName + ' || {}), [\n';
        appended += '])).apply(null, [__append, escapeFn].concat(Object.values(' + opts.localsName + ' || {})));\n';
        this.source = JSON.stringify(this.source);
      }
      appended += '  return __output;' + '\n';
      this.source = prepended + this.source + appended;
    }

    if (opts.compileDebug) {
      src = 'var __line = 1' + '\n'
        + '  , __lines = ' + JSON.stringify(this.templateText) + '\n'
        + '  , __filename = ' + sanitizedFilename + ';' + '\n'
        + 'try {' + '\n'
        + this.source
        + '} catch (e) {' + '\n'
        + '  rethrow(e, __lines, __filename, __line, escapeFn);' + '\n'
        + '}' + '\n';
    }
    else {
      src = this.source;
    }

    if (opts.client) {
      src = 'escapeFn = escapeFn || ' + escapeFn.toString() + ';' + '\n' + src;
      if (opts.compileDebug) {
        src = 'rethrow = rethrow || ' + rethrow.toString() + ';' + '\n' + src;
      }
    }

    if (opts.strict) {
      src = '"use strict";\n' + src;
    }
    if (opts.debug) {
      console.log(src);
    }
    if (opts.compileDebug && opts.filename) {
      src = src + '\n'
        + '//# sourceURL=' + sanitizedFilename + '\n';
    }

    try {
      if (opts.async) {
        // Have to use generated function for this, since in envs without support,
        // it breaks in parsing
        try {
          ctor = (new Function('return (async function(){}).constructor;'))();
        }
        catch(e) {
          if (e instanceof SyntaxError) {
            throw new Error('This environment does not support async/await');
          }
          else {
            throw e;
          }
        }
      }
      else {
        ctor = Function;
      }
      fn = new ctor(opts.localsName + ', escapeFn, include, rethrow', src);
    }
    catch(e) {
      // istanbul ignore else
      if (e instanceof SyntaxError) {
        if (opts.filename) {
          e.message += ' in ' + opts.filename;
        }
        e.message += ' while compiling ejs\n\n';
        e.message += 'If the above error is not helpful, you may want to try EJS-Lint:\n';
        e.message += 'https://github.com/RyanZim/EJS-Lint';
        if (!opts.async) {
          e.message += '\n';
          e.message += 'Or, if you meant to create an async function, pass `async: true` as an option.';
        }
      }
      throw e;
    }

    // Return a callable function which will execute the function
    // created by the source-code, with the passed data as locals
    // Adds a local `include` function which allows full recursive include
    var returnedFn = opts.client ? fn : function anonymous(data) {
      var include = function (path, includeData) {
        var d = utils.shallowCopy({}, data);
        if (includeData) {
          d = utils.shallowCopy(d, includeData);
        }
        return includeFile(path, opts)(d);
      };
      return fn.apply(opts.context, [data || {}, escapeFn, include, rethrow]);
    };
    if (opts.filename && typeof Object.defineProperty === 'function') {
      var filename = opts.filename;
      var basename = path.basename(filename, path.extname(filename));
      try {
        Object.defineProperty(returnedFn, 'name', {
          value: basename,
          writable: false,
          enumerable: false,
          configurable: true
        });
      } catch (e) {/* ignore */}
    }
    return returnedFn;
  },

  generateSource: function () {
    var opts = this.opts;

    if (opts.rmWhitespace) {
      // Have to use two separate replace here as `^` and `$` operators don't
      // work well with `\r` and empty lines don't work well with the `m` flag.
      this.templateText =
        this.templateText.replace(/[\r\n]+/g, '\n').replace(/^\s+|\s+$/gm, '');
    }

    // Slurp spaces and tabs before <%_ and after _%>
    this.templateText =
      this.templateText.replace(/[ \t]*<%_/gm, '<%_').replace(/_%>[ \t]*/gm, '_%>');

    var self = this;
    var matches = this.parseTemplateText();
    var d = this.opts.delimiter;
    var o = this.opts.openDelimiter;
    var c = this.opts.closeDelimiter;

    if (matches && matches.length) {
      matches.forEach(function (line, index) {
        var closing;
        // If this is an opening tag, check for closing tags
        // FIXME: May end up with some false positives here
        // Better to store modes as k/v with openDelimiter + delimiter as key
        // Then this can simply check against the map
        if ( line.indexOf(o + d) === 0        // If it is a tag
          && line.indexOf(o + d + d) !== 0) { // and is not escaped
          closing = matches[index + 2];
          if (!(closing == d + c || closing == '-' + d + c || closing == '_' + d + c)) {
            throw new Error('Could not find matching close tag for "' + line + '".');
          }
        }
        self.scanLine(line);
      });
    }

  },

  parseTemplateText: function () {
    var str = this.templateText;
    var pat = this.regex;
    var result = pat.exec(str);
    var arr = [];
    var firstPos;

    while (result) {
      firstPos = result.index;

      if (firstPos !== 0) {
        arr.push(str.substring(0, firstPos));
        str = str.slice(firstPos);
      }

      arr.push(result[0]);
      str = str.slice(result[0].length);
      result = pat.exec(str);
    }

    if (str) {
      arr.push(str);
    }

    return arr;
  },

  _addOutput: function (line) {
    if (this.truncate) {
      // Only replace single leading linebreak in the line after
      // -%> tag -- this is the single, trailing linebreak
      // after the tag that the truncation mode replaces
      // Handle Win / Unix / old Mac linebreaks -- do the \r\n
      // combo first in the regex-or
      line = line.replace(/^(?:\r\n|\r|\n)/, '');
      this.truncate = false;
    }
    if (!line) {
      return line;
    }

    // Preserve literal slashes
    line = line.replace(/\\/g, '\\\\');

    // Convert linebreaks
    line = line.replace(/\n/g, '\\n');
    line = line.replace(/\r/g, '\\r');

    // Escape double-quotes
    // - this will be the delimiter during execution
    line = line.replace(/"/g, '\\"');
    this.source += '    ; __append("' + line + '")' + '\n';
  },

  scanLine: function (line) {
    var self = this;
    var d = this.opts.delimiter;
    var o = this.opts.openDelimiter;
    var c = this.opts.closeDelimiter;
    var newLineCount = 0;

    newLineCount = (line.split('\n').length - 1);

    switch (line) {
    case o + d:
    case o + d + '_':
      this.mode = Template.modes.EVAL;
      break;
    case o + d + '=':
      this.mode = Template.modes.ESCAPED;
      break;
    case o + d + '-':
      this.mode = Template.modes.RAW;
      break;
    case o + d + '#':
      this.mode = Template.modes.COMMENT;
      break;
    case o + d + d:
      this.mode = Template.modes.LITERAL;
      this.source += '    ; __append("' + line.replace(o + d + d, o + d) + '")' + '\n';
      break;
    case d + d + c:
      this.mode = Template.modes.LITERAL;
      this.source += '    ; __append("' + line.replace(d + d + c, d + c) + '")' + '\n';
      break;
    case d + c:
    case '-' + d + c:
    case '_' + d + c:
      if (this.mode == Template.modes.LITERAL) {
        this._addOutput(line);
      }

      this.mode = null;
      this.truncate = line.indexOf('-') === 0 || line.indexOf('_') === 0;
      break;
    default:
      // In script mode, depends on type of tag
      if (this.mode) {
        // If '//' is found without a line break, add a line break.
        switch (this.mode) {
        case Template.modes.EVAL:
        case Template.modes.ESCAPED:
        case Template.modes.RAW:
          if (line.lastIndexOf('//') > line.lastIndexOf('\n')) {
            line += '\n';
          }
        }
        switch (this.mode) {
        // Just executing code
        case Template.modes.EVAL:
          this.source += '    ; ' + line + '\n';
          break;
          // Exec, esc, and output
        case Template.modes.ESCAPED:
          this.source += '    ; __append(escapeFn(' + stripSemi(line) + '))' + '\n';
          break;
          // Exec and output
        case Template.modes.RAW:
          this.source += '    ; __append(' + stripSemi(line) + ')' + '\n';
          break;
        case Template.modes.COMMENT:
          // Do nothing
          break;
          // Literal <%% mode, append as raw output
        case Template.modes.LITERAL:
          this._addOutput(line);
          break;
        }
      }
      // In string mode, just add the output
      else {
        this._addOutput(line);
      }
    }

    if (self.opts.compileDebug && newLineCount) {
      this.currentLine += newLineCount;
      this.source += '    ; __line = ' + this.currentLine + '\n';
    }
  }
};

/**
 * Escape characters reserved in XML.
 *
 * This is simply an export of {@link module:utils.escapeXML}.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @public
 * @func
 * */
exports.escapeXML = utils.escapeXML;

/**
 * Express.js support.
 *
 * This is an alias for {@link module:ejs.renderFile}, in order to support
 * Express.js out-of-the-box.
 *
 * @func
 */

exports.__express = exports.renderFile;

/**
 * Version of EJS.
 *
 * @readonly
 * @type {String}
 * @public
 */

exports.VERSION = _VERSION_STRING;

/**
 * Name for detection of EJS.
 *
 * @readonly
 * @type {String}
 * @public
 */

exports.name = _NAME;

/* istanbul ignore if */
if (typeof window != 'undefined') {
  window.ejs = exports;
}


/***/ }),

/***/ 27190:
/*!********************************************!*\
  !*** ./runestone/fitb/js/ejs/lib/utils.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*
 * EJS Embedded JavaScript templates
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/

/**
 * Private utility functions
 * @module utils
 * @private
 */



var regExpChars = /[|\\{}()[\]^$+*?.]/g;

/**
 * Escape characters reserved in regular expressions.
 *
 * If `string` is `undefined` or `null`, the empty string is returned.
 *
 * @param {String} string Input string
 * @return {String} Escaped string
 * @static
 * @private
 */
exports.escapeRegExpChars = function (string) {
  // istanbul ignore if
  if (!string) {
    return '';
  }
  return String(string).replace(regExpChars, function(match) { return "\\" + match; });
};

var _ENCODE_HTML_RULES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&#34;',
  "'": '&#39;'
};
var _MATCH_HTML = /[&<>'"]/g;

function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
}

/**
 * Stringified version of constants used by {@link module:utils.escapeXML}.
 *
 * It is used in the process of generating {@link ClientFunction}s.
 *
 * @readonly
 * @type {String}
 */

var escapeFuncStr =
  'var _ENCODE_HTML_RULES = {\n'
+ '      "&": "&amp;"\n'
+ '    , "<": "&lt;"\n'
+ '    , ">": "&gt;"\n'
+ '    , \'"\': "&#34;"\n'
+ '    , "\'": "&#39;"\n'
+ '    }\n'
+ '  , _MATCH_HTML = /[&<>\'"]/g;\n'
+ 'function encode_char(c) {\n'
+ '  return _ENCODE_HTML_RULES[c] || c;\n'
+ '};\n';

/**
 * Escape characters reserved in XML.
 *
 * If `markup` is `undefined` or `null`, the empty string is returned.
 *
 * @implements {EscapeCallback}
 * @param {String} markup Input string
 * @return {String} Escaped string
 * @static
 * @private
 */

exports.escapeXML = function (markup) {
  return markup == undefined
    ? ''
    : String(markup)
      .replace(_MATCH_HTML, encode_char);
};
exports.escapeXML.toString = function () {
  return Function.prototype.toString.call(this) + ';\n' + escapeFuncStr;
};

/**
 * Naive copy of properties from one object to another.
 * Does not recurse into non-scalar properties
 * Does not check to see if the property has a value before copying
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @return {Object}      Destination object
 * @static
 * @private
 */
exports.shallowCopy = function (to, from) {
  from = from || {};
  for (var p in from) {
    to[p] = from[p];
  }
  return to;
};

/**
 * Naive copy of a list of key names, from one object to another.
 * Only copies property if it is actually defined
 * Does not recurse into non-scalar properties
 *
 * @param  {Object} to   Destination object
 * @param  {Object} from Source object
 * @param  {Array} list List of properties to copy
 * @return {Object}      Destination object
 * @static
 * @private
 */
exports.shallowCopyFromList = function (to, from, list) {
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    if (typeof from[p] != 'undefined') {
      to[p] = from[p];
    }
  }
  return to;
};

/**
 * Simple in-process cache implementation. Does not implement limits of any
 * sort.
 *
 * @implements {Cache}
 * @static
 * @private
 */
exports.cache = {
  _data: {},
  set: function (key, val) {
    this._data[key] = val;
  },
  get: function (key) {
    return this._data[key];
  },
  remove: function (key) {
    delete this._data[key];
  },
  reset: function () {
    this._data = {};
  }
};

/**
 * Transforms hyphen case variable into camel case.
 *
 * @param {String} string Hyphen case string
 * @return {String} Camel case string
 * @static
 * @private
 */
exports.hyphenToCamel = function (str) {
  return str.replace(/-[a-z]/g, function (match) { return match[1].toUpperCase(); });
};


/***/ }),

/***/ 86151:
/*!*******************************************!*\
  !*** ./runestone/fitb/js/fitb-i18n.en.js ***!
  \*******************************************/
/***/ (() => {

$.i18n().load({
    en: {
        msg_no_answer: "No answer provided.",
        msg_fitb_check_me: "Check me",
        msg_fitb_compare_me: "Compare me",
        msg_fitb_randomize: "Randomize"
    },
});


/***/ }),

/***/ 61353:
/*!**********************************************!*\
  !*** ./runestone/fitb/js/fitb-i18n.pt-br.js ***!
  \**********************************************/
/***/ (() => {

$.i18n().load({
    "pt-br": {
        msg_no_answer: "Nenhuma resposta dada.",
        msg_fitb_check_me: "Verificar",
        msg_fitb_compare_me: "Comparar"
    },
});


/***/ }),

/***/ 91004:
/*!*****************************************!*\
  !*** ./runestone/fitb/js/fitb-utils.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderDynamicContent": () => (/* binding */ renderDynamicContent),
/* harmony export */   "checkAnswersCore": () => (/* binding */ checkAnswersCore),
/* harmony export */   "renderDynamicFeedback": () => (/* binding */ renderDynamicFeedback)
/* harmony export */ });
/* harmony import */ var _ejs_lib_ejs_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ejs/lib/ejs.js */ 15544);
/* harmony import */ var _ejs_lib_ejs_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_ejs_lib_ejs_js__WEBPACK_IMPORTED_MODULE_0__);
// ********************************************************
// |docname| - grading-related utilities for FITB questions
// ********************************************************
// This code runs both on the server (for server-side grading) and on the client. It's placed here as a set of functions specifically for this purpose.




// Includes
// ========
// This is an edited copy of `EJS <https://ejs.co/>`_:
//
// -    It contains the improvement mentioned in `this issue <https://github.com/mde/ejs/issues/624>`_.
// -    It also contains a workaround for a `js2py v0.71 bug <https://github.com/PiotrDabkowski/Js2Py/pull/265>`_. The fix is merged, but not yet released.
//
// If both issues are merged and released, then use EJS from NPM.



// Globals
// =======
// Standard options to use for EJS templates.
const EJS_OPTIONS = {
    strict: true,
    // Not needed, but might reduce confusion -- you can access the variable ``a`` as ``a`` or ``v.a``.
    localsName: "v",
    // Avoid the default delimiters of ``<`` and ``>``, which get translated to HTML entities by Sphinx.
    openDelimiter: "[",
    closeDelimiter: "]"
};


// Functions
// =========
// Update the problem's description based on dynamically-generated content.
function renderDynamicContent(seed, dyn_vars, html_in, divid, prepareCheckAnswers) {
    // Initialize RNG with ``this.seed``. Taken from `SO <https://stackoverflow.com/a/47593316/16038919>`_.
    const rand = function mulberry32(a) {
        return function() {
            let t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }(seed);

    // See `RAND_FUNC <RAND_FUNC>`_, which refers to ``rand`` above.
    const dyn_vars_eval = window.Function(
        "v", "rand", `"use strict";\n${dyn_vars};\nreturn v;`
    )(
        {divid: divid, prepareCheckAnswers: prepareCheckAnswers}, rand
    );

    let html_out;
    if (typeof(dyn_vars_eval.beforeContentRender) === "function") {
        try {
            dyn_vars_eval.beforeContentRender(dyn_vars_eval);
        } catch (err) {
            console.log(`Error in problem ${divid} invoking beforeContentRender`);
            throw err;
        }
    }
    try {
        html_out = (0,_ejs_lib_ejs_js__WEBPACK_IMPORTED_MODULE_0__.render)(html_in, dyn_vars_eval, EJS_OPTIONS);
    } catch (err) {
        console.log(`Error rendering problem ${divid} text using EJS`);
        throw err;
    }

    // the afterContentRender event will be called by the caller of this function (after it updated the HTML based on the contents of html_out).
    return [html_out, dyn_vars_eval];
}


// Given student answers, grade them and provide feedback.
//
// Outputs:
//
// -    ``displayFeed`` is an array of HTML feedback.
// -    ``isCorrectArray`` is an array of true, false, or null (the question wasn't answered).
// -    ``correct`` is true, false, or null (the question wasn't answered).
// -    ``percent`` is the percentage of correct answers (from 0 to 1, not 0 to 100).
function checkAnswersCore(
    // _`blankNamesDict`: An dict of {blank_name, blank_index} specifying the name for each named blank.
    blankNamesDict,
    // _`given_arr`: An array of strings containing student-provided answers for each blank.
    given_arr,
    // A 2-D array of strings giving feedback for each blank.
    feedbackArray,
    // _`dyn_vars_eval`: A dict produced by evaluating the JavaScript for a dynamic exercise.
    dyn_vars_eval,
    // True if this is running on the server, to work around a `js2py v0.71 bug <https://github.com/PiotrDabkowski/Js2Py/pull/266>`_ fixed in master. When a new version is released, remove this.
    is_server=false,
) {
    if (typeof(dyn_vars_eval.beforeCheckAnswers) === "function") {
        const [namedBlankValues, given_arr_converted] = parseAnswers(blankNamesDict, given_arr, dyn_vars_eval);
        const dve_blanks = Object.assign({}, dyn_vars_eval, namedBlankValues);
        try {
            dyn_vars_eval.beforeCheckAnswers(dve_blanks, given_arr_converted);
        } catch (err) {
            console.log("Error calling beforeCheckAnswers");
            throw err;
        }
    }

    // Keep track if all answers are correct or not.
    let correct = true;
    const isCorrectArray = [];
    const displayFeed = [];
    for (let i = 0; i < given_arr.length; i++) {
        const given = given_arr[i];
        // If this blank is empty, provide no feedback for it.
        if (given === "") {
            isCorrectArray.push(null);
            // TODO: was $.i18n("msg_no_answer").
            displayFeed.push("No answer provided.");
            correct = false;
        } else {
            // Look through all feedback for this blank. The last element in the array always matches. If no feedback for this blank exists, use an empty list.
            const fbl = feedbackArray[i] || [];
            let j;
            for (j = 0; j < fbl.length; j++) {
                // The last item of feedback always matches.
                if (j === fbl.length - 1) {
                    displayFeed.push(fbl[j]["feedback"]);
                    break;
                }
                // If this is a dynamic solution...
                if (dyn_vars_eval) {
                    const [namedBlankValues, given_arr_converted] = parseAnswers(blankNamesDict, given_arr, dyn_vars_eval);
                    // If there was a parse error, then it student's answer is incorrect.
                    if (given_arr_converted[i] instanceof TypeError) {
                        displayFeed.push(given_arr_converted[i].message);
                        // Count this as wrong by making j != 0 -- see the code that runs immediately after the executing the break.
                        j = 1;
                        break;
                    }
                    // Create a function to wrap the expression to evaluate. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function.
                    // Pass the answer, array of all answers, then all entries in ``this.dyn_vars_eval`` dict as function parameters.
                    const is_equal = window.Function(
                        "ans",
                        "ans_array",
                        ...Object.keys(dyn_vars_eval),
                        ...Object.keys(namedBlankValues),
                        `"use strict;"\nreturn ${fbl[j]["solution_code"]};`
                    )(
                        given_arr_converted[i],
                        given_arr_converted,
                        ...Object.values(dyn_vars_eval),
                        ...Object.values(namedBlankValues)
                    );
                    // If student's answer is equal to this item, then append this item's feedback.
                    if (is_equal) {
                        displayFeed.push(typeof(is_equal) === "string" ? is_equal : fbl[j]["feedback"]);
                        break;
                    }
                } else
                // If this is a regexp...
                if ("regex" in fbl[j]) {
                    const patt = RegExp(
                        fbl[j]["regex"],
                        fbl[j]["regexFlags"]
                    );
                    if (patt.test(given)) {
                        displayFeed.push(fbl[j]["feedback"]);
                        break;
                    }
                } else {
                    // This is a number.
                    console.assert("number" in fbl[j]);
                    const [min, max] = fbl[j]["number"];
                    // Convert the given string to a number. While there are `lots of ways <https://coderwall.com/p/5tlhmw/converting-strings-to-number-in-javascript-pitfalls>`_ to do this; this version supports other bases (hex/binary/octal) as well as floats.
                    const actual = +given;
                    if (actual >= min && actual <= max) {
                        displayFeed.push(fbl[j]["feedback"]);
                        break;
                    }
                }
            }

            // js2py seems to increment j in the for loop **after** encountering a break statement. Aargh. Work around this.
            if (is_server) {
                --j;
            }
            // The answer is correct if it matched the first element in the array. A special case: if only one answer is provided, count it wrong; this is a misformed problem.
            const is_correct = j === 0 && fbl.length > 1;
            isCorrectArray.push(is_correct);
            if (!is_correct) {
                correct = false;
            }
        }
    }

    if (typeof(dyn_vars_eval.afterCheckAnswers) === "function") {
        const [namedBlankValues, given_arr_converted] = parseAnswers(blankNamesDict, given_arr, dyn_vars_eval);
        const dve_blanks = Object.assign({}, dyn_vars_eval, namedBlankValues);
        try {
            dyn_vars_eval.afterCheckAnswers(dve_blanks, given_arr_converted);
        } catch (err) {
            console.log("Error calling afterCheckAnswers");
            throw err;
        }
    }

    const percent = isCorrectArray.filter(Boolean).length / isCorrectArray.length;
    return [displayFeed, correct, isCorrectArray, percent];
}


// Use the provided parsers to convert a student's answers (as strings) to the type produced by the parser for each blank.
function parseAnswers(
    // See blankNamesDict_.
    blankNamesDict,
    // See given_arr_.
    given_arr,
    // See `dyn_vars_eval`.
    dyn_vars_eval,
){
    // Provide a dict of {blank_name, converter_answer_value}.
    const namedBlankValues = getNamedBlankValues(given_arr, blankNamesDict, dyn_vars_eval);
    // Invert blankNamedDict: compute an array of [blank_0_name, ...]. Note that the array may be sparse: it only contains values for named blanks.
    const given_arr_names = [];
    for (const [k, v] of Object.entries(blankNamesDict)) {
        given_arr_names[v] = k;
    }
    // Compute an array of [converted_blank_0_val, ...]. Note that this re-converts all the values, rather than (possibly deep) copying the values from already-converted named blanks.
    const given_arr_converted = given_arr.map((value, index) => type_convert(given_arr_names[index], value, index, dyn_vars_eval));

    return [namedBlankValues, given_arr_converted];
}


// Render the feedback for a dynamic problem.
function renderDynamicFeedback(
    // See blankNamesDict_.
    blankNamesDict,
    // See given_arr_.
    given_arr,
    // The index of this blank in given_arr_.
    index,
    // The feedback for this blank, containing a template to be rendered.
    displayFeed_i,
    // See dyn_vars_eval_.
    dyn_vars_eval
) {
    // Use the answer, an array of all answers, the value of all named blanks, and all solution variables for the template.
    const namedBlankValues = getNamedBlankValues(given_arr, blankNamesDict, dyn_vars_eval);
    const sol_vars_plus = Object.assign({
        ans: given_arr[index],
        ans_array: given_arr
    },
        dyn_vars_eval,
        namedBlankValues,
    );
    try {
        displayFeed_i = (0,_ejs_lib_ejs_js__WEBPACK_IMPORTED_MODULE_0__.render)(displayFeed_i, sol_vars_plus, EJS_OPTIONS);
    } catch (err) {
        console.log(`Error evaluating feedback index ${index}.`)
        throw err;
    }

    return displayFeed_i;
}


// Utilities
// ---------
// For each named blank, get the value for the blank: the value of each ``blankName`` gives the index of the blank for that name.
function getNamedBlankValues(given_arr, blankNamesDict, dyn_vars_eval) {
    const namedBlankValues = {};
    for (const [blank_name, blank_index] of Object.entries(blankNamesDict)) {
        namedBlankValues[blank_name] = type_convert(blank_name, given_arr[blank_index], blank_index, dyn_vars_eval);
    }
    return namedBlankValues;
}


// Convert a value given its type.
function type_convert(name, value, index, dyn_vars_eval) {
    // The converter can be defined by index, name, or by a single value (which applies to all blanks). If not provided, just pass the data through.
    const types = dyn_vars_eval.types || pass_through;
    const converter = types[name] || types[index] || types;
    // ES5 hack: it doesn't support binary values, and js2py doesn't allow me to override the ``Number`` class. So, define the workaround class ``Number_`` and use it if available.
    if (converter === Number && typeof Number_ !== "undefined") {
        converter = Number_;
    }

    // Return the converted type. If the converter raises a TypeError, return that; it will be displayed to the user, since we assume type errors are a way for the parser to explain to the user why the parse failed. For all other errors, re-throw it since something went wrong.
    try {
        return converter(value);
    } catch (err) {
        if (err instanceof TypeError) {
            return err;
        } else {
            throw err;
        }
    }
}


// A pass-through "converter".
function pass_through(val) {
    return val;
}


/***/ }),

/***/ 99184:
/*!***********************************!*\
  !*** ./runestone/fitb/js/fitb.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "FITBList": () => (/* binding */ FITBList),
/* harmony export */   "default": () => (/* binding */ FITB)
/* harmony export */ });
/* harmony import */ var _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/js/runestonebase.js */ 2568);
/* harmony import */ var _fitb_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./fitb-utils.js */ 91004);
/* harmony import */ var _fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./fitb-i18n.en.js */ 86151);
/* harmony import */ var _fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_fitb_i18n_en_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fitb-i18n.pt-br.js */ 61353);
/* harmony import */ var _fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_fitb_i18n_pt_br_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _css_fitb_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../css/fitb.css */ 68007);
// ***********************************************
// |docname| -- fill-in-the-blank client-side code
// ***********************************************
// This file contains the JS for the Runestone fillintheblank component. It was created By Isaiah Mayerchak and Kirby Olson, 6/4/15 then revised by Brad Miller, 2/7/20.
//
// Data storage notes
// ==================
//
// Initial problem restore
// -----------------------
// In the constructor, this code (the client) restores the problem by calling ``checkServer``. To do so, either the server sends or local storage has:
//
// -    seed (used only for dynamic problems)
// -    answer
// -    displayFeed (server-side grading only; otherwise, this is generated locally by client code)
// -    correct (SSG)
// -    isCorrectArray (SSG)
// -    problemHtml (SSG with dynamic problems only)
//
// If any of the answers are correct, then the client shows feedback. This is implemented in restoreAnswers_.
//
// Grading
// -------
// When the user presses the "Check me" button, the logCurrentAnswer_ function:
//
// -    Saves the following to local storage:
//
//      -   seed
//      -   answer
//      -   timestamp
//      -   problemHtml
//
//      Note that there's no point in saving displayFeed, correct, or isCorrectArray, since these values applied to the previous answer, not the new answer just submitted.
//
// -    Sends the following to the server; stop after this for client-side grading:
//
//      -   seed (ignored for server-side grading)
//      -   answer
//      -   correct (ignored for SSG)
//      -   percent (ignored for SSG)
//
// -    Receives the following from the server:
//
//      -   timestamp
//      -   displayFeed
//      -   correct
//      -   isCorrectArray
//
// -    Saves the following to local storage:
//
//      -   seed
//      -   answer
//      -   timestamp
//      -   displayFeed (SSG only)
//      -   correct (SSG only)
//      -   isCorrectArray (SSG only)
//      -   problemHtml
//
// Randomize
// ---------
// When the user presses the "Randomize" button (which is only available for dynamic problems), the randomize_ function:
//
// -    For the client-side case, sets the seed to a new, random value. For the server-side case, requests a new seed and problemHtml from the server.
// -    Sets the answer to an array of empty strings.
// -    Saves the usual local data.









// Object containing all instances of FITB that aren't a child of a timed assessment.
var FITBList = {};

// FITB constructor
class FITB extends _common_js_runestonebase_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
  constructor(opts) {
    super(opts);
    var orig = opts.orig; // entire <p> element
    this.useRunestoneServices = opts.useRunestoneServices;
    this.origElem = orig;
    this.divid = orig.id;
    this.correct = null;
    // See comments in fitb.py for the format of ``feedbackArray`` (which is identical in both files).
    //
    // Find the script tag containing JSON and parse it. See `SO <https://stackoverflow.com/questions/9320427/best-practice-for-embedding-arbitrary-json-in-the-dom>`__. If this tag doesn't exist, then no feedback is available; server-side grading will be performed.
    //
    // A destructuring assignment would be perfect, but they don't work with ``this.blah`` and ``with`` statements aren't supported in strict mode.
    const json_element = this.scriptSelector(this.origElem);
    const dict_ = JSON.parse(json_element.html());
    json_element.remove();
    this.problemHtml = dict_.problemHtml;
    this.dyn_vars = dict_.dyn_vars;
    this.blankNames = dict_.blankNames;
    this.feedbackArray = dict_.feedbackArray;

    this.createFITBElement();
    this.setupBlanks();
    this.caption = "Fill in the Blank";
    this.addCaption("runestone");
    this.checkServer("fillb", false).then(() => {
      // If there's no seed for a client-side dynamic problem after this check, create one and render it.
      if (typeof this.dyn_vars === "string" && this.seed === undefined) {
        this.randomize();
      }
      this.indicate_component_ready();
    });
  }
  // Find the script tag containing JSON in a given root DOM node.
  scriptSelector(root_node) {
    return $(root_node).find(`script[type="application/json"]`);
  }
  /*===========================================
    ====   Functions generating final HTML   ====
    ===========================================*/
  createFITBElement() {
    this.renderFITBInput();
    this.renderFITBButtons();
    this.renderFITBFeedbackDiv();
    // replaces the intermediate HTML for this component with the rendered HTML of this component
    $(this.origElem).replaceWith(this.containerDiv);
  }
  renderFITBInput() {
    // The text [input] elements are created by the template.
    this.containerDiv = document.createElement("div");
    $(this.containerDiv).addClass("alert alert-warning");
    this.containerDiv.id = this.divid;
    // Create another container which stores the problem description.
    this.descriptionDiv = document.createElement("div");
    this.containerDiv.appendChild(this.descriptionDiv);
    // Copy the original elements to the container holding what the user will see (client-side grading only).
    if (this.problemHtml) {
      this.descriptionDiv.innerHTML = this.problemHtml;
      // Save original HTML (with templates) used in dynamic problems.
      this.descriptionDiv.origInnerHTML = this.problemHtml;
    }
  }

  renderFITBButtons() {
    this.containerDiv.appendChild(document.createElement("br"));
    this.containerDiv.appendChild(document.createElement("br"));

    // "submit" button
    this.submitButton = document.createElement("button");
    this.submitButton.textContent = $.i18n("msg_fitb_check_me");
    $(this.submitButton).attr({
      class: "btn btn-success",
      name: "do answer",
      type: "button",
    });
    this.submitButton.addEventListener(
      "click",
      async function () {
        this.checkCurrentAnswer();
        await this.logCurrentAnswer();
      }.bind(this),
      false
    );
    this.containerDiv.appendChild(this.submitButton);

    // "compare me" button
    if (this.useRunestoneServices) {
      this.compareButton = document.createElement("button");
      $(this.compareButton).attr({
        class: "btn btn-default",
        id: this.origElem.id + "_bcomp",
        disabled: "",
        name: "compare",
      });
      this.compareButton.textContent = $.i18n("msg_fitb_compare_me");
      this.compareButton.addEventListener(
        "click",
        function () {
          this.compareFITBAnswers();
        }.bind(this),
        false
      );
      this.containerDiv.appendChild(this.compareButton);
    }

    // Randomize button for dynamic problems.
    if (this.dyn_vars) {
      this.randomizeButton = document.createElement("button");
      $(this.randomizeButton).attr({
        class: "btn btn-default",
        id: this.origElem.id + "_bcomp",
        name: "randomize",
      });
      this.randomizeButton.textContent = $.i18n("msg_fitb_randomize");
      this.randomizeButton.addEventListener(
        "click",
        function () {
          this.randomize();
        }.bind(this),
        false
      );
      this.containerDiv.appendChild(this.randomizeButton);
    }

    this.containerDiv.appendChild(document.createElement("div"));
  }
  renderFITBFeedbackDiv() {
    this.feedBackDiv = document.createElement("div");
    this.feedBackDiv.id = this.divid + "_feedback";
    this.containerDiv.appendChild(document.createElement("br"));
    this.containerDiv.appendChild(this.feedBackDiv);
  }

  clearFeedbackDiv() {
    // Setting the ``outerHTML`` removes this from the DOM. Use an alternative process -- remove the class (which makes it red/green based on grading) and content.
    this.feedBackDiv.innerHTML = "";
    this.feedBackDiv.className = "";
  }

  // Update the problem's description based on dynamically-generated content.
  renderDynamicContent() {
    // ``this.dyn_vars`` can be true; if so, don't render it, since the server does all the rendering.
    if (typeof this.dyn_vars === "string") {
      [this.descriptionDiv.innerHTML, this.dyn_vars_eval] =
        (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_1__.renderDynamicContent)(
          this.seed,
          this.dyn_vars,
          this.descriptionDiv.origInnerHTML,
          this.divid,
          this.prepareCheckAnswers.bind(this),
        );

      if (typeof(this.dyn_vars_eval.afterContentRender) === "function") {
        try {
          this.dyn_vars_eval.afterContentRender(this.dyn_vars_eval);
        } catch (err) {
          console.log(`Error in problem ${this.divid} invoking afterContentRender`);
          throw err;
        }
      }

      this.queueMathJax(this.descriptionDiv);
      this.setupBlanks();
    }
  }

  setupBlanks() {
    // Find and format the blanks. If a dynamic problem just changed the HTML, this will find the newly-created blanks.
    const ba = $(this.descriptionDiv).find(":input");
    ba.attr("class", "form form-control selectwidthauto");
    ba.attr("aria-label", "input area");
    this.blankArray = ba.toArray();
    for (let blank of this.blankArray) {
      $(blank).change(this.recordAnswered.bind(this));
    }
  }

  // This tells timed questions that the fitb blanks received some interaction.
  recordAnswered() {
    this.isAnswered = true;
  }

  /*===================================
    === Checking/loading from storage ===
    ===================================*/
  // _`restoreAnswers`: update the problem with data from the server or from local storage.
  restoreAnswers(data) {
    // Restore the seed first, since the dynamic render clears all the blanks.
    this.seed = data.seed;
    this.renderDynamicContent();

    var arr;
    // Restore answers from storage retrieval done in RunestoneBase.
    try {
      // The newer format encodes data as a JSON object.
      arr = JSON.parse(data.answer);
      // The result should be an array. If not, try comma parsing instead.
      if (!Array.isArray(arr)) {
        throw new Error();
      }
    } catch (err) {
      // The old format didn't.
      arr = (data.answer || "").split(",");
    }
    let hasAnswer = false;
    for (var i = 0; i < this.blankArray.length; i++) {
      $(this.blankArray[i]).attr("value", arr[i]);
      if (arr[i]) {
        hasAnswer = true;
      }
    }
    // Is this client-side grading, or server-side grading?
    if (this.feedbackArray) {
      // For client-side grading, re-generate feedback if there's an answer.
      if (hasAnswer) {
        this.checkCurrentAnswer();
      }
    } else {
      // For server-side grading, use the provided feedback from the server or local storage.
      this.displayFeed = data.displayFeed;
      this.correct = data.correct;
      this.isCorrectArray = data.isCorrectArray;
      // Only render if all the data is present; local storage might have old data missing some of these items.
      if (
        typeof this.displayFeed !== "undefined" &&
        typeof this.correct !== "undefined" &&
        typeof this.isCorrectArray !== "undefined"
      ) {
        this.renderFeedback();
      }
      // For server-side dynamic problems, show the rendered problem text.
      this.problemHtml = data.problemHtml;
      if (this.problemHtml) {
        this.descriptionDiv.innerHTML = this.problemHtml;
        this.queueMathJax(this.descriptionDiv);
        this.setupBlanks();
      }
    }
  }

  checkLocalStorage() {
    // Loads previous answers from local storage if they exist
    var storedData;
    if (this.graderactive) {
      return;
    }
    var len = localStorage.length;
    if (len > 0) {
      var ex = localStorage.getItem(this.localStorageKey());
      if (ex !== null) {
        try {
          storedData = JSON.parse(ex);
          var arr = storedData.answer;
        } catch (err) {
          // error while parsing; likely due to bad value stored in storage
          console.log(err.message);
          localStorage.removeItem(this.localStorageKey());
          return;
        }
        this.restoreAnswers(storedData);
      }
    }
  }

  setLocalStorage(data) {
    let key = this.localStorageKey();
    localStorage.setItem(key, JSON.stringify(data));
  }

  checkCurrentAnswer() {
    // Start of the evaluation chain
    this.isCorrectArray = [];
    this.displayFeed = [];
    const pca = this.prepareCheckAnswers();

    if (this.useRunestoneServices) {
      if (eBookConfig.enableCompareMe) {
        this.enableCompareButton();
      }
    }

    // Grade locally if we can't ask the server to grade.
    if (this.feedbackArray) {
        [
          // An array of HTML feedback.
          this.displayFeed,
          // true, false, or null (the question wasn't answered).
          this.correct,
          // An array of true, false, or null (the question wasn't answered).
          this.isCorrectArray,
          this.percent
        ] = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_1__.checkAnswersCore)(...pca);
      if (!this.isTimed) {
        this.renderFeedback();
      }
    }
  }

  // Inputs:
  //
  // - Strings entered by the student in ``this.blankArray[i].value``.
  // - Feedback in ``this.feedbackArray``.
  prepareCheckAnswers() {
    this.given_arr = [];
    for (var i = 0; i < this.blankArray.length; i++)
      this.given_arr.push(this.blankArray[i].value);
    return [this.blankNames, this.given_arr, this.feedbackArray, this.dyn_vars_eval];
  }

  // _`randomize`: This handles a click to the "Randomize" button.
  async randomize() {
    // Use the client-side case or the server-side case?
    if (this.feedbackArray) {
      // This is the client-side case.
      //
      this.seed = Math.floor(Math.random() * 2 ** 32);
      this.renderDynamicContent();
    } else {
      // This is the server-side case. Send a request to the `results <getAssessResults>` endpoint with ``new_seed`` set to True.
      const request = new Request("/assessment/results", {
        method: "POST",
        body: JSON.stringify({
          div_id: this.divid,
          course: eBookConfig.course,
          event: "fillb",
          sid: this.sid,
          new_seed: true,
        }),
        headers: this.jsonHeaders,
      });
      const response = await fetch(request);
      if (!response.ok) {
        alert(`HTTP error getting results: ${response.statusText}`);
        return;
      }
      const data = await response.json();
      const res = data.detail;
      this.seed = res.seed;
      this.descriptionDiv.innerHTML = res.problemHtml;
      this.queueMathJax(this.descriptionDiv);
      this.setupBlanks();
    }
    // When getting a new seed, clear all the old answers and feedback.
    this.given_arr = Array(this.blankArray.len).fill("");
    $(this.blankArray).attr("value", "");
    this.clearFeedbackDiv();
    this.saveAnswersLocallyOnly();
  }

  // Save the answers and associated data locally; don't save feedback provided by the server for this answer. It assumes that ``this.given_arr`` contains the current answers.
  saveAnswersLocallyOnly() {
    this.setLocalStorage({
      // The seed is used for client-side operation, but doesn't matter for server-side.
      seed: this.seed,
      answer: JSON.stringify(this.given_arr),
      timestamp: new Date(),
      // This is only needed for server-side grading with dynamic problems.
      problemHtml: this.descriptionDiv.innerHTML,
    });
  }

  // _`logCurrentAnswer`: Save the current state of the problem to local storage and the server; display server feedback.
  async logCurrentAnswer(sid) {
    let answer = JSON.stringify(this.given_arr);
    let feedback = true;
    // Save the answer locally.
    this.saveAnswersLocallyOnly();
    // Save the answer to the server.
    const data = {
      event: "fillb",
      div_id: this.divid,
      act: answer || "",
      seed: this.seed,
      answer: answer || "",
      correct: this.correct ? "T" : "F",
      percent: this.percent,
    };
    if (typeof sid !== "undefined") {
      data.sid = sid;
      feedback = false;
    }
    const server_data = await this.logBookEvent(data);
    if (!feedback) return;
    // Non-server side graded problems are done at this point; likewise, stop here if the server didn't respond.
    if (this.feedbackArray || !server_data) {
      return data;
    }
    // This is the server-side case. On success, update the feedback from the server's grade.
    const res = server_data.detail;
    this.timestamp = res.timestamp;
    this.displayFeed = res.displayFeed;
    this.correct = res.correct;
    this.isCorrectArray = res.isCorrectArray;
    this.setLocalStorage({
      seed: this.seed,
      answer: answer,
      timestamp: this.timestamp,
      problemHtml: this.descriptionDiv.innerHTML,
      displayFeed: this.displayFeed,
      correct: this.correct,
      isCorrectArray: this.isCorrectArray,
    });
    this.renderFeedback();
    return server_data;
  }

  /*==============================
    === Evaluation of answer and ===
    ===     display feedback     ===
    ==============================*/
  renderFeedback() {
    if (this.correct) {
      $(this.feedBackDiv).attr("class", "alert alert-info");
      for (let j = 0; j < this.blankArray.length; j++) {
        $(this.blankArray[j]).removeClass("input-validation-error");
      }
    } else {
      if (this.displayFeed === null) {
        this.displayFeed = "";
      }
      for (let j = 0; j < this.blankArray.length; j++) {
        if (this.isCorrectArray[j] !== true) {
          $(this.blankArray[j]).addClass("input-validation-error");
        } else {
          $(this.blankArray[j]).removeClass("input-validation-error");
        }
      }
      $(this.feedBackDiv).attr("class", "alert alert-danger");
    }
    var feedback_html = "<ul>";
    for (var i = 0; i < this.displayFeed.length; i++) {
      let df = this.displayFeed[i];
      // Render any dynamic feedback in the provided feedback, for client-side grading of dynamic problems.
      if (typeof this.dyn_vars === "string") {
        df = (0,_fitb_utils_js__WEBPACK_IMPORTED_MODULE_1__.renderDynamicFeedback)(
          this.blankNames,
          this.given_arr,
          i,
          df,
          this.dyn_vars_eval
        );
      }
      feedback_html += `<li>${df}</li>`;
    }
    feedback_html += "</ul>";
    // Remove the list if it's just one element.
    if (this.displayFeed.length == 1) {
      feedback_html = feedback_html.slice(
        "<ul><li>".length,
        -"</li></ul>".length
      );
    }
    this.feedBackDiv.innerHTML = feedback_html;
    this.queueMathJax(this.feedBackDiv);
  }

  /*==================================
    === Functions for compare button ===
    ==================================*/
  enableCompareButton() {
    this.compareButton.disabled = false;
  }
  // _`compareFITBAnswers`
  compareFITBAnswers() {
    var data = {};
    data.div_id = this.divid;
    data.course = eBookConfig.course;
    jQuery.get(
      `${eBookConfig.new_server_prefix}/assessment/gettop10Answers`,
      data,
      this.compareFITB
    );
  }
  compareFITB(data, status, whatever) {
    var answers = data.detail.res;
    var misc = data.detail.miscdata;
    var body = "<table>";
    body += "<tr><th>Answer</th><th>Count</th></tr>";
    for (var row in answers) {
      body +=
        "<tr><td>" +
        answers[row].answer +
        "</td><td>" +
        answers[row].count +
        " times</td></tr>";
    }
    body += "</table>";
    var html =
      "<div class='modal fade'>" +
      "    <div class='modal-dialog compare-modal'>" +
      "        <div class='modal-content'>" +
      "            <div class='modal-header'>" +
      "                <button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>" +
      "                <h4 class='modal-title'>Top Answers</h4>" +
      "            </div>" +
      "            <div class='modal-body'>" +
      body +
      "            </div>" +
      "        </div>" +
      "    </div>" +
      "</div>";
    var el = $(html);
    el.modal();
  }

  disableInteraction() {
    for (var i = 0; i < this.blankArray.length; i++) {
      this.blankArray[i].disabled = true;
    }
  }
}

/*=================================
== Find the custom HTML tags and ==
==   execute our code on them    ==
=================================*/
$(document).bind("runestone:login-complete", function () {
  $("[data-component=fillintheblank]").each(function (index) {
    var opts = {
      orig: this,
      useRunestoneServices: eBookConfig.useRunestoneServices,
    };
    if ($(this).closest("[data-component=timedAssessment]").length == 0) {
      // If this element exists within a timed component, don't render it here
      try {
        FITBList[this.id] = new FITB(opts);
      } catch (err) {
        console.log(
          `Error rendering Fill in the Blank Problem ${this.id}
                     Details: ${err}`
        );
      }
    }
  });
});


/***/ }),

/***/ 74309:
/*!****************************************!*\
  !*** ./runestone/fitb/js/timedfitb.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TimedFITB)
/* harmony export */ });
/* harmony import */ var _fitb_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fitb.js */ 99184);

class TimedFITB extends _fitb_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(opts) {
        super(opts);
        this.renderTimedIcon(this.inputDiv);
        this.hideButtons();
        this.needsReinitialization = true;
    }
    hideButtons() {
        $(this.submitButton).hide();
        $(this.compareButton).hide();
    }
    renderTimedIcon(component) {
        // renders the clock icon on timed components.    The component parameter
        // is the element that the icon should be appended to.
        var timeIconDiv = document.createElement("div");
        var timeIcon = document.createElement("img");
        $(timeIcon).attr({
            src: "../_static/clock.png",
            style: "width:15px;height:15px",
        });
        timeIconDiv.className = "timeTip";
        timeIconDiv.title = "";
        timeIconDiv.appendChild(timeIcon);
        $(component).prepend(timeIconDiv);
    }
    checkCorrectTimed() {
        // Returns if the question was correct, incorrect, or skipped (return null in the last case)
        switch (this.correct) {
            case true:
                return "T";
            case false:
                return "F";
            default:
                return null;
        }
    }
    hideFeedback() {
        for (var i = 0; i < this.blankArray.length; i++) {
            $(this.blankArray[i]).removeClass("input-validation-error");
        }
        this.feedBackDiv.style.display = "none";
    }

    reinitializeListeners() {
        this.setupBlanks();
    }
}

if (typeof window.component_factory === "undefined") {
    window.component_factory = {};
}
window.component_factory.fillintheblank = function (opts) {
    if (opts.timed) {
        return new TimedFITB(opts);
    }
    return new _fitb_js__WEBPACK_IMPORTED_MODULE_0__["default"](opts);
};


/***/ }),

/***/ 11513:
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 95362:
/*!**********************!*\
  !*** path (ignored) ***!
  \**********************/
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 43264:
/*!********************************************!*\
  !*** ./runestone/fitb/js/ejs/package.json ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"ejs","description":"Embedded JavaScript templates","keywords":["template","engine","ejs"],"version":"3.1.6","author":"Matthew Eernisse <mde@fleegix.org> (http://fleegix.org)","license":"Apache-2.0","bin":{"ejs":"./bin/cli.js"},"main":"./lib/ejs.js","jsdelivr":"ejs.min.js","unpkg":"ejs.min.js","repository":{"type":"git","url":"git://github.com/mde/ejs.git"},"bugs":"https://github.com/mde/ejs/issues","homepage":"https://github.com/mde/ejs","dependencies":{"jake":"^10.6.1"},"devDependencies":{"browserify":"^16.5.1","eslint":"^6.8.0","git-directory-deploy":"^1.5.1","jsdoc":"^3.6.4","lru-cache":"^4.0.1","mocha":"^7.1.1","uglify-js":"^3.3.16"},"engines":{"node":">=0.10.0"},"scripts":{"test":"mocha"}}');

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVuZXN0b25lX2ZpdGJfanNfdGltZWRmaXRiX2pzLmI3NDg0YjRjM2VkYTNlMTguYnVuZGxlLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFYjtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdURBQXVELGlCQUFpQjtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVMsbUJBQU8sQ0FBQyxlQUFJO0FBQ3JCLFdBQVcsbUJBQU8sQ0FBQyxpQkFBTTtBQUN6QixZQUFZLG1CQUFPLENBQUMsb0JBQVM7O0FBRTdCO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLHNCQUFzQix5REFBa0M7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDhCQUE4Qix5QkFBeUI7QUFDdkQ7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWOztBQUVBLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLGNBQWM7QUFDakQ7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBOztBQUVBLGtCQUFrQjs7QUFFbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTs7QUFFQSxtQkFBbUIsOEJBQThCOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsU0FBUztBQUNwQixXQUFXLFNBQVM7QUFDcEIsV0FBVyxTQUFTO0FBQ3BCLFlBQVk7QUFDWjtBQUNBLHNCQUFzQjtB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVMsOEJBQThCO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwR0FBMEc7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLG9CQUFvQiw0QkFBNEI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLHVEQUF1RDtBQUN2RCxnQ0FBZ0MsSUFBSTtBQUNwQztBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4bUI0QjtBQUNkLHdCQUF3QixnREFBSTtBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCO0FBQy9CLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLDRCQUE0QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsZ0RBQUk7QUFDbkI7Ozs7Ozs7Ozs7O0FDekRBOzs7Ozs7Ozs7O0FDQUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvY3NzL2ZpdGIuY3NzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9lanMvbGliL2Vqcy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZWpzL2xpYi91dGlscy5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzLy4vcnVuZXN0b25lL2ZpdGIvanMvZml0Yi1pMThuLmVuLmpzIiwid2VicGFjazovL1dlYkNvbXBvbmVudHMvLi9ydW5lc3RvbmUvZml0Yi9qcy9maXRiLWkxOG4ucHQtYnIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2ZpdGItdXRpbHMuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL2ZpdGIuanMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy8uL3J1bmVzdG9uZS9maXRiL2pzL3RpbWVkZml0Yi5qcyIsIndlYnBhY2s6Ly9XZWJDb21wb25lbnRzL2lnbm9yZWR8L1VzZXJzL3dhbHRvbmRiL0RldmVsb3Blci9SdW5lc3RvbmVDb21wb25lbnRzL3J1bmVzdG9uZS9maXRiL2pzL2Vqcy9saWJ8ZnMiLCJ3ZWJwYWNrOi8vV2ViQ29tcG9uZW50cy9pZ25vcmVkfC9Vc2Vycy93YWx0b25kYi9EZXZlbG9wZXIvUnVuZXN0b25lQ29tcG9uZW50cy9ydW5lc3RvbmUvZml0Yi9qcy9lanMvbGlifHBhdGgiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luXG5leHBvcnQge307IiwiLypcbiAqIEVKUyBFbWJlZGRlZCBKYXZhU2NyaXB0IHRlbXBsYXRlc1xuICogQ29weXJpZ2h0IDIxMTIgTWF0dGhldyBFZXJuaXNzZSAobWRlQGZsZWVnaXgub3JnKVxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiAgICAgICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKlxuKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBmaWxlIEVtYmVkZGVkIEphdmFTY3JpcHQgdGVtcGxhdGluZyBlbmdpbmUuIHtAbGluayBodHRwOi8vZWpzLmNvfVxuICogQGF1dGhvciBNYXR0aGV3IEVlcm5pc3NlIDxtZGVAZmxlZWdpeC5vcmc+XG4gKiBAYXV0aG9yIFRpYW5jaGVuZyBcIlRpbW90aHlcIiBHdSA8dGltb3RoeWd1OTlAZ21haWwuY29tPlxuICogQHByb2plY3QgRUpTXG4gKiBAbGljZW5zZSB7QGxpbmsgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMH1cbiAqL1xuXG4vKipcbiAqIEVKUyBpbnRlcm5hbCBmdW5jdGlvbnMuXG4gKlxuICogVGVjaG5pY2FsbHkgdGhpcyBcIm1vZHVsZVwiIGxpZXMgaW4gdGhlIHNhbWUgZmlsZSBhcyB7QGxpbmsgbW9kdWxlOmVqc30sIGZvclxuICogdGhlIHNha2Ugb2Ygb3JnYW5pemF0aW9uIGFsbCB0aGUgcHJpdmF0ZSBmdW5jdGlvbnMgcmUgZ3JvdXBlZCBpbnRvIHRoaXNcbiAqIG1vZHVsZS5cbiAqXG4gKiBAbW9kdWxlIGVqcy1pbnRlcm5hbFxuICogQHByaXZhdGVcbiAqL1xuXG4vKipcbiAqIEVtYmVkZGVkIEphdmFTY3JpcHQgdGVtcGxhdGluZyBlbmdpbmUuXG4gKlxuICogQG1vZHVsZSBlanNcbiAqIEBwdWJsaWNcbiAqL1xuXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cbnZhciBzY29wZU9wdGlvbldhcm5lZCA9IGZhbHNlO1xuLyoqIEB0eXBlIHtzdHJpbmd9ICovXG52YXIgX1ZFUlNJT05fU1RSSU5HID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJykudmVyc2lvbjtcbnZhciBfREVGQVVMVF9PUEVOX0RFTElNSVRFUiA9ICc8JztcbnZhciBfREVGQVVMVF9DTE9TRV9ERUxJTUlURVIgPSAnPic7XG52YXIgX0RFRkFVTFRfREVMSU1JVEVSID0gJyUnO1xudmFyIF9ERUZBVUxUX0xPQ0FMU19OQU1FID0gJ2xvY2Fscyc7XG52YXIgX05BTUUgPSAnZWpzJztcbnZhciBfUkVHRVhfU1RSSU5HID0gJyg8JSV8JSU+fDwlPXw8JS18PCVffDwlI3w8JXwlPnwtJT58XyU+KSc7XG52YXIgX09QVFNfUEFTU0FCTEVfV0lUSF9EQVRBID0gWydkZWxpbWl0ZXInLCAnc2NvcGUnLCAnY29udGV4dCcsICdkZWJ1ZycsICdjb21waWxlRGVidWcnLFxuICAnY2xpZW50JywgJ193aXRoJywgJ3JtV2hpdGVzcGFjZScsICdzdHJpY3QnLCAnZmlsZW5hbWUnLCAnYXN5bmMnXTtcbi8vIFdlIGRvbid0IGFsbG93ICdjYWNoZScgb3B0aW9uIHRvIGJlIHBhc3NlZCBpbiB0aGUgZGF0YSBvYmogZm9yXG4vLyB0aGUgbm9ybWFsIGByZW5kZXJgIGNhbGwsIGJ1dCB0aGlzIGlzIHdoZXJlIEV4cHJlc3MgMiAmIDMgcHV0IGl0XG4vLyBzbyB3ZSBtYWtlIGFuIGV4Y2VwdGlvbiBmb3IgYHJlbmRlckZpbGVgXG52YXIgX09QVFNfUEFTU0FCTEVfV0lUSF9EQVRBX0VYUFJFU1MgPSBfT1BUU19QQVNTQUJMRV9XSVRIX0RBVEEuY29uY2F0KCdjYWNoZScpO1xudmFyIF9CT00gPSAvXlxcdUZFRkYvO1xuXG4vKipcbiAqIEVKUyB0ZW1wbGF0ZSBmdW5jdGlvbiBjYWNoZS4gVGhpcyBjYW4gYmUgYSBMUlUgb2JqZWN0IGZyb20gbHJ1LWNhY2hlIE5QTVxuICogbW9kdWxlLiBCeSBkZWZhdWx0LCBpdCBpcyB7QGxpbmsgbW9kdWxlOnV0aWxzLmNhY2hlfSwgYSBzaW1wbGUgaW4tcHJvY2Vzc1xuICogY2FjaGUgdGhhdCBncm93cyBjb250aW51b3VzbHkuXG4gKlxuICogQHR5cGUge0NhY2hlfVxuICovXG5cbmV4cG9ydHMuY2FjaGUgPSB1dGlscy5jYWNoZTtcblxuLyoqXG4gKiBDdXN0b20gZmlsZSBsb2FkZXIuIFVzZWZ1bCBmb3IgdGVtcGxhdGUgcHJlcHJvY2Vzc2luZyBvciByZXN0cmljdGluZyBhY2Nlc3NcbiAqIHRvIGEgY2VydGFpbiBwYXJ0IG9mIHRoZSBmaWxlc3lzdGVtLlxuICpcbiAqIEB0eXBlIHtmaWxlTG9hZGVyfVxuICovXG5cbmV4cG9ydHMuZmlsZUxvYWRlciA9IGZzLnJlYWRGaWxlU3luYztcblxuLyoqXG4gKiBOYW1lIG9mIHRoZSBvYmplY3QgY29udGFpbmluZyB0aGUgbG9jYWxzLlxuICpcbiAqIFRoaXMgdmFyaWFibGUgaXMgb3ZlcnJpZGRlbiBieSB7QGxpbmsgT3B0aW9uc31gLmxvY2Fsc05hbWVgIGlmIGl0IGlzIG5vdFxuICogYHVuZGVmaW5lZGAuXG4gKlxuICogQHR5cGUge1N0cmluZ31cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLmxvY2Fsc05hbWUgPSBfREVGQVVMVF9MT0NBTFNfTkFNRTtcblxuLyoqXG4gKiBQcm9taXNlIGltcGxlbWVudGF0aW9uIC0tIGRlZmF1bHRzIHRvIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24gaWYgYXZhaWxhYmxlXG4gKiBUaGlzIGlzIG1vc3RseSBqdXN0IGZvciB0ZXN0YWJpbGl0eVxuICpcbiAqIEB0eXBlIHtQcm9taXNlQ29uc3RydWN0b3JMaWtlfVxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMucHJvbWlzZUltcGwgPSAobmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpczsnKSkoKS5Qcm9taXNlO1xuXG4vKipcbiAqIEdldCB0aGUgcGF0aCB0byB0aGUgaW5jbHVkZWQgZmlsZSBmcm9tIHRoZSBwYXJlbnQgZmlsZSBwYXRoIGFuZCB0aGVcbiAqIHNwZWNpZmllZCBwYXRoLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSAgbmFtZSAgICAgc3BlY2lmaWVkIHBhdGhcbiAqIEBwYXJhbSB7U3RyaW5nfSAgZmlsZW5hbWUgcGFyZW50IGZpbGUgcGF0aFxuICogQHBhcmFtIHtCb29sZWFufSBbaXNEaXI9ZmFsc2VdIHdoZXRoZXIgdGhlIHBhcmVudCBmaWxlIHBhdGggaXMgYSBkaXJlY3RvcnlcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZXhwb3J0cy5yZXNvbHZlSW5jbHVkZSA9IGZ1bmN0aW9uKG5hbWUsIGZpbGVuYW1lLCBpc0Rpcikge1xuICB2YXIgZGlybmFtZSA9IHBhdGguZGlybmFtZTtcbiAgdmFyIGV4dG5hbWUgPSBwYXRoLmV4dG5hbWU7XG4gIHZhciByZXNvbHZlID0gcGF0aC5yZXNvbHZlO1xuICB2YXIgaW5jbHVkZVBhdGggPSByZXNvbHZlKGlzRGlyID8gZmlsZW5hbWUgOiBkaXJuYW1lKGZpbGVuYW1lKSwgbmFtZSk7XG4gIHZhciBleHQgPSBleHRuYW1lKG5hbWUpO1xuICBpZiAoIWV4dCkge1xuICAgIGluY2x1ZGVQYXRoICs9ICcuZWpzJztcbiAgfVxuICByZXR1cm4gaW5jbHVkZVBhdGg7XG59O1xuXG4vKipcbiAqIFRyeSB0byByZXNvbHZlIGZpbGUgcGF0aCBvbiBtdWx0aXBsZSBkaXJlY3Rvcmllc1xuICpcbiAqIEBwYXJhbSAge1N0cmluZ30gICAgICAgIG5hbWUgIHNwZWNpZmllZCBwYXRoXG4gKiBAcGFyYW0gIHtBcnJheTxTdHJpbmc+fSBwYXRocyBsaXN0IG9mIHBvc3NpYmxlIHBhcmVudCBkaXJlY3RvcnkgcGF0aHNcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqL1xuZnVuY3Rpb24gcmVzb2x2ZVBhdGhzKG5hbWUsIHBhdGhzKSB7XG4gIHZhciBmaWxlUGF0aDtcbiAgaWYgKHBhdGhzLnNvbWUoZnVuY3Rpb24gKHYpIHtcbiAgICBmaWxlUGF0aCA9IGV4cG9ydHMucmVzb2x2ZUluY2x1ZGUobmFtZSwgdiwgdHJ1ZSk7XG4gICAgcmV0dXJuIGZzLmV4aXN0c1N5bmMoZmlsZVBhdGgpO1xuICB9KSkge1xuICAgIHJldHVybiBmaWxlUGF0aDtcbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgcGF0aCB0byB0aGUgaW5jbHVkZWQgZmlsZSBieSBPcHRpb25zXG4gKlxuICogQHBhcmFtICB7U3RyaW5nfSAgcGF0aCAgICBzcGVjaWZpZWQgcGF0aFxuICogQHBhcmFtICB7T3B0aW9uc30gb3B0aW9ucyBjb21waWxhdGlvbiBvcHRpb25zXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldEluY2x1ZGVQYXRoKHBhdGgsIG9wdGlvbnMpIHtcbiAgdmFyIGluY2x1ZGVQYXRoO1xuICB2YXIgZmlsZVBhdGg7XG4gIHZhciB2aWV3cyA9IG9wdGlvbnMudmlld3M7XG4gIHZhciBtYXRjaCA9IC9eW0EtWmEtel0rOlxcXFx8XlxcLy8uZXhlYyhwYXRoKTtcblxuICAvLyBBYnMgcGF0aFxuICBpZiAobWF0Y2ggJiYgbWF0Y2gubGVuZ3RoKSB7XG4gICAgcGF0aCA9IHBhdGgucmVwbGFjZSgvXlxcLyovLCAnJyk7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9ucy5yb290KSkge1xuICAgICAgaW5jbHVkZVBhdGggPSByZXNvbHZlUGF0aHMocGF0aCwgb3B0aW9ucy5yb290KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5jbHVkZVBhdGggPSBleHBvcnRzLnJlc29sdmVJbmNsdWRlKHBhdGgsIG9wdGlvbnMucm9vdCB8fCAnLycsIHRydWUpO1xuICAgIH1cbiAgfVxuICAvLyBSZWxhdGl2ZSBwYXRoc1xuICBlbHNlIHtcbiAgICAvLyBMb29rIHJlbGF0aXZlIHRvIGEgcGFzc2VkIGZpbGVuYW1lIGZpcnN0XG4gICAgaWYgKG9wdGlvbnMuZmlsZW5hbWUpIHtcbiAgICAgIGZpbGVQYXRoID0gZXhwb3J0cy5yZXNvbHZlSW5jbHVkZShwYXRoLCBvcHRpb25zLmZpbGVuYW1lKTtcbiAgICAgIGlmIChmcy5leGlzdHNTeW5jKGZpbGVQYXRoKSkge1xuICAgICAgICBpbmNsdWRlUGF0aCA9IGZpbGVQYXRoO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBUaGVuIGxvb2sgaW4gYW55IHZpZXdzIGRpcmVjdG9yaWVzXG4gICAgaWYgKCFpbmNsdWRlUGF0aCAmJiBBcnJheS5pc0FycmF5KHZpZXdzKSkge1xuICAgICAgaW5jbHVkZVBhdGggPSByZXNvbHZlUGF0aHMocGF0aCwgdmlld3MpO1xuICAgIH1cbiAgICBpZiAoIWluY2x1ZGVQYXRoICYmIHR5cGVvZiBvcHRpb25zLmluY2x1ZGVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIHRoZSBpbmNsdWRlIGZpbGUgXCInICtcbiAgICAgICAgICBvcHRpb25zLmVzY2FwZUZ1bmN0aW9uKHBhdGgpICsgJ1wiJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBpbmNsdWRlUGF0aDtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHRlbXBsYXRlIGZyb20gYSBzdHJpbmcgb3IgYSBmaWxlLCBlaXRoZXIgY29tcGlsZWQgb24tdGhlLWZseSBvclxuICogcmVhZCBmcm9tIGNhY2hlIChpZiBlbmFibGVkKSwgYW5kIGNhY2hlIHRoZSB0ZW1wbGF0ZSBpZiBuZWVkZWQuXG4gKlxuICogSWYgYHRlbXBsYXRlYCBpcyBub3Qgc2V0LCB0aGUgZmlsZSBzcGVjaWZpZWQgaW4gYG9wdGlvbnMuZmlsZW5hbWVgIHdpbGwgYmVcbiAqIHJlYWQuXG4gKlxuICogSWYgYG9wdGlvbnMuY2FjaGVgIGlzIHRydWUsIHRoaXMgZnVuY3Rpb24gcmVhZHMgdGhlIGZpbGUgZnJvbVxuICogYG9wdGlvbnMuZmlsZW5hbWVgIHNvIGl0IG11c3QgYmUgc2V0IHByaW9yIHRvIGNhbGxpbmcgdGhpcyBmdW5jdGlvbi5cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmVqcy1pbnRlcm5hbFxuICogQHBhcmFtIHtPcHRpb25zfSBvcHRpb25zICAgY29tcGlsYXRpb24gb3B0aW9uc1xuICogQHBhcmFtIHtTdHJpbmd9IFt0ZW1wbGF0ZV0gdGVtcGxhdGUgc291cmNlXG4gKiBAcmV0dXJuIHsoVGVtcGxhdGVGdW5jdGlvbnxDbGllbnRGdW5jdGlvbil9XG4gKiBEZXBlbmRpbmcgb24gdGhlIHZhbHVlIG9mIGBvcHRpb25zLmNsaWVudGAsIGVpdGhlciB0eXBlIG1pZ2h0IGJlIHJldHVybmVkLlxuICogQHN0YXRpY1xuICovXG5cbmZ1bmN0aW9uIGhhbmRsZUNhY2hlKG9wdGlvbnMsIHRlbXBsYXRlKSB7XG4gIHZhciBmdW5jO1xuICB2YXIgZmlsZW5hbWUgPSBvcHRpb25zLmZpbGVuYW1lO1xuICB2YXIgaGFzVGVtcGxhdGUgPSBhcmd1bWVudHMubGVuZ3RoID4gMTtcblxuICBpZiAob3B0aW9ucy5jYWNoZSkge1xuICAgIGlmICghZmlsZW5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignY2FjaGUgb3B0aW9uIHJlcXVpcmVzIGEgZmlsZW5hbWUnKTtcbiAgICB9XG4gICAgZnVuYyA9IGV4cG9ydHMuY2FjaGUuZ2V0KGZpbGVuYW1lKTtcbiAgICBpZiAoZnVuYykge1xuICAgICAgcmV0dXJuIGZ1bmM7XG4gICAgfVxuICAgIGlmICghaGFzVGVtcGxhdGUpIHtcbiAgICAgIHRlbXBsYXRlID0gZmlsZUxvYWRlcihmaWxlbmFtZSkudG9TdHJpbmcoKS5yZXBsYWNlKF9CT00sICcnKTtcbiAgICB9XG4gIH1cbiAgZWxzZSBpZiAoIWhhc1RlbXBsYXRlKSB7XG4gICAgLy8gaXN0YW5idWwgaWdub3JlIGlmOiBzaG91bGQgbm90IGhhcHBlbiBhdCBhbGxcbiAgICBpZiAoIWZpbGVuYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludGVybmFsIEVKUyBlcnJvcjogbm8gZmlsZSBuYW1lIG9yIHRlbXBsYXRlICdcbiAgICAgICAgICAgICAgICAgICAgKyAncHJvdmlkZWQnKTtcbiAgICB9XG4gICAgdGVtcGxhdGUgPSBmaWxlTG9hZGVyKGZpbGVuYW1lKS50b1N0cmluZygpLnJlcGxhY2UoX0JPTSwgJycpO1xuICB9XG4gIGZ1bmMgPSBleHBvcnRzLmNvbXBpbGUodGVtcGxhdGUsIG9wdGlvbnMpO1xuICBpZiAob3B0aW9ucy5jYWNoZSkge1xuICAgIGV4cG9ydHMuY2FjaGUuc2V0KGZpbGVuYW1lLCBmdW5jKTtcbiAgfVxuICByZXR1cm4gZnVuYztcbn1cblxuLyoqXG4gKiBUcnkgY2FsbGluZyBoYW5kbGVDYWNoZSB3aXRoIHRoZSBnaXZlbiBvcHRpb25zIGFuZCBkYXRhIGFuZCBjYWxsIHRoZVxuICogY2FsbGJhY2sgd2l0aCB0aGUgcmVzdWx0LiBJZiBhbiBlcnJvciBvY2N1cnMsIGNhbGwgdGhlIGNhbGxiYWNrIHdpdGhcbiAqIHRoZSBlcnJvci4gVXNlZCBieSByZW5kZXJGaWxlKCkuXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTplanMtaW50ZXJuYWxcbiAqIEBwYXJhbSB7T3B0aW9uc30gb3B0aW9ucyAgICBjb21waWxhdGlvbiBvcHRpb25zXG4gKiBAcGFyYW0ge09iamVjdH0gZGF0YSAgICAgICAgdGVtcGxhdGUgZGF0YVxuICogQHBhcmFtIHtSZW5kZXJGaWxlQ2FsbGJhY2t9IGNiIGNhbGxiYWNrXG4gKiBAc3RhdGljXG4gKi9cblxuZnVuY3Rpb24gdHJ5SGFuZGxlQ2FjaGUob3B0aW9ucywgZGF0YSwgY2IpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKCFjYikge1xuICAgIGlmICh0eXBlb2YgZXhwb3J0cy5wcm9taXNlSW1wbCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gbmV3IGV4cG9ydHMucHJvbWlzZUltcGwoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZUNhY2hlKG9wdGlvbnMpKGRhdGEpO1xuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGxlYXNlIHByb3ZpZGUgYSBjYWxsYmFjayBmdW5jdGlvbicpO1xuICAgIH1cbiAgfVxuICBlbHNlIHtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gaGFuZGxlQ2FjaGUob3B0aW9ucykoZGF0YSk7XG4gICAgfVxuICAgIGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiBjYihlcnIpO1xuICAgIH1cblxuICAgIGNiKG51bGwsIHJlc3VsdCk7XG4gIH1cbn1cblxuLyoqXG4gKiBmaWxlTG9hZGVyIGlzIGluZGVwZW5kZW50XG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGZpbGVQYXRoIGVqcyBmaWxlIHBhdGguXG4gKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBjb250ZW50cyBvZiB0aGUgc3BlY2lmaWVkIGZpbGUuXG4gKiBAc3RhdGljXG4gKi9cblxuZnVuY3Rpb24gZmlsZUxvYWRlcihmaWxlUGF0aCl7XG4gIHJldHVybiBleHBvcnRzLmZpbGVMb2FkZXIoZmlsZVBhdGgpO1xufVxuXG4vKipcbiAqIEdldCB0aGUgdGVtcGxhdGUgZnVuY3Rpb24uXG4gKlxuICogSWYgYG9wdGlvbnMuY2FjaGVgIGlzIGB0cnVlYCwgdGhlbiB0aGUgdGVtcGxhdGUgaXMgY2FjaGVkLlxuICpcbiAqIEBtZW1iZXJvZiBtb2R1bGU6ZWpzLWludGVybmFsXG4gKiBAcGFyYW0ge1N0cmluZ30gIHBhdGggICAgcGF0aCBmb3IgdGhlIHNwZWNpZmllZCBmaWxlXG4gKiBAcGFyYW0ge09wdGlvbnN9IG9wdGlvbnMgY29tcGlsYXRpb24gb3B0aW9uc1xuICogQHJldHVybiB7KFRlbXBsYXRlRnVuY3Rpb258Q2xpZW50RnVuY3Rpb24pfVxuICogRGVwZW5kaW5nIG9uIHRoZSB2YWx1ZSBvZiBgb3B0aW9ucy5jbGllbnRgLCBlaXRoZXIgdHlwZSBtaWdodCBiZSByZXR1cm5lZFxuICogQHN0YXRpY1xuICovXG5cbmZ1bmN0aW9uIGluY2x1ZGVGaWxlKHBhdGgsIG9wdGlvbnMpIHtcbiAgdmFyIG9wdHMgPSB1dGlscy5zaGFsbG93Q29weSh7fSwgb3B0aW9ucyk7XG4gIG9wdHMuZmlsZW5hbWUgPSBnZXRJbmNsdWRlUGF0aChwYXRoLCBvcHRzKTtcbiAgaWYgKHR5cGVvZiBvcHRpb25zLmluY2x1ZGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIGluY2x1ZGVyUmVzdWx0ID0gb3B0aW9ucy5pbmNsdWRlcihwYXRoLCBvcHRzLmZpbGVuYW1lKTtcbiAgICBpZiAoaW5jbHVkZXJSZXN1bHQpIHtcbiAgICAgIGlmIChpbmNsdWRlclJlc3VsdC5maWxlbmFtZSkge1xuICAgICAgICBvcHRzLmZpbGVuYW1lID0gaW5jbHVkZXJSZXN1bHQuZmlsZW5hbWU7XG4gICAgICB9XG4gICAgICBpZiAoaW5jbHVkZXJSZXN1bHQudGVtcGxhdGUpIHtcbiAgICAgICAgcmV0dXJuIGhhbmRsZUNhY2hlKG9wdHMsIGluY2x1ZGVyUmVzdWx0LnRlbXBsYXRlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGhhbmRsZUNhY2hlKG9wdHMpO1xufVxuXG4vKipcbiAqIFJlLXRocm93IHRoZSBnaXZlbiBgZXJyYCBpbiBjb250ZXh0IHRvIHRoZSBgc3RyYCBvZiBlanMsIGBmaWxlbmFtZWAsIGFuZFxuICogYGxpbmVub2AuXG4gKlxuICogQGltcGxlbWVudHMge1JldGhyb3dDYWxsYmFja31cbiAqIEBtZW1iZXJvZiBtb2R1bGU6ZWpzLWludGVybmFsXG4gKiBAcGFyYW0ge0Vycm9yfSAgZXJyICAgICAgRXJyb3Igb2JqZWN0XG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyICAgICAgRUpTIHNvdXJjZVxuICogQHBhcmFtIHtTdHJpbmd9IGZsbm0gICAgIGZpbGUgbmFtZSBvZiB0aGUgRUpTIGZpbGVcbiAqIEBwYXJhbSB7TnVtYmVyfSBsaW5lbm8gICBsaW5lIG51bWJlciBvZiB0aGUgZXJyb3JcbiAqIEBwYXJhbSB7RXNjYXBlQ2FsbGJhY2t9IGVzY1xuICogQHN0YXRpY1xuICovXG5cbmZ1bmN0aW9uIHJldGhyb3coZXJyLCBzdHIsIGZsbm0sIGxpbmVubywgZXNjKSB7XG4gIHZhciBsaW5lcyA9IHN0ci5zcGxpdCgnXFxuJyk7XG4gIHZhciBzdGFydCA9IE1hdGgubWF4KGxpbmVubyAtIDMsIDApO1xuICB2YXIgZW5kID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBsaW5lbm8gKyAzKTtcbiAgdmFyIGZpbGVuYW1lID0gZXNjKGZsbm0pO1xuICAvLyBFcnJvciBjb250ZXh0XG4gIHZhciBjb250ZXh0ID0gbGluZXMuc2xpY2Uoc3RhcnQsIGVuZCkubWFwKGZ1bmN0aW9uIChsaW5lLCBpKXtcbiAgICB2YXIgY3VyciA9IGkgKyBzdGFydCArIDE7XG4gICAgcmV0dXJuIChjdXJyID09IGxpbmVubyA/ICcgPj4gJyA6ICcgICAgJylcbiAgICAgICsgY3VyclxuICAgICAgKyAnfCAnXG4gICAgICArIGxpbmU7XG4gIH0pLmpvaW4oJ1xcbicpO1xuXG4gIC8vIEFsdGVyIGV4Y2VwdGlvbiBtZXNzYWdlXG4gIGVyci5wYXRoID0gZmlsZW5hbWU7XG4gIGVyci5tZXNzYWdlID0gKGZpbGVuYW1lIHx8ICdlanMnKSArICc6J1xuICAgICsgbGluZW5vICsgJ1xcbidcbiAgICArIGNvbnRleHQgKyAnXFxuXFxuJ1xuICAgICsgZXJyLm1lc3NhZ2U7XG5cbiAgdGhyb3cgZXJyO1xufVxuXG5mdW5jdGlvbiBzdHJpcFNlbWkoc3RyKXtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC87KFxccyokKS8sICckMScpO1xufVxuXG4vKipcbiAqIENvbXBpbGUgdGhlIGdpdmVuIGBzdHJgIG9mIGVqcyBpbnRvIGEgdGVtcGxhdGUgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9ICB0ZW1wbGF0ZSBFSlMgdGVtcGxhdGVcbiAqXG4gKiBAcGFyYW0ge09wdGlvbnN9IFtvcHRzXSBjb21waWxhdGlvbiBvcHRpb25zXG4gKlxuICogQHJldHVybiB7KFRlbXBsYXRlRnVuY3Rpb258Q2xpZW50RnVuY3Rpb24pfVxuICogRGVwZW5kaW5nIG9uIHRoZSB2YWx1ZSBvZiBgb3B0cy5jbGllbnRgLCBlaXRoZXIgdHlwZSBtaWdodCBiZSByZXR1cm5lZC5cbiAqIE5vdGUgdGhhdCB0aGUgcmV0dXJuIHR5cGUgb2YgdGhlIGZ1bmN0aW9uIGFsc28gZGVwZW5kcyBvbiB0aGUgdmFsdWUgb2YgYG9wdHMuYXN5bmNgLlxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMuY29tcGlsZSA9IGZ1bmN0aW9uIGNvbXBpbGUodGVtcGxhdGUsIG9wdHMpIHtcbiAgdmFyIHRlbXBsO1xuXG4gIC8vIHYxIGNvbXBhdFxuICAvLyAnc2NvcGUnIGlzICdjb250ZXh0J1xuICAvLyBGSVhNRTogUmVtb3ZlIHRoaXMgaW4gYSBmdXR1cmUgdmVyc2lvblxuICBpZiAob3B0cyAmJiBvcHRzLnNjb3BlKSB7XG4gICAgaWYgKCFzY29wZU9wdGlvbldhcm5lZCl7XG4gICAgICBjb25zb2xlLndhcm4oJ2BzY29wZWAgb3B0aW9uIGlzIGRlcHJlY2F0ZWQgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBFSlMgMycpO1xuICAgICAgc2NvcGVPcHRpb25XYXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIW9wdHMuY29udGV4dCkge1xuICAgICAgb3B0cy5jb250ZXh0ID0gb3B0cy5zY29wZTtcbiAgICB9XG4gICAgZGVsZXRlIG9wdHMuc2NvcGU7XG4gIH1cbiAgdGVtcGwgPSBuZXcgVGVtcGxhdGUodGVtcGxhdGUsIG9wdHMpO1xuICByZXR1cm4gdGVtcGwuY29tcGlsZSgpO1xufTtcblxuLyoqXG4gKiBSZW5kZXIgdGhlIGdpdmVuIGB0ZW1wbGF0ZWAgb2YgZWpzLlxuICpcbiAqIElmIHlvdSB3b3VsZCBsaWtlIHRvIGluY2x1ZGUgb3B0aW9ucyBidXQgbm90IGRhdGEsIHlvdSBuZWVkIHRvIGV4cGxpY2l0bHlcbiAqIGNhbGwgdGhpcyBmdW5jdGlvbiB3aXRoIGBkYXRhYCBiZWluZyBhbiBlbXB0eSBvYmplY3Qgb3IgYG51bGxgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSAgIHRlbXBsYXRlIEVKUyB0ZW1wbGF0ZVxuICogQHBhcmFtIHtPYmplY3R9ICBbZGF0YT17fV0gdGVtcGxhdGUgZGF0YVxuICogQHBhcmFtIHtPcHRpb25zfSBbb3B0cz17fV0gY29tcGlsYXRpb24gYW5kIHJlbmRlcmluZyBvcHRpb25zXG4gKiBAcmV0dXJuIHsoU3RyaW5nfFByb21pc2U8U3RyaW5nPil9XG4gKiBSZXR1cm4gdmFsdWUgdHlwZSBkZXBlbmRzIG9uIGBvcHRzLmFzeW5jYC5cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnJlbmRlciA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgZCwgbykge1xuICB2YXIgZGF0YSA9IGQgfHwge307XG4gIHZhciBvcHRzID0gbyB8fCB7fTtcblxuICAvLyBObyBvcHRpb25zIG9iamVjdCAtLSBpZiB0aGVyZSBhcmUgb3B0aW9ueSBuYW1lc1xuICAvLyBpbiB0aGUgZGF0YSwgY29weSB0aGVtIHRvIG9wdGlvbnNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT0gMikge1xuICAgIHV0aWxzLnNoYWxsb3dDb3B5RnJvbUxpc3Qob3B0cywgZGF0YSwgX09QVFNfUEFTU0FCTEVfV0lUSF9EQVRBKTtcbiAgfVxuXG4gIHJldHVybiBoYW5kbGVDYWNoZShvcHRzLCB0ZW1wbGF0ZSkoZGF0YSk7XG59O1xuXG4vKipcbiAqIFJlbmRlciBhbiBFSlMgZmlsZSBhdCB0aGUgZ2l2ZW4gYHBhdGhgIGFuZCBjYWxsYmFjayBgY2IoZXJyLCBzdHIpYC5cbiAqXG4gKiBJZiB5b3Ugd291bGQgbGlrZSB0byBpbmNsdWRlIG9wdGlvbnMgYnV0IG5vdCBkYXRhLCB5b3UgbmVlZCB0byBleHBsaWNpdGx5XG4gKiBjYWxsIHRoaXMgZnVuY3Rpb24gd2l0aCBgZGF0YWAgYmVpbmcgYW4gZW1wdHkgb2JqZWN0IG9yIGBudWxsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gICAgICAgICAgICAgcGF0aCAgICAgcGF0aCB0byB0aGUgRUpTIGZpbGVcbiAqIEBwYXJhbSB7T2JqZWN0fSAgICAgICAgICAgIFtkYXRhPXt9XSB0ZW1wbGF0ZSBkYXRhXG4gKiBAcGFyYW0ge09wdGlvbnN9ICAgICAgICAgICBbb3B0cz17fV0gY29tcGlsYXRpb24gYW5kIHJlbmRlcmluZyBvcHRpb25zXG4gKiBAcGFyYW0ge1JlbmRlckZpbGVDYWxsYmFja30gY2IgY2FsbGJhY2tcbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLnJlbmRlckZpbGUgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgdmFyIGZpbGVuYW1lID0gYXJncy5zaGlmdCgpO1xuICB2YXIgY2I7XG4gIHZhciBvcHRzID0ge2ZpbGVuYW1lOiBmaWxlbmFtZX07XG4gIHZhciBkYXRhO1xuICB2YXIgdmlld09wdHM7XG5cbiAgLy8gRG8gd2UgaGF2ZSBhIGNhbGxiYWNrP1xuICBpZiAodHlwZW9mIGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV0gPT0gJ2Z1bmN0aW9uJykge1xuICAgIGNiID0gYXJncy5wb3AoKTtcbiAgfVxuICAvLyBEbyB3ZSBoYXZlIGRhdGEvb3B0cz9cbiAgaWYgKGFyZ3MubGVuZ3RoKSB7XG4gICAgLy8gU2hvdWxkIGFsd2F5cyBoYXZlIGRhdGEgb2JqXG4gICAgZGF0YSA9IGFyZ3Muc2hpZnQoKTtcbiAgICAvLyBOb3JtYWwgcGFzc2VkIG9wdHMgKGRhdGEgb2JqICsgb3B0cyBvYmopXG4gICAgaWYgKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAvLyBVc2Ugc2hhbGxvd0NvcHkgc28gd2UgZG9uJ3QgcG9sbHV0ZSBwYXNzZWQgaW4gb3B0cyBvYmogd2l0aCBuZXcgdmFsc1xuICAgICAgdXRpbHMuc2hhbGxvd0NvcHkob3B0cywgYXJncy5wb3AoKSk7XG4gICAgfVxuICAgIC8vIFNwZWNpYWwgY2FzaW5nIGZvciBFeHByZXNzIChzZXR0aW5ncyArIG9wdHMtaW4tZGF0YSlcbiAgICBlbHNlIHtcbiAgICAgIC8vIEV4cHJlc3MgMyBhbmQgNFxuICAgICAgaWYgKGRhdGEuc2V0dGluZ3MpIHtcbiAgICAgICAgLy8gUHVsbCBhIGZldyB0aGluZ3MgZnJvbSBrbm93biBsb2NhdGlvbnNcbiAgICAgICAgaWYgKGRhdGEuc2V0dGluZ3Mudmlld3MpIHtcbiAgICAgICAgICBvcHRzLnZpZXdzID0gZGF0YS5zZXR0aW5ncy52aWV3cztcbiAgICAgICAgfVxuICAgICAgICBpZiAoZGF0YS5zZXR0aW5nc1sndmlldyBjYWNoZSddKSB7XG4gICAgICAgICAgb3B0cy5jYWNoZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gVW5kb2N1bWVudGVkIGFmdGVyIEV4cHJlc3MgMiwgYnV0IHN0aWxsIHVzYWJsZSwgZXNwLiBmb3JcbiAgICAgICAgLy8gaXRlbXMgdGhhdCBhcmUgdW5zYWZlIHRvIGJlIHBhc3NlZCBhbG9uZyB3aXRoIGRhdGEsIGxpa2UgYHJvb3RgXG4gICAgICAgIHZpZXdPcHRzID0gZGF0YS5zZXR0aW5nc1sndmlldyBvcHRpb25zJ107XG4gICAgICAgIGlmICh2aWV3T3B0cykge1xuICAgICAgICAgIHV0aWxzLnNoYWxsb3dDb3B5KG9wdHMsIHZpZXdPcHRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gRXhwcmVzcyAyIGFuZCBsb3dlciwgdmFsdWVzIHNldCBpbiBhcHAubG9jYWxzLCBvciBwZW9wbGUgd2hvIGp1c3RcbiAgICAgIC8vIHdhbnQgdG8gcGFzcyBvcHRpb25zIGluIHRoZWlyIGRhdGEuIE5PVEU6IFRoZXNlIHZhbHVlcyB3aWxsIG92ZXJyaWRlXG4gICAgICAvLyBhbnl0aGluZyBwcmV2aW91c2x5IHNldCBpbiBzZXR0aW5ncyAgb3Igc2V0dGluZ3NbJ3ZpZXcgb3B0aW9ucyddXG4gICAgICB1dGlscy5zaGFsbG93Q29weUZyb21MaXN0KG9wdHMsIGRhdGEsIF9PUFRTX1BBU1NBQkxFX1dJVEhfREFUQV9FWFBSRVNTKTtcbiAgICB9XG4gICAgb3B0cy5maWxlbmFtZSA9IGZpbGVuYW1lO1xuICB9XG4gIGVsc2Uge1xuICAgIGRhdGEgPSB7fTtcbiAgfVxuXG4gIHJldHVybiB0cnlIYW5kbGVDYWNoZShvcHRzLCBkYXRhLCBjYik7XG59O1xuXG4vKipcbiAqIENsZWFyIGludGVybWVkaWF0ZSBKYXZhU2NyaXB0IGNhY2hlLiBDYWxscyB7QGxpbmsgQ2FjaGUjcmVzZXR9LlxuICogQHB1YmxpY1xuICovXG5cbi8qKlxuICogRUpTIHRlbXBsYXRlIGNsYXNzXG4gKiBAcHVibGljXG4gKi9cbmV4cG9ydHMuVGVtcGxhdGUgPSBUZW1wbGF0ZTtcblxuZXhwb3J0cy5jbGVhckNhY2hlID0gZnVuY3Rpb24gKCkge1xuICBleHBvcnRzLmNhY2hlLnJlc2V0KCk7XG59O1xuXG5mdW5jdGlvbiBUZW1wbGF0ZSh0ZXh0LCBvcHRzKSB7XG4gIG9wdHMgPSBvcHRzIHx8IHt9O1xuICB2YXIgb3B0aW9ucyA9IHt9O1xuICB0aGlzLnRlbXBsYXRlVGV4dCA9IHRleHQ7XG4gIC8qKiBAdHlwZSB7c3RyaW5nIHwgbnVsbH0gKi9cbiAgdGhpcy5tb2RlID0gbnVsbDtcbiAgdGhpcy50cnVuY2F0ZSA9IGZhbHNlO1xuICB0aGlzLmN1cnJlbnRMaW5lID0gMTtcbiAgdGhpcy5zb3VyY2UgPSAnJztcbiAgb3B0aW9ucy5jbGllbnQgPSBvcHRzLmNsaWVudCB8fCBmYWxzZTtcbiAgb3B0aW9ucy5lc2NhcGVGdW5jdGlvbiA9IG9wdHMuZXNjYXBlIHx8IG9wdHMuZXNjYXBlRnVuY3Rpb24gfHwgdXRpbHMuZXNjYXBlWE1MO1xuICBvcHRpb25zLmNvbXBpbGVEZWJ1ZyA9IG9wdHMuY29tcGlsZURlYnVnICE9PSBmYWxzZTtcbiAgb3B0aW9ucy5kZWJ1ZyA9ICEhb3B0cy5kZWJ1ZztcbiAgb3B0aW9ucy5maWxlbmFtZSA9IG9wdHMuZmlsZW5hbWU7XG4gIG9wdGlvbnMub3BlbkRlbGltaXRlciA9IG9wdHMub3BlbkRlbGltaXRlciB8fCBleHBvcnRzLm9wZW5EZWxpbWl0ZXIgfHwgX0RFRkFVTFRfT1BFTl9ERUxJTUlURVI7XG4gIG9wdGlvbnMuY2xvc2VEZWxpbWl0ZXIgPSBvcHRzLmNsb3NlRGVsaW1pdGVyIHx8IGV4cG9ydHMuY2xvc2VEZWxpbWl0ZXIgfHwgX0RFRkFVTFRfQ0xPU0VfREVMSU1JVEVSO1xuICBvcHRpb25zLmRlbGltaXRlciA9IG9wdHMuZGVsaW1pdGVyIHx8IGV4cG9ydHMuZGVsaW1pdGVyIHx8IF9ERUZBVUxUX0RFTElNSVRFUjtcbiAgb3B0aW9ucy5zdHJpY3QgPSBvcHRzLnN0cmljdCB8fCBmYWxzZTtcbiAgb3B0aW9ucy5jb250ZXh0ID0gb3B0cy5jb250ZXh0O1xuICBvcHRpb25zLmNhY2hlID0gb3B0cy5jYWNoZSB8fCBmYWxzZTtcbiAgb3B0aW9ucy5ybVdoaXRlc3BhY2UgPSBvcHRzLnJtV2hpdGVzcGFjZTtcbiAgb3B0aW9ucy5yb290ID0gb3B0cy5yb290O1xuICBvcHRpb25zLmluY2x1ZGVyID0gb3B0cy5pbmNsdWRlcjtcbiAgb3B0aW9ucy5vdXRwdXRGdW5jdGlvbk5hbWUgPSBvcHRzLm91dHB1dEZ1bmN0aW9uTmFtZTtcbiAgb3B0aW9ucy5sb2NhbHNOYW1lID0gb3B0cy5sb2NhbHNOYW1lIHx8IGV4cG9ydHMubG9jYWxzTmFtZSB8fCBfREVGQVVMVF9MT0NBTFNfTkFNRTtcbiAgb3B0aW9ucy52aWV3cyA9IG9wdHMudmlld3M7XG4gIG9wdGlvbnMuYXN5bmMgPSBvcHRzLmFzeW5jO1xuICBvcHRpb25zLmRlc3RydWN0dXJlZExvY2FscyA9IG9wdHMuZGVzdHJ1Y3R1cmVkTG9jYWxzO1xuICBvcHRpb25zLmxlZ2FjeUluY2x1ZGUgPSB0eXBlb2Ygb3B0cy5sZWdhY3lJbmNsdWRlICE9ICd1bmRlZmluZWQnID8gISFvcHRzLmxlZ2FjeUluY2x1ZGUgOiB0cnVlO1xuXG4gIGlmIChvcHRpb25zLnN0cmljdCkge1xuICAgIG9wdGlvbnMuX3dpdGggPSBmYWxzZTtcbiAgfVxuICBlbHNlIHtcbiAgICBvcHRpb25zLl93aXRoID0gdHlwZW9mIG9wdHMuX3dpdGggIT0gJ3VuZGVmaW5lZCcgPyBvcHRzLl93aXRoIDogdHJ1ZTtcbiAgfVxuXG4gIHRoaXMub3B0cyA9IG9wdGlvbnM7XG5cbiAgdGhpcy5yZWdleCA9IHRoaXMuY3JlYXRlUmVnZXgoKTtcbn1cblxuVGVtcGxhdGUubW9kZXMgPSB7XG4gIEVWQUw6ICdldmFsJyxcbiAgRVNDQVBFRDogJ2VzY2FwZWQnLFxuICBSQVc6ICdyYXcnLFxuICBDT01NRU5UOiAnY29tbWVudCcsXG4gIExJVEVSQUw6ICdsaXRlcmFsJ1xufTtcblxuVGVtcGxhdGUucHJvdG90eXBlID0ge1xuICBjcmVhdGVSZWdleDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdHIgPSBfUkVHRVhfU1RSSU5HO1xuICAgIHZhciBkZWxpbSA9IHV0aWxzLmVzY2FwZVJlZ0V4cENoYXJzKHRoaXMub3B0cy5kZWxpbWl0ZXIpO1xuICAgIHZhciBvcGVuID0gdXRpbHMuZXNjYXBlUmVnRXhwQ2hhcnModGhpcy5vcHRzLm9wZW5EZWxpbWl0ZXIpO1xuICAgIHZhciBjbG9zZSA9IHV0aWxzLmVzY2FwZVJlZ0V4cENoYXJzKHRoaXMub3B0cy5jbG9zZURlbGltaXRlcik7XG4gICAgc3RyID0gc3RyLnJlcGxhY2UoLyUvZywgZGVsaW0pXG4gICAgICAucmVwbGFjZSgvPC9nLCBvcGVuKVxuICAgICAgLnJlcGxhY2UoLz4vZywgY2xvc2UpO1xuICAgIHJldHVybiBuZXcgUmVnRXhwKHN0cik7XG4gIH0sXG5cbiAgY29tcGlsZTogZnVuY3Rpb24gKCkge1xuICAgIC8qKiBAdHlwZSB7c3RyaW5nfSAqL1xuICAgIHZhciBzcmM7XG4gICAgLyoqIEB0eXBlIHtDbGllbnRGdW5jdGlvbn0gKi9cbiAgICB2YXIgZm47XG4gICAgdmFyIG9wdHMgPSB0aGlzLm9wdHM7XG4gICAgdmFyIHByZXBlbmRlZCA9ICcnO1xuICAgIHZhciBhcHBlbmRlZCA9ICcnO1xuICAgIC8qKiBAdHlwZSB7RXNjYXBlQ2FsbGJhY2t9ICovXG4gICAgdmFyIGVzY2FwZUZuID0gb3B0cy5lc2NhcGVGdW5jdGlvbjtcbiAgICAvKiogQHR5cGUge0Z1bmN0aW9uQ29uc3RydWN0b3J9ICovXG4gICAgdmFyIGN0b3I7XG4gICAgLyoqIEB0eXBlIHtzdHJpbmd9ICovXG4gICAgdmFyIHNhbml0aXplZEZpbGVuYW1lID0gb3B0cy5maWxlbmFtZSA/IEpTT04uc3RyaW5naWZ5KG9wdHMuZmlsZW5hbWUpIDogJ3VuZGVmaW5lZCc7XG5cbiAgICBpZiAoIXRoaXMuc291cmNlKSB7XG4gICAgICB0aGlzLmdlbmVyYXRlU291cmNlKCk7XG4gICAgICBwcmVwZW5kZWQgKz1cbiAgICAgICAgJyAgdmFyIF9fb3V0cHV0ID0gXCJcIjtcXG4nICtcbiAgICAgICAgJyAgZnVuY3Rpb24gX19hcHBlbmQocykgeyBpZiAocyAhPT0gdW5kZWZpbmVkICYmIHMgIT09IG51bGwpIF9fb3V0cHV0ICs9IHMgfVxcbic7XG4gICAgICBpZiAob3B0cy5vdXRwdXRGdW5jdGlvbk5hbWUpIHtcbiAgICAgICAgcHJlcGVuZGVkICs9ICcgIHZhciAnICsgb3B0cy5vdXRwdXRGdW5jdGlvbk5hbWUgKyAnID0gX19hcHBlbmQ7JyArICdcXG4nO1xuICAgICAgfVxuICAgICAgaWYgKG9wdHMuZGVzdHJ1Y3R1cmVkTG9jYWxzICYmIG9wdHMuZGVzdHJ1Y3R1cmVkTG9jYWxzLmxlbmd0aCkge1xuICAgICAgICB2YXIgZGVzdHJ1Y3R1cmluZyA9ICcgIHZhciBfX2xvY2FscyA9ICgnICsgb3B0cy5sb2NhbHNOYW1lICsgJyB8fCB7fSksXFxuJztcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvcHRzLmRlc3RydWN0dXJlZExvY2Fscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciBuYW1lID0gb3B0cy5kZXN0cnVjdHVyZWRMb2NhbHNbaV07XG4gICAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgICBkZXN0cnVjdHVyaW5nICs9ICcsXFxuICAnO1xuICAgICAgICAgIH1cbiAgICAgICAgICBkZXN0cnVjdHVyaW5nICs9IG5hbWUgKyAnID0gX19sb2NhbHMuJyArIG5hbWU7XG4gICAgICAgIH1cbiAgICAgICAgcHJlcGVuZGVkICs9IGRlc3RydWN0dXJpbmcgKyAnO1xcbic7XG4gICAgICB9XG4gICAgICBpZiAob3B0cy5fd2l0aCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcHJlcGVuZGVkICs9ICcgIEZ1bmN0aW9uLmFwcGx5KG51bGwsIFtcIl9fYXBwZW5kXCIsIFwiZXNjYXBlRm5cIl0uY29uY2F0KE9iamVjdC5rZXlzKCcgKyBvcHRzLmxvY2Fsc05hbWUgKyAnIHx8IHt9KSwgW1xcbic7XG4gICAgICAgIGFwcGVuZGVkICs9ICddKSkuYXBwbHkobnVsbCwgW19fYXBwZW5kLCBlc2NhcGVGbl0uY29uY2F0KE9iamVjdC52YWx1ZXMoJyArIG9wdHMubG9jYWxzTmFtZSArICcgfHwge30pKSk7XFxuJztcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBKU09OLnN0cmluZ2lmeSh0aGlzLnNvdXJjZSk7XG4gICAgICB9XG4gICAgICBhcHBlbmRlZCArPSAnICByZXR1cm4gX19vdXRwdXQ7JyArICdcXG4nO1xuICAgICAgdGhpcy5zb3VyY2UgPSBwcmVwZW5kZWQgKyB0aGlzLnNvdXJjZSArIGFwcGVuZGVkO1xuICAgIH1cblxuICAgIGlmIChvcHRzLmNvbXBpbGVEZWJ1Zykge1xuICAgICAgc3JjID0gJ3ZhciBfX2xpbmUgPSAxJyArICdcXG4nXG4gICAgICAgICsgJyAgLCBfX2xpbmVzID0gJyArIEpTT04uc3RyaW5naWZ5KHRoaXMudGVtcGxhdGVUZXh0KSArICdcXG4nXG4gICAgICAgICsgJyAgLCBfX2ZpbGVuYW1lID0gJyArIHNhbml0aXplZEZpbGVuYW1lICsgJzsnICsgJ1xcbidcbiAgICAgICAgKyAndHJ5IHsnICsgJ1xcbidcbiAgICAgICAgKyB0aGlzLnNvdXJjZVxuICAgICAgICArICd9IGNhdGNoIChlKSB7JyArICdcXG4nXG4gICAgICAgICsgJyAgcmV0aHJvdyhlLCBfX2xpbmVzLCBfX2ZpbGVuYW1lLCBfX2xpbmUsIGVzY2FwZUZuKTsnICsgJ1xcbidcbiAgICAgICAgKyAnfScgKyAnXFxuJztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBzcmMgPSB0aGlzLnNvdXJjZTtcbiAgICB9XG5cbiAgICBpZiAob3B0cy5jbGllbnQpIHtcbiAgICAgIHNyYyA9ICdlc2NhcGVGbiA9IGVzY2FwZUZuIHx8ICcgKyBlc2NhcGVGbi50b1N0cmluZygpICsgJzsnICsgJ1xcbicgKyBzcmM7XG4gICAgICBpZiAob3B0cy5jb21waWxlRGVidWcpIHtcbiAgICAgICAgc3JjID0gJ3JldGhyb3cgPSByZXRocm93IHx8ICcgKyByZXRocm93LnRvU3RyaW5nKCkgKyAnOycgKyAnXFxuJyArIHNyYztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAob3B0cy5zdHJpY3QpIHtcbiAgICAgIHNyYyA9ICdcInVzZSBzdHJpY3RcIjtcXG4nICsgc3JjO1xuICAgIH1cbiAgICBpZiAob3B0cy5kZWJ1Zykge1xuICAgICAgY29uc29sZS5sb2coc3JjKTtcbiAgICB9XG4gICAgaWYgKG9wdHMuY29tcGlsZURlYnVnICYmIG9wdHMuZmlsZW5hbWUpIHtcbiAgICAgIHNyYyA9IHNyYyArICdcXG4nXG4gICAgICAgICsgJy8vIyBzb3VyY2VVUkw9JyArIHNhbml0aXplZEZpbGVuYW1lICsgJ1xcbic7XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIGlmIChvcHRzLmFzeW5jKSB7XG4gICAgICAgIC8vIEhhdmUgdG8gdXNlIGdlbmVyYXRlZCBmdW5jdGlvbiBmb3IgdGhpcywgc2luY2UgaW4gZW52cyB3aXRob3V0IHN1cHBvcnQsXG4gICAgICAgIC8vIGl0IGJyZWFrcyBpbiBwYXJzaW5nXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgY3RvciA9IChuZXcgRnVuY3Rpb24oJ3JldHVybiAoYXN5bmMgZnVuY3Rpb24oKXt9KS5jb25zdHJ1Y3RvcjsnKSkoKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaChlKSB7XG4gICAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBTeW50YXhFcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGlzIGVudmlyb25tZW50IGRvZXMgbm90IHN1cHBvcnQgYXN5bmMvYXdhaXQnKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGN0b3IgPSBGdW5jdGlvbjtcbiAgICAgIH1cbiAgICAgIGZuID0gbmV3IGN0b3Iob3B0cy5sb2NhbHNOYW1lICsgJywgZXNjYXBlRm4sIGluY2x1ZGUsIHJldGhyb3cnLCBzcmMpO1xuICAgIH1cbiAgICBjYXRjaChlKSB7XG4gICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgZWxzZVxuICAgICAgaWYgKGUgaW5zdGFuY2VvZiBTeW50YXhFcnJvcikge1xuICAgICAgICBpZiAob3B0cy5maWxlbmFtZSkge1xuICAgICAgICAgIGUubWVzc2FnZSArPSAnIGluICcgKyBvcHRzLmZpbGVuYW1lO1xuICAgICAgICB9XG4gICAgICAgIGUubWVzc2FnZSArPSAnIHdoaWxlIGNvbXBpbGluZyBlanNcXG5cXG4nO1xuICAgICAgICBlLm1lc3NhZ2UgKz0gJ0lmIHRoZSBhYm92ZSBlcnJvciBpcyBub3QgaGVscGZ1bCwgeW91IG1heSB3YW50IHRvIHRyeSBFSlMtTGludDpcXG4nO1xuICAgICAgICBlLm1lc3NhZ2UgKz0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9SeWFuWmltL0VKUy1MaW50JztcbiAgICAgICAgaWYgKCFvcHRzLmFzeW5jKSB7XG4gICAgICAgICAgZS5tZXNzYWdlICs9ICdcXG4nO1xuICAgICAgICAgIGUubWVzc2FnZSArPSAnT3IsIGlmIHlvdSBtZWFudCB0byBjcmVhdGUgYW4gYXN5bmMgZnVuY3Rpb24sIHBhc3MgYGFzeW5jOiB0cnVlYCBhcyBhbiBvcHRpb24uJztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgZTtcbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYSBjYWxsYWJsZSBmdW5jdGlvbiB3aGljaCB3aWxsIGV4ZWN1dGUgdGhlIGZ1bmN0aW9uXG4gICAgLy8gY3JlYXRlZCBieSB0aGUgc291cmNlLWNvZGUsIHdpdGggdGhlIHBhc3NlZCBkYXRhIGFzIGxvY2Fsc1xuICAgIC8vIEFkZHMgYSBsb2NhbCBgaW5jbHVkZWAgZnVuY3Rpb24gd2hpY2ggYWxsb3dzIGZ1bGwgcmVjdXJzaXZlIGluY2x1ZGVcbiAgICB2YXIgcmV0dXJuZWRGbiA9IG9wdHMuY2xpZW50ID8gZm4gOiBmdW5jdGlvbiBhbm9ueW1vdXMoZGF0YSkge1xuICAgICAgdmFyIGluY2x1ZGUgPSBmdW5jdGlvbiAocGF0aCwgaW5jbHVkZURhdGEpIHtcbiAgICAgICAgdmFyIGQgPSB1dGlscy5zaGFsbG93Q29weSh7fSwgZGF0YSk7XG4gICAgICAgIGlmIChpbmNsdWRlRGF0YSkge1xuICAgICAgICAgIGQgPSB1dGlscy5zaGFsbG93Q29weShkLCBpbmNsdWRlRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluY2x1ZGVGaWxlKHBhdGgsIG9wdHMpKGQpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBmbi5hcHBseShvcHRzLmNvbnRleHQsIFtkYXRhIHx8IHt9LCBlc2NhcGVGbiwgaW5jbHVkZSwgcmV0aHJvd10pO1xuICAgIH07XG4gICAgaWYgKG9wdHMuZmlsZW5hbWUgJiYgdHlwZW9mIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdmFyIGZpbGVuYW1lID0gb3B0cy5maWxlbmFtZTtcbiAgICAgIHZhciBiYXNlbmFtZSA9IHBhdGguYmFzZW5hbWUoZmlsZW5hbWUsIHBhdGguZXh0bmFtZShmaWxlbmFtZSkpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJldHVybmVkRm4sICduYW1lJywge1xuICAgICAgICAgIHZhbHVlOiBiYXNlbmFtZSxcbiAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgICAgfSBjYXRjaCAoZSkgey8qIGlnbm9yZSAqL31cbiAgICB9XG4gICAgcmV0dXJuIHJldHVybmVkRm47XG4gIH0sXG5cbiAgZ2VuZXJhdGVTb3VyY2U6IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgb3B0cyA9IHRoaXMub3B0cztcblxuICAgIGlmIChvcHRzLnJtV2hpdGVzcGFjZSkge1xuICAgICAgLy8gSGF2ZSB0byB1c2UgdHdvIHNlcGFyYXRlIHJlcGxhY2UgaGVyZSBhcyBgXmAgYW5kIGAkYCBvcGVyYXRvcnMgZG9uJ3RcbiAgICAgIC8vIHdvcmsgd2VsbCB3aXRoIGBcXHJgIGFuZCBlbXB0eSBsaW5lcyBkb24ndCB3b3JrIHdlbGwgd2l0aCB0aGUgYG1gIGZsYWcuXG4gICAgICB0aGlzLnRlbXBsYXRlVGV4dCA9XG4gICAgICAgIHRoaXMudGVtcGxhdGVUZXh0LnJlcGxhY2UoL1tcXHJcXG5dKy9nLCAnXFxuJykucmVwbGFjZSgvXlxccyt8XFxzKyQvZ20sICcnKTtcbiAgICB9XG5cbiAgICAvLyBTbHVycCBzcGFjZXMgYW5kIHRhYnMgYmVmb3JlIDwlXyBhbmQgYWZ0ZXIgXyU+XG4gICAgdGhpcy50ZW1wbGF0ZVRleHQgPVxuICAgICAgdGhpcy50ZW1wbGF0ZVRleHQucmVwbGFjZSgvWyBcXHRdKjwlXy9nbSwgJzwlXycpLnJlcGxhY2UoL18lPlsgXFx0XSovZ20sICdfJT4nKTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgbWF0Y2hlcyA9IHRoaXMucGFyc2VUZW1wbGF0ZVRleHQoKTtcbiAgICB2YXIgZCA9IHRoaXMub3B0cy5kZWxpbWl0ZXI7XG4gICAgdmFyIG8gPSB0aGlzLm9wdHMub3BlbkRlbGltaXRlcjtcbiAgICB2YXIgYyA9IHRoaXMub3B0cy5jbG9zZURlbGltaXRlcjtcblxuICAgIGlmIChtYXRjaGVzICYmIG1hdGNoZXMubGVuZ3RoKSB7XG4gICAgICBtYXRjaGVzLmZvckVhY2goZnVuY3Rpb24gKGxpbmUsIGluZGV4KSB7XG4gICAgICAgIHZhciBjbG9zaW5nO1xuICAgICAgICAvLyBJZiB0aGlzIGlzIGFuIG9wZW5pbmcgdGFnLCBjaGVjayBmb3IgY2xvc2luZyB0YWdzXG4gICAgICAgIC8vIEZJWE1FOiBNYXkgZW5kIHVwIHdpdGggc29tZSBmYWxzZSBwb3NpdGl2ZXMgaGVyZVxuICAgICAgICAvLyBCZXR0ZXIgdG8gc3RvcmUgbW9kZXMgYXMgay92IHdpdGggb3BlbkRlbGltaXRlciArIGRlbGltaXRlciBhcyBrZXlcbiAgICAgICAgLy8gVGhlbiB0aGlzIGNhbiBzaW1wbHkgY2hlY2sgYWdhaW5zdCB0aGUgbWFwXG4gICAgICAgIGlmICggbGluZS5pbmRleE9mKG8gKyBkKSA9PT0gMCAgICAgICAgLy8gSWYgaXQgaXMgYSB0YWdcbiAgICAgICAgICAmJiBsaW5lLmluZGV4T2YobyArIGQgKyBkKSAhPT0gMCkgeyAvLyBhbmQgaXMgbm90IGVzY2FwZWRcbiAgICAgICAgICBjbG9zaW5nID0gbWF0Y2hlc1tpbmRleCArIDJdO1xuICAgICAgICAgIGlmICghKGNsb3NpbmcgPT0gZCArIGMgfHwgY2xvc2luZyA9PSAnLScgKyBkICsgYyB8fCBjbG9zaW5nID09ICdfJyArIGQgKyBjKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCBtYXRjaGluZyBjbG9zZSB0YWcgZm9yIFwiJyArIGxpbmUgKyAnXCIuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHNlbGYuc2NhbkxpbmUobGluZSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfSxcblxuICBwYXJzZVRlbXBsYXRlVGV4dDogZnVuY3Rpb24gKCkge1xuICAgIHZhciBzdHIgPSB0aGlzLnRlbXBsYXRlVGV4dDtcbiAgICB2YXIgcGF0ID0gdGhpcy5yZWdleDtcbiAgICB2YXIgcmVzdWx0ID0gcGF0LmV4ZWMoc3RyKTtcbiAgICB2YXIgYXJyID0gW107XG4gICAgdmFyIGZpcnN0UG9zO1xuXG4gICAgd2hpbGUgKHJlc3VsdCkge1xuICAgICAgZmlyc3RQb3MgPSByZXN1bHQuaW5kZXg7XG5cbiAgICAgIGlmIChmaXJzdFBvcyAhPT0gMCkge1xuICAgICAgICBhcnIucHVzaChzdHIuc3Vic3RyaW5nKDAsIGZpcnN0UG9zKSk7XG4gICAgICAgIHN0ciA9IHN0ci5zbGljZShmaXJzdFBvcyk7XG4gICAgICB9XG5cbiAgICAgIGFyci5wdXNoKHJlc3VsdFswXSk7XG4gICAgICBzdHIgPSBzdHIuc2xpY2UocmVzdWx0WzBdLmxlbmd0aCk7XG4gICAgICByZXN1bHQgPSBwYXQuZXhlYyhzdHIpO1xuICAgIH1cblxuICAgIGlmIChzdHIpIHtcbiAgICAgIGFyci5wdXNoKHN0cik7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFycjtcbiAgfSxcblxuICBfYWRkT3V0cHV0OiBmdW5jdGlvbiAobGluZSkge1xuICAgIGlmICh0aGlzLnRydW5jYXRlKSB7XG4gICAgICAvLyBPbmx5IHJlcGxhY2Ugc2luZ2xlIGxlYWRpbmcgbGluZWJyZWFrIGluIHRoZSBsaW5lIGFmdGVyXG4gICAgICAvLyAtJT4gdGFnIC0tIHRoaXMgaXMgdGhlIHNpbmdsZSwgdHJhaWxpbmcgbGluZWJyZWFrXG4gICAgICAvLyBhZnRlciB0aGUgdGFnIHRoYXQgdGhlIHRydW5jYXRpb24gbW9kZSByZXBsYWNlc1xuICAgICAgLy8gSGFuZGxlIFdpbiAvIFVuaXggLyBvbGQgTWFjIGxpbmVicmVha3MgLS0gZG8gdGhlIFxcclxcblxuICAgICAgLy8gY29tYm8gZmlyc3QgaW4gdGhlIHJlZ2V4LW9yXG4gICAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9eKD86XFxyXFxufFxccnxcXG4pLywgJycpO1xuICAgICAgdGhpcy50cnVuY2F0ZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAoIWxpbmUpIHtcbiAgICAgIHJldHVybiBsaW5lO1xuICAgIH1cblxuICAgIC8vIFByZXNlcnZlIGxpdGVyYWwgc2xhc2hlc1xuICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoL1xcXFwvZywgJ1xcXFxcXFxcJyk7XG5cbiAgICAvLyBDb252ZXJ0IGxpbmVicmVha3NcbiAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9cXG4vZywgJ1xcXFxuJyk7XG4gICAgbGluZSA9IGxpbmUucmVwbGFjZSgvXFxyL2csICdcXFxccicpO1xuXG4gICAgLy8gRXNjYXBlIGRvdWJsZS1xdW90ZXNcbiAgICAvLyAtIHRoaXMgd2lsbCBiZSB0aGUgZGVsaW1pdGVyIGR1cmluZyBleGVjdXRpb25cbiAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJyk7XG4gICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fYXBwZW5kKFwiJyArIGxpbmUgKyAnXCIpJyArICdcXG4nO1xuICB9LFxuXG4gIHNjYW5MaW5lOiBmdW5jdGlvbiAobGluZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgZCA9IHRoaXMub3B0cy5kZWxpbWl0ZXI7XG4gICAgdmFyIG8gPSB0aGlzLm9wdHMub3BlbkRlbGltaXRlcjtcbiAgICB2YXIgYyA9IHRoaXMub3B0cy5jbG9zZURlbGltaXRlcjtcbiAgICB2YXIgbmV3TGluZUNvdW50ID0gMDtcblxuICAgIG5ld0xpbmVDb3VudCA9IChsaW5lLnNwbGl0KCdcXG4nKS5sZW5ndGggLSAxKTtcblxuICAgIHN3aXRjaCAobGluZSkge1xuICAgIGNhc2UgbyArIGQ6XG4gICAgY2FzZSBvICsgZCArICdfJzpcbiAgICAgIHRoaXMubW9kZSA9IFRlbXBsYXRlLm1vZGVzLkVWQUw7XG4gICAgICBicmVhaztcbiAgICBjYXNlIG8gKyBkICsgJz0nOlxuICAgICAgdGhpcy5tb2RlID0gVGVtcGxhdGUubW9kZXMuRVNDQVBFRDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgbyArIGQgKyAnLSc6XG4gICAgICB0aGlzLm1vZGUgPSBUZW1wbGF0ZS5tb2Rlcy5SQVc7XG4gICAgICBicmVhaztcbiAgICBjYXNlIG8gKyBkICsgJyMnOlxuICAgICAgdGhpcy5tb2RlID0gVGVtcGxhdGUubW9kZXMuQ09NTUVOVDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgbyArIGQgKyBkOlxuICAgICAgdGhpcy5tb2RlID0gVGVtcGxhdGUubW9kZXMuTElURVJBTDtcbiAgICAgIHRoaXMuc291cmNlICs9ICcgICAgOyBfX2FwcGVuZChcIicgKyBsaW5lLnJlcGxhY2UobyArIGQgKyBkLCBvICsgZCkgKyAnXCIpJyArICdcXG4nO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBkICsgZCArIGM6XG4gICAgICB0aGlzLm1vZGUgPSBUZW1wbGF0ZS5tb2Rlcy5MSVRFUkFMO1xuICAgICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fYXBwZW5kKFwiJyArIGxpbmUucmVwbGFjZShkICsgZCArIGMsIGQgKyBjKSArICdcIiknICsgJ1xcbic7XG4gICAgICBicmVhaztcbiAgICBjYXNlIGQgKyBjOlxuICAgIGNhc2UgJy0nICsgZCArIGM6XG4gICAgY2FzZSAnXycgKyBkICsgYzpcbiAgICAgIGlmICh0aGlzLm1vZGUgPT0gVGVtcGxhdGUubW9kZXMuTElURVJBTCkge1xuICAgICAgICB0aGlzLl9hZGRPdXRwdXQobGluZSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubW9kZSA9IG51bGw7XG4gICAgICB0aGlzLnRydW5jYXRlID0gbGluZS5pbmRleE9mKCctJykgPT09IDAgfHwgbGluZS5pbmRleE9mKCdfJykgPT09IDA7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gSW4gc2NyaXB0IG1vZGUsIGRlcGVuZHMgb24gdHlwZSBvZiB0YWdcbiAgICAgIGlmICh0aGlzLm1vZGUpIHtcbiAgICAgICAgLy8gSWYgJy8vJyBpcyBmb3VuZCB3aXRob3V0IGEgbGluZSBicmVhaywgYWRkIGEgbGluZSBicmVhay5cbiAgICAgICAgc3dpdGNoICh0aGlzLm1vZGUpIHtcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5FVkFMOlxuICAgICAgICBjYXNlIFRlbXBsYXRlLm1vZGVzLkVTQ0FQRUQ6XG4gICAgICAgIGNhc2UgVGVtcGxhdGUubW9kZXMuUkFXOlxuICAgICAgICAgIGlmIChsaW5lLmxhc3RJbmRleE9mKCcvLycpID4gbGluZS5sYXN0SW5kZXhPZignXFxuJykpIHtcbiAgICAgICAgICAgIGxpbmUgKz0gJ1xcbic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAodGhpcy5tb2RlKSB7XG4gICAgICAgIC8vIEp1c3QgZXhlY3V0aW5nIGNvZGVcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5FVkFMOlxuICAgICAgICAgIHRoaXMuc291cmNlICs9ICcgICAgOyAnICsgbGluZSArICdcXG4nO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIC8vIEV4ZWMsIGVzYywgYW5kIG91dHB1dFxuICAgICAgICBjYXNlIFRlbXBsYXRlLm1vZGVzLkVTQ0FQRUQ6XG4gICAgICAgICAgdGhpcy5zb3VyY2UgKz0gJyAgICA7IF9fYXBwZW5kKGVzY2FwZUZuKCcgKyBzdHJpcFNlbWkobGluZSkgKyAnKSknICsgJ1xcbic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgLy8gRXhlYyBhbmQgb3V0cHV0XG4gICAgICAgIGNhc2UgVGVtcGxhdGUubW9kZXMuUkFXOlxuICAgICAgICAgIHRoaXMuc291cmNlICs9ICcgICAgOyBfX2FwcGVuZCgnICsgc3RyaXBTZW1pKGxpbmUpICsgJyknICsgJ1xcbic7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVGVtcGxhdGUubW9kZXMuQ09NTUVOVDpcbiAgICAgICAgICAvLyBEbyBub3RoaW5nXG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgLy8gTGl0ZXJhbCA8JSUgbW9kZSwgYXBwZW5kIGFzIHJhdyBvdXRwdXRcbiAgICAgICAgY2FzZSBUZW1wbGF0ZS5tb2Rlcy5MSVRFUkFMOlxuICAgICAgICAgIHRoaXMuX2FkZE91dHB1dChsaW5lKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gSW4gc3RyaW5nIG1vZGUsIGp1c3QgYWRkIHRoZSBvdXRwdXRcbiAgICAgIGVsc2Uge1xuICAgICAgICB0aGlzLl9hZGRPdXRwdXQobGluZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGYub3B0cy5jb21waWxlRGVidWcgJiYgbmV3TGluZUNvdW50KSB7XG4gICAgICB0aGlzLmN1cnJlbnRMaW5lICs9IG5ld0xpbmVDb3VudDtcbiAgICAgIHRoaXMuc291cmNlICs9ICcgICAgOyBfX2xpbmUgPSAnICsgdGhpcy5jdXJyZW50TGluZSArICdcXG4nO1xuICAgIH1cbiAgfVxufTtcblxuLyoqXG4gKiBFc2NhcGUgY2hhcmFjdGVycyByZXNlcnZlZCBpbiBYTUwuXG4gKlxuICogVGhpcyBpcyBzaW1wbHkgYW4gZXhwb3J0IG9mIHtAbGluayBtb2R1bGU6dXRpbHMuZXNjYXBlWE1MfS5cbiAqXG4gKiBJZiBgbWFya3VwYCBpcyBgdW5kZWZpbmVkYCBvciBgbnVsbGAsIHRoZSBlbXB0eSBzdHJpbmcgaXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1hcmt1cCBJbnB1dCBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ30gRXNjYXBlZCBzdHJpbmdcbiAqIEBwdWJsaWNcbiAqIEBmdW5jXG4gKiAqL1xuZXhwb3J0cy5lc2NhcGVYTUwgPSB1dGlscy5lc2NhcGVYTUw7XG5cbi8qKlxuICogRXhwcmVzcy5qcyBzdXBwb3J0LlxuICpcbiAqIFRoaXMgaXMgYW4gYWxpYXMgZm9yIHtAbGluayBtb2R1bGU6ZWpzLnJlbmRlckZpbGV9LCBpbiBvcmRlciB0byBzdXBwb3J0XG4gKiBFeHByZXNzLmpzIG91dC1vZi10aGUtYm94LlxuICpcbiAqIEBmdW5jXG4gKi9cblxuZXhwb3J0cy5fX2V4cHJlc3MgPSBleHBvcnRzLnJlbmRlckZpbGU7XG5cbi8qKlxuICogVmVyc2lvbiBvZiBFSlMuXG4gKlxuICogQHJlYWRvbmx5XG4gKiBAdHlwZSB7U3RyaW5nfVxuICogQHB1YmxpY1xuICovXG5cbmV4cG9ydHMuVkVSU0lPTiA9IF9WRVJTSU9OX1NUUklORztcblxuLyoqXG4gKiBOYW1lIGZvciBkZXRlY3Rpb24gb2YgRUpTLlxuICpcbiAqIEByZWFkb25seVxuICogQHR5cGUge1N0cmluZ31cbiAqIEBwdWJsaWNcbiAqL1xuXG5leHBvcnRzLm5hbWUgPSBfTkFNRTtcblxuLyogaXN0YW5idWwgaWdub3JlIGlmICovXG5pZiAodHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJykge1xuICB3aW5kb3cuZWpzID0gZXhwb3J0cztcbn1cbiIsIi8qXG4gKiBFSlMgRW1iZWRkZWQgSmF2YVNjcmlwdCB0ZW1wbGF0ZXNcbiAqIENvcHlyaWdodCAyMTEyIE1hdHRoZXcgRWVybmlzc2UgKG1kZUBmbGVlZ2l4Lm9yZylcbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiovXG5cbi8qKlxuICogUHJpdmF0ZSB1dGlsaXR5IGZ1bmN0aW9uc1xuICogQG1vZHVsZSB1dGlsc1xuICogQHByaXZhdGVcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciByZWdFeHBDaGFycyA9IC9bfFxcXFx7fSgpW1xcXV4kKyo/Ll0vZztcblxuLyoqXG4gKiBFc2NhcGUgY2hhcmFjdGVycyByZXNlcnZlZCBpbiByZWd1bGFyIGV4cHJlc3Npb25zLlxuICpcbiAqIElmIGBzdHJpbmdgIGlzIGB1bmRlZmluZWRgIG9yIGBudWxsYCwgdGhlIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gc3RyaW5nIElucHV0IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfSBFc2NhcGVkIHN0cmluZ1xuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0cy5lc2NhcGVSZWdFeHBDaGFycyA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmICghc3RyaW5nKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHJldHVybiBTdHJpbmcoc3RyaW5nKS5yZXBsYWNlKHJlZ0V4cENoYXJzLCBmdW5jdGlvbihtYXRjaCkgeyByZXR1cm4gXCJcXFxcXCIgKyBtYXRjaDsgfSk7XG59O1xuXG52YXIgX0VOQ09ERV9IVE1MX1JVTEVTID0ge1xuICAnJic6ICcmYW1wOycsXG4gICc8JzogJyZsdDsnLFxuICAnPic6ICcmZ3Q7JyxcbiAgJ1wiJzogJyYjMzQ7JyxcbiAgXCInXCI6ICcmIzM5Oydcbn07XG52YXIgX01BVENIX0hUTUwgPSAvWyY8PidcIl0vZztcblxuZnVuY3Rpb24gZW5jb2RlX2NoYXIoYykge1xuICByZXR1cm4gX0VOQ09ERV9IVE1MX1JVTEVTW2NdIHx8IGM7XG59XG5cbi8qKlxuICogU3RyaW5naWZpZWQgdmVyc2lvbiBvZiBjb25zdGFudHMgdXNlZCBieSB7QGxpbmsgbW9kdWxlOnV0aWxzLmVzY2FwZVhNTH0uXG4gKlxuICogSXQgaXMgdXNlZCBpbiB0aGUgcHJvY2VzcyBvZiBnZW5lcmF0aW5nIHtAbGluayBDbGllbnRGdW5jdGlvbn1zLlxuICpcbiAqIEByZWFkb25seVxuICogQHR5cGUge1N0cmluZ31cbiAqL1xuXG52YXIgZXNjYXBlRnVuY1N0ciA9XG4gICd2YXIgX0VOQ09ERV9IVE1MX1JVTEVTID0ge1xcbidcbisgJyAgICAgIFwiJlwiOiBcIiZhbXA7XCJcXG4nXG4rICcgICAgLCBcIjxcIjogXCImbHQ7XCJcXG4nXG4rICcgICAgLCBcIj5cIjogXCImZ3Q7XCJcXG4nXG4rICcgICAgLCBcXCdcIlxcJzogXCImIzM0O1wiXFxuJ1xuKyAnICAgICwgXCJcXCdcIjogXCImIzM5O1wiXFxuJ1xuKyAnICAgIH1cXG4nXG4rICcgICwgX01BVENIX0hUTUwgPSAvWyY8PlxcJ1wiXS9nO1xcbidcbisgJ2Z1bmN0aW9uIGVuY29kZV9jaGFyKGMpIHtcXG4nXG4rICcgIHJldHVybiBfRU5DT0RFX0hUTUxfUlVMRVNbY10gfHwgYztcXG4nXG4rICd9O1xcbic7XG5cbi8qKlxuICogRXNjYXBlIGNoYXJhY3RlcnMgcmVzZXJ2ZWQgaW4gWE1MLlxuICpcbiAqIElmIGBtYXJrdXBgIGlzIGB1bmRlZmluZWRgIG9yIGBudWxsYCwgdGhlIGVtcHR5IHN0cmluZyBpcyByZXR1cm5lZC5cbiAqXG4gKiBAaW1wbGVtZW50cyB7RXNjYXBlQ2FsbGJhY2t9XG4gKiBAcGFyYW0ge1N0cmluZ30gbWFya3VwIElucHV0IHN0cmluZ1xuICogQHJldHVybiB7U3RyaW5nfSBFc2NhcGVkIHN0cmluZ1xuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuXG5leHBvcnRzLmVzY2FwZVhNTCA9IGZ1bmN0aW9uIChtYXJrdXApIHtcbiAgcmV0dXJuIG1hcmt1cCA9PSB1bmRlZmluZWRcbiAgICA/ICcnXG4gICAgOiBTdHJpbmcobWFya3VwKVxuICAgICAgLnJlcGxhY2UoX01BVENIX0hUTUwsIGVuY29kZV9jaGFyKTtcbn07XG5leHBvcnRzLmVzY2FwZVhNTC50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHRoaXMpICsgJztcXG4nICsgZXNjYXBlRnVuY1N0cjtcbn07XG5cbi8qKlxuICogTmFpdmUgY29weSBvZiBwcm9wZXJ0aWVzIGZyb20gb25lIG9iamVjdCB0byBhbm90aGVyLlxuICogRG9lcyBub3QgcmVjdXJzZSBpbnRvIG5vbi1zY2FsYXIgcHJvcGVydGllc1xuICogRG9lcyBub3QgY2hlY2sgdG8gc2VlIGlmIHRoZSBwcm9wZXJ0eSBoYXMgYSB2YWx1ZSBiZWZvcmUgY29weWluZ1xuICpcbiAqIEBwYXJhbSAge09iamVjdH0gdG8gICBEZXN0aW5hdGlvbiBvYmplY3RcbiAqIEBwYXJhbSAge09iamVjdH0gZnJvbSBTb3VyY2Ugb2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgRGVzdGluYXRpb24gb2JqZWN0XG4gKiBAc3RhdGljXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnRzLnNoYWxsb3dDb3B5ID0gZnVuY3Rpb24gKHRvLCBmcm9tKSB7XG4gIGZyb20gPSBmcm9tIHx8IHt9O1xuICBmb3IgKHZhciBwIGluIGZyb20pIHtcbiAgICB0b1twXSA9IGZyb21bcF07XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBOYWl2ZSBjb3B5IG9mIGEgbGlzdCBvZiBrZXkgbmFtZXMsIGZyb20gb25lIG9iamVjdCB0byBhbm90aGVyLlxuICogT25seSBjb3BpZXMgcHJvcGVydHkgaWYgaXQgaXMgYWN0dWFsbHkgZGVmaW5lZFxuICogRG9lcyBub3QgcmVjdXJzZSBpbnRvIG5vbi1zY2FsYXIgcHJvcGVydGllc1xuICpcbiAqIEBwYXJhbSAge09iamVjdH0gdG8gICBEZXN0aW5hdGlvbiBvYmplY3RcbiAqIEBwYXJhbSAge09iamVjdH0gZnJvbSBTb3VyY2Ugb2JqZWN0XG4gKiBAcGFyYW0gIHtBcnJheX0gbGlzdCBMaXN0IG9mIHByb3BlcnRpZXMgdG8gY29weVxuICogQHJldHVybiB7T2JqZWN0fSAgICAgIERlc3RpbmF0aW9uIG9iamVjdFxuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0cy5zaGFsbG93Q29weUZyb21MaXN0ID0gZnVuY3Rpb24gKHRvLCBmcm9tLCBsaXN0KSB7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBwID0gbGlzdFtpXTtcbiAgICBpZiAodHlwZW9mIGZyb21bcF0gIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRvW3BdID0gZnJvbVtwXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRvO1xufTtcblxuLyoqXG4gKiBTaW1wbGUgaW4tcHJvY2VzcyBjYWNoZSBpbXBsZW1lbnRhdGlvbi4gRG9lcyBub3QgaW1wbGVtZW50IGxpbWl0cyBvZiBhbnlcbiAqIHNvcnQuXG4gKlxuICogQGltcGxlbWVudHMge0NhY2hlfVxuICogQHN0YXRpY1xuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0cy5jYWNoZSA9IHtcbiAgX2RhdGE6IHt9LFxuICBzZXQ6IGZ1bmN0aW9uIChrZXksIHZhbCkge1xuICAgIHRoaXMuX2RhdGFba2V5XSA9IHZhbDtcbiAgfSxcbiAgZ2V0OiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFba2V5XTtcbiAgfSxcbiAgcmVtb3ZlOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgZGVsZXRlIHRoaXMuX2RhdGFba2V5XTtcbiAgfSxcbiAgcmVzZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9kYXRhID0ge307XG4gIH1cbn07XG5cbi8qKlxuICogVHJhbnNmb3JtcyBoeXBoZW4gY2FzZSB2YXJpYWJsZSBpbnRvIGNhbWVsIGNhc2UuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHN0cmluZyBIeXBoZW4gY2FzZSBzdHJpbmdcbiAqIEByZXR1cm4ge1N0cmluZ30gQ2FtZWwgY2FzZSBzdHJpbmdcbiAqIEBzdGF0aWNcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydHMuaHlwaGVuVG9DYW1lbCA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC8tW2Etel0vZywgZnVuY3Rpb24gKG1hdGNoKSB7IHJldHVybiBtYXRjaFsxXS50b1VwcGVyQ2FzZSgpOyB9KTtcbn07XG4iLCIkLmkxOG4oKS5sb2FkKHtcbiAgICBlbjoge1xuICAgICAgICBtc2dfbm9fYW5zd2VyOiBcIk5vIGFuc3dlciBwcm92aWRlZC5cIixcbiAgICAgICAgbXNnX2ZpdGJfY2hlY2tfbWU6IFwiQ2hlY2sgbWVcIixcbiAgICAgICAgbXNnX2ZpdGJfY29tcGFyZV9tZTogXCJDb21wYXJlIG1lXCIsXG4gICAgICAgIG1zZ19maXRiX3JhbmRvbWl6ZTogXCJSYW5kb21pemVcIlxuICAgIH0sXG59KTtcbiIsIiQuaTE4bigpLmxvYWQoe1xuICAgIFwicHQtYnJcIjoge1xuICAgICAgICBtc2dfbm9fYW5zd2VyOiBcIk5lbmh1bWEgcmVzcG9zdGEgZGFkYS5cIixcbiAgICAgICAgbXNnX2ZpdGJfY2hlY2tfbWU6IFwiVmVyaWZpY2FyXCIsXG4gICAgICAgIG1zZ19maXRiX2NvbXBhcmVfbWU6IFwiQ29tcGFyYXJcIlxuICAgIH0sXG59KTtcbiIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLSBncmFkaW5nLXJlbGF0ZWQgdXRpbGl0aWVzIGZvciBGSVRCIHF1ZXN0aW9uc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoaXMgY29kZSBydW5zIGJvdGggb24gdGhlIHNlcnZlciAoZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcpIGFuZCBvbiB0aGUgY2xpZW50LiBJdCdzIHBsYWNlZCBoZXJlIGFzIGEgc2V0IG9mIGZ1bmN0aW9ucyBzcGVjaWZpY2FsbHkgZm9yIHRoaXMgcHVycG9zZS5cblxuXG5cInVzZSBzdHJpY3RcIjtcblxuLy8gSW5jbHVkZXNcbi8vID09PT09PT09XG4vLyBUaGlzIGlzIGFuIGVkaXRlZCBjb3B5IG9mIGBFSlMgPGh0dHBzOi8vZWpzLmNvLz5gXzpcbi8vXG4vLyAtICAgIEl0IGNvbnRhaW5zIHRoZSBpbXByb3ZlbWVudCBtZW50aW9uZWQgaW4gYHRoaXMgaXNzdWUgPGh0dHBzOi8vZ2l0aHViLmNvbS9tZGUvZWpzL2lzc3Vlcy82MjQ+YF8uXG4vLyAtICAgIEl0IGFsc28gY29udGFpbnMgYSB3b3JrYXJvdW5kIGZvciBhIGBqczJweSB2MC43MSBidWcgPGh0dHBzOi8vZ2l0aHViLmNvbS9QaW90ckRhYmtvd3NraS9KczJQeS9wdWxsLzI2NT5gXy4gVGhlIGZpeCBpcyBtZXJnZWQsIGJ1dCBub3QgeWV0IHJlbGVhc2VkLlxuLy9cbi8vIElmIGJvdGggaXNzdWVzIGFyZSBtZXJnZWQgYW5kIHJlbGVhc2VkLCB0aGVuIHVzZSBFSlMgZnJvbSBOUE0uXG5pbXBvcnQgeyByZW5kZXIgYXMgZWpzX3JlbmRlciB9IGZyb20gXCIuL2Vqcy9saWIvZWpzLmpzXCI7XG5cblxuLy8gR2xvYmFsc1xuLy8gPT09PT09PVxuLy8gU3RhbmRhcmQgb3B0aW9ucyB0byB1c2UgZm9yIEVKUyB0ZW1wbGF0ZXMuXG5jb25zdCBFSlNfT1BUSU9OUyA9IHtcbiAgICBzdHJpY3Q6IHRydWUsXG4gICAgLy8gTm90IG5lZWRlZCwgYnV0IG1pZ2h0IHJlZHVjZSBjb25mdXNpb24gLS0geW91IGNhbiBhY2Nlc3MgdGhlIHZhcmlhYmxlIGBgYWBgIGFzIGBgYWBgIG9yIGBgdi5hYGAuXG4gICAgbG9jYWxzTmFtZTogXCJ2XCIsXG4gICAgLy8gQXZvaWQgdGhlIGRlZmF1bHQgZGVsaW1pdGVycyBvZiBgYDxgYCBhbmQgYGA+YGAsIHdoaWNoIGdldCB0cmFuc2xhdGVkIHRvIEhUTUwgZW50aXRpZXMgYnkgU3BoaW54LlxuICAgIG9wZW5EZWxpbWl0ZXI6IFwiW1wiLFxuICAgIGNsb3NlRGVsaW1pdGVyOiBcIl1cIlxufTtcblxuXG4vLyBGdW5jdGlvbnNcbi8vID09PT09PT09PVxuLy8gVXBkYXRlIHRoZSBwcm9ibGVtJ3MgZGVzY3JpcHRpb24gYmFzZWQgb24gZHluYW1pY2FsbHktZ2VuZXJhdGVkIGNvbnRlbnQuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyRHluYW1pY0NvbnRlbnQoc2VlZCwgZHluX3ZhcnMsIGh0bWxfaW4sIGRpdmlkLCBwcmVwYXJlQ2hlY2tBbnN3ZXJzKSB7XG4gICAgLy8gSW5pdGlhbGl6ZSBSTkcgd2l0aCBgYHRoaXMuc2VlZGBgLiBUYWtlbiBmcm9tIGBTTyA8aHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9hLzQ3NTkzMzE2LzE2MDM4OTE5PmBfLlxuICAgIGNvbnN0IHJhbmQgPSBmdW5jdGlvbiBtdWxiZXJyeTMyKGEpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbGV0IHQgPSBhICs9IDB4NkQyQjc5RjU7XG4gICAgICAgICAgICB0ID0gTWF0aC5pbXVsKHQgXiB0ID4+PiAxNSwgdCB8IDEpO1xuICAgICAgICAgICAgdCBePSB0ICsgTWF0aC5pbXVsKHQgXiB0ID4+PiA3LCB0IHwgNjEpO1xuICAgICAgICAgICAgcmV0dXJuICgodCBeIHQgPj4+IDE0KSA+Pj4gMCkgLyA0Mjk0OTY3Mjk2O1xuICAgICAgICB9XG4gICAgfShzZWVkKTtcblxuICAgIC8vIFNlZSBgUkFORF9GVU5DIDxSQU5EX0ZVTkM+YF8sIHdoaWNoIHJlZmVycyB0byBgYHJhbmRgYCBhYm92ZS5cbiAgICBjb25zdCBkeW5fdmFyc19ldmFsID0gd2luZG93LkZ1bmN0aW9uKFxuICAgICAgICBcInZcIiwgXCJyYW5kXCIsIGBcInVzZSBzdHJpY3RcIjtcXG4ke2R5bl92YXJzfTtcXG5yZXR1cm4gdjtgXG4gICAgKShcbiAgICAgICAge2RpdmlkOiBkaXZpZCwgcHJlcGFyZUNoZWNrQW5zd2VyczogcHJlcGFyZUNoZWNrQW5zd2Vyc30sIFJBTkRfRlVOQ1xuICAgICk7XG5cbiAgICBsZXQgaHRtbF9vdXQ7XG4gICAgaWYgKHR5cGVvZihkeW5fdmFyc19ldmFsLmJlZm9yZUNvbnRlbnRSZW5kZXIpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGR5bl92YXJzX2V2YWwuYmVmb3JlQ29udGVudFJlbmRlcihkeW5fdmFyc19ldmFsKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgaW4gcHJvYmxlbSAke2RpdmlkfSBpbnZva2luZyBiZWZvcmVDb250ZW50UmVuZGVyYCk7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaHRtbF9vdXQgPSBlanNfcmVuZGVyKGh0bWxfaW4sIGR5bl92YXJzX2V2YWwsIEVKU19PUFRJT05TKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgY29uc29sZS5sb2coYEVycm9yIHJlbmRlcmluZyBwcm9ibGVtICR7ZGl2aWR9IHRleHQgdXNpbmcgRUpTYCk7XG4gICAgICAgIHRocm93IGVycjtcbiAgICB9XG5cbiAgICAvLyB0aGUgYWZ0ZXJDb250ZW50UmVuZGVyIGV2ZW50IHdpbGwgYmUgY2FsbGVkIGJ5IHRoZSBjYWxsZXIgb2YgdGhpcyBmdW5jdGlvbiAoYWZ0ZXIgaXQgdXBkYXRlZCB0aGUgSFRNTCBiYXNlZCBvbiB0aGUgY29udGVudHMgb2YgaHRtbF9vdXQpLlxuICAgIHJldHVybiBbaHRtbF9vdXQsIGR5bl92YXJzX2V2YWxdO1xufVxuXG5cbi8vIEdpdmVuIHN0dWRlbnQgYW5zd2VycywgZ3JhZGUgdGhlbSBhbmQgcHJvdmlkZSBmZWVkYmFjay5cbi8vXG4vLyBPdXRwdXRzOlxuLy9cbi8vIC0gICAgYGBkaXNwbGF5RmVlZGBgIGlzIGFuIGFycmF5IG9mIEhUTUwgZmVlZGJhY2suXG4vLyAtICAgIGBgaXNDb3JyZWN0QXJyYXlgYCBpcyBhbiBhcnJheSBvZiB0cnVlLCBmYWxzZSwgb3IgbnVsbCAodGhlIHF1ZXN0aW9uIHdhc24ndCBhbnN3ZXJlZCkuXG4vLyAtICAgIGBgY29ycmVjdGBgIGlzIHRydWUsIGZhbHNlLCBvciBudWxsICh0aGUgcXVlc3Rpb24gd2Fzbid0IGFuc3dlcmVkKS5cbi8vIC0gICAgYGBwZXJjZW50YGAgaXMgdGhlIHBlcmNlbnRhZ2Ugb2YgY29ycmVjdCBhbnN3ZXJzIChmcm9tIDAgdG8gMSwgbm90IDAgdG8gMTAwKS5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja0Fuc3dlcnNDb3JlKFxuICAgIC8vIF9gYmxhbmtOYW1lc0RpY3RgOiBBbiBkaWN0IG9mIHtibGFua19uYW1lLCBibGFua19pbmRleH0gc3BlY2lmeWluZyB0aGUgbmFtZSBmb3IgZWFjaCBuYW1lZCBibGFuay5cbiAgICBibGFua05hbWVzRGljdCxcbiAgICAvLyBfYGdpdmVuX2FycmA6IEFuIGFycmF5IG9mIHN0cmluZ3MgY29udGFpbmluZyBzdHVkZW50LXByb3ZpZGVkIGFuc3dlcnMgZm9yIGVhY2ggYmxhbmsuXG4gICAgZ2l2ZW5fYXJyLFxuICAgIC8vIEEgMi1EIGFycmF5IG9mIHN0cmluZ3MgZ2l2aW5nIGZlZWRiYWNrIGZvciBlYWNoIGJsYW5rLlxuICAgIGZlZWRiYWNrQXJyYXksXG4gICAgLy8gX2BkeW5fdmFyc19ldmFsYDogQSBkaWN0IHByb2R1Y2VkIGJ5IGV2YWx1YXRpbmcgdGhlIEphdmFTY3JpcHQgZm9yIGEgZHluYW1pYyBleGVyY2lzZS5cbiAgICBkeW5fdmFyc19ldmFsLFxuICAgIC8vIFRydWUgaWYgdGhpcyBpcyBydW5uaW5nIG9uIHRoZSBzZXJ2ZXIsIHRvIHdvcmsgYXJvdW5kIGEgYGpzMnB5IHYwLjcxIGJ1ZyA8aHR0cHM6Ly9naXRodWIuY29tL1Bpb3RyRGFia293c2tpL0pzMlB5L3B1bGwvMjY2PmBfIGZpeGVkIGluIG1hc3Rlci4gV2hlbiBhIG5ldyB2ZXJzaW9uIGlzIHJlbGVhc2VkLCByZW1vdmUgdGhpcy5cbiAgICBpc19zZXJ2ZXI9ZmFsc2UsXG4pIHtcbiAgICBpZiAodHlwZW9mKGR5bl92YXJzX2V2YWwuYmVmb3JlQ2hlY2tBbnN3ZXJzKSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNvbnN0IFtuYW1lZEJsYW5rVmFsdWVzLCBnaXZlbl9hcnJfY29udmVydGVkXSA9IHBhcnNlQW5zd2VycyhibGFua05hbWVzRGljdCwgZ2l2ZW5fYXJyLCBkeW5fdmFyc19ldmFsKTtcbiAgICAgICAgY29uc3QgZHZlX2JsYW5rcyA9IE9iamVjdC5hc3NpZ24oe30sIGR5bl92YXJzX2V2YWwsIG5hbWVkQmxhbmtWYWx1ZXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5iZWZvcmVDaGVja0Fuc3dlcnMoZHZlX2JsYW5rcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJFcnJvciBjYWxsaW5nIGJlZm9yZUNoZWNrQW5zd2Vyc1wiKTtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEtlZXAgdHJhY2sgaWYgYWxsIGFuc3dlcnMgYXJlIGNvcnJlY3Qgb3Igbm90LlxuICAgIGxldCBjb3JyZWN0ID0gdHJ1ZTtcbiAgICBjb25zdCBpc0NvcnJlY3RBcnJheSA9IFtdO1xuICAgIGNvbnN0IGRpc3BsYXlGZWVkID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBnaXZlbl9hcnIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgZ2l2ZW4gPSBnaXZlbl9hcnJbaV07XG4gICAgICAgIC8vIElmIHRoaXMgYmxhbmsgaXMgZW1wdHksIHByb3ZpZGUgbm8gZmVlZGJhY2sgZm9yIGl0LlxuICAgICAgICBpZiAoZ2l2ZW4gPT09IFwiXCIpIHtcbiAgICAgICAgICAgIGlzQ29ycmVjdEFycmF5LnB1c2gobnVsbCk7XG4gICAgICAgICAgICAvLyBUT0RPOiB3YXMgJC5pMThuKFwibXNnX25vX2Fuc3dlclwiKS5cbiAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goXCJObyBhbnN3ZXIgcHJvdmlkZWQuXCIpO1xuICAgICAgICAgICAgY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gTG9vayB0aHJvdWdoIGFsbCBmZWVkYmFjayBmb3IgdGhpcyBibGFuay4gVGhlIGxhc3QgZWxlbWVudCBpbiB0aGUgYXJyYXkgYWx3YXlzIG1hdGNoZXMuIElmIG5vIGZlZWRiYWNrIGZvciB0aGlzIGJsYW5rIGV4aXN0cywgdXNlIGFuIGVtcHR5IGxpc3QuXG4gICAgICAgICAgICBjb25zdCBmYmwgPSBmZWVkYmFja0FycmF5W2ldIHx8IFtdO1xuICAgICAgICAgICAgbGV0IGo7XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgZmJsLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlIGxhc3QgaXRlbSBvZiBmZWVkYmFjayBhbHdheXMgbWF0Y2hlcy5cbiAgICAgICAgICAgICAgICBpZiAoaiA9PT0gZmJsLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUZlZWQucHVzaChmYmxbal1bXCJmZWVkYmFja1wiXSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBJZiB0aGlzIGlzIGEgZHluYW1pYyBzb2x1dGlvbi4uLlxuICAgICAgICAgICAgICAgIGlmIChkeW5fdmFyc19ldmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFtuYW1lZEJsYW5rVmFsdWVzLCBnaXZlbl9hcnJfY29udmVydGVkXSA9IHBhcnNlQW5zd2VycyhibGFua05hbWVzRGljdCwgZ2l2ZW5fYXJyLCBkeW5fdmFyc19ldmFsKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUgd2FzIGEgcGFyc2UgZXJyb3IsIHRoZW4gaXQgc3R1ZGVudCdzIGFuc3dlciBpcyBpbmNvcnJlY3QuXG4gICAgICAgICAgICAgICAgICAgIGlmIChnaXZlbl9hcnJfY29udmVydGVkW2ldIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGdpdmVuX2Fycl9jb252ZXJ0ZWRbaV0ubWVzc2FnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3VudCB0aGlzIGFzIHdyb25nIGJ5IG1ha2luZyBqICE9IDAgLS0gc2VlIHRoZSBjb2RlIHRoYXQgcnVucyBpbW1lZGlhdGVseSBhZnRlciB0aGUgZXhlY3V0aW5nIHRoZSBicmVhay5cbiAgICAgICAgICAgICAgICAgICAgICAgIGogPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gQ3JlYXRlIGEgZnVuY3Rpb24gdG8gd3JhcCB0aGUgZXhwcmVzc2lvbiB0byBldmFsdWF0ZS4gU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL0Z1bmN0aW9uLlxuICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRoZSBhbnN3ZXIsIGFycmF5IG9mIGFsbCBhbnN3ZXJzLCB0aGVuIGFsbCBlbnRyaWVzIGluIGBgdGhpcy5keW5fdmFyc19ldmFsYGAgZGljdCBhcyBmdW5jdGlvbiBwYXJhbWV0ZXJzLlxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc19lcXVhbCA9IHdpbmRvdy5GdW5jdGlvbihcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYW5zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFuc19hcnJheVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgLi4uT2JqZWN0LmtleXMoZHluX3ZhcnNfZXZhbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3Qua2V5cyhuYW1lZEJsYW5rVmFsdWVzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGBcInVzZSBzdHJpY3Q7XCJcXG5yZXR1cm4gJHtmYmxbal1bXCJzb2x1dGlvbl9jb2RlXCJdfTtgXG4gICAgICAgICAgICAgICAgICAgICkoXG4gICAgICAgICAgICAgICAgICAgICAgICBnaXZlbl9hcnJfY29udmVydGVkW2ldLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ2l2ZW5fYXJyX2NvbnZlcnRlZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC4uLk9iamVjdC52YWx1ZXMoZHluX3ZhcnNfZXZhbCksXG4gICAgICAgICAgICAgICAgICAgICAgICAuLi5PYmplY3QudmFsdWVzKG5hbWVkQmxhbmtWYWx1ZXMpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHN0dWRlbnQncyBhbnN3ZXIgaXMgZXF1YWwgdG8gdGhpcyBpdGVtLCB0aGVuIGFwcGVuZCB0aGlzIGl0ZW0ncyBmZWVkYmFjay5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzX2VxdWFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKHR5cGVvZihpc19lcXVhbCkgPT09IFwic3RyaW5nXCIgPyBpc19lcXVhbCA6IGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhpcyBpcyBhIHJlZ2V4cC4uLlxuICAgICAgICAgICAgICAgIGlmIChcInJlZ2V4XCIgaW4gZmJsW2pdKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhdHQgPSBSZWdFeHAoXG4gICAgICAgICAgICAgICAgICAgICAgICBmYmxbal1bXCJyZWdleFwiXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZibFtqXVtcInJlZ2V4RmxhZ3NcIl1cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhdHQudGVzdChnaXZlbikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXlGZWVkLnB1c2goZmJsW2pdW1wiZmVlZGJhY2tcIl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBUaGlzIGlzIGEgbnVtYmVyLlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmFzc2VydChcIm51bWJlclwiIGluIGZibFtqXSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFttaW4sIG1heF0gPSBmYmxbal1bXCJudW1iZXJcIl07XG4gICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIGdpdmVuIHN0cmluZyB0byBhIG51bWJlci4gV2hpbGUgdGhlcmUgYXJlIGBsb3RzIG9mIHdheXMgPGh0dHBzOi8vY29kZXJ3YWxsLmNvbS9wLzV0bGhtdy9jb252ZXJ0aW5nLXN0cmluZ3MtdG8tbnVtYmVyLWluLWphdmFzY3JpcHQtcGl0ZmFsbHM+YF8gdG8gZG8gdGhpczsgdGhpcyB2ZXJzaW9uIHN1cHBvcnRzIG90aGVyIGJhc2VzIChoZXgvYmluYXJ5L29jdGFsKSBhcyB3ZWxsIGFzIGZsb2F0cy5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYWN0dWFsID0gK2dpdmVuO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYWN0dWFsID49IG1pbiAmJiBhY3R1YWwgPD0gbWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RmVlZC5wdXNoKGZibFtqXVtcImZlZWRiYWNrXCJdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBqczJweSBzZWVtcyB0byBpbmNyZW1lbnQgaiBpbiB0aGUgZm9yIGxvb3AgKiphZnRlcioqIGVuY291bnRlcmluZyBhIGJyZWFrIHN0YXRlbWVudC4gQWFyZ2guIFdvcmsgYXJvdW5kIHRoaXMuXG4gICAgICAgICAgICBpZiAoaXNfc2VydmVyKSB7XG4gICAgICAgICAgICAgICAgLS1qO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gVGhlIGFuc3dlciBpcyBjb3JyZWN0IGlmIGl0IG1hdGNoZWQgdGhlIGZpcnN0IGVsZW1lbnQgaW4gdGhlIGFycmF5LiBBIHNwZWNpYWwgY2FzZTogaWYgb25seSBvbmUgYW5zd2VyIGlzIHByb3ZpZGVkLCBjb3VudCBpdCB3cm9uZzsgdGhpcyBpcyBhIG1pc2Zvcm1lZCBwcm9ibGVtLlxuICAgICAgICAgICAgY29uc3QgaXNfY29ycmVjdCA9IGogPT09IDAgJiYgZmJsLmxlbmd0aCA+IDE7XG4gICAgICAgICAgICBpc0NvcnJlY3RBcnJheS5wdXNoKGlzX2NvcnJlY3QpO1xuICAgICAgICAgICAgaWYgKCFpc19jb3JyZWN0KSB7XG4gICAgICAgICAgICAgICAgY29ycmVjdCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZihkeW5fdmFyc19ldmFsLmFmdGVyQ2hlY2tBbnN3ZXJzKSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGNvbnN0IFtuYW1lZEJsYW5rVmFsdWVzLCBnaXZlbl9hcnJfY29udmVydGVkXSA9IHBhcnNlQW5zd2VycyhibGFua05hbWVzRGljdCwgZ2l2ZW5fYXJyLCBkeW5fdmFyc19ldmFsKTtcbiAgICAgICAgY29uc3QgZHZlX2JsYW5rcyA9IE9iamVjdC5hc3NpZ24oe30sIGR5bl92YXJzX2V2YWwsIG5hbWVkQmxhbmtWYWx1ZXMpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgZHluX3ZhcnNfZXZhbC5hZnRlckNoZWNrQW5zd2VycyhkdmVfYmxhbmtzLCBnaXZlbl9hcnJfY29udmVydGVkKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yIGNhbGxpbmcgYWZ0ZXJDaGVja0Fuc3dlcnNcIik7XG4gICAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBwZXJjZW50ID0gaXNDb3JyZWN0QXJyYXkuZmlsdGVyKEJvb2xlYW4pLmxlbmd0aCAvIGlzQ29ycmVjdEFycmF5Lmxlbmd0aDtcbiAgICByZXR1cm4gW2Rpc3BsYXlGZWVkLCBjb3JyZWN0LCBpc0NvcnJlY3RBcnJheSwgcGVyY2VudF07XG59XG5cblxuLy8gVXNlIHRoZSBwcm92aWRlZCBwYXJzZXJzIHRvIGNvbnZlcnQgYSBzdHVkZW50J3MgYW5zd2VycyAoYXMgc3RyaW5ncykgdG8gdGhlIHR5cGUgcHJvZHVjZWQgYnkgdGhlIHBhcnNlciBmb3IgZWFjaCBibGFuay5cbmZ1bmN0aW9uIHBhcnNlQW5zd2VycyhcbiAgICAvLyBTZWUgYmxhbmtOYW1lc0RpY3RfLlxuICAgIGJsYW5rTmFtZXNEaWN0LFxuICAgIC8vIFNlZSBnaXZlbl9hcnJfLlxuICAgIGdpdmVuX2FycixcbiAgICAvLyBTZWUgYGR5bl92YXJzX2V2YWxgLlxuICAgIGR5bl92YXJzX2V2YWwsXG4pe1xuICAgIC8vIFByb3ZpZGUgYSBkaWN0IG9mIHtibGFua19uYW1lLCBjb252ZXJ0ZXJfYW5zd2VyX3ZhbHVlfS5cbiAgICBjb25zdCBuYW1lZEJsYW5rVmFsdWVzID0gZ2V0TmFtZWRCbGFua1ZhbHVlcyhnaXZlbl9hcnIsIGJsYW5rTmFtZXNEaWN0LCBkeW5fdmFyc19ldmFsKTtcbiAgICAvLyBJbnZlcnQgYmxhbmtOYW1lZERpY3Q6IGNvbXB1dGUgYW4gYXJyYXkgb2YgW2JsYW5rXzBfbmFtZSwgLi4uXS4gTm90ZSB0aGF0IHRoZSBhcnJheSBtYXkgYmUgc3BhcnNlOiBpdCBvbmx5IGNvbnRhaW5zIHZhbHVlcyBmb3IgbmFtZWQgYmxhbmtzLlxuICAgIGNvbnN0IGdpdmVuX2Fycl9uYW1lcyA9IFtdO1xuICAgIGZvciAoY29uc3QgW2ssIHZdIG9mIE9iamVjdC5lbnRyaWVzKGJsYW5rTmFtZXNEaWN0KSkge1xuICAgICAgICBnaXZlbl9hcnJfbmFtZXNbdl0gPSBrO1xuICAgIH1cbiAgICAvLyBDb21wdXRlIGFuIGFycmF5IG9mIFtjb252ZXJ0ZWRfYmxhbmtfMF92YWwsIC4uLl0uIE5vdGUgdGhhdCB0aGlzIHJlLWNvbnZlcnRzIGFsbCB0aGUgdmFsdWVzLCByYXRoZXIgdGhhbiAocG9zc2libHkgZGVlcCkgY29weWluZyB0aGUgdmFsdWVzIGZyb20gYWxyZWFkeS1jb252ZXJ0ZWQgbmFtZWQgYmxhbmtzLlxuICAgIGNvbnN0IGdpdmVuX2Fycl9jb252ZXJ0ZWQgPSBnaXZlbl9hcnIubWFwKCh2YWx1ZSwgaW5kZXgpID0+IHR5cGVfY29udmVydChnaXZlbl9hcnJfbmFtZXNbaW5kZXhdLCB2YWx1ZSwgaW5kZXgsIGR5bl92YXJzX2V2YWwpKTtcblxuICAgIHJldHVybiBbbmFtZWRCbGFua1ZhbHVlcywgZ2l2ZW5fYXJyX2NvbnZlcnRlZF07XG59XG5cblxuLy8gUmVuZGVyIHRoZSBmZWVkYmFjayBmb3IgYSBkeW5hbWljIHByb2JsZW0uXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyRHluYW1pY0ZlZWRiYWNrKFxuICAgIC8vIFNlZSBibGFua05hbWVzRGljdF8uXG4gICAgYmxhbmtOYW1lc0RpY3QsXG4gICAgLy8gU2VlIGdpdmVuX2Fycl8uXG4gICAgZ2l2ZW5fYXJyLFxuICAgIC8vIFRoZSBpbmRleCBvZiB0aGlzIGJsYW5rIGluIGdpdmVuX2Fycl8uXG4gICAgaW5kZXgsXG4gICAgLy8gVGhlIGZlZWRiYWNrIGZvciB0aGlzIGJsYW5rLCBjb250YWluaW5nIGEgdGVtcGxhdGUgdG8gYmUgcmVuZGVyZWQuXG4gICAgZGlzcGxheUZlZWRfaSxcbiAgICAvLyBTZWUgZHluX3ZhcnNfZXZhbF8uXG4gICAgZHluX3ZhcnNfZXZhbFxuKSB7XG4gICAgLy8gVXNlIHRoZSBhbnN3ZXIsIGFuIGFycmF5IG9mIGFsbCBhbnN3ZXJzLCB0aGUgdmFsdWUgb2YgYWxsIG5hbWVkIGJsYW5rcywgYW5kIGFsbCBzb2x1dGlvbiB2YXJpYWJsZXMgZm9yIHRoZSB0ZW1wbGF0ZS5cbiAgICBjb25zdCBuYW1lZEJsYW5rVmFsdWVzID0gZ2V0TmFtZWRCbGFua1ZhbHVlcyhnaXZlbl9hcnIsIGJsYW5rTmFtZXNEaWN0LCBkeW5fdmFyc19ldmFsKTtcbiAgICBjb25zdCBzb2xfdmFyc19wbHVzID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgIGFuczogZ2l2ZW5fYXJyW2luZGV4XSxcbiAgICAgICAgYW5zX2FycmF5OiBnaXZlbl9hcnJcbiAgICB9LFxuICAgICAgICBkeW5fdmFyc19ldmFsLFxuICAgICAgICBuYW1lZEJsYW5rVmFsdWVzLFxuICAgICk7XG4gICAgdHJ5IHtcbiAgICAgICAgZGlzcGxheUZlZWRfaSA9IGVqc19yZW5kZXIoZGlzcGxheUZlZWRfaSwgc29sX3ZhcnNfcGx1cywgRUpTX09QVElPTlMpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhgRXJyb3IgZXZhbHVhdGluZyBmZWVkYmFjayBpbmRleCAke2luZGV4fS5gKVxuICAgICAgICB0aHJvdyBlcnI7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRpc3BsYXlGZWVkX2k7XG59XG5cblxuLy8gVXRpbGl0aWVzXG4vLyAtLS0tLS0tLS1cbi8vIEZvciBlYWNoIG5hbWVkIGJsYW5rLCBnZXQgdGhlIHZhbHVlIGZvciB0aGUgYmxhbms6IHRoZSB2YWx1ZSBvZiBlYWNoIGBgYmxhbmtOYW1lYGAgZ2l2ZXMgdGhlIGluZGV4IG9mIHRoZSBibGFuayBmb3IgdGhhdCBuYW1lLlxuZnVuY3Rpb24gZ2V0TmFtZWRCbGFua1ZhbHVlcyhnaXZlbl9hcnIsIGJsYW5rTmFtZXNEaWN0LCBkeW5fdmFyc19ldmFsKSB7XG4gICAgY29uc3QgbmFtZWRCbGFua1ZhbHVlcyA9IHt9O1xuICAgIGZvciAoY29uc3QgW2JsYW5rX25hbWUsIGJsYW5rX2luZGV4XSBvZiBPYmplY3QuZW50cmllcyhibGFua05hbWVzRGljdCkpIHtcbiAgICAgICAgbmFtZWRCbGFua1ZhbHVlc1tibGFua19uYW1lXSA9IHR5cGVfY29udmVydChibGFua19uYW1lLCBnaXZlbl9hcnJbYmxhbmtfaW5kZXhdLCBibGFua19pbmRleCwgZHluX3ZhcnNfZXZhbCk7XG4gICAgfVxuICAgIHJldHVybiBuYW1lZEJsYW5rVmFsdWVzO1xufVxuXG5cbi8vIENvbnZlcnQgYSB2YWx1ZSBnaXZlbiBpdHMgdHlwZS5cbmZ1bmN0aW9uIHR5cGVfY29udmVydChuYW1lLCB2YWx1ZSwgaW5kZXgsIGR5bl92YXJzX2V2YWwpIHtcbiAgICAvLyBUaGUgY29udmVydGVyIGNhbiBiZSBkZWZpbmVkIGJ5IGluZGV4LCBuYW1lLCBvciBieSBhIHNpbmdsZSB2YWx1ZSAod2hpY2ggYXBwbGllcyB0byBhbGwgYmxhbmtzKS4gSWYgbm90IHByb3ZpZGVkLCBqdXN0IHBhc3MgdGhlIGRhdGEgdGhyb3VnaC5cbiAgICBjb25zdCB0eXBlcyA9IGR5bl92YXJzX2V2YWwudHlwZXMgfHwgcGFzc190aHJvdWdoO1xuICAgIGNvbnN0IGNvbnZlcnRlciA9IHR5cGVzW25hbWVdIHx8IHR5cGVzW2luZGV4XSB8fCB0eXBlcztcbiAgICAvLyBFUzUgaGFjazogaXQgZG9lc24ndCBzdXBwb3J0IGJpbmFyeSB2YWx1ZXMsIGFuZCBqczJweSBkb2Vzbid0IGFsbG93IG1lIHRvIG92ZXJyaWRlIHRoZSBgYE51bWJlcmBgIGNsYXNzLiBTbywgZGVmaW5lIHRoZSB3b3JrYXJvdW5kIGNsYXNzIGBgTnVtYmVyX2BgIGFuZCB1c2UgaXQgaWYgYXZhaWxhYmxlLlxuICAgIGlmIChjb252ZXJ0ZXIgPT09IE51bWJlciAmJiB0eXBlb2YgTnVtYmVyXyAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBjb252ZXJ0ZXIgPSBOdW1iZXJfO1xuICAgIH1cblxuICAgIC8vIFJldHVybiB0aGUgY29udmVydGVkIHR5cGUuIElmIHRoZSBjb252ZXJ0ZXIgcmFpc2VzIGEgVHlwZUVycm9yLCByZXR1cm4gdGhhdDsgaXQgd2lsbCBiZSBkaXNwbGF5ZWQgdG8gdGhlIHVzZXIsIHNpbmNlIHdlIGFzc3VtZSB0eXBlIGVycm9ycyBhcmUgYSB3YXkgZm9yIHRoZSBwYXJzZXIgdG8gZXhwbGFpbiB0byB0aGUgdXNlciB3aHkgdGhlIHBhcnNlIGZhaWxlZC4gRm9yIGFsbCBvdGhlciBlcnJvcnMsIHJlLXRocm93IGl0IHNpbmNlIHNvbWV0aGluZyB3ZW50IHdyb25nLlxuICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBjb252ZXJ0ZXIodmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8vIEEgcGFzcy10aHJvdWdoIFwiY29udmVydGVyXCIuXG5mdW5jdGlvbiBwYXNzX3Rocm91Z2godmFsKSB7XG4gICAgcmV0dXJuIHZhbDtcbn1cbiIsIi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyB8ZG9jbmFtZXwgLS0gZmlsbC1pbi10aGUtYmxhbmsgY2xpZW50LXNpZGUgY29kZVxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFRoaXMgZmlsZSBjb250YWlucyB0aGUgSlMgZm9yIHRoZSBSdW5lc3RvbmUgZmlsbGludGhlYmxhbmsgY29tcG9uZW50LiBJdCB3YXMgY3JlYXRlZCBCeSBJc2FpYWggTWF5ZXJjaGFrIGFuZCBLaXJieSBPbHNvbiwgNi80LzE1IHRoZW4gcmV2aXNlZCBieSBCcmFkIE1pbGxlciwgMi83LzIwLlxuLy9cbi8vIERhdGEgc3RvcmFnZSBub3Rlc1xuLy8gPT09PT09PT09PT09PT09PT09XG4vL1xuLy8gSW5pdGlhbCBwcm9ibGVtIHJlc3RvcmVcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBJbiB0aGUgY29uc3RydWN0b3IsIHRoaXMgY29kZSAodGhlIGNsaWVudCkgcmVzdG9yZXMgdGhlIHByb2JsZW0gYnkgY2FsbGluZyBgYGNoZWNrU2VydmVyYGAuIFRvIGRvIHNvLCBlaXRoZXIgdGhlIHNlcnZlciBzZW5kcyBvciBsb2NhbCBzdG9yYWdlIGhhczpcbi8vXG4vLyAtICAgIHNlZWQgKHVzZWQgb25seSBmb3IgZHluYW1pYyBwcm9ibGVtcylcbi8vIC0gICAgYW5zd2VyXG4vLyAtICAgIGRpc3BsYXlGZWVkIChzZXJ2ZXItc2lkZSBncmFkaW5nIG9ubHk7IG90aGVyd2lzZSwgdGhpcyBpcyBnZW5lcmF0ZWQgbG9jYWxseSBieSBjbGllbnQgY29kZSlcbi8vIC0gICAgY29ycmVjdCAoU1NHKVxuLy8gLSAgICBpc0NvcnJlY3RBcnJheSAoU1NHKVxuLy8gLSAgICBwcm9ibGVtSHRtbCAoU1NHIHdpdGggZHluYW1pYyBwcm9ibGVtcyBvbmx5KVxuLy9cbi8vIElmIGFueSBvZiB0aGUgYW5zd2VycyBhcmUgY29ycmVjdCwgdGhlbiB0aGUgY2xpZW50IHNob3dzIGZlZWRiYWNrLiBUaGlzIGlzIGltcGxlbWVudGVkIGluIHJlc3RvcmVBbnN3ZXJzXy5cbi8vXG4vLyBHcmFkaW5nXG4vLyAtLS0tLS0tXG4vLyBXaGVuIHRoZSB1c2VyIHByZXNzZXMgdGhlIFwiQ2hlY2sgbWVcIiBidXR0b24sIHRoZSBsb2dDdXJyZW50QW5zd2VyXyBmdW5jdGlvbjpcbi8vXG4vLyAtICAgIFNhdmVzIHRoZSBmb2xsb3dpbmcgdG8gbG9jYWwgc3RvcmFnZTpcbi8vXG4vLyAgICAgIC0gICBzZWVkXG4vLyAgICAgIC0gICBhbnN3ZXJcbi8vICAgICAgLSAgIHRpbWVzdGFtcFxuLy8gICAgICAtICAgcHJvYmxlbUh0bWxcbi8vXG4vLyAgICAgIE5vdGUgdGhhdCB0aGVyZSdzIG5vIHBvaW50IGluIHNhdmluZyBkaXNwbGF5RmVlZCwgY29ycmVjdCwgb3IgaXNDb3JyZWN0QXJyYXksIHNpbmNlIHRoZXNlIHZhbHVlcyBhcHBsaWVkIHRvIHRoZSBwcmV2aW91cyBhbnN3ZXIsIG5vdCB0aGUgbmV3IGFuc3dlciBqdXN0IHN1Ym1pdHRlZC5cbi8vXG4vLyAtICAgIFNlbmRzIHRoZSBmb2xsb3dpbmcgdG8gdGhlIHNlcnZlcjsgc3RvcCBhZnRlciB0aGlzIGZvciBjbGllbnQtc2lkZSBncmFkaW5nOlxuLy9cbi8vICAgICAgLSAgIHNlZWQgKGlnbm9yZWQgZm9yIHNlcnZlci1zaWRlIGdyYWRpbmcpXG4vLyAgICAgIC0gICBhbnN3ZXJcbi8vICAgICAgLSAgIGNvcnJlY3QgKGlnbm9yZWQgZm9yIFNTRylcbi8vICAgICAgLSAgIHBlcmNlbnQgKGlnbm9yZWQgZm9yIFNTRylcbi8vXG4vLyAtICAgIFJlY2VpdmVzIHRoZSBmb2xsb3dpbmcgZnJvbSB0aGUgc2VydmVyOlxuLy9cbi8vICAgICAgLSAgIHRpbWVzdGFtcFxuLy8gICAgICAtICAgZGlzcGxheUZlZWRcbi8vICAgICAgLSAgIGNvcnJlY3Rcbi8vICAgICAgLSAgIGlzQ29ycmVjdEFycmF5XG4vL1xuLy8gLSAgICBTYXZlcyB0aGUgZm9sbG93aW5nIHRvIGxvY2FsIHN0b3JhZ2U6XG4vL1xuLy8gICAgICAtICAgc2VlZFxuLy8gICAgICAtICAgYW5zd2VyXG4vLyAgICAgIC0gICB0aW1lc3RhbXBcbi8vICAgICAgLSAgIGRpc3BsYXlGZWVkIChTU0cgb25seSlcbi8vICAgICAgLSAgIGNvcnJlY3QgKFNTRyBvbmx5KVxuLy8gICAgICAtICAgaXNDb3JyZWN0QXJyYXkgKFNTRyBvbmx5KVxuLy8gICAgICAtICAgcHJvYmxlbUh0bWxcbi8vXG4vLyBSYW5kb21pemVcbi8vIC0tLS0tLS0tLVxuLy8gV2hlbiB0aGUgdXNlciBwcmVzc2VzIHRoZSBcIlJhbmRvbWl6ZVwiIGJ1dHRvbiAod2hpY2ggaXMgb25seSBhdmFpbGFibGUgZm9yIGR5bmFtaWMgcHJvYmxlbXMpLCB0aGUgcmFuZG9taXplXyBmdW5jdGlvbjpcbi8vXG4vLyAtICAgIEZvciB0aGUgY2xpZW50LXNpZGUgY2FzZSwgc2V0cyB0aGUgc2VlZCB0byBhIG5ldywgcmFuZG9tIHZhbHVlLiBGb3IgdGhlIHNlcnZlci1zaWRlIGNhc2UsIHJlcXVlc3RzIGEgbmV3IHNlZWQgYW5kIHByb2JsZW1IdG1sIGZyb20gdGhlIHNlcnZlci5cbi8vIC0gICAgU2V0cyB0aGUgYW5zd2VyIHRvIGFuIGFycmF5IG9mIGVtcHR5IHN0cmluZ3MuXG4vLyAtICAgIFNhdmVzIHRoZSB1c3VhbCBsb2NhbCBkYXRhLlxuXG5cInVzZSBzdHJpY3RcIjtcblxuaW1wb3J0IFJ1bmVzdG9uZUJhc2UgZnJvbSBcIi4uLy4uL2NvbW1vbi9qcy9ydW5lc3RvbmViYXNlLmpzXCI7XG5pbXBvcnQge1xuICByZW5kZXJEeW5hbWljQ29udGVudCxcbiAgY2hlY2tBbnN3ZXJzQ29yZSxcbiAgcmVuZGVyRHluYW1pY0ZlZWRiYWNrLFxufSBmcm9tIFwiLi9maXRiLXV0aWxzLmpzXCI7XG5pbXBvcnQgXCIuL2ZpdGItaTE4bi5lbi5qc1wiO1xuaW1wb3J0IFwiLi9maXRiLWkxOG4ucHQtYnIuanNcIjtcbmltcG9ydCBcIi4uL2Nzcy9maXRiLmNzc1wiO1xuXG4vLyBPYmplY3QgY29udGFpbmluZyBhbGwgaW5zdGFuY2VzIG9mIEZJVEIgdGhhdCBhcmVuJ3QgYSBjaGlsZCBvZiBhIHRpbWVkIGFzc2Vzc21lbnQuXG5leHBvcnQgdmFyIEZJVEJMaXN0ID0ge307XG5cbi8vIEZJVEIgY29uc3RydWN0b3JcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZJVEIgZXh0ZW5kcyBSdW5lc3RvbmVCYXNlIHtcbiAgY29uc3RydWN0b3Iob3B0cykge1xuICAgIHN1cGVyKG9wdHMpO1xuICAgIHZhciBvcmlnID0gb3B0cy5vcmlnOyAvLyBlbnRpcmUgPHA+IGVsZW1lbnRcbiAgICB0aGlzLnVzZVJ1bmVzdG9uZVNlcnZpY2VzID0gb3B0cy51c2VSdW5lc3RvbmVTZXJ2aWNlcztcbiAgICB0aGlzLm9yaWdFbGVtID0gb3JpZztcbiAgICB0aGlzLmRpdmlkID0gb3JpZy5pZDtcbiAgICB0aGlzLmNvcnJlY3QgPSBudWxsO1xuICAgIC8vIFNlZSBjb21tZW50cyBpbiBmaXRiLnB5IGZvciB0aGUgZm9ybWF0IG9mIGBgZmVlZGJhY2tBcnJheWBgICh3aGljaCBpcyBpZGVudGljYWwgaW4gYm90aCBmaWxlcykuXG4gICAgLy9cbiAgICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBhbmQgcGFyc2UgaXQuIFNlZSBgU08gPGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzkzMjA0MjcvYmVzdC1wcmFjdGljZS1mb3ItZW1iZWRkaW5nLWFyYml0cmFyeS1qc29uLWluLXRoZS1kb20+YF9fLiBJZiB0aGlzIHRhZyBkb2Vzbid0IGV4aXN0LCB0aGVuIG5vIGZlZWRiYWNrIGlzIGF2YWlsYWJsZTsgc2VydmVyLXNpZGUgZ3JhZGluZyB3aWxsIGJlIHBlcmZvcm1lZC5cbiAgICAvL1xuICAgIC8vIEEgZGVzdHJ1Y3R1cmluZyBhc3NpZ25tZW50IHdvdWxkIGJlIHBlcmZlY3QsIGJ1dCB0aGV5IGRvbid0IHdvcmsgd2l0aCBgYHRoaXMuYmxhaGBgIGFuZCBgYHdpdGhgYCBzdGF0ZW1lbnRzIGFyZW4ndCBzdXBwb3J0ZWQgaW4gc3RyaWN0IG1vZGUuXG4gICAgY29uc3QganNvbl9lbGVtZW50ID0gdGhpcy5zY3JpcHRTZWxlY3Rvcih0aGlzLm9yaWdFbGVtKTtcbiAgICBjb25zdCBkaWN0XyA9IEpTT04ucGFyc2UoanNvbl9lbGVtZW50Lmh0bWwoKSk7XG4gICAganNvbl9lbGVtZW50LnJlbW92ZSgpO1xuICAgIHRoaXMucHJvYmxlbUh0bWwgPSBkaWN0Xy5wcm9ibGVtSHRtbDtcbiAgICB0aGlzLmR5bl92YXJzID0gZGljdF8uZHluX3ZhcnM7XG4gICAgdGhpcy5ibGFua05hbWVzID0gZGljdF8uYmxhbmtOYW1lcztcbiAgICB0aGlzLmZlZWRiYWNrQXJyYXkgPSBkaWN0Xy5mZWVkYmFja0FycmF5O1xuXG4gICAgdGhpcy5jcmVhdGVGSVRCRWxlbWVudCgpO1xuICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICB0aGlzLmNhcHRpb24gPSBcIkZpbGwgaW4gdGhlIEJsYW5rXCI7XG4gICAgdGhpcy5hZGRDYXB0aW9uKFwicnVuZXN0b25lXCIpO1xuICAgIHRoaXMuY2hlY2tTZXJ2ZXIoXCJmaWxsYlwiLCBmYWxzZSkudGhlbigoKSA9PiB7XG4gICAgICAvLyBJZiB0aGVyZSdzIG5vIHNlZWQgZm9yIGEgY2xpZW50LXNpZGUgZHluYW1pYyBwcm9ibGVtIGFmdGVyIHRoaXMgY2hlY2ssIGNyZWF0ZSBvbmUgYW5kIHJlbmRlciBpdC5cbiAgICAgIGlmICh0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIiAmJiB0aGlzLnNlZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnJhbmRvbWl6ZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5pbmRpY2F0ZV9jb21wb25lbnRfcmVhZHkoKTtcbiAgICB9KTtcbiAgfVxuICAvLyBGaW5kIHRoZSBzY3JpcHQgdGFnIGNvbnRhaW5pbmcgSlNPTiBpbiBhIGdpdmVuIHJvb3QgRE9NIG5vZGUuXG4gIHNjcmlwdFNlbGVjdG9yKHJvb3Rfbm9kZSkge1xuICAgIHJldHVybiAkKHJvb3Rfbm9kZSkuZmluZChgc2NyaXB0W3R5cGU9XCJhcHBsaWNhdGlvbi9qc29uXCJdYCk7XG4gIH1cbiAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09PSAgIEZ1bmN0aW9ucyBnZW5lcmF0aW5nIGZpbmFsIEhUTUwgICA9PT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gIGNyZWF0ZUZJVEJFbGVtZW50KCkge1xuICAgIHRoaXMucmVuZGVyRklUQklucHV0KCk7XG4gICAgdGhpcy5yZW5kZXJGSVRCQnV0dG9ucygpO1xuICAgIHRoaXMucmVuZGVyRklUQkZlZWRiYWNrRGl2KCk7XG4gICAgLy8gcmVwbGFjZXMgdGhlIGludGVybWVkaWF0ZSBIVE1MIGZvciB0aGlzIGNvbXBvbmVudCB3aXRoIHRoZSByZW5kZXJlZCBIVE1MIG9mIHRoaXMgY29tcG9uZW50XG4gICAgJCh0aGlzLm9yaWdFbGVtKS5yZXBsYWNlV2l0aCh0aGlzLmNvbnRhaW5lckRpdik7XG4gIH1cbiAgcmVuZGVyRklUQklucHV0KCkge1xuICAgIC8vIFRoZSB0ZXh0IFtpbnB1dF0gZWxlbWVudHMgYXJlIGNyZWF0ZWQgYnkgdGhlIHRlbXBsYXRlLlxuICAgIHRoaXMuY29udGFpbmVyRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAkKHRoaXMuY29udGFpbmVyRGl2KS5hZGRDbGFzcyhcImFsZXJ0IGFsZXJ0LXdhcm5pbmdcIik7XG4gICAgdGhpcy5jb250YWluZXJEaXYuaWQgPSB0aGlzLmRpdmlkO1xuICAgIC8vIENyZWF0ZSBhbm90aGVyIGNvbnRhaW5lciB3aGljaCBzdG9yZXMgdGhlIHByb2JsZW0gZGVzY3JpcHRpb24uXG4gICAgdGhpcy5kZXNjcmlwdGlvbkRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgLy8gQ29weSB0aGUgb3JpZ2luYWwgZWxlbWVudHMgdG8gdGhlIGNvbnRhaW5lciBob2xkaW5nIHdoYXQgdGhlIHVzZXIgd2lsbCBzZWUgKGNsaWVudC1zaWRlIGdyYWRpbmcgb25seSkuXG4gICAgaWYgKHRoaXMucHJvYmxlbUh0bWwpIHtcbiAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICAgIC8vIFNhdmUgb3JpZ2luYWwgSFRNTCAod2l0aCB0ZW1wbGF0ZXMpIHVzZWQgaW4gZHluYW1pYyBwcm9ibGVtcy5cbiAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYub3JpZ0lubmVySFRNTCA9IHRoaXMucHJvYmxlbUh0bWw7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRklUQkJ1dHRvbnMoKSB7XG4gICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnJcIikpO1xuXG4gICAgLy8gXCJzdWJtaXRcIiBidXR0b25cbiAgICB0aGlzLnN1Ym1pdEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgdGhpcy5zdWJtaXRCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfZml0Yl9jaGVja19tZVwiKTtcbiAgICAkKHRoaXMuc3VibWl0QnV0dG9uKS5hdHRyKHtcbiAgICAgIGNsYXNzOiBcImJ0biBidG4tc3VjY2Vzc1wiLFxuICAgICAgbmFtZTogXCJkbyBhbnN3ZXJcIixcbiAgICAgIHR5cGU6IFwiYnV0dG9uXCIsXG4gICAgfSk7XG4gICAgdGhpcy5zdWJtaXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwiY2xpY2tcIixcbiAgICAgIGFzeW5jIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jaGVja0N1cnJlbnRBbnN3ZXIoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5sb2dDdXJyZW50QW5zd2VyKCk7XG4gICAgICB9LmJpbmQodGhpcyksXG4gICAgICBmYWxzZVxuICAgICk7XG4gICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5zdWJtaXRCdXR0b24pO1xuXG4gICAgLy8gXCJjb21wYXJlIG1lXCIgYnV0dG9uXG4gICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAkKHRoaXMuY29tcGFyZUJ1dHRvbikuYXR0cih7XG4gICAgICAgIGNsYXNzOiBcImJ0biBidG4tZGVmYXVsdFwiLFxuICAgICAgICBpZDogdGhpcy5vcmlnRWxlbS5pZCArIFwiX2Jjb21wXCIsXG4gICAgICAgIGRpc2FibGVkOiBcIlwiLFxuICAgICAgICBuYW1lOiBcImNvbXBhcmVcIixcbiAgICAgIH0pO1xuICAgICAgdGhpcy5jb21wYXJlQnV0dG9uLnRleHRDb250ZW50ID0gJC5pMThuKFwibXNnX2ZpdGJfY29tcGFyZV9tZVwiKTtcbiAgICAgIHRoaXMuY29tcGFyZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLmNvbXBhcmVGSVRCQW5zd2VycygpO1xuICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5jb21wYXJlQnV0dG9uKTtcbiAgICB9XG5cbiAgICAvLyBSYW5kb21pemUgYnV0dG9uIGZvciBkeW5hbWljIHByb2JsZW1zLlxuICAgIGlmICh0aGlzLmR5bl92YXJzKSB7XG4gICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICAkKHRoaXMucmFuZG9taXplQnV0dG9uKS5hdHRyKHtcbiAgICAgICAgY2xhc3M6IFwiYnRuIGJ0bi1kZWZhdWx0XCIsXG4gICAgICAgIGlkOiB0aGlzLm9yaWdFbGVtLmlkICsgXCJfYmNvbXBcIixcbiAgICAgICAgbmFtZTogXCJyYW5kb21pemVcIixcbiAgICAgIH0pO1xuICAgICAgdGhpcy5yYW5kb21pemVCdXR0b24udGV4dENvbnRlbnQgPSAkLmkxOG4oXCJtc2dfZml0Yl9yYW5kb21pemVcIik7XG4gICAgICB0aGlzLnJhbmRvbWl6ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB0aGlzLnJhbmRvbWl6ZSgpO1xuICAgICAgICB9LmJpbmQodGhpcyksXG4gICAgICAgIGZhbHNlXG4gICAgICApO1xuICAgICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQodGhpcy5yYW5kb21pemVCdXR0b24pO1xuICAgIH1cblxuICAgIHRoaXMuY29udGFpbmVyRGl2LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO1xuICB9XG4gIHJlbmRlckZJVEJGZWVkYmFja0RpdigpIHtcbiAgICB0aGlzLmZlZWRCYWNrRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICB0aGlzLmZlZWRCYWNrRGl2LmlkID0gdGhpcy5kaXZpZCArIFwiX2ZlZWRiYWNrXCI7XG4gICAgdGhpcy5jb250YWluZXJEaXYuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJyXCIpKTtcbiAgICB0aGlzLmNvbnRhaW5lckRpdi5hcHBlbmRDaGlsZCh0aGlzLmZlZWRCYWNrRGl2KTtcbiAgfVxuXG4gIGNsZWFyRmVlZGJhY2tEaXYoKSB7XG4gICAgLy8gU2V0dGluZyB0aGUgYGBvdXRlckhUTUxgYCByZW1vdmVzIHRoaXMgZnJvbSB0aGUgRE9NLiBVc2UgYW4gYWx0ZXJuYXRpdmUgcHJvY2VzcyAtLSByZW1vdmUgdGhlIGNsYXNzICh3aGljaCBtYWtlcyBpdCByZWQvZ3JlZW4gYmFzZWQgb24gZ3JhZGluZykgYW5kIGNvbnRlbnQuXG4gICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHRoaXMuZmVlZEJhY2tEaXYuY2xhc3NOYW1lID0gXCJcIjtcbiAgfVxuXG4gIC8vIFVwZGF0ZSB0aGUgcHJvYmxlbSdzIGRlc2NyaXB0aW9uIGJhc2VkIG9uIGR5bmFtaWNhbGx5LWdlbmVyYXRlZCBjb250ZW50LlxuICByZW5kZXJEeW5hbWljQ29udGVudCgpIHtcbiAgICAvLyBgYHRoaXMuZHluX3ZhcnNgYCBjYW4gYmUgdHJ1ZTsgaWYgc28sIGRvbid0IHJlbmRlciBpdCwgc2luY2UgdGhlIHNlcnZlciBkb2VzIGFsbCB0aGUgcmVuZGVyaW5nLlxuICAgIGlmICh0eXBlb2YgdGhpcy5keW5fdmFycyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgW3RoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MLCB0aGlzLmR5bl92YXJzX2V2YWxdID1cbiAgICAgICAgcmVuZGVyRHluYW1pY0NvbnRlbnQoXG4gICAgICAgICAgdGhpcy5zZWVkLFxuICAgICAgICAgIHRoaXMuZHluX3ZhcnMsXG4gICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbkRpdi5vcmlnSW5uZXJIVE1MLFxuICAgICAgICAgIHRoaXMuZGl2aWQsXG4gICAgICAgICAgdGhpcy5wcmVwYXJlQ2hlY2tBbnN3ZXJzLmJpbmQodGhpcyksXG4gICAgICAgICk7XG5cbiAgICAgIGlmICh0eXBlb2YodGhpcy5keW5fdmFyc19ldmFsLmFmdGVyQ29udGVudFJlbmRlcikgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoaXMuZHluX3ZhcnNfZXZhbC5hZnRlckNvbnRlbnRSZW5kZXIodGhpcy5keW5fdmFyc19ldmFsKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coYEVycm9yIGluIHByb2JsZW0gJHt0aGlzLmRpdmlkfSBpbnZva2luZyBhZnRlckNvbnRlbnRSZW5kZXJgKTtcbiAgICAgICAgICB0aHJvdyBlcnI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgICB0aGlzLnNldHVwQmxhbmtzKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0dXBCbGFua3MoKSB7XG4gICAgLy8gRmluZCBhbmQgZm9ybWF0IHRoZSBibGFua3MuIElmIGEgZHluYW1pYyBwcm9ibGVtIGp1c3QgY2hhbmdlZCB0aGUgSFRNTCwgdGhpcyB3aWxsIGZpbmQgdGhlIG5ld2x5LWNyZWF0ZWQgYmxhbmtzLlxuICAgIGNvbnN0IGJhID0gJCh0aGlzLmRlc2NyaXB0aW9uRGl2KS5maW5kKFwiOmlucHV0XCIpO1xuICAgIGJhLmF0dHIoXCJjbGFzc1wiLCBcImZvcm0gZm9ybS1jb250cm9sIHNlbGVjdHdpZHRoYXV0b1wiKTtcbiAgICBiYS5hdHRyKFwiYXJpYS1sYWJlbFwiLCBcImlucHV0IGFyZWFcIik7XG4gICAgdGhpcy5ibGFua0FycmF5ID0gYmEudG9BcnJheSgpO1xuICAgIGZvciAobGV0IGJsYW5rIG9mIHRoaXMuYmxhbmtBcnJheSkge1xuICAgICAgJChibGFuaykuY2hhbmdlKHRoaXMucmVjb3JkQW5zd2VyZWQuYmluZCh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgLy8gVGhpcyB0ZWxscyB0aW1lZCBxdWVzdGlvbnMgdGhhdCB0aGUgZml0YiBibGFua3MgcmVjZWl2ZWQgc29tZSBpbnRlcmFjdGlvbi5cbiAgcmVjb3JkQW5zd2VyZWQoKSB7XG4gICAgdGhpcy5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICA9PT0gQ2hlY2tpbmcvbG9hZGluZyBmcm9tIHN0b3JhZ2UgPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICAvLyBfYHJlc3RvcmVBbnN3ZXJzYDogdXBkYXRlIHRoZSBwcm9ibGVtIHdpdGggZGF0YSBmcm9tIHRoZSBzZXJ2ZXIgb3IgZnJvbSBsb2NhbCBzdG9yYWdlLlxuICByZXN0b3JlQW5zd2VycyhkYXRhKSB7XG4gICAgLy8gUmVzdG9yZSB0aGUgc2VlZCBmaXJzdCwgc2luY2UgdGhlIGR5bmFtaWMgcmVuZGVyIGNsZWFycyBhbGwgdGhlIGJsYW5rcy5cbiAgICB0aGlzLnNlZWQgPSBkYXRhLnNlZWQ7XG4gICAgdGhpcy5yZW5kZXJEeW5hbWljQ29udGVudCgpO1xuXG4gICAgdmFyIGFycjtcbiAgICAvLyBSZXN0b3JlIGFuc3dlcnMgZnJvbSBzdG9yYWdlIHJldHJpZXZhbCBkb25lIGluIFJ1bmVzdG9uZUJhc2UuXG4gICAgdHJ5IHtcbiAgICAgIC8vIFRoZSBuZXdlciBmb3JtYXQgZW5jb2RlcyBkYXRhIGFzIGEgSlNPTiBvYmplY3QuXG4gICAgICBhcnIgPSBKU09OLnBhcnNlKGRhdGEuYW5zd2VyKTtcbiAgICAgIC8vIFRoZSByZXN1bHQgc2hvdWxkIGJlIGFuIGFycmF5LiBJZiBub3QsIHRyeSBjb21tYSBwYXJzaW5nIGluc3RlYWQuXG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoYXJyKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIC8vIFRoZSBvbGQgZm9ybWF0IGRpZG4ndC5cbiAgICAgIGFyciA9IChkYXRhLmFuc3dlciB8fCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgfVxuICAgIGxldCBoYXNBbnN3ZXIgPSBmYWxzZTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbaV0pLmF0dHIoXCJ2YWx1ZVwiLCBhcnJbaV0pO1xuICAgICAgaWYgKGFycltpXSkge1xuICAgICAgICBoYXNBbnN3ZXIgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICAvLyBJcyB0aGlzIGNsaWVudC1zaWRlIGdyYWRpbmcsIG9yIHNlcnZlci1zaWRlIGdyYWRpbmc/XG4gICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgLy8gRm9yIGNsaWVudC1zaWRlIGdyYWRpbmcsIHJlLWdlbmVyYXRlIGZlZWRiYWNrIGlmIHRoZXJlJ3MgYW4gYW5zd2VyLlxuICAgICAgaWYgKGhhc0Fuc3dlcikge1xuICAgICAgICB0aGlzLmNoZWNrQ3VycmVudEFuc3dlcigpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGb3Igc2VydmVyLXNpZGUgZ3JhZGluZywgdXNlIHRoZSBwcm92aWRlZCBmZWVkYmFjayBmcm9tIHRoZSBzZXJ2ZXIgb3IgbG9jYWwgc3RvcmFnZS5cbiAgICAgIHRoaXMuZGlzcGxheUZlZWQgPSBkYXRhLmRpc3BsYXlGZWVkO1xuICAgICAgdGhpcy5jb3JyZWN0ID0gZGF0YS5jb3JyZWN0O1xuICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IGRhdGEuaXNDb3JyZWN0QXJyYXk7XG4gICAgICAvLyBPbmx5IHJlbmRlciBpZiBhbGwgdGhlIGRhdGEgaXMgcHJlc2VudDsgbG9jYWwgc3RvcmFnZSBtaWdodCBoYXZlIG9sZCBkYXRhIG1pc3Npbmcgc29tZSBvZiB0aGVzZSBpdGVtcy5cbiAgICAgIGlmIChcbiAgICAgICAgdHlwZW9mIHRoaXMuZGlzcGxheUZlZWQgIT09IFwidW5kZWZpbmVkXCIgJiZcbiAgICAgICAgdHlwZW9mIHRoaXMuY29ycmVjdCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICB0eXBlb2YgdGhpcy5pc0NvcnJlY3RBcnJheSAhPT0gXCJ1bmRlZmluZWRcIlxuICAgICAgKSB7XG4gICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgIH1cbiAgICAgIC8vIEZvciBzZXJ2ZXItc2lkZSBkeW5hbWljIHByb2JsZW1zLCBzaG93IHRoZSByZW5kZXJlZCBwcm9ibGVtIHRleHQuXG4gICAgICB0aGlzLnByb2JsZW1IdG1sID0gZGF0YS5wcm9ibGVtSHRtbDtcbiAgICAgIGlmICh0aGlzLnByb2JsZW1IdG1sKSB7XG4gICAgICAgIHRoaXMuZGVzY3JpcHRpb25EaXYuaW5uZXJIVE1MID0gdGhpcy5wcm9ibGVtSHRtbDtcbiAgICAgICAgdGhpcy5xdWV1ZU1hdGhKYXgodGhpcy5kZXNjcmlwdGlvbkRpdik7XG4gICAgICAgIHRoaXMuc2V0dXBCbGFua3MoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjaGVja0xvY2FsU3RvcmFnZSgpIHtcbiAgICAvLyBMb2FkcyBwcmV2aW91cyBhbnN3ZXJzIGZyb20gbG9jYWwgc3RvcmFnZSBpZiB0aGV5IGV4aXN0XG4gICAgdmFyIHN0b3JlZERhdGE7XG4gICAgaWYgKHRoaXMuZ3JhZGVyYWN0aXZlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciBsZW4gPSBsb2NhbFN0b3JhZ2UubGVuZ3RoO1xuICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICB2YXIgZXggPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSh0aGlzLmxvY2FsU3RvcmFnZUtleSgpKTtcbiAgICAgIGlmIChleCAhPT0gbnVsbCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHN0b3JlZERhdGEgPSBKU09OLnBhcnNlKGV4KTtcbiAgICAgICAgICB2YXIgYXJyID0gc3RvcmVkRGF0YS5hbnN3ZXI7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIC8vIGVycm9yIHdoaWxlIHBhcnNpbmc7IGxpa2VseSBkdWUgdG8gYmFkIHZhbHVlIHN0b3JlZCBpbiBzdG9yYWdlXG4gICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxTdG9yYWdlS2V5KCkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlc3RvcmVBbnN3ZXJzKHN0b3JlZERhdGEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldExvY2FsU3RvcmFnZShkYXRhKSB7XG4gICAgbGV0IGtleSA9IHRoaXMubG9jYWxTdG9yYWdlS2V5KCk7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCBKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIH1cblxuICBjaGVja0N1cnJlbnRBbnN3ZXIoKSB7XG4gICAgLy8gU3RhcnQgb2YgdGhlIGV2YWx1YXRpb24gY2hhaW5cbiAgICB0aGlzLmlzQ29ycmVjdEFycmF5ID0gW107XG4gICAgdGhpcy5kaXNwbGF5RmVlZCA9IFtdO1xuICAgIGNvbnN0IHBjYSA9IHRoaXMucHJlcGFyZUNoZWNrQW5zd2VycygpO1xuXG4gICAgaWYgKHRoaXMudXNlUnVuZXN0b25lU2VydmljZXMpIHtcbiAgICAgIGlmIChlQm9va0NvbmZpZy5lbmFibGVDb21wYXJlTWUpIHtcbiAgICAgICAgdGhpcy5lbmFibGVDb21wYXJlQnV0dG9uKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gR3JhZGUgbG9jYWxseSBpZiB3ZSBjYW4ndCBhc2sgdGhlIHNlcnZlciB0byBncmFkZS5cbiAgICBpZiAodGhpcy5mZWVkYmFja0FycmF5KSB7XG4gICAgICAgIFtcbiAgICAgICAgICAvLyBBbiBhcnJheSBvZiBIVE1MIGZlZWRiYWNrLlxuICAgICAgICAgIHRoaXMuZGlzcGxheUZlZWQsXG4gICAgICAgICAgLy8gdHJ1ZSwgZmFsc2UsIG9yIG51bGwgKHRoZSBxdWVzdGlvbiB3YXNuJ3QgYW5zd2VyZWQpLlxuICAgICAgICAgIHRoaXMuY29ycmVjdCxcbiAgICAgICAgICAvLyBBbiBhcnJheSBvZiB0cnVlLCBmYWxzZSwgb3IgbnVsbCAodGhlIHF1ZXN0aW9uIHdhc24ndCBhbnN3ZXJlZCkuXG4gICAgICAgICAgdGhpcy5pc0NvcnJlY3RBcnJheSxcbiAgICAgICAgICB0aGlzLnBlcmNlbnRcbiAgICAgICAgXSA9IGNoZWNrQW5zd2Vyc0NvcmUoLi4ucGNhKTtcbiAgICAgIGlmICghdGhpcy5pc1RpbWVkKSB7XG4gICAgICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBJbnB1dHM6XG4gIC8vXG4gIC8vIC0gU3RyaW5ncyBlbnRlcmVkIGJ5IHRoZSBzdHVkZW50IGluIGBgdGhpcy5ibGFua0FycmF5W2ldLnZhbHVlYGAuXG4gIC8vIC0gRmVlZGJhY2sgaW4gYGB0aGlzLmZlZWRiYWNrQXJyYXlgYC5cbiAgcHJlcGFyZUNoZWNrQW5zd2VycygpIHtcbiAgICB0aGlzLmdpdmVuX2FyciA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKVxuICAgICAgdGhpcy5naXZlbl9hcnIucHVzaCh0aGlzLmJsYW5rQXJyYXlbaV0udmFsdWUpO1xuICAgIHJldHVybiBbdGhpcy5ibGFua05hbWVzLCB0aGlzLmdpdmVuX2FyciwgdGhpcy5mZWVkYmFja0FycmF5LCB0aGlzLmR5bl92YXJzX2V2YWxdO1xuICB9XG5cbiAgLy8gX2ByYW5kb21pemVgOiBUaGlzIGhhbmRsZXMgYSBjbGljayB0byB0aGUgXCJSYW5kb21pemVcIiBidXR0b24uXG4gIGFzeW5jIHJhbmRvbWl6ZSgpIHtcbiAgICAvLyBVc2UgdGhlIGNsaWVudC1zaWRlIGNhc2Ugb3IgdGhlIHNlcnZlci1zaWRlIGNhc2U/XG4gICAgaWYgKHRoaXMuZmVlZGJhY2tBcnJheSkge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgY2xpZW50LXNpZGUgY2FzZS5cbiAgICAgIC8vXG4gICAgICB0aGlzLnNlZWQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyICoqIDMyKTtcbiAgICAgIHRoaXMucmVuZGVyRHluYW1pY0NvbnRlbnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVGhpcyBpcyB0aGUgc2VydmVyLXNpZGUgY2FzZS4gU2VuZCBhIHJlcXVlc3QgdG8gdGhlIGByZXN1bHRzIDxnZXRBc3Nlc3NSZXN1bHRzPmAgZW5kcG9pbnQgd2l0aCBgYG5ld19zZWVkYGAgc2V0IHRvIFRydWUuXG4gICAgICBjb25zdCByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoXCIvYXNzZXNzbWVudC9yZXN1bHRzXCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgICAgICBjb3Vyc2U6IGVCb29rQ29uZmlnLmNvdXJzZSxcbiAgICAgICAgICBldmVudDogXCJmaWxsYlwiLFxuICAgICAgICAgIHNpZDogdGhpcy5zaWQsXG4gICAgICAgICAgbmV3X3NlZWQ6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgICBoZWFkZXJzOiB0aGlzLmpzb25IZWFkZXJzLFxuICAgICAgfSk7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHJlcXVlc3QpO1xuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBhbGVydChgSFRUUCBlcnJvciBnZXR0aW5nIHJlc3VsdHM6ICR7cmVzcG9uc2Uuc3RhdHVzVGV4dH1gKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgZGF0YSA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICAgIGNvbnN0IHJlcyA9IGRhdGEuZGV0YWlsO1xuICAgICAgdGhpcy5zZWVkID0gcmVzLnNlZWQ7XG4gICAgICB0aGlzLmRlc2NyaXB0aW9uRGl2LmlubmVySFRNTCA9IHJlcy5wcm9ibGVtSHRtbDtcbiAgICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZGVzY3JpcHRpb25EaXYpO1xuICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgIH1cbiAgICAvLyBXaGVuIGdldHRpbmcgYSBuZXcgc2VlZCwgY2xlYXIgYWxsIHRoZSBvbGQgYW5zd2VycyBhbmQgZmVlZGJhY2suXG4gICAgdGhpcy5naXZlbl9hcnIgPSBBcnJheSh0aGlzLmJsYW5rQXJyYXkubGVuKS5maWxsKFwiXCIpO1xuICAgICQodGhpcy5ibGFua0FycmF5KS5hdHRyKFwidmFsdWVcIiwgXCJcIik7XG4gICAgdGhpcy5jbGVhckZlZWRiYWNrRGl2KCk7XG4gICAgdGhpcy5zYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCk7XG4gIH1cblxuICAvLyBTYXZlIHRoZSBhbnN3ZXJzIGFuZCBhc3NvY2lhdGVkIGRhdGEgbG9jYWxseTsgZG9uJ3Qgc2F2ZSBmZWVkYmFjayBwcm92aWRlZCBieSB0aGUgc2VydmVyIGZvciB0aGlzIGFuc3dlci4gSXQgYXNzdW1lcyB0aGF0IGBgdGhpcy5naXZlbl9hcnJgYCBjb250YWlucyB0aGUgY3VycmVudCBhbnN3ZXJzLlxuICBzYXZlQW5zd2Vyc0xvY2FsbHlPbmx5KCkge1xuICAgIHRoaXMuc2V0TG9jYWxTdG9yYWdlKHtcbiAgICAgIC8vIFRoZSBzZWVkIGlzIHVzZWQgZm9yIGNsaWVudC1zaWRlIG9wZXJhdGlvbiwgYnV0IGRvZXNuJ3QgbWF0dGVyIGZvciBzZXJ2ZXItc2lkZS5cbiAgICAgIHNlZWQ6IHRoaXMuc2VlZCxcbiAgICAgIGFuc3dlcjogSlNPTi5zdHJpbmdpZnkodGhpcy5naXZlbl9hcnIpLFxuICAgICAgdGltZXN0YW1wOiBuZXcgRGF0ZSgpLFxuICAgICAgLy8gVGhpcyBpcyBvbmx5IG5lZWRlZCBmb3Igc2VydmVyLXNpZGUgZ3JhZGluZyB3aXRoIGR5bmFtaWMgcHJvYmxlbXMuXG4gICAgICBwcm9ibGVtSHRtbDogdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwsXG4gICAgfSk7XG4gIH1cblxuICAvLyBfYGxvZ0N1cnJlbnRBbnN3ZXJgOiBTYXZlIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBwcm9ibGVtIHRvIGxvY2FsIHN0b3JhZ2UgYW5kIHRoZSBzZXJ2ZXI7IGRpc3BsYXkgc2VydmVyIGZlZWRiYWNrLlxuICBhc3luYyBsb2dDdXJyZW50QW5zd2VyKHNpZCkge1xuICAgIGxldCBhbnN3ZXIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLmdpdmVuX2Fycik7XG4gICAgbGV0IGZlZWRiYWNrID0gdHJ1ZTtcbiAgICAvLyBTYXZlIHRoZSBhbnN3ZXIgbG9jYWxseS5cbiAgICB0aGlzLnNhdmVBbnN3ZXJzTG9jYWxseU9ubHkoKTtcbiAgICAvLyBTYXZlIHRoZSBhbnN3ZXIgdG8gdGhlIHNlcnZlci5cbiAgICBjb25zdCBkYXRhID0ge1xuICAgICAgZXZlbnQ6IFwiZmlsbGJcIixcbiAgICAgIGRpdl9pZDogdGhpcy5kaXZpZCxcbiAgICAgIGFjdDogYW5zd2VyIHx8IFwiXCIsXG4gICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICBhbnN3ZXI6IGFuc3dlciB8fCBcIlwiLFxuICAgICAgY29ycmVjdDogdGhpcy5jb3JyZWN0ID8gXCJUXCIgOiBcIkZcIixcbiAgICAgIHBlcmNlbnQ6IHRoaXMucGVyY2VudCxcbiAgICB9O1xuICAgIGlmICh0eXBlb2Ygc2lkICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICBkYXRhLnNpZCA9IHNpZDtcbiAgICAgIGZlZWRiYWNrID0gZmFsc2U7XG4gICAgfVxuICAgIGNvbnN0IHNlcnZlcl9kYXRhID0gYXdhaXQgdGhpcy5sb2dCb29rRXZlbnQoZGF0YSk7XG4gICAgaWYgKCFmZWVkYmFjaykgcmV0dXJuO1xuICAgIC8vIE5vbi1zZXJ2ZXIgc2lkZSBncmFkZWQgcHJvYmxlbXMgYXJlIGRvbmUgYXQgdGhpcyBwb2ludDsgbGlrZXdpc2UsIHN0b3AgaGVyZSBpZiB0aGUgc2VydmVyIGRpZG4ndCByZXNwb25kLlxuICAgIGlmICh0aGlzLmZlZWRiYWNrQXJyYXkgfHwgIXNlcnZlcl9kYXRhKSB7XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG4gICAgLy8gVGhpcyBpcyB0aGUgc2VydmVyLXNpZGUgY2FzZS4gT24gc3VjY2VzcywgdXBkYXRlIHRoZSBmZWVkYmFjayBmcm9tIHRoZSBzZXJ2ZXIncyBncmFkZS5cbiAgICBjb25zdCByZXMgPSBzZXJ2ZXJfZGF0YS5kZXRhaWw7XG4gICAgdGhpcy50aW1lc3RhbXAgPSByZXMudGltZXN0YW1wO1xuICAgIHRoaXMuZGlzcGxheUZlZWQgPSByZXMuZGlzcGxheUZlZWQ7XG4gICAgdGhpcy5jb3JyZWN0ID0gcmVzLmNvcnJlY3Q7XG4gICAgdGhpcy5pc0NvcnJlY3RBcnJheSA9IHJlcy5pc0NvcnJlY3RBcnJheTtcbiAgICB0aGlzLnNldExvY2FsU3RvcmFnZSh7XG4gICAgICBzZWVkOiB0aGlzLnNlZWQsXG4gICAgICBhbnN3ZXI6IGFuc3dlcixcbiAgICAgIHRpbWVzdGFtcDogdGhpcy50aW1lc3RhbXAsXG4gICAgICBwcm9ibGVtSHRtbDogdGhpcy5kZXNjcmlwdGlvbkRpdi5pbm5lckhUTUwsXG4gICAgICBkaXNwbGF5RmVlZDogdGhpcy5kaXNwbGF5RmVlZCxcbiAgICAgIGNvcnJlY3Q6IHRoaXMuY29ycmVjdCxcbiAgICAgIGlzQ29ycmVjdEFycmF5OiB0aGlzLmlzQ29ycmVjdEFycmF5LFxuICAgIH0pO1xuICAgIHRoaXMucmVuZGVyRmVlZGJhY2soKTtcbiAgICByZXR1cm4gc2VydmVyX2RhdGE7XG4gIH1cblxuICAvKj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgID09PSBFdmFsdWF0aW9uIG9mIGFuc3dlciBhbmQgPT09XG4gICAgPT09ICAgICBkaXNwbGF5IGZlZWRiYWNrICAgICA9PT1cbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0qL1xuICByZW5kZXJGZWVkYmFjaygpIHtcbiAgICBpZiAodGhpcy5jb3JyZWN0KSB7XG4gICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWluZm9cIik7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuYmxhbmtBcnJheS5sZW5ndGg7IGorKykge1xuICAgICAgICAkKHRoaXMuYmxhbmtBcnJheVtqXSkucmVtb3ZlQ2xhc3MoXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5kaXNwbGF5RmVlZCA9PT0gbnVsbCkge1xuICAgICAgICB0aGlzLmRpc3BsYXlGZWVkID0gXCJcIjtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmICh0aGlzLmlzQ29ycmVjdEFycmF5W2pdICE9PSB0cnVlKSB7XG4gICAgICAgICAgJCh0aGlzLmJsYW5rQXJyYXlbal0pLmFkZENsYXNzKFwiaW5wdXQtdmFsaWRhdGlvbi1lcnJvclwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkKHRoaXMuYmxhbmtBcnJheVtqXSkucmVtb3ZlQ2xhc3MoXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAkKHRoaXMuZmVlZEJhY2tEaXYpLmF0dHIoXCJjbGFzc1wiLCBcImFsZXJ0IGFsZXJ0LWRhbmdlclwiKTtcbiAgICB9XG4gICAgdmFyIGZlZWRiYWNrX2h0bWwgPSBcIjx1bD5cIjtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZGlzcGxheUZlZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBkZiA9IHRoaXMuZGlzcGxheUZlZWRbaV07XG4gICAgICAvLyBSZW5kZXIgYW55IGR5bmFtaWMgZmVlZGJhY2sgaW4gdGhlIHByb3ZpZGVkIGZlZWRiYWNrLCBmb3IgY2xpZW50LXNpZGUgZ3JhZGluZyBvZiBkeW5hbWljIHByb2JsZW1zLlxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmR5bl92YXJzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGRmID0gcmVuZGVyRHluYW1pY0ZlZWRiYWNrKFxuICAgICAgICAgIHRoaXMuYmxhbmtOYW1lcyxcbiAgICAgICAgICB0aGlzLmdpdmVuX2FycixcbiAgICAgICAgICBpLFxuICAgICAgICAgIGRmLFxuICAgICAgICAgIHRoaXMuZHluX3ZhcnNfZXZhbFxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgZmVlZGJhY2tfaHRtbCArPSBgPGxpPiR7ZGZ9PC9saT5gO1xuICAgIH1cbiAgICBmZWVkYmFja19odG1sICs9IFwiPC91bD5cIjtcbiAgICAvLyBSZW1vdmUgdGhlIGxpc3QgaWYgaXQncyBqdXN0IG9uZSBlbGVtZW50LlxuICAgIGlmICh0aGlzLmRpc3BsYXlGZWVkLmxlbmd0aCA9PSAxKSB7XG4gICAgICBmZWVkYmFja19odG1sID0gZmVlZGJhY2tfaHRtbC5zbGljZShcbiAgICAgICAgXCI8dWw+PGxpPlwiLmxlbmd0aCxcbiAgICAgICAgLVwiPC9saT48L3VsPlwiLmxlbmd0aFxuICAgICAgKTtcbiAgICB9XG4gICAgdGhpcy5mZWVkQmFja0Rpdi5pbm5lckhUTUwgPSBmZWVkYmFja19odG1sO1xuICAgIHRoaXMucXVldWVNYXRoSmF4KHRoaXMuZmVlZEJhY2tEaXYpO1xuICB9XG5cbiAgLyo9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgPT09IEZ1bmN0aW9ucyBmb3IgY29tcGFyZSBidXR0b24gPT09XG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4gIGVuYWJsZUNvbXBhcmVCdXR0b24oKSB7XG4gICAgdGhpcy5jb21wYXJlQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XG4gIH1cbiAgLy8gX2Bjb21wYXJlRklUQkFuc3dlcnNgXG4gIGNvbXBhcmVGSVRCQW5zd2VycygpIHtcbiAgICB2YXIgZGF0YSA9IHt9O1xuICAgIGRhdGEuZGl2X2lkID0gdGhpcy5kaXZpZDtcbiAgICBkYXRhLmNvdXJzZSA9IGVCb29rQ29uZmlnLmNvdXJzZTtcbiAgICBqUXVlcnkuZ2V0KFxuICAgICAgYCR7ZUJvb2tDb25maWcubmV3X3NlcnZlcl9wcmVmaXh9L2Fzc2Vzc21lbnQvZ2V0dG9wMTBBbnN3ZXJzYCxcbiAgICAgIGRhdGEsXG4gICAgICB0aGlzLmNvbXBhcmVGSVRCXG4gICAgKTtcbiAgfVxuICBjb21wYXJlRklUQihkYXRhLCBzdGF0dXMsIHdoYXRldmVyKSB7XG4gICAgdmFyIGFuc3dlcnMgPSBkYXRhLmRldGFpbC5yZXM7XG4gICAgdmFyIG1pc2MgPSBkYXRhLmRldGFpbC5taXNjZGF0YTtcbiAgICB2YXIgYm9keSA9IFwiPHRhYmxlPlwiO1xuICAgIGJvZHkgKz0gXCI8dHI+PHRoPkFuc3dlcjwvdGg+PHRoPkNvdW50PC90aD48L3RyPlwiO1xuICAgIGZvciAodmFyIHJvdyBpbiBhbnN3ZXJzKSB7XG4gICAgICBib2R5ICs9XG4gICAgICAgIFwiPHRyPjx0ZD5cIiArXG4gICAgICAgIGFuc3dlcnNbcm93XS5hbnN3ZXIgK1xuICAgICAgICBcIjwvdGQ+PHRkPlwiICtcbiAgICAgICAgYW5zd2Vyc1tyb3ddLmNvdW50ICtcbiAgICAgICAgXCIgdGltZXM8L3RkPjwvdHI+XCI7XG4gICAgfVxuICAgIGJvZHkgKz0gXCI8L3RhYmxlPlwiO1xuICAgIHZhciBodG1sID1cbiAgICAgIFwiPGRpdiBjbGFzcz0nbW9kYWwgZmFkZSc+XCIgK1xuICAgICAgXCIgICAgPGRpdiBjbGFzcz0nbW9kYWwtZGlhbG9nIGNvbXBhcmUtbW9kYWwnPlwiICtcbiAgICAgIFwiICAgICAgICA8ZGl2IGNsYXNzPSdtb2RhbC1jb250ZW50Jz5cIiArXG4gICAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWhlYWRlcic+XCIgK1xuICAgICAgXCIgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPSdidXR0b24nIGNsYXNzPSdjbG9zZScgZGF0YS1kaXNtaXNzPSdtb2RhbCcgYXJpYS1oaWRkZW49J3RydWUnPiZ0aW1lczs8L2J1dHRvbj5cIiArXG4gICAgICBcIiAgICAgICAgICAgICAgICA8aDQgY2xhc3M9J21vZGFsLXRpdGxlJz5Ub3AgQW5zd2VyczwvaDQ+XCIgK1xuICAgICAgXCIgICAgICAgICAgICA8L2Rpdj5cIiArXG4gICAgICBcIiAgICAgICAgICAgIDxkaXYgY2xhc3M9J21vZGFsLWJvZHknPlwiICtcbiAgICAgIGJvZHkgK1xuICAgICAgXCIgICAgICAgICAgICA8L2Rpdj5cIiArXG4gICAgICBcIiAgICAgICAgPC9kaXY+XCIgK1xuICAgICAgXCIgICAgPC9kaXY+XCIgK1xuICAgICAgXCI8L2Rpdj5cIjtcbiAgICB2YXIgZWwgPSAkKGh0bWwpO1xuICAgIGVsLm1vZGFsKCk7XG4gIH1cblxuICBkaXNhYmxlSW50ZXJhY3Rpb24oKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmJsYW5rQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuYmxhbmtBcnJheVtpXS5kaXNhYmxlZCA9IHRydWU7XG4gICAgfVxuICB9XG59XG5cbi8qPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG49PSBGaW5kIHRoZSBjdXN0b20gSFRNTCB0YWdzIGFuZCA9PVxuPT0gICBleGVjdXRlIG91ciBjb2RlIG9uIHRoZW0gICAgPT1cbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSovXG4kKGRvY3VtZW50KS5iaW5kKFwicnVuZXN0b25lOmxvZ2luLWNvbXBsZXRlXCIsIGZ1bmN0aW9uICgpIHtcbiAgJChcIltkYXRhLWNvbXBvbmVudD1maWxsaW50aGVibGFua11cIikuZWFjaChmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICB2YXIgb3B0cyA9IHtcbiAgICAgIG9yaWc6IHRoaXMsXG4gICAgICB1c2VSdW5lc3RvbmVTZXJ2aWNlczogZUJvb2tDb25maWcudXNlUnVuZXN0b25lU2VydmljZXMsXG4gICAgfTtcbiAgICBpZiAoJCh0aGlzKS5jbG9zZXN0KFwiW2RhdGEtY29tcG9uZW50PXRpbWVkQXNzZXNzbWVudF1cIikubGVuZ3RoID09IDApIHtcbiAgICAgIC8vIElmIHRoaXMgZWxlbWVudCBleGlzdHMgd2l0aGluIGEgdGltZWQgY29tcG9uZW50LCBkb24ndCByZW5kZXIgaXQgaGVyZVxuICAgICAgdHJ5IHtcbiAgICAgICAgRklUQkxpc3RbdGhpcy5pZF0gPSBuZXcgRklUQihvcHRzKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICBgRXJyb3IgcmVuZGVyaW5nIEZpbGwgaW4gdGhlIEJsYW5rIFByb2JsZW0gJHt0aGlzLmlkfVxuICAgICAgICAgICAgICAgICAgICAgRGV0YWlsczogJHtlcnJ9YFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59KTtcbiIsImltcG9ydCBGSVRCIGZyb20gXCIuL2ZpdGIuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRpbWVkRklUQiBleHRlbmRzIEZJVEIge1xuICAgIGNvbnN0cnVjdG9yKG9wdHMpIHtcbiAgICAgICAgc3VwZXIob3B0cyk7XG4gICAgICAgIHRoaXMucmVuZGVyVGltZWRJY29uKHRoaXMuaW5wdXREaXYpO1xuICAgICAgICB0aGlzLmhpZGVCdXR0b25zKCk7XG4gICAgICAgIHRoaXMubmVlZHNSZWluaXRpYWxpemF0aW9uID0gdHJ1ZTtcbiAgICB9XG4gICAgaGlkZUJ1dHRvbnMoKSB7XG4gICAgICAgICQodGhpcy5zdWJtaXRCdXR0b24pLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzLmNvbXBhcmVCdXR0b24pLmhpZGUoKTtcbiAgICB9XG4gICAgcmVuZGVyVGltZWRJY29uKGNvbXBvbmVudCkge1xuICAgICAgICAvLyByZW5kZXJzIHRoZSBjbG9jayBpY29uIG9uIHRpbWVkIGNvbXBvbmVudHMuICAgIFRoZSBjb21wb25lbnQgcGFyYW1ldGVyXG4gICAgICAgIC8vIGlzIHRoZSBlbGVtZW50IHRoYXQgdGhlIGljb24gc2hvdWxkIGJlIGFwcGVuZGVkIHRvLlxuICAgICAgICB2YXIgdGltZUljb25EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgdGltZUljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAkKHRpbWVJY29uKS5hdHRyKHtcbiAgICAgICAgICAgIHNyYzogXCIuLi9fc3RhdGljL2Nsb2NrLnBuZ1wiLFxuICAgICAgICAgICAgc3R5bGU6IFwid2lkdGg6MTVweDtoZWlnaHQ6MTVweFwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGltZUljb25EaXYuY2xhc3NOYW1lID0gXCJ0aW1lVGlwXCI7XG4gICAgICAgIHRpbWVJY29uRGl2LnRpdGxlID0gXCJcIjtcbiAgICAgICAgdGltZUljb25EaXYuYXBwZW5kQ2hpbGQodGltZUljb24pO1xuICAgICAgICAkKGNvbXBvbmVudCkucHJlcGVuZCh0aW1lSWNvbkRpdik7XG4gICAgfVxuICAgIGNoZWNrQ29ycmVjdFRpbWVkKCkge1xuICAgICAgICAvLyBSZXR1cm5zIGlmIHRoZSBxdWVzdGlvbiB3YXMgY29ycmVjdCwgaW5jb3JyZWN0LCBvciBza2lwcGVkIChyZXR1cm4gbnVsbCBpbiB0aGUgbGFzdCBjYXNlKVxuICAgICAgICBzd2l0Y2ggKHRoaXMuY29ycmVjdCkge1xuICAgICAgICAgICAgY2FzZSB0cnVlOlxuICAgICAgICAgICAgICAgIHJldHVybiBcIlRcIjtcbiAgICAgICAgICAgIGNhc2UgZmFsc2U6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiRlwiO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBoaWRlRmVlZGJhY2soKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ibGFua0FycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAkKHRoaXMuYmxhbmtBcnJheVtpXSkucmVtb3ZlQ2xhc3MoXCJpbnB1dC12YWxpZGF0aW9uLWVycm9yXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmVlZEJhY2tEaXYuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cblxuICAgIHJlaW5pdGlhbGl6ZUxpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5zZXR1cEJsYW5rcygpO1xuICAgIH1cbn1cblxuaWYgKHR5cGVvZiB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB3aW5kb3cuY29tcG9uZW50X2ZhY3RvcnkgPSB7fTtcbn1cbndpbmRvdy5jb21wb25lbnRfZmFjdG9yeS5maWxsaW50aGVibGFuayA9IGZ1bmN0aW9uIChvcHRzKSB7XG4gICAgaWYgKG9wdHMudGltZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBUaW1lZEZJVEIob3B0cyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRklUQihvcHRzKTtcbn07XG4iLCIvKiAoaWdub3JlZCkgKi8iLCIvKiAoaWdub3JlZCkgKi8iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=