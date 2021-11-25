(function () {
  'use strict';

  /**
   * @param  {*} arg passed in argument value
   * @param  {string} name name of the argument
   * @param  {string} typename i.e. 'string', 'Function' (value is compared to typeof after lowercasing)
   * @return {void}
   * @throws {TypeError}
   */
  function assertArgumentType(arg, name, typename) {
    const type = typeof arg;

    if (type !== typename.toLowerCase()) {
      throw new TypeError(`The "${name}" argument must be of type ${typename}. Received type ${type}`);
    }
  }

  const FORWARD_SLASH = 47; // '/'

  const BACKWARD_SLASH = 92; // '\\'

  /**
   * Is this [a-zA-Z]?
   * @param  {number}  charCode value from String.charCodeAt()
   * @return {Boolean}          [description]
   */

  function isWindowsDeviceName(charCode) {
    return charCode >= 65 && charCode <= 90 || charCode >= 97 && charCode <= 122;
  }
  /**
   * [isAbsolute description]
   * @param  {boolean} isPosix whether this impl is for POSIX or not
   * @param  {string} filepath   input file path
   * @return {Boolean}          [description]
   */


  function isAbsolute(isPosix, filepath) {
    assertArgumentType(filepath, 'path', 'string');
    const length = filepath.length; // empty string special case

    if (length === 0) {
      return false;
    }

    const firstChar = filepath.charCodeAt(0);

    if (firstChar === FORWARD_SLASH) {
      return true;
    } // we already did our checks for posix


    if (isPosix) {
      return false;
    } // win32 from here on out


    if (firstChar === BACKWARD_SLASH) {
      return true;
    }

    if (length > 2 && isWindowsDeviceName(firstChar) && filepath.charAt(1) === ':') {
      const thirdChar = filepath.charAt(2);
      return thirdChar === '/' || thirdChar === '\\';
    }

    return false;
  }
  /**
   * [dirname description]
   * @param  {string} separator  platform-specific file separator
   * @param  {string} filepath   input file path
   * @return {string}            [description]
   */


  function dirname(separator, filepath) {
    assertArgumentType(filepath, 'path', 'string');
    const length = filepath.length;

    if (length === 0) {
      return '.';
    } // ignore trailing separator


    let fromIndex = length - 1;
    const hadTrailing = filepath.endsWith(separator);

    if (hadTrailing) {
      fromIndex--;
    }

    const foundIndex = filepath.lastIndexOf(separator, fromIndex); // no separators

    if (foundIndex === -1) {
      // handle special case of root windows paths
      if (length >= 2 && separator === '\\' && filepath.charAt(1) === ':') {
        const firstChar = filepath.charCodeAt(0);

        if (isWindowsDeviceName(firstChar)) {
          return filepath; // it's a root windows path
        }
      }

      return '.';
    } // only found root separator


    if (foundIndex === 0) {
      return separator; // if it was '/', return that
    } // Handle special case of '//something'


    if (foundIndex === 1 && separator === '/' && filepath.charAt(0) === '/') {
      return '//';
    }

    return filepath.slice(0, foundIndex);
  }
  /**
   * [extname description]
   * @param  {string} separator  platform-specific file separator
   * @param  {string} filepath   input file path
   * @return {string}            [description]
   */


  function extname(separator, filepath) {
    assertArgumentType(filepath, 'path', 'string');
    const index = filepath.lastIndexOf('.');

    if (index === -1 || index === 0) {
      return '';
    } // ignore trailing separator


    let endIndex = filepath.length;

    if (filepath.endsWith(separator)) {
      endIndex--;
    }

    return filepath.slice(index, endIndex);
  }

  function lastIndexWin32Separator(filepath, index) {
    for (let i = index; i >= 0; i--) {
      const char = filepath.charCodeAt(i);

      if (char === BACKWARD_SLASH || char === FORWARD_SLASH) {
        return i;
      }
    }

    return -1;
  }
  /**
   * [basename description]
   * @param  {string} separator  platform-specific file separator
   * @param  {string} filepath   input file path
   * @param  {string} [ext]      file extension to drop if it exists
   * @return {string}            [description]
   */


  function basename(separator, filepath, ext) {
    assertArgumentType(filepath, 'path', 'string');

    if (ext !== undefined) {
      assertArgumentType(ext, 'ext', 'string');
    }

    const length = filepath.length;

    if (length === 0) {
      return '';
    }

    const isPosix = separator === '/';
    let endIndex = length; // drop trailing separator (if there is one)

    const lastCharCode = filepath.charCodeAt(length - 1);

    if (lastCharCode === FORWARD_SLASH || !isPosix && lastCharCode === BACKWARD_SLASH) {
      endIndex--;
    } // Find last occurence of separator


    let lastIndex = -1;

    if (isPosix) {
      lastIndex = filepath.lastIndexOf(separator, endIndex - 1);
    } else {
      // On win32, handle *either* separator!
      lastIndex = lastIndexWin32Separator(filepath, endIndex - 1); // handle special case of root path like 'C:' or 'C:\\'

      if ((lastIndex === 2 || lastIndex === -1) && filepath.charAt(1) === ':' && isWindowsDeviceName(filepath.charCodeAt(0))) {
        return '';
      }
    } // Take from last occurrence of separator to end of string (or beginning to end if not found)


    const base = filepath.slice(lastIndex + 1, endIndex); // drop trailing extension (if specified)

    if (ext === undefined) {
      return base;
    }

    return base.endsWith(ext) ? base.slice(0, base.length - ext.length) : base;
  }
  /**
   * The `path.normalize()` method normalizes the given path, resolving '..' and '.' segments.
   *
   * When multiple, sequential path segment separation characters are found (e.g.
   * / on POSIX and either \ or / on Windows), they are replaced by a single
   * instance of the platform-specific path segment separator (/ on POSIX and \
   * on Windows). Trailing separators are preserved.
   *
   * If the path is a zero-length string, '.' is returned, representing the
   * current working directory.
   *
   * @param  {string} separator  platform-specific file separator
   * @param  {string} filepath  input file path
   * @return {string} [description]
   */


  function normalize(separator, filepath) {
    assertArgumentType(filepath, 'path', 'string');

    if (filepath.length === 0) {
      return '.';
    } // Windows can handle '/' or '\\' and both should be turned into separator


    const isWindows = separator === '\\';

    if (isWindows) {
      filepath = filepath.replace(/\//g, separator);
    }

    const hadLeading = filepath.startsWith(separator); // On Windows, need to handle UNC paths (\\host-name\\resource\\dir) special to retain leading double backslash

    const isUNC = hadLeading && isWindows && filepath.length > 2 && filepath.charAt(1) === '\\';
    const hadTrailing = filepath.endsWith(separator);
    const parts = filepath.split(separator);
    const result = [];

    for (const segment of parts) {
      if (segment.length !== 0 && segment !== '.') {
        if (segment === '..') {
          result.pop(); // FIXME: What if this goes above root? Should we throw an error?
        } else {
          result.push(segment);
        }
      }
    }

    let normalized = hadLeading ? separator : '';
    normalized += result.join(separator);

    if (hadTrailing) {
      normalized += separator;
    }

    if (isUNC) {
      normalized = '\\' + normalized;
    }

    return normalized;
  }
  /**
   * [assertSegment description]
   * @param  {*} segment [description]
   * @return {void}         [description]
   */


  function assertSegment(segment) {
    if (typeof segment !== 'string') {
      throw new TypeError(`Path must be a string. Received ${segment}`);
    }
  }
  /**
   * The `path.join()` method joins all given path segments together using the
   * platform-specific separator as a delimiter, then normalizes the resulting path.
   * Zero-length path segments are ignored. If the joined path string is a zero-
   * length string then '.' will be returned, representing the current working directory.
   * @param  {string} separator platform-specific file separator
   * @param  {string[]} paths [description]
   * @return {string}       The joined filepath
   */


  function join(separator, paths) {
    const result = []; // naive impl: just join all the paths with separator

    for (const segment of paths) {
      assertSegment(segment);

      if (segment.length !== 0) {
        result.push(segment);
      }
    }

    return normalize(separator, result.join(separator));
  }
  /**
   * The `path.resolve()` method resolves a sequence of paths or path segments into an absolute path.
   *
   * @param  {string} separator platform-specific file separator
   * @param  {string[]} paths [description]
   * @return {string}       [description]
   */


  function resolve(separator, paths) {
    let resolved = '';
    let hitRoot = false;
    const isPosix = separator === '/'; // go from right to left until we hit absolute path/root

    for (let i = paths.length - 1; i >= 0; i--) {
      const segment = paths[i];
      assertSegment(segment);

      if (segment.length === 0) {
        continue; // skip empty
      }

      resolved = segment + separator + resolved; // prepend new segment

      if (isAbsolute(isPosix, segment)) {
        // have we backed into an absolute path?
        hitRoot = true;
        break;
      }
    } // if we didn't hit root, prepend cwd


    if (!hitRoot) {
      resolved = (global.process ? process.cwd() : '/') + separator + resolved;
    }

    const normalized = normalize(separator, resolved);

    if (normalized.charAt(normalized.length - 1) === separator) {
      // FIXME: Handle UNC paths on Windows as well, so we don't trim trailing separator on something like '\\\\host-name\\resource\\'
      // Don't remove trailing separator if this is root path on windows!
      if (!isPosix && normalized.length === 3 && normalized.charAt(1) === ':' && isWindowsDeviceName(normalized.charCodeAt(0))) {
        return normalized;
      } // otherwise trim trailing separator


      return normalized.slice(0, normalized.length - 1);
    }

    return normalized;
  }
  /**
   * The `path.relative()` method returns the relative path `from` from to `to` based
   * on the current working directory. If from and to each resolve to the same
   * path (after calling `path.resolve()` on each), a zero-length string is returned.
   *
   * If a zero-length string is passed as `from` or `to`, the current working directory
   * will be used instead of the zero-length strings.
   *
   * @param  {string} separator platform-specific file separator
   * @param  {string} from [description]
   * @param  {string} to   [description]
   * @return {string}      [description]
   */


  function relative(separator, from, to) {
    assertArgumentType(from, 'from', 'string');
    assertArgumentType(to, 'to', 'string');

    if (from === to) {
      return '';
    }

    from = resolve(separator, [from]);
    to = resolve(separator, [to]);

    if (from === to) {
      return '';
    } // we now have two absolute paths,
    // lets "go up" from `from` until we reach common base dir of `to`
    // const originalFrom = from;


    let upCount = 0;
    let remainingPath = '';

    while (true) {
      if (to.startsWith(from)) {
        // match! record rest...?
        remainingPath = to.slice(from.length);
        break;
      } // FIXME: Break/throw if we hit bad edge case of no common root!


      from = dirname(separator, from);
      upCount++;
    } // remove leading separator from remainingPath if there is any


    if (remainingPath.length > 0) {
      remainingPath = remainingPath.slice(1);
    }

    return ('..' + separator).repeat(upCount) + remainingPath;
  }
  /**
   * The `path.parse()` method returns an object whose properties represent
   * significant elements of the path. Trailing directory separators are ignored,
   * see `path.sep`.
   *
   * The returned object will have the following properties:
   *
   * - dir <string>
   * - root <string>
   * - base <string>
   * - name <string>
   * - ext <string>
   * @param  {string} separator platform-specific file separator
   * @param  {string} filepath [description]
   * @return {object}
   */


  function parse(separator, filepath) {
    assertArgumentType(filepath, 'path', 'string');
    const result = {
      root: '',
      dir: '',
      base: '',
      ext: '',
      name: '' };

    const length = filepath.length;

    if (length === 0) {
      return result;
    } // Cheat and just call our other methods for dirname/basename/extname?


    result.base = basename(separator, filepath);
    result.ext = extname(separator, result.base);
    const baseLength = result.base.length;
    result.name = result.base.slice(0, baseLength - result.ext.length);
    const toSubtract = baseLength === 0 ? 0 : baseLength + 1;
    result.dir = filepath.slice(0, filepath.length - toSubtract); // drop trailing separator!

    const firstCharCode = filepath.charCodeAt(0); // both win32 and POSIX return '/' root

    if (firstCharCode === FORWARD_SLASH) {
      result.root = '/';
      return result;
    } // we're done with POSIX...


    if (separator === '/') {
      return result;
    } // for win32...


    if (firstCharCode === BACKWARD_SLASH) {
      // FIXME: Handle UNC paths like '\\\\host-name\\resource\\file_path'
      // need to retain '\\\\host-name\\resource\\' as root in that case!
      result.root = '\\';
      return result;
    } // check for C: style root


    if (length > 1 && isWindowsDeviceName(firstCharCode) && filepath.charAt(1) === ':') {
      if (length > 2) {
        // is it like C:\\?
        const thirdCharCode = filepath.charCodeAt(2);

        if (thirdCharCode === FORWARD_SLASH || thirdCharCode === BACKWARD_SLASH) {
          result.root = filepath.slice(0, 3);
          return result;
        }
      } // nope, just C:, no trailing separator


      result.root = filepath.slice(0, 2);
    }

    return result;
  }
  /**
   * The `path.format()` method returns a path string from an object. This is the
   * opposite of `path.parse()`.
   *
   * @param  {string} separator platform-specific file separator
   * @param  {object} pathObject object of format returned by `path.parse()`
   * @param  {string} pathObject.dir directory name
   * @param  {string} pathObject.root file root dir, ignored if `pathObject.dir` is provided
   * @param  {string} pathObject.base file basename
   * @param  {string} pathObject.name basename minus extension, ignored if `pathObject.base` exists
   * @param  {string} pathObject.ext file extension, ignored if `pathObject.base` exists
   * @return {string}
   */


  function format(separator, pathObject) {
    assertArgumentType(pathObject, 'pathObject', 'object');
    const base = pathObject.base || `${pathObject.name || ''}${pathObject.ext || ''}`; // append base to root if `dir` wasn't specified, or if
    // dir is the root

    if (!pathObject.dir || pathObject.dir === pathObject.root) {
      return `${pathObject.root || ''}${base}`;
    } // combine dir + / + base


    return `${pathObject.dir}${separator}${base}`;
  }
  /**
   * On Windows systems only, returns an equivalent namespace-prefixed path for
   * the given path. If path is not a string, path will be returned without modifications.
   * See https://docs.microsoft.com/en-us/windows/desktop/FileIO/naming-a-file#namespaces
   * @param  {string} filepath [description]
   * @return {string}          [description]
   */


  function toNamespacedPath(filepath) {
    if (typeof filepath !== 'string') {
      return filepath;
    }

    if (filepath.length === 0) {
      return '';
    }

    const resolvedPath = resolve('\\', [filepath]);
    const length = resolvedPath.length;

    if (length < 2) {
      // need '\\\\' or 'C:' minimum
      return filepath;
    }

    const firstCharCode = resolvedPath.charCodeAt(0); // if start with '\\\\', prefix with UNC root, drop the slashes

    if (firstCharCode === BACKWARD_SLASH && resolvedPath.charAt(1) === '\\') {
      // return as-is if it's an aready long path ('\\\\?\\' or '\\\\.\\' prefix)
      if (length >= 3) {
        const thirdChar = resolvedPath.charAt(2);

        if (thirdChar === '?' || thirdChar === '.') {
          return filepath;
        }
      }

      return '\\\\?\\UNC\\' + resolvedPath.slice(2);
    } else if (isWindowsDeviceName(firstCharCode) && resolvedPath.charAt(1) === ':') {
      return '\\\\?\\' + resolvedPath;
    }

    return filepath;
  }

  const Win32Path = {
    sep: '\\',
    delimiter: ';',
    basename: function (filepath, ext) {
      return basename(this.sep, filepath, ext);
    },
    normalize: function (filepath) {
      return normalize(this.sep, filepath);
    },
    join: function (...paths) {
      return join(this.sep, paths);
    },
    extname: function (filepath) {
      return extname(this.sep, filepath);
    },
    dirname: function (filepath) {
      return dirname(this.sep, filepath);
    },
    isAbsolute: function (filepath) {
      return isAbsolute(false, filepath);
    },
    relative: function (from, to) {
      return relative(this.sep, from, to);
    },
    resolve: function (...paths) {
      return resolve(this.sep, paths);
    },
    parse: function (filepath) {
      return parse(this.sep, filepath);
    },
    format: function (pathObject) {
      return format(this.sep, pathObject);
    },
    toNamespacedPath: toNamespacedPath };

  const PosixPath = {
    sep: '/',
    delimiter: ':',
    basename: function (filepath, ext) {
      return basename(this.sep, filepath, ext);
    },
    normalize: function (filepath) {
      return normalize(this.sep, filepath);
    },
    join: function (...paths) {
      return join(this.sep, paths);
    },
    extname: function (filepath) {
      return extname(this.sep, filepath);
    },
    dirname: function (filepath) {
      return dirname(this.sep, filepath);
    },
    isAbsolute: function (filepath) {
      return isAbsolute(true, filepath);
    },
    relative: function (from, to) {
      return relative(this.sep, from, to);
    },
    resolve: function (...paths) {
      return resolve(this.sep, paths);
    },
    parse: function (filepath) {
      return parse(this.sep, filepath);
    },
    format: function (pathObject) {
      return format(this.sep, pathObject);
    },
    toNamespacedPath: function (filepath) {
      return filepath; // no-op
    } };

  const path = PosixPath;
  path.win32 = Win32Path;
  path.posix = PosixPath;

  /**
   * Appcelerator Titanium Mobile
   * Copyright (c) 2011-Present by Appcelerator, Inc. All Rights Reserved.
   * Licensed under the terms of the Apache Public License
   * Please see the LICENSE included with this distribution for details.
   */

  /**
   * Generates a wrapped invoker function for a specific API
   * This lets us pass in context-specific data to a function
   * defined in an API namespace (i.e. on a module)
   *
   * We use this for create methods, and other APIs that take
   * a KrollInvocation object as their first argument in Java
   *
   * For example, an invoker for a "create" method might look
   * something like this:
   *
   *     function createView(sourceUrl, options) {
   *         var view = new View(options);
   *         view.sourceUrl = sourceUrl;
   *         return view;
   *     }
   *
   * And the corresponding invoker for app.js would look like:
   *
   *     UI.createView = function() {
   *         return createView("app://app.js", arguments[0]);
   *     }
   *
   * wrapperAPI: The scope specific API (module) wrapper
   * realAPI: The actual module implementation
   * apiName: The top level API name of the root module
   * invocationAPI: The actual API to generate an invoker for
   * scopeVars: A map that is passed into each invoker
   */

  /**
   * @param {object} wrapperAPI e.g. TitaniumWrapper
   * @param {object} realAPI e.g. Titanium
   * @param {string} apiName e.g. 'Titanium'
   * @param {object} invocationAPI details on the api we're wrapping
   * @param {string} invocationAPI.namespace the namespace of the proxy where method hangs (w/o 'Ti.' prefix) e.g. 'Filesystem' or 'UI.Android'
   * @param {string} invocationAPI.api the method name e.g. 'openFile' or 'createSearchView'
   * @param {object} scopeVars holder for context specific values (basically just wraps sourceUrl)
   * @param {string} scopeVars.sourceUrl source URL of js file entry point
   * @param {Module} [scopeVars.module] module
   */
  function genInvoker(wrapperAPI, realAPI, apiName, invocationAPI, scopeVars) {
    let apiNamespace = wrapperAPI;
    const namespace = invocationAPI.namespace;

    if (namespace !== apiName) {
      const names = namespace.split('.');

      for (const name of names) {
        let api; // Create a module wrapper only if it hasn't been wrapped already.

        if (Object.prototype.hasOwnProperty.call(apiNamespace, name)) {
          api = apiNamespace[name];
        } else {
          function SandboxAPI() {
            const proto = Object.getPrototypeOf(this);
            Object.defineProperty(this, '_events', {
              get: function () {
                return proto._events;
              },
              set: function (value) {
                proto._events = value;
              } });

          }

          SandboxAPI.prototype = apiNamespace[name];
          api = new SandboxAPI();
          apiNamespace[name] = api;
        }

        apiNamespace = api;
        realAPI = realAPI[name];
      }
    }

    let delegate = realAPI[invocationAPI.api]; // These invokers form a call hierarchy so we need to
    // provide a way back to the actual root Titanium / actual impl.

    while (delegate.__delegate__) {
      delegate = delegate.__delegate__;
    }

    apiNamespace[invocationAPI.api] = createInvoker(realAPI, delegate, scopeVars);
  }

  var genInvoker_1 = genInvoker;
  /**
   * Creates and returns a single invoker function that wraps
   * a delegate function, thisObj, and scopeVars
   * @param {object} thisObj The `this` object to use when invoking the `delegate` function
   * @param {function} delegate The function to wrap/delegate to under the hood
   * @param {object} scopeVars The scope variables to splice into the arguments when calling the delegate
   * @param {string} scopeVars.sourceUrl the only real relevent scope variable!
   * @return {function}
   */

  function createInvoker(thisObj, delegate, scopeVars) {
    const urlInvoker = function invoker(...args) {
      // eslint-disable-line func-style
      args.splice(0, 0, invoker.__scopeVars__);
      return delegate.apply(invoker.__thisObj__, args);
    };

    urlInvoker.__delegate__ = delegate;
    urlInvoker.__thisObj__ = thisObj;
    urlInvoker.__scopeVars__ = scopeVars;
    return urlInvoker;
  }

  var createInvoker_1 = createInvoker;
  var invoker = {
    genInvoker: genInvoker_1,
    createInvoker: createInvoker_1 };


  /**
   * Appcelerator Titanium Mobile
   * Copyright (c) 2011-Present by Appcelerator, Inc. All Rights Reserved.
   * Licensed under the terms of the Apache Public License
   * Please see the LICENSE included with this distribution for details.
   */

  function bootstrap$2(global, kroll) {
    const assets = kroll.binding('assets');
    const Script = kroll.binding('evals').Script;
    /**
     * The loaded index.json file from the app. Used to store the encrypted JS assets'
     * filenames/offsets.
     */

    let fileIndex; // FIXME: fix file name parity between platforms

    const INDEX_JSON = 'index.json';

    class Module {
      /**
       * [Module description]
       * @param {string} id      module id
       * @param {Module} parent  parent module
       */
      constructor(id, parent) {
        this.id = id;
        this.exports = {};
        this.parent = parent;
        this.filename = null;
        this.loaded = false;
        this.wrapperCache = {};
        this.isService = false; // toggled on if this module is the service entry point
      }
      /**
       * Attempts to load the module. If no file is found
       * with the provided name an exception will be thrown.
       * Once the contents of the file are read, it is run
       * in the current context. A sandbox is created by
       * executing the code inside a wrapper function.
       * This provides a speed boost vs creating a new context.
       *
       * @param  {String} filename [description]
       * @param  {String} source   [description]
       * @returns {void}
       */


      load(filename, source) {
        if (this.loaded) {
          throw new Error('Module already loaded.');
        }

        this.filename = filename;
        this.path = path.dirname(filename);
        this.paths = this.nodeModulesPaths(this.path);

        if (!source) {
          source = assets.readAsset(`Resources${filename}`);
        } // Stick it in the cache


        Module.cache[this.filename] = this;

        this._runScript(source, this.filename);

        this.loaded = true;
      }
      /**
       * Generates a context-specific module wrapper, and wraps
       * each invocation API in an external (3rd party) module
       * See invoker.js for more info
       * @param  {object} externalModule native module proxy
       * @param  {string} sourceUrl      the current js file url
       * @return {object}                wrapper around the externalModule
       */


      createModuleWrapper(externalModule, sourceUrl) {


        function ModuleWrapper() {}

        ModuleWrapper.prototype = externalModule;
        const wrapper = new ModuleWrapper(); // Here we take the APIs defined in the bootstrap.js
        // and effectively lazily hook them
        // We explicitly guard the code so iOS doesn't even use/include the referenced invoker.js import

        const invocationAPIs = externalModule.invocationAPIs || [];

        for (const api of invocationAPIs) {
          const delegate = externalModule[api];

          if (!delegate) {
            continue;
          }

          wrapper[api] = invoker.createInvoker(externalModule, delegate, new kroll.ScopeVars({
            sourceUrl }));

        }

        wrapper.addEventListener = function (...args) {
          externalModule.addEventListener.apply(externalModule, args);
        };

        wrapper.removeEventListener = function (...args) {
          externalModule.removeEventListener.apply(externalModule, args);
        };

        wrapper.fireEvent = function (...args) {
          externalModule.fireEvent.apply(externalModule, args);
        };

        return wrapper;
      }
      /**
       * Takes a CommonJS module and uses it to extend an existing external/native module. The exports are added to the external module.
       * @param  {Object} externalModule The external/native module we're extending
       * @param  {String} id             module id
       */


      extendModuleWithCommonJs(externalModule, id) {
        if (!kroll.isExternalCommonJsModule(id)) {
          return;
        } // Load under fake name, or the commonjs side of the native module gets cached in place of the native module!
        // See TIMOB-24932


        const fakeId = `${id}.commonjs`;
        const jsModule = new Module(fakeId, this);
        jsModule.load(fakeId, kroll.getExternalCommonJsModule(id));

        if (jsModule.exports) {
          console.trace(`Extending native module '${id}' with the CommonJS module that was packaged with it.`);
          kroll.extend(externalModule, jsModule.exports);
        }
      }
      /**
       * Loads a native / external (3rd party) module
       * @param  {String} id              module id
       * @param  {object} externalBinding external binding object
       * @return {Object}                 The exported module
       */


      loadExternalModule(id, externalBinding) {
        // try to get the cached module...
        let externalModule = Module.cache[id];

        if (!externalModule) {
          // iOS and Android differ quite a bit here.
          // With ios, we should already have the native module loaded
          // There's no special "bootstrap.js" file packaged within it
          // On Android, we load a bootstrap.js bundled with the module
          {
            // This is the process for Android, first grab the bootstrap source
            const source = externalBinding.bootstrap; // Load the native module's bootstrap JS

            const module = new Module(id, this);
            module.load(`${id}/bootstrap.js`, source); // Bootstrap and load the module using the native bindings

            const result = module.exports.bootstrap(externalBinding); // Cache the external module instance after it's been modified by it's bootstrap script

            externalModule = result;
          }
        }

        if (!externalModule) {
          console.trace(`Unable to load external module: ${id}`);
          return null;
        } // cache the loaded native module (before we extend it)


        Module.cache[id] = externalModule; // We cache each context-specific module wrapper
        // on the parent module, rather than in the Module.cache

        let wrapper = this.wrapperCache[id];

        if (wrapper) {
          return wrapper;
        }

        const sourceUrl = `app://${this.filename}`; // FIXME: If this.filename starts with '/', we need to drop it, I think?

        wrapper = this.createModuleWrapper(externalModule, sourceUrl); // Then we "extend" the API/module using any shipped JS code (assets/<module.id>.js)

        this.extendModuleWithCommonJs(wrapper, id);
        this.wrapperCache[id] = wrapper;
        return wrapper;
      } // See https://nodejs.org/api/modules.html#modules_all_together

      /**
       * Require another module as a child of this module.
       * This parent module's path is used as the base for relative paths
       * when loading the child. Returns the exports object
       * of the child module.
       *
       * @param  {String} request  The path to the requested module
       * @return {Object}          The loaded module
       */


      require(request) {
        // 2. If X begins with './' or '/' or '../'
        const start = request.substring(0, 2); // hack up the start of the string to check relative/absolute/"naked" module id

        if (start === './' || start === '..') {
          const loaded = this.loadAsFileOrDirectory(path.normalize(this.path + '/' + request));

          if (loaded) {
            return loaded.exports;
          } // Root/absolute path (internally when reading the file, we prepend "Resources/" as root dir)

        } else if (request.substring(0, 1) === '/') {
          const loaded = this.loadAsFileOrDirectory(path.normalize(request));

          if (loaded) {
            return loaded.exports;
          }
        } else {
          // Despite being step 1 in Node.JS psuedo-code, we moved it down here because we don't allow native modules
          // to start with './', '..' or '/' - so this avoids a lot of misses on requires starting that way
          // 1. If X is a core module,
          let loaded = this.loadCoreModule(request);

          if (loaded) {
            // a. return the core module
            // b. STOP
            return loaded;
          } // Look for CommonJS module


          if (request.indexOf('/') === -1) {
            // For CommonJS we need to look for module.id/module.id.js first...
            const filename = `/${request}/${request}.js`; // Only look for this _exact file_. DO NOT APPEND .js or .json to it!

            if (this.filenameExists(filename)) {
              loaded = this.loadJavascriptText(filename);

              if (loaded) {
                return loaded.exports;
              }
            } // Then try module.id as directory


            loaded = this.loadAsDirectory(`/${request}`);

            if (loaded) {
              return loaded.exports;
            }
          } // Allow looking through node_modules
          // 3. LOAD_NODE_MODULES(X, dirname(Y))


          loaded = this.loadNodeModules(request, this.paths);

          if (loaded) {
            return loaded.exports;
          } // Fallback to old Titanium behavior of assuming it's actually an absolute path
          // We'd like to warn users about legacy style require syntax so they can update, but the new syntax is not backwards compatible.
          // So for now, let's just be quite about it. In future versions of the SDK (7.0?) we should warn (once 5.x is end of life so backwards compat is not necessary)
          // eslint-disable-next-line max-len
          // console.warn(`require called with un-prefixed module id: ${request}, should be a core or CommonJS module. Falling back to old Ti behavior and assuming it's an absolute path: /${request}`);


          loaded = this.loadAsFileOrDirectory(path.normalize(`/${request}`));

          if (loaded) {
            return loaded.exports;
          }
        } // 4. THROW "not found"


        throw new Error(`Requested module not found: ${request}`); // TODO Set 'code' property to 'MODULE_NOT_FOUND' to match Node?
      }
      /**
       * Loads the core module if it exists. If not, returns null.
       *
       * @param  {String}  id The request module id
       * @return {Object}    true if the module id matches a native or CommonJS module id, (or it's first path segment does).
       */


      loadCoreModule(id) {
        // skip bad ids, relative ids, absolute ids. "native"/"core" modules should be of form "module.id" or "module.id/sub.file.js"
        if (!id || id.startsWith('.') || id.startsWith('/')) {
          return null;
        } // check if we have a cached copy of the wrapper


        if (this.wrapperCache[id]) {
          return this.wrapperCache[id];
        }

        const parts = id.split('/');
        const externalBinding = kroll.externalBinding(parts[0]);

        if (externalBinding) {
          if (parts.length === 1) {
            // This is the "root" of an external module. It can look like:
            // request("com.example.mymodule")
            // We can load and return it right away (caching occurs in the called function).
            return this.loadExternalModule(parts[0], externalBinding);
          } // Could be a sub-module (CommonJS) of an external native module.
          // We allow that since TIMOB-9730.


          if (kroll.isExternalCommonJsModule(parts[0])) {
            const externalCommonJsContents = kroll.getExternalCommonJsModule(id);

            if (externalCommonJsContents) {
              // found it
              // FIXME Re-use loadAsJavaScriptText?
              const module = new Module(id, this);
              module.load(id, externalCommonJsContents);
              return module.exports;
            }
          }
        }

        return null; // failed to load
      }
      /**
       * Attempts to load a node module by id from the starting path
       * @param  {string} moduleId       The path of the module to load.
       * @param  {string[]} dirs       paths to search
       * @return {Module|null}      The module, if loaded. null if not.
       */


      loadNodeModules(moduleId, dirs) {
        // 2. for each DIR in DIRS:
        for (const dir of dirs) {
          // a. LOAD_AS_FILE(DIR/X)
          // b. LOAD_AS_DIRECTORY(DIR/X)
          const mod = this.loadAsFileOrDirectory(path.join(dir, moduleId));

          if (mod) {
            return mod;
          }
        }

        return null;
      }
      /**
       * Determine the set of paths to search for node_modules
       * @param  {string} startDir       The starting directory
       * @return {string[]}              The array of paths to search
       */


      nodeModulesPaths(startDir) {
        // Make sure we have an absolute path to start with
        startDir = path.resolve(startDir); // Return early if we are at root, this avoids doing a pointless loop
        // and also returning an array with duplicate entries
        // e.g. ["/node_modules", "/node_modules"]

        if (startDir === '/') {
          return ['/node_modules'];
        } // 1. let PARTS = path split(START)


        const parts = startDir.split('/'); // 2. let I = count of PARTS - 1

        let i = parts.length - 1; // 3. let DIRS = []

        const dirs = []; // 4. while I >= 0,

        while (i >= 0) {
          // a. if PARTS[I] = "node_modules" CONTINUE
          if (parts[i] === 'node_modules' || parts[i] === '') {
            i -= 1;
            continue;
          } // b. DIR = path join(PARTS[0 .. I] + "node_modules")


          const dir = path.join(parts.slice(0, i + 1).join('/'), 'node_modules'); // c. DIRS = DIRS + DIR

          dirs.push(dir); // d. let I = I - 1

          i -= 1;
        } // Always add /node_modules to the search path


        dirs.push('/node_modules');
        return dirs;
      }
      /**
       * Attempts to load a given path as a file or directory.
       * @param  {string} normalizedPath The path of the module to load.
       * @return {Module|null} The loaded module. null if unable to load.
       */


      loadAsFileOrDirectory(normalizedPath) {
        // a. LOAD_AS_FILE(Y + X)
        let loaded = this.loadAsFile(normalizedPath);

        if (loaded) {
          return loaded;
        } // b. LOAD_AS_DIRECTORY(Y + X)


        loaded = this.loadAsDirectory(normalizedPath);

        if (loaded) {
          return loaded;
        }

        return null;
      }
      /**
       * Loads a given file as a Javascript file, returning the module.exports.
       * @param  {string} filename File we're attempting to load
       * @return {Module} the loaded module
       */


      loadJavascriptText(filename) {
        // Look in the cache!
        if (Module.cache[filename]) {
          return Module.cache[filename];
        }

        const module = new Module(filename, this);
        module.load(filename);
        return module;
      }
      /**
       * Loads a JSON file by reading it's contents, doing a JSON.parse and returning the parsed object.
       *
       * @param  {String} filename File we're attempting to load
       * @return {Module} The loaded module instance
       */


      loadJavascriptObject(filename) {
        // Look in the cache!
        if (Module.cache[filename]) {
          return Module.cache[filename];
        }

        const module = new Module(filename, this);
        module.filename = filename;
        module.path = path.dirname(filename);
        const source = assets.readAsset(`Resources${filename}`); // Stick it in the cache

        Module.cache[filename] = module;
        module.exports = JSON.parse(source);
        module.loaded = true;
        return module;
      }
      /**
       * Attempts to load a file by it's full filename according to NodeJS rules.
       *
       * @param  {string} id The filename
       * @return {Module|null} Module instance if loaded, null if not found.
       */


      loadAsFile(id) {
        // 1. If X is a file, load X as JavaScript text.  STOP
        let filename = id;

        if (this.filenameExists(filename)) {
          // If the file has a .json extension, load as JavascriptObject
          if (filename.length > 5 && filename.slice(-4) === 'json') {
            return this.loadJavascriptObject(filename);
          }

          return this.loadJavascriptText(filename);
        } // 2. If X.js is a file, load X.js as JavaScript text.  STOP


        filename = id + '.js';

        if (this.filenameExists(filename)) {
          return this.loadJavascriptText(filename);
        } // 3. If X.json is a file, parse X.json to a JavaScript Object.  STOP


        filename = id + '.json';

        if (this.filenameExists(filename)) {
          return this.loadJavascriptObject(filename);
        } // failed to load anything!


        return null;
      }
      /**
       * Attempts to load a directory according to NodeJS rules.
       *
       * @param  {string} id The directory name
       * @return {Module|null} Loaded module, null if not found.
       */


      loadAsDirectory(id) {
        // 1. If X/package.json is a file,
        let filename = path.resolve(id, 'package.json');

        if (this.filenameExists(filename)) {
          // a. Parse X/package.json, and look for "main" field.
          const object = this.loadJavascriptObject(filename);

          if (object && object.exports && object.exports.main) {
            // b. let M = X + (json main field)
            const m = path.resolve(id, object.exports.main); // c. LOAD_AS_FILE(M)

            return this.loadAsFileOrDirectory(m);
          }
        } // 2. If X/index.js is a file, load X/index.js as JavaScript text.  STOP


        filename = path.resolve(id, 'index.js');

        if (this.filenameExists(filename)) {
          return this.loadJavascriptText(filename);
        } // 3. If X/index.json is a file, parse X/index.json to a JavaScript object. STOP


        filename = path.resolve(id, 'index.json');

        if (this.filenameExists(filename)) {
          return this.loadJavascriptObject(filename);
        }

        return null;
      }
      /**
       * Setup a sandbox and run the module's script inside it.
       * Returns the result of the executed script.
       * @param  {String} source   [description]
       * @param  {String} filename [description]
       * @return {*}          [description]
       */


      _runScript(source, filename) {
        const self = this;

        function require(path) {
          return self.require(path);
        }

        require.main = Module.main; // This "first time" run is really only for app.js, AFAICT, and needs
        // an activity. If app was restarted for Service only, we don't want
        // to go this route. So added currentActivity check. (bill)

        if (self.id === '.' && !this.isService) {
          global.require = require; // check if we have an inspector binding...

          const inspector = kroll.binding('inspector');

          if (inspector) {
            // If debugger is enabled, load app.js and pause right before we execute it
            const inspectorWrapper = inspector.callAndPauseOnStart;

            if (inspectorWrapper) {
              // FIXME Why can't we do normal Module.wrap(source) here?
              // I get "Uncaught TypeError: Cannot read property 'createTabGroup' of undefined" for "Ti.UI.createTabGroup();"
              // Not sure why app.js is special case and can't be run under normal self-invoking wrapping function that gets passed in global/kroll/Ti/etc
              // Instead, let's use a slightly modified version of callAndPauseOnStart:
              // It will compile the source as-is, schedule a pause and then run the source.
              return inspectorWrapper(source, filename);
            }
          } // run app.js "normally" (i.e. not under debugger/inspector)


          return Script.runInThisContext(source, filename, true);
        } // In V8, we treat external modules the same as native modules.  First, we wrap the
        // module code and then run it in the current context.  This will allow external modules to
        // access globals as mentioned in TIMOB-11752. This will also help resolve startup slowness that
        // occurs as a result of creating a new context during startup in TIMOB-12286.


        source = Module.wrap(source);
        const f = Script.runInThisContext(source, filename, true);
        return f(this.exports, require, this, filename, path.dirname(filename), Titanium, Ti, global, kroll);
      }
      /**
       * Look up a filename in the app's index.json file
       * @param  {String} filename the file we're looking for
       * @return {Boolean}         true if the filename exists in the index.json
       */


      filenameExists(filename) {
        filename = 'Resources' + filename; // When we actually look for files, assume "Resources/" is the root

        if (!fileIndex) {
          const json = assets.readAsset(INDEX_JSON);
          fileIndex = JSON.parse(json);
        }

        return fileIndex && filename in fileIndex;
      }}



    Module.cache = [];
    Module.main = null;
    Module.wrapper = ['(function (exports, require, module, __filename, __dirname, Titanium, Ti, global, kroll) {', '\n});'];

    Module.wrap = function (script) {
      return Module.wrapper[0] + script + Module.wrapper[1];
    };
    /**
     * [runModule description]
     * @param  {String} source            JS Source code
     * @param  {String} filename          Filename of the module
     * @param  {Titanium.Service|null|Titanium.Android.Activity} activityOrService [description]
     * @return {Module}                   The loaded Module
     */


    Module.runModule = function (source, filename, activityOrService) {
      let id = filename;

      if (!Module.main) {
        id = '.';
      }

      const module = new Module(id, null); // FIXME: I don't know why instanceof for Titanium.Service works here!
      // On Android, it's an apiname of Ti.Android.Service
      // On iOS, we don't yet pass in the value, but we do set Ti.App.currentService property beforehand!
      // Can we remove the preload stuff in KrollBridge.m to pass along the service instance into this like we do on Andorid?

      module.isService = activityOrService instanceof Titanium.Service;

      {
        if (module.isService) {
          Object.defineProperty(Ti.Android, 'currentService', {
            value: activityOrService,
            writable: false,
            configurable: true });

        } else {
          Object.defineProperty(Ti.Android, 'currentService', {
            value: null,
            writable: false,
            configurable: true });

        }
      }

      if (!Module.main) {
        Module.main = module;
      }

      filename = filename.replace('Resources/', '/'); // normalize back to absolute paths (which really are relative to Resources under the hood)

      module.load(filename, source);

      {
        Object.defineProperty(Ti.Android, 'currentService', {
          value: null,
          writable: false,
          configurable: true });

      }

      return module;
    };

    return Module;
  }

  /**
   * This hangs the Proxy type off Ti namespace. It also generates a hidden _properties object
   * that is used to store property values on the JS side for java Proxies.
   * Basically these get/set methods are fallbacks for when a Java proxy doesn't have a native method to handle getting/setting the property.
   * (see Proxy.h/ProxyBindingV8.cpp.fm for more info)
   * @param {object} tiBinding the underlying 'Titanium' native binding (see KrollBindings::initTitanium)
   * @param {object} Ti the global.Titanium object
   */
  function ProxyBootstrap(tiBinding, Ti) {
    const Proxy = tiBinding.Proxy;
    Ti.Proxy = Proxy;

    Proxy.defineProperties = function (proxyPrototype, names) {
      const properties = {};
      const len = names.length;

      for (let i = 0; i < len; ++i) {
        const name = names[i];
        properties[name] = {
          get: function () {
            // eslint-disable-line no-loop-func
            return this.getProperty(name);
          },
          set: function (value) {
            // eslint-disable-line no-loop-func
            this.setPropertyAndFire(name, value);
          },
          enumerable: true };

      }

      Object.defineProperties(proxyPrototype, properties);
    };

    Object.defineProperty(Proxy.prototype, 'getProperty', {
      value: function (property) {
        return this._properties[property];
      },
      enumerable: false });

    Object.defineProperty(Proxy.prototype, 'setProperty', {
      value: function (property, value) {
        return this._properties[property] = value;
      },
      enumerable: false });

    Object.defineProperty(Proxy.prototype, 'setPropertiesAndFire', {
      value: function (properties) {
        const ownNames = Object.getOwnPropertyNames(properties);
        const len = ownNames.length;
        const changes = [];

        for (let i = 0; i < len; ++i) {
          const property = ownNames[i];
          const value = properties[property];

          if (!property) {
            continue;
          }

          const oldValue = this._properties[property];
          this._properties[property] = value;

          if (value !== oldValue) {
            changes.push([property, oldValue, value]);
          }
        }

        if (changes.length > 0) {
          this.onPropertiesChanged(changes);
        }
      },
      enumerable: false });

  }

  /* globals OS_ANDROID,OS_IOS */
  function bootstrap$1(global, kroll) {
    {
      const tiBinding = kroll.binding('Titanium');
      const Ti = tiBinding.Titanium;

      const bootstrap = kroll.NativeModule.require('bootstrap'); // The bootstrap defines lazy namespace property tree **and**
      // sets up special APIs that get wrapped to pass along sourceUrl via a KrollInvocation object


      bootstrap.bootstrap(Ti);
      bootstrap.defineLazyBinding(Ti, 'API'); // Basically does the same thing iOS does for API module (lazy property getter)
      // Here, we go through all the specially marked APIs to generate the wrappers to pass in the sourceUrl
      // TODO: This is all insane, and we should just bake it into the Proxy conversion stuff to grab and pass along sourceUrl
      // Rather than carry it all over the place like this!
      // We already need to generate a KrollInvocation object to wrap the sourceUrl!

      function TitaniumWrapper(context) {
        const sourceUrl = this.sourceUrl = context.sourceUrl;
        const scopeVars = new kroll.ScopeVars({
          sourceUrl });

        Ti.bindInvocationAPIs(this, scopeVars);
      }

      TitaniumWrapper.prototype = Ti;
      Ti.Wrapper = TitaniumWrapper; // -----------------------------------------------------------------------
      // This loops through all known APIs that require an
      // Invocation object and wraps them so we can pass a
      // source URL as the first argument

      Ti.bindInvocationAPIs = function (wrapperTi, scopeVars) {
        for (const api of Ti.invocationAPIs) {
          // separate each invoker into it's own private scope
          invoker.genInvoker(wrapperTi, Ti, 'Titanium', api, scopeVars);
        }
      };

      ProxyBootstrap(tiBinding, Ti);
      return new TitaniumWrapper({
        // Even though the entry point is really ti://kroll.js, that will break resolution of urls under the covers!
        // So basically just assume app.js as the relative file base
        sourceUrl: 'app://app.js' });

    }
  }

  // Copyright Joyent, Inc. and other Node contributors.
  // Permission is hereby granted, free of charge, to any person obtaining a
  // copy of this software and associated documentation files (the
  // "Software"), to deal in the Software without restriction, including
  // without limitation the rights to use, copy, modify, merge, publish,
  // distribute, sublicense, and/or sell copies of the Software, and to permit
  // persons to whom the Software is furnished to do so, subject to the
  // following conditions:
  // The above copyright notice and this permission notice shall be included
  // in all copies or substantial portions of the Software.
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
  // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
  // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
  // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
  // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
  // USE OR OTHER DEALINGS IN THE SOFTWARE.
  // Modifications Copyright 2011-Present Appcelerator, Inc.
  function EventEmitterBootstrap(global, kroll) {
    const TAG = 'EventEmitter';
    const EventEmitter = kroll.EventEmitter;
    const isArray = Array.isArray; // By default EventEmitters will print a warning if more than
    // 10 listeners are added to it. This is a useful default which
    // helps finding memory leaks.

    Object.defineProperty(EventEmitter.prototype, 'callHandler', {
      value: function (handler, type, data) {
        // kroll.log(TAG, "calling event handler: type:" + type + ", data: " + data + ", handler: " + handler);
        var handled = false,
        cancelBubble = data.cancelBubble,
        event;

        if (handler.listener && handler.listener.call) {
          // Create event object, copy any custom event data, and set the "type" and "source" properties.
          event = {
            type: type,
            source: this };

          kroll.extend(event, data);

          if (handler.self && event.source == handler.self.view) {
            // eslint-disable-line eqeqeq
            event.source = handler.self;
          }

          handler.listener.call(this, event); // The "cancelBubble" property may be reset in the handler.

          if (event.cancelBubble !== cancelBubble) {
            cancelBubble = event.cancelBubble;
          }

          handled = true;
        } else if (kroll.DBG) {
          kroll.log(TAG, 'handler for event \'' + type + '\' is ' + typeof handler.listener + ' and cannot be called.');
        } // Bubble the events to the parent view if needed.


        if (data.bubbles && !cancelBubble) {
          handled = this._fireSyncEventToParent(type, data) || handled;
        }

        return handled;
      },
      enumerable: false });

    Object.defineProperty(EventEmitter.prototype, 'emit', {
      value: function (type) {
        var handled = false,
        data = arguments[1],
        handler,
        listeners; // Set the "bubbles" and "cancelBubble" properties for event data.

        if (data !== null && typeof data === 'object') {
          data.bubbles = !!data.bubbles;
          data.cancelBubble = !!data.cancelBubble;
        } else {
          data = {
            bubbles: false,
            cancelBubble: false };

        }

        if (this._hasJavaListener) {
          this._onEventFired(type, data);
        }

        if (!this._events || !this._events[type] || !this.callHandler) {
          if (data.bubbles && !data.cancelBubble) {
            handled = this._fireSyncEventToParent(type, data);
          }

          return handled;
        }

        handler = this._events[type];

        if (typeof handler.listener === 'function') {
          handled = this.callHandler(handler, type, data);
        } else if (isArray(handler)) {
          listeners = handler.slice();

          for (var i = 0, l = listeners.length; i < l; i++) {
            handled = this.callHandler(listeners[i], type, data) || handled;
          }
        } else if (data.bubbles && !data.cancelBubble) {
          handled = this._fireSyncEventToParent(type, data);
        }

        return handled;
      },
      enumerable: false });
    // Titanium compatibility

    Object.defineProperty(EventEmitter.prototype, 'fireEvent', {
      value: EventEmitter.prototype.emit,
      enumerable: false,
      writable: true });

    Object.defineProperty(EventEmitter.prototype, 'fireSyncEvent', {
      value: EventEmitter.prototype.emit,
      enumerable: false });
    // EventEmitter is defined in src/node_events.cc
    // EventEmitter.prototype.emit() is also defined there.

    Object.defineProperty(EventEmitter.prototype, 'addListener', {
      value: function (type, listener, view) {
        if (typeof listener !== 'function') {
          throw new Error('addListener only takes instances of Function. The listener for event "' + type + '" is "' + typeof listener + '"');
        }

        if (!this._events) {
          this._events = {};
        }

        var id; // Setup ID first so we can pass count in to "listenerAdded"

        if (!this._events[type]) {
          id = 0;
        } else if (isArray(this._events[type])) {
          id = this._events[type].length;
        } else {
          id = 1;
        }

        var listenerWrapper = {};
        listenerWrapper.listener = listener;
        listenerWrapper.self = view;

        if (!this._events[type]) {
          // Optimize the case of one listener. Don't need the extra array object.
          this._events[type] = listenerWrapper;
        } else if (isArray(this._events[type])) {
          // If we've already got an array, just append.
          this._events[type].push(listenerWrapper);
        } else {
          // Adding the second element, need to change to array.
          this._events[type] = [this._events[type], listenerWrapper];
        } // Notify the Java proxy if this is the first listener added.


        if (id === 0) {
          this._hasListenersForEventType(type, true);
        }

        return id;
      },
      enumerable: false });
    // The JavaObject prototype will provide a version of this
    // that delegates back to the Java proxy. Non-Java versions
    // of EventEmitter don't care, so this no op is called instead.

    Object.defineProperty(EventEmitter.prototype, '_listenerForEvent', {
      value: function () {},
      enumerable: false });

    Object.defineProperty(EventEmitter.prototype, 'on', {
      value: EventEmitter.prototype.addListener,
      enumerable: false });
    // Titanium compatibility

    Object.defineProperty(EventEmitter.prototype, 'addEventListener', {
      value: EventEmitter.prototype.addListener,
      enumerable: false,
      writable: true });

    Object.defineProperty(EventEmitter.prototype, 'once', {
      value: function (type, listener) {
        var self = this;

        function g() {
          self.removeListener(type, g);
          listener.apply(this, arguments);
        }

        g.listener = listener;
        self.on(type, g);
        return this;
      },
      enumerable: false });

    Object.defineProperty(EventEmitter.prototype, 'removeListener', {
      value: function (type, listener) {
        if (typeof listener !== 'function') {
          throw new Error('removeListener only takes instances of Function');
        } // does not use listeners(), so no side effect of creating _events[type]


        if (!this._events || !this._events[type]) {
          return this;
        }

        var list = this._events[type];
        var count = 0;

        if (isArray(list)) {
          var position = -1; // Also support listener indexes / ids

          if (typeof listener === 'number') {
            position = listener;

            if (position > list.length || position < 0) {
              return this;
            }
          } else {
            for (var i = 0, length = list.length; i < length; i++) {
              if (list[i].listener === listener) {
                position = i;
                break;
              }
            }
          }

          if (position < 0) {
            return this;
          }

          list.splice(position, 1);

          if (list.length === 0) {
            delete this._events[type];
          }

          count = list.length;
        } else if (list.listener === listener || listener == 0) {
          // eslint-disable-line eqeqeq
          delete this._events[type];
        } else {
          return this;
        }

        if (count === 0) {
          this._hasListenersForEventType(type, false);
        }

        return this;
      },
      enumerable: false });

    Object.defineProperty(EventEmitter.prototype, 'removeEventListener', {
      value: EventEmitter.prototype.removeListener,
      enumerable: false,
      writable: true });

    Object.defineProperty(EventEmitter.prototype, 'removeAllListeners', {
      value: function (type) {
        // does not use listeners(), so no side effect of creating _events[type]
        if (type && this._events && this._events[type]) {
          this._events[type] = null;

          this._hasListenersForEventType(type, false);
        }

        return this;
      },
      enumerable: false });

    Object.defineProperty(EventEmitter.prototype, 'listeners', {
      value: function (type) {
        if (!this._events) {
          this._events = {};
        }

        if (!this._events[type]) {
          this._events[type] = [];
        }

        if (!isArray(this._events[type])) {
          this._events[type] = [this._events[type]];
        }

        return this._events[type];
      },
      enumerable: false });

    return EventEmitter;
  }

  /**
   * This is used by Android to require "baked-in" source.
   * SDK and module builds will bake in the raw source as c strings, and this will wrap
   * loading that code in via kroll.NativeModule.require(<id>)
   * For more information, see the bootstrap.js.ejs template.
   */
  function NativeModuleBootstrap(global, kroll) {
    const Script = kroll.binding('evals').Script;
    const runInThisContext = Script.runInThisContext;

    function NativeModule(id) {
      this.filename = id + '.js';
      this.id = id;
      this.exports = {};
      this.loaded = false;
    }
    /**
     * This should be an object with string keys (baked in module ids) -> string values (source of the baked in js code)
     */


    NativeModule._source = kroll.binding('natives');
    NativeModule._cache = {};

    NativeModule.require = function (id) {
      if (id === 'native_module') {
        return NativeModule;
      }

      if (id === 'invoker') {
        return invoker; // Android native modules use a bootstrap.js file that assumes there's a builtin 'invoker'
      }

      const cached = NativeModule.getCached(id);

      if (cached) {
        return cached.exports;
      }

      if (!NativeModule.exists(id)) {
        throw new Error('No such native module ' + id);
      }

      const nativeModule = new NativeModule(id);
      nativeModule.compile();
      nativeModule.cache();
      return nativeModule.exports;
    };

    NativeModule.getCached = function (id) {
      return NativeModule._cache[id];
    };

    NativeModule.exists = function (id) {
      return id in NativeModule._source;
    };

    NativeModule.getSource = function (id) {
      return NativeModule._source[id];
    };

    NativeModule.wrap = function (script) {
      return NativeModule.wrapper[0] + script + NativeModule.wrapper[1];
    };

    NativeModule.wrapper = ['(function (exports, require, module, __filename, __dirname, Titanium, Ti, global, kroll) {', '\n});'];

    NativeModule.prototype.compile = function () {
      let source = NativeModule.getSource(this.id);
      source = NativeModule.wrap(source); // All native modules have their filename prefixed with ti:/

      const filename = `ti:/${this.filename}`;
      const fn = runInThisContext(source, filename, true);
      fn(this.exports, NativeModule.require, this, this.filename, null, global.Ti, global.Ti, global, kroll);
      this.loaded = true;
    };

    NativeModule.prototype.cache = function () {
      NativeModule._cache[this.id] = this;
    };

    return NativeModule;
  }

  // This is the file each platform loads on boot *before* we launch ti.main.js to insert all our shims/extensions
  /**
   * main bootstrapping function
   * @param {object} global the global object
   * @param {object} kroll; the kroll module/binding
   * @return {void}       [description]
   */

  function bootstrap(global, kroll) {
    // Works identical to Object.hasOwnProperty, except
    // also works if the given object does not have the method
    // on its prototype or it has been masked.
    function hasOwnProperty(object, property) {
      return Object.hasOwnProperty.call(object, property);
    }

    kroll.extend = function (thisObject, otherObject) {
      if (!otherObject) {
        // extend with what?!  denied!
        return;
      }

      for (var name in otherObject) {
        if (hasOwnProperty(otherObject, name)) {
          thisObject[name] = otherObject[name];
        }
      }

      return thisObject;
    };
    /**
     * This is used to shuttle the sourceUrl around to APIs that may need to
     * resolve relative paths based on the invoking file.
     * (see KrollInvocation.java for more)
     * @param {object} vars key/value pairs to store
     * @param {string} vars.sourceUrl the source URL of the file calling the API
     * @constructor
     * @returns {ScopeVars}
     */


    function ScopeVars(vars) {
      if (!vars) {
        return this;
      }

      const keys = Object.keys(vars);
      const length = keys.length;

      for (var i = 0; i < length; ++i) {
        const key = keys[i];
        this[key] = vars[key];
      }
    }

    function startup() {
      global.global = global; // hang the global object off itself

      global.kroll = kroll; // hang our special under the hood kroll object off the global

      {
        kroll.ScopeVars = ScopeVars; // external module bootstrap.js expects to call kroll.NativeModule.require directly to load in their own source
        // and to refer to the baked in "bootstrap.js" for the SDK and "invoker.js" to hang lazy APIs/wrap api calls to pass in scope vars

        kroll.NativeModule = NativeModuleBootstrap(global, kroll); // Android uses it's own EventEmitter impl, and it's baked right into the proxy class chain
        // It assumes it can call back into java proxies to alert when listeners are added/removed
        // FIXME: Get it to use the events.js impl in the node extension, and get iOS to bake that into it's proxies as well!

        EventEmitterBootstrap(global, kroll);
      }

      global.Ti = global.Titanium = bootstrap$1(global, kroll);
      global.Module = bootstrap$2(global, kroll);
    }

    startup();
  }

  return bootstrap;

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpLmtlcm5lbC5qcyJdLCJuYW1lcyI6WyJhc3NlcnRBcmd1bWVudFR5cGUiLCJhcmciLCJuYW1lIiwidHlwZW5hbWUiLCJ0eXBlIiwidG9Mb3dlckNhc2UiLCJUeXBlRXJyb3IiLCJGT1JXQVJEX1NMQVNIIiwiQkFDS1dBUkRfU0xBU0giLCJpc1dpbmRvd3NEZXZpY2VOYW1lIiwiY2hhckNvZGUiLCJpc0Fic29sdXRlIiwiaXNQb3NpeCIsImZpbGVwYXRoIiwibGVuZ3RoIiwiZmlyc3RDaGFyIiwiY2hhckNvZGVBdCIsImNoYXJBdCIsInRoaXJkQ2hhciIsImRpcm5hbWUiLCJzZXBhcmF0b3IiLCJmcm9tSW5kZXgiLCJoYWRUcmFpbGluZyIsImVuZHNXaXRoIiwiZm91bmRJbmRleCIsImxhc3RJbmRleE9mIiwic2xpY2UiLCJleHRuYW1lIiwiaW5kZXgiLCJlbmRJbmRleCIsImxhc3RJbmRleFdpbjMyU2VwYXJhdG9yIiwiaSIsImNoYXIiLCJiYXNlbmFtZSIsImV4dCIsInVuZGVmaW5lZCIsImxhc3RDaGFyQ29kZSIsImxhc3RJbmRleCIsImJhc2UiLCJub3JtYWxpemUiLCJpc1dpbmRvd3MiLCJyZXBsYWNlIiwiaGFkTGVhZGluZyIsInN0YXJ0c1dpdGgiLCJpc1VOQyIsInBhcnRzIiwic3BsaXQiLCJyZXN1bHQiLCJzZWdtZW50IiwicG9wIiwicHVzaCIsIm5vcm1hbGl6ZWQiLCJqb2luIiwiYXNzZXJ0U2VnbWVudCIsInBhdGhzIiwicmVzb2x2ZSIsInJlc29sdmVkIiwiaGl0Um9vdCIsImdsb2JhbCIsInByb2Nlc3MiLCJjd2QiLCJyZWxhdGl2ZSIsImZyb20iLCJ0byIsInVwQ291bnQiLCJyZW1haW5pbmdQYXRoIiwicmVwZWF0IiwicGFyc2UiLCJyb290IiwiZGlyIiwiYmFzZUxlbmd0aCIsInRvU3VidHJhY3QiLCJmaXJzdENoYXJDb2RlIiwidGhpcmRDaGFyQ29kZSIsImZvcm1hdCIsInBhdGhPYmplY3QiLCJ0b05hbWVzcGFjZWRQYXRoIiwicmVzb2x2ZWRQYXRoIiwiV2luMzJQYXRoIiwic2VwIiwiZGVsaW1pdGVyIiwiUG9zaXhQYXRoIiwicGF0aCIsIndpbjMyIiwicG9zaXgiLCJnZW5JbnZva2VyIiwid3JhcHBlckFQSSIsInJlYWxBUEkiLCJhcGlOYW1lIiwiaW52b2NhdGlvbkFQSSIsInNjb3BlVmFycyIsImFwaU5hbWVzcGFjZSIsIm5hbWVzcGFjZSIsIm5hbWVzIiwiYXBpIiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiU2FuZGJveEFQSSIsInByb3RvIiwiZ2V0UHJvdG90eXBlT2YiLCJkZWZpbmVQcm9wZXJ0eSIsImdldCIsIl9ldmVudHMiLCJzZXQiLCJ2YWx1ZSIsImRlbGVnYXRlIiwiX19kZWxlZ2F0ZV9fIiwiY3JlYXRlSW52b2tlciIsImdlbkludm9rZXJfMSIsInRoaXNPYmoiLCJ1cmxJbnZva2VyIiwiaW52b2tlciIsImFyZ3MiLCJzcGxpY2UiLCJfX3Njb3BlVmFyc19fIiwiYXBwbHkiLCJfX3RoaXNPYmpfXyIsImNyZWF0ZUludm9rZXJfMSIsImJvb3RzdHJhcCQyIiwia3JvbGwiLCJhc3NldHMiLCJiaW5kaW5nIiwiU2NyaXB0IiwiZmlsZUluZGV4IiwiSU5ERVhfSlNPTiIsIk1vZHVsZSIsImNvbnN0cnVjdG9yIiwiaWQiLCJwYXJlbnQiLCJleHBvcnRzIiwiZmlsZW5hbWUiLCJsb2FkZWQiLCJ3cmFwcGVyQ2FjaGUiLCJpc1NlcnZpY2UiLCJsb2FkIiwic291cmNlIiwiRXJyb3IiLCJub2RlTW9kdWxlc1BhdGhzIiwicmVhZEFzc2V0IiwiY2FjaGUiLCJfcnVuU2NyaXB0IiwiY3JlYXRlTW9kdWxlV3JhcHBlciIsImV4dGVybmFsTW9kdWxlIiwic291cmNlVXJsIiwiTW9kdWxlV3JhcHBlciIsIndyYXBwZXIiLCJpbnZvY2F0aW9uQVBJcyIsIlNjb3BlVmFycyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZmlyZUV2ZW50IiwiZXh0ZW5kTW9kdWxlV2l0aENvbW1vbkpzIiwiaXNFeHRlcm5hbENvbW1vbkpzTW9kdWxlIiwiZmFrZUlkIiwianNNb2R1bGUiLCJnZXRFeHRlcm5hbENvbW1vbkpzTW9kdWxlIiwiY29uc29sZSIsInRyYWNlIiwiZXh0ZW5kIiwibG9hZEV4dGVybmFsTW9kdWxlIiwiZXh0ZXJuYWxCaW5kaW5nIiwiYm9vdHN0cmFwIiwibW9kdWxlIiwicmVxdWlyZSIsInJlcXVlc3QiLCJzdGFydCIsInN1YnN0cmluZyIsImxvYWRBc0ZpbGVPckRpcmVjdG9yeSIsImxvYWRDb3JlTW9kdWxlIiwiaW5kZXhPZiIsImZpbGVuYW1lRXhpc3RzIiwibG9hZEphdmFzY3JpcHRUZXh0IiwibG9hZEFzRGlyZWN0b3J5IiwibG9hZE5vZGVNb2R1bGVzIiwiZXh0ZXJuYWxDb21tb25Kc0NvbnRlbnRzIiwibW9kdWxlSWQiLCJkaXJzIiwibW9kIiwic3RhcnREaXIiLCJub3JtYWxpemVkUGF0aCIsImxvYWRBc0ZpbGUiLCJsb2FkSmF2YXNjcmlwdE9iamVjdCIsIkpTT04iLCJvYmplY3QiLCJtYWluIiwibSIsInNlbGYiLCJpbnNwZWN0b3IiLCJpbnNwZWN0b3JXcmFwcGVyIiwiY2FsbEFuZFBhdXNlT25TdGFydCIsInJ1bkluVGhpc0NvbnRleHQiLCJ3cmFwIiwiZiIsIlRpdGFuaXVtIiwiVGkiLCJqc29uIiwic2NyaXB0IiwicnVuTW9kdWxlIiwiYWN0aXZpdHlPclNlcnZpY2UiLCJTZXJ2aWNlIiwiQW5kcm9pZCIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwiUHJveHlCb290c3RyYXAiLCJ0aUJpbmRpbmciLCJQcm94eSIsImRlZmluZVByb3BlcnRpZXMiLCJwcm94eVByb3RvdHlwZSIsInByb3BlcnRpZXMiLCJsZW4iLCJnZXRQcm9wZXJ0eSIsInNldFByb3BlcnR5QW5kRmlyZSIsImVudW1lcmFibGUiLCJwcm9wZXJ0eSIsIl9wcm9wZXJ0aWVzIiwib3duTmFtZXMiLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiY2hhbmdlcyIsIm9sZFZhbHVlIiwib25Qcm9wZXJ0aWVzQ2hhbmdlZCIsImJvb3RzdHJhcCQxIiwiTmF0aXZlTW9kdWxlIiwiZGVmaW5lTGF6eUJpbmRpbmciLCJUaXRhbml1bVdyYXBwZXIiLCJjb250ZXh0IiwiYmluZEludm9jYXRpb25BUElzIiwiV3JhcHBlciIsIndyYXBwZXJUaSIsIkV2ZW50RW1pdHRlckJvb3RzdHJhcCIsIlRBRyIsIkV2ZW50RW1pdHRlciIsImlzQXJyYXkiLCJBcnJheSIsImhhbmRsZXIiLCJkYXRhIiwiaGFuZGxlZCIsImNhbmNlbEJ1YmJsZSIsImV2ZW50IiwibGlzdGVuZXIiLCJ2aWV3IiwiREJHIiwibG9nIiwiYnViYmxlcyIsIl9maXJlU3luY0V2ZW50VG9QYXJlbnQiLCJhcmd1bWVudHMiLCJsaXN0ZW5lcnMiLCJfaGFzSmF2YUxpc3RlbmVyIiwiX29uRXZlbnRGaXJlZCIsImNhbGxIYW5kbGVyIiwibCIsImVtaXQiLCJsaXN0ZW5lcldyYXBwZXIiLCJfaGFzTGlzdGVuZXJzRm9yRXZlbnRUeXBlIiwiYWRkTGlzdGVuZXIiLCJnIiwicmVtb3ZlTGlzdGVuZXIiLCJvbiIsImxpc3QiLCJjb3VudCIsInBvc2l0aW9uIiwiTmF0aXZlTW9kdWxlQm9vdHN0cmFwIiwiX3NvdXJjZSIsIl9jYWNoZSIsImNhY2hlZCIsImdldENhY2hlZCIsImV4aXN0cyIsIm5hdGl2ZU1vZHVsZSIsImNvbXBpbGUiLCJnZXRTb3VyY2UiLCJmbiIsInRoaXNPYmplY3QiLCJvdGhlck9iamVjdCIsInZhcnMiLCJrZXlzIiwia2V5Iiwic3RhcnR1cCJdLCJtYXBwaW5ncyI6IkFBQUMsYUFBWTtBQUNaOztBQUVBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0MsV0FBU0Esa0JBQVQsQ0FBNEJDLEdBQTVCLEVBQWlDQyxJQUFqQyxFQUF1Q0MsUUFBdkMsRUFBaUQ7QUFDL0MsVUFBTUMsSUFBSSxHQUFHLE9BQU9ILEdBQXBCOztBQUVBLFFBQUlHLElBQUksS0FBS0QsUUFBUSxDQUFDRSxXQUFULEVBQWIsRUFB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WUQsSUFBWixDQUFiO0FBQ0EsWUFBTXBRLE1BQU0sR0FBR3FRLElBQUksQ0FBQ3JRLE1BQXBCOztBQUVBLFdBQUssSUFBSWlCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdqQixNQUFwQixFQUE0QixFQUFFaUIsQ0FBOUIsRUFBaUM7QUFDL0IsY0FBTXFQLEdBQUcsR0FBR0QsSUFBSSxDQUFDcFAsQ0FBRCxDQUFoQjtBQUNBLGFBQUtxUCxHQUFMLElBQVlGLElBQUksQ0FBQ0UsR0FBRCxDQUFoQjtBQUNEO0FBQ0Y7O0FBRUQsYUFBU0MsT0FBVCxHQUFtQjtBQUNqQjNOLE1BQUFBLE1BQU0sQ0FBQ0EsTUFBUCxHQUFnQkEsTUFBaEIsQ0FEaUIsQ0FDTzs7QUFFeEJBLE1BQUFBLE1BQU0sQ0FBQytELEtBQVAsR0FBZUEsS0FBZixDQUhpQixDQUdLOztBQUV0QjtBQUNFQSxRQUFBQSxLQUFLLENBQUM0QixTQUFOLEdBQWtCQSxTQUFsQixDQURGLENBQytCO0FBQzdCOztBQUVBNUIsUUFBQUEsS0FBSyxDQUFDc0csWUFBTixHQUFxQnVDLHFCQUFxQixDQUFDNU0sTUFBRCxFQUFTK0QsS0FBVCxDQUExQyxDQUpGLENBSTZEO0FBQzNEO0FBQ0E7O0FBRUE2RyxRQUFBQSxxQkFBcUIsQ0FBQzVLLE1BQUQsRUFBUytELEtBQVQsQ0FBckI7QUFDRDs7QUFFRC9ELE1BQUFBLE1BQU0sQ0FBQzBJLEVBQVAsR0FBWTFJLE1BQU0sQ0FBQ3lJLFFBQVAsR0FBa0IyQixXQUFXLENBQUNwSyxNQUFELEVBQVMrRCxLQUFULENBQXpDO0FBQ0EvRCxNQUFBQSxNQUFNLENBQUNxRSxNQUFQLEdBQWdCUCxXQUFXLENBQUM5RCxNQUFELEVBQVMrRCxLQUFULENBQTNCO0FBQ0Q7O0FBRUQ0SixJQUFBQSxPQUFPO0FBQ1I7O0FBRUQsU0FBT2xILFNBQVA7O0FBRUEsQ0FyK0RBLEdBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0LyoqXG5cdCAqIEBwYXJhbSAgeyp9IGFyZyBwYXNzZWQgaW4gYXJndW1lbnQgdmFsdWVcblx0ICogQHBhcmFtICB7c3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIGFyZ3VtZW50XG5cdCAqIEBwYXJhbSAge3N0cmluZ30gdHlwZW5hbWUgaS5lLiAnc3RyaW5nJywgJ0Z1bmN0aW9uJyAodmFsdWUgaXMgY29tcGFyZWQgdG8gdHlwZW9mIGFmdGVyIGxvd2VyY2FzaW5nKVxuXHQgKiBAcmV0dXJuIHt2b2lkfVxuXHQgKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG5cdCAqL1xuXHRmdW5jdGlvbiBhc3NlcnRBcmd1bWVudFR5cGUoYXJnLCBuYW1lLCB0eXBlbmFtZSkge1xuXHQgIGNvbnN0IHR5cGUgPSB0eXBlb2YgYXJnO1xuXG5cdCAgaWYgKHR5cGUgIT09IHR5cGVuYW1lLnRvTG93ZXJDYXNlKCkpIHtcblx0ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFRoZSBcIiR7bmFtZX1cIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgJHt0eXBlbmFtZX0uIFJlY2VpdmVkIHR5cGUgJHt0eXBlfWApO1xuXHQgIH1cblx0fVxuXG5cdGNvbnN0IEZPUldBUkRfU0xBU0ggPSA0NzsgLy8gJy8nXG5cblx0Y29uc3QgQkFDS1dBUkRfU0xBU0ggPSA5MjsgLy8gJ1xcXFwnXG5cblx0LyoqXG5cdCAqIElzIHRoaXMgW2EtekEtWl0/XG5cdCAqIEBwYXJhbSAge251bWJlcn0gIGNoYXJDb2RlIHZhbHVlIGZyb20gU3RyaW5nLmNoYXJDb2RlQXQoKVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICBbZGVzY3JpcHRpb25dXG5cdCAqL1xuXG5cdGZ1bmN0aW9uIGlzV2luZG93c0RldmljZU5hbWUoY2hhckNvZGUpIHtcblx0ICByZXR1cm4gY2hhckNvZGUgPj0gNjUgJiYgY2hhckNvZGUgPD0gOTAgfHwgY2hhckNvZGUgPj0gOTcgJiYgY2hhckNvZGUgPD0gMTIyO1xuXHR9XG5cdC8qKlxuXHQgKiBbaXNBYnNvbHV0ZSBkZXNjcmlwdGlvbl1cblx0ICogQHBhcmFtICB7Ym9vbGVhbn0gaXNQb3NpeCB3aGV0aGVyIHRoaXMgaW1wbCBpcyBmb3IgUE9TSVggb3Igbm90XG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZmlsZXBhdGggICBpbnB1dCBmaWxlIHBhdGhcblx0ICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblxuXG5cdGZ1bmN0aW9uIGlzQWJzb2x1dGUoaXNQb3NpeCwgZmlsZXBhdGgpIHtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUoZmlsZXBhdGgsICdwYXRoJywgJ3N0cmluZycpO1xuXHQgIGNvbnN0IGxlbmd0aCA9IGZpbGVwYXRoLmxlbmd0aDsgLy8gZW1wdHkgc3RyaW5nIHNwZWNpYWwgY2FzZVxuXG5cdCAgaWYgKGxlbmd0aCA9PT0gMCkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblxuXHQgIGNvbnN0IGZpcnN0Q2hhciA9IGZpbGVwYXRoLmNoYXJDb2RlQXQoMCk7XG5cblx0ICBpZiAoZmlyc3RDaGFyID09PSBGT1JXQVJEX1NMQVNIKSB7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9IC8vIHdlIGFscmVhZHkgZGlkIG91ciBjaGVja3MgZm9yIHBvc2l4XG5cblxuXHQgIGlmIChpc1Bvc2l4KSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfSAvLyB3aW4zMiBmcm9tIGhlcmUgb24gb3V0XG5cblxuXHQgIGlmIChmaXJzdENoYXIgPT09IEJBQ0tXQVJEX1NMQVNIKSB7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cblx0ICBpZiAobGVuZ3RoID4gMiAmJiBpc1dpbmRvd3NEZXZpY2VOYW1lKGZpcnN0Q2hhcikgJiYgZmlsZXBhdGguY2hhckF0KDEpID09PSAnOicpIHtcblx0ICAgIGNvbnN0IHRoaXJkQ2hhciA9IGZpbGVwYXRoLmNoYXJBdCgyKTtcblx0ICAgIHJldHVybiB0aGlyZENoYXIgPT09ICcvJyB8fCB0aGlyZENoYXIgPT09ICdcXFxcJztcblx0ICB9XG5cblx0ICByZXR1cm4gZmFsc2U7XG5cdH1cblx0LyoqXG5cdCAqIFtkaXJuYW1lIGRlc2NyaXB0aW9uXVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciAgcGxhdGZvcm0tc3BlY2lmaWMgZmlsZSBzZXBhcmF0b3Jcblx0ICogQHBhcmFtICB7c3RyaW5nfSBmaWxlcGF0aCAgIGlucHV0IGZpbGUgcGF0aFxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblxuXG5cdGZ1bmN0aW9uIGRpcm5hbWUoc2VwYXJhdG9yLCBmaWxlcGF0aCkge1xuXHQgIGFzc2VydEFyZ3VtZW50VHlwZShmaWxlcGF0aCwgJ3BhdGgnLCAnc3RyaW5nJyk7XG5cdCAgY29uc3QgbGVuZ3RoID0gZmlsZXBhdGgubGVuZ3RoO1xuXG5cdCAgaWYgKGxlbmd0aCA9PT0gMCkge1xuXHQgICAgcmV0dXJuICcuJztcblx0ICB9IC8vIGlnbm9yZSB0cmFpbGluZyBzZXBhcmF0b3JcblxuXG5cdCAgbGV0IGZyb21JbmRleCA9IGxlbmd0aCAtIDE7XG5cdCAgY29uc3QgaGFkVHJhaWxpbmcgPSBmaWxlcGF0aC5lbmRzV2l0aChzZXBhcmF0b3IpO1xuXG5cdCAgaWYgKGhhZFRyYWlsaW5nKSB7XG5cdCAgICBmcm9tSW5kZXgtLTtcblx0ICB9XG5cblx0ICBjb25zdCBmb3VuZEluZGV4ID0gZmlsZXBhdGgubGFzdEluZGV4T2Yoc2VwYXJhdG9yLCBmcm9tSW5kZXgpOyAvLyBubyBzZXBhcmF0b3JzXG5cblx0ICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIHtcblx0ICAgIC8vIGhhbmRsZSBzcGVjaWFsIGNhc2Ugb2Ygcm9vdCB3aW5kb3dzIHBhdGhzXG5cdCAgICBpZiAobGVuZ3RoID49IDIgJiYgc2VwYXJhdG9yID09PSAnXFxcXCcgJiYgZmlsZXBhdGguY2hhckF0KDEpID09PSAnOicpIHtcblx0ICAgICAgY29uc3QgZmlyc3RDaGFyID0gZmlsZXBhdGguY2hhckNvZGVBdCgwKTtcblxuXHQgICAgICBpZiAoaXNXaW5kb3dzRGV2aWNlTmFtZShmaXJzdENoYXIpKSB7XG5cdCAgICAgICAgcmV0dXJuIGZpbGVwYXRoOyAvLyBpdCdzIGEgcm9vdCB3aW5kb3dzIHBhdGhcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gJy4nO1xuXHQgIH0gLy8gb25seSBmb3VuZCByb290IHNlcGFyYXRvclxuXG5cblx0ICBpZiAoZm91bmRJbmRleCA9PT0gMCkge1xuXHQgICAgcmV0dXJuIHNlcGFyYXRvcjsgLy8gaWYgaXQgd2FzICcvJywgcmV0dXJuIHRoYXRcblx0ICB9IC8vIEhhbmRsZSBzcGVjaWFsIGNhc2Ugb2YgJy8vc29tZXRoaW5nJ1xuXG5cblx0ICBpZiAoZm91bmRJbmRleCA9PT0gMSAmJiBzZXBhcmF0b3IgPT09ICcvJyAmJiBmaWxlcGF0aC5jaGFyQXQoMCkgPT09ICcvJykge1xuXHQgICAgcmV0dXJuICcvLyc7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGZpbGVwYXRoLnNsaWNlKDAsIGZvdW5kSW5kZXgpO1xuXHR9XG5cdC8qKlxuXHQgKiBbZXh0bmFtZSBkZXNjcmlwdGlvbl1cblx0ICogQHBhcmFtICB7c3RyaW5nfSBzZXBhcmF0b3IgIHBsYXRmb3JtLXNwZWNpZmljIGZpbGUgc2VwYXJhdG9yXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZmlsZXBhdGggICBpbnB1dCBmaWxlIHBhdGhcblx0ICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cblx0ICovXG5cblxuXHRmdW5jdGlvbiBleHRuYW1lKHNlcGFyYXRvciwgZmlsZXBhdGgpIHtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUoZmlsZXBhdGgsICdwYXRoJywgJ3N0cmluZycpO1xuXHQgIGNvbnN0IGluZGV4ID0gZmlsZXBhdGgubGFzdEluZGV4T2YoJy4nKTtcblxuXHQgIGlmIChpbmRleCA9PT0gLTEgfHwgaW5kZXggPT09IDApIHtcblx0ICAgIHJldHVybiAnJztcblx0ICB9IC8vIGlnbm9yZSB0cmFpbGluZyBzZXBhcmF0b3JcblxuXG5cdCAgbGV0IGVuZEluZGV4ID0gZmlsZXBhdGgubGVuZ3RoO1xuXG5cdCAgaWYgKGZpbGVwYXRoLmVuZHNXaXRoKHNlcGFyYXRvcikpIHtcblx0ICAgIGVuZEluZGV4LS07XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGZpbGVwYXRoLnNsaWNlKGluZGV4LCBlbmRJbmRleCk7XG5cdH1cblxuXHRmdW5jdGlvbiBsYXN0SW5kZXhXaW4zMlNlcGFyYXRvcihmaWxlcGF0aCwgaW5kZXgpIHtcblx0ICBmb3IgKGxldCBpID0gaW5kZXg7IGkgPj0gMDsgaS0tKSB7XG5cdCAgICBjb25zdCBjaGFyID0gZmlsZXBhdGguY2hhckNvZGVBdChpKTtcblxuXHQgICAgaWYgKGNoYXIgPT09IEJBQ0tXQVJEX1NMQVNIIHx8IGNoYXIgPT09IEZPUldBUkRfU0xBU0gpIHtcblx0ICAgICAgcmV0dXJuIGk7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgcmV0dXJuIC0xO1xuXHR9XG5cdC8qKlxuXHQgKiBbYmFzZW5hbWUgZGVzY3JpcHRpb25dXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gc2VwYXJhdG9yICBwbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHNlcGFyYXRvclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGZpbGVwYXRoICAgaW5wdXQgZmlsZSBwYXRoXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gW2V4dF0gICAgICBmaWxlIGV4dGVuc2lvbiB0byBkcm9wIGlmIGl0IGV4aXN0c1xuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblxuXG5cdGZ1bmN0aW9uIGJhc2VuYW1lKHNlcGFyYXRvciwgZmlsZXBhdGgsIGV4dCkge1xuXHQgIGFzc2VydEFyZ3VtZW50VHlwZShmaWxlcGF0aCwgJ3BhdGgnLCAnc3RyaW5nJyk7XG5cblx0ICBpZiAoZXh0ICE9PSB1bmRlZmluZWQpIHtcblx0ICAgIGFzc2VydEFyZ3VtZW50VHlwZShleHQsICdleHQnLCAnc3RyaW5nJyk7XG5cdCAgfVxuXG5cdCAgY29uc3QgbGVuZ3RoID0gZmlsZXBhdGgubGVuZ3RoO1xuXG5cdCAgaWYgKGxlbmd0aCA9PT0gMCkge1xuXHQgICAgcmV0dXJuICcnO1xuXHQgIH1cblxuXHQgIGNvbnN0IGlzUG9zaXggPSBzZXBhcmF0b3IgPT09ICcvJztcblx0ICBsZXQgZW5kSW5kZXggPSBsZW5ndGg7IC8vIGRyb3AgdHJhaWxpbmcgc2VwYXJhdG9yIChpZiB0aGVyZSBpcyBvbmUpXG5cblx0ICBjb25zdCBsYXN0Q2hhckNvZGUgPSBmaWxlcGF0aC5jaGFyQ29kZUF0KGxlbmd0aCAtIDEpO1xuXG5cdCAgaWYgKGxhc3RDaGFyQ29kZSA9PT0gRk9SV0FSRF9TTEFTSCB8fCAhaXNQb3NpeCAmJiBsYXN0Q2hhckNvZGUgPT09IEJBQ0tXQVJEX1NMQVNIKSB7XG5cdCAgICBlbmRJbmRleC0tO1xuXHQgIH0gLy8gRmluZCBsYXN0IG9jY3VyZW5jZSBvZiBzZXBhcmF0b3JcblxuXG5cdCAgbGV0IGxhc3RJbmRleCA9IC0xO1xuXG5cdCAgaWYgKGlzUG9zaXgpIHtcblx0ICAgIGxhc3RJbmRleCA9IGZpbGVwYXRoLmxhc3RJbmRleE9mKHNlcGFyYXRvciwgZW5kSW5kZXggLSAxKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgLy8gT24gd2luMzIsIGhhbmRsZSAqZWl0aGVyKiBzZXBhcmF0b3IhXG5cdCAgICBsYXN0SW5kZXggPSBsYXN0SW5kZXhXaW4zMlNlcGFyYXRvcihmaWxlcGF0aCwgZW5kSW5kZXggLSAxKTsgLy8gaGFuZGxlIHNwZWNpYWwgY2FzZSBvZiByb290IHBhdGggbGlrZSAnQzonIG9yICdDOlxcXFwnXG5cblx0ICAgIGlmICgobGFzdEluZGV4ID09PSAyIHx8IGxhc3RJbmRleCA9PT0gLTEpICYmIGZpbGVwYXRoLmNoYXJBdCgxKSA9PT0gJzonICYmIGlzV2luZG93c0RldmljZU5hbWUoZmlsZXBhdGguY2hhckNvZGVBdCgwKSkpIHtcblx0ICAgICAgcmV0dXJuICcnO1xuXHQgICAgfVxuXHQgIH0gLy8gVGFrZSBmcm9tIGxhc3Qgb2NjdXJyZW5jZSBvZiBzZXBhcmF0b3IgdG8gZW5kIG9mIHN0cmluZyAob3IgYmVnaW5uaW5nIHRvIGVuZCBpZiBub3QgZm91bmQpXG5cblxuXHQgIGNvbnN0IGJhc2UgPSBmaWxlcGF0aC5zbGljZShsYXN0SW5kZXggKyAxLCBlbmRJbmRleCk7IC8vIGRyb3AgdHJhaWxpbmcgZXh0ZW5zaW9uIChpZiBzcGVjaWZpZWQpXG5cblx0ICBpZiAoZXh0ID09PSB1bmRlZmluZWQpIHtcblx0ICAgIHJldHVybiBiYXNlO1xuXHQgIH1cblxuXHQgIHJldHVybiBiYXNlLmVuZHNXaXRoKGV4dCkgPyBiYXNlLnNsaWNlKDAsIGJhc2UubGVuZ3RoIC0gZXh0Lmxlbmd0aCkgOiBiYXNlO1xuXHR9XG5cdC8qKlxuXHQgKiBUaGUgYHBhdGgubm9ybWFsaXplKClgIG1ldGhvZCBub3JtYWxpemVzIHRoZSBnaXZlbiBwYXRoLCByZXNvbHZpbmcgJy4uJyBhbmQgJy4nIHNlZ21lbnRzLlxuXHQgKlxuXHQgKiBXaGVuIG11bHRpcGxlLCBzZXF1ZW50aWFsIHBhdGggc2VnbWVudCBzZXBhcmF0aW9uIGNoYXJhY3RlcnMgYXJlIGZvdW5kIChlLmcuXG5cdCAqIC8gb24gUE9TSVggYW5kIGVpdGhlciBcXCBvciAvIG9uIFdpbmRvd3MpLCB0aGV5IGFyZSByZXBsYWNlZCBieSBhIHNpbmdsZVxuXHQgKiBpbnN0YW5jZSBvZiB0aGUgcGxhdGZvcm0tc3BlY2lmaWMgcGF0aCBzZWdtZW50IHNlcGFyYXRvciAoLyBvbiBQT1NJWCBhbmQgXFxcblx0ICogb24gV2luZG93cykuIFRyYWlsaW5nIHNlcGFyYXRvcnMgYXJlIHByZXNlcnZlZC5cblx0ICpcblx0ICogSWYgdGhlIHBhdGggaXMgYSB6ZXJvLWxlbmd0aCBzdHJpbmcsICcuJyBpcyByZXR1cm5lZCwgcmVwcmVzZW50aW5nIHRoZVxuXHQgKiBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxuXHQgKlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciAgcGxhdGZvcm0tc3BlY2lmaWMgZmlsZSBzZXBhcmF0b3Jcblx0ICogQHBhcmFtICB7c3RyaW5nfSBmaWxlcGF0aCAgaW5wdXQgZmlsZSBwYXRoXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblxuXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZShzZXBhcmF0b3IsIGZpbGVwYXRoKSB7XG5cdCAgYXNzZXJ0QXJndW1lbnRUeXBlKGZpbGVwYXRoLCAncGF0aCcsICdzdHJpbmcnKTtcblxuXHQgIGlmIChmaWxlcGF0aC5sZW5ndGggPT09IDApIHtcblx0ICAgIHJldHVybiAnLic7XG5cdCAgfSAvLyBXaW5kb3dzIGNhbiBoYW5kbGUgJy8nIG9yICdcXFxcJyBhbmQgYm90aCBzaG91bGQgYmUgdHVybmVkIGludG8gc2VwYXJhdG9yXG5cblxuXHQgIGNvbnN0IGlzV2luZG93cyA9IHNlcGFyYXRvciA9PT0gJ1xcXFwnO1xuXG5cdCAgaWYgKGlzV2luZG93cykge1xuXHQgICAgZmlsZXBhdGggPSBmaWxlcGF0aC5yZXBsYWNlKC9cXC8vZywgc2VwYXJhdG9yKTtcblx0ICB9XG5cblx0ICBjb25zdCBoYWRMZWFkaW5nID0gZmlsZXBhdGguc3RhcnRzV2l0aChzZXBhcmF0b3IpOyAvLyBPbiBXaW5kb3dzLCBuZWVkIHRvIGhhbmRsZSBVTkMgcGF0aHMgKFxcXFxob3N0LW5hbWVcXFxccmVzb3VyY2VcXFxcZGlyKSBzcGVjaWFsIHRvIHJldGFpbiBsZWFkaW5nIGRvdWJsZSBiYWNrc2xhc2hcblxuXHQgIGNvbnN0IGlzVU5DID0gaGFkTGVhZGluZyAmJiBpc1dpbmRvd3MgJiYgZmlsZXBhdGgubGVuZ3RoID4gMiAmJiBmaWxlcGF0aC5jaGFyQXQoMSkgPT09ICdcXFxcJztcblx0ICBjb25zdCBoYWRUcmFpbGluZyA9IGZpbGVwYXRoLmVuZHNXaXRoKHNlcGFyYXRvcik7XG5cdCAgY29uc3QgcGFydHMgPSBmaWxlcGF0aC5zcGxpdChzZXBhcmF0b3IpO1xuXHQgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG5cdCAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBhcnRzKSB7XG5cdCAgICBpZiAoc2VnbWVudC5sZW5ndGggIT09IDAgJiYgc2VnbWVudCAhPT0gJy4nKSB7XG5cdCAgICAgIGlmIChzZWdtZW50ID09PSAnLi4nKSB7XG5cdCAgICAgICAgcmVzdWx0LnBvcCgpOyAvLyBGSVhNRTogV2hhdCBpZiB0aGlzIGdvZXMgYWJvdmUgcm9vdD8gU2hvdWxkIHdlIHRocm93IGFuIGVycm9yP1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnQpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgbGV0IG5vcm1hbGl6ZWQgPSBoYWRMZWFkaW5nID8gc2VwYXJhdG9yIDogJyc7XG5cdCAgbm9ybWFsaXplZCArPSByZXN1bHQuam9pbihzZXBhcmF0b3IpO1xuXG5cdCAgaWYgKGhhZFRyYWlsaW5nKSB7XG5cdCAgICBub3JtYWxpemVkICs9IHNlcGFyYXRvcjtcblx0ICB9XG5cblx0ICBpZiAoaXNVTkMpIHtcblx0ICAgIG5vcm1hbGl6ZWQgPSAnXFxcXCcgKyBub3JtYWxpemVkO1xuXHQgIH1cblxuXHQgIHJldHVybiBub3JtYWxpemVkO1xuXHR9XG5cdC8qKlxuXHQgKiBbYXNzZXJ0U2VnbWVudCBkZXNjcmlwdGlvbl1cblx0ICogQHBhcmFtICB7Kn0gc2VnbWVudCBbZGVzY3JpcHRpb25dXG5cdCAqIEByZXR1cm4ge3ZvaWR9ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblxuXG5cdGZ1bmN0aW9uIGFzc2VydFNlZ21lbnQoc2VnbWVudCkge1xuXHQgIGlmICh0eXBlb2Ygc2VnbWVudCAhPT0gJ3N0cmluZycpIHtcblx0ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFBhdGggbXVzdCBiZSBhIHN0cmluZy4gUmVjZWl2ZWQgJHtzZWdtZW50fWApO1xuXHQgIH1cblx0fVxuXHQvKipcblx0ICogVGhlIGBwYXRoLmpvaW4oKWAgbWV0aG9kIGpvaW5zIGFsbCBnaXZlbiBwYXRoIHNlZ21lbnRzIHRvZ2V0aGVyIHVzaW5nIHRoZVxuXHQgKiBwbGF0Zm9ybS1zcGVjaWZpYyBzZXBhcmF0b3IgYXMgYSBkZWxpbWl0ZXIsIHRoZW4gbm9ybWFsaXplcyB0aGUgcmVzdWx0aW5nIHBhdGguXG5cdCAqIFplcm8tbGVuZ3RoIHBhdGggc2VnbWVudHMgYXJlIGlnbm9yZWQuIElmIHRoZSBqb2luZWQgcGF0aCBzdHJpbmcgaXMgYSB6ZXJvLVxuXHQgKiBsZW5ndGggc3RyaW5nIHRoZW4gJy4nIHdpbGwgYmUgcmV0dXJuZWQsIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cblx0ICogQHBhcmFtICB7c3RyaW5nfSBzZXBhcmF0b3IgcGxhdGZvcm0tc3BlY2lmaWMgZmlsZSBzZXBhcmF0b3Jcblx0ICogQHBhcmFtICB7c3RyaW5nW119IHBhdGhzIFtkZXNjcmlwdGlvbl1cblx0ICogQHJldHVybiB7c3RyaW5nfSAgICAgICBUaGUgam9pbmVkIGZpbGVwYXRoXG5cdCAqL1xuXG5cblx0ZnVuY3Rpb24gam9pbihzZXBhcmF0b3IsIHBhdGhzKSB7XG5cdCAgY29uc3QgcmVzdWx0ID0gW107IC8vIG5haXZlIGltcGw6IGp1c3Qgam9pbiBhbGwgdGhlIHBhdGhzIHdpdGggc2VwYXJhdG9yXG5cblx0ICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGF0aHMpIHtcblx0ICAgIGFzc2VydFNlZ21lbnQoc2VnbWVudCk7XG5cblx0ICAgIGlmIChzZWdtZW50Lmxlbmd0aCAhPT0gMCkge1xuXHQgICAgICByZXN1bHQucHVzaChzZWdtZW50KTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICByZXR1cm4gbm9ybWFsaXplKHNlcGFyYXRvciwgcmVzdWx0LmpvaW4oc2VwYXJhdG9yKSk7XG5cdH1cblx0LyoqXG5cdCAqIFRoZSBgcGF0aC5yZXNvbHZlKClgIG1ldGhvZCByZXNvbHZlcyBhIHNlcXVlbmNlIG9mIHBhdGhzIG9yIHBhdGggc2VnbWVudHMgaW50byBhbiBhYnNvbHV0ZSBwYXRoLlxuXHQgKlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciBwbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHNlcGFyYXRvclxuXHQgKiBAcGFyYW0gIHtzdHJpbmdbXX0gcGF0aHMgW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgIFtkZXNjcmlwdGlvbl1cblx0ICovXG5cblxuXHRmdW5jdGlvbiByZXNvbHZlKHNlcGFyYXRvciwgcGF0aHMpIHtcblx0ICBsZXQgcmVzb2x2ZWQgPSAnJztcblx0ICBsZXQgaGl0Um9vdCA9IGZhbHNlO1xuXHQgIGNvbnN0IGlzUG9zaXggPSBzZXBhcmF0b3IgPT09ICcvJzsgLy8gZ28gZnJvbSByaWdodCB0byBsZWZ0IHVudGlsIHdlIGhpdCBhYnNvbHV0ZSBwYXRoL3Jvb3RcblxuXHQgIGZvciAobGV0IGkgPSBwYXRocy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHQgICAgY29uc3Qgc2VnbWVudCA9IHBhdGhzW2ldO1xuXHQgICAgYXNzZXJ0U2VnbWVudChzZWdtZW50KTtcblxuXHQgICAgaWYgKHNlZ21lbnQubGVuZ3RoID09PSAwKSB7XG5cdCAgICAgIGNvbnRpbnVlOyAvLyBza2lwIGVtcHR5XG5cdCAgICB9XG5cblx0ICAgIHJlc29sdmVkID0gc2VnbWVudCArIHNlcGFyYXRvciArIHJlc29sdmVkOyAvLyBwcmVwZW5kIG5ldyBzZWdtZW50XG5cblx0ICAgIGlmIChpc0Fic29sdXRlKGlzUG9zaXgsIHNlZ21lbnQpKSB7XG5cdCAgICAgIC8vIGhhdmUgd2UgYmFja2VkIGludG8gYW4gYWJzb2x1dGUgcGF0aD9cblx0ICAgICAgaGl0Um9vdCA9IHRydWU7XG5cdCAgICAgIGJyZWFrO1xuXHQgICAgfVxuXHQgIH0gLy8gaWYgd2UgZGlkbid0IGhpdCByb290LCBwcmVwZW5kIGN3ZFxuXG5cblx0ICBpZiAoIWhpdFJvb3QpIHtcblx0ICAgIHJlc29sdmVkID0gKGdsb2JhbC5wcm9jZXNzID8gcHJvY2Vzcy5jd2QoKSA6ICcvJykgKyBzZXBhcmF0b3IgKyByZXNvbHZlZDtcblx0ICB9XG5cblx0ICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplKHNlcGFyYXRvciwgcmVzb2x2ZWQpO1xuXG5cdCAgaWYgKG5vcm1hbGl6ZWQuY2hhckF0KG5vcm1hbGl6ZWQubGVuZ3RoIC0gMSkgPT09IHNlcGFyYXRvcikge1xuXHQgICAgLy8gRklYTUU6IEhhbmRsZSBVTkMgcGF0aHMgb24gV2luZG93cyBhcyB3ZWxsLCBzbyB3ZSBkb24ndCB0cmltIHRyYWlsaW5nIHNlcGFyYXRvciBvbiBzb21ldGhpbmcgbGlrZSAnXFxcXFxcXFxob3N0LW5hbWVcXFxccmVzb3VyY2VcXFxcJ1xuXHQgICAgLy8gRG9uJ3QgcmVtb3ZlIHRyYWlsaW5nIHNlcGFyYXRvciBpZiB0aGlzIGlzIHJvb3QgcGF0aCBvbiB3aW5kb3dzIVxuXHQgICAgaWYgKCFpc1Bvc2l4ICYmIG5vcm1hbGl6ZWQubGVuZ3RoID09PSAzICYmIG5vcm1hbGl6ZWQuY2hhckF0KDEpID09PSAnOicgJiYgaXNXaW5kb3dzRGV2aWNlTmFtZShub3JtYWxpemVkLmNoYXJDb2RlQXQoMCkpKSB7XG5cdCAgICAgIHJldHVybiBub3JtYWxpemVkO1xuXHQgICAgfSAvLyBvdGhlcndpc2UgdHJpbSB0cmFpbGluZyBzZXBhcmF0b3JcblxuXG5cdCAgICByZXR1cm4gbm9ybWFsaXplZC5zbGljZSgwLCBub3JtYWxpemVkLmxlbmd0aCAtIDEpO1xuXHQgIH1cblxuXHQgIHJldHVybiBub3JtYWxpemVkO1xuXHR9XG5cdC8qKlxuXHQgKiBUaGUgYHBhdGgucmVsYXRpdmUoKWAgbWV0aG9kIHJldHVybnMgdGhlIHJlbGF0aXZlIHBhdGggYGZyb21gIGZyb20gdG8gYHRvYCBiYXNlZFxuXHQgKiBvbiB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS4gSWYgZnJvbSBhbmQgdG8gZWFjaCByZXNvbHZlIHRvIHRoZSBzYW1lXG5cdCAqIHBhdGggKGFmdGVyIGNhbGxpbmcgYHBhdGgucmVzb2x2ZSgpYCBvbiBlYWNoKSwgYSB6ZXJvLWxlbmd0aCBzdHJpbmcgaXMgcmV0dXJuZWQuXG5cdCAqXG5cdCAqIElmIGEgemVyby1sZW5ndGggc3RyaW5nIGlzIHBhc3NlZCBhcyBgZnJvbWAgb3IgYHRvYCwgdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3Rvcnlcblx0ICogd2lsbCBiZSB1c2VkIGluc3RlYWQgb2YgdGhlIHplcm8tbGVuZ3RoIHN0cmluZ3MuXG5cdCAqXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gc2VwYXJhdG9yIHBsYXRmb3JtLXNwZWNpZmljIGZpbGUgc2VwYXJhdG9yXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZnJvbSBbZGVzY3JpcHRpb25dXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gdG8gICBbZGVzY3JpcHRpb25dXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gICAgICBbZGVzY3JpcHRpb25dXG5cdCAqL1xuXG5cblx0ZnVuY3Rpb24gcmVsYXRpdmUoc2VwYXJhdG9yLCBmcm9tLCB0bykge1xuXHQgIGFzc2VydEFyZ3VtZW50VHlwZShmcm9tLCAnZnJvbScsICdzdHJpbmcnKTtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUodG8sICd0bycsICdzdHJpbmcnKTtcblxuXHQgIGlmIChmcm9tID09PSB0bykge1xuXHQgICAgcmV0dXJuICcnO1xuXHQgIH1cblxuXHQgIGZyb20gPSByZXNvbHZlKHNlcGFyYXRvciwgW2Zyb21dKTtcblx0ICB0byA9IHJlc29sdmUoc2VwYXJhdG9yLCBbdG9dKTtcblxuXHQgIGlmIChmcm9tID09PSB0bykge1xuXHQgICAgcmV0dXJuICcnO1xuXHQgIH0gLy8gd2Ugbm93IGhhdmUgdHdvIGFic29sdXRlIHBhdGhzLFxuXHQgIC8vIGxldHMgXCJnbyB1cFwiIGZyb20gYGZyb21gIHVudGlsIHdlIHJlYWNoIGNvbW1vbiBiYXNlIGRpciBvZiBgdG9gXG5cdCAgLy8gY29uc3Qgb3JpZ2luYWxGcm9tID0gZnJvbTtcblxuXG5cdCAgbGV0IHVwQ291bnQgPSAwO1xuXHQgIGxldCByZW1haW5pbmdQYXRoID0gJyc7XG5cblx0ICB3aGlsZSAodHJ1ZSkge1xuXHQgICAgaWYgKHRvLnN0YXJ0c1dpdGgoZnJvbSkpIHtcblx0ICAgICAgLy8gbWF0Y2ghIHJlY29yZCByZXN0Li4uP1xuXHQgICAgICByZW1haW5pbmdQYXRoID0gdG8uc2xpY2UoZnJvbS5sZW5ndGgpO1xuXHQgICAgICBicmVhaztcblx0ICAgIH0gLy8gRklYTUU6IEJyZWFrL3Rocm93IGlmIHdlIGhpdCBiYWQgZWRnZSBjYXNlIG9mIG5vIGNvbW1vbiByb290IVxuXG5cblx0ICAgIGZyb20gPSBkaXJuYW1lKHNlcGFyYXRvciwgZnJvbSk7XG5cdCAgICB1cENvdW50Kys7XG5cdCAgfSAvLyByZW1vdmUgbGVhZGluZyBzZXBhcmF0b3IgZnJvbSByZW1haW5pbmdQYXRoIGlmIHRoZXJlIGlzIGFueVxuXG5cblx0ICBpZiAocmVtYWluaW5nUGF0aC5sZW5ndGggPiAwKSB7XG5cdCAgICByZW1haW5pbmdQYXRoID0gcmVtYWluaW5nUGF0aC5zbGljZSgxKTtcblx0ICB9XG5cblx0ICByZXR1cm4gKCcuLicgKyBzZXBhcmF0b3IpLnJlcGVhdCh1cENvdW50KSArIHJlbWFpbmluZ1BhdGg7XG5cdH1cblx0LyoqXG5cdCAqIFRoZSBgcGF0aC5wYXJzZSgpYCBtZXRob2QgcmV0dXJucyBhbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyByZXByZXNlbnRcblx0ICogc2lnbmlmaWNhbnQgZWxlbWVudHMgb2YgdGhlIHBhdGguIFRyYWlsaW5nIGRpcmVjdG9yeSBzZXBhcmF0b3JzIGFyZSBpZ25vcmVkLFxuXHQgKiBzZWUgYHBhdGguc2VwYC5cblx0ICpcblx0ICogVGhlIHJldHVybmVkIG9iamVjdCB3aWxsIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuXHQgKlxuXHQgKiAtIGRpciA8c3RyaW5nPlxuXHQgKiAtIHJvb3QgPHN0cmluZz5cblx0ICogLSBiYXNlIDxzdHJpbmc+XG5cdCAqIC0gbmFtZSA8c3RyaW5nPlxuXHQgKiAtIGV4dCA8c3RyaW5nPlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciBwbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHNlcGFyYXRvclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGZpbGVwYXRoIFtkZXNjcmlwdGlvbl1cblx0ICogQHJldHVybiB7b2JqZWN0fVxuXHQgKi9cblxuXG5cdGZ1bmN0aW9uIHBhcnNlKHNlcGFyYXRvciwgZmlsZXBhdGgpIHtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUoZmlsZXBhdGgsICdwYXRoJywgJ3N0cmluZycpO1xuXHQgIGNvbnN0IHJlc3VsdCA9IHtcblx0ICAgIHJvb3Q6ICcnLFxuXHQgICAgZGlyOiAnJyxcblx0ICAgIGJhc2U6ICcnLFxuXHQgICAgZXh0OiAnJyxcblx0ICAgIG5hbWU6ICcnXG5cdCAgfTtcblx0ICBjb25zdCBsZW5ndGggPSBmaWxlcGF0aC5sZW5ndGg7XG5cblx0ICBpZiAobGVuZ3RoID09PSAwKSB7XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHQgIH0gLy8gQ2hlYXQgYW5kIGp1c3QgY2FsbCBvdXIgb3RoZXIgbWV0aG9kcyBmb3IgZGlybmFtZS9iYXNlbmFtZS9leHRuYW1lP1xuXG5cblx0ICByZXN1bHQuYmFzZSA9IGJhc2VuYW1lKHNlcGFyYXRvciwgZmlsZXBhdGgpO1xuXHQgIHJlc3VsdC5leHQgPSBleHRuYW1lKHNlcGFyYXRvciwgcmVzdWx0LmJhc2UpO1xuXHQgIGNvbnN0IGJhc2VMZW5ndGggPSByZXN1bHQuYmFzZS5sZW5ndGg7XG5cdCAgcmVzdWx0Lm5hbWUgPSByZXN1bHQuYmFzZS5zbGljZSgwLCBiYXNlTGVuZ3RoIC0gcmVzdWx0LmV4dC5sZW5ndGgpO1xuXHQgIGNvbnN0IHRvU3VidHJhY3QgPSBiYXNlTGVuZ3RoID09PSAwID8gMCA6IGJhc2VMZW5ndGggKyAxO1xuXHQgIHJlc3VsdC5kaXIgPSBmaWxlcGF0aC5zbGljZSgwLCBmaWxlcGF0aC5sZW5ndGggLSB0b1N1YnRyYWN0KTsgLy8gZHJvcCB0cmFpbGluZyBzZXBhcmF0b3IhXG5cblx0ICBjb25zdCBmaXJzdENoYXJDb2RlID0gZmlsZXBhdGguY2hhckNvZGVBdCgwKTsgLy8gYm90aCB3aW4zMiBhbmQgUE9TSVggcmV0dXJuICcvJyByb290XG5cblx0ICBpZiAoZmlyc3RDaGFyQ29kZSA9PT0gRk9SV0FSRF9TTEFTSCkge1xuXHQgICAgcmVzdWx0LnJvb3QgPSAnLyc7XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHQgIH0gLy8gd2UncmUgZG9uZSB3aXRoIFBPU0lYLi4uXG5cblxuXHQgIGlmIChzZXBhcmF0b3IgPT09ICcvJykge1xuXHQgICAgcmV0dXJuIHJlc3VsdDtcblx0ICB9IC8vIGZvciB3aW4zMi4uLlxuXG5cblx0ICBpZiAoZmlyc3RDaGFyQ29kZSA9PT0gQkFDS1dBUkRfU0xBU0gpIHtcblx0ICAgIC8vIEZJWE1FOiBIYW5kbGUgVU5DIHBhdGhzIGxpa2UgJ1xcXFxcXFxcaG9zdC1uYW1lXFxcXHJlc291cmNlXFxcXGZpbGVfcGF0aCdcblx0ICAgIC8vIG5lZWQgdG8gcmV0YWluICdcXFxcXFxcXGhvc3QtbmFtZVxcXFxyZXNvdXJjZVxcXFwnIGFzIHJvb3QgaW4gdGhhdCBjYXNlIVxuXHQgICAgcmVzdWx0LnJvb3QgPSAnXFxcXCc7XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHQgIH0gLy8gY2hlY2sgZm9yIEM6IHN0eWxlIHJvb3RcblxuXG5cdCAgaWYgKGxlbmd0aCA+IDEgJiYgaXNXaW5kb3dzRGV2aWNlTmFtZShmaXJzdENoYXJDb2RlKSAmJiBmaWxlcGF0aC5jaGFyQXQoMSkgPT09ICc6Jykge1xuXHQgICAgaWYgKGxlbmd0aCA+IDIpIHtcblx0ICAgICAgLy8gaXMgaXQgbGlrZSBDOlxcXFw/XG5cdCAgICAgIGNvbnN0IHRoaXJkQ2hhckNvZGUgPSBmaWxlcGF0aC5jaGFyQ29kZUF0KDIpO1xuXG5cdCAgICAgIGlmICh0aGlyZENoYXJDb2RlID09PSBGT1JXQVJEX1NMQVNIIHx8IHRoaXJkQ2hhckNvZGUgPT09IEJBQ0tXQVJEX1NMQVNIKSB7XG5cdCAgICAgICAgcmVzdWx0LnJvb3QgPSBmaWxlcGF0aC5zbGljZSgwLCAzKTtcblx0ICAgICAgICByZXR1cm4gcmVzdWx0O1xuXHQgICAgICB9XG5cdCAgICB9IC8vIG5vcGUsIGp1c3QgQzosIG5vIHRyYWlsaW5nIHNlcGFyYXRvclxuXG5cblx0ICAgIHJlc3VsdC5yb290ID0gZmlsZXBhdGguc2xpY2UoMCwgMik7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIHJlc3VsdDtcblx0fVxuXHQvKipcblx0ICogVGhlIGBwYXRoLmZvcm1hdCgpYCBtZXRob2QgcmV0dXJucyBhIHBhdGggc3RyaW5nIGZyb20gYW4gb2JqZWN0LiBUaGlzIGlzIHRoZVxuXHQgKiBvcHBvc2l0ZSBvZiBgcGF0aC5wYXJzZSgpYC5cblx0ICpcblx0ICogQHBhcmFtICB7c3RyaW5nfSBzZXBhcmF0b3IgcGxhdGZvcm0tc3BlY2lmaWMgZmlsZSBzZXBhcmF0b3Jcblx0ICogQHBhcmFtICB7b2JqZWN0fSBwYXRoT2JqZWN0IG9iamVjdCBvZiBmb3JtYXQgcmV0dXJuZWQgYnkgYHBhdGgucGFyc2UoKWBcblx0ICogQHBhcmFtICB7c3RyaW5nfSBwYXRoT2JqZWN0LmRpciBkaXJlY3RvcnkgbmFtZVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHBhdGhPYmplY3Qucm9vdCBmaWxlIHJvb3QgZGlyLCBpZ25vcmVkIGlmIGBwYXRoT2JqZWN0LmRpcmAgaXMgcHJvdmlkZWRcblx0ICogQHBhcmFtICB7c3RyaW5nfSBwYXRoT2JqZWN0LmJhc2UgZmlsZSBiYXNlbmFtZVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHBhdGhPYmplY3QubmFtZSBiYXNlbmFtZSBtaW51cyBleHRlbnNpb24sIGlnbm9yZWQgaWYgYHBhdGhPYmplY3QuYmFzZWAgZXhpc3RzXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gcGF0aE9iamVjdC5leHQgZmlsZSBleHRlbnNpb24sIGlnbm9yZWQgaWYgYHBhdGhPYmplY3QuYmFzZWAgZXhpc3RzXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cblxuXHRmdW5jdGlvbiBmb3JtYXQoc2VwYXJhdG9yLCBwYXRoT2JqZWN0KSB7XG5cdCAgYXNzZXJ0QXJndW1lbnRUeXBlKHBhdGhPYmplY3QsICdwYXRoT2JqZWN0JywgJ29iamVjdCcpO1xuXHQgIGNvbnN0IGJhc2UgPSBwYXRoT2JqZWN0LmJhc2UgfHwgYCR7cGF0aE9iamVjdC5uYW1lIHx8ICcnfSR7cGF0aE9iamVjdC5leHQgfHwgJyd9YDsgLy8gYXBwZW5kIGJhc2UgdG8gcm9vdCBpZiBgZGlyYCB3YXNuJ3Qgc3BlY2lmaWVkLCBvciBpZlxuXHQgIC8vIGRpciBpcyB0aGUgcm9vdFxuXG5cdCAgaWYgKCFwYXRoT2JqZWN0LmRpciB8fCBwYXRoT2JqZWN0LmRpciA9PT0gcGF0aE9iamVjdC5yb290KSB7XG5cdCAgICByZXR1cm4gYCR7cGF0aE9iamVjdC5yb290IHx8ICcnfSR7YmFzZX1gO1xuXHQgIH0gLy8gY29tYmluZSBkaXIgKyAvICsgYmFzZVxuXG5cblx0ICByZXR1cm4gYCR7cGF0aE9iamVjdC5kaXJ9JHtzZXBhcmF0b3J9JHtiYXNlfWA7XG5cdH1cblx0LyoqXG5cdCAqIE9uIFdpbmRvd3Mgc3lzdGVtcyBvbmx5LCByZXR1cm5zIGFuIGVxdWl2YWxlbnQgbmFtZXNwYWNlLXByZWZpeGVkIHBhdGggZm9yXG5cdCAqIHRoZSBnaXZlbiBwYXRoLiBJZiBwYXRoIGlzIG5vdCBhIHN0cmluZywgcGF0aCB3aWxsIGJlIHJldHVybmVkIHdpdGhvdXQgbW9kaWZpY2F0aW9ucy5cblx0ICogU2VlIGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2VuLXVzL3dpbmRvd3MvZGVza3RvcC9GaWxlSU8vbmFtaW5nLWEtZmlsZSNuYW1lc3BhY2VzXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZmlsZXBhdGggW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgIFtkZXNjcmlwdGlvbl1cblx0ICovXG5cblxuXHRmdW5jdGlvbiB0b05hbWVzcGFjZWRQYXRoKGZpbGVwYXRoKSB7XG5cdCAgaWYgKHR5cGVvZiBmaWxlcGF0aCAhPT0gJ3N0cmluZycpIHtcblx0ICAgIHJldHVybiBmaWxlcGF0aDtcblx0ICB9XG5cblx0ICBpZiAoZmlsZXBhdGgubGVuZ3RoID09PSAwKSB7XG5cdCAgICByZXR1cm4gJyc7XG5cdCAgfVxuXG5cdCAgY29uc3QgcmVzb2x2ZWRQYXRoID0gcmVzb2x2ZSgnXFxcXCcsIFtmaWxlcGF0aF0pO1xuXHQgIGNvbnN0IGxlbmd0aCA9IHJlc29sdmVkUGF0aC5sZW5ndGg7XG5cblx0ICBpZiAobGVuZ3RoIDwgMikge1xuXHQgICAgLy8gbmVlZCAnXFxcXFxcXFwnIG9yICdDOicgbWluaW11bVxuXHQgICAgcmV0dXJuIGZpbGVwYXRoO1xuXHQgIH1cblxuXHQgIGNvbnN0IGZpcnN0Q2hhckNvZGUgPSByZXNvbHZlZFBhdGguY2hhckNvZGVBdCgwKTsgLy8gaWYgc3RhcnQgd2l0aCAnXFxcXFxcXFwnLCBwcmVmaXggd2l0aCBVTkMgcm9vdCwgZHJvcCB0aGUgc2xhc2hlc1xuXG5cdCAgaWYgKGZpcnN0Q2hhckNvZGUgPT09IEJBQ0tXQVJEX1NMQVNIICYmIHJlc29sdmVkUGF0aC5jaGFyQXQoMSkgPT09ICdcXFxcJykge1xuXHQgICAgLy8gcmV0dXJuIGFzLWlzIGlmIGl0J3MgYW4gYXJlYWR5IGxvbmcgcGF0aCAoJ1xcXFxcXFxcP1xcXFwnIG9yICdcXFxcXFxcXC5cXFxcJyBwcmVmaXgpXG5cdCAgICBpZiAobGVuZ3RoID49IDMpIHtcblx0ICAgICAgY29uc3QgdGhpcmRDaGFyID0gcmVzb2x2ZWRQYXRoLmNoYXJBdCgyKTtcblxuXHQgICAgICBpZiAodGhpcmRDaGFyID09PSAnPycgfHwgdGhpcmRDaGFyID09PSAnLicpIHtcblx0ICAgICAgICByZXR1cm4gZmlsZXBhdGg7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcmV0dXJuICdcXFxcXFxcXD9cXFxcVU5DXFxcXCcgKyByZXNvbHZlZFBhdGguc2xpY2UoMik7XG5cdCAgfSBlbHNlIGlmIChpc1dpbmRvd3NEZXZpY2VOYW1lKGZpcnN0Q2hhckNvZGUpICYmIHJlc29sdmVkUGF0aC5jaGFyQXQoMSkgPT09ICc6Jykge1xuXHQgICAgcmV0dXJuICdcXFxcXFxcXD9cXFxcJyArIHJlc29sdmVkUGF0aDtcblx0ICB9XG5cblx0ICByZXR1cm4gZmlsZXBhdGg7XG5cdH1cblxuXHRjb25zdCBXaW4zMlBhdGggPSB7XG5cdCAgc2VwOiAnXFxcXCcsXG5cdCAgZGVsaW1pdGVyOiAnOycsXG5cdCAgYmFzZW5hbWU6IGZ1bmN0aW9uIChmaWxlcGF0aCwgZXh0KSB7XG5cdCAgICByZXR1cm4gYmFzZW5hbWUodGhpcy5zZXAsIGZpbGVwYXRoLCBleHQpO1xuXHQgIH0sXG5cdCAgbm9ybWFsaXplOiBmdW5jdGlvbiAoZmlsZXBhdGgpIHtcblx0ICAgIHJldHVybiBub3JtYWxpemUodGhpcy5zZXAsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIGpvaW46IGZ1bmN0aW9uICguLi5wYXRocykge1xuXHQgICAgcmV0dXJuIGpvaW4odGhpcy5zZXAsIHBhdGhzKTtcblx0ICB9LFxuXHQgIGV4dG5hbWU6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIGV4dG5hbWUodGhpcy5zZXAsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIGRpcm5hbWU6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIGRpcm5hbWUodGhpcy5zZXAsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIGlzQWJzb2x1dGU6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIGlzQWJzb2x1dGUoZmFsc2UsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIHJlbGF0aXZlOiBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcblx0ICAgIHJldHVybiByZWxhdGl2ZSh0aGlzLnNlcCwgZnJvbSwgdG8pO1xuXHQgIH0sXG5cdCAgcmVzb2x2ZTogZnVuY3Rpb24gKC4uLnBhdGhzKSB7XG5cdCAgICByZXR1cm4gcmVzb2x2ZSh0aGlzLnNlcCwgcGF0aHMpO1xuXHQgIH0sXG5cdCAgcGFyc2U6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIHBhcnNlKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBmb3JtYXQ6IGZ1bmN0aW9uIChwYXRoT2JqZWN0KSB7XG5cdCAgICByZXR1cm4gZm9ybWF0KHRoaXMuc2VwLCBwYXRoT2JqZWN0KTtcblx0ICB9LFxuXHQgIHRvTmFtZXNwYWNlZFBhdGg6IHRvTmFtZXNwYWNlZFBhdGhcblx0fTtcblx0Y29uc3QgUG9zaXhQYXRoID0ge1xuXHQgIHNlcDogJy8nLFxuXHQgIGRlbGltaXRlcjogJzonLFxuXHQgIGJhc2VuYW1lOiBmdW5jdGlvbiAoZmlsZXBhdGgsIGV4dCkge1xuXHQgICAgcmV0dXJuIGJhc2VuYW1lKHRoaXMuc2VwLCBmaWxlcGF0aCwgZXh0KTtcblx0ICB9LFxuXHQgIG5vcm1hbGl6ZTogZnVuY3Rpb24gKGZpbGVwYXRoKSB7XG5cdCAgICByZXR1cm4gbm9ybWFsaXplKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBqb2luOiBmdW5jdGlvbiAoLi4ucGF0aHMpIHtcblx0ICAgIHJldHVybiBqb2luKHRoaXMuc2VwLCBwYXRocyk7XG5cdCAgfSxcblx0ICBleHRuYW1lOiBmdW5jdGlvbiAoZmlsZXBhdGgpIHtcblx0ICAgIHJldHVybiBleHRuYW1lKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBkaXJuYW1lOiBmdW5jdGlvbiAoZmlsZXBhdGgpIHtcblx0ICAgIHJldHVybiBkaXJuYW1lKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBpc0Fic29sdXRlOiBmdW5jdGlvbiAoZmlsZXBhdGgpIHtcblx0ICAgIHJldHVybiBpc0Fic29sdXRlKHRydWUsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIHJlbGF0aXZlOiBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcblx0ICAgIHJldHVybiByZWxhdGl2ZSh0aGlzLnNlcCwgZnJvbSwgdG8pO1xuXHQgIH0sXG5cdCAgcmVzb2x2ZTogZnVuY3Rpb24gKC4uLnBhdGhzKSB7XG5cdCAgICByZXR1cm4gcmVzb2x2ZSh0aGlzLnNlcCwgcGF0aHMpO1xuXHQgIH0sXG5cdCAgcGFyc2U6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIHBhcnNlKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBmb3JtYXQ6IGZ1bmN0aW9uIChwYXRoT2JqZWN0KSB7XG5cdCAgICByZXR1cm4gZm9ybWF0KHRoaXMuc2VwLCBwYXRoT2JqZWN0KTtcblx0ICB9LFxuXHQgIHRvTmFtZXNwYWNlZFBhdGg6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIGZpbGVwYXRoOyAvLyBuby1vcFxuXHQgIH1cblx0fTtcblx0Y29uc3QgcGF0aCA9IFBvc2l4UGF0aDtcblx0cGF0aC53aW4zMiA9IFdpbjMyUGF0aDtcblx0cGF0aC5wb3NpeCA9IFBvc2l4UGF0aDtcblxuXHQvKipcblx0ICogQXBwY2VsZXJhdG9yIFRpdGFuaXVtIE1vYmlsZVxuXHQgKiBDb3B5cmlnaHQgKGMpIDIwMTEtUHJlc2VudCBieSBBcHBjZWxlcmF0b3IsIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cblx0ICogTGljZW5zZWQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBBcGFjaGUgUHVibGljIExpY2Vuc2Vcblx0ICogUGxlYXNlIHNlZSB0aGUgTElDRU5TRSBpbmNsdWRlZCB3aXRoIHRoaXMgZGlzdHJpYnV0aW9uIGZvciBkZXRhaWxzLlxuXHQgKi9cblxuXHQvKipcblx0ICogR2VuZXJhdGVzIGEgd3JhcHBlZCBpbnZva2VyIGZ1bmN0aW9uIGZvciBhIHNwZWNpZmljIEFQSVxuXHQgKiBUaGlzIGxldHMgdXMgcGFzcyBpbiBjb250ZXh0LXNwZWNpZmljIGRhdGEgdG8gYSBmdW5jdGlvblxuXHQgKiBkZWZpbmVkIGluIGFuIEFQSSBuYW1lc3BhY2UgKGkuZS4gb24gYSBtb2R1bGUpXG5cdCAqXG5cdCAqIFdlIHVzZSB0aGlzIGZvciBjcmVhdGUgbWV0aG9kcywgYW5kIG90aGVyIEFQSXMgdGhhdCB0YWtlXG5cdCAqIGEgS3JvbGxJbnZvY2F0aW9uIG9iamVjdCBhcyB0aGVpciBmaXJzdCBhcmd1bWVudCBpbiBKYXZhXG5cdCAqXG5cdCAqIEZvciBleGFtcGxlLCBhbiBpbnZva2VyIGZvciBhIFwiY3JlYXRlXCIgbWV0aG9kIG1pZ2h0IGxvb2tcblx0ICogc29tZXRoaW5nIGxpa2UgdGhpczpcblx0ICpcblx0ICogICAgIGZ1bmN0aW9uIGNyZWF0ZVZpZXcoc291cmNlVXJsLCBvcHRpb25zKSB7XG5cdCAqICAgICAgICAgdmFyIHZpZXcgPSBuZXcgVmlldyhvcHRpb25zKTtcblx0ICogICAgICAgICB2aWV3LnNvdXJjZVVybCA9IHNvdXJjZVVybDtcblx0ICogICAgICAgICByZXR1cm4gdmlldztcblx0ICogICAgIH1cblx0ICpcblx0ICogQW5kIHRoZSBjb3JyZXNwb25kaW5nIGludm9rZXIgZm9yIGFwcC5qcyB3b3VsZCBsb29rIGxpa2U6XG5cdCAqXG5cdCAqICAgICBVSS5jcmVhdGVWaWV3ID0gZnVuY3Rpb24oKSB7XG5cdCAqICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoXCJhcHA6Ly9hcHAuanNcIiwgYXJndW1lbnRzWzBdKTtcblx0ICogICAgIH1cblx0ICpcblx0ICogd3JhcHBlckFQSTogVGhlIHNjb3BlIHNwZWNpZmljIEFQSSAobW9kdWxlKSB3cmFwcGVyXG5cdCAqIHJlYWxBUEk6IFRoZSBhY3R1YWwgbW9kdWxlIGltcGxlbWVudGF0aW9uXG5cdCAqIGFwaU5hbWU6IFRoZSB0b3AgbGV2ZWwgQVBJIG5hbWUgb2YgdGhlIHJvb3QgbW9kdWxlXG5cdCAqIGludm9jYXRpb25BUEk6IFRoZSBhY3R1YWwgQVBJIHRvIGdlbmVyYXRlIGFuIGludm9rZXIgZm9yXG5cdCAqIHNjb3BlVmFyczogQSBtYXAgdGhhdCBpcyBwYXNzZWQgaW50byBlYWNoIGludm9rZXJcblx0ICovXG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSB3cmFwcGVyQVBJIGUuZy4gVGl0YW5pdW1XcmFwcGVyXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSByZWFsQVBJIGUuZy4gVGl0YW5pdW1cblx0ICogQHBhcmFtIHtzdHJpbmd9IGFwaU5hbWUgZS5nLiAnVGl0YW5pdW0nXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBpbnZvY2F0aW9uQVBJIGRldGFpbHMgb24gdGhlIGFwaSB3ZSdyZSB3cmFwcGluZ1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gaW52b2NhdGlvbkFQSS5uYW1lc3BhY2UgdGhlIG5hbWVzcGFjZSBvZiB0aGUgcHJveHkgd2hlcmUgbWV0aG9kIGhhbmdzICh3L28gJ1RpLicgcHJlZml4KSBlLmcuICdGaWxlc3lzdGVtJyBvciAnVUkuQW5kcm9pZCdcblx0ICogQHBhcmFtIHtzdHJpbmd9IGludm9jYXRpb25BUEkuYXBpIHRoZSBtZXRob2QgbmFtZSBlLmcuICdvcGVuRmlsZScgb3IgJ2NyZWF0ZVNlYXJjaFZpZXcnXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBzY29wZVZhcnMgaG9sZGVyIGZvciBjb250ZXh0IHNwZWNpZmljIHZhbHVlcyAoYmFzaWNhbGx5IGp1c3Qgd3JhcHMgc291cmNlVXJsKVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc2NvcGVWYXJzLnNvdXJjZVVybCBzb3VyY2UgVVJMIG9mIGpzIGZpbGUgZW50cnkgcG9pbnRcblx0ICogQHBhcmFtIHtNb2R1bGV9IFtzY29wZVZhcnMubW9kdWxlXSBtb2R1bGVcblx0ICovXG5cdGZ1bmN0aW9uIGdlbkludm9rZXIod3JhcHBlckFQSSwgcmVhbEFQSSwgYXBpTmFtZSwgaW52b2NhdGlvbkFQSSwgc2NvcGVWYXJzKSB7XG5cdCAgbGV0IGFwaU5hbWVzcGFjZSA9IHdyYXBwZXJBUEk7XG5cdCAgY29uc3QgbmFtZXNwYWNlID0gaW52b2NhdGlvbkFQSS5uYW1lc3BhY2U7XG5cblx0ICBpZiAobmFtZXNwYWNlICE9PSBhcGlOYW1lKSB7XG5cdCAgICBjb25zdCBuYW1lcyA9IG5hbWVzcGFjZS5zcGxpdCgnLicpO1xuXG5cdCAgICBmb3IgKGNvbnN0IG5hbWUgb2YgbmFtZXMpIHtcblx0ICAgICAgbGV0IGFwaTsgLy8gQ3JlYXRlIGEgbW9kdWxlIHdyYXBwZXIgb25seSBpZiBpdCBoYXNuJ3QgYmVlbiB3cmFwcGVkIGFscmVhZHkuXG5cblx0ICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcGlOYW1lc3BhY2UsIG5hbWUpKSB7XG5cdCAgICAgICAgYXBpID0gYXBpTmFtZXNwYWNlW25hbWVdO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGZ1bmN0aW9uIFNhbmRib3hBUEkoKSB7XG5cdCAgICAgICAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKTtcblx0ICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnX2V2ZW50cycsIHtcblx0ICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIHByb3RvLl9ldmVudHM7XG5cdCAgICAgICAgICAgIH0sXG5cdCAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdCAgICAgICAgICAgICAgcHJvdG8uX2V2ZW50cyA9IHZhbHVlO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICB9KTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBTYW5kYm94QVBJLnByb3RvdHlwZSA9IGFwaU5hbWVzcGFjZVtuYW1lXTtcblx0ICAgICAgICBhcGkgPSBuZXcgU2FuZGJveEFQSSgpO1xuXHQgICAgICAgIGFwaU5hbWVzcGFjZVtuYW1lXSA9IGFwaTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGFwaU5hbWVzcGFjZSA9IGFwaTtcblx0ICAgICAgcmVhbEFQSSA9IHJlYWxBUElbbmFtZV07XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgbGV0IGRlbGVnYXRlID0gcmVhbEFQSVtpbnZvY2F0aW9uQVBJLmFwaV07IC8vIFRoZXNlIGludm9rZXJzIGZvcm0gYSBjYWxsIGhpZXJhcmNoeSBzbyB3ZSBuZWVkIHRvXG5cdCAgLy8gcHJvdmlkZSBhIHdheSBiYWNrIHRvIHRoZSBhY3R1YWwgcm9vdCBUaXRhbml1bSAvIGFjdHVhbCBpbXBsLlxuXG5cdCAgd2hpbGUgKGRlbGVnYXRlLl9fZGVsZWdhdGVfXykge1xuXHQgICAgZGVsZWdhdGUgPSBkZWxlZ2F0ZS5fX2RlbGVnYXRlX187XG5cdCAgfVxuXG5cdCAgYXBpTmFtZXNwYWNlW2ludm9jYXRpb25BUEkuYXBpXSA9IGNyZWF0ZUludm9rZXIocmVhbEFQSSwgZGVsZWdhdGUsIHNjb3BlVmFycyk7XG5cdH1cblxuXHR2YXIgZ2VuSW52b2tlcl8xID0gZ2VuSW52b2tlcjtcblx0LyoqXG5cdCAqIENyZWF0ZXMgYW5kIHJldHVybnMgYSBzaW5nbGUgaW52b2tlciBmdW5jdGlvbiB0aGF0IHdyYXBzXG5cdCAqIGEgZGVsZWdhdGUgZnVuY3Rpb24sIHRoaXNPYmosIGFuZCBzY29wZVZhcnNcblx0ICogQHBhcmFtIHtvYmplY3R9IHRoaXNPYmogVGhlIGB0aGlzYCBvYmplY3QgdG8gdXNlIHdoZW4gaW52b2tpbmcgdGhlIGBkZWxlZ2F0ZWAgZnVuY3Rpb25cblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gZGVsZWdhdGUgVGhlIGZ1bmN0aW9uIHRvIHdyYXAvZGVsZWdhdGUgdG8gdW5kZXIgdGhlIGhvb2Rcblx0ICogQHBhcmFtIHtvYmplY3R9IHNjb3BlVmFycyBUaGUgc2NvcGUgdmFyaWFibGVzIHRvIHNwbGljZSBpbnRvIHRoZSBhcmd1bWVudHMgd2hlbiBjYWxsaW5nIHRoZSBkZWxlZ2F0ZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc2NvcGVWYXJzLnNvdXJjZVVybCB0aGUgb25seSByZWFsIHJlbGV2ZW50IHNjb3BlIHZhcmlhYmxlIVxuXHQgKiBAcmV0dXJuIHtmdW5jdGlvbn1cblx0ICovXG5cblx0ZnVuY3Rpb24gY3JlYXRlSW52b2tlcih0aGlzT2JqLCBkZWxlZ2F0ZSwgc2NvcGVWYXJzKSB7XG5cdCAgY29uc3QgdXJsSW52b2tlciA9IGZ1bmN0aW9uIGludm9rZXIoLi4uYXJncykge1xuXHQgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBmdW5jLXN0eWxlXG5cdCAgICBhcmdzLnNwbGljZSgwLCAwLCBpbnZva2VyLl9fc2NvcGVWYXJzX18pO1xuXHQgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KGludm9rZXIuX190aGlzT2JqX18sIGFyZ3MpO1xuXHQgIH07XG5cblx0ICB1cmxJbnZva2VyLl9fZGVsZWdhdGVfXyA9IGRlbGVnYXRlO1xuXHQgIHVybEludm9rZXIuX190aGlzT2JqX18gPSB0aGlzT2JqO1xuXHQgIHVybEludm9rZXIuX19zY29wZVZhcnNfXyA9IHNjb3BlVmFycztcblx0ICByZXR1cm4gdXJsSW52b2tlcjtcblx0fVxuXG5cdHZhciBjcmVhdGVJbnZva2VyXzEgPSBjcmVhdGVJbnZva2VyO1xuXHR2YXIgaW52b2tlciA9IHtcblx0ICBnZW5JbnZva2VyOiBnZW5JbnZva2VyXzEsXG5cdCAgY3JlYXRlSW52b2tlcjogY3JlYXRlSW52b2tlcl8xXG5cdH07XG5cblx0LyoqXG5cdCAqIEFwcGNlbGVyYXRvciBUaXRhbml1bSBNb2JpbGVcblx0ICogQ29weXJpZ2h0IChjKSAyMDExLVByZXNlbnQgYnkgQXBwY2VsZXJhdG9yLCBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG5cdCAqIExpY2Vuc2VkIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgQXBhY2hlIFB1YmxpYyBMaWNlbnNlXG5cdCAqIFBsZWFzZSBzZWUgdGhlIExJQ0VOU0UgaW5jbHVkZWQgd2l0aCB0aGlzIGRpc3RyaWJ1dGlvbiBmb3IgZGV0YWlscy5cblx0ICovXG5cblx0ZnVuY3Rpb24gYm9vdHN0cmFwJDIoZ2xvYmFsLCBrcm9sbCkge1xuXHQgIGNvbnN0IGFzc2V0cyA9IGtyb2xsLmJpbmRpbmcoJ2Fzc2V0cycpO1xuXHQgIGNvbnN0IFNjcmlwdCA9IGtyb2xsLmJpbmRpbmcoJ2V2YWxzJykuU2NyaXB0IDtcblx0ICAvKipcblx0ICAgKiBUaGUgbG9hZGVkIGluZGV4Lmpzb24gZmlsZSBmcm9tIHRoZSBhcHAuIFVzZWQgdG8gc3RvcmUgdGhlIGVuY3J5cHRlZCBKUyBhc3NldHMnXG5cdCAgICogZmlsZW5hbWVzL29mZnNldHMuXG5cdCAgICovXG5cblx0ICBsZXQgZmlsZUluZGV4OyAvLyBGSVhNRTogZml4IGZpbGUgbmFtZSBwYXJpdHkgYmV0d2VlbiBwbGF0Zm9ybXNcblxuXHQgIGNvbnN0IElOREVYX0pTT04gPSAnaW5kZXguanNvbicgO1xuXG5cdCAgY2xhc3MgTW9kdWxlIHtcblx0ICAgIC8qKlxuXHQgICAgICogW01vZHVsZSBkZXNjcmlwdGlvbl1cblx0ICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAgICAgIG1vZHVsZSBpZFxuXHQgICAgICogQHBhcmFtIHtNb2R1bGV9IHBhcmVudCAgcGFyZW50IG1vZHVsZVxuXHQgICAgICovXG5cdCAgICBjb25zdHJ1Y3RvcihpZCwgcGFyZW50KSB7XG5cdCAgICAgIHRoaXMuaWQgPSBpZDtcblx0ICAgICAgdGhpcy5leHBvcnRzID0ge307XG5cdCAgICAgIHRoaXMucGFyZW50ID0gcGFyZW50O1xuXHQgICAgICB0aGlzLmZpbGVuYW1lID0gbnVsbDtcblx0ICAgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcblx0ICAgICAgdGhpcy53cmFwcGVyQ2FjaGUgPSB7fTtcblx0ICAgICAgdGhpcy5pc1NlcnZpY2UgPSBmYWxzZTsgLy8gdG9nZ2xlZCBvbiBpZiB0aGlzIG1vZHVsZSBpcyB0aGUgc2VydmljZSBlbnRyeSBwb2ludFxuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBBdHRlbXB0cyB0byBsb2FkIHRoZSBtb2R1bGUuIElmIG5vIGZpbGUgaXMgZm91bmRcblx0ICAgICAqIHdpdGggdGhlIHByb3ZpZGVkIG5hbWUgYW4gZXhjZXB0aW9uIHdpbGwgYmUgdGhyb3duLlxuXHQgICAgICogT25jZSB0aGUgY29udGVudHMgb2YgdGhlIGZpbGUgYXJlIHJlYWQsIGl0IGlzIHJ1blxuXHQgICAgICogaW4gdGhlIGN1cnJlbnQgY29udGV4dC4gQSBzYW5kYm94IGlzIGNyZWF0ZWQgYnlcblx0ICAgICAqIGV4ZWN1dGluZyB0aGUgY29kZSBpbnNpZGUgYSB3cmFwcGVyIGZ1bmN0aW9uLlxuXHQgICAgICogVGhpcyBwcm92aWRlcyBhIHNwZWVkIGJvb3N0IHZzIGNyZWF0aW5nIGEgbmV3IGNvbnRleHQuXG5cdCAgICAgKlxuXHQgICAgICogQHBhcmFtICB7U3RyaW5nfSBmaWxlbmFtZSBbZGVzY3JpcHRpb25dXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNvdXJjZSAgIFtkZXNjcmlwdGlvbl1cblx0ICAgICAqIEByZXR1cm5zIHt2b2lkfVxuXHQgICAgICovXG5cblxuXHQgICAgbG9hZChmaWxlbmFtZSwgc291cmNlKSB7XG5cdCAgICAgIGlmICh0aGlzLmxvYWRlZCkge1xuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcignTW9kdWxlIGFscmVhZHkgbG9hZGVkLicpO1xuXHQgICAgICB9XG5cblx0ICAgICAgdGhpcy5maWxlbmFtZSA9IGZpbGVuYW1lO1xuXHQgICAgICB0aGlzLnBhdGggPSBwYXRoLmRpcm5hbWUoZmlsZW5hbWUpO1xuXHQgICAgICB0aGlzLnBhdGhzID0gdGhpcy5ub2RlTW9kdWxlc1BhdGhzKHRoaXMucGF0aCk7XG5cblx0ICAgICAgaWYgKCFzb3VyY2UpIHtcblx0ICAgICAgICBzb3VyY2UgPSBhc3NldHMucmVhZEFzc2V0KGBSZXNvdXJjZXMke2ZpbGVuYW1lfWAgKTtcblx0ICAgICAgfSAvLyBTdGljayBpdCBpbiB0aGUgY2FjaGVcblxuXG5cdCAgICAgIE1vZHVsZS5jYWNoZVt0aGlzLmZpbGVuYW1lXSA9IHRoaXM7XG5cblx0ICAgICAgdGhpcy5fcnVuU2NyaXB0KHNvdXJjZSwgdGhpcy5maWxlbmFtZSk7XG5cblx0ICAgICAgdGhpcy5sb2FkZWQgPSB0cnVlO1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBHZW5lcmF0ZXMgYSBjb250ZXh0LXNwZWNpZmljIG1vZHVsZSB3cmFwcGVyLCBhbmQgd3JhcHNcblx0ICAgICAqIGVhY2ggaW52b2NhdGlvbiBBUEkgaW4gYW4gZXh0ZXJuYWwgKDNyZCBwYXJ0eSkgbW9kdWxlXG5cdCAgICAgKiBTZWUgaW52b2tlci5qcyBmb3IgbW9yZSBpbmZvXG5cdCAgICAgKiBAcGFyYW0gIHtvYmplY3R9IGV4dGVybmFsTW9kdWxlIG5hdGl2ZSBtb2R1bGUgcHJveHlcblx0ICAgICAqIEBwYXJhbSAge3N0cmluZ30gc291cmNlVXJsICAgICAgdGhlIGN1cnJlbnQganMgZmlsZSB1cmxcblx0ICAgICAqIEByZXR1cm4ge29iamVjdH0gICAgICAgICAgICAgICAgd3JhcHBlciBhcm91bmQgdGhlIGV4dGVybmFsTW9kdWxlXG5cdCAgICAgKi9cblxuXG5cdCAgICBjcmVhdGVNb2R1bGVXcmFwcGVyKGV4dGVybmFsTW9kdWxlLCBzb3VyY2VVcmwpIHtcblxuXG5cdCAgICAgIGZ1bmN0aW9uIE1vZHVsZVdyYXBwZXIoKSB7fVxuXG5cdCAgICAgIE1vZHVsZVdyYXBwZXIucHJvdG90eXBlID0gZXh0ZXJuYWxNb2R1bGU7XG5cdCAgICAgIGNvbnN0IHdyYXBwZXIgPSBuZXcgTW9kdWxlV3JhcHBlcigpOyAvLyBIZXJlIHdlIHRha2UgdGhlIEFQSXMgZGVmaW5lZCBpbiB0aGUgYm9vdHN0cmFwLmpzXG5cdCAgICAgIC8vIGFuZCBlZmZlY3RpdmVseSBsYXppbHkgaG9vayB0aGVtXG5cdCAgICAgIC8vIFdlIGV4cGxpY2l0bHkgZ3VhcmQgdGhlIGNvZGUgc28gaU9TIGRvZXNuJ3QgZXZlbiB1c2UvaW5jbHVkZSB0aGUgcmVmZXJlbmNlZCBpbnZva2VyLmpzIGltcG9ydFxuXG5cdCAgICAgIGNvbnN0IGludm9jYXRpb25BUElzID0gZXh0ZXJuYWxNb2R1bGUuaW52b2NhdGlvbkFQSXMgfHwgW107XG5cblx0ICAgICAgZm9yIChjb25zdCBhcGkgb2YgaW52b2NhdGlvbkFQSXMpIHtcblx0ICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IGV4dGVybmFsTW9kdWxlW2FwaV07XG5cblx0ICAgICAgICBpZiAoIWRlbGVnYXRlKSB7XG5cdCAgICAgICAgICBjb250aW51ZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICB3cmFwcGVyW2FwaV0gPSBpbnZva2VyLmNyZWF0ZUludm9rZXIoZXh0ZXJuYWxNb2R1bGUsIGRlbGVnYXRlLCBuZXcga3JvbGwuU2NvcGVWYXJzKHtcblx0ICAgICAgICAgIHNvdXJjZVVybFxuXHQgICAgICAgIH0pKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHdyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG5cdCAgICAgICAgZXh0ZXJuYWxNb2R1bGUuYWRkRXZlbnRMaXN0ZW5lci5hcHBseShleHRlcm5hbE1vZHVsZSwgYXJncyk7XG5cdCAgICAgIH07XG5cblx0ICAgICAgd3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKC4uLmFyZ3MpIHtcblx0ICAgICAgICBleHRlcm5hbE1vZHVsZS5yZW1vdmVFdmVudExpc3RlbmVyLmFwcGx5KGV4dGVybmFsTW9kdWxlLCBhcmdzKTtcblx0ICAgICAgfTtcblxuXHQgICAgICB3cmFwcGVyLmZpcmVFdmVudCA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG5cdCAgICAgICAgZXh0ZXJuYWxNb2R1bGUuZmlyZUV2ZW50LmFwcGx5KGV4dGVybmFsTW9kdWxlLCBhcmdzKTtcblx0ICAgICAgfTtcblxuXHQgICAgICByZXR1cm4gd3JhcHBlcjtcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogVGFrZXMgYSBDb21tb25KUyBtb2R1bGUgYW5kIHVzZXMgaXQgdG8gZXh0ZW5kIGFuIGV4aXN0aW5nIGV4dGVybmFsL25hdGl2ZSBtb2R1bGUuIFRoZSBleHBvcnRzIGFyZSBhZGRlZCB0byB0aGUgZXh0ZXJuYWwgbW9kdWxlLlxuXHQgICAgICogQHBhcmFtICB7T2JqZWN0fSBleHRlcm5hbE1vZHVsZSBUaGUgZXh0ZXJuYWwvbmF0aXZlIG1vZHVsZSB3ZSdyZSBleHRlbmRpbmdcblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gaWQgICAgICAgICAgICAgbW9kdWxlIGlkXG5cdCAgICAgKi9cblxuXG5cdCAgICBleHRlbmRNb2R1bGVXaXRoQ29tbW9uSnMoZXh0ZXJuYWxNb2R1bGUsIGlkKSB7XG5cdCAgICAgIGlmICgha3JvbGwuaXNFeHRlcm5hbENvbW1vbkpzTW9kdWxlKGlkKSkge1xuXHQgICAgICAgIHJldHVybjtcblx0ICAgICAgfSAvLyBMb2FkIHVuZGVyIGZha2UgbmFtZSwgb3IgdGhlIGNvbW1vbmpzIHNpZGUgb2YgdGhlIG5hdGl2ZSBtb2R1bGUgZ2V0cyBjYWNoZWQgaW4gcGxhY2Ugb2YgdGhlIG5hdGl2ZSBtb2R1bGUhXG5cdCAgICAgIC8vIFNlZSBUSU1PQi0yNDkzMlxuXG5cblx0ICAgICAgY29uc3QgZmFrZUlkID0gYCR7aWR9LmNvbW1vbmpzYDtcblx0ICAgICAgY29uc3QganNNb2R1bGUgPSBuZXcgTW9kdWxlKGZha2VJZCwgdGhpcyk7XG5cdCAgICAgIGpzTW9kdWxlLmxvYWQoZmFrZUlkLCBrcm9sbC5nZXRFeHRlcm5hbENvbW1vbkpzTW9kdWxlKGlkKSk7XG5cblx0ICAgICAgaWYgKGpzTW9kdWxlLmV4cG9ydHMpIHtcblx0ICAgICAgICBjb25zb2xlLnRyYWNlKGBFeHRlbmRpbmcgbmF0aXZlIG1vZHVsZSAnJHtpZH0nIHdpdGggdGhlIENvbW1vbkpTIG1vZHVsZSB0aGF0IHdhcyBwYWNrYWdlZCB3aXRoIGl0LmApO1xuXHQgICAgICAgIGtyb2xsLmV4dGVuZChleHRlcm5hbE1vZHVsZSwganNNb2R1bGUuZXhwb3J0cyk7XG5cdCAgICAgIH1cblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogTG9hZHMgYSBuYXRpdmUgLyBleHRlcm5hbCAoM3JkIHBhcnR5KSBtb2R1bGVcblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gaWQgICAgICAgICAgICAgIG1vZHVsZSBpZFxuXHQgICAgICogQHBhcmFtICB7b2JqZWN0fSBleHRlcm5hbEJpbmRpbmcgZXh0ZXJuYWwgYmluZGluZyBvYmplY3Rcblx0ICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgIFRoZSBleHBvcnRlZCBtb2R1bGVcblx0ICAgICAqL1xuXG5cblx0ICAgIGxvYWRFeHRlcm5hbE1vZHVsZShpZCwgZXh0ZXJuYWxCaW5kaW5nKSB7XG5cdCAgICAgIC8vIHRyeSB0byBnZXQgdGhlIGNhY2hlZCBtb2R1bGUuLi5cblx0ICAgICAgbGV0IGV4dGVybmFsTW9kdWxlID0gTW9kdWxlLmNhY2hlW2lkXTtcblxuXHQgICAgICBpZiAoIWV4dGVybmFsTW9kdWxlKSB7XG5cdCAgICAgICAgLy8gaU9TIGFuZCBBbmRyb2lkIGRpZmZlciBxdWl0ZSBhIGJpdCBoZXJlLlxuXHQgICAgICAgIC8vIFdpdGggaW9zLCB3ZSBzaG91bGQgYWxyZWFkeSBoYXZlIHRoZSBuYXRpdmUgbW9kdWxlIGxvYWRlZFxuXHQgICAgICAgIC8vIFRoZXJlJ3Mgbm8gc3BlY2lhbCBcImJvb3RzdHJhcC5qc1wiIGZpbGUgcGFja2FnZWQgd2l0aGluIGl0XG5cdCAgICAgICAgLy8gT24gQW5kcm9pZCwgd2UgbG9hZCBhIGJvb3RzdHJhcC5qcyBidW5kbGVkIHdpdGggdGhlIG1vZHVsZVxuXHQgICAgICAgIHtcblx0ICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIHByb2Nlc3MgZm9yIEFuZHJvaWQsIGZpcnN0IGdyYWIgdGhlIGJvb3RzdHJhcCBzb3VyY2Vcblx0ICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IGV4dGVybmFsQmluZGluZy5ib290c3RyYXA7IC8vIExvYWQgdGhlIG5hdGl2ZSBtb2R1bGUncyBib290c3RyYXAgSlNcblxuXHQgICAgICAgICAgY29uc3QgbW9kdWxlID0gbmV3IE1vZHVsZShpZCwgdGhpcyk7XG5cdCAgICAgICAgICBtb2R1bGUubG9hZChgJHtpZH0vYm9vdHN0cmFwLmpzYCwgc291cmNlKTsgLy8gQm9vdHN0cmFwIGFuZCBsb2FkIHRoZSBtb2R1bGUgdXNpbmcgdGhlIG5hdGl2ZSBiaW5kaW5nc1xuXG5cdCAgICAgICAgICBjb25zdCByZXN1bHQgPSBtb2R1bGUuZXhwb3J0cy5ib290c3RyYXAoZXh0ZXJuYWxCaW5kaW5nKTsgLy8gQ2FjaGUgdGhlIGV4dGVybmFsIG1vZHVsZSBpbnN0YW5jZSBhZnRlciBpdCdzIGJlZW4gbW9kaWZpZWQgYnkgaXQncyBib290c3RyYXAgc2NyaXB0XG5cblx0ICAgICAgICAgIGV4dGVybmFsTW9kdWxlID0gcmVzdWx0O1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICghZXh0ZXJuYWxNb2R1bGUpIHtcblx0ICAgICAgICBjb25zb2xlLnRyYWNlKGBVbmFibGUgdG8gbG9hZCBleHRlcm5hbCBtb2R1bGU6ICR7aWR9YCk7XG5cdCAgICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICAgIH0gLy8gY2FjaGUgdGhlIGxvYWRlZCBuYXRpdmUgbW9kdWxlIChiZWZvcmUgd2UgZXh0ZW5kIGl0KVxuXG5cblx0ICAgICAgTW9kdWxlLmNhY2hlW2lkXSA9IGV4dGVybmFsTW9kdWxlOyAvLyBXZSBjYWNoZSBlYWNoIGNvbnRleHQtc3BlY2lmaWMgbW9kdWxlIHdyYXBwZXJcblx0ICAgICAgLy8gb24gdGhlIHBhcmVudCBtb2R1bGUsIHJhdGhlciB0aGFuIGluIHRoZSBNb2R1bGUuY2FjaGVcblxuXHQgICAgICBsZXQgd3JhcHBlciA9IHRoaXMud3JhcHBlckNhY2hlW2lkXTtcblxuXHQgICAgICBpZiAod3JhcHBlcikge1xuXHQgICAgICAgIHJldHVybiB3cmFwcGVyO1xuXHQgICAgICB9XG5cblx0ICAgICAgY29uc3Qgc291cmNlVXJsID0gYGFwcDovLyR7dGhpcy5maWxlbmFtZX1gOyAvLyBGSVhNRTogSWYgdGhpcy5maWxlbmFtZSBzdGFydHMgd2l0aCAnLycsIHdlIG5lZWQgdG8gZHJvcCBpdCwgSSB0aGluaz9cblxuXHQgICAgICB3cmFwcGVyID0gdGhpcy5jcmVhdGVNb2R1bGVXcmFwcGVyKGV4dGVybmFsTW9kdWxlLCBzb3VyY2VVcmwpOyAvLyBUaGVuIHdlIFwiZXh0ZW5kXCIgdGhlIEFQSS9tb2R1bGUgdXNpbmcgYW55IHNoaXBwZWQgSlMgY29kZSAoYXNzZXRzLzxtb2R1bGUuaWQ+LmpzKVxuXG5cdCAgICAgIHRoaXMuZXh0ZW5kTW9kdWxlV2l0aENvbW1vbkpzKHdyYXBwZXIsIGlkKTtcblx0ICAgICAgdGhpcy53cmFwcGVyQ2FjaGVbaWRdID0gd3JhcHBlcjtcblx0ICAgICAgcmV0dXJuIHdyYXBwZXI7XG5cdCAgICB9IC8vIFNlZSBodHRwczovL25vZGVqcy5vcmcvYXBpL21vZHVsZXMuaHRtbCNtb2R1bGVzX2FsbF90b2dldGhlclxuXG5cdCAgICAvKipcblx0ICAgICAqIFJlcXVpcmUgYW5vdGhlciBtb2R1bGUgYXMgYSBjaGlsZCBvZiB0aGlzIG1vZHVsZS5cblx0ICAgICAqIFRoaXMgcGFyZW50IG1vZHVsZSdzIHBhdGggaXMgdXNlZCBhcyB0aGUgYmFzZSBmb3IgcmVsYXRpdmUgcGF0aHNcblx0ICAgICAqIHdoZW4gbG9hZGluZyB0aGUgY2hpbGQuIFJldHVybnMgdGhlIGV4cG9ydHMgb2JqZWN0XG5cdCAgICAgKiBvZiB0aGUgY2hpbGQgbW9kdWxlLlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gcmVxdWVzdCAgVGhlIHBhdGggdG8gdGhlIHJlcXVlc3RlZCBtb2R1bGVcblx0ICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgVGhlIGxvYWRlZCBtb2R1bGVcblx0ICAgICAqL1xuXG5cblx0ICAgIHJlcXVpcmUocmVxdWVzdCkge1xuXHQgICAgICAvLyAyLiBJZiBYIGJlZ2lucyB3aXRoICcuLycgb3IgJy8nIG9yICcuLi8nXG5cdCAgICAgIGNvbnN0IHN0YXJ0ID0gcmVxdWVzdC5zdWJzdHJpbmcoMCwgMik7IC8vIGhhY2sgdXAgdGhlIHN0YXJ0IG9mIHRoZSBzdHJpbmcgdG8gY2hlY2sgcmVsYXRpdmUvYWJzb2x1dGUvXCJuYWtlZFwiIG1vZHVsZSBpZFxuXG5cdCAgICAgIGlmIChzdGFydCA9PT0gJy4vJyB8fCBzdGFydCA9PT0gJy4uJykge1xuXHQgICAgICAgIGNvbnN0IGxvYWRlZCA9IHRoaXMubG9hZEFzRmlsZU9yRGlyZWN0b3J5KHBhdGgubm9ybWFsaXplKHRoaXMucGF0aCArICcvJyArIHJlcXVlc3QpKTtcblxuXHQgICAgICAgIGlmIChsb2FkZWQpIHtcblx0ICAgICAgICAgIHJldHVybiBsb2FkZWQuZXhwb3J0cztcblx0ICAgICAgICB9IC8vIFJvb3QvYWJzb2x1dGUgcGF0aCAoaW50ZXJuYWxseSB3aGVuIHJlYWRpbmcgdGhlIGZpbGUsIHdlIHByZXBlbmQgXCJSZXNvdXJjZXMvXCIgYXMgcm9vdCBkaXIpXG5cblx0ICAgICAgfSBlbHNlIGlmIChyZXF1ZXN0LnN1YnN0cmluZygwLCAxKSA9PT0gJy8nKSB7XG5cdCAgICAgICAgY29uc3QgbG9hZGVkID0gdGhpcy5sb2FkQXNGaWxlT3JEaXJlY3RvcnkocGF0aC5ub3JtYWxpemUocmVxdWVzdCkpO1xuXG5cdCAgICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgICAgcmV0dXJuIGxvYWRlZC5leHBvcnRzO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAvLyBEZXNwaXRlIGJlaW5nIHN0ZXAgMSBpbiBOb2RlLkpTIHBzdWVkby1jb2RlLCB3ZSBtb3ZlZCBpdCBkb3duIGhlcmUgYmVjYXVzZSB3ZSBkb24ndCBhbGxvdyBuYXRpdmUgbW9kdWxlc1xuXHQgICAgICAgIC8vIHRvIHN0YXJ0IHdpdGggJy4vJywgJy4uJyBvciAnLycgLSBzbyB0aGlzIGF2b2lkcyBhIGxvdCBvZiBtaXNzZXMgb24gcmVxdWlyZXMgc3RhcnRpbmcgdGhhdCB3YXlcblx0ICAgICAgICAvLyAxLiBJZiBYIGlzIGEgY29yZSBtb2R1bGUsXG5cdCAgICAgICAgbGV0IGxvYWRlZCA9IHRoaXMubG9hZENvcmVNb2R1bGUocmVxdWVzdCk7XG5cblx0ICAgICAgICBpZiAobG9hZGVkKSB7XG5cdCAgICAgICAgICAvLyBhLiByZXR1cm4gdGhlIGNvcmUgbW9kdWxlXG5cdCAgICAgICAgICAvLyBiLiBTVE9QXG5cdCAgICAgICAgICByZXR1cm4gbG9hZGVkO1xuXHQgICAgICAgIH0gLy8gTG9vayBmb3IgQ29tbW9uSlMgbW9kdWxlXG5cblxuXHQgICAgICAgIGlmIChyZXF1ZXN0LmluZGV4T2YoJy8nKSA9PT0gLTEpIHtcblx0ICAgICAgICAgIC8vIEZvciBDb21tb25KUyB3ZSBuZWVkIHRvIGxvb2sgZm9yIG1vZHVsZS5pZC9tb2R1bGUuaWQuanMgZmlyc3QuLi5cblx0ICAgICAgICAgIGNvbnN0IGZpbGVuYW1lID0gYC8ke3JlcXVlc3R9LyR7cmVxdWVzdH0uanNgOyAvLyBPbmx5IGxvb2sgZm9yIHRoaXMgX2V4YWN0IGZpbGVfLiBETyBOT1QgQVBQRU5EIC5qcyBvciAuanNvbiB0byBpdCFcblxuXHQgICAgICAgICAgaWYgKHRoaXMuZmlsZW5hbWVFeGlzdHMoZmlsZW5hbWUpKSB7XG5cdCAgICAgICAgICAgIGxvYWRlZCA9IHRoaXMubG9hZEphdmFzY3JpcHRUZXh0KGZpbGVuYW1lKTtcblxuXHQgICAgICAgICAgICBpZiAobG9hZGVkKSB7XG5cdCAgICAgICAgICAgICAgcmV0dXJuIGxvYWRlZC5leHBvcnRzO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICB9IC8vIFRoZW4gdHJ5IG1vZHVsZS5pZCBhcyBkaXJlY3RvcnlcblxuXG5cdCAgICAgICAgICBsb2FkZWQgPSB0aGlzLmxvYWRBc0RpcmVjdG9yeShgLyR7cmVxdWVzdH1gKTtcblxuXHQgICAgICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgICAgICByZXR1cm4gbG9hZGVkLmV4cG9ydHM7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSAvLyBBbGxvdyBsb29raW5nIHRocm91Z2ggbm9kZV9tb2R1bGVzXG5cdCAgICAgICAgLy8gMy4gTE9BRF9OT0RFX01PRFVMRVMoWCwgZGlybmFtZShZKSlcblxuXG5cdCAgICAgICAgbG9hZGVkID0gdGhpcy5sb2FkTm9kZU1vZHVsZXMocmVxdWVzdCwgdGhpcy5wYXRocyk7XG5cblx0ICAgICAgICBpZiAobG9hZGVkKSB7XG5cdCAgICAgICAgICByZXR1cm4gbG9hZGVkLmV4cG9ydHM7XG5cdCAgICAgICAgfSAvLyBGYWxsYmFjayB0byBvbGQgVGl0YW5pdW0gYmVoYXZpb3Igb2YgYXNzdW1pbmcgaXQncyBhY3R1YWxseSBhbiBhYnNvbHV0ZSBwYXRoXG5cdCAgICAgICAgLy8gV2UnZCBsaWtlIHRvIHdhcm4gdXNlcnMgYWJvdXQgbGVnYWN5IHN0eWxlIHJlcXVpcmUgc3ludGF4IHNvIHRoZXkgY2FuIHVwZGF0ZSwgYnV0IHRoZSBuZXcgc3ludGF4IGlzIG5vdCBiYWNrd2FyZHMgY29tcGF0aWJsZS5cblx0ICAgICAgICAvLyBTbyBmb3Igbm93LCBsZXQncyBqdXN0IGJlIHF1aXRlIGFib3V0IGl0LiBJbiBmdXR1cmUgdmVyc2lvbnMgb2YgdGhlIFNESyAoNy4wPykgd2Ugc2hvdWxkIHdhcm4gKG9uY2UgNS54IGlzIGVuZCBvZiBsaWZlIHNvIGJhY2t3YXJkcyBjb21wYXQgaXMgbm90IG5lY2Vzc2FyeSlcblx0ICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbWF4LWxlblxuXHQgICAgICAgIC8vIGNvbnNvbGUud2FybihgcmVxdWlyZSBjYWxsZWQgd2l0aCB1bi1wcmVmaXhlZCBtb2R1bGUgaWQ6ICR7cmVxdWVzdH0sIHNob3VsZCBiZSBhIGNvcmUgb3IgQ29tbW9uSlMgbW9kdWxlLiBGYWxsaW5nIGJhY2sgdG8gb2xkIFRpIGJlaGF2aW9yIGFuZCBhc3N1bWluZyBpdCdzIGFuIGFic29sdXRlIHBhdGg6IC8ke3JlcXVlc3R9YCk7XG5cblxuXHQgICAgICAgIGxvYWRlZCA9IHRoaXMubG9hZEFzRmlsZU9yRGlyZWN0b3J5KHBhdGgubm9ybWFsaXplKGAvJHtyZXF1ZXN0fWApKTtcblxuXHQgICAgICAgIGlmIChsb2FkZWQpIHtcblx0ICAgICAgICAgIHJldHVybiBsb2FkZWQuZXhwb3J0cztcblx0ICAgICAgICB9XG5cdCAgICAgIH0gLy8gNC4gVEhST1cgXCJub3QgZm91bmRcIlxuXG5cblx0ICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZXF1ZXN0ZWQgbW9kdWxlIG5vdCBmb3VuZDogJHtyZXF1ZXN0fWApOyAvLyBUT0RPIFNldCAnY29kZScgcHJvcGVydHkgdG8gJ01PRFVMRV9OT1RfRk9VTkQnIHRvIG1hdGNoIE5vZGU/XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIExvYWRzIHRoZSBjb3JlIG1vZHVsZSBpZiBpdCBleGlzdHMuIElmIG5vdCwgcmV0dXJucyBudWxsLlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gIGlkIFRoZSByZXF1ZXN0IG1vZHVsZSBpZFxuXHQgICAgICogQHJldHVybiB7T2JqZWN0fSAgICB0cnVlIGlmIHRoZSBtb2R1bGUgaWQgbWF0Y2hlcyBhIG5hdGl2ZSBvciBDb21tb25KUyBtb2R1bGUgaWQsIChvciBpdCdzIGZpcnN0IHBhdGggc2VnbWVudCBkb2VzKS5cblx0ICAgICAqL1xuXG5cblx0ICAgIGxvYWRDb3JlTW9kdWxlKGlkKSB7XG5cdCAgICAgIC8vIHNraXAgYmFkIGlkcywgcmVsYXRpdmUgaWRzLCBhYnNvbHV0ZSBpZHMuIFwibmF0aXZlXCIvXCJjb3JlXCIgbW9kdWxlcyBzaG91bGQgYmUgb2YgZm9ybSBcIm1vZHVsZS5pZFwiIG9yIFwibW9kdWxlLmlkL3N1Yi5maWxlLmpzXCJcblx0ICAgICAgaWYgKCFpZCB8fCBpZC5zdGFydHNXaXRoKCcuJykgfHwgaWQuc3RhcnRzV2l0aCgnLycpKSB7XG5cdCAgICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICAgIH0gLy8gY2hlY2sgaWYgd2UgaGF2ZSBhIGNhY2hlZCBjb3B5IG9mIHRoZSB3cmFwcGVyXG5cblxuXHQgICAgICBpZiAodGhpcy53cmFwcGVyQ2FjaGVbaWRdKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMud3JhcHBlckNhY2hlW2lkXTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGNvbnN0IHBhcnRzID0gaWQuc3BsaXQoJy8nKTtcblx0ICAgICAgY29uc3QgZXh0ZXJuYWxCaW5kaW5nID0ga3JvbGwuZXh0ZXJuYWxCaW5kaW5nKHBhcnRzWzBdKTtcblxuXHQgICAgICBpZiAoZXh0ZXJuYWxCaW5kaW5nKSB7XG5cdCAgICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gMSkge1xuXHQgICAgICAgICAgLy8gVGhpcyBpcyB0aGUgXCJyb290XCIgb2YgYW4gZXh0ZXJuYWwgbW9kdWxlLiBJdCBjYW4gbG9vayBsaWtlOlxuXHQgICAgICAgICAgLy8gcmVxdWVzdChcImNvbS5leGFtcGxlLm15bW9kdWxlXCIpXG5cdCAgICAgICAgICAvLyBXZSBjYW4gbG9hZCBhbmQgcmV0dXJuIGl0IHJpZ2h0IGF3YXkgKGNhY2hpbmcgb2NjdXJzIGluIHRoZSBjYWxsZWQgZnVuY3Rpb24pLlxuXHQgICAgICAgICAgcmV0dXJuIHRoaXMubG9hZEV4dGVybmFsTW9kdWxlKHBhcnRzWzBdLCBleHRlcm5hbEJpbmRpbmcpO1xuXHQgICAgICAgIH0gLy8gQ291bGQgYmUgYSBzdWItbW9kdWxlIChDb21tb25KUykgb2YgYW4gZXh0ZXJuYWwgbmF0aXZlIG1vZHVsZS5cblx0ICAgICAgICAvLyBXZSBhbGxvdyB0aGF0IHNpbmNlIFRJTU9CLTk3MzAuXG5cblxuXHQgICAgICAgIGlmIChrcm9sbC5pc0V4dGVybmFsQ29tbW9uSnNNb2R1bGUocGFydHNbMF0pKSB7XG5cdCAgICAgICAgICBjb25zdCBleHRlcm5hbENvbW1vbkpzQ29udGVudHMgPSBrcm9sbC5nZXRFeHRlcm5hbENvbW1vbkpzTW9kdWxlKGlkKTtcblxuXHQgICAgICAgICAgaWYgKGV4dGVybmFsQ29tbW9uSnNDb250ZW50cykge1xuXHQgICAgICAgICAgICAvLyBmb3VuZCBpdFxuXHQgICAgICAgICAgICAvLyBGSVhNRSBSZS11c2UgbG9hZEFzSmF2YVNjcmlwdFRleHQ/XG5cdCAgICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IG5ldyBNb2R1bGUoaWQsIHRoaXMpO1xuXHQgICAgICAgICAgICBtb2R1bGUubG9hZChpZCwgZXh0ZXJuYWxDb21tb25Kc0NvbnRlbnRzKTtcblx0ICAgICAgICAgICAgcmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBudWxsOyAvLyBmYWlsZWQgdG8gbG9hZFxuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBBdHRlbXB0cyB0byBsb2FkIGEgbm9kZSBtb2R1bGUgYnkgaWQgZnJvbSB0aGUgc3RhcnRpbmcgcGF0aFxuXHQgICAgICogQHBhcmFtICB7c3RyaW5nfSBtb2R1bGVJZCAgICAgICBUaGUgcGF0aCBvZiB0aGUgbW9kdWxlIHRvIGxvYWQuXG5cdCAgICAgKiBAcGFyYW0gIHtzdHJpbmdbXX0gZGlycyAgICAgICBwYXRocyB0byBzZWFyY2hcblx0ICAgICAqIEByZXR1cm4ge01vZHVsZXxudWxsfSAgICAgIFRoZSBtb2R1bGUsIGlmIGxvYWRlZC4gbnVsbCBpZiBub3QuXG5cdCAgICAgKi9cblxuXG5cdCAgICBsb2FkTm9kZU1vZHVsZXMobW9kdWxlSWQsIGRpcnMpIHtcblx0ICAgICAgLy8gMi4gZm9yIGVhY2ggRElSIGluIERJUlM6XG5cdCAgICAgIGZvciAoY29uc3QgZGlyIG9mIGRpcnMpIHtcblx0ICAgICAgICAvLyBhLiBMT0FEX0FTX0ZJTEUoRElSL1gpXG5cdCAgICAgICAgLy8gYi4gTE9BRF9BU19ESVJFQ1RPUlkoRElSL1gpXG5cdCAgICAgICAgY29uc3QgbW9kID0gdGhpcy5sb2FkQXNGaWxlT3JEaXJlY3RvcnkocGF0aC5qb2luKGRpciwgbW9kdWxlSWQpKTtcblxuXHQgICAgICAgIGlmIChtb2QpIHtcblx0ICAgICAgICAgIHJldHVybiBtb2Q7XG5cdCAgICAgICAgfVxuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIERldGVybWluZSB0aGUgc2V0IG9mIHBhdGhzIHRvIHNlYXJjaCBmb3Igbm9kZV9tb2R1bGVzXG5cdCAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IHN0YXJ0RGlyICAgICAgIFRoZSBzdGFydGluZyBkaXJlY3Rvcnlcblx0ICAgICAqIEByZXR1cm4ge3N0cmluZ1tdfSAgICAgICAgICAgICAgVGhlIGFycmF5IG9mIHBhdGhzIHRvIHNlYXJjaFxuXHQgICAgICovXG5cblxuXHQgICAgbm9kZU1vZHVsZXNQYXRocyhzdGFydERpcikge1xuXHQgICAgICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSBhbiBhYnNvbHV0ZSBwYXRoIHRvIHN0YXJ0IHdpdGhcblx0ICAgICAgc3RhcnREaXIgPSBwYXRoLnJlc29sdmUoc3RhcnREaXIpOyAvLyBSZXR1cm4gZWFybHkgaWYgd2UgYXJlIGF0IHJvb3QsIHRoaXMgYXZvaWRzIGRvaW5nIGEgcG9pbnRsZXNzIGxvb3Bcblx0ICAgICAgLy8gYW5kIGFsc28gcmV0dXJuaW5nIGFuIGFycmF5IHdpdGggZHVwbGljYXRlIGVudHJpZXNcblx0ICAgICAgLy8gZS5nLiBbXCIvbm9kZV9tb2R1bGVzXCIsIFwiL25vZGVfbW9kdWxlc1wiXVxuXG5cdCAgICAgIGlmIChzdGFydERpciA9PT0gJy8nKSB7XG5cdCAgICAgICAgcmV0dXJuIFsnL25vZGVfbW9kdWxlcyddO1xuXHQgICAgICB9IC8vIDEuIGxldCBQQVJUUyA9IHBhdGggc3BsaXQoU1RBUlQpXG5cblxuXHQgICAgICBjb25zdCBwYXJ0cyA9IHN0YXJ0RGlyLnNwbGl0KCcvJyk7IC8vIDIuIGxldCBJID0gY291bnQgb2YgUEFSVFMgLSAxXG5cblx0ICAgICAgbGV0IGkgPSBwYXJ0cy5sZW5ndGggLSAxOyAvLyAzLiBsZXQgRElSUyA9IFtdXG5cblx0ICAgICAgY29uc3QgZGlycyA9IFtdOyAvLyA0LiB3aGlsZSBJID49IDAsXG5cblx0ICAgICAgd2hpbGUgKGkgPj0gMCkge1xuXHQgICAgICAgIC8vIGEuIGlmIFBBUlRTW0ldID0gXCJub2RlX21vZHVsZXNcIiBDT05USU5VRVxuXHQgICAgICAgIGlmIChwYXJ0c1tpXSA9PT0gJ25vZGVfbW9kdWxlcycgfHwgcGFydHNbaV0gPT09ICcnKSB7XG5cdCAgICAgICAgICBpIC09IDE7XG5cdCAgICAgICAgICBjb250aW51ZTtcblx0ICAgICAgICB9IC8vIGIuIERJUiA9IHBhdGggam9pbihQQVJUU1swIC4uIEldICsgXCJub2RlX21vZHVsZXNcIilcblxuXG5cdCAgICAgICAgY29uc3QgZGlyID0gcGF0aC5qb2luKHBhcnRzLnNsaWNlKDAsIGkgKyAxKS5qb2luKCcvJyksICdub2RlX21vZHVsZXMnKTsgLy8gYy4gRElSUyA9IERJUlMgKyBESVJcblxuXHQgICAgICAgIGRpcnMucHVzaChkaXIpOyAvLyBkLiBsZXQgSSA9IEkgLSAxXG5cblx0ICAgICAgICBpIC09IDE7XG5cdCAgICAgIH0gLy8gQWx3YXlzIGFkZCAvbm9kZV9tb2R1bGVzIHRvIHRoZSBzZWFyY2ggcGF0aFxuXG5cblx0ICAgICAgZGlycy5wdXNoKCcvbm9kZV9tb2R1bGVzJyk7XG5cdCAgICAgIHJldHVybiBkaXJzO1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBBdHRlbXB0cyB0byBsb2FkIGEgZ2l2ZW4gcGF0aCBhcyBhIGZpbGUgb3IgZGlyZWN0b3J5LlxuXHQgICAgICogQHBhcmFtICB7c3RyaW5nfSBub3JtYWxpemVkUGF0aCBUaGUgcGF0aCBvZiB0aGUgbW9kdWxlIHRvIGxvYWQuXG5cdCAgICAgKiBAcmV0dXJuIHtNb2R1bGV8bnVsbH0gVGhlIGxvYWRlZCBtb2R1bGUuIG51bGwgaWYgdW5hYmxlIHRvIGxvYWQuXG5cdCAgICAgKi9cblxuXG5cdCAgICBsb2FkQXNGaWxlT3JEaXJlY3Rvcnkobm9ybWFsaXplZFBhdGgpIHtcblx0ICAgICAgLy8gYS4gTE9BRF9BU19GSUxFKFkgKyBYKVxuXHQgICAgICBsZXQgbG9hZGVkID0gdGhpcy5sb2FkQXNGaWxlKG5vcm1hbGl6ZWRQYXRoKTtcblxuXHQgICAgICBpZiAobG9hZGVkKSB7XG5cdCAgICAgICAgcmV0dXJuIGxvYWRlZDtcblx0ICAgICAgfSAvLyBiLiBMT0FEX0FTX0RJUkVDVE9SWShZICsgWClcblxuXG5cdCAgICAgIGxvYWRlZCA9IHRoaXMubG9hZEFzRGlyZWN0b3J5KG5vcm1hbGl6ZWRQYXRoKTtcblxuXHQgICAgICBpZiAobG9hZGVkKSB7XG5cdCAgICAgICAgcmV0dXJuIGxvYWRlZDtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBMb2FkcyBhIGdpdmVuIGZpbGUgYXMgYSBKYXZhc2NyaXB0IGZpbGUsIHJldHVybmluZyB0aGUgbW9kdWxlLmV4cG9ydHMuXG5cdCAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGZpbGVuYW1lIEZpbGUgd2UncmUgYXR0ZW1wdGluZyB0byBsb2FkXG5cdCAgICAgKiBAcmV0dXJuIHtNb2R1bGV9IHRoZSBsb2FkZWQgbW9kdWxlXG5cdCAgICAgKi9cblxuXG5cdCAgICBsb2FkSmF2YXNjcmlwdFRleHQoZmlsZW5hbWUpIHtcblx0ICAgICAgLy8gTG9vayBpbiB0aGUgY2FjaGUhXG5cdCAgICAgIGlmIChNb2R1bGUuY2FjaGVbZmlsZW5hbWVdKSB7XG5cdCAgICAgICAgcmV0dXJuIE1vZHVsZS5jYWNoZVtmaWxlbmFtZV07XG5cdCAgICAgIH1cblxuXHQgICAgICBjb25zdCBtb2R1bGUgPSBuZXcgTW9kdWxlKGZpbGVuYW1lLCB0aGlzKTtcblx0ICAgICAgbW9kdWxlLmxvYWQoZmlsZW5hbWUpO1xuXHQgICAgICByZXR1cm4gbW9kdWxlO1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBMb2FkcyBhIEpTT04gZmlsZSBieSByZWFkaW5nIGl0J3MgY29udGVudHMsIGRvaW5nIGEgSlNPTi5wYXJzZSBhbmQgcmV0dXJuaW5nIHRoZSBwYXJzZWQgb2JqZWN0LlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gZmlsZW5hbWUgRmlsZSB3ZSdyZSBhdHRlbXB0aW5nIHRvIGxvYWRcblx0ICAgICAqIEByZXR1cm4ge01vZHVsZX0gVGhlIGxvYWRlZCBtb2R1bGUgaW5zdGFuY2Vcblx0ICAgICAqL1xuXG5cblx0ICAgIGxvYWRKYXZhc2NyaXB0T2JqZWN0KGZpbGVuYW1lKSB7XG5cdCAgICAgIC8vIExvb2sgaW4gdGhlIGNhY2hlIVxuXHQgICAgICBpZiAoTW9kdWxlLmNhY2hlW2ZpbGVuYW1lXSkge1xuXHQgICAgICAgIHJldHVybiBNb2R1bGUuY2FjaGVbZmlsZW5hbWVdO1xuXHQgICAgICB9XG5cblx0ICAgICAgY29uc3QgbW9kdWxlID0gbmV3IE1vZHVsZShmaWxlbmFtZSwgdGhpcyk7XG5cdCAgICAgIG1vZHVsZS5maWxlbmFtZSA9IGZpbGVuYW1lO1xuXHQgICAgICBtb2R1bGUucGF0aCA9IHBhdGguZGlybmFtZShmaWxlbmFtZSk7XG5cdCAgICAgIGNvbnN0IHNvdXJjZSA9IGFzc2V0cy5yZWFkQXNzZXQoYFJlc291cmNlcyR7ZmlsZW5hbWV9YCApOyAvLyBTdGljayBpdCBpbiB0aGUgY2FjaGVcblxuXHQgICAgICBNb2R1bGUuY2FjaGVbZmlsZW5hbWVdID0gbW9kdWxlO1xuXHQgICAgICBtb2R1bGUuZXhwb3J0cyA9IEpTT04ucGFyc2Uoc291cmNlKTtcblx0ICAgICAgbW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cdCAgICAgIHJldHVybiBtb2R1bGU7XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIEF0dGVtcHRzIHRvIGxvYWQgYSBmaWxlIGJ5IGl0J3MgZnVsbCBmaWxlbmFtZSBhY2NvcmRpbmcgdG8gTm9kZUpTIHJ1bGVzLlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSAge3N0cmluZ30gaWQgVGhlIGZpbGVuYW1lXG5cdCAgICAgKiBAcmV0dXJuIHtNb2R1bGV8bnVsbH0gTW9kdWxlIGluc3RhbmNlIGlmIGxvYWRlZCwgbnVsbCBpZiBub3QgZm91bmQuXG5cdCAgICAgKi9cblxuXG5cdCAgICBsb2FkQXNGaWxlKGlkKSB7XG5cdCAgICAgIC8vIDEuIElmIFggaXMgYSBmaWxlLCBsb2FkIFggYXMgSmF2YVNjcmlwdCB0ZXh0LiAgU1RPUFxuXHQgICAgICBsZXQgZmlsZW5hbWUgPSBpZDtcblxuXHQgICAgICBpZiAodGhpcy5maWxlbmFtZUV4aXN0cyhmaWxlbmFtZSkpIHtcblx0ICAgICAgICAvLyBJZiB0aGUgZmlsZSBoYXMgYSAuanNvbiBleHRlbnNpb24sIGxvYWQgYXMgSmF2YXNjcmlwdE9iamVjdFxuXHQgICAgICAgIGlmIChmaWxlbmFtZS5sZW5ndGggPiA1ICYmIGZpbGVuYW1lLnNsaWNlKC00KSA9PT0gJ2pzb24nKSB7XG5cdCAgICAgICAgICByZXR1cm4gdGhpcy5sb2FkSmF2YXNjcmlwdE9iamVjdChmaWxlbmFtZSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIHRoaXMubG9hZEphdmFzY3JpcHRUZXh0KGZpbGVuYW1lKTtcblx0ICAgICAgfSAvLyAyLiBJZiBYLmpzIGlzIGEgZmlsZSwgbG9hZCBYLmpzIGFzIEphdmFTY3JpcHQgdGV4dC4gIFNUT1BcblxuXG5cdCAgICAgIGZpbGVuYW1lID0gaWQgKyAnLmpzJztcblxuXHQgICAgICBpZiAodGhpcy5maWxlbmFtZUV4aXN0cyhmaWxlbmFtZSkpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5sb2FkSmF2YXNjcmlwdFRleHQoZmlsZW5hbWUpO1xuXHQgICAgICB9IC8vIDMuIElmIFguanNvbiBpcyBhIGZpbGUsIHBhcnNlIFguanNvbiB0byBhIEphdmFTY3JpcHQgT2JqZWN0LiAgU1RPUFxuXG5cblx0ICAgICAgZmlsZW5hbWUgPSBpZCArICcuanNvbic7XG5cblx0ICAgICAgaWYgKHRoaXMuZmlsZW5hbWVFeGlzdHMoZmlsZW5hbWUpKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMubG9hZEphdmFzY3JpcHRPYmplY3QoZmlsZW5hbWUpO1xuXHQgICAgICB9IC8vIGZhaWxlZCB0byBsb2FkIGFueXRoaW5nIVxuXG5cblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIEF0dGVtcHRzIHRvIGxvYWQgYSBkaXJlY3RvcnkgYWNjb3JkaW5nIHRvIE5vZGVKUyBydWxlcy5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGlkIFRoZSBkaXJlY3RvcnkgbmFtZVxuXHQgICAgICogQHJldHVybiB7TW9kdWxlfG51bGx9IExvYWRlZCBtb2R1bGUsIG51bGwgaWYgbm90IGZvdW5kLlxuXHQgICAgICovXG5cblxuXHQgICAgbG9hZEFzRGlyZWN0b3J5KGlkKSB7XG5cdCAgICAgIC8vIDEuIElmIFgvcGFja2FnZS5qc29uIGlzIGEgZmlsZSxcblx0ICAgICAgbGV0IGZpbGVuYW1lID0gcGF0aC5yZXNvbHZlKGlkLCAncGFja2FnZS5qc29uJyk7XG5cblx0ICAgICAgaWYgKHRoaXMuZmlsZW5hbWVFeGlzdHMoZmlsZW5hbWUpKSB7XG5cdCAgICAgICAgLy8gYS4gUGFyc2UgWC9wYWNrYWdlLmpzb24sIGFuZCBsb29rIGZvciBcIm1haW5cIiBmaWVsZC5cblx0ICAgICAgICBjb25zdCBvYmplY3QgPSB0aGlzLmxvYWRKYXZhc2NyaXB0T2JqZWN0KGZpbGVuYW1lKTtcblxuXHQgICAgICAgIGlmIChvYmplY3QgJiYgb2JqZWN0LmV4cG9ydHMgJiYgb2JqZWN0LmV4cG9ydHMubWFpbikge1xuXHQgICAgICAgICAgLy8gYi4gbGV0IE0gPSBYICsgKGpzb24gbWFpbiBmaWVsZClcblx0ICAgICAgICAgIGNvbnN0IG0gPSBwYXRoLnJlc29sdmUoaWQsIG9iamVjdC5leHBvcnRzLm1haW4pOyAvLyBjLiBMT0FEX0FTX0ZJTEUoTSlcblxuXHQgICAgICAgICAgcmV0dXJuIHRoaXMubG9hZEFzRmlsZU9yRGlyZWN0b3J5KG0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSAvLyAyLiBJZiBYL2luZGV4LmpzIGlzIGEgZmlsZSwgbG9hZCBYL2luZGV4LmpzIGFzIEphdmFTY3JpcHQgdGV4dC4gIFNUT1BcblxuXG5cdCAgICAgIGZpbGVuYW1lID0gcGF0aC5yZXNvbHZlKGlkLCAnaW5kZXguanMnKTtcblxuXHQgICAgICBpZiAodGhpcy5maWxlbmFtZUV4aXN0cyhmaWxlbmFtZSkpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5sb2FkSmF2YXNjcmlwdFRleHQoZmlsZW5hbWUpO1xuXHQgICAgICB9IC8vIDMuIElmIFgvaW5kZXguanNvbiBpcyBhIGZpbGUsIHBhcnNlIFgvaW5kZXguanNvbiB0byBhIEphdmFTY3JpcHQgb2JqZWN0LiBTVE9QXG5cblxuXHQgICAgICBmaWxlbmFtZSA9IHBhdGgucmVzb2x2ZShpZCwgJ2luZGV4Lmpzb24nKTtcblxuXHQgICAgICBpZiAodGhpcy5maWxlbmFtZUV4aXN0cyhmaWxlbmFtZSkpIHtcblx0ICAgICAgICByZXR1cm4gdGhpcy5sb2FkSmF2YXNjcmlwdE9iamVjdChmaWxlbmFtZSk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gbnVsbDtcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogU2V0dXAgYSBzYW5kYm94IGFuZCBydW4gdGhlIG1vZHVsZSdzIHNjcmlwdCBpbnNpZGUgaXQuXG5cdCAgICAgKiBSZXR1cm5zIHRoZSByZXN1bHQgb2YgdGhlIGV4ZWN1dGVkIHNjcmlwdC5cblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gc291cmNlICAgW2Rlc2NyaXB0aW9uXVxuXHQgICAgICogQHBhcmFtICB7U3RyaW5nfSBmaWxlbmFtZSBbZGVzY3JpcHRpb25dXG5cdCAgICAgKiBAcmV0dXJuIHsqfSAgICAgICAgICBbZGVzY3JpcHRpb25dXG5cdCAgICAgKi9cblxuXG5cdCAgICBfcnVuU2NyaXB0KHNvdXJjZSwgZmlsZW5hbWUpIHtcblx0ICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG5cblx0ICAgICAgZnVuY3Rpb24gcmVxdWlyZShwYXRoKSB7XG5cdCAgICAgICAgcmV0dXJuIHNlbGYucmVxdWlyZShwYXRoKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJlcXVpcmUubWFpbiA9IE1vZHVsZS5tYWluOyAvLyBUaGlzIFwiZmlyc3QgdGltZVwiIHJ1biBpcyByZWFsbHkgb25seSBmb3IgYXBwLmpzLCBBRkFJQ1QsIGFuZCBuZWVkc1xuXHQgICAgICAvLyBhbiBhY3Rpdml0eS4gSWYgYXBwIHdhcyByZXN0YXJ0ZWQgZm9yIFNlcnZpY2Ugb25seSwgd2UgZG9uJ3Qgd2FudFxuXHQgICAgICAvLyB0byBnbyB0aGlzIHJvdXRlLiBTbyBhZGRlZCBjdXJyZW50QWN0aXZpdHkgY2hlY2suIChiaWxsKVxuXG5cdCAgICAgIGlmIChzZWxmLmlkID09PSAnLicgJiYgIXRoaXMuaXNTZXJ2aWNlKSB7XG5cdCAgICAgICAgZ2xvYmFsLnJlcXVpcmUgPSByZXF1aXJlOyAvLyBjaGVjayBpZiB3ZSBoYXZlIGFuIGluc3BlY3RvciBiaW5kaW5nLi4uXG5cblx0ICAgICAgICBjb25zdCBpbnNwZWN0b3IgPSBrcm9sbC5iaW5kaW5nKCdpbnNwZWN0b3InKTtcblxuXHQgICAgICAgIGlmIChpbnNwZWN0b3IpIHtcblx0ICAgICAgICAgIC8vIElmIGRlYnVnZ2VyIGlzIGVuYWJsZWQsIGxvYWQgYXBwLmpzIGFuZCBwYXVzZSByaWdodCBiZWZvcmUgd2UgZXhlY3V0ZSBpdFxuXHQgICAgICAgICAgY29uc3QgaW5zcGVjdG9yV3JhcHBlciA9IGluc3BlY3Rvci5jYWxsQW5kUGF1c2VPblN0YXJ0O1xuXG5cdCAgICAgICAgICBpZiAoaW5zcGVjdG9yV3JhcHBlcikge1xuXHQgICAgICAgICAgICAvLyBGSVhNRSBXaHkgY2FuJ3Qgd2UgZG8gbm9ybWFsIE1vZHVsZS53cmFwKHNvdXJjZSkgaGVyZT9cblx0ICAgICAgICAgICAgLy8gSSBnZXQgXCJVbmNhdWdodCBUeXBlRXJyb3I6IENhbm5vdCByZWFkIHByb3BlcnR5ICdjcmVhdGVUYWJHcm91cCcgb2YgdW5kZWZpbmVkXCIgZm9yIFwiVGkuVUkuY3JlYXRlVGFiR3JvdXAoKTtcIlxuXHQgICAgICAgICAgICAvLyBOb3Qgc3VyZSB3aHkgYXBwLmpzIGlzIHNwZWNpYWwgY2FzZSBhbmQgY2FuJ3QgYmUgcnVuIHVuZGVyIG5vcm1hbCBzZWxmLWludm9raW5nIHdyYXBwaW5nIGZ1bmN0aW9uIHRoYXQgZ2V0cyBwYXNzZWQgaW4gZ2xvYmFsL2tyb2xsL1RpL2V0Y1xuXHQgICAgICAgICAgICAvLyBJbnN0ZWFkLCBsZXQncyB1c2UgYSBzbGlnaHRseSBtb2RpZmllZCB2ZXJzaW9uIG9mIGNhbGxBbmRQYXVzZU9uU3RhcnQ6XG5cdCAgICAgICAgICAgIC8vIEl0IHdpbGwgY29tcGlsZSB0aGUgc291cmNlIGFzLWlzLCBzY2hlZHVsZSBhIHBhdXNlIGFuZCB0aGVuIHJ1biB0aGUgc291cmNlLlxuXHQgICAgICAgICAgICByZXR1cm4gaW5zcGVjdG9yV3JhcHBlcihzb3VyY2UsIGZpbGVuYW1lKTtcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9IC8vIHJ1biBhcHAuanMgXCJub3JtYWxseVwiIChpLmUuIG5vdCB1bmRlciBkZWJ1Z2dlci9pbnNwZWN0b3IpXG5cblxuXHQgICAgICAgIHJldHVybiBTY3JpcHQucnVuSW5UaGlzQ29udGV4dChzb3VyY2UsIGZpbGVuYW1lLCB0cnVlKTtcblx0ICAgICAgfSAvLyBJbiBWOCwgd2UgdHJlYXQgZXh0ZXJuYWwgbW9kdWxlcyB0aGUgc2FtZSBhcyBuYXRpdmUgbW9kdWxlcy4gIEZpcnN0LCB3ZSB3cmFwIHRoZVxuXHQgICAgICAvLyBtb2R1bGUgY29kZSBhbmQgdGhlbiBydW4gaXQgaW4gdGhlIGN1cnJlbnQgY29udGV4dC4gIFRoaXMgd2lsbCBhbGxvdyBleHRlcm5hbCBtb2R1bGVzIHRvXG5cdCAgICAgIC8vIGFjY2VzcyBnbG9iYWxzIGFzIG1lbnRpb25lZCBpbiBUSU1PQi0xMTc1Mi4gVGhpcyB3aWxsIGFsc28gaGVscCByZXNvbHZlIHN0YXJ0dXAgc2xvd25lc3MgdGhhdFxuXHQgICAgICAvLyBvY2N1cnMgYXMgYSByZXN1bHQgb2YgY3JlYXRpbmcgYSBuZXcgY29udGV4dCBkdXJpbmcgc3RhcnR1cCBpbiBUSU1PQi0xMjI4Ni5cblxuXG5cdCAgICAgIHNvdXJjZSA9IE1vZHVsZS53cmFwKHNvdXJjZSk7XG5cdCAgICAgIGNvbnN0IGYgPSBTY3JpcHQucnVuSW5UaGlzQ29udGV4dChzb3VyY2UsIGZpbGVuYW1lLCB0cnVlKTtcblx0ICAgICAgcmV0dXJuIGYodGhpcy5leHBvcnRzLCByZXF1aXJlLCB0aGlzLCBmaWxlbmFtZSwgcGF0aC5kaXJuYW1lKGZpbGVuYW1lKSwgVGl0YW5pdW0sIFRpLCBnbG9iYWwsIGtyb2xsKTtcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogTG9vayB1cCBhIGZpbGVuYW1lIGluIHRoZSBhcHAncyBpbmRleC5qc29uIGZpbGVcblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gZmlsZW5hbWUgdGhlIGZpbGUgd2UncmUgbG9va2luZyBmb3Jcblx0ICAgICAqIEByZXR1cm4ge0Jvb2xlYW59ICAgICAgICAgdHJ1ZSBpZiB0aGUgZmlsZW5hbWUgZXhpc3RzIGluIHRoZSBpbmRleC5qc29uXG5cdCAgICAgKi9cblxuXG5cdCAgICBmaWxlbmFtZUV4aXN0cyhmaWxlbmFtZSkge1xuXHQgICAgICBmaWxlbmFtZSA9ICdSZXNvdXJjZXMnICsgZmlsZW5hbWU7IC8vIFdoZW4gd2UgYWN0dWFsbHkgbG9vayBmb3IgZmlsZXMsIGFzc3VtZSBcIlJlc291cmNlcy9cIiBpcyB0aGUgcm9vdFxuXG5cdCAgICAgIGlmICghZmlsZUluZGV4KSB7XG5cdCAgICAgICAgY29uc3QganNvbiA9IGFzc2V0cy5yZWFkQXNzZXQoSU5ERVhfSlNPTik7XG5cdCAgICAgICAgZmlsZUluZGV4ID0gSlNPTi5wYXJzZShqc29uKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBmaWxlSW5kZXggJiYgZmlsZW5hbWUgaW4gZmlsZUluZGV4O1xuXHQgICAgfVxuXG5cdCAgfVxuXG5cdCAgTW9kdWxlLmNhY2hlID0gW107XG5cdCAgTW9kdWxlLm1haW4gPSBudWxsO1xuXHQgIE1vZHVsZS53cmFwcGVyID0gWycoZnVuY3Rpb24gKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBUaXRhbml1bSwgVGksIGdsb2JhbCwga3JvbGwpIHsnLCAnXFxufSk7J107XG5cblx0ICBNb2R1bGUud3JhcCA9IGZ1bmN0aW9uIChzY3JpcHQpIHtcblx0ICAgIHJldHVybiBNb2R1bGUud3JhcHBlclswXSArIHNjcmlwdCArIE1vZHVsZS53cmFwcGVyWzFdO1xuXHQgIH07XG5cdCAgLyoqXG5cdCAgICogW3J1bk1vZHVsZSBkZXNjcmlwdGlvbl1cblx0ICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNvdXJjZSAgICAgICAgICAgIEpTIFNvdXJjZSBjb2RlXG5cdCAgICogQHBhcmFtICB7U3RyaW5nfSBmaWxlbmFtZSAgICAgICAgICBGaWxlbmFtZSBvZiB0aGUgbW9kdWxlXG5cdCAgICogQHBhcmFtICB7VGl0YW5pdW0uU2VydmljZXxudWxsfFRpdGFuaXVtLkFuZHJvaWQuQWN0aXZpdHl9IGFjdGl2aXR5T3JTZXJ2aWNlIFtkZXNjcmlwdGlvbl1cblx0ICAgKiBAcmV0dXJuIHtNb2R1bGV9ICAgICAgICAgICAgICAgICAgIFRoZSBsb2FkZWQgTW9kdWxlXG5cdCAgICovXG5cblxuXHQgIE1vZHVsZS5ydW5Nb2R1bGUgPSBmdW5jdGlvbiAoc291cmNlLCBmaWxlbmFtZSwgYWN0aXZpdHlPclNlcnZpY2UpIHtcblx0ICAgIGxldCBpZCA9IGZpbGVuYW1lO1xuXG5cdCAgICBpZiAoIU1vZHVsZS5tYWluKSB7XG5cdCAgICAgIGlkID0gJy4nO1xuXHQgICAgfVxuXG5cdCAgICBjb25zdCBtb2R1bGUgPSBuZXcgTW9kdWxlKGlkLCBudWxsKTsgLy8gRklYTUU6IEkgZG9uJ3Qga25vdyB3aHkgaW5zdGFuY2VvZiBmb3IgVGl0YW5pdW0uU2VydmljZSB3b3JrcyBoZXJlIVxuXHQgICAgLy8gT24gQW5kcm9pZCwgaXQncyBhbiBhcGluYW1lIG9mIFRpLkFuZHJvaWQuU2VydmljZVxuXHQgICAgLy8gT24gaU9TLCB3ZSBkb24ndCB5ZXQgcGFzcyBpbiB0aGUgdmFsdWUsIGJ1dCB3ZSBkbyBzZXQgVGkuQXBwLmN1cnJlbnRTZXJ2aWNlIHByb3BlcnR5IGJlZm9yZWhhbmQhXG5cdCAgICAvLyBDYW4gd2UgcmVtb3ZlIHRoZSBwcmVsb2FkIHN0dWZmIGluIEtyb2xsQnJpZGdlLm0gdG8gcGFzcyBhbG9uZyB0aGUgc2VydmljZSBpbnN0YW5jZSBpbnRvIHRoaXMgbGlrZSB3ZSBkbyBvbiBBbmRvcmlkP1xuXG5cdCAgICBtb2R1bGUuaXNTZXJ2aWNlID0gYWN0aXZpdHlPclNlcnZpY2UgaW5zdGFuY2VvZiBUaXRhbml1bS5TZXJ2aWNlIDtcblxuXHQgICAge1xuXHQgICAgICBpZiAobW9kdWxlLmlzU2VydmljZSkge1xuXHQgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUaS5BbmRyb2lkLCAnY3VycmVudFNlcnZpY2UnLCB7XG5cdCAgICAgICAgICB2YWx1ZTogYWN0aXZpdHlPclNlcnZpY2UsXG5cdCAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG5cdCAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcblx0ICAgICAgICB9KTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGkuQW5kcm9pZCwgJ2N1cnJlbnRTZXJ2aWNlJywge1xuXHQgICAgICAgICAgdmFsdWU6IG51bGwsXG5cdCAgICAgICAgICB3cml0YWJsZTogZmFsc2UsXG5cdCAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcblx0ICAgICAgICB9KTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICBpZiAoIU1vZHVsZS5tYWluKSB7XG5cdCAgICAgIE1vZHVsZS5tYWluID0gbW9kdWxlO1xuXHQgICAgfVxuXG5cdCAgICBmaWxlbmFtZSA9IGZpbGVuYW1lLnJlcGxhY2UoJ1Jlc291cmNlcy8nLCAnLycpOyAvLyBub3JtYWxpemUgYmFjayB0byBhYnNvbHV0ZSBwYXRocyAod2hpY2ggcmVhbGx5IGFyZSByZWxhdGl2ZSB0byBSZXNvdXJjZXMgdW5kZXIgdGhlIGhvb2QpXG5cblx0ICAgIG1vZHVsZS5sb2FkKGZpbGVuYW1lLCBzb3VyY2UpO1xuXG5cdCAgICB7XG5cdCAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShUaS5BbmRyb2lkLCAnY3VycmVudFNlcnZpY2UnLCB7XG5cdCAgICAgICAgdmFsdWU6IG51bGwsXG5cdCAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuXHQgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuXHQgICAgICB9KTtcblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIG1vZHVsZTtcblx0ICB9O1xuXG5cdCAgcmV0dXJuIE1vZHVsZTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIGhhbmdzIHRoZSBQcm94eSB0eXBlIG9mZiBUaSBuYW1lc3BhY2UuIEl0IGFsc28gZ2VuZXJhdGVzIGEgaGlkZGVuIF9wcm9wZXJ0aWVzIG9iamVjdFxuXHQgKiB0aGF0IGlzIHVzZWQgdG8gc3RvcmUgcHJvcGVydHkgdmFsdWVzIG9uIHRoZSBKUyBzaWRlIGZvciBqYXZhIFByb3hpZXMuXG5cdCAqIEJhc2ljYWxseSB0aGVzZSBnZXQvc2V0IG1ldGhvZHMgYXJlIGZhbGxiYWNrcyBmb3Igd2hlbiBhIEphdmEgcHJveHkgZG9lc24ndCBoYXZlIGEgbmF0aXZlIG1ldGhvZCB0byBoYW5kbGUgZ2V0dGluZy9zZXR0aW5nIHRoZSBwcm9wZXJ0eS5cblx0ICogKHNlZSBQcm94eS5oL1Byb3h5QmluZGluZ1Y4LmNwcC5mbSBmb3IgbW9yZSBpbmZvKVxuXHQgKiBAcGFyYW0ge29iamVjdH0gdGlCaW5kaW5nIHRoZSB1bmRlcmx5aW5nICdUaXRhbml1bScgbmF0aXZlIGJpbmRpbmcgKHNlZSBLcm9sbEJpbmRpbmdzOjppbml0VGl0YW5pdW0pXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBUaSB0aGUgZ2xvYmFsLlRpdGFuaXVtIG9iamVjdFxuXHQgKi9cblx0ZnVuY3Rpb24gUHJveHlCb290c3RyYXAodGlCaW5kaW5nLCBUaSkge1xuXHQgIGNvbnN0IFByb3h5ID0gdGlCaW5kaW5nLlByb3h5O1xuXHQgIFRpLlByb3h5ID0gUHJveHk7XG5cblx0ICBQcm94eS5kZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKHByb3h5UHJvdG90eXBlLCBuYW1lcykge1xuXHQgICAgY29uc3QgcHJvcGVydGllcyA9IHt9O1xuXHQgICAgY29uc3QgbGVuID0gbmFtZXMubGVuZ3RoO1xuXG5cdCAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG5cdCAgICAgIGNvbnN0IG5hbWUgPSBuYW1lc1tpXTtcblx0ICAgICAgcHJvcGVydGllc1tuYW1lXSA9IHtcblx0ICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbG9vcC1mdW5jXG5cdCAgICAgICAgICByZXR1cm4gdGhpcy5nZXRQcm9wZXJ0eShuYW1lKTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG5cdCAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvb3AtZnVuY1xuXHQgICAgICAgICAgdGhpcy5zZXRQcm9wZXJ0eUFuZEZpcmUobmFtZSwgdmFsdWUpO1xuXHQgICAgICAgIH0sXG5cdCAgICAgICAgZW51bWVyYWJsZTogdHJ1ZVxuXHQgICAgICB9O1xuXHQgICAgfVxuXG5cdCAgICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhwcm94eVByb3RvdHlwZSwgcHJvcGVydGllcyk7XG5cdCAgfTtcblxuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm94eS5wcm90b3R5cGUsICdnZXRQcm9wZXJ0eScsIHtcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiAocHJvcGVydHkpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHldO1xuXHQgICAgfSxcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlXG5cdCAgfSk7XG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb3h5LnByb3RvdHlwZSwgJ3NldFByb3BlcnR5Jywge1xuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIChwcm9wZXJ0eSwgdmFsdWUpIHtcblx0ICAgICAgcmV0dXJuIHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHldID0gdmFsdWU7XG5cdCAgICB9LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTtcblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJveHkucHJvdG90eXBlLCAnc2V0UHJvcGVydGllc0FuZEZpcmUnLCB7XG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gKHByb3BlcnRpZXMpIHtcblx0ICAgICAgY29uc3Qgb3duTmFtZXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm9wZXJ0aWVzKTtcblx0ICAgICAgY29uc3QgbGVuID0gb3duTmFtZXMubGVuZ3RoO1xuXHQgICAgICBjb25zdCBjaGFuZ2VzID0gW107XG5cblx0ICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuXHQgICAgICAgIGNvbnN0IHByb3BlcnR5ID0gb3duTmFtZXNbaV07XG5cdCAgICAgICAgY29uc3QgdmFsdWUgPSBwcm9wZXJ0aWVzW3Byb3BlcnR5XTtcblxuXHQgICAgICAgIGlmICghcHJvcGVydHkpIHtcblx0ICAgICAgICAgIGNvbnRpbnVlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGNvbnN0IG9sZFZhbHVlID0gdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eV07XG5cdCAgICAgICAgdGhpcy5fcHJvcGVydGllc1twcm9wZXJ0eV0gPSB2YWx1ZTtcblxuXHQgICAgICAgIGlmICh2YWx1ZSAhPT0gb2xkVmFsdWUpIHtcblx0ICAgICAgICAgIGNoYW5nZXMucHVzaChbcHJvcGVydHksIG9sZFZhbHVlLCB2YWx1ZV0pO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChjaGFuZ2VzLmxlbmd0aCA+IDApIHtcblx0ICAgICAgICB0aGlzLm9uUHJvcGVydGllc0NoYW5nZWQoY2hhbmdlcyk7XG5cdCAgICAgIH1cblx0ICAgIH0sXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pO1xuXHR9XG5cblx0LyogZ2xvYmFscyBPU19BTkRST0lELE9TX0lPUyAqL1xuXHRmdW5jdGlvbiBib290c3RyYXAkMShnbG9iYWwsIGtyb2xsKSB7XG5cdCAge1xuXHQgICAgY29uc3QgdGlCaW5kaW5nID0ga3JvbGwuYmluZGluZygnVGl0YW5pdW0nKTtcblx0ICAgIGNvbnN0IFRpID0gdGlCaW5kaW5nLlRpdGFuaXVtO1xuXG5cdCAgICBjb25zdCBib290c3RyYXAgPSBrcm9sbC5OYXRpdmVNb2R1bGUucmVxdWlyZSgnYm9vdHN0cmFwJyk7IC8vIFRoZSBib290c3RyYXAgZGVmaW5lcyBsYXp5IG5hbWVzcGFjZSBwcm9wZXJ0eSB0cmVlICoqYW5kKipcblx0ICAgIC8vIHNldHMgdXAgc3BlY2lhbCBBUElzIHRoYXQgZ2V0IHdyYXBwZWQgdG8gcGFzcyBhbG9uZyBzb3VyY2VVcmwgdmlhIGEgS3JvbGxJbnZvY2F0aW9uIG9iamVjdFxuXG5cblx0ICAgIGJvb3RzdHJhcC5ib290c3RyYXAoVGkpO1xuXHQgICAgYm9vdHN0cmFwLmRlZmluZUxhenlCaW5kaW5nKFRpLCAnQVBJJyk7IC8vIEJhc2ljYWxseSBkb2VzIHRoZSBzYW1lIHRoaW5nIGlPUyBkb2VzIGZvciBBUEkgbW9kdWxlIChsYXp5IHByb3BlcnR5IGdldHRlcilcblx0ICAgIC8vIEhlcmUsIHdlIGdvIHRocm91Z2ggYWxsIHRoZSBzcGVjaWFsbHkgbWFya2VkIEFQSXMgdG8gZ2VuZXJhdGUgdGhlIHdyYXBwZXJzIHRvIHBhc3MgaW4gdGhlIHNvdXJjZVVybFxuXHQgICAgLy8gVE9ETzogVGhpcyBpcyBhbGwgaW5zYW5lLCBhbmQgd2Ugc2hvdWxkIGp1c3QgYmFrZSBpdCBpbnRvIHRoZSBQcm94eSBjb252ZXJzaW9uIHN0dWZmIHRvIGdyYWIgYW5kIHBhc3MgYWxvbmcgc291cmNlVXJsXG5cdCAgICAvLyBSYXRoZXIgdGhhbiBjYXJyeSBpdCBhbGwgb3ZlciB0aGUgcGxhY2UgbGlrZSB0aGlzIVxuXHQgICAgLy8gV2UgYWxyZWFkeSBuZWVkIHRvIGdlbmVyYXRlIGEgS3JvbGxJbnZvY2F0aW9uIG9iamVjdCB0byB3cmFwIHRoZSBzb3VyY2VVcmwhXG5cblx0ICAgIGZ1bmN0aW9uIFRpdGFuaXVtV3JhcHBlcihjb250ZXh0KSB7XG5cdCAgICAgIGNvbnN0IHNvdXJjZVVybCA9IHRoaXMuc291cmNlVXJsID0gY29udGV4dC5zb3VyY2VVcmw7XG5cdCAgICAgIGNvbnN0IHNjb3BlVmFycyA9IG5ldyBrcm9sbC5TY29wZVZhcnMoe1xuXHQgICAgICAgIHNvdXJjZVVybFxuXHQgICAgICB9KTtcblx0ICAgICAgVGkuYmluZEludm9jYXRpb25BUElzKHRoaXMsIHNjb3BlVmFycyk7XG5cdCAgICB9XG5cblx0ICAgIFRpdGFuaXVtV3JhcHBlci5wcm90b3R5cGUgPSBUaTtcblx0ICAgIFRpLldyYXBwZXIgPSBUaXRhbml1bVdyYXBwZXI7IC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cdCAgICAvLyBUaGlzIGxvb3BzIHRocm91Z2ggYWxsIGtub3duIEFQSXMgdGhhdCByZXF1aXJlIGFuXG5cdCAgICAvLyBJbnZvY2F0aW9uIG9iamVjdCBhbmQgd3JhcHMgdGhlbSBzbyB3ZSBjYW4gcGFzcyBhXG5cdCAgICAvLyBzb3VyY2UgVVJMIGFzIHRoZSBmaXJzdCBhcmd1bWVudFxuXG5cdCAgICBUaS5iaW5kSW52b2NhdGlvbkFQSXMgPSBmdW5jdGlvbiAod3JhcHBlclRpLCBzY29wZVZhcnMpIHtcblx0ICAgICAgZm9yIChjb25zdCBhcGkgb2YgVGkuaW52b2NhdGlvbkFQSXMpIHtcblx0ICAgICAgICAvLyBzZXBhcmF0ZSBlYWNoIGludm9rZXIgaW50byBpdCdzIG93biBwcml2YXRlIHNjb3BlXG5cdCAgICAgICAgaW52b2tlci5nZW5JbnZva2VyKHdyYXBwZXJUaSwgVGksICdUaXRhbml1bScsIGFwaSwgc2NvcGVWYXJzKTtcblx0ICAgICAgfVxuXHQgICAgfTtcblxuXHQgICAgUHJveHlCb290c3RyYXAodGlCaW5kaW5nLCBUaSk7XG5cdCAgICByZXR1cm4gbmV3IFRpdGFuaXVtV3JhcHBlcih7XG5cdCAgICAgIC8vIEV2ZW4gdGhvdWdoIHRoZSBlbnRyeSBwb2ludCBpcyByZWFsbHkgdGk6Ly9rcm9sbC5qcywgdGhhdCB3aWxsIGJyZWFrIHJlc29sdXRpb24gb2YgdXJscyB1bmRlciB0aGUgY292ZXJzIVxuXHQgICAgICAvLyBTbyBiYXNpY2FsbHkganVzdCBhc3N1bWUgYXBwLmpzIGFzIHRoZSByZWxhdGl2ZSBmaWxlIGJhc2Vcblx0ICAgICAgc291cmNlVXJsOiAnYXBwOi8vYXBwLmpzJ1xuXHQgICAgfSk7XG5cdCAgfVxuXHR9XG5cblx0Ly8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG5cdC8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG5cdC8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcblx0Ly8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG5cdC8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcblx0Ly8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuXHQvLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcblx0Ly8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cdC8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG5cdC8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXHQvLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG5cdC8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcblx0Ly8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuXHQvLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcblx0Ly8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG5cdC8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcblx0Ly8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblx0Ly8gTW9kaWZpY2F0aW9ucyBDb3B5cmlnaHQgMjAxMS1QcmVzZW50IEFwcGNlbGVyYXRvciwgSW5jLlxuXHRmdW5jdGlvbiBFdmVudEVtaXR0ZXJCb290c3RyYXAoZ2xvYmFsLCBrcm9sbCkge1xuXHQgIGNvbnN0IFRBRyA9ICdFdmVudEVtaXR0ZXInO1xuXHQgIGNvbnN0IEV2ZW50RW1pdHRlciA9IGtyb2xsLkV2ZW50RW1pdHRlcjtcblx0ICBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTsgLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhblxuXHQgIC8vIDEwIGxpc3RlbmVycyBhcmUgYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaFxuXHQgIC8vIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlci5wcm90b3R5cGUsICdjYWxsSGFuZGxlcicsIHtcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiAoaGFuZGxlciwgdHlwZSwgZGF0YSkge1xuXHQgICAgICAvLyBrcm9sbC5sb2coVEFHLCBcImNhbGxpbmcgZXZlbnQgaGFuZGxlcjogdHlwZTpcIiArIHR5cGUgKyBcIiwgZGF0YTogXCIgKyBkYXRhICsgXCIsIGhhbmRsZXI6IFwiICsgaGFuZGxlcik7XG5cdCAgICAgIHZhciBoYW5kbGVkID0gZmFsc2UsXG5cdCAgICAgICAgICBjYW5jZWxCdWJibGUgPSBkYXRhLmNhbmNlbEJ1YmJsZSxcblx0ICAgICAgICAgIGV2ZW50O1xuXG5cdCAgICAgIGlmIChoYW5kbGVyLmxpc3RlbmVyICYmIGhhbmRsZXIubGlzdGVuZXIuY2FsbCkge1xuXHQgICAgICAgIC8vIENyZWF0ZSBldmVudCBvYmplY3QsIGNvcHkgYW55IGN1c3RvbSBldmVudCBkYXRhLCBhbmQgc2V0IHRoZSBcInR5cGVcIiBhbmQgXCJzb3VyY2VcIiBwcm9wZXJ0aWVzLlxuXHQgICAgICAgIGV2ZW50ID0ge1xuXHQgICAgICAgICAgdHlwZTogdHlwZSxcblx0ICAgICAgICAgIHNvdXJjZTogdGhpc1xuXHQgICAgICAgIH07XG5cdCAgICAgICAga3JvbGwuZXh0ZW5kKGV2ZW50LCBkYXRhKTtcblxuXHQgICAgICAgIGlmIChoYW5kbGVyLnNlbGYgJiYgZXZlbnQuc291cmNlID09IGhhbmRsZXIuc2VsZi52aWV3KSB7XG5cdCAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuXHQgICAgICAgICAgZXZlbnQuc291cmNlID0gaGFuZGxlci5zZWxmO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGhhbmRsZXIubGlzdGVuZXIuY2FsbCh0aGlzLCBldmVudCk7IC8vIFRoZSBcImNhbmNlbEJ1YmJsZVwiIHByb3BlcnR5IG1heSBiZSByZXNldCBpbiB0aGUgaGFuZGxlci5cblxuXHQgICAgICAgIGlmIChldmVudC5jYW5jZWxCdWJibGUgIT09IGNhbmNlbEJ1YmJsZSkge1xuXHQgICAgICAgICAgY2FuY2VsQnViYmxlID0gZXZlbnQuY2FuY2VsQnViYmxlO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGhhbmRsZWQgPSB0cnVlO1xuXHQgICAgICB9IGVsc2UgaWYgKGtyb2xsLkRCRykge1xuXHQgICAgICAgIGtyb2xsLmxvZyhUQUcsICdoYW5kbGVyIGZvciBldmVudCBcXCcnICsgdHlwZSArICdcXCcgaXMgJyArIHR5cGVvZiBoYW5kbGVyLmxpc3RlbmVyICsgJyBhbmQgY2Fubm90IGJlIGNhbGxlZC4nKTtcblx0ICAgICAgfSAvLyBCdWJibGUgdGhlIGV2ZW50cyB0byB0aGUgcGFyZW50IHZpZXcgaWYgbmVlZGVkLlxuXG5cblx0ICAgICAgaWYgKGRhdGEuYnViYmxlcyAmJiAhY2FuY2VsQnViYmxlKSB7XG5cdCAgICAgICAgaGFuZGxlZCA9IHRoaXMuX2ZpcmVTeW5jRXZlbnRUb1BhcmVudCh0eXBlLCBkYXRhKSB8fCBoYW5kbGVkO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIGhhbmRsZWQ7XG5cdCAgICB9LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTtcblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ2VtaXQnLCB7XG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gKHR5cGUpIHtcblx0ICAgICAgdmFyIGhhbmRsZWQgPSBmYWxzZSxcblx0ICAgICAgICAgIGRhdGEgPSBhcmd1bWVudHNbMV0sXG5cdCAgICAgICAgICBoYW5kbGVyLFxuXHQgICAgICAgICAgbGlzdGVuZXJzOyAvLyBTZXQgdGhlIFwiYnViYmxlc1wiIGFuZCBcImNhbmNlbEJ1YmJsZVwiIHByb3BlcnRpZXMgZm9yIGV2ZW50IGRhdGEuXG5cblx0ICAgICAgaWYgKGRhdGEgIT09IG51bGwgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnKSB7XG5cdCAgICAgICAgZGF0YS5idWJibGVzID0gISFkYXRhLmJ1YmJsZXM7XG5cdCAgICAgICAgZGF0YS5jYW5jZWxCdWJibGUgPSAhIWRhdGEuY2FuY2VsQnViYmxlO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGRhdGEgPSB7XG5cdCAgICAgICAgICBidWJibGVzOiBmYWxzZSxcblx0ICAgICAgICAgIGNhbmNlbEJ1YmJsZTogZmFsc2Vcblx0ICAgICAgICB9O1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKHRoaXMuX2hhc0phdmFMaXN0ZW5lcikge1xuXHQgICAgICAgIHRoaXMuX29uRXZlbnRGaXJlZCh0eXBlLCBkYXRhKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0gfHwgIXRoaXMuY2FsbEhhbmRsZXIpIHtcblx0ICAgICAgICBpZiAoZGF0YS5idWJibGVzICYmICFkYXRhLmNhbmNlbEJ1YmJsZSkge1xuXHQgICAgICAgICAgaGFuZGxlZCA9IHRoaXMuX2ZpcmVTeW5jRXZlbnRUb1BhcmVudCh0eXBlLCBkYXRhKTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICByZXR1cm4gaGFuZGxlZDtcblx0ICAgICAgfVxuXG5cdCAgICAgIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cblx0ICAgICAgaWYgKHR5cGVvZiBoYW5kbGVyLmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgICAgaGFuZGxlZCA9IHRoaXMuY2FsbEhhbmRsZXIoaGFuZGxlciwgdHlwZSwgZGF0YSk7XG5cdCAgICAgIH0gZWxzZSBpZiAoaXNBcnJheShoYW5kbGVyKSkge1xuXHQgICAgICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcblxuXHQgICAgICAgIGZvciAodmFyIGkgPSAwLCBsID0gbGlzdGVuZXJzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuXHQgICAgICAgICAgaGFuZGxlZCA9IHRoaXMuY2FsbEhhbmRsZXIobGlzdGVuZXJzW2ldLCB0eXBlLCBkYXRhKSB8fCBoYW5kbGVkO1xuXHQgICAgICAgIH1cblx0ICAgICAgfSBlbHNlIGlmIChkYXRhLmJ1YmJsZXMgJiYgIWRhdGEuY2FuY2VsQnViYmxlKSB7XG5cdCAgICAgICAgaGFuZGxlZCA9IHRoaXMuX2ZpcmVTeW5jRXZlbnRUb1BhcmVudCh0eXBlLCBkYXRhKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBoYW5kbGVkO1xuXHQgICAgfSxcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlXG5cdCAgfSk7IC8vIFRpdGFuaXVtIGNvbXBhdGliaWxpdHlcblxuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAnZmlyZUV2ZW50Jywge1xuXHQgICAgdmFsdWU6IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCxcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlLFxuXHQgICAgd3JpdGFibGU6IHRydWVcblx0ICB9KTtcblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ2ZpcmVTeW5jRXZlbnQnLCB7XG5cdCAgICB2YWx1ZTogRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTsgLy8gRXZlbnRFbWl0dGVyIGlzIGRlZmluZWQgaW4gc3JjL25vZGVfZXZlbnRzLmNjXG5cdCAgLy8gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0KCkgaXMgYWxzbyBkZWZpbmVkIHRoZXJlLlxuXG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlci5wcm90b3R5cGUsICdhZGRMaXN0ZW5lcicsIHtcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIsIHZpZXcpIHtcblx0ICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICAgIHRocm93IG5ldyBFcnJvcignYWRkTGlzdGVuZXIgb25seSB0YWtlcyBpbnN0YW5jZXMgb2YgRnVuY3Rpb24uIFRoZSBsaXN0ZW5lciBmb3IgZXZlbnQgXCInICsgdHlwZSArICdcIiBpcyBcIicgKyB0eXBlb2YgbGlzdGVuZXIgKyAnXCInKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICghdGhpcy5fZXZlbnRzKSB7XG5cdCAgICAgICAgdGhpcy5fZXZlbnRzID0ge307XG5cdCAgICAgIH1cblxuXHQgICAgICB2YXIgaWQ7IC8vIFNldHVwIElEIGZpcnN0IHNvIHdlIGNhbiBwYXNzIGNvdW50IGluIHRvIFwibGlzdGVuZXJBZGRlZFwiXG5cblx0ICAgICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHtcblx0ICAgICAgICBpZCA9IDA7XG5cdCAgICAgIH0gZWxzZSBpZiAoaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG5cdCAgICAgICAgaWQgPSB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIGlkID0gMTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHZhciBsaXN0ZW5lcldyYXBwZXIgPSB7fTtcblx0ICAgICAgbGlzdGVuZXJXcmFwcGVyLmxpc3RlbmVyID0gbGlzdGVuZXI7XG5cdCAgICAgIGxpc3RlbmVyV3JhcHBlci5zZWxmID0gdmlldztcblxuXHQgICAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuXHQgICAgICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuXHQgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyV3JhcHBlcjtcblx0ICAgICAgfSBlbHNlIGlmIChpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcblx0ICAgICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG5cdCAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXJXcmFwcGVyKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cblx0ICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcldyYXBwZXJdO1xuXHQgICAgICB9IC8vIE5vdGlmeSB0aGUgSmF2YSBwcm94eSBpZiB0aGlzIGlzIHRoZSBmaXJzdCBsaXN0ZW5lciBhZGRlZC5cblxuXG5cdCAgICAgIGlmIChpZCA9PT0gMCkge1xuXHQgICAgICAgIHRoaXMuX2hhc0xpc3RlbmVyc0ZvckV2ZW50VHlwZSh0eXBlLCB0cnVlKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBpZDtcblx0ICAgIH0sXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pOyAvLyBUaGUgSmF2YU9iamVjdCBwcm90b3R5cGUgd2lsbCBwcm92aWRlIGEgdmVyc2lvbiBvZiB0aGlzXG5cdCAgLy8gdGhhdCBkZWxlZ2F0ZXMgYmFjayB0byB0aGUgSmF2YSBwcm94eS4gTm9uLUphdmEgdmVyc2lvbnNcblx0ICAvLyBvZiBFdmVudEVtaXR0ZXIgZG9uJ3QgY2FyZSwgc28gdGhpcyBubyBvcCBpcyBjYWxsZWQgaW5zdGVhZC5cblxuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAnX2xpc3RlbmVyRm9yRXZlbnQnLCB7XG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gKCkge30sXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pO1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAnb24nLCB7XG5cdCAgICB2YWx1ZTogRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcixcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlXG5cdCAgfSk7IC8vIFRpdGFuaXVtIGNvbXBhdGliaWxpdHlcblxuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAnYWRkRXZlbnRMaXN0ZW5lcicsIHtcblx0ICAgIHZhbHVlOiBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyLFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2UsXG5cdCAgICB3cml0YWJsZTogdHJ1ZVxuXHQgIH0pO1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAnb25jZScsIHtcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiAodHlwZSwgbGlzdGVuZXIpIHtcblx0ICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG5cdCAgICAgIGZ1bmN0aW9uIGcoKSB7XG5cdCAgICAgICAgc2VsZi5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblx0ICAgICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHQgICAgICB9XG5cblx0ICAgICAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuXHQgICAgICBzZWxmLm9uKHR5cGUsIGcpO1xuXHQgICAgICByZXR1cm4gdGhpcztcblx0ICAgIH0sXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pO1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAncmVtb3ZlTGlzdGVuZXInLCB7XG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyKSB7XG5cdCAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlbW92ZUxpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uJyk7XG5cdCAgICAgIH0gLy8gZG9lcyBub3QgdXNlIGxpc3RlbmVycygpLCBzbyBubyBzaWRlIGVmZmVjdCBvZiBjcmVhdGluZyBfZXZlbnRzW3R5cGVdXG5cblxuXHQgICAgICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblxuXHQgICAgICB2YXIgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblx0ICAgICAgdmFyIGNvdW50ID0gMDtcblxuXHQgICAgICBpZiAoaXNBcnJheShsaXN0KSkge1xuXHQgICAgICAgIHZhciBwb3NpdGlvbiA9IC0xOyAvLyBBbHNvIHN1cHBvcnQgbGlzdGVuZXIgaW5kZXhlcyAvIGlkc1xuXG5cdCAgICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciA9PT0gJ251bWJlcicpIHtcblx0ICAgICAgICAgIHBvc2l0aW9uID0gbGlzdGVuZXI7XG5cblx0ICAgICAgICAgIGlmIChwb3NpdGlvbiA+IGxpc3QubGVuZ3RoIHx8IHBvc2l0aW9uIDwgMCkge1xuXHQgICAgICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9IGVsc2Uge1xuXHQgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbmd0aCA9IGxpc3QubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcblx0ICAgICAgICAgICAgaWYgKGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG5cdCAgICAgICAgICAgICAgcG9zaXRpb24gPSBpO1xuXHQgICAgICAgICAgICAgIGJyZWFrO1xuXHQgICAgICAgICAgICB9XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgaWYgKHBvc2l0aW9uIDwgMCkge1xuXHQgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuXG5cdCAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG5cdCAgICAgICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGNvdW50ID0gbGlzdC5sZW5ndGg7XG5cdCAgICAgIH0gZWxzZSBpZiAobGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIgfHwgbGlzdGVuZXIgPT0gMCkge1xuXHQgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZXFlcWVxXG5cdCAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICByZXR1cm4gdGhpcztcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmIChjb3VudCA9PT0gMCkge1xuXHQgICAgICAgIHRoaXMuX2hhc0xpc3RlbmVyc0ZvckV2ZW50VHlwZSh0eXBlLCBmYWxzZSk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gdGhpcztcblx0ICAgIH0sXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pO1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAncmVtb3ZlRXZlbnRMaXN0ZW5lcicsIHtcblx0ICAgIHZhbHVlOiBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyLFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2UsXG5cdCAgICB3cml0YWJsZTogdHJ1ZVxuXHQgIH0pO1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAncmVtb3ZlQWxsTGlzdGVuZXJzJywge1xuXHQgICAgdmFsdWU6IGZ1bmN0aW9uICh0eXBlKSB7XG5cdCAgICAgIC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuXHQgICAgICBpZiAodHlwZSAmJiB0aGlzLl9ldmVudHMgJiYgdGhpcy5fZXZlbnRzW3R5cGVdKSB7XG5cdCAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbnVsbDtcblxuXHQgICAgICAgIHRoaXMuX2hhc0xpc3RlbmVyc0ZvckV2ZW50VHlwZSh0eXBlLCBmYWxzZSk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gdGhpcztcblx0ICAgIH0sXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pO1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAnbGlzdGVuZXJzJywge1xuXHQgICAgdmFsdWU6IGZ1bmN0aW9uICh0eXBlKSB7XG5cdCAgICAgIGlmICghdGhpcy5fZXZlbnRzKSB7XG5cdCAgICAgICAgdGhpcy5fZXZlbnRzID0ge307XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuXHQgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFtdO1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKCFpc0FycmF5KHRoaXMuX2V2ZW50c1t0eXBlXSkpIHtcblx0ICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiB0aGlzLl9ldmVudHNbdHlwZV07XG5cdCAgICB9LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTtcblx0ICByZXR1cm4gRXZlbnRFbWl0dGVyO1xuXHR9XG5cblx0LyoqXG5cdCAqIFRoaXMgaXMgdXNlZCBieSBBbmRyb2lkIHRvIHJlcXVpcmUgXCJiYWtlZC1pblwiIHNvdXJjZS5cblx0ICogU0RLIGFuZCBtb2R1bGUgYnVpbGRzIHdpbGwgYmFrZSBpbiB0aGUgcmF3IHNvdXJjZSBhcyBjIHN0cmluZ3MsIGFuZCB0aGlzIHdpbGwgd3JhcFxuXHQgKiBsb2FkaW5nIHRoYXQgY29kZSBpbiB2aWEga3JvbGwuTmF0aXZlTW9kdWxlLnJlcXVpcmUoPGlkPilcblx0ICogRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSB0aGUgYm9vdHN0cmFwLmpzLmVqcyB0ZW1wbGF0ZS5cblx0ICovXG5cdGZ1bmN0aW9uIE5hdGl2ZU1vZHVsZUJvb3RzdHJhcChnbG9iYWwsIGtyb2xsKSB7XG5cdCAgY29uc3QgU2NyaXB0ID0ga3JvbGwuYmluZGluZygnZXZhbHMnKS5TY3JpcHQ7XG5cdCAgY29uc3QgcnVuSW5UaGlzQ29udGV4dCA9IFNjcmlwdC5ydW5JblRoaXNDb250ZXh0O1xuXG5cdCAgZnVuY3Rpb24gTmF0aXZlTW9kdWxlKGlkKSB7XG5cdCAgICB0aGlzLmZpbGVuYW1lID0gaWQgKyAnLmpzJztcblx0ICAgIHRoaXMuaWQgPSBpZDtcblx0ICAgIHRoaXMuZXhwb3J0cyA9IHt9O1xuXHQgICAgdGhpcy5sb2FkZWQgPSBmYWxzZTtcblx0ICB9XG5cdCAgLyoqXG5cdCAgICogVGhpcyBzaG91bGQgYmUgYW4gb2JqZWN0IHdpdGggc3RyaW5nIGtleXMgKGJha2VkIGluIG1vZHVsZSBpZHMpIC0+IHN0cmluZyB2YWx1ZXMgKHNvdXJjZSBvZiB0aGUgYmFrZWQgaW4ganMgY29kZSlcblx0ICAgKi9cblxuXG5cdCAgTmF0aXZlTW9kdWxlLl9zb3VyY2UgPSBrcm9sbC5iaW5kaW5nKCduYXRpdmVzJyk7XG5cdCAgTmF0aXZlTW9kdWxlLl9jYWNoZSA9IHt9O1xuXG5cdCAgTmF0aXZlTW9kdWxlLnJlcXVpcmUgPSBmdW5jdGlvbiAoaWQpIHtcblx0ICAgIGlmIChpZCA9PT0gJ25hdGl2ZV9tb2R1bGUnKSB7XG5cdCAgICAgIHJldHVybiBOYXRpdmVNb2R1bGU7XG5cdCAgICB9XG5cblx0ICAgIGlmIChpZCA9PT0gJ2ludm9rZXInKSB7XG5cdCAgICAgIHJldHVybiBpbnZva2VyOyAvLyBBbmRyb2lkIG5hdGl2ZSBtb2R1bGVzIHVzZSBhIGJvb3RzdHJhcC5qcyBmaWxlIHRoYXQgYXNzdW1lcyB0aGVyZSdzIGEgYnVpbHRpbiAnaW52b2tlcidcblx0ICAgIH1cblxuXHQgICAgY29uc3QgY2FjaGVkID0gTmF0aXZlTW9kdWxlLmdldENhY2hlZChpZCk7XG5cblx0ICAgIGlmIChjYWNoZWQpIHtcblx0ICAgICAgcmV0dXJuIGNhY2hlZC5leHBvcnRzO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoIU5hdGl2ZU1vZHVsZS5leGlzdHMoaWQpKSB7XG5cdCAgICAgIHRocm93IG5ldyBFcnJvcignTm8gc3VjaCBuYXRpdmUgbW9kdWxlICcgKyBpZCk7XG5cdCAgICB9XG5cblx0ICAgIGNvbnN0IG5hdGl2ZU1vZHVsZSA9IG5ldyBOYXRpdmVNb2R1bGUoaWQpO1xuXHQgICAgbmF0aXZlTW9kdWxlLmNvbXBpbGUoKTtcblx0ICAgIG5hdGl2ZU1vZHVsZS5jYWNoZSgpO1xuXHQgICAgcmV0dXJuIG5hdGl2ZU1vZHVsZS5leHBvcnRzO1xuXHQgIH07XG5cblx0ICBOYXRpdmVNb2R1bGUuZ2V0Q2FjaGVkID0gZnVuY3Rpb24gKGlkKSB7XG5cdCAgICByZXR1cm4gTmF0aXZlTW9kdWxlLl9jYWNoZVtpZF07XG5cdCAgfTtcblxuXHQgIE5hdGl2ZU1vZHVsZS5leGlzdHMgPSBmdW5jdGlvbiAoaWQpIHtcblx0ICAgIHJldHVybiBpZCBpbiBOYXRpdmVNb2R1bGUuX3NvdXJjZTtcblx0ICB9O1xuXG5cdCAgTmF0aXZlTW9kdWxlLmdldFNvdXJjZSA9IGZ1bmN0aW9uIChpZCkge1xuXHQgICAgcmV0dXJuIE5hdGl2ZU1vZHVsZS5fc291cmNlW2lkXTtcblx0ICB9O1xuXG5cdCAgTmF0aXZlTW9kdWxlLndyYXAgPSBmdW5jdGlvbiAoc2NyaXB0KSB7XG5cdCAgICByZXR1cm4gTmF0aXZlTW9kdWxlLndyYXBwZXJbMF0gKyBzY3JpcHQgKyBOYXRpdmVNb2R1bGUud3JhcHBlclsxXTtcblx0ICB9O1xuXG5cdCAgTmF0aXZlTW9kdWxlLndyYXBwZXIgPSBbJyhmdW5jdGlvbiAoZXhwb3J0cywgcmVxdWlyZSwgbW9kdWxlLCBfX2ZpbGVuYW1lLCBfX2Rpcm5hbWUsIFRpdGFuaXVtLCBUaSwgZ2xvYmFsLCBrcm9sbCkgeycsICdcXG59KTsnXTtcblxuXHQgIE5hdGl2ZU1vZHVsZS5wcm90b3R5cGUuY29tcGlsZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIGxldCBzb3VyY2UgPSBOYXRpdmVNb2R1bGUuZ2V0U291cmNlKHRoaXMuaWQpO1xuXHQgICAgc291cmNlID0gTmF0aXZlTW9kdWxlLndyYXAoc291cmNlKTsgLy8gQWxsIG5hdGl2ZSBtb2R1bGVzIGhhdmUgdGhlaXIgZmlsZW5hbWUgcHJlZml4ZWQgd2l0aCB0aTovXG5cblx0ICAgIGNvbnN0IGZpbGVuYW1lID0gYHRpOi8ke3RoaXMuZmlsZW5hbWV9YDtcblx0ICAgIGNvbnN0IGZuID0gcnVuSW5UaGlzQ29udGV4dChzb3VyY2UsIGZpbGVuYW1lLCB0cnVlKTtcblx0ICAgIGZuKHRoaXMuZXhwb3J0cywgTmF0aXZlTW9kdWxlLnJlcXVpcmUsIHRoaXMsIHRoaXMuZmlsZW5hbWUsIG51bGwsIGdsb2JhbC5UaSwgZ2xvYmFsLlRpLCBnbG9iYWwsIGtyb2xsKTtcblx0ICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcblx0ICB9O1xuXG5cdCAgTmF0aXZlTW9kdWxlLnByb3RvdHlwZS5jYWNoZSA9IGZ1bmN0aW9uICgpIHtcblx0ICAgIE5hdGl2ZU1vZHVsZS5fY2FjaGVbdGhpcy5pZF0gPSB0aGlzO1xuXHQgIH07XG5cblx0ICByZXR1cm4gTmF0aXZlTW9kdWxlO1xuXHR9XG5cblx0Ly8gVGhpcyBpcyB0aGUgZmlsZSBlYWNoIHBsYXRmb3JtIGxvYWRzIG9uIGJvb3QgKmJlZm9yZSogd2UgbGF1bmNoIHRpLm1haW4uanMgdG8gaW5zZXJ0IGFsbCBvdXIgc2hpbXMvZXh0ZW5zaW9uc1xuXHQvKipcblx0ICogbWFpbiBib290c3RyYXBwaW5nIGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBnbG9iYWwgdGhlIGdsb2JhbCBvYmplY3Rcblx0ICogQHBhcmFtIHtvYmplY3R9IGtyb2xsOyB0aGUga3JvbGwgbW9kdWxlL2JpbmRpbmdcblx0ICogQHJldHVybiB7dm9pZH0gICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblxuXHRmdW5jdGlvbiBib290c3RyYXAoZ2xvYmFsLCBrcm9sbCkge1xuXHQgIC8vIFdvcmtzIGlkZW50aWNhbCB0byBPYmplY3QuaGFzT3duUHJvcGVydHksIGV4Y2VwdFxuXHQgIC8vIGFsc28gd29ya3MgaWYgdGhlIGdpdmVuIG9iamVjdCBkb2VzIG5vdCBoYXZlIHRoZSBtZXRob2Rcblx0ICAvLyBvbiBpdHMgcHJvdG90eXBlIG9yIGl0IGhhcyBiZWVuIG1hc2tlZC5cblx0ICBmdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmplY3QsIHByb3BlcnR5KSB7XG5cdCAgICByZXR1cm4gT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7XG5cdCAgfVxuXG5cdCAga3JvbGwuZXh0ZW5kID0gZnVuY3Rpb24gKHRoaXNPYmplY3QsIG90aGVyT2JqZWN0KSB7XG5cdCAgICBpZiAoIW90aGVyT2JqZWN0KSB7XG5cdCAgICAgIC8vIGV4dGVuZCB3aXRoIHdoYXQ/ISAgZGVuaWVkIVxuXHQgICAgICByZXR1cm47XG5cdCAgICB9XG5cblx0ICAgIGZvciAodmFyIG5hbWUgaW4gb3RoZXJPYmplY3QpIHtcblx0ICAgICAgaWYgKGhhc093blByb3BlcnR5KG90aGVyT2JqZWN0LCBuYW1lKSkge1xuXHQgICAgICAgIHRoaXNPYmplY3RbbmFtZV0gPSBvdGhlck9iamVjdFtuYW1lXTtcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gdGhpc09iamVjdDtcblx0ICB9O1xuXHQgIC8qKlxuXHQgICAqIFRoaXMgaXMgdXNlZCB0byBzaHV0dGxlIHRoZSBzb3VyY2VVcmwgYXJvdW5kIHRvIEFQSXMgdGhhdCBtYXkgbmVlZCB0b1xuXHQgICAqIHJlc29sdmUgcmVsYXRpdmUgcGF0aHMgYmFzZWQgb24gdGhlIGludm9raW5nIGZpbGUuXG5cdCAgICogKHNlZSBLcm9sbEludm9jYXRpb24uamF2YSBmb3IgbW9yZSlcblx0ICAgKiBAcGFyYW0ge29iamVjdH0gdmFycyBrZXkvdmFsdWUgcGFpcnMgdG8gc3RvcmVcblx0ICAgKiBAcGFyYW0ge3N0cmluZ30gdmFycy5zb3VyY2VVcmwgdGhlIHNvdXJjZSBVUkwgb2YgdGhlIGZpbGUgY2FsbGluZyB0aGUgQVBJXG5cdCAgICogQGNvbnN0cnVjdG9yXG5cdCAgICogQHJldHVybnMge1Njb3BlVmFyc31cblx0ICAgKi9cblxuXG5cdCAgZnVuY3Rpb24gU2NvcGVWYXJzKHZhcnMpIHtcblx0ICAgIGlmICghdmFycykge1xuXHQgICAgICByZXR1cm4gdGhpcztcblx0ICAgIH1cblxuXHQgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHZhcnMpO1xuXHQgICAgY29uc3QgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG5cblx0ICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcblx0ICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcblx0ICAgICAgdGhpc1trZXldID0gdmFyc1trZXldO1xuXHQgICAgfVxuXHQgIH1cblxuXHQgIGZ1bmN0aW9uIHN0YXJ0dXAoKSB7XG5cdCAgICBnbG9iYWwuZ2xvYmFsID0gZ2xvYmFsOyAvLyBoYW5nIHRoZSBnbG9iYWwgb2JqZWN0IG9mZiBpdHNlbGZcblxuXHQgICAgZ2xvYmFsLmtyb2xsID0ga3JvbGw7IC8vIGhhbmcgb3VyIHNwZWNpYWwgdW5kZXIgdGhlIGhvb2Qga3JvbGwgb2JqZWN0IG9mZiB0aGUgZ2xvYmFsXG5cblx0ICAgIHtcblx0ICAgICAga3JvbGwuU2NvcGVWYXJzID0gU2NvcGVWYXJzOyAvLyBleHRlcm5hbCBtb2R1bGUgYm9vdHN0cmFwLmpzIGV4cGVjdHMgdG8gY2FsbCBrcm9sbC5OYXRpdmVNb2R1bGUucmVxdWlyZSBkaXJlY3RseSB0byBsb2FkIGluIHRoZWlyIG93biBzb3VyY2Vcblx0ICAgICAgLy8gYW5kIHRvIHJlZmVyIHRvIHRoZSBiYWtlZCBpbiBcImJvb3RzdHJhcC5qc1wiIGZvciB0aGUgU0RLIGFuZCBcImludm9rZXIuanNcIiB0byBoYW5nIGxhenkgQVBJcy93cmFwIGFwaSBjYWxscyB0byBwYXNzIGluIHNjb3BlIHZhcnNcblxuXHQgICAgICBrcm9sbC5OYXRpdmVNb2R1bGUgPSBOYXRpdmVNb2R1bGVCb290c3RyYXAoZ2xvYmFsLCBrcm9sbCk7IC8vIEFuZHJvaWQgdXNlcyBpdCdzIG93biBFdmVudEVtaXR0ZXIgaW1wbCwgYW5kIGl0J3MgYmFrZWQgcmlnaHQgaW50byB0aGUgcHJveHkgY2xhc3MgY2hhaW5cblx0ICAgICAgLy8gSXQgYXNzdW1lcyBpdCBjYW4gY2FsbCBiYWNrIGludG8gamF2YSBwcm94aWVzIHRvIGFsZXJ0IHdoZW4gbGlzdGVuZXJzIGFyZSBhZGRlZC9yZW1vdmVkXG5cdCAgICAgIC8vIEZJWE1FOiBHZXQgaXQgdG8gdXNlIHRoZSBldmVudHMuanMgaW1wbCBpbiB0aGUgbm9kZSBleHRlbnNpb24sIGFuZCBnZXQgaU9TIHRvIGJha2UgdGhhdCBpbnRvIGl0J3MgcHJveGllcyBhcyB3ZWxsIVxuXG5cdCAgICAgIEV2ZW50RW1pdHRlckJvb3RzdHJhcChnbG9iYWwsIGtyb2xsKTtcblx0ICAgIH1cblxuXHQgICAgZ2xvYmFsLlRpID0gZ2xvYmFsLlRpdGFuaXVtID0gYm9vdHN0cmFwJDEoZ2xvYmFsLCBrcm9sbCk7XG5cdCAgICBnbG9iYWwuTW9kdWxlID0gYm9vdHN0cmFwJDIoZ2xvYmFsLCBrcm9sbCk7XG5cdCAgfVxuXG5cdCAgc3RhcnR1cCgpO1xuXHR9XG5cblx0cmV0dXJuIGJvb3RzdHJhcDtcblxufSgpKTtcbiJdLCJzb3VyY2VSb290IjoiQzpcXFByb2dyYW1EYXRhXFxUaXRhbml1bVxcbW9iaWxlc2RrXFx3aW4zMlxcMTAuMC4yLkdBXFxjb21tb25cXFJlc291cmNlc1xcYW5kcm9pZCJ9
