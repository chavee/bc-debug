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

  var invoker = {};

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

  invoker.genInvoker = genInvoker;
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

  invoker.createInvoker = createInvoker;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRpLmtlcm5lbC5qcyJdLCJuYW1lcyI6WyJhc3NlcnRBcmd1bWVudFR5cGUiLCJhcmciLCJuYW1lIiwidHlwZW5hbWUiLCJ0eXBlIiwidG9Mb3dlckNhc2UiLCJUeXBlRXJyb3IiLCJGT1JXQVJEX1NMQVNIIiwiQkFDS1dBUkRfU0xBU0giLCJpc1dpbmRvd3NEZXZpY2VOYW1lIiwiY2hhckNvZGUiLCJpc0Fic29sdXRlIiwiaXNQb3NpeCIsImZpbGVwYXRoIiwibGVuZ3RoIiwiZmlyc3RDaGFyIiwiY2hhckNvZGVBdCIsImNoYXJBdCIsInRoaXJkQ2hhciIsImRpcm5hbWUiLCJzZXBhcmF0b3IiLCJmcm9tSW5kZXgiLCJoYWRUcmFpbGluZyIsImVuZHNXaXRoIiwiZm91bmRJbmRleCIsImxhc3RJbmRleE9mIiwic2xpY2UiLCJleHRuYW1lIiwiaW5kZXgiLCJlbmRJbmRleCIsImxhc3RJbmRleFdpbjMyU2VwYXJhdG9yIiwiaSIsImNoYXIiLCJiYXNlbmFtZSIsImV4dCIsInVuZGVmaW5lZCIsImxhc3RDaGFyQ29kZSIsImxhc3RJbmRleCIsImJhc2UiLCJub3JtYWxpemUiLCJpc1dpbmRvd3MiLCJyZXBsYWNlIiwiaGFkTGVhZGluZyIsInN0YXJ0c1dpdGgiLCJpc1VOQyIsInBhcnRzIiwic3BsaXQiLCJyZXN1bHQiLCJzZWdtZW50IiwicG9wIiwicHVzaCIsIm5vcm1hbGl6ZWQiLCJqb2luIiwiYXNzZXJ0U2VnbWVudCIsInBhdGhzIiwicmVzb2x2ZSIsInJlc29sdmVkIiwiaGl0Um9vdCIsImdsb2JhbCIsInByb2Nlc3MiLCJjd2QiLCJyZWxhdGl2ZSIsImZyb20iLCJ0byIsInVwQ291bnQiLCJyZW1haW5pbmdQYXRoIiwicmVwZWF0IiwicGFyc2UiLCJyb290IiwiZGlyIiwiYmFzZUxlbmd0aCIsInRvU3VidHJhY3QiLCJmaXJzdENoYXJDb2RlIiwidGhpcmRDaGFyQ29kZSIsImZvcm1hdCIsInBhdGhPYmplY3QiLCJ0b05hbWVzcGFjZWRQYXRoIiwicmVzb2x2ZWRQYXRoIiwiV2luMzJQYXRoIiwic2VwIiwiZGVsaW1pdGVyIiwiUG9zaXhQYXRoIiwicGF0aCIsIndpbjMyIiwicG9zaXgiLCJpbnZva2VyIiwiZ2VuSW52b2tlciIsIndyYXBwZXJBUEkiLCJyZWFsQVBJIiwiYXBpTmFtZSIsImludm9jYXRpb25BUEkiLCJzY29wZVZhcnMiLCJhcGlOYW1lc3BhY2UiLCJuYW1lc3BhY2UiLCJuYW1lcyIsImFwaSIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsIlNhbmRib3hBUEkiLCJwcm90byIsImdldFByb3RvdHlwZU9mIiwiZGVmaW5lUHJvcGVydHkiLCJnZXQiLCJfZXZlbnRzIiwic2V0IiwidmFsdWUiLCJkZWxlZ2F0ZSIsIl9fZGVsZWdhdGVfXyIsImNyZWF0ZUludm9rZXIiLCJ0aGlzT2JqIiwidXJsSW52b2tlciIsImFyZ3MiLCJzcGxpY2UiLCJfX3Njb3BlVmFyc19fIiwiYXBwbHkiLCJfX3RoaXNPYmpfXyIsImJvb3RzdHJhcCQyIiwia3JvbGwiLCJhc3NldHMiLCJiaW5kaW5nIiwiU2NyaXB0IiwiZmlsZUluZGV4IiwiSU5ERVhfSlNPTiIsIk1vZHVsZSIsImNvbnN0cnVjdG9yIiwiaWQiLCJwYXJlbnQiLCJleHBvcnRzIiwiZmlsZW5hbWUiLCJsb2FkZWQiLCJ3cmFwcGVyQ2FjaGUiLCJpc1NlcnZpY2UiLCJsb2FkIiwic291cmNlIiwiRXJyb3IiLCJub2RlTW9kdWxlc1BhdGhzIiwicmVhZEFzc2V0IiwiY2FjaGUiLCJfcnVuU2NyaXB0IiwiY3JlYXRlTW9kdWxlV3JhcHBlciIsImV4dGVybmFsTW9kdWxlIiwic291cmNlVXJsIiwiTW9kdWxlV3JhcHBlciIsIndyYXBwZXIiLCJpbnZvY2F0aW9uQVBJcyIsIlNjb3BlVmFycyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZmlyZUV2ZW50IiwiZXh0ZW5kTW9kdWxlV2l0aENvbW1vbkpzIiwiaXNFeHRlcm5hbENvbW1vbkpzTW9kdWxlIiwiZmFrZUlkIiwianNNb2R1bGUiLCJnZXRFeHRlcm5hbENvbW1vbkpzTW9kdWxlIiwiY29uc29sZSIsInRyYWNlIiwiZXh0ZW5kIiwibG9hZEV4dGVybmFsTW9kdWxlIiwiZXh0ZXJuYWxCaW5kaW5nIiwiYm9vdHN0cmFwIiwibW9kdWxlIiwicmVxdWlyZSIsInJlcXVlc3QiLCJzdGFydCIsInN1YnN0cmluZyIsImxvYWRBc0ZpbGVPckRpcmVjdG9yeSIsImxvYWRDb3JlTW9kdWxlIiwiaW5kZXhPZiIsImZpbGVuYW1lRXhpc3RzIiwibG9hZEphdmFzY3JpcHRUZXh0IiwibG9hZEFzRGlyZWN0b3J5IiwibG9hZE5vZGVNb2R1bGVzIiwiZXh0ZXJuYWxDb21tb25Kc0NvbnRlbnRzIiwibW9kdWxlSWQiLCJkaXJzIiwibW9kIiwic3RhcnREaXIiLCJub3JtYWxpemVkUGF0aCIsImxvYWRBc0ZpbGUiLCJsb2FkSmF2YXNjcmlwdE9iamVjdCIsIkpTT04iLCJvYmplY3QiLCJtYWluIiwibSIsInNlbGYiLCJpbnNwZWN0b3IiLCJpbnNwZWN0b3JXcmFwcGVyIiwiY2FsbEFuZFBhdXNlT25TdGFydCIsInJ1bkluVGhpc0NvbnRleHQiLCJ3cmFwIiwiZiIsIlRpdGFuaXVtIiwiVGkiLCJqc29uIiwic2NyaXB0IiwicnVuTW9kdWxlIiwiYWN0aXZpdHlPclNlcnZpY2UiLCJTZXJ2aWNlIiwiQW5kcm9pZCIsIndyaXRhYmxlIiwiY29uZmlndXJhYmxlIiwiUHJveHlCb290c3RyYXAiLCJ0aUJpbmRpbmciLCJQcm94eSIsImRlZmluZVByb3BlcnRpZXMiLCJwcm94eVByb3RvdHlwZSIsInByb3BlcnRpZXMiLCJsZW4iLCJnZXRQcm9wZXJ0eSIsInNldFByb3BlcnR5QW5kRmlyZSIsImVudW1lcmFibGUiLCJwcm9wZXJ0eSIsIl9wcm9wZXJ0aWVzIiwib3duTmFtZXMiLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiY2hhbmdlcyIsIm9sZFZhbHVlIiwib25Qcm9wZXJ0aWVzQ2hhbmdlZCIsImJvb3RzdHJhcCQxIiwiTmF0aXZlTW9kdWxlIiwiZGVmaW5lTGF6eUJpbmRpbmciLCJUaXRhbml1bVdyYXBwZXIiLCJjb250ZXh0IiwiYmluZEludm9jYXRpb25BUElzIiwiV3JhcHBlciIsIndyYXBwZXJUaSIsIkV2ZW50RW1pdHRlckJvb3RzdHJhcCIsIlRBRyIsIkV2ZW50RW1pdHRlciIsImlzQXJyYXkiLCJBcnJheSIsImhhbmRsZXIiLCJkYXRhIiwiaGFuZGxlZCIsImNhbmNlbEJ1YmJsZSIsImV2ZW50IiwibGlzdGVuZXIiLCJ2aWV3IiwiREJHIiwibG9nIiwiYnViYmxlcyIsIl9maXJlU3luY0V2ZW50VG9QYXJlbnQiLCJhcmd1bWVudHMiLCJsaXN0ZW5lcnMiLCJfaGFzSmF2YUxpc3RlbmVyIiwiX29uRXZlbnRGaXJlZCIsImNhbGxIYW5kbGVyIiwibCIsImVtaXQiLCJsaXN0ZW5lcldyYXBwZXIiLCJfaGFzTGlzdGVuZXJzRm9yRXZlbnRUeXBlIiwiYWRkTGlzdGVuZXIiLCJnIiwicmVtb3ZlTGlzdGVuZXIiLCJvbiIsImxpc3QiLCJjb3VudCIsInBvc2l0aW9uIiwiTmF0aXZlTW9kdWxlQm9vdHN0cmFwIiwiX3NvdXJjZSIsIl9jYWNoZSIsImNhY2hlZCIsImdldENhY2hlZCIsImV4aXN0cyIsIm5hdGl2ZU1vZHVsZSIsImNvbXBpbGUiLCJnZXRTb3VyY2UiLCJmbiIsInRoaXNPYmplY3QiLCJvdGhlck9iamVjdCIsInZhcnMiLCJrZXlzIiwia2V5Iiwic3RhcnR1cCJdLCJtYXBwaW5ncyI6IkFBQUMsYUFBWTtBQUNaOztBQUVBO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0MsV0FBU0Esa0JBQVQsQ0FBNEJDLEdBQTVCLEVBQWlDQyxJQUFqQyxFQUF1Q0MsUUFBdkMsRUFBaUQ7QUFDL0MsVUFBTUMsSUFBSSxHQUFHLE9BQU9ILEdBQXBCOztBQUVBLFFBQUlHLElBQUksS0FBS0QsUUFBUSxDQUFDRSxXQUFULEVBQWIsRUFBcUM7QUFDbkMsWUFBTSxJQUFJQyxTQUFKLENBQWUsUUFB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LFdBQUssSUFBSWlCLENBQUMsR0FBRyxDQUFiLEVBQWdCQSxDQUFDLEdBQUdqQixNQUFwQixFQUE0QixFQUFFaUIsQ0FBOUIsRUFBaUM7QUFDL0IsY0FBTW1QLEdBQUcsR0FBR0QsSUFBSSxDQUFDbFAsQ0FBRCxDQUFoQjtBQUNBLGFBQUttUCxHQUFMLElBQVlGLElBQUksQ0FBQ0UsR0FBRCxDQUFoQjtBQUNEO0FBQ0Y7O0FBRUQsYUFBU0MsT0FBVCxHQUFtQjtBQUNqQnpOLE1BQUFBLE1BQU0sQ0FBQ0EsTUFBUCxHQUFnQkEsTUFBaEIsQ0FEaUIsQ0FDTzs7QUFFeEJBLE1BQUFBLE1BQU0sQ0FBQzZELEtBQVAsR0FBZUEsS0FBZixDQUhpQixDQUdLOztBQUV0QjtBQUNFQSxRQUFBQSxLQUFLLENBQUM0QixTQUFOLEdBQWtCQSxTQUFsQixDQURGLENBQytCO0FBQzdCOztBQUVBNUIsUUFBQUEsS0FBSyxDQUFDc0csWUFBTixHQUFxQnVDLHFCQUFxQixDQUFDMU0sTUFBRCxFQUFTNkQsS0FBVCxDQUExQyxDQUpGLENBSTZEO0FBQzNEO0FBQ0E7O0FBRUE2RyxRQUFBQSxxQkFBcUIsQ0FBQzFLLE1BQUQsRUFBUzZELEtBQVQsQ0FBckI7QUFDRDs7QUFFRDdELE1BQUFBLE1BQU0sQ0FBQ3dJLEVBQVAsR0FBWXhJLE1BQU0sQ0FBQ3VJLFFBQVAsR0FBa0IyQixXQUFXLENBQUNsSyxNQUFELEVBQVM2RCxLQUFULENBQXpDO0FBQ0E3RCxNQUFBQSxNQUFNLENBQUNtRSxNQUFQLEdBQWdCUCxXQUFXLENBQUM1RCxNQUFELEVBQVM2RCxLQUFULENBQTNCO0FBQ0Q7O0FBRUQ0SixJQUFBQSxPQUFPO0FBQ1I7O0FBRUQsU0FBT2xILFNBQVA7O0FBRUEsQ0FuK0RBLEdBQUQiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gKCkge1xuXHQndXNlIHN0cmljdCc7XG5cblx0LyoqXG5cdCAqIEBwYXJhbSAgeyp9IGFyZyBwYXNzZWQgaW4gYXJndW1lbnQgdmFsdWVcblx0ICogQHBhcmFtICB7c3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIGFyZ3VtZW50XG5cdCAqIEBwYXJhbSAge3N0cmluZ30gdHlwZW5hbWUgaS5lLiAnc3RyaW5nJywgJ0Z1bmN0aW9uJyAodmFsdWUgaXMgY29tcGFyZWQgdG8gdHlwZW9mIGFmdGVyIGxvd2VyY2FzaW5nKVxuXHQgKiBAcmV0dXJuIHt2b2lkfVxuXHQgKiBAdGhyb3dzIHtUeXBlRXJyb3J9XG5cdCAqL1xuXHRmdW5jdGlvbiBhc3NlcnRBcmd1bWVudFR5cGUoYXJnLCBuYW1lLCB0eXBlbmFtZSkge1xuXHQgIGNvbnN0IHR5cGUgPSB0eXBlb2YgYXJnO1xuXG5cdCAgaWYgKHR5cGUgIT09IHR5cGVuYW1lLnRvTG93ZXJDYXNlKCkpIHtcblx0ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFRoZSBcIiR7bmFtZX1cIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgJHt0eXBlbmFtZX0uIFJlY2VpdmVkIHR5cGUgJHt0eXBlfWApO1xuXHQgIH1cblx0fVxuXG5cdGNvbnN0IEZPUldBUkRfU0xBU0ggPSA0NzsgLy8gJy8nXG5cblx0Y29uc3QgQkFDS1dBUkRfU0xBU0ggPSA5MjsgLy8gJ1xcXFwnXG5cblx0LyoqXG5cdCAqIElzIHRoaXMgW2EtekEtWl0/XG5cdCAqIEBwYXJhbSAge251bWJlcn0gIGNoYXJDb2RlIHZhbHVlIGZyb20gU3RyaW5nLmNoYXJDb2RlQXQoKVxuXHQgKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgICBbZGVzY3JpcHRpb25dXG5cdCAqL1xuXG5cdGZ1bmN0aW9uIGlzV2luZG93c0RldmljZU5hbWUoY2hhckNvZGUpIHtcblx0ICByZXR1cm4gY2hhckNvZGUgPj0gNjUgJiYgY2hhckNvZGUgPD0gOTAgfHwgY2hhckNvZGUgPj0gOTcgJiYgY2hhckNvZGUgPD0gMTIyO1xuXHR9XG5cdC8qKlxuXHQgKiBbaXNBYnNvbHV0ZSBkZXNjcmlwdGlvbl1cblx0ICogQHBhcmFtICB7Ym9vbGVhbn0gaXNQb3NpeCB3aGV0aGVyIHRoaXMgaW1wbCBpcyBmb3IgUE9TSVggb3Igbm90XG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZmlsZXBhdGggICBpbnB1dCBmaWxlIHBhdGhcblx0ICogQHJldHVybiB7Qm9vbGVhbn0gICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblxuXG5cdGZ1bmN0aW9uIGlzQWJzb2x1dGUoaXNQb3NpeCwgZmlsZXBhdGgpIHtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUoZmlsZXBhdGgsICdwYXRoJywgJ3N0cmluZycpO1xuXHQgIGNvbnN0IGxlbmd0aCA9IGZpbGVwYXRoLmxlbmd0aDsgLy8gZW1wdHkgc3RyaW5nIHNwZWNpYWwgY2FzZVxuXG5cdCAgaWYgKGxlbmd0aCA9PT0gMCkge1xuXHQgICAgcmV0dXJuIGZhbHNlO1xuXHQgIH1cblxuXHQgIGNvbnN0IGZpcnN0Q2hhciA9IGZpbGVwYXRoLmNoYXJDb2RlQXQoMCk7XG5cblx0ICBpZiAoZmlyc3RDaGFyID09PSBGT1JXQVJEX1NMQVNIKSB7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9IC8vIHdlIGFscmVhZHkgZGlkIG91ciBjaGVja3MgZm9yIHBvc2l4XG5cblxuXHQgIGlmIChpc1Bvc2l4KSB7XG5cdCAgICByZXR1cm4gZmFsc2U7XG5cdCAgfSAvLyB3aW4zMiBmcm9tIGhlcmUgb24gb3V0XG5cblxuXHQgIGlmIChmaXJzdENoYXIgPT09IEJBQ0tXQVJEX1NMQVNIKSB7XG5cdCAgICByZXR1cm4gdHJ1ZTtcblx0ICB9XG5cblx0ICBpZiAobGVuZ3RoID4gMiAmJiBpc1dpbmRvd3NEZXZpY2VOYW1lKGZpcnN0Q2hhcikgJiYgZmlsZXBhdGguY2hhckF0KDEpID09PSAnOicpIHtcblx0ICAgIGNvbnN0IHRoaXJkQ2hhciA9IGZpbGVwYXRoLmNoYXJBdCgyKTtcblx0ICAgIHJldHVybiB0aGlyZENoYXIgPT09ICcvJyB8fCB0aGlyZENoYXIgPT09ICdcXFxcJztcblx0ICB9XG5cblx0ICByZXR1cm4gZmFsc2U7XG5cdH1cblx0LyoqXG5cdCAqIFtkaXJuYW1lIGRlc2NyaXB0aW9uXVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciAgcGxhdGZvcm0tc3BlY2lmaWMgZmlsZSBzZXBhcmF0b3Jcblx0ICogQHBhcmFtICB7c3RyaW5nfSBmaWxlcGF0aCAgIGlucHV0IGZpbGUgcGF0aFxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblxuXG5cdGZ1bmN0aW9uIGRpcm5hbWUoc2VwYXJhdG9yLCBmaWxlcGF0aCkge1xuXHQgIGFzc2VydEFyZ3VtZW50VHlwZShmaWxlcGF0aCwgJ3BhdGgnLCAnc3RyaW5nJyk7XG5cdCAgY29uc3QgbGVuZ3RoID0gZmlsZXBhdGgubGVuZ3RoO1xuXG5cdCAgaWYgKGxlbmd0aCA9PT0gMCkge1xuXHQgICAgcmV0dXJuICcuJztcblx0ICB9IC8vIGlnbm9yZSB0cmFpbGluZyBzZXBhcmF0b3JcblxuXG5cdCAgbGV0IGZyb21JbmRleCA9IGxlbmd0aCAtIDE7XG5cdCAgY29uc3QgaGFkVHJhaWxpbmcgPSBmaWxlcGF0aC5lbmRzV2l0aChzZXBhcmF0b3IpO1xuXG5cdCAgaWYgKGhhZFRyYWlsaW5nKSB7XG5cdCAgICBmcm9tSW5kZXgtLTtcblx0ICB9XG5cblx0ICBjb25zdCBmb3VuZEluZGV4ID0gZmlsZXBhdGgubGFzdEluZGV4T2Yoc2VwYXJhdG9yLCBmcm9tSW5kZXgpOyAvLyBubyBzZXBhcmF0b3JzXG5cblx0ICBpZiAoZm91bmRJbmRleCA9PT0gLTEpIHtcblx0ICAgIC8vIGhhbmRsZSBzcGVjaWFsIGNhc2Ugb2Ygcm9vdCB3aW5kb3dzIHBhdGhzXG5cdCAgICBpZiAobGVuZ3RoID49IDIgJiYgc2VwYXJhdG9yID09PSAnXFxcXCcgJiYgZmlsZXBhdGguY2hhckF0KDEpID09PSAnOicpIHtcblx0ICAgICAgY29uc3QgZmlyc3RDaGFyID0gZmlsZXBhdGguY2hhckNvZGVBdCgwKTtcblxuXHQgICAgICBpZiAoaXNXaW5kb3dzRGV2aWNlTmFtZShmaXJzdENoYXIpKSB7XG5cdCAgICAgICAgcmV0dXJuIGZpbGVwYXRoOyAvLyBpdCdzIGEgcm9vdCB3aW5kb3dzIHBhdGhcblx0ICAgICAgfVxuXHQgICAgfVxuXG5cdCAgICByZXR1cm4gJy4nO1xuXHQgIH0gLy8gb25seSBmb3VuZCByb290IHNlcGFyYXRvclxuXG5cblx0ICBpZiAoZm91bmRJbmRleCA9PT0gMCkge1xuXHQgICAgcmV0dXJuIHNlcGFyYXRvcjsgLy8gaWYgaXQgd2FzICcvJywgcmV0dXJuIHRoYXRcblx0ICB9IC8vIEhhbmRsZSBzcGVjaWFsIGNhc2Ugb2YgJy8vc29tZXRoaW5nJ1xuXG5cblx0ICBpZiAoZm91bmRJbmRleCA9PT0gMSAmJiBzZXBhcmF0b3IgPT09ICcvJyAmJiBmaWxlcGF0aC5jaGFyQXQoMCkgPT09ICcvJykge1xuXHQgICAgcmV0dXJuICcvLyc7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGZpbGVwYXRoLnNsaWNlKDAsIGZvdW5kSW5kZXgpO1xuXHR9XG5cdC8qKlxuXHQgKiBbZXh0bmFtZSBkZXNjcmlwdGlvbl1cblx0ICogQHBhcmFtICB7c3RyaW5nfSBzZXBhcmF0b3IgIHBsYXRmb3JtLXNwZWNpZmljIGZpbGUgc2VwYXJhdG9yXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZmlsZXBhdGggICBpbnB1dCBmaWxlIHBhdGhcblx0ICogQHJldHVybiB7c3RyaW5nfSAgICAgICAgICAgIFtkZXNjcmlwdGlvbl1cblx0ICovXG5cblxuXHRmdW5jdGlvbiBleHRuYW1lKHNlcGFyYXRvciwgZmlsZXBhdGgpIHtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUoZmlsZXBhdGgsICdwYXRoJywgJ3N0cmluZycpO1xuXHQgIGNvbnN0IGluZGV4ID0gZmlsZXBhdGgubGFzdEluZGV4T2YoJy4nKTtcblxuXHQgIGlmIChpbmRleCA9PT0gLTEgfHwgaW5kZXggPT09IDApIHtcblx0ICAgIHJldHVybiAnJztcblx0ICB9IC8vIGlnbm9yZSB0cmFpbGluZyBzZXBhcmF0b3JcblxuXG5cdCAgbGV0IGVuZEluZGV4ID0gZmlsZXBhdGgubGVuZ3RoO1xuXG5cdCAgaWYgKGZpbGVwYXRoLmVuZHNXaXRoKHNlcGFyYXRvcikpIHtcblx0ICAgIGVuZEluZGV4LS07XG5cdCAgfVxuXG5cdCAgcmV0dXJuIGZpbGVwYXRoLnNsaWNlKGluZGV4LCBlbmRJbmRleCk7XG5cdH1cblxuXHRmdW5jdGlvbiBsYXN0SW5kZXhXaW4zMlNlcGFyYXRvcihmaWxlcGF0aCwgaW5kZXgpIHtcblx0ICBmb3IgKGxldCBpID0gaW5kZXg7IGkgPj0gMDsgaS0tKSB7XG5cdCAgICBjb25zdCBjaGFyID0gZmlsZXBhdGguY2hhckNvZGVBdChpKTtcblxuXHQgICAgaWYgKGNoYXIgPT09IEJBQ0tXQVJEX1NMQVNIIHx8IGNoYXIgPT09IEZPUldBUkRfU0xBU0gpIHtcblx0ICAgICAgcmV0dXJuIGk7XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgcmV0dXJuIC0xO1xuXHR9XG5cdC8qKlxuXHQgKiBbYmFzZW5hbWUgZGVzY3JpcHRpb25dXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gc2VwYXJhdG9yICBwbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHNlcGFyYXRvclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGZpbGVwYXRoICAgaW5wdXQgZmlsZSBwYXRoXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gW2V4dF0gICAgICBmaWxlIGV4dGVuc2lvbiB0byBkcm9wIGlmIGl0IGV4aXN0c1xuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblxuXG5cdGZ1bmN0aW9uIGJhc2VuYW1lKHNlcGFyYXRvciwgZmlsZXBhdGgsIGV4dCkge1xuXHQgIGFzc2VydEFyZ3VtZW50VHlwZShmaWxlcGF0aCwgJ3BhdGgnLCAnc3RyaW5nJyk7XG5cblx0ICBpZiAoZXh0ICE9PSB1bmRlZmluZWQpIHtcblx0ICAgIGFzc2VydEFyZ3VtZW50VHlwZShleHQsICdleHQnLCAnc3RyaW5nJyk7XG5cdCAgfVxuXG5cdCAgY29uc3QgbGVuZ3RoID0gZmlsZXBhdGgubGVuZ3RoO1xuXG5cdCAgaWYgKGxlbmd0aCA9PT0gMCkge1xuXHQgICAgcmV0dXJuICcnO1xuXHQgIH1cblxuXHQgIGNvbnN0IGlzUG9zaXggPSBzZXBhcmF0b3IgPT09ICcvJztcblx0ICBsZXQgZW5kSW5kZXggPSBsZW5ndGg7IC8vIGRyb3AgdHJhaWxpbmcgc2VwYXJhdG9yIChpZiB0aGVyZSBpcyBvbmUpXG5cblx0ICBjb25zdCBsYXN0Q2hhckNvZGUgPSBmaWxlcGF0aC5jaGFyQ29kZUF0KGxlbmd0aCAtIDEpO1xuXG5cdCAgaWYgKGxhc3RDaGFyQ29kZSA9PT0gRk9SV0FSRF9TTEFTSCB8fCAhaXNQb3NpeCAmJiBsYXN0Q2hhckNvZGUgPT09IEJBQ0tXQVJEX1NMQVNIKSB7XG5cdCAgICBlbmRJbmRleC0tO1xuXHQgIH0gLy8gRmluZCBsYXN0IG9jY3VyZW5jZSBvZiBzZXBhcmF0b3JcblxuXG5cdCAgbGV0IGxhc3RJbmRleCA9IC0xO1xuXG5cdCAgaWYgKGlzUG9zaXgpIHtcblx0ICAgIGxhc3RJbmRleCA9IGZpbGVwYXRoLmxhc3RJbmRleE9mKHNlcGFyYXRvciwgZW5kSW5kZXggLSAxKTtcblx0ICB9IGVsc2Uge1xuXHQgICAgLy8gT24gd2luMzIsIGhhbmRsZSAqZWl0aGVyKiBzZXBhcmF0b3IhXG5cdCAgICBsYXN0SW5kZXggPSBsYXN0SW5kZXhXaW4zMlNlcGFyYXRvcihmaWxlcGF0aCwgZW5kSW5kZXggLSAxKTsgLy8gaGFuZGxlIHNwZWNpYWwgY2FzZSBvZiByb290IHBhdGggbGlrZSAnQzonIG9yICdDOlxcXFwnXG5cblx0ICAgIGlmICgobGFzdEluZGV4ID09PSAyIHx8IGxhc3RJbmRleCA9PT0gLTEpICYmIGZpbGVwYXRoLmNoYXJBdCgxKSA9PT0gJzonICYmIGlzV2luZG93c0RldmljZU5hbWUoZmlsZXBhdGguY2hhckNvZGVBdCgwKSkpIHtcblx0ICAgICAgcmV0dXJuICcnO1xuXHQgICAgfVxuXHQgIH0gLy8gVGFrZSBmcm9tIGxhc3Qgb2NjdXJyZW5jZSBvZiBzZXBhcmF0b3IgdG8gZW5kIG9mIHN0cmluZyAob3IgYmVnaW5uaW5nIHRvIGVuZCBpZiBub3QgZm91bmQpXG5cblxuXHQgIGNvbnN0IGJhc2UgPSBmaWxlcGF0aC5zbGljZShsYXN0SW5kZXggKyAxLCBlbmRJbmRleCk7IC8vIGRyb3AgdHJhaWxpbmcgZXh0ZW5zaW9uIChpZiBzcGVjaWZpZWQpXG5cblx0ICBpZiAoZXh0ID09PSB1bmRlZmluZWQpIHtcblx0ICAgIHJldHVybiBiYXNlO1xuXHQgIH1cblxuXHQgIHJldHVybiBiYXNlLmVuZHNXaXRoKGV4dCkgPyBiYXNlLnNsaWNlKDAsIGJhc2UubGVuZ3RoIC0gZXh0Lmxlbmd0aCkgOiBiYXNlO1xuXHR9XG5cdC8qKlxuXHQgKiBUaGUgYHBhdGgubm9ybWFsaXplKClgIG1ldGhvZCBub3JtYWxpemVzIHRoZSBnaXZlbiBwYXRoLCByZXNvbHZpbmcgJy4uJyBhbmQgJy4nIHNlZ21lbnRzLlxuXHQgKlxuXHQgKiBXaGVuIG11bHRpcGxlLCBzZXF1ZW50aWFsIHBhdGggc2VnbWVudCBzZXBhcmF0aW9uIGNoYXJhY3RlcnMgYXJlIGZvdW5kIChlLmcuXG5cdCAqIC8gb24gUE9TSVggYW5kIGVpdGhlciBcXCBvciAvIG9uIFdpbmRvd3MpLCB0aGV5IGFyZSByZXBsYWNlZCBieSBhIHNpbmdsZVxuXHQgKiBpbnN0YW5jZSBvZiB0aGUgcGxhdGZvcm0tc3BlY2lmaWMgcGF0aCBzZWdtZW50IHNlcGFyYXRvciAoLyBvbiBQT1NJWCBhbmQgXFxcblx0ICogb24gV2luZG93cykuIFRyYWlsaW5nIHNlcGFyYXRvcnMgYXJlIHByZXNlcnZlZC5cblx0ICpcblx0ICogSWYgdGhlIHBhdGggaXMgYSB6ZXJvLWxlbmd0aCBzdHJpbmcsICcuJyBpcyByZXR1cm5lZCwgcmVwcmVzZW50aW5nIHRoZVxuXHQgKiBjdXJyZW50IHdvcmtpbmcgZGlyZWN0b3J5LlxuXHQgKlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciAgcGxhdGZvcm0tc3BlY2lmaWMgZmlsZSBzZXBhcmF0b3Jcblx0ICogQHBhcmFtICB7c3RyaW5nfSBmaWxlcGF0aCAgaW5wdXQgZmlsZSBwYXRoXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblxuXG5cdGZ1bmN0aW9uIG5vcm1hbGl6ZShzZXBhcmF0b3IsIGZpbGVwYXRoKSB7XG5cdCAgYXNzZXJ0QXJndW1lbnRUeXBlKGZpbGVwYXRoLCAncGF0aCcsICdzdHJpbmcnKTtcblxuXHQgIGlmIChmaWxlcGF0aC5sZW5ndGggPT09IDApIHtcblx0ICAgIHJldHVybiAnLic7XG5cdCAgfSAvLyBXaW5kb3dzIGNhbiBoYW5kbGUgJy8nIG9yICdcXFxcJyBhbmQgYm90aCBzaG91bGQgYmUgdHVybmVkIGludG8gc2VwYXJhdG9yXG5cblxuXHQgIGNvbnN0IGlzV2luZG93cyA9IHNlcGFyYXRvciA9PT0gJ1xcXFwnO1xuXG5cdCAgaWYgKGlzV2luZG93cykge1xuXHQgICAgZmlsZXBhdGggPSBmaWxlcGF0aC5yZXBsYWNlKC9cXC8vZywgc2VwYXJhdG9yKTtcblx0ICB9XG5cblx0ICBjb25zdCBoYWRMZWFkaW5nID0gZmlsZXBhdGguc3RhcnRzV2l0aChzZXBhcmF0b3IpOyAvLyBPbiBXaW5kb3dzLCBuZWVkIHRvIGhhbmRsZSBVTkMgcGF0aHMgKFxcXFxob3N0LW5hbWVcXFxccmVzb3VyY2VcXFxcZGlyKSBzcGVjaWFsIHRvIHJldGFpbiBsZWFkaW5nIGRvdWJsZSBiYWNrc2xhc2hcblxuXHQgIGNvbnN0IGlzVU5DID0gaGFkTGVhZGluZyAmJiBpc1dpbmRvd3MgJiYgZmlsZXBhdGgubGVuZ3RoID4gMiAmJiBmaWxlcGF0aC5jaGFyQXQoMSkgPT09ICdcXFxcJztcblx0ICBjb25zdCBoYWRUcmFpbGluZyA9IGZpbGVwYXRoLmVuZHNXaXRoKHNlcGFyYXRvcik7XG5cdCAgY29uc3QgcGFydHMgPSBmaWxlcGF0aC5zcGxpdChzZXBhcmF0b3IpO1xuXHQgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG5cdCAgZm9yIChjb25zdCBzZWdtZW50IG9mIHBhcnRzKSB7XG5cdCAgICBpZiAoc2VnbWVudC5sZW5ndGggIT09IDAgJiYgc2VnbWVudCAhPT0gJy4nKSB7XG5cdCAgICAgIGlmIChzZWdtZW50ID09PSAnLi4nKSB7XG5cdCAgICAgICAgcmVzdWx0LnBvcCgpOyAvLyBGSVhNRTogV2hhdCBpZiB0aGlzIGdvZXMgYWJvdmUgcm9vdD8gU2hvdWxkIHdlIHRocm93IGFuIGVycm9yP1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICAgIHJlc3VsdC5wdXNoKHNlZ21lbnQpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgfVxuXG5cdCAgbGV0IG5vcm1hbGl6ZWQgPSBoYWRMZWFkaW5nID8gc2VwYXJhdG9yIDogJyc7XG5cdCAgbm9ybWFsaXplZCArPSByZXN1bHQuam9pbihzZXBhcmF0b3IpO1xuXG5cdCAgaWYgKGhhZFRyYWlsaW5nKSB7XG5cdCAgICBub3JtYWxpemVkICs9IHNlcGFyYXRvcjtcblx0ICB9XG5cblx0ICBpZiAoaXNVTkMpIHtcblx0ICAgIG5vcm1hbGl6ZWQgPSAnXFxcXCcgKyBub3JtYWxpemVkO1xuXHQgIH1cblxuXHQgIHJldHVybiBub3JtYWxpemVkO1xuXHR9XG5cdC8qKlxuXHQgKiBbYXNzZXJ0U2VnbWVudCBkZXNjcmlwdGlvbl1cblx0ICogQHBhcmFtICB7Kn0gc2VnbWVudCBbZGVzY3JpcHRpb25dXG5cdCAqIEByZXR1cm4ge3ZvaWR9ICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgKi9cblxuXG5cdGZ1bmN0aW9uIGFzc2VydFNlZ21lbnQoc2VnbWVudCkge1xuXHQgIGlmICh0eXBlb2Ygc2VnbWVudCAhPT0gJ3N0cmluZycpIHtcblx0ICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFBhdGggbXVzdCBiZSBhIHN0cmluZy4gUmVjZWl2ZWQgJHtzZWdtZW50fWApO1xuXHQgIH1cblx0fVxuXHQvKipcblx0ICogVGhlIGBwYXRoLmpvaW4oKWAgbWV0aG9kIGpvaW5zIGFsbCBnaXZlbiBwYXRoIHNlZ21lbnRzIHRvZ2V0aGVyIHVzaW5nIHRoZVxuXHQgKiBwbGF0Zm9ybS1zcGVjaWZpYyBzZXBhcmF0b3IgYXMgYSBkZWxpbWl0ZXIsIHRoZW4gbm9ybWFsaXplcyB0aGUgcmVzdWx0aW5nIHBhdGguXG5cdCAqIFplcm8tbGVuZ3RoIHBhdGggc2VnbWVudHMgYXJlIGlnbm9yZWQuIElmIHRoZSBqb2luZWQgcGF0aCBzdHJpbmcgaXMgYSB6ZXJvLVxuXHQgKiBsZW5ndGggc3RyaW5nIHRoZW4gJy4nIHdpbGwgYmUgcmV0dXJuZWQsIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS5cblx0ICogQHBhcmFtICB7c3RyaW5nfSBzZXBhcmF0b3IgcGxhdGZvcm0tc3BlY2lmaWMgZmlsZSBzZXBhcmF0b3Jcblx0ICogQHBhcmFtICB7c3RyaW5nW119IHBhdGhzIFtkZXNjcmlwdGlvbl1cblx0ICogQHJldHVybiB7c3RyaW5nfSAgICAgICBUaGUgam9pbmVkIGZpbGVwYXRoXG5cdCAqL1xuXG5cblx0ZnVuY3Rpb24gam9pbihzZXBhcmF0b3IsIHBhdGhzKSB7XG5cdCAgY29uc3QgcmVzdWx0ID0gW107IC8vIG5haXZlIGltcGw6IGp1c3Qgam9pbiBhbGwgdGhlIHBhdGhzIHdpdGggc2VwYXJhdG9yXG5cblx0ICBmb3IgKGNvbnN0IHNlZ21lbnQgb2YgcGF0aHMpIHtcblx0ICAgIGFzc2VydFNlZ21lbnQoc2VnbWVudCk7XG5cblx0ICAgIGlmIChzZWdtZW50Lmxlbmd0aCAhPT0gMCkge1xuXHQgICAgICByZXN1bHQucHVzaChzZWdtZW50KTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICByZXR1cm4gbm9ybWFsaXplKHNlcGFyYXRvciwgcmVzdWx0LmpvaW4oc2VwYXJhdG9yKSk7XG5cdH1cblx0LyoqXG5cdCAqIFRoZSBgcGF0aC5yZXNvbHZlKClgIG1ldGhvZCByZXNvbHZlcyBhIHNlcXVlbmNlIG9mIHBhdGhzIG9yIHBhdGggc2VnbWVudHMgaW50byBhbiBhYnNvbHV0ZSBwYXRoLlxuXHQgKlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciBwbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHNlcGFyYXRvclxuXHQgKiBAcGFyYW0gIHtzdHJpbmdbXX0gcGF0aHMgW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgIFtkZXNjcmlwdGlvbl1cblx0ICovXG5cblxuXHRmdW5jdGlvbiByZXNvbHZlKHNlcGFyYXRvciwgcGF0aHMpIHtcblx0ICBsZXQgcmVzb2x2ZWQgPSAnJztcblx0ICBsZXQgaGl0Um9vdCA9IGZhbHNlO1xuXHQgIGNvbnN0IGlzUG9zaXggPSBzZXBhcmF0b3IgPT09ICcvJzsgLy8gZ28gZnJvbSByaWdodCB0byBsZWZ0IHVudGlsIHdlIGhpdCBhYnNvbHV0ZSBwYXRoL3Jvb3RcblxuXHQgIGZvciAobGV0IGkgPSBwYXRocy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuXHQgICAgY29uc3Qgc2VnbWVudCA9IHBhdGhzW2ldO1xuXHQgICAgYXNzZXJ0U2VnbWVudChzZWdtZW50KTtcblxuXHQgICAgaWYgKHNlZ21lbnQubGVuZ3RoID09PSAwKSB7XG5cdCAgICAgIGNvbnRpbnVlOyAvLyBza2lwIGVtcHR5XG5cdCAgICB9XG5cblx0ICAgIHJlc29sdmVkID0gc2VnbWVudCArIHNlcGFyYXRvciArIHJlc29sdmVkOyAvLyBwcmVwZW5kIG5ldyBzZWdtZW50XG5cblx0ICAgIGlmIChpc0Fic29sdXRlKGlzUG9zaXgsIHNlZ21lbnQpKSB7XG5cdCAgICAgIC8vIGhhdmUgd2UgYmFja2VkIGludG8gYW4gYWJzb2x1dGUgcGF0aD9cblx0ICAgICAgaGl0Um9vdCA9IHRydWU7XG5cdCAgICAgIGJyZWFrO1xuXHQgICAgfVxuXHQgIH0gLy8gaWYgd2UgZGlkbid0IGhpdCByb290LCBwcmVwZW5kIGN3ZFxuXG5cblx0ICBpZiAoIWhpdFJvb3QpIHtcblx0ICAgIHJlc29sdmVkID0gKGdsb2JhbC5wcm9jZXNzID8gcHJvY2Vzcy5jd2QoKSA6ICcvJykgKyBzZXBhcmF0b3IgKyByZXNvbHZlZDtcblx0ICB9XG5cblx0ICBjb25zdCBub3JtYWxpemVkID0gbm9ybWFsaXplKHNlcGFyYXRvciwgcmVzb2x2ZWQpO1xuXG5cdCAgaWYgKG5vcm1hbGl6ZWQuY2hhckF0KG5vcm1hbGl6ZWQubGVuZ3RoIC0gMSkgPT09IHNlcGFyYXRvcikge1xuXHQgICAgLy8gRklYTUU6IEhhbmRsZSBVTkMgcGF0aHMgb24gV2luZG93cyBhcyB3ZWxsLCBzbyB3ZSBkb24ndCB0cmltIHRyYWlsaW5nIHNlcGFyYXRvciBvbiBzb21ldGhpbmcgbGlrZSAnXFxcXFxcXFxob3N0LW5hbWVcXFxccmVzb3VyY2VcXFxcJ1xuXHQgICAgLy8gRG9uJ3QgcmVtb3ZlIHRyYWlsaW5nIHNlcGFyYXRvciBpZiB0aGlzIGlzIHJvb3QgcGF0aCBvbiB3aW5kb3dzIVxuXHQgICAgaWYgKCFpc1Bvc2l4ICYmIG5vcm1hbGl6ZWQubGVuZ3RoID09PSAzICYmIG5vcm1hbGl6ZWQuY2hhckF0KDEpID09PSAnOicgJiYgaXNXaW5kb3dzRGV2aWNlTmFtZShub3JtYWxpemVkLmNoYXJDb2RlQXQoMCkpKSB7XG5cdCAgICAgIHJldHVybiBub3JtYWxpemVkO1xuXHQgICAgfSAvLyBvdGhlcndpc2UgdHJpbSB0cmFpbGluZyBzZXBhcmF0b3JcblxuXG5cdCAgICByZXR1cm4gbm9ybWFsaXplZC5zbGljZSgwLCBub3JtYWxpemVkLmxlbmd0aCAtIDEpO1xuXHQgIH1cblxuXHQgIHJldHVybiBub3JtYWxpemVkO1xuXHR9XG5cdC8qKlxuXHQgKiBUaGUgYHBhdGgucmVsYXRpdmUoKWAgbWV0aG9kIHJldHVybnMgdGhlIHJlbGF0aXZlIHBhdGggYGZyb21gIGZyb20gdG8gYHRvYCBiYXNlZFxuXHQgKiBvbiB0aGUgY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeS4gSWYgZnJvbSBhbmQgdG8gZWFjaCByZXNvbHZlIHRvIHRoZSBzYW1lXG5cdCAqIHBhdGggKGFmdGVyIGNhbGxpbmcgYHBhdGgucmVzb2x2ZSgpYCBvbiBlYWNoKSwgYSB6ZXJvLWxlbmd0aCBzdHJpbmcgaXMgcmV0dXJuZWQuXG5cdCAqXG5cdCAqIElmIGEgemVyby1sZW5ndGggc3RyaW5nIGlzIHBhc3NlZCBhcyBgZnJvbWAgb3IgYHRvYCwgdGhlIGN1cnJlbnQgd29ya2luZyBkaXJlY3Rvcnlcblx0ICogd2lsbCBiZSB1c2VkIGluc3RlYWQgb2YgdGhlIHplcm8tbGVuZ3RoIHN0cmluZ3MuXG5cdCAqXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gc2VwYXJhdG9yIHBsYXRmb3JtLXNwZWNpZmljIGZpbGUgc2VwYXJhdG9yXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZnJvbSBbZGVzY3JpcHRpb25dXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gdG8gICBbZGVzY3JpcHRpb25dXG5cdCAqIEByZXR1cm4ge3N0cmluZ30gICAgICBbZGVzY3JpcHRpb25dXG5cdCAqL1xuXG5cblx0ZnVuY3Rpb24gcmVsYXRpdmUoc2VwYXJhdG9yLCBmcm9tLCB0bykge1xuXHQgIGFzc2VydEFyZ3VtZW50VHlwZShmcm9tLCAnZnJvbScsICdzdHJpbmcnKTtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUodG8sICd0bycsICdzdHJpbmcnKTtcblxuXHQgIGlmIChmcm9tID09PSB0bykge1xuXHQgICAgcmV0dXJuICcnO1xuXHQgIH1cblxuXHQgIGZyb20gPSByZXNvbHZlKHNlcGFyYXRvciwgW2Zyb21dKTtcblx0ICB0byA9IHJlc29sdmUoc2VwYXJhdG9yLCBbdG9dKTtcblxuXHQgIGlmIChmcm9tID09PSB0bykge1xuXHQgICAgcmV0dXJuICcnO1xuXHQgIH0gLy8gd2Ugbm93IGhhdmUgdHdvIGFic29sdXRlIHBhdGhzLFxuXHQgIC8vIGxldHMgXCJnbyB1cFwiIGZyb20gYGZyb21gIHVudGlsIHdlIHJlYWNoIGNvbW1vbiBiYXNlIGRpciBvZiBgdG9gXG5cdCAgLy8gY29uc3Qgb3JpZ2luYWxGcm9tID0gZnJvbTtcblxuXG5cdCAgbGV0IHVwQ291bnQgPSAwO1xuXHQgIGxldCByZW1haW5pbmdQYXRoID0gJyc7XG5cblx0ICB3aGlsZSAodHJ1ZSkge1xuXHQgICAgaWYgKHRvLnN0YXJ0c1dpdGgoZnJvbSkpIHtcblx0ICAgICAgLy8gbWF0Y2ghIHJlY29yZCByZXN0Li4uP1xuXHQgICAgICByZW1haW5pbmdQYXRoID0gdG8uc2xpY2UoZnJvbS5sZW5ndGgpO1xuXHQgICAgICBicmVhaztcblx0ICAgIH0gLy8gRklYTUU6IEJyZWFrL3Rocm93IGlmIHdlIGhpdCBiYWQgZWRnZSBjYXNlIG9mIG5vIGNvbW1vbiByb290IVxuXG5cblx0ICAgIGZyb20gPSBkaXJuYW1lKHNlcGFyYXRvciwgZnJvbSk7XG5cdCAgICB1cENvdW50Kys7XG5cdCAgfSAvLyByZW1vdmUgbGVhZGluZyBzZXBhcmF0b3IgZnJvbSByZW1haW5pbmdQYXRoIGlmIHRoZXJlIGlzIGFueVxuXG5cblx0ICBpZiAocmVtYWluaW5nUGF0aC5sZW5ndGggPiAwKSB7XG5cdCAgICByZW1haW5pbmdQYXRoID0gcmVtYWluaW5nUGF0aC5zbGljZSgxKTtcblx0ICB9XG5cblx0ICByZXR1cm4gKCcuLicgKyBzZXBhcmF0b3IpLnJlcGVhdCh1cENvdW50KSArIHJlbWFpbmluZ1BhdGg7XG5cdH1cblx0LyoqXG5cdCAqIFRoZSBgcGF0aC5wYXJzZSgpYCBtZXRob2QgcmV0dXJucyBhbiBvYmplY3Qgd2hvc2UgcHJvcGVydGllcyByZXByZXNlbnRcblx0ICogc2lnbmlmaWNhbnQgZWxlbWVudHMgb2YgdGhlIHBhdGguIFRyYWlsaW5nIGRpcmVjdG9yeSBzZXBhcmF0b3JzIGFyZSBpZ25vcmVkLFxuXHQgKiBzZWUgYHBhdGguc2VwYC5cblx0ICpcblx0ICogVGhlIHJldHVybmVkIG9iamVjdCB3aWxsIGhhdmUgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuXHQgKlxuXHQgKiAtIGRpciA8c3RyaW5nPlxuXHQgKiAtIHJvb3QgPHN0cmluZz5cblx0ICogLSBiYXNlIDxzdHJpbmc+XG5cdCAqIC0gbmFtZSA8c3RyaW5nPlxuXHQgKiAtIGV4dCA8c3RyaW5nPlxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHNlcGFyYXRvciBwbGF0Zm9ybS1zcGVjaWZpYyBmaWxlIHNlcGFyYXRvclxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IGZpbGVwYXRoIFtkZXNjcmlwdGlvbl1cblx0ICogQHJldHVybiB7b2JqZWN0fVxuXHQgKi9cblxuXG5cdGZ1bmN0aW9uIHBhcnNlKHNlcGFyYXRvciwgZmlsZXBhdGgpIHtcblx0ICBhc3NlcnRBcmd1bWVudFR5cGUoZmlsZXBhdGgsICdwYXRoJywgJ3N0cmluZycpO1xuXHQgIGNvbnN0IHJlc3VsdCA9IHtcblx0ICAgIHJvb3Q6ICcnLFxuXHQgICAgZGlyOiAnJyxcblx0ICAgIGJhc2U6ICcnLFxuXHQgICAgZXh0OiAnJyxcblx0ICAgIG5hbWU6ICcnXG5cdCAgfTtcblx0ICBjb25zdCBsZW5ndGggPSBmaWxlcGF0aC5sZW5ndGg7XG5cblx0ICBpZiAobGVuZ3RoID09PSAwKSB7XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHQgIH0gLy8gQ2hlYXQgYW5kIGp1c3QgY2FsbCBvdXIgb3RoZXIgbWV0aG9kcyBmb3IgZGlybmFtZS9iYXNlbmFtZS9leHRuYW1lP1xuXG5cblx0ICByZXN1bHQuYmFzZSA9IGJhc2VuYW1lKHNlcGFyYXRvciwgZmlsZXBhdGgpO1xuXHQgIHJlc3VsdC5leHQgPSBleHRuYW1lKHNlcGFyYXRvciwgcmVzdWx0LmJhc2UpO1xuXHQgIGNvbnN0IGJhc2VMZW5ndGggPSByZXN1bHQuYmFzZS5sZW5ndGg7XG5cdCAgcmVzdWx0Lm5hbWUgPSByZXN1bHQuYmFzZS5zbGljZSgwLCBiYXNlTGVuZ3RoIC0gcmVzdWx0LmV4dC5sZW5ndGgpO1xuXHQgIGNvbnN0IHRvU3VidHJhY3QgPSBiYXNlTGVuZ3RoID09PSAwID8gMCA6IGJhc2VMZW5ndGggKyAxO1xuXHQgIHJlc3VsdC5kaXIgPSBmaWxlcGF0aC5zbGljZSgwLCBmaWxlcGF0aC5sZW5ndGggLSB0b1N1YnRyYWN0KTsgLy8gZHJvcCB0cmFpbGluZyBzZXBhcmF0b3IhXG5cblx0ICBjb25zdCBmaXJzdENoYXJDb2RlID0gZmlsZXBhdGguY2hhckNvZGVBdCgwKTsgLy8gYm90aCB3aW4zMiBhbmQgUE9TSVggcmV0dXJuICcvJyByb290XG5cblx0ICBpZiAoZmlyc3RDaGFyQ29kZSA9PT0gRk9SV0FSRF9TTEFTSCkge1xuXHQgICAgcmVzdWx0LnJvb3QgPSAnLyc7XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHQgIH0gLy8gd2UncmUgZG9uZSB3aXRoIFBPU0lYLi4uXG5cblxuXHQgIGlmIChzZXBhcmF0b3IgPT09ICcvJykge1xuXHQgICAgcmV0dXJuIHJlc3VsdDtcblx0ICB9IC8vIGZvciB3aW4zMi4uLlxuXG5cblx0ICBpZiAoZmlyc3RDaGFyQ29kZSA9PT0gQkFDS1dBUkRfU0xBU0gpIHtcblx0ICAgIC8vIEZJWE1FOiBIYW5kbGUgVU5DIHBhdGhzIGxpa2UgJ1xcXFxcXFxcaG9zdC1uYW1lXFxcXHJlc291cmNlXFxcXGZpbGVfcGF0aCdcblx0ICAgIC8vIG5lZWQgdG8gcmV0YWluICdcXFxcXFxcXGhvc3QtbmFtZVxcXFxyZXNvdXJjZVxcXFwnIGFzIHJvb3QgaW4gdGhhdCBjYXNlIVxuXHQgICAgcmVzdWx0LnJvb3QgPSAnXFxcXCc7XG5cdCAgICByZXR1cm4gcmVzdWx0O1xuXHQgIH0gLy8gY2hlY2sgZm9yIEM6IHN0eWxlIHJvb3RcblxuXG5cdCAgaWYgKGxlbmd0aCA+IDEgJiYgaXNXaW5kb3dzRGV2aWNlTmFtZShmaXJzdENoYXJDb2RlKSAmJiBmaWxlcGF0aC5jaGFyQXQoMSkgPT09ICc6Jykge1xuXHQgICAgaWYgKGxlbmd0aCA+IDIpIHtcblx0ICAgICAgLy8gaXMgaXQgbGlrZSBDOlxcXFw/XG5cdCAgICAgIGNvbnN0IHRoaXJkQ2hhckNvZGUgPSBmaWxlcGF0aC5jaGFyQ29kZUF0KDIpO1xuXG5cdCAgICAgIGlmICh0aGlyZENoYXJDb2RlID09PSBGT1JXQVJEX1NMQVNIIHx8IHRoaXJkQ2hhckNvZGUgPT09IEJBQ0tXQVJEX1NMQVNIKSB7XG5cdCAgICAgICAgcmVzdWx0LnJvb3QgPSBmaWxlcGF0aC5zbGljZSgwLCAzKTtcblx0ICAgICAgICByZXR1cm4gcmVzdWx0O1xuXHQgICAgICB9XG5cdCAgICB9IC8vIG5vcGUsIGp1c3QgQzosIG5vIHRyYWlsaW5nIHNlcGFyYXRvclxuXG5cblx0ICAgIHJlc3VsdC5yb290ID0gZmlsZXBhdGguc2xpY2UoMCwgMik7XG5cdCAgfVxuXG5cdCAgcmV0dXJuIHJlc3VsdDtcblx0fVxuXHQvKipcblx0ICogVGhlIGBwYXRoLmZvcm1hdCgpYCBtZXRob2QgcmV0dXJucyBhIHBhdGggc3RyaW5nIGZyb20gYW4gb2JqZWN0LiBUaGlzIGlzIHRoZVxuXHQgKiBvcHBvc2l0ZSBvZiBgcGF0aC5wYXJzZSgpYC5cblx0ICpcblx0ICogQHBhcmFtICB7c3RyaW5nfSBzZXBhcmF0b3IgcGxhdGZvcm0tc3BlY2lmaWMgZmlsZSBzZXBhcmF0b3Jcblx0ICogQHBhcmFtICB7b2JqZWN0fSBwYXRoT2JqZWN0IG9iamVjdCBvZiBmb3JtYXQgcmV0dXJuZWQgYnkgYHBhdGgucGFyc2UoKWBcblx0ICogQHBhcmFtICB7c3RyaW5nfSBwYXRoT2JqZWN0LmRpciBkaXJlY3RvcnkgbmFtZVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHBhdGhPYmplY3Qucm9vdCBmaWxlIHJvb3QgZGlyLCBpZ25vcmVkIGlmIGBwYXRoT2JqZWN0LmRpcmAgaXMgcHJvdmlkZWRcblx0ICogQHBhcmFtICB7c3RyaW5nfSBwYXRoT2JqZWN0LmJhc2UgZmlsZSBiYXNlbmFtZVxuXHQgKiBAcGFyYW0gIHtzdHJpbmd9IHBhdGhPYmplY3QubmFtZSBiYXNlbmFtZSBtaW51cyBleHRlbnNpb24sIGlnbm9yZWQgaWYgYHBhdGhPYmplY3QuYmFzZWAgZXhpc3RzXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gcGF0aE9iamVjdC5leHQgZmlsZSBleHRlbnNpb24sIGlnbm9yZWQgaWYgYHBhdGhPYmplY3QuYmFzZWAgZXhpc3RzXG5cdCAqIEByZXR1cm4ge3N0cmluZ31cblx0ICovXG5cblxuXHRmdW5jdGlvbiBmb3JtYXQoc2VwYXJhdG9yLCBwYXRoT2JqZWN0KSB7XG5cdCAgYXNzZXJ0QXJndW1lbnRUeXBlKHBhdGhPYmplY3QsICdwYXRoT2JqZWN0JywgJ29iamVjdCcpO1xuXHQgIGNvbnN0IGJhc2UgPSBwYXRoT2JqZWN0LmJhc2UgfHwgYCR7cGF0aE9iamVjdC5uYW1lIHx8ICcnfSR7cGF0aE9iamVjdC5leHQgfHwgJyd9YDsgLy8gYXBwZW5kIGJhc2UgdG8gcm9vdCBpZiBgZGlyYCB3YXNuJ3Qgc3BlY2lmaWVkLCBvciBpZlxuXHQgIC8vIGRpciBpcyB0aGUgcm9vdFxuXG5cdCAgaWYgKCFwYXRoT2JqZWN0LmRpciB8fCBwYXRoT2JqZWN0LmRpciA9PT0gcGF0aE9iamVjdC5yb290KSB7XG5cdCAgICByZXR1cm4gYCR7cGF0aE9iamVjdC5yb290IHx8ICcnfSR7YmFzZX1gO1xuXHQgIH0gLy8gY29tYmluZSBkaXIgKyAvICsgYmFzZVxuXG5cblx0ICByZXR1cm4gYCR7cGF0aE9iamVjdC5kaXJ9JHtzZXBhcmF0b3J9JHtiYXNlfWA7XG5cdH1cblx0LyoqXG5cdCAqIE9uIFdpbmRvd3Mgc3lzdGVtcyBvbmx5LCByZXR1cm5zIGFuIGVxdWl2YWxlbnQgbmFtZXNwYWNlLXByZWZpeGVkIHBhdGggZm9yXG5cdCAqIHRoZSBnaXZlbiBwYXRoLiBJZiBwYXRoIGlzIG5vdCBhIHN0cmluZywgcGF0aCB3aWxsIGJlIHJldHVybmVkIHdpdGhvdXQgbW9kaWZpY2F0aW9ucy5cblx0ICogU2VlIGh0dHBzOi8vZG9jcy5taWNyb3NvZnQuY29tL2VuLXVzL3dpbmRvd3MvZGVza3RvcC9GaWxlSU8vbmFtaW5nLWEtZmlsZSNuYW1lc3BhY2VzXG5cdCAqIEBwYXJhbSAge3N0cmluZ30gZmlsZXBhdGggW2Rlc2NyaXB0aW9uXVxuXHQgKiBAcmV0dXJuIHtzdHJpbmd9ICAgICAgICAgIFtkZXNjcmlwdGlvbl1cblx0ICovXG5cblxuXHRmdW5jdGlvbiB0b05hbWVzcGFjZWRQYXRoKGZpbGVwYXRoKSB7XG5cdCAgaWYgKHR5cGVvZiBmaWxlcGF0aCAhPT0gJ3N0cmluZycpIHtcblx0ICAgIHJldHVybiBmaWxlcGF0aDtcblx0ICB9XG5cblx0ICBpZiAoZmlsZXBhdGgubGVuZ3RoID09PSAwKSB7XG5cdCAgICByZXR1cm4gJyc7XG5cdCAgfVxuXG5cdCAgY29uc3QgcmVzb2x2ZWRQYXRoID0gcmVzb2x2ZSgnXFxcXCcsIFtmaWxlcGF0aF0pO1xuXHQgIGNvbnN0IGxlbmd0aCA9IHJlc29sdmVkUGF0aC5sZW5ndGg7XG5cblx0ICBpZiAobGVuZ3RoIDwgMikge1xuXHQgICAgLy8gbmVlZCAnXFxcXFxcXFwnIG9yICdDOicgbWluaW11bVxuXHQgICAgcmV0dXJuIGZpbGVwYXRoO1xuXHQgIH1cblxuXHQgIGNvbnN0IGZpcnN0Q2hhckNvZGUgPSByZXNvbHZlZFBhdGguY2hhckNvZGVBdCgwKTsgLy8gaWYgc3RhcnQgd2l0aCAnXFxcXFxcXFwnLCBwcmVmaXggd2l0aCBVTkMgcm9vdCwgZHJvcCB0aGUgc2xhc2hlc1xuXG5cdCAgaWYgKGZpcnN0Q2hhckNvZGUgPT09IEJBQ0tXQVJEX1NMQVNIICYmIHJlc29sdmVkUGF0aC5jaGFyQXQoMSkgPT09ICdcXFxcJykge1xuXHQgICAgLy8gcmV0dXJuIGFzLWlzIGlmIGl0J3MgYW4gYXJlYWR5IGxvbmcgcGF0aCAoJ1xcXFxcXFxcP1xcXFwnIG9yICdcXFxcXFxcXC5cXFxcJyBwcmVmaXgpXG5cdCAgICBpZiAobGVuZ3RoID49IDMpIHtcblx0ICAgICAgY29uc3QgdGhpcmRDaGFyID0gcmVzb2x2ZWRQYXRoLmNoYXJBdCgyKTtcblxuXHQgICAgICBpZiAodGhpcmRDaGFyID09PSAnPycgfHwgdGhpcmRDaGFyID09PSAnLicpIHtcblx0ICAgICAgICByZXR1cm4gZmlsZXBhdGg7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcmV0dXJuICdcXFxcXFxcXD9cXFxcVU5DXFxcXCcgKyByZXNvbHZlZFBhdGguc2xpY2UoMik7XG5cdCAgfSBlbHNlIGlmIChpc1dpbmRvd3NEZXZpY2VOYW1lKGZpcnN0Q2hhckNvZGUpICYmIHJlc29sdmVkUGF0aC5jaGFyQXQoMSkgPT09ICc6Jykge1xuXHQgICAgcmV0dXJuICdcXFxcXFxcXD9cXFxcJyArIHJlc29sdmVkUGF0aDtcblx0ICB9XG5cblx0ICByZXR1cm4gZmlsZXBhdGg7XG5cdH1cblxuXHRjb25zdCBXaW4zMlBhdGggPSB7XG5cdCAgc2VwOiAnXFxcXCcsXG5cdCAgZGVsaW1pdGVyOiAnOycsXG5cdCAgYmFzZW5hbWU6IGZ1bmN0aW9uIChmaWxlcGF0aCwgZXh0KSB7XG5cdCAgICByZXR1cm4gYmFzZW5hbWUodGhpcy5zZXAsIGZpbGVwYXRoLCBleHQpO1xuXHQgIH0sXG5cdCAgbm9ybWFsaXplOiBmdW5jdGlvbiAoZmlsZXBhdGgpIHtcblx0ICAgIHJldHVybiBub3JtYWxpemUodGhpcy5zZXAsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIGpvaW46IGZ1bmN0aW9uICguLi5wYXRocykge1xuXHQgICAgcmV0dXJuIGpvaW4odGhpcy5zZXAsIHBhdGhzKTtcblx0ICB9LFxuXHQgIGV4dG5hbWU6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIGV4dG5hbWUodGhpcy5zZXAsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIGRpcm5hbWU6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIGRpcm5hbWUodGhpcy5zZXAsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIGlzQWJzb2x1dGU6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIGlzQWJzb2x1dGUoZmFsc2UsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIHJlbGF0aXZlOiBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcblx0ICAgIHJldHVybiByZWxhdGl2ZSh0aGlzLnNlcCwgZnJvbSwgdG8pO1xuXHQgIH0sXG5cdCAgcmVzb2x2ZTogZnVuY3Rpb24gKC4uLnBhdGhzKSB7XG5cdCAgICByZXR1cm4gcmVzb2x2ZSh0aGlzLnNlcCwgcGF0aHMpO1xuXHQgIH0sXG5cdCAgcGFyc2U6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIHBhcnNlKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBmb3JtYXQ6IGZ1bmN0aW9uIChwYXRoT2JqZWN0KSB7XG5cdCAgICByZXR1cm4gZm9ybWF0KHRoaXMuc2VwLCBwYXRoT2JqZWN0KTtcblx0ICB9LFxuXHQgIHRvTmFtZXNwYWNlZFBhdGg6IHRvTmFtZXNwYWNlZFBhdGhcblx0fTtcblx0Y29uc3QgUG9zaXhQYXRoID0ge1xuXHQgIHNlcDogJy8nLFxuXHQgIGRlbGltaXRlcjogJzonLFxuXHQgIGJhc2VuYW1lOiBmdW5jdGlvbiAoZmlsZXBhdGgsIGV4dCkge1xuXHQgICAgcmV0dXJuIGJhc2VuYW1lKHRoaXMuc2VwLCBmaWxlcGF0aCwgZXh0KTtcblx0ICB9LFxuXHQgIG5vcm1hbGl6ZTogZnVuY3Rpb24gKGZpbGVwYXRoKSB7XG5cdCAgICByZXR1cm4gbm9ybWFsaXplKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBqb2luOiBmdW5jdGlvbiAoLi4ucGF0aHMpIHtcblx0ICAgIHJldHVybiBqb2luKHRoaXMuc2VwLCBwYXRocyk7XG5cdCAgfSxcblx0ICBleHRuYW1lOiBmdW5jdGlvbiAoZmlsZXBhdGgpIHtcblx0ICAgIHJldHVybiBleHRuYW1lKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBkaXJuYW1lOiBmdW5jdGlvbiAoZmlsZXBhdGgpIHtcblx0ICAgIHJldHVybiBkaXJuYW1lKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBpc0Fic29sdXRlOiBmdW5jdGlvbiAoZmlsZXBhdGgpIHtcblx0ICAgIHJldHVybiBpc0Fic29sdXRlKHRydWUsIGZpbGVwYXRoKTtcblx0ICB9LFxuXHQgIHJlbGF0aXZlOiBmdW5jdGlvbiAoZnJvbSwgdG8pIHtcblx0ICAgIHJldHVybiByZWxhdGl2ZSh0aGlzLnNlcCwgZnJvbSwgdG8pO1xuXHQgIH0sXG5cdCAgcmVzb2x2ZTogZnVuY3Rpb24gKC4uLnBhdGhzKSB7XG5cdCAgICByZXR1cm4gcmVzb2x2ZSh0aGlzLnNlcCwgcGF0aHMpO1xuXHQgIH0sXG5cdCAgcGFyc2U6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIHBhcnNlKHRoaXMuc2VwLCBmaWxlcGF0aCk7XG5cdCAgfSxcblx0ICBmb3JtYXQ6IGZ1bmN0aW9uIChwYXRoT2JqZWN0KSB7XG5cdCAgICByZXR1cm4gZm9ybWF0KHRoaXMuc2VwLCBwYXRoT2JqZWN0KTtcblx0ICB9LFxuXHQgIHRvTmFtZXNwYWNlZFBhdGg6IGZ1bmN0aW9uIChmaWxlcGF0aCkge1xuXHQgICAgcmV0dXJuIGZpbGVwYXRoOyAvLyBuby1vcFxuXHQgIH1cblx0fTtcblx0Y29uc3QgcGF0aCA9IFBvc2l4UGF0aDtcblx0cGF0aC53aW4zMiA9IFdpbjMyUGF0aDtcblx0cGF0aC5wb3NpeCA9IFBvc2l4UGF0aDtcblxuXHR2YXIgaW52b2tlciA9IHt9O1xuXG5cdC8qKlxuXHQgKiBBcHBjZWxlcmF0b3IgVGl0YW5pdW0gTW9iaWxlXG5cdCAqIENvcHlyaWdodCAoYykgMjAxMS1QcmVzZW50IGJ5IEFwcGNlbGVyYXRvciwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEFwYWNoZSBQdWJsaWMgTGljZW5zZVxuXHQgKiBQbGVhc2Ugc2VlIHRoZSBMSUNFTlNFIGluY2x1ZGVkIHdpdGggdGhpcyBkaXN0cmlidXRpb24gZm9yIGRldGFpbHMuXG5cdCAqL1xuXHQvKipcblx0ICogR2VuZXJhdGVzIGEgd3JhcHBlZCBpbnZva2VyIGZ1bmN0aW9uIGZvciBhIHNwZWNpZmljIEFQSVxuXHQgKiBUaGlzIGxldHMgdXMgcGFzcyBpbiBjb250ZXh0LXNwZWNpZmljIGRhdGEgdG8gYSBmdW5jdGlvblxuXHQgKiBkZWZpbmVkIGluIGFuIEFQSSBuYW1lc3BhY2UgKGkuZS4gb24gYSBtb2R1bGUpXG5cdCAqXG5cdCAqIFdlIHVzZSB0aGlzIGZvciBjcmVhdGUgbWV0aG9kcywgYW5kIG90aGVyIEFQSXMgdGhhdCB0YWtlXG5cdCAqIGEgS3JvbGxJbnZvY2F0aW9uIG9iamVjdCBhcyB0aGVpciBmaXJzdCBhcmd1bWVudCBpbiBKYXZhXG5cdCAqXG5cdCAqIEZvciBleGFtcGxlLCBhbiBpbnZva2VyIGZvciBhIFwiY3JlYXRlXCIgbWV0aG9kIG1pZ2h0IGxvb2tcblx0ICogc29tZXRoaW5nIGxpa2UgdGhpczpcblx0ICpcblx0ICogICAgIGZ1bmN0aW9uIGNyZWF0ZVZpZXcoc291cmNlVXJsLCBvcHRpb25zKSB7XG5cdCAqICAgICAgICAgdmFyIHZpZXcgPSBuZXcgVmlldyhvcHRpb25zKTtcblx0ICogICAgICAgICB2aWV3LnNvdXJjZVVybCA9IHNvdXJjZVVybDtcblx0ICogICAgICAgICByZXR1cm4gdmlldztcblx0ICogICAgIH1cblx0ICpcblx0ICogQW5kIHRoZSBjb3JyZXNwb25kaW5nIGludm9rZXIgZm9yIGFwcC5qcyB3b3VsZCBsb29rIGxpa2U6XG5cdCAqXG5cdCAqICAgICBVSS5jcmVhdGVWaWV3ID0gZnVuY3Rpb24oKSB7XG5cdCAqICAgICAgICAgcmV0dXJuIGNyZWF0ZVZpZXcoXCJhcHA6Ly9hcHAuanNcIiwgYXJndW1lbnRzWzBdKTtcblx0ICogICAgIH1cblx0ICpcblx0ICogd3JhcHBlckFQSTogVGhlIHNjb3BlIHNwZWNpZmljIEFQSSAobW9kdWxlKSB3cmFwcGVyXG5cdCAqIHJlYWxBUEk6IFRoZSBhY3R1YWwgbW9kdWxlIGltcGxlbWVudGF0aW9uXG5cdCAqIGFwaU5hbWU6IFRoZSB0b3AgbGV2ZWwgQVBJIG5hbWUgb2YgdGhlIHJvb3QgbW9kdWxlXG5cdCAqIGludm9jYXRpb25BUEk6IFRoZSBhY3R1YWwgQVBJIHRvIGdlbmVyYXRlIGFuIGludm9rZXIgZm9yXG5cdCAqIHNjb3BlVmFyczogQSBtYXAgdGhhdCBpcyBwYXNzZWQgaW50byBlYWNoIGludm9rZXJcblx0ICovXG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSB3cmFwcGVyQVBJIGUuZy4gVGl0YW5pdW1XcmFwcGVyXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSByZWFsQVBJIGUuZy4gVGl0YW5pdW1cblx0ICogQHBhcmFtIHtzdHJpbmd9IGFwaU5hbWUgZS5nLiAnVGl0YW5pdW0nXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBpbnZvY2F0aW9uQVBJIGRldGFpbHMgb24gdGhlIGFwaSB3ZSdyZSB3cmFwcGluZ1xuXHQgKiBAcGFyYW0ge3N0cmluZ30gaW52b2NhdGlvbkFQSS5uYW1lc3BhY2UgdGhlIG5hbWVzcGFjZSBvZiB0aGUgcHJveHkgd2hlcmUgbWV0aG9kIGhhbmdzICh3L28gJ1RpLicgcHJlZml4KSBlLmcuICdGaWxlc3lzdGVtJyBvciAnVUkuQW5kcm9pZCdcblx0ICogQHBhcmFtIHtzdHJpbmd9IGludm9jYXRpb25BUEkuYXBpIHRoZSBtZXRob2QgbmFtZSBlLmcuICdvcGVuRmlsZScgb3IgJ2NyZWF0ZVNlYXJjaFZpZXcnXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBzY29wZVZhcnMgaG9sZGVyIGZvciBjb250ZXh0IHNwZWNpZmljIHZhbHVlcyAoYmFzaWNhbGx5IGp1c3Qgd3JhcHMgc291cmNlVXJsKVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gc2NvcGVWYXJzLnNvdXJjZVVybCBzb3VyY2UgVVJMIG9mIGpzIGZpbGUgZW50cnkgcG9pbnRcblx0ICogQHBhcmFtIHtNb2R1bGV9IFtzY29wZVZhcnMubW9kdWxlXSBtb2R1bGVcblx0ICovXG5cblx0ZnVuY3Rpb24gZ2VuSW52b2tlcih3cmFwcGVyQVBJLCByZWFsQVBJLCBhcGlOYW1lLCBpbnZvY2F0aW9uQVBJLCBzY29wZVZhcnMpIHtcblx0ICBsZXQgYXBpTmFtZXNwYWNlID0gd3JhcHBlckFQSTtcblx0ICBjb25zdCBuYW1lc3BhY2UgPSBpbnZvY2F0aW9uQVBJLm5hbWVzcGFjZTtcblxuXHQgIGlmIChuYW1lc3BhY2UgIT09IGFwaU5hbWUpIHtcblx0ICAgIGNvbnN0IG5hbWVzID0gbmFtZXNwYWNlLnNwbGl0KCcuJyk7XG5cblx0ICAgIGZvciAoY29uc3QgbmFtZSBvZiBuYW1lcykge1xuXHQgICAgICBsZXQgYXBpOyAvLyBDcmVhdGUgYSBtb2R1bGUgd3JhcHBlciBvbmx5IGlmIGl0IGhhc24ndCBiZWVuIHdyYXBwZWQgYWxyZWFkeS5cblxuXHQgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFwaU5hbWVzcGFjZSwgbmFtZSkpIHtcblx0ICAgICAgICBhcGkgPSBhcGlOYW1lc3BhY2VbbmFtZV07XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgZnVuY3Rpb24gU2FuZGJveEFQSSgpIHtcblx0ICAgICAgICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpO1xuXHQgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdfZXZlbnRzJywge1xuXHQgICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcblx0ICAgICAgICAgICAgICByZXR1cm4gcHJvdG8uX2V2ZW50cztcblx0ICAgICAgICAgICAgfSxcblx0ICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcblx0ICAgICAgICAgICAgICBwcm90by5fZXZlbnRzID0gdmFsdWU7XG5cdCAgICAgICAgICAgIH1cblx0ICAgICAgICAgIH0pO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIFNhbmRib3hBUEkucHJvdG90eXBlID0gYXBpTmFtZXNwYWNlW25hbWVdO1xuXHQgICAgICAgIGFwaSA9IG5ldyBTYW5kYm94QVBJKCk7XG5cdCAgICAgICAgYXBpTmFtZXNwYWNlW25hbWVdID0gYXBpO1xuXHQgICAgICB9XG5cblx0ICAgICAgYXBpTmFtZXNwYWNlID0gYXBpO1xuXHQgICAgICByZWFsQVBJID0gcmVhbEFQSVtuYW1lXTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICBsZXQgZGVsZWdhdGUgPSByZWFsQVBJW2ludm9jYXRpb25BUEkuYXBpXTsgLy8gVGhlc2UgaW52b2tlcnMgZm9ybSBhIGNhbGwgaGllcmFyY2h5IHNvIHdlIG5lZWQgdG9cblx0ICAvLyBwcm92aWRlIGEgd2F5IGJhY2sgdG8gdGhlIGFjdHVhbCByb290IFRpdGFuaXVtIC8gYWN0dWFsIGltcGwuXG5cblx0ICB3aGlsZSAoZGVsZWdhdGUuX19kZWxlZ2F0ZV9fKSB7XG5cdCAgICBkZWxlZ2F0ZSA9IGRlbGVnYXRlLl9fZGVsZWdhdGVfXztcblx0ICB9XG5cblx0ICBhcGlOYW1lc3BhY2VbaW52b2NhdGlvbkFQSS5hcGldID0gY3JlYXRlSW52b2tlcihyZWFsQVBJLCBkZWxlZ2F0ZSwgc2NvcGVWYXJzKTtcblx0fVxuXG5cdGludm9rZXIuZ2VuSW52b2tlciA9IGdlbkludm9rZXI7XG5cdC8qKlxuXHQgKiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgc2luZ2xlIGludm9rZXIgZnVuY3Rpb24gdGhhdCB3cmFwc1xuXHQgKiBhIGRlbGVnYXRlIGZ1bmN0aW9uLCB0aGlzT2JqLCBhbmQgc2NvcGVWYXJzXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSB0aGlzT2JqIFRoZSBgdGhpc2Agb2JqZWN0IHRvIHVzZSB3aGVuIGludm9raW5nIHRoZSBgZGVsZWdhdGVgIGZ1bmN0aW9uXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGRlbGVnYXRlIFRoZSBmdW5jdGlvbiB0byB3cmFwL2RlbGVnYXRlIHRvIHVuZGVyIHRoZSBob29kXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBzY29wZVZhcnMgVGhlIHNjb3BlIHZhcmlhYmxlcyB0byBzcGxpY2UgaW50byB0aGUgYXJndW1lbnRzIHdoZW4gY2FsbGluZyB0aGUgZGVsZWdhdGVcblx0ICogQHBhcmFtIHtzdHJpbmd9IHNjb3BlVmFycy5zb3VyY2VVcmwgdGhlIG9ubHkgcmVhbCByZWxldmVudCBzY29wZSB2YXJpYWJsZSFcblx0ICogQHJldHVybiB7ZnVuY3Rpb259XG5cdCAqL1xuXG5cdGZ1bmN0aW9uIGNyZWF0ZUludm9rZXIodGhpc09iaiwgZGVsZWdhdGUsIHNjb3BlVmFycykge1xuXHQgIGNvbnN0IHVybEludm9rZXIgPSBmdW5jdGlvbiBpbnZva2VyKC4uLmFyZ3MpIHtcblx0ICAgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZnVuYy1zdHlsZVxuXHQgICAgYXJncy5zcGxpY2UoMCwgMCwgaW52b2tlci5fX3Njb3BlVmFyc19fKTtcblx0ICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseShpbnZva2VyLl9fdGhpc09ial9fLCBhcmdzKTtcblx0ICB9O1xuXG5cdCAgdXJsSW52b2tlci5fX2RlbGVnYXRlX18gPSBkZWxlZ2F0ZTtcblx0ICB1cmxJbnZva2VyLl9fdGhpc09ial9fID0gdGhpc09iajtcblx0ICB1cmxJbnZva2VyLl9fc2NvcGVWYXJzX18gPSBzY29wZVZhcnM7XG5cdCAgcmV0dXJuIHVybEludm9rZXI7XG5cdH1cblxuXHRpbnZva2VyLmNyZWF0ZUludm9rZXIgPSBjcmVhdGVJbnZva2VyO1xuXG5cdC8qKlxuXHQgKiBBcHBjZWxlcmF0b3IgVGl0YW5pdW0gTW9iaWxlXG5cdCAqIENvcHlyaWdodCAoYykgMjAxMS1QcmVzZW50IGJ5IEFwcGNlbGVyYXRvciwgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuXHQgKiBMaWNlbnNlZCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEFwYWNoZSBQdWJsaWMgTGljZW5zZVxuXHQgKiBQbGVhc2Ugc2VlIHRoZSBMSUNFTlNFIGluY2x1ZGVkIHdpdGggdGhpcyBkaXN0cmlidXRpb24gZm9yIGRldGFpbHMuXG5cdCAqL1xuXG5cdGZ1bmN0aW9uIGJvb3RzdHJhcCQyKGdsb2JhbCwga3JvbGwpIHtcblx0ICBjb25zdCBhc3NldHMgPSBrcm9sbC5iaW5kaW5nKCdhc3NldHMnKTtcblx0ICBjb25zdCBTY3JpcHQgPSBrcm9sbC5iaW5kaW5nKCdldmFscycpLlNjcmlwdCA7XG5cdCAgLyoqXG5cdCAgICogVGhlIGxvYWRlZCBpbmRleC5qc29uIGZpbGUgZnJvbSB0aGUgYXBwLiBVc2VkIHRvIHN0b3JlIHRoZSBlbmNyeXB0ZWQgSlMgYXNzZXRzJ1xuXHQgICAqIGZpbGVuYW1lcy9vZmZzZXRzLlxuXHQgICAqL1xuXG5cdCAgbGV0IGZpbGVJbmRleDsgLy8gRklYTUU6IGZpeCBmaWxlIG5hbWUgcGFyaXR5IGJldHdlZW4gcGxhdGZvcm1zXG5cblx0ICBjb25zdCBJTkRFWF9KU09OID0gJ2luZGV4Lmpzb24nIDtcblxuXHQgIGNsYXNzIE1vZHVsZSB7XG5cdCAgICAvKipcblx0ICAgICAqIFtNb2R1bGUgZGVzY3JpcHRpb25dXG5cdCAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQgICAgICBtb2R1bGUgaWRcblx0ICAgICAqIEBwYXJhbSB7TW9kdWxlfSBwYXJlbnQgIHBhcmVudCBtb2R1bGVcblx0ICAgICAqL1xuXHQgICAgY29uc3RydWN0b3IoaWQsIHBhcmVudCkge1xuXHQgICAgICB0aGlzLmlkID0gaWQ7XG5cdCAgICAgIHRoaXMuZXhwb3J0cyA9IHt9O1xuXHQgICAgICB0aGlzLnBhcmVudCA9IHBhcmVudDtcblx0ICAgICAgdGhpcy5maWxlbmFtZSA9IG51bGw7XG5cdCAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG5cdCAgICAgIHRoaXMud3JhcHBlckNhY2hlID0ge307XG5cdCAgICAgIHRoaXMuaXNTZXJ2aWNlID0gZmFsc2U7IC8vIHRvZ2dsZWQgb24gaWYgdGhpcyBtb2R1bGUgaXMgdGhlIHNlcnZpY2UgZW50cnkgcG9pbnRcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogQXR0ZW1wdHMgdG8gbG9hZCB0aGUgbW9kdWxlLiBJZiBubyBmaWxlIGlzIGZvdW5kXG5cdCAgICAgKiB3aXRoIHRoZSBwcm92aWRlZCBuYW1lIGFuIGV4Y2VwdGlvbiB3aWxsIGJlIHRocm93bi5cblx0ICAgICAqIE9uY2UgdGhlIGNvbnRlbnRzIG9mIHRoZSBmaWxlIGFyZSByZWFkLCBpdCBpcyBydW5cblx0ICAgICAqIGluIHRoZSBjdXJyZW50IGNvbnRleHQuIEEgc2FuZGJveCBpcyBjcmVhdGVkIGJ5XG5cdCAgICAgKiBleGVjdXRpbmcgdGhlIGNvZGUgaW5zaWRlIGEgd3JhcHBlciBmdW5jdGlvbi5cblx0ICAgICAqIFRoaXMgcHJvdmlkZXMgYSBzcGVlZCBib29zdCB2cyBjcmVhdGluZyBhIG5ldyBjb250ZXh0LlxuXHQgICAgICpcblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gZmlsZW5hbWUgW2Rlc2NyaXB0aW9uXVxuXHQgICAgICogQHBhcmFtICB7U3RyaW5nfSBzb3VyY2UgICBbZGVzY3JpcHRpb25dXG5cdCAgICAgKiBAcmV0dXJucyB7dm9pZH1cblx0ICAgICAqL1xuXG5cblx0ICAgIGxvYWQoZmlsZW5hbWUsIHNvdXJjZSkge1xuXHQgICAgICBpZiAodGhpcy5sb2FkZWQpIHtcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01vZHVsZSBhbHJlYWR5IGxvYWRlZC4nKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIHRoaXMuZmlsZW5hbWUgPSBmaWxlbmFtZTtcblx0ICAgICAgdGhpcy5wYXRoID0gcGF0aC5kaXJuYW1lKGZpbGVuYW1lKTtcblx0ICAgICAgdGhpcy5wYXRocyA9IHRoaXMubm9kZU1vZHVsZXNQYXRocyh0aGlzLnBhdGgpO1xuXG5cdCAgICAgIGlmICghc291cmNlKSB7XG5cdCAgICAgICAgc291cmNlID0gYXNzZXRzLnJlYWRBc3NldChgUmVzb3VyY2VzJHtmaWxlbmFtZX1gICk7XG5cdCAgICAgIH0gLy8gU3RpY2sgaXQgaW4gdGhlIGNhY2hlXG5cblxuXHQgICAgICBNb2R1bGUuY2FjaGVbdGhpcy5maWxlbmFtZV0gPSB0aGlzO1xuXG5cdCAgICAgIHRoaXMuX3J1blNjcmlwdChzb3VyY2UsIHRoaXMuZmlsZW5hbWUpO1xuXG5cdCAgICAgIHRoaXMubG9hZGVkID0gdHJ1ZTtcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogR2VuZXJhdGVzIGEgY29udGV4dC1zcGVjaWZpYyBtb2R1bGUgd3JhcHBlciwgYW5kIHdyYXBzXG5cdCAgICAgKiBlYWNoIGludm9jYXRpb24gQVBJIGluIGFuIGV4dGVybmFsICgzcmQgcGFydHkpIG1vZHVsZVxuXHQgICAgICogU2VlIGludm9rZXIuanMgZm9yIG1vcmUgaW5mb1xuXHQgICAgICogQHBhcmFtICB7b2JqZWN0fSBleHRlcm5hbE1vZHVsZSBuYXRpdmUgbW9kdWxlIHByb3h5XG5cdCAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IHNvdXJjZVVybCAgICAgIHRoZSBjdXJyZW50IGpzIGZpbGUgdXJsXG5cdCAgICAgKiBAcmV0dXJuIHtvYmplY3R9ICAgICAgICAgICAgICAgIHdyYXBwZXIgYXJvdW5kIHRoZSBleHRlcm5hbE1vZHVsZVxuXHQgICAgICovXG5cblxuXHQgICAgY3JlYXRlTW9kdWxlV3JhcHBlcihleHRlcm5hbE1vZHVsZSwgc291cmNlVXJsKSB7XG5cblxuXHQgICAgICBmdW5jdGlvbiBNb2R1bGVXcmFwcGVyKCkge31cblxuXHQgICAgICBNb2R1bGVXcmFwcGVyLnByb3RvdHlwZSA9IGV4dGVybmFsTW9kdWxlO1xuXHQgICAgICBjb25zdCB3cmFwcGVyID0gbmV3IE1vZHVsZVdyYXBwZXIoKTsgLy8gSGVyZSB3ZSB0YWtlIHRoZSBBUElzIGRlZmluZWQgaW4gdGhlIGJvb3RzdHJhcC5qc1xuXHQgICAgICAvLyBhbmQgZWZmZWN0aXZlbHkgbGF6aWx5IGhvb2sgdGhlbVxuXHQgICAgICAvLyBXZSBleHBsaWNpdGx5IGd1YXJkIHRoZSBjb2RlIHNvIGlPUyBkb2Vzbid0IGV2ZW4gdXNlL2luY2x1ZGUgdGhlIHJlZmVyZW5jZWQgaW52b2tlci5qcyBpbXBvcnRcblxuXHQgICAgICBjb25zdCBpbnZvY2F0aW9uQVBJcyA9IGV4dGVybmFsTW9kdWxlLmludm9jYXRpb25BUElzIHx8IFtdO1xuXG5cdCAgICAgIGZvciAoY29uc3QgYXBpIG9mIGludm9jYXRpb25BUElzKSB7XG5cdCAgICAgICAgY29uc3QgZGVsZWdhdGUgPSBleHRlcm5hbE1vZHVsZVthcGldO1xuXG5cdCAgICAgICAgaWYgKCFkZWxlZ2F0ZSkge1xuXHQgICAgICAgICAgY29udGludWU7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgd3JhcHBlclthcGldID0gaW52b2tlci5jcmVhdGVJbnZva2VyKGV4dGVybmFsTW9kdWxlLCBkZWxlZ2F0ZSwgbmV3IGtyb2xsLlNjb3BlVmFycyh7XG5cdCAgICAgICAgICBzb3VyY2VVcmxcblx0ICAgICAgICB9KSk7XG5cdCAgICAgIH1cblxuXHQgICAgICB3cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAoLi4uYXJncykge1xuXHQgICAgICAgIGV4dGVybmFsTW9kdWxlLmFkZEV2ZW50TGlzdGVuZXIuYXBwbHkoZXh0ZXJuYWxNb2R1bGUsIGFyZ3MpO1xuXHQgICAgICB9O1xuXG5cdCAgICAgIHdyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uICguLi5hcmdzKSB7XG5cdCAgICAgICAgZXh0ZXJuYWxNb2R1bGUucmVtb3ZlRXZlbnRMaXN0ZW5lci5hcHBseShleHRlcm5hbE1vZHVsZSwgYXJncyk7XG5cdCAgICAgIH07XG5cblx0ICAgICAgd3JhcHBlci5maXJlRXZlbnQgPSBmdW5jdGlvbiAoLi4uYXJncykge1xuXHQgICAgICAgIGV4dGVybmFsTW9kdWxlLmZpcmVFdmVudC5hcHBseShleHRlcm5hbE1vZHVsZSwgYXJncyk7XG5cdCAgICAgIH07XG5cblx0ICAgICAgcmV0dXJuIHdyYXBwZXI7XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIFRha2VzIGEgQ29tbW9uSlMgbW9kdWxlIGFuZCB1c2VzIGl0IHRvIGV4dGVuZCBhbiBleGlzdGluZyBleHRlcm5hbC9uYXRpdmUgbW9kdWxlLiBUaGUgZXhwb3J0cyBhcmUgYWRkZWQgdG8gdGhlIGV4dGVybmFsIG1vZHVsZS5cblx0ICAgICAqIEBwYXJhbSAge09iamVjdH0gZXh0ZXJuYWxNb2R1bGUgVGhlIGV4dGVybmFsL25hdGl2ZSBtb2R1bGUgd2UncmUgZXh0ZW5kaW5nXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGlkICAgICAgICAgICAgIG1vZHVsZSBpZFxuXHQgICAgICovXG5cblxuXHQgICAgZXh0ZW5kTW9kdWxlV2l0aENvbW1vbkpzKGV4dGVybmFsTW9kdWxlLCBpZCkge1xuXHQgICAgICBpZiAoIWtyb2xsLmlzRXh0ZXJuYWxDb21tb25Kc01vZHVsZShpZCkpIHtcblx0ICAgICAgICByZXR1cm47XG5cdCAgICAgIH0gLy8gTG9hZCB1bmRlciBmYWtlIG5hbWUsIG9yIHRoZSBjb21tb25qcyBzaWRlIG9mIHRoZSBuYXRpdmUgbW9kdWxlIGdldHMgY2FjaGVkIGluIHBsYWNlIG9mIHRoZSBuYXRpdmUgbW9kdWxlIVxuXHQgICAgICAvLyBTZWUgVElNT0ItMjQ5MzJcblxuXG5cdCAgICAgIGNvbnN0IGZha2VJZCA9IGAke2lkfS5jb21tb25qc2A7XG5cdCAgICAgIGNvbnN0IGpzTW9kdWxlID0gbmV3IE1vZHVsZShmYWtlSWQsIHRoaXMpO1xuXHQgICAgICBqc01vZHVsZS5sb2FkKGZha2VJZCwga3JvbGwuZ2V0RXh0ZXJuYWxDb21tb25Kc01vZHVsZShpZCkpO1xuXG5cdCAgICAgIGlmIChqc01vZHVsZS5leHBvcnRzKSB7XG5cdCAgICAgICAgY29uc29sZS50cmFjZShgRXh0ZW5kaW5nIG5hdGl2ZSBtb2R1bGUgJyR7aWR9JyB3aXRoIHRoZSBDb21tb25KUyBtb2R1bGUgdGhhdCB3YXMgcGFja2FnZWQgd2l0aCBpdC5gKTtcblx0ICAgICAgICBrcm9sbC5leHRlbmQoZXh0ZXJuYWxNb2R1bGUsIGpzTW9kdWxlLmV4cG9ydHMpO1xuXHQgICAgICB9XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIExvYWRzIGEgbmF0aXZlIC8gZXh0ZXJuYWwgKDNyZCBwYXJ0eSkgbW9kdWxlXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGlkICAgICAgICAgICAgICBtb2R1bGUgaWRcblx0ICAgICAqIEBwYXJhbSAge29iamVjdH0gZXh0ZXJuYWxCaW5kaW5nIGV4dGVybmFsIGJpbmRpbmcgb2JqZWN0XG5cdCAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICBUaGUgZXhwb3J0ZWQgbW9kdWxlXG5cdCAgICAgKi9cblxuXG5cdCAgICBsb2FkRXh0ZXJuYWxNb2R1bGUoaWQsIGV4dGVybmFsQmluZGluZykge1xuXHQgICAgICAvLyB0cnkgdG8gZ2V0IHRoZSBjYWNoZWQgbW9kdWxlLi4uXG5cdCAgICAgIGxldCBleHRlcm5hbE1vZHVsZSA9IE1vZHVsZS5jYWNoZVtpZF07XG5cblx0ICAgICAgaWYgKCFleHRlcm5hbE1vZHVsZSkge1xuXHQgICAgICAgIC8vIGlPUyBhbmQgQW5kcm9pZCBkaWZmZXIgcXVpdGUgYSBiaXQgaGVyZS5cblx0ICAgICAgICAvLyBXaXRoIGlvcywgd2Ugc2hvdWxkIGFscmVhZHkgaGF2ZSB0aGUgbmF0aXZlIG1vZHVsZSBsb2FkZWRcblx0ICAgICAgICAvLyBUaGVyZSdzIG5vIHNwZWNpYWwgXCJib290c3RyYXAuanNcIiBmaWxlIHBhY2thZ2VkIHdpdGhpbiBpdFxuXHQgICAgICAgIC8vIE9uIEFuZHJvaWQsIHdlIGxvYWQgYSBib290c3RyYXAuanMgYnVuZGxlZCB3aXRoIHRoZSBtb2R1bGVcblx0ICAgICAgICB7XG5cdCAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBwcm9jZXNzIGZvciBBbmRyb2lkLCBmaXJzdCBncmFiIHRoZSBib290c3RyYXAgc291cmNlXG5cdCAgICAgICAgICBjb25zdCBzb3VyY2UgPSBleHRlcm5hbEJpbmRpbmcuYm9vdHN0cmFwOyAvLyBMb2FkIHRoZSBuYXRpdmUgbW9kdWxlJ3MgYm9vdHN0cmFwIEpTXG5cblx0ICAgICAgICAgIGNvbnN0IG1vZHVsZSA9IG5ldyBNb2R1bGUoaWQsIHRoaXMpO1xuXHQgICAgICAgICAgbW9kdWxlLmxvYWQoYCR7aWR9L2Jvb3RzdHJhcC5qc2AsIHNvdXJjZSk7IC8vIEJvb3RzdHJhcCBhbmQgbG9hZCB0aGUgbW9kdWxlIHVzaW5nIHRoZSBuYXRpdmUgYmluZGluZ3NcblxuXHQgICAgICAgICAgY29uc3QgcmVzdWx0ID0gbW9kdWxlLmV4cG9ydHMuYm9vdHN0cmFwKGV4dGVybmFsQmluZGluZyk7IC8vIENhY2hlIHRoZSBleHRlcm5hbCBtb2R1bGUgaW5zdGFuY2UgYWZ0ZXIgaXQncyBiZWVuIG1vZGlmaWVkIGJ5IGl0J3MgYm9vdHN0cmFwIHNjcmlwdFxuXG5cdCAgICAgICAgICBleHRlcm5hbE1vZHVsZSA9IHJlc3VsdDtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoIWV4dGVybmFsTW9kdWxlKSB7XG5cdCAgICAgICAgY29uc29sZS50cmFjZShgVW5hYmxlIHRvIGxvYWQgZXh0ZXJuYWwgbW9kdWxlOiAke2lkfWApO1xuXHQgICAgICAgIHJldHVybiBudWxsO1xuXHQgICAgICB9IC8vIGNhY2hlIHRoZSBsb2FkZWQgbmF0aXZlIG1vZHVsZSAoYmVmb3JlIHdlIGV4dGVuZCBpdClcblxuXG5cdCAgICAgIE1vZHVsZS5jYWNoZVtpZF0gPSBleHRlcm5hbE1vZHVsZTsgLy8gV2UgY2FjaGUgZWFjaCBjb250ZXh0LXNwZWNpZmljIG1vZHVsZSB3cmFwcGVyXG5cdCAgICAgIC8vIG9uIHRoZSBwYXJlbnQgbW9kdWxlLCByYXRoZXIgdGhhbiBpbiB0aGUgTW9kdWxlLmNhY2hlXG5cblx0ICAgICAgbGV0IHdyYXBwZXIgPSB0aGlzLndyYXBwZXJDYWNoZVtpZF07XG5cblx0ICAgICAgaWYgKHdyYXBwZXIpIHtcblx0ICAgICAgICByZXR1cm4gd3JhcHBlcjtcblx0ICAgICAgfVxuXG5cdCAgICAgIGNvbnN0IHNvdXJjZVVybCA9IGBhcHA6Ly8ke3RoaXMuZmlsZW5hbWV9YDsgLy8gRklYTUU6IElmIHRoaXMuZmlsZW5hbWUgc3RhcnRzIHdpdGggJy8nLCB3ZSBuZWVkIHRvIGRyb3AgaXQsIEkgdGhpbms/XG5cblx0ICAgICAgd3JhcHBlciA9IHRoaXMuY3JlYXRlTW9kdWxlV3JhcHBlcihleHRlcm5hbE1vZHVsZSwgc291cmNlVXJsKTsgLy8gVGhlbiB3ZSBcImV4dGVuZFwiIHRoZSBBUEkvbW9kdWxlIHVzaW5nIGFueSBzaGlwcGVkIEpTIGNvZGUgKGFzc2V0cy88bW9kdWxlLmlkPi5qcylcblxuXHQgICAgICB0aGlzLmV4dGVuZE1vZHVsZVdpdGhDb21tb25Kcyh3cmFwcGVyLCBpZCk7XG5cdCAgICAgIHRoaXMud3JhcHBlckNhY2hlW2lkXSA9IHdyYXBwZXI7XG5cdCAgICAgIHJldHVybiB3cmFwcGVyO1xuXHQgICAgfSAvLyBTZWUgaHR0cHM6Ly9ub2RlanMub3JnL2FwaS9tb2R1bGVzLmh0bWwjbW9kdWxlc19hbGxfdG9nZXRoZXJcblxuXHQgICAgLyoqXG5cdCAgICAgKiBSZXF1aXJlIGFub3RoZXIgbW9kdWxlIGFzIGEgY2hpbGQgb2YgdGhpcyBtb2R1bGUuXG5cdCAgICAgKiBUaGlzIHBhcmVudCBtb2R1bGUncyBwYXRoIGlzIHVzZWQgYXMgdGhlIGJhc2UgZm9yIHJlbGF0aXZlIHBhdGhzXG5cdCAgICAgKiB3aGVuIGxvYWRpbmcgdGhlIGNoaWxkLiBSZXR1cm5zIHRoZSBleHBvcnRzIG9iamVjdFxuXHQgICAgICogb2YgdGhlIGNoaWxkIG1vZHVsZS5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHJlcXVlc3QgIFRoZSBwYXRoIHRvIHRoZSByZXF1ZXN0ZWQgbW9kdWxlXG5cdCAgICAgKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgIFRoZSBsb2FkZWQgbW9kdWxlXG5cdCAgICAgKi9cblxuXG5cdCAgICByZXF1aXJlKHJlcXVlc3QpIHtcblx0ICAgICAgLy8gMi4gSWYgWCBiZWdpbnMgd2l0aCAnLi8nIG9yICcvJyBvciAnLi4vJ1xuXHQgICAgICBjb25zdCBzdGFydCA9IHJlcXVlc3Quc3Vic3RyaW5nKDAsIDIpOyAvLyBoYWNrIHVwIHRoZSBzdGFydCBvZiB0aGUgc3RyaW5nIHRvIGNoZWNrIHJlbGF0aXZlL2Fic29sdXRlL1wibmFrZWRcIiBtb2R1bGUgaWRcblxuXHQgICAgICBpZiAoc3RhcnQgPT09ICcuLycgfHwgc3RhcnQgPT09ICcuLicpIHtcblx0ICAgICAgICBjb25zdCBsb2FkZWQgPSB0aGlzLmxvYWRBc0ZpbGVPckRpcmVjdG9yeShwYXRoLm5vcm1hbGl6ZSh0aGlzLnBhdGggKyAnLycgKyByZXF1ZXN0KSk7XG5cblx0ICAgICAgICBpZiAobG9hZGVkKSB7XG5cdCAgICAgICAgICByZXR1cm4gbG9hZGVkLmV4cG9ydHM7XG5cdCAgICAgICAgfSAvLyBSb290L2Fic29sdXRlIHBhdGggKGludGVybmFsbHkgd2hlbiByZWFkaW5nIHRoZSBmaWxlLCB3ZSBwcmVwZW5kIFwiUmVzb3VyY2VzL1wiIGFzIHJvb3QgZGlyKVxuXG5cdCAgICAgIH0gZWxzZSBpZiAocmVxdWVzdC5zdWJzdHJpbmcoMCwgMSkgPT09ICcvJykge1xuXHQgICAgICAgIGNvbnN0IGxvYWRlZCA9IHRoaXMubG9hZEFzRmlsZU9yRGlyZWN0b3J5KHBhdGgubm9ybWFsaXplKHJlcXVlc3QpKTtcblxuXHQgICAgICAgIGlmIChsb2FkZWQpIHtcblx0ICAgICAgICAgIHJldHVybiBsb2FkZWQuZXhwb3J0cztcblx0ICAgICAgICB9XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgLy8gRGVzcGl0ZSBiZWluZyBzdGVwIDEgaW4gTm9kZS5KUyBwc3VlZG8tY29kZSwgd2UgbW92ZWQgaXQgZG93biBoZXJlIGJlY2F1c2Ugd2UgZG9uJ3QgYWxsb3cgbmF0aXZlIG1vZHVsZXNcblx0ICAgICAgICAvLyB0byBzdGFydCB3aXRoICcuLycsICcuLicgb3IgJy8nIC0gc28gdGhpcyBhdm9pZHMgYSBsb3Qgb2YgbWlzc2VzIG9uIHJlcXVpcmVzIHN0YXJ0aW5nIHRoYXQgd2F5XG5cdCAgICAgICAgLy8gMS4gSWYgWCBpcyBhIGNvcmUgbW9kdWxlLFxuXHQgICAgICAgIGxldCBsb2FkZWQgPSB0aGlzLmxvYWRDb3JlTW9kdWxlKHJlcXVlc3QpO1xuXG5cdCAgICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgICAgLy8gYS4gcmV0dXJuIHRoZSBjb3JlIG1vZHVsZVxuXHQgICAgICAgICAgLy8gYi4gU1RPUFxuXHQgICAgICAgICAgcmV0dXJuIGxvYWRlZDtcblx0ICAgICAgICB9IC8vIExvb2sgZm9yIENvbW1vbkpTIG1vZHVsZVxuXG5cblx0ICAgICAgICBpZiAocmVxdWVzdC5pbmRleE9mKCcvJykgPT09IC0xKSB7XG5cdCAgICAgICAgICAvLyBGb3IgQ29tbW9uSlMgd2UgbmVlZCB0byBsb29rIGZvciBtb2R1bGUuaWQvbW9kdWxlLmlkLmpzIGZpcnN0Li4uXG5cdCAgICAgICAgICBjb25zdCBmaWxlbmFtZSA9IGAvJHtyZXF1ZXN0fS8ke3JlcXVlc3R9LmpzYDsgLy8gT25seSBsb29rIGZvciB0aGlzIF9leGFjdCBmaWxlXy4gRE8gTk9UIEFQUEVORCAuanMgb3IgLmpzb24gdG8gaXQhXG5cblx0ICAgICAgICAgIGlmICh0aGlzLmZpbGVuYW1lRXhpc3RzKGZpbGVuYW1lKSkge1xuXHQgICAgICAgICAgICBsb2FkZWQgPSB0aGlzLmxvYWRKYXZhc2NyaXB0VGV4dChmaWxlbmFtZSk7XG5cblx0ICAgICAgICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgICAgICAgIHJldHVybiBsb2FkZWQuZXhwb3J0cztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgfSAvLyBUaGVuIHRyeSBtb2R1bGUuaWQgYXMgZGlyZWN0b3J5XG5cblxuXHQgICAgICAgICAgbG9hZGVkID0gdGhpcy5sb2FkQXNEaXJlY3RvcnkoYC8ke3JlcXVlc3R9YCk7XG5cblx0ICAgICAgICAgIGlmIChsb2FkZWQpIHtcblx0ICAgICAgICAgICAgcmV0dXJuIGxvYWRlZC5leHBvcnRzO1xuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH0gLy8gQWxsb3cgbG9va2luZyB0aHJvdWdoIG5vZGVfbW9kdWxlc1xuXHQgICAgICAgIC8vIDMuIExPQURfTk9ERV9NT0RVTEVTKFgsIGRpcm5hbWUoWSkpXG5cblxuXHQgICAgICAgIGxvYWRlZCA9IHRoaXMubG9hZE5vZGVNb2R1bGVzKHJlcXVlc3QsIHRoaXMucGF0aHMpO1xuXG5cdCAgICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgICAgcmV0dXJuIGxvYWRlZC5leHBvcnRzO1xuXHQgICAgICAgIH0gLy8gRmFsbGJhY2sgdG8gb2xkIFRpdGFuaXVtIGJlaGF2aW9yIG9mIGFzc3VtaW5nIGl0J3MgYWN0dWFsbHkgYW4gYWJzb2x1dGUgcGF0aFxuXHQgICAgICAgIC8vIFdlJ2QgbGlrZSB0byB3YXJuIHVzZXJzIGFib3V0IGxlZ2FjeSBzdHlsZSByZXF1aXJlIHN5bnRheCBzbyB0aGV5IGNhbiB1cGRhdGUsIGJ1dCB0aGUgbmV3IHN5bnRheCBpcyBub3QgYmFja3dhcmRzIGNvbXBhdGlibGUuXG5cdCAgICAgICAgLy8gU28gZm9yIG5vdywgbGV0J3MganVzdCBiZSBxdWl0ZSBhYm91dCBpdC4gSW4gZnV0dXJlIHZlcnNpb25zIG9mIHRoZSBTREsgKDcuMD8pIHdlIHNob3VsZCB3YXJuIChvbmNlIDUueCBpcyBlbmQgb2YgbGlmZSBzbyBiYWNrd2FyZHMgY29tcGF0IGlzIG5vdCBuZWNlc3NhcnkpXG5cdCAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG1heC1sZW5cblx0ICAgICAgICAvLyBjb25zb2xlLndhcm4oYHJlcXVpcmUgY2FsbGVkIHdpdGggdW4tcHJlZml4ZWQgbW9kdWxlIGlkOiAke3JlcXVlc3R9LCBzaG91bGQgYmUgYSBjb3JlIG9yIENvbW1vbkpTIG1vZHVsZS4gRmFsbGluZyBiYWNrIHRvIG9sZCBUaSBiZWhhdmlvciBhbmQgYXNzdW1pbmcgaXQncyBhbiBhYnNvbHV0ZSBwYXRoOiAvJHtyZXF1ZXN0fWApO1xuXG5cblx0ICAgICAgICBsb2FkZWQgPSB0aGlzLmxvYWRBc0ZpbGVPckRpcmVjdG9yeShwYXRoLm5vcm1hbGl6ZShgLyR7cmVxdWVzdH1gKSk7XG5cblx0ICAgICAgICBpZiAobG9hZGVkKSB7XG5cdCAgICAgICAgICByZXR1cm4gbG9hZGVkLmV4cG9ydHM7XG5cdCAgICAgICAgfVxuXHQgICAgICB9IC8vIDQuIFRIUk9XIFwibm90IGZvdW5kXCJcblxuXG5cdCAgICAgIHRocm93IG5ldyBFcnJvcihgUmVxdWVzdGVkIG1vZHVsZSBub3QgZm91bmQ6ICR7cmVxdWVzdH1gKTsgLy8gVE9ETyBTZXQgJ2NvZGUnIHByb3BlcnR5IHRvICdNT0RVTEVfTk9UX0ZPVU5EJyB0byBtYXRjaCBOb2RlP1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBMb2FkcyB0aGUgY29yZSBtb2R1bGUgaWYgaXQgZXhpc3RzLiBJZiBub3QsIHJldHVybnMgbnVsbC5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICBpZCBUaGUgcmVxdWVzdCBtb2R1bGUgaWRcblx0ICAgICAqIEByZXR1cm4ge09iamVjdH0gICAgdHJ1ZSBpZiB0aGUgbW9kdWxlIGlkIG1hdGNoZXMgYSBuYXRpdmUgb3IgQ29tbW9uSlMgbW9kdWxlIGlkLCAob3IgaXQncyBmaXJzdCBwYXRoIHNlZ21lbnQgZG9lcykuXG5cdCAgICAgKi9cblxuXG5cdCAgICBsb2FkQ29yZU1vZHVsZShpZCkge1xuXHQgICAgICAvLyBza2lwIGJhZCBpZHMsIHJlbGF0aXZlIGlkcywgYWJzb2x1dGUgaWRzLiBcIm5hdGl2ZVwiL1wiY29yZVwiIG1vZHVsZXMgc2hvdWxkIGJlIG9mIGZvcm0gXCJtb2R1bGUuaWRcIiBvciBcIm1vZHVsZS5pZC9zdWIuZmlsZS5qc1wiXG5cdCAgICAgIGlmICghaWQgfHwgaWQuc3RhcnRzV2l0aCgnLicpIHx8IGlkLnN0YXJ0c1dpdGgoJy8nKSkge1xuXHQgICAgICAgIHJldHVybiBudWxsO1xuXHQgICAgICB9IC8vIGNoZWNrIGlmIHdlIGhhdmUgYSBjYWNoZWQgY29weSBvZiB0aGUgd3JhcHBlclxuXG5cblx0ICAgICAgaWYgKHRoaXMud3JhcHBlckNhY2hlW2lkXSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLndyYXBwZXJDYWNoZVtpZF07XG5cdCAgICAgIH1cblxuXHQgICAgICBjb25zdCBwYXJ0cyA9IGlkLnNwbGl0KCcvJyk7XG5cdCAgICAgIGNvbnN0IGV4dGVybmFsQmluZGluZyA9IGtyb2xsLmV4dGVybmFsQmluZGluZyhwYXJ0c1swXSk7XG5cblx0ICAgICAgaWYgKGV4dGVybmFsQmluZGluZykge1xuXHQgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPT09IDEpIHtcblx0ICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIFwicm9vdFwiIG9mIGFuIGV4dGVybmFsIG1vZHVsZS4gSXQgY2FuIGxvb2sgbGlrZTpcblx0ICAgICAgICAgIC8vIHJlcXVlc3QoXCJjb20uZXhhbXBsZS5teW1vZHVsZVwiKVxuXHQgICAgICAgICAgLy8gV2UgY2FuIGxvYWQgYW5kIHJldHVybiBpdCByaWdodCBhd2F5IChjYWNoaW5nIG9jY3VycyBpbiB0aGUgY2FsbGVkIGZ1bmN0aW9uKS5cblx0ICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRFeHRlcm5hbE1vZHVsZShwYXJ0c1swXSwgZXh0ZXJuYWxCaW5kaW5nKTtcblx0ICAgICAgICB9IC8vIENvdWxkIGJlIGEgc3ViLW1vZHVsZSAoQ29tbW9uSlMpIG9mIGFuIGV4dGVybmFsIG5hdGl2ZSBtb2R1bGUuXG5cdCAgICAgICAgLy8gV2UgYWxsb3cgdGhhdCBzaW5jZSBUSU1PQi05NzMwLlxuXG5cblx0ICAgICAgICBpZiAoa3JvbGwuaXNFeHRlcm5hbENvbW1vbkpzTW9kdWxlKHBhcnRzWzBdKSkge1xuXHQgICAgICAgICAgY29uc3QgZXh0ZXJuYWxDb21tb25Kc0NvbnRlbnRzID0ga3JvbGwuZ2V0RXh0ZXJuYWxDb21tb25Kc01vZHVsZShpZCk7XG5cblx0ICAgICAgICAgIGlmIChleHRlcm5hbENvbW1vbkpzQ29udGVudHMpIHtcblx0ICAgICAgICAgICAgLy8gZm91bmQgaXRcblx0ICAgICAgICAgICAgLy8gRklYTUUgUmUtdXNlIGxvYWRBc0phdmFTY3JpcHRUZXh0P1xuXHQgICAgICAgICAgICBjb25zdCBtb2R1bGUgPSBuZXcgTW9kdWxlKGlkLCB0aGlzKTtcblx0ICAgICAgICAgICAgbW9kdWxlLmxvYWQoaWQsIGV4dGVybmFsQ29tbW9uSnNDb250ZW50cyk7XG5cdCAgICAgICAgICAgIHJldHVybiBtb2R1bGUuZXhwb3J0cztcblx0ICAgICAgICAgIH1cblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gbnVsbDsgLy8gZmFpbGVkIHRvIGxvYWRcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogQXR0ZW1wdHMgdG8gbG9hZCBhIG5vZGUgbW9kdWxlIGJ5IGlkIGZyb20gdGhlIHN0YXJ0aW5nIHBhdGhcblx0ICAgICAqIEBwYXJhbSAge3N0cmluZ30gbW9kdWxlSWQgICAgICAgVGhlIHBhdGggb2YgdGhlIG1vZHVsZSB0byBsb2FkLlxuXHQgICAgICogQHBhcmFtICB7c3RyaW5nW119IGRpcnMgICAgICAgcGF0aHMgdG8gc2VhcmNoXG5cdCAgICAgKiBAcmV0dXJuIHtNb2R1bGV8bnVsbH0gICAgICBUaGUgbW9kdWxlLCBpZiBsb2FkZWQuIG51bGwgaWYgbm90LlxuXHQgICAgICovXG5cblxuXHQgICAgbG9hZE5vZGVNb2R1bGVzKG1vZHVsZUlkLCBkaXJzKSB7XG5cdCAgICAgIC8vIDIuIGZvciBlYWNoIERJUiBpbiBESVJTOlxuXHQgICAgICBmb3IgKGNvbnN0IGRpciBvZiBkaXJzKSB7XG5cdCAgICAgICAgLy8gYS4gTE9BRF9BU19GSUxFKERJUi9YKVxuXHQgICAgICAgIC8vIGIuIExPQURfQVNfRElSRUNUT1JZKERJUi9YKVxuXHQgICAgICAgIGNvbnN0IG1vZCA9IHRoaXMubG9hZEFzRmlsZU9yRGlyZWN0b3J5KHBhdGguam9pbihkaXIsIG1vZHVsZUlkKSk7XG5cblx0ICAgICAgICBpZiAobW9kKSB7XG5cdCAgICAgICAgICByZXR1cm4gbW9kO1xuXHQgICAgICAgIH1cblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBEZXRlcm1pbmUgdGhlIHNldCBvZiBwYXRocyB0byBzZWFyY2ggZm9yIG5vZGVfbW9kdWxlc1xuXHQgICAgICogQHBhcmFtICB7c3RyaW5nfSBzdGFydERpciAgICAgICBUaGUgc3RhcnRpbmcgZGlyZWN0b3J5XG5cdCAgICAgKiBAcmV0dXJuIHtzdHJpbmdbXX0gICAgICAgICAgICAgIFRoZSBhcnJheSBvZiBwYXRocyB0byBzZWFyY2hcblx0ICAgICAqL1xuXG5cblx0ICAgIG5vZGVNb2R1bGVzUGF0aHMoc3RhcnREaXIpIHtcblx0ICAgICAgLy8gTWFrZSBzdXJlIHdlIGhhdmUgYW4gYWJzb2x1dGUgcGF0aCB0byBzdGFydCB3aXRoXG5cdCAgICAgIHN0YXJ0RGlyID0gcGF0aC5yZXNvbHZlKHN0YXJ0RGlyKTsgLy8gUmV0dXJuIGVhcmx5IGlmIHdlIGFyZSBhdCByb290LCB0aGlzIGF2b2lkcyBkb2luZyBhIHBvaW50bGVzcyBsb29wXG5cdCAgICAgIC8vIGFuZCBhbHNvIHJldHVybmluZyBhbiBhcnJheSB3aXRoIGR1cGxpY2F0ZSBlbnRyaWVzXG5cdCAgICAgIC8vIGUuZy4gW1wiL25vZGVfbW9kdWxlc1wiLCBcIi9ub2RlX21vZHVsZXNcIl1cblxuXHQgICAgICBpZiAoc3RhcnREaXIgPT09ICcvJykge1xuXHQgICAgICAgIHJldHVybiBbJy9ub2RlX21vZHVsZXMnXTtcblx0ICAgICAgfSAvLyAxLiBsZXQgUEFSVFMgPSBwYXRoIHNwbGl0KFNUQVJUKVxuXG5cblx0ICAgICAgY29uc3QgcGFydHMgPSBzdGFydERpci5zcGxpdCgnLycpOyAvLyAyLiBsZXQgSSA9IGNvdW50IG9mIFBBUlRTIC0gMVxuXG5cdCAgICAgIGxldCBpID0gcGFydHMubGVuZ3RoIC0gMTsgLy8gMy4gbGV0IERJUlMgPSBbXVxuXG5cdCAgICAgIGNvbnN0IGRpcnMgPSBbXTsgLy8gNC4gd2hpbGUgSSA+PSAwLFxuXG5cdCAgICAgIHdoaWxlIChpID49IDApIHtcblx0ICAgICAgICAvLyBhLiBpZiBQQVJUU1tJXSA9IFwibm9kZV9tb2R1bGVzXCIgQ09OVElOVUVcblx0ICAgICAgICBpZiAocGFydHNbaV0gPT09ICdub2RlX21vZHVsZXMnIHx8IHBhcnRzW2ldID09PSAnJykge1xuXHQgICAgICAgICAgaSAtPSAxO1xuXHQgICAgICAgICAgY29udGludWU7XG5cdCAgICAgICAgfSAvLyBiLiBESVIgPSBwYXRoIGpvaW4oUEFSVFNbMCAuLiBJXSArIFwibm9kZV9tb2R1bGVzXCIpXG5cblxuXHQgICAgICAgIGNvbnN0IGRpciA9IHBhdGguam9pbihwYXJ0cy5zbGljZSgwLCBpICsgMSkuam9pbignLycpLCAnbm9kZV9tb2R1bGVzJyk7IC8vIGMuIERJUlMgPSBESVJTICsgRElSXG5cblx0ICAgICAgICBkaXJzLnB1c2goZGlyKTsgLy8gZC4gbGV0IEkgPSBJIC0gMVxuXG5cdCAgICAgICAgaSAtPSAxO1xuXHQgICAgICB9IC8vIEFsd2F5cyBhZGQgL25vZGVfbW9kdWxlcyB0byB0aGUgc2VhcmNoIHBhdGhcblxuXG5cdCAgICAgIGRpcnMucHVzaCgnL25vZGVfbW9kdWxlcycpO1xuXHQgICAgICByZXR1cm4gZGlycztcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogQXR0ZW1wdHMgdG8gbG9hZCBhIGdpdmVuIHBhdGggYXMgYSBmaWxlIG9yIGRpcmVjdG9yeS5cblx0ICAgICAqIEBwYXJhbSAge3N0cmluZ30gbm9ybWFsaXplZFBhdGggVGhlIHBhdGggb2YgdGhlIG1vZHVsZSB0byBsb2FkLlxuXHQgICAgICogQHJldHVybiB7TW9kdWxlfG51bGx9IFRoZSBsb2FkZWQgbW9kdWxlLiBudWxsIGlmIHVuYWJsZSB0byBsb2FkLlxuXHQgICAgICovXG5cblxuXHQgICAgbG9hZEFzRmlsZU9yRGlyZWN0b3J5KG5vcm1hbGl6ZWRQYXRoKSB7XG5cdCAgICAgIC8vIGEuIExPQURfQVNfRklMRShZICsgWClcblx0ICAgICAgbGV0IGxvYWRlZCA9IHRoaXMubG9hZEFzRmlsZShub3JtYWxpemVkUGF0aCk7XG5cblx0ICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgIHJldHVybiBsb2FkZWQ7XG5cdCAgICAgIH0gLy8gYi4gTE9BRF9BU19ESVJFQ1RPUlkoWSArIFgpXG5cblxuXHQgICAgICBsb2FkZWQgPSB0aGlzLmxvYWRBc0RpcmVjdG9yeShub3JtYWxpemVkUGF0aCk7XG5cblx0ICAgICAgaWYgKGxvYWRlZCkge1xuXHQgICAgICAgIHJldHVybiBsb2FkZWQ7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gbnVsbDtcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogTG9hZHMgYSBnaXZlbiBmaWxlIGFzIGEgSmF2YXNjcmlwdCBmaWxlLCByZXR1cm5pbmcgdGhlIG1vZHVsZS5leHBvcnRzLlxuXHQgICAgICogQHBhcmFtICB7c3RyaW5nfSBmaWxlbmFtZSBGaWxlIHdlJ3JlIGF0dGVtcHRpbmcgdG8gbG9hZFxuXHQgICAgICogQHJldHVybiB7TW9kdWxlfSB0aGUgbG9hZGVkIG1vZHVsZVxuXHQgICAgICovXG5cblxuXHQgICAgbG9hZEphdmFzY3JpcHRUZXh0KGZpbGVuYW1lKSB7XG5cdCAgICAgIC8vIExvb2sgaW4gdGhlIGNhY2hlIVxuXHQgICAgICBpZiAoTW9kdWxlLmNhY2hlW2ZpbGVuYW1lXSkge1xuXHQgICAgICAgIHJldHVybiBNb2R1bGUuY2FjaGVbZmlsZW5hbWVdO1xuXHQgICAgICB9XG5cblx0ICAgICAgY29uc3QgbW9kdWxlID0gbmV3IE1vZHVsZShmaWxlbmFtZSwgdGhpcyk7XG5cdCAgICAgIG1vZHVsZS5sb2FkKGZpbGVuYW1lKTtcblx0ICAgICAgcmV0dXJuIG1vZHVsZTtcblx0ICAgIH1cblx0ICAgIC8qKlxuXHQgICAgICogTG9hZHMgYSBKU09OIGZpbGUgYnkgcmVhZGluZyBpdCdzIGNvbnRlbnRzLCBkb2luZyBhIEpTT04ucGFyc2UgYW5kIHJldHVybmluZyB0aGUgcGFyc2VkIG9iamVjdC5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGZpbGVuYW1lIEZpbGUgd2UncmUgYXR0ZW1wdGluZyB0byBsb2FkXG5cdCAgICAgKiBAcmV0dXJuIHtNb2R1bGV9IFRoZSBsb2FkZWQgbW9kdWxlIGluc3RhbmNlXG5cdCAgICAgKi9cblxuXG5cdCAgICBsb2FkSmF2YXNjcmlwdE9iamVjdChmaWxlbmFtZSkge1xuXHQgICAgICAvLyBMb29rIGluIHRoZSBjYWNoZSFcblx0ICAgICAgaWYgKE1vZHVsZS5jYWNoZVtmaWxlbmFtZV0pIHtcblx0ICAgICAgICByZXR1cm4gTW9kdWxlLmNhY2hlW2ZpbGVuYW1lXTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGNvbnN0IG1vZHVsZSA9IG5ldyBNb2R1bGUoZmlsZW5hbWUsIHRoaXMpO1xuXHQgICAgICBtb2R1bGUuZmlsZW5hbWUgPSBmaWxlbmFtZTtcblx0ICAgICAgbW9kdWxlLnBhdGggPSBwYXRoLmRpcm5hbWUoZmlsZW5hbWUpO1xuXHQgICAgICBjb25zdCBzb3VyY2UgPSBhc3NldHMucmVhZEFzc2V0KGBSZXNvdXJjZXMke2ZpbGVuYW1lfWAgKTsgLy8gU3RpY2sgaXQgaW4gdGhlIGNhY2hlXG5cblx0ICAgICAgTW9kdWxlLmNhY2hlW2ZpbGVuYW1lXSA9IG1vZHVsZTtcblx0ICAgICAgbW9kdWxlLmV4cG9ydHMgPSBKU09OLnBhcnNlKHNvdXJjZSk7XG5cdCAgICAgIG1vZHVsZS5sb2FkZWQgPSB0cnVlO1xuXHQgICAgICByZXR1cm4gbW9kdWxlO1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBBdHRlbXB0cyB0byBsb2FkIGEgZmlsZSBieSBpdCdzIGZ1bGwgZmlsZW5hbWUgYWNjb3JkaW5nIHRvIE5vZGVKUyBydWxlcy5cblx0ICAgICAqXG5cdCAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGlkIFRoZSBmaWxlbmFtZVxuXHQgICAgICogQHJldHVybiB7TW9kdWxlfG51bGx9IE1vZHVsZSBpbnN0YW5jZSBpZiBsb2FkZWQsIG51bGwgaWYgbm90IGZvdW5kLlxuXHQgICAgICovXG5cblxuXHQgICAgbG9hZEFzRmlsZShpZCkge1xuXHQgICAgICAvLyAxLiBJZiBYIGlzIGEgZmlsZSwgbG9hZCBYIGFzIEphdmFTY3JpcHQgdGV4dC4gIFNUT1Bcblx0ICAgICAgbGV0IGZpbGVuYW1lID0gaWQ7XG5cblx0ICAgICAgaWYgKHRoaXMuZmlsZW5hbWVFeGlzdHMoZmlsZW5hbWUpKSB7XG5cdCAgICAgICAgLy8gSWYgdGhlIGZpbGUgaGFzIGEgLmpzb24gZXh0ZW5zaW9uLCBsb2FkIGFzIEphdmFzY3JpcHRPYmplY3Rcblx0ICAgICAgICBpZiAoZmlsZW5hbWUubGVuZ3RoID4gNSAmJiBmaWxlbmFtZS5zbGljZSgtNCkgPT09ICdqc29uJykge1xuXHQgICAgICAgICAgcmV0dXJuIHRoaXMubG9hZEphdmFzY3JpcHRPYmplY3QoZmlsZW5hbWUpO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIHJldHVybiB0aGlzLmxvYWRKYXZhc2NyaXB0VGV4dChmaWxlbmFtZSk7XG5cdCAgICAgIH0gLy8gMi4gSWYgWC5qcyBpcyBhIGZpbGUsIGxvYWQgWC5qcyBhcyBKYXZhU2NyaXB0IHRleHQuICBTVE9QXG5cblxuXHQgICAgICBmaWxlbmFtZSA9IGlkICsgJy5qcyc7XG5cblx0ICAgICAgaWYgKHRoaXMuZmlsZW5hbWVFeGlzdHMoZmlsZW5hbWUpKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMubG9hZEphdmFzY3JpcHRUZXh0KGZpbGVuYW1lKTtcblx0ICAgICAgfSAvLyAzLiBJZiBYLmpzb24gaXMgYSBmaWxlLCBwYXJzZSBYLmpzb24gdG8gYSBKYXZhU2NyaXB0IE9iamVjdC4gIFNUT1BcblxuXG5cdCAgICAgIGZpbGVuYW1lID0gaWQgKyAnLmpzb24nO1xuXG5cdCAgICAgIGlmICh0aGlzLmZpbGVuYW1lRXhpc3RzKGZpbGVuYW1lKSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzLmxvYWRKYXZhc2NyaXB0T2JqZWN0KGZpbGVuYW1lKTtcblx0ICAgICAgfSAvLyBmYWlsZWQgdG8gbG9hZCBhbnl0aGluZyFcblxuXG5cdCAgICAgIHJldHVybiBudWxsO1xuXHQgICAgfVxuXHQgICAgLyoqXG5cdCAgICAgKiBBdHRlbXB0cyB0byBsb2FkIGEgZGlyZWN0b3J5IGFjY29yZGluZyB0byBOb2RlSlMgcnVsZXMuXG5cdCAgICAgKlxuXHQgICAgICogQHBhcmFtICB7c3RyaW5nfSBpZCBUaGUgZGlyZWN0b3J5IG5hbWVcblx0ICAgICAqIEByZXR1cm4ge01vZHVsZXxudWxsfSBMb2FkZWQgbW9kdWxlLCBudWxsIGlmIG5vdCBmb3VuZC5cblx0ICAgICAqL1xuXG5cblx0ICAgIGxvYWRBc0RpcmVjdG9yeShpZCkge1xuXHQgICAgICAvLyAxLiBJZiBYL3BhY2thZ2UuanNvbiBpcyBhIGZpbGUsXG5cdCAgICAgIGxldCBmaWxlbmFtZSA9IHBhdGgucmVzb2x2ZShpZCwgJ3BhY2thZ2UuanNvbicpO1xuXG5cdCAgICAgIGlmICh0aGlzLmZpbGVuYW1lRXhpc3RzKGZpbGVuYW1lKSkge1xuXHQgICAgICAgIC8vIGEuIFBhcnNlIFgvcGFja2FnZS5qc29uLCBhbmQgbG9vayBmb3IgXCJtYWluXCIgZmllbGQuXG5cdCAgICAgICAgY29uc3Qgb2JqZWN0ID0gdGhpcy5sb2FkSmF2YXNjcmlwdE9iamVjdChmaWxlbmFtZSk7XG5cblx0ICAgICAgICBpZiAob2JqZWN0ICYmIG9iamVjdC5leHBvcnRzICYmIG9iamVjdC5leHBvcnRzLm1haW4pIHtcblx0ICAgICAgICAgIC8vIGIuIGxldCBNID0gWCArIChqc29uIG1haW4gZmllbGQpXG5cdCAgICAgICAgICBjb25zdCBtID0gcGF0aC5yZXNvbHZlKGlkLCBvYmplY3QuZXhwb3J0cy5tYWluKTsgLy8gYy4gTE9BRF9BU19GSUxFKE0pXG5cblx0ICAgICAgICAgIHJldHVybiB0aGlzLmxvYWRBc0ZpbGVPckRpcmVjdG9yeShtKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH0gLy8gMi4gSWYgWC9pbmRleC5qcyBpcyBhIGZpbGUsIGxvYWQgWC9pbmRleC5qcyBhcyBKYXZhU2NyaXB0IHRleHQuICBTVE9QXG5cblxuXHQgICAgICBmaWxlbmFtZSA9IHBhdGgucmVzb2x2ZShpZCwgJ2luZGV4LmpzJyk7XG5cblx0ICAgICAgaWYgKHRoaXMuZmlsZW5hbWVFeGlzdHMoZmlsZW5hbWUpKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMubG9hZEphdmFzY3JpcHRUZXh0KGZpbGVuYW1lKTtcblx0ICAgICAgfSAvLyAzLiBJZiBYL2luZGV4Lmpzb24gaXMgYSBmaWxlLCBwYXJzZSBYL2luZGV4Lmpzb24gdG8gYSBKYXZhU2NyaXB0IG9iamVjdC4gU1RPUFxuXG5cblx0ICAgICAgZmlsZW5hbWUgPSBwYXRoLnJlc29sdmUoaWQsICdpbmRleC5qc29uJyk7XG5cblx0ICAgICAgaWYgKHRoaXMuZmlsZW5hbWVFeGlzdHMoZmlsZW5hbWUpKSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXMubG9hZEphdmFzY3JpcHRPYmplY3QoZmlsZW5hbWUpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIG51bGw7XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIFNldHVwIGEgc2FuZGJveCBhbmQgcnVuIHRoZSBtb2R1bGUncyBzY3JpcHQgaW5zaWRlIGl0LlxuXHQgICAgICogUmV0dXJucyB0aGUgcmVzdWx0IG9mIHRoZSBleGVjdXRlZCBzY3JpcHQuXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHNvdXJjZSAgIFtkZXNjcmlwdGlvbl1cblx0ICAgICAqIEBwYXJhbSAge1N0cmluZ30gZmlsZW5hbWUgW2Rlc2NyaXB0aW9uXVxuXHQgICAgICogQHJldHVybiB7Kn0gICAgICAgICAgW2Rlc2NyaXB0aW9uXVxuXHQgICAgICovXG5cblxuXHQgICAgX3J1blNjcmlwdChzb3VyY2UsIGZpbGVuYW1lKSB7XG5cdCAgICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuXG5cdCAgICAgIGZ1bmN0aW9uIHJlcXVpcmUocGF0aCkge1xuXHQgICAgICAgIHJldHVybiBzZWxmLnJlcXVpcmUocGF0aCk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXF1aXJlLm1haW4gPSBNb2R1bGUubWFpbjsgLy8gVGhpcyBcImZpcnN0IHRpbWVcIiBydW4gaXMgcmVhbGx5IG9ubHkgZm9yIGFwcC5qcywgQUZBSUNULCBhbmQgbmVlZHNcblx0ICAgICAgLy8gYW4gYWN0aXZpdHkuIElmIGFwcCB3YXMgcmVzdGFydGVkIGZvciBTZXJ2aWNlIG9ubHksIHdlIGRvbid0IHdhbnRcblx0ICAgICAgLy8gdG8gZ28gdGhpcyByb3V0ZS4gU28gYWRkZWQgY3VycmVudEFjdGl2aXR5IGNoZWNrLiAoYmlsbClcblxuXHQgICAgICBpZiAoc2VsZi5pZCA9PT0gJy4nICYmICF0aGlzLmlzU2VydmljZSkge1xuXHQgICAgICAgIGdsb2JhbC5yZXF1aXJlID0gcmVxdWlyZTsgLy8gY2hlY2sgaWYgd2UgaGF2ZSBhbiBpbnNwZWN0b3IgYmluZGluZy4uLlxuXG5cdCAgICAgICAgY29uc3QgaW5zcGVjdG9yID0ga3JvbGwuYmluZGluZygnaW5zcGVjdG9yJyk7XG5cblx0ICAgICAgICBpZiAoaW5zcGVjdG9yKSB7XG5cdCAgICAgICAgICAvLyBJZiBkZWJ1Z2dlciBpcyBlbmFibGVkLCBsb2FkIGFwcC5qcyBhbmQgcGF1c2UgcmlnaHQgYmVmb3JlIHdlIGV4ZWN1dGUgaXRcblx0ICAgICAgICAgIGNvbnN0IGluc3BlY3RvcldyYXBwZXIgPSBpbnNwZWN0b3IuY2FsbEFuZFBhdXNlT25TdGFydDtcblxuXHQgICAgICAgICAgaWYgKGluc3BlY3RvcldyYXBwZXIpIHtcblx0ICAgICAgICAgICAgLy8gRklYTUUgV2h5IGNhbid0IHdlIGRvIG5vcm1hbCBNb2R1bGUud3JhcChzb3VyY2UpIGhlcmU/XG5cdCAgICAgICAgICAgIC8vIEkgZ2V0IFwiVW5jYXVnaHQgVHlwZUVycm9yOiBDYW5ub3QgcmVhZCBwcm9wZXJ0eSAnY3JlYXRlVGFiR3JvdXAnIG9mIHVuZGVmaW5lZFwiIGZvciBcIlRpLlVJLmNyZWF0ZVRhYkdyb3VwKCk7XCJcblx0ICAgICAgICAgICAgLy8gTm90IHN1cmUgd2h5IGFwcC5qcyBpcyBzcGVjaWFsIGNhc2UgYW5kIGNhbid0IGJlIHJ1biB1bmRlciBub3JtYWwgc2VsZi1pbnZva2luZyB3cmFwcGluZyBmdW5jdGlvbiB0aGF0IGdldHMgcGFzc2VkIGluIGdsb2JhbC9rcm9sbC9UaS9ldGNcblx0ICAgICAgICAgICAgLy8gSW5zdGVhZCwgbGV0J3MgdXNlIGEgc2xpZ2h0bHkgbW9kaWZpZWQgdmVyc2lvbiBvZiBjYWxsQW5kUGF1c2VPblN0YXJ0OlxuXHQgICAgICAgICAgICAvLyBJdCB3aWxsIGNvbXBpbGUgdGhlIHNvdXJjZSBhcy1pcywgc2NoZWR1bGUgYSBwYXVzZSBhbmQgdGhlbiBydW4gdGhlIHNvdXJjZS5cblx0ICAgICAgICAgICAgcmV0dXJuIGluc3BlY3RvcldyYXBwZXIoc291cmNlLCBmaWxlbmFtZSk7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSAvLyBydW4gYXBwLmpzIFwibm9ybWFsbHlcIiAoaS5lLiBub3QgdW5kZXIgZGVidWdnZXIvaW5zcGVjdG9yKVxuXG5cblx0ICAgICAgICByZXR1cm4gU2NyaXB0LnJ1bkluVGhpc0NvbnRleHQoc291cmNlLCBmaWxlbmFtZSwgdHJ1ZSk7XG5cdCAgICAgIH0gLy8gSW4gVjgsIHdlIHRyZWF0IGV4dGVybmFsIG1vZHVsZXMgdGhlIHNhbWUgYXMgbmF0aXZlIG1vZHVsZXMuICBGaXJzdCwgd2Ugd3JhcCB0aGVcblx0ICAgICAgLy8gbW9kdWxlIGNvZGUgYW5kIHRoZW4gcnVuIGl0IGluIHRoZSBjdXJyZW50IGNvbnRleHQuICBUaGlzIHdpbGwgYWxsb3cgZXh0ZXJuYWwgbW9kdWxlcyB0b1xuXHQgICAgICAvLyBhY2Nlc3MgZ2xvYmFscyBhcyBtZW50aW9uZWQgaW4gVElNT0ItMTE3NTIuIFRoaXMgd2lsbCBhbHNvIGhlbHAgcmVzb2x2ZSBzdGFydHVwIHNsb3duZXNzIHRoYXRcblx0ICAgICAgLy8gb2NjdXJzIGFzIGEgcmVzdWx0IG9mIGNyZWF0aW5nIGEgbmV3IGNvbnRleHQgZHVyaW5nIHN0YXJ0dXAgaW4gVElNT0ItMTIyODYuXG5cblxuXHQgICAgICBzb3VyY2UgPSBNb2R1bGUud3JhcChzb3VyY2UpO1xuXHQgICAgICBjb25zdCBmID0gU2NyaXB0LnJ1bkluVGhpc0NvbnRleHQoc291cmNlLCBmaWxlbmFtZSwgdHJ1ZSk7XG5cdCAgICAgIHJldHVybiBmKHRoaXMuZXhwb3J0cywgcmVxdWlyZSwgdGhpcywgZmlsZW5hbWUsIHBhdGguZGlybmFtZShmaWxlbmFtZSksIFRpdGFuaXVtLCBUaSwgZ2xvYmFsLCBrcm9sbCk7XG5cdCAgICB9XG5cdCAgICAvKipcblx0ICAgICAqIExvb2sgdXAgYSBmaWxlbmFtZSBpbiB0aGUgYXBwJ3MgaW5kZXguanNvbiBmaWxlXG5cdCAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGZpbGVuYW1lIHRoZSBmaWxlIHdlJ3JlIGxvb2tpbmcgZm9yXG5cdCAgICAgKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICAgIHRydWUgaWYgdGhlIGZpbGVuYW1lIGV4aXN0cyBpbiB0aGUgaW5kZXguanNvblxuXHQgICAgICovXG5cblxuXHQgICAgZmlsZW5hbWVFeGlzdHMoZmlsZW5hbWUpIHtcblx0ICAgICAgZmlsZW5hbWUgPSAnUmVzb3VyY2VzJyArIGZpbGVuYW1lOyAvLyBXaGVuIHdlIGFjdHVhbGx5IGxvb2sgZm9yIGZpbGVzLCBhc3N1bWUgXCJSZXNvdXJjZXMvXCIgaXMgdGhlIHJvb3RcblxuXHQgICAgICBpZiAoIWZpbGVJbmRleCkge1xuXHQgICAgICAgIGNvbnN0IGpzb24gPSBhc3NldHMucmVhZEFzc2V0KElOREVYX0pTT04pO1xuXHQgICAgICAgIGZpbGVJbmRleCA9IEpTT04ucGFyc2UoanNvbik7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gZmlsZUluZGV4ICYmIGZpbGVuYW1lIGluIGZpbGVJbmRleDtcblx0ICAgIH1cblxuXHQgIH1cblxuXHQgIE1vZHVsZS5jYWNoZSA9IFtdO1xuXHQgIE1vZHVsZS5tYWluID0gbnVsbDtcblx0ICBNb2R1bGUud3JhcHBlciA9IFsnKGZ1bmN0aW9uIChleHBvcnRzLCByZXF1aXJlLCBtb2R1bGUsIF9fZmlsZW5hbWUsIF9fZGlybmFtZSwgVGl0YW5pdW0sIFRpLCBnbG9iYWwsIGtyb2xsKSB7JywgJ1xcbn0pOyddO1xuXG5cdCAgTW9kdWxlLndyYXAgPSBmdW5jdGlvbiAoc2NyaXB0KSB7XG5cdCAgICByZXR1cm4gTW9kdWxlLndyYXBwZXJbMF0gKyBzY3JpcHQgKyBNb2R1bGUud3JhcHBlclsxXTtcblx0ICB9O1xuXHQgIC8qKlxuXHQgICAqIFtydW5Nb2R1bGUgZGVzY3JpcHRpb25dXG5cdCAgICogQHBhcmFtICB7U3RyaW5nfSBzb3VyY2UgICAgICAgICAgICBKUyBTb3VyY2UgY29kZVxuXHQgICAqIEBwYXJhbSAge1N0cmluZ30gZmlsZW5hbWUgICAgICAgICAgRmlsZW5hbWUgb2YgdGhlIG1vZHVsZVxuXHQgICAqIEBwYXJhbSAge1RpdGFuaXVtLlNlcnZpY2V8bnVsbHxUaXRhbml1bS5BbmRyb2lkLkFjdGl2aXR5fSBhY3Rpdml0eU9yU2VydmljZSBbZGVzY3JpcHRpb25dXG5cdCAgICogQHJldHVybiB7TW9kdWxlfSAgICAgICAgICAgICAgICAgICBUaGUgbG9hZGVkIE1vZHVsZVxuXHQgICAqL1xuXG5cblx0ICBNb2R1bGUucnVuTW9kdWxlID0gZnVuY3Rpb24gKHNvdXJjZSwgZmlsZW5hbWUsIGFjdGl2aXR5T3JTZXJ2aWNlKSB7XG5cdCAgICBsZXQgaWQgPSBmaWxlbmFtZTtcblxuXHQgICAgaWYgKCFNb2R1bGUubWFpbikge1xuXHQgICAgICBpZCA9ICcuJztcblx0ICAgIH1cblxuXHQgICAgY29uc3QgbW9kdWxlID0gbmV3IE1vZHVsZShpZCwgbnVsbCk7IC8vIEZJWE1FOiBJIGRvbid0IGtub3cgd2h5IGluc3RhbmNlb2YgZm9yIFRpdGFuaXVtLlNlcnZpY2Ugd29ya3MgaGVyZSFcblx0ICAgIC8vIE9uIEFuZHJvaWQsIGl0J3MgYW4gYXBpbmFtZSBvZiBUaS5BbmRyb2lkLlNlcnZpY2Vcblx0ICAgIC8vIE9uIGlPUywgd2UgZG9uJ3QgeWV0IHBhc3MgaW4gdGhlIHZhbHVlLCBidXQgd2UgZG8gc2V0IFRpLkFwcC5jdXJyZW50U2VydmljZSBwcm9wZXJ0eSBiZWZvcmVoYW5kIVxuXHQgICAgLy8gQ2FuIHdlIHJlbW92ZSB0aGUgcHJlbG9hZCBzdHVmZiBpbiBLcm9sbEJyaWRnZS5tIHRvIHBhc3MgYWxvbmcgdGhlIHNlcnZpY2UgaW5zdGFuY2UgaW50byB0aGlzIGxpa2Ugd2UgZG8gb24gQW5kb3JpZD9cblxuXHQgICAgbW9kdWxlLmlzU2VydmljZSA9IGFjdGl2aXR5T3JTZXJ2aWNlIGluc3RhbmNlb2YgVGl0YW5pdW0uU2VydmljZSA7XG5cblx0ICAgIHtcblx0ICAgICAgaWYgKG1vZHVsZS5pc1NlcnZpY2UpIHtcblx0ICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGkuQW5kcm9pZCwgJ2N1cnJlbnRTZXJ2aWNlJywge1xuXHQgICAgICAgICAgdmFsdWU6IGFjdGl2aXR5T3JTZXJ2aWNlLFxuXHQgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuXHQgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFRpLkFuZHJvaWQsICdjdXJyZW50U2VydmljZScsIHtcblx0ICAgICAgICAgIHZhbHVlOiBudWxsLFxuXHQgICAgICAgICAgd3JpdGFibGU6IGZhbHNlLFxuXHQgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG5cdCAgICAgICAgfSk7XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgaWYgKCFNb2R1bGUubWFpbikge1xuXHQgICAgICBNb2R1bGUubWFpbiA9IG1vZHVsZTtcblx0ICAgIH1cblxuXHQgICAgZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKCdSZXNvdXJjZXMvJywgJy8nKTsgLy8gbm9ybWFsaXplIGJhY2sgdG8gYWJzb2x1dGUgcGF0aHMgKHdoaWNoIHJlYWxseSBhcmUgcmVsYXRpdmUgdG8gUmVzb3VyY2VzIHVuZGVyIHRoZSBob29kKVxuXG5cdCAgICBtb2R1bGUubG9hZChmaWxlbmFtZSwgc291cmNlKTtcblxuXHQgICAge1xuXHQgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVGkuQW5kcm9pZCwgJ2N1cnJlbnRTZXJ2aWNlJywge1xuXHQgICAgICAgIHZhbHVlOiBudWxsLFxuXHQgICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcblx0ICAgICAgICBjb25maWd1cmFibGU6IHRydWVcblx0ICAgICAgfSk7XG5cdCAgICB9XG5cblx0ICAgIHJldHVybiBtb2R1bGU7XG5cdCAgfTtcblxuXHQgIHJldHVybiBNb2R1bGU7XG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBoYW5ncyB0aGUgUHJveHkgdHlwZSBvZmYgVGkgbmFtZXNwYWNlLiBJdCBhbHNvIGdlbmVyYXRlcyBhIGhpZGRlbiBfcHJvcGVydGllcyBvYmplY3Rcblx0ICogdGhhdCBpcyB1c2VkIHRvIHN0b3JlIHByb3BlcnR5IHZhbHVlcyBvbiB0aGUgSlMgc2lkZSBmb3IgamF2YSBQcm94aWVzLlxuXHQgKiBCYXNpY2FsbHkgdGhlc2UgZ2V0L3NldCBtZXRob2RzIGFyZSBmYWxsYmFja3MgZm9yIHdoZW4gYSBKYXZhIHByb3h5IGRvZXNuJ3QgaGF2ZSBhIG5hdGl2ZSBtZXRob2QgdG8gaGFuZGxlIGdldHRpbmcvc2V0dGluZyB0aGUgcHJvcGVydHkuXG5cdCAqIChzZWUgUHJveHkuaC9Qcm94eUJpbmRpbmdWOC5jcHAuZm0gZm9yIG1vcmUgaW5mbylcblx0ICogQHBhcmFtIHtvYmplY3R9IHRpQmluZGluZyB0aGUgdW5kZXJseWluZyAnVGl0YW5pdW0nIG5hdGl2ZSBiaW5kaW5nIChzZWUgS3JvbGxCaW5kaW5nczo6aW5pdFRpdGFuaXVtKVxuXHQgKiBAcGFyYW0ge29iamVjdH0gVGkgdGhlIGdsb2JhbC5UaXRhbml1bSBvYmplY3Rcblx0ICovXG5cdGZ1bmN0aW9uIFByb3h5Qm9vdHN0cmFwKHRpQmluZGluZywgVGkpIHtcblx0ICBjb25zdCBQcm94eSA9IHRpQmluZGluZy5Qcm94eTtcblx0ICBUaS5Qcm94eSA9IFByb3h5O1xuXG5cdCAgUHJveHkuZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIChwcm94eVByb3RvdHlwZSwgbmFtZXMpIHtcblx0ICAgIGNvbnN0IHByb3BlcnRpZXMgPSB7fTtcblx0ICAgIGNvbnN0IGxlbiA9IG5hbWVzLmxlbmd0aDtcblxuXHQgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuXHQgICAgICBjb25zdCBuYW1lID0gbmFtZXNbaV07XG5cdCAgICAgIHByb3BlcnRpZXNbbmFtZV0gPSB7XG5cdCAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG5cdCAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWxvb3AtZnVuY1xuXHQgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UHJvcGVydHkobmFtZSk7XG5cdCAgICAgICAgfSxcblx0ICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuXHQgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1sb29wLWZ1bmNcblx0ICAgICAgICAgIHRoaXMuc2V0UHJvcGVydHlBbmRGaXJlKG5hbWUsIHZhbHVlKTtcblx0ICAgICAgICB9LFxuXHQgICAgICAgIGVudW1lcmFibGU6IHRydWVcblx0ICAgICAgfTtcblx0ICAgIH1cblxuXHQgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMocHJveHlQcm90b3R5cGUsIHByb3BlcnRpZXMpO1xuXHQgIH07XG5cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUHJveHkucHJvdG90eXBlLCAnZ2V0UHJvcGVydHknLCB7XG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gKHByb3BlcnR5KSB7XG5cdCAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5XTtcblx0ICAgIH0sXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pO1xuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm94eS5wcm90b3R5cGUsICdzZXRQcm9wZXJ0eScsIHtcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiAocHJvcGVydHksIHZhbHVlKSB7XG5cdCAgICAgIHJldHVybiB0aGlzLl9wcm9wZXJ0aWVzW3Byb3BlcnR5XSA9IHZhbHVlO1xuXHQgICAgfSxcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlXG5cdCAgfSk7XG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFByb3h5LnByb3RvdHlwZSwgJ3NldFByb3BlcnRpZXNBbmRGaXJlJywge1xuXHQgICAgdmFsdWU6IGZ1bmN0aW9uIChwcm9wZXJ0aWVzKSB7XG5cdCAgICAgIGNvbnN0IG93bk5hbWVzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvcGVydGllcyk7XG5cdCAgICAgIGNvbnN0IGxlbiA9IG93bk5hbWVzLmxlbmd0aDtcblx0ICAgICAgY29uc3QgY2hhbmdlcyA9IFtdO1xuXG5cdCAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcblx0ICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IG93bk5hbWVzW2ldO1xuXHQgICAgICAgIGNvbnN0IHZhbHVlID0gcHJvcGVydGllc1twcm9wZXJ0eV07XG5cblx0ICAgICAgICBpZiAoIXByb3BlcnR5KSB7XG5cdCAgICAgICAgICBjb250aW51ZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBjb25zdCBvbGRWYWx1ZSA9IHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHldO1xuXHQgICAgICAgIHRoaXMuX3Byb3BlcnRpZXNbcHJvcGVydHldID0gdmFsdWU7XG5cblx0ICAgICAgICBpZiAodmFsdWUgIT09IG9sZFZhbHVlKSB7XG5cdCAgICAgICAgICBjaGFuZ2VzLnB1c2goW3Byb3BlcnR5LCBvbGRWYWx1ZSwgdmFsdWVdKTtcblx0ICAgICAgICB9XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoY2hhbmdlcy5sZW5ndGggPiAwKSB7XG5cdCAgICAgICAgdGhpcy5vblByb3BlcnRpZXNDaGFuZ2VkKGNoYW5nZXMpO1xuXHQgICAgICB9XG5cdCAgICB9LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTtcblx0fVxuXG5cdC8qIGdsb2JhbHMgT1NfQU5EUk9JRCxPU19JT1MgKi9cblx0ZnVuY3Rpb24gYm9vdHN0cmFwJDEoZ2xvYmFsLCBrcm9sbCkge1xuXHQgIHtcblx0ICAgIGNvbnN0IHRpQmluZGluZyA9IGtyb2xsLmJpbmRpbmcoJ1RpdGFuaXVtJyk7XG5cdCAgICBjb25zdCBUaSA9IHRpQmluZGluZy5UaXRhbml1bTtcblxuXHQgICAgY29uc3QgYm9vdHN0cmFwID0ga3JvbGwuTmF0aXZlTW9kdWxlLnJlcXVpcmUoJ2Jvb3RzdHJhcCcpOyAvLyBUaGUgYm9vdHN0cmFwIGRlZmluZXMgbGF6eSBuYW1lc3BhY2UgcHJvcGVydHkgdHJlZSAqKmFuZCoqXG5cdCAgICAvLyBzZXRzIHVwIHNwZWNpYWwgQVBJcyB0aGF0IGdldCB3cmFwcGVkIHRvIHBhc3MgYWxvbmcgc291cmNlVXJsIHZpYSBhIEtyb2xsSW52b2NhdGlvbiBvYmplY3RcblxuXG5cdCAgICBib290c3RyYXAuYm9vdHN0cmFwKFRpKTtcblx0ICAgIGJvb3RzdHJhcC5kZWZpbmVMYXp5QmluZGluZyhUaSwgJ0FQSScpOyAvLyBCYXNpY2FsbHkgZG9lcyB0aGUgc2FtZSB0aGluZyBpT1MgZG9lcyBmb3IgQVBJIG1vZHVsZSAobGF6eSBwcm9wZXJ0eSBnZXR0ZXIpXG5cdCAgICAvLyBIZXJlLCB3ZSBnbyB0aHJvdWdoIGFsbCB0aGUgc3BlY2lhbGx5IG1hcmtlZCBBUElzIHRvIGdlbmVyYXRlIHRoZSB3cmFwcGVycyB0byBwYXNzIGluIHRoZSBzb3VyY2VVcmxcblx0ICAgIC8vIFRPRE86IFRoaXMgaXMgYWxsIGluc2FuZSwgYW5kIHdlIHNob3VsZCBqdXN0IGJha2UgaXQgaW50byB0aGUgUHJveHkgY29udmVyc2lvbiBzdHVmZiB0byBncmFiIGFuZCBwYXNzIGFsb25nIHNvdXJjZVVybFxuXHQgICAgLy8gUmF0aGVyIHRoYW4gY2FycnkgaXQgYWxsIG92ZXIgdGhlIHBsYWNlIGxpa2UgdGhpcyFcblx0ICAgIC8vIFdlIGFscmVhZHkgbmVlZCB0byBnZW5lcmF0ZSBhIEtyb2xsSW52b2NhdGlvbiBvYmplY3QgdG8gd3JhcCB0aGUgc291cmNlVXJsIVxuXG5cdCAgICBmdW5jdGlvbiBUaXRhbml1bVdyYXBwZXIoY29udGV4dCkge1xuXHQgICAgICBjb25zdCBzb3VyY2VVcmwgPSB0aGlzLnNvdXJjZVVybCA9IGNvbnRleHQuc291cmNlVXJsO1xuXHQgICAgICBjb25zdCBzY29wZVZhcnMgPSBuZXcga3JvbGwuU2NvcGVWYXJzKHtcblx0ICAgICAgICBzb3VyY2VVcmxcblx0ICAgICAgfSk7XG5cdCAgICAgIFRpLmJpbmRJbnZvY2F0aW9uQVBJcyh0aGlzLCBzY29wZVZhcnMpO1xuXHQgICAgfVxuXG5cdCAgICBUaXRhbml1bVdyYXBwZXIucHJvdG90eXBlID0gVGk7XG5cdCAgICBUaS5XcmFwcGVyID0gVGl0YW5pdW1XcmFwcGVyOyAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXHQgICAgLy8gVGhpcyBsb29wcyB0aHJvdWdoIGFsbCBrbm93biBBUElzIHRoYXQgcmVxdWlyZSBhblxuXHQgICAgLy8gSW52b2NhdGlvbiBvYmplY3QgYW5kIHdyYXBzIHRoZW0gc28gd2UgY2FuIHBhc3MgYVxuXHQgICAgLy8gc291cmNlIFVSTCBhcyB0aGUgZmlyc3QgYXJndW1lbnRcblxuXHQgICAgVGkuYmluZEludm9jYXRpb25BUElzID0gZnVuY3Rpb24gKHdyYXBwZXJUaSwgc2NvcGVWYXJzKSB7XG5cdCAgICAgIGZvciAoY29uc3QgYXBpIG9mIFRpLmludm9jYXRpb25BUElzKSB7XG5cdCAgICAgICAgLy8gc2VwYXJhdGUgZWFjaCBpbnZva2VyIGludG8gaXQncyBvd24gcHJpdmF0ZSBzY29wZVxuXHQgICAgICAgIGludm9rZXIuZ2VuSW52b2tlcih3cmFwcGVyVGksIFRpLCAnVGl0YW5pdW0nLCBhcGksIHNjb3BlVmFycyk7XG5cdCAgICAgIH1cblx0ICAgIH07XG5cblx0ICAgIFByb3h5Qm9vdHN0cmFwKHRpQmluZGluZywgVGkpO1xuXHQgICAgcmV0dXJuIG5ldyBUaXRhbml1bVdyYXBwZXIoe1xuXHQgICAgICAvLyBFdmVuIHRob3VnaCB0aGUgZW50cnkgcG9pbnQgaXMgcmVhbGx5IHRpOi8va3JvbGwuanMsIHRoYXQgd2lsbCBicmVhayByZXNvbHV0aW9uIG9mIHVybHMgdW5kZXIgdGhlIGNvdmVycyFcblx0ICAgICAgLy8gU28gYmFzaWNhbGx5IGp1c3QgYXNzdW1lIGFwcC5qcyBhcyB0aGUgcmVsYXRpdmUgZmlsZSBiYXNlXG5cdCAgICAgIHNvdXJjZVVybDogJ2FwcDovL2FwcC5qcydcblx0ICAgIH0pO1xuXHQgIH1cblx0fVxuXG5cdC8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuXHQvLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuXHQvLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG5cdC8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuXHQvLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG5cdC8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcblx0Ly8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG5cdC8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXHQvLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuXHQvLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblx0Ly8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuXHQvLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG5cdC8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cblx0Ly8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG5cdC8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuXHQvLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG5cdC8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cdC8vIE1vZGlmaWNhdGlvbnMgQ29weXJpZ2h0IDIwMTEtUHJlc2VudCBBcHBjZWxlcmF0b3IsIEluYy5cblx0ZnVuY3Rpb24gRXZlbnRFbWl0dGVyQm9vdHN0cmFwKGdsb2JhbCwga3JvbGwpIHtcblx0ICBjb25zdCBUQUcgPSAnRXZlbnRFbWl0dGVyJztcblx0ICBjb25zdCBFdmVudEVtaXR0ZXIgPSBrcm9sbC5FdmVudEVtaXR0ZXI7XG5cdCAgY29uc3QgaXNBcnJheSA9IEFycmF5LmlzQXJyYXk7IC8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW5cblx0ICAvLyAxMCBsaXN0ZW5lcnMgYXJlIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2hcblx0ICAvLyBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cblxuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAnY2FsbEhhbmRsZXInLCB7XG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gKGhhbmRsZXIsIHR5cGUsIGRhdGEpIHtcblx0ICAgICAgLy8ga3JvbGwubG9nKFRBRywgXCJjYWxsaW5nIGV2ZW50IGhhbmRsZXI6IHR5cGU6XCIgKyB0eXBlICsgXCIsIGRhdGE6IFwiICsgZGF0YSArIFwiLCBoYW5kbGVyOiBcIiArIGhhbmRsZXIpO1xuXHQgICAgICB2YXIgaGFuZGxlZCA9IGZhbHNlLFxuXHQgICAgICAgICAgY2FuY2VsQnViYmxlID0gZGF0YS5jYW5jZWxCdWJibGUsXG5cdCAgICAgICAgICBldmVudDtcblxuXHQgICAgICBpZiAoaGFuZGxlci5saXN0ZW5lciAmJiBoYW5kbGVyLmxpc3RlbmVyLmNhbGwpIHtcblx0ICAgICAgICAvLyBDcmVhdGUgZXZlbnQgb2JqZWN0LCBjb3B5IGFueSBjdXN0b20gZXZlbnQgZGF0YSwgYW5kIHNldCB0aGUgXCJ0eXBlXCIgYW5kIFwic291cmNlXCIgcHJvcGVydGllcy5cblx0ICAgICAgICBldmVudCA9IHtcblx0ICAgICAgICAgIHR5cGU6IHR5cGUsXG5cdCAgICAgICAgICBzb3VyY2U6IHRoaXNcblx0ICAgICAgICB9O1xuXHQgICAgICAgIGtyb2xsLmV4dGVuZChldmVudCwgZGF0YSk7XG5cblx0ICAgICAgICBpZiAoaGFuZGxlci5zZWxmICYmIGV2ZW50LnNvdXJjZSA9PSBoYW5kbGVyLnNlbGYudmlldykge1xuXHQgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcblx0ICAgICAgICAgIGV2ZW50LnNvdXJjZSA9IGhhbmRsZXIuc2VsZjtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBoYW5kbGVyLmxpc3RlbmVyLmNhbGwodGhpcywgZXZlbnQpOyAvLyBUaGUgXCJjYW5jZWxCdWJibGVcIiBwcm9wZXJ0eSBtYXkgYmUgcmVzZXQgaW4gdGhlIGhhbmRsZXIuXG5cblx0ICAgICAgICBpZiAoZXZlbnQuY2FuY2VsQnViYmxlICE9PSBjYW5jZWxCdWJibGUpIHtcblx0ICAgICAgICAgIGNhbmNlbEJ1YmJsZSA9IGV2ZW50LmNhbmNlbEJ1YmJsZTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBoYW5kbGVkID0gdHJ1ZTtcblx0ICAgICAgfSBlbHNlIGlmIChrcm9sbC5EQkcpIHtcblx0ICAgICAgICBrcm9sbC5sb2coVEFHLCAnaGFuZGxlciBmb3IgZXZlbnQgXFwnJyArIHR5cGUgKyAnXFwnIGlzICcgKyB0eXBlb2YgaGFuZGxlci5saXN0ZW5lciArICcgYW5kIGNhbm5vdCBiZSBjYWxsZWQuJyk7XG5cdCAgICAgIH0gLy8gQnViYmxlIHRoZSBldmVudHMgdG8gdGhlIHBhcmVudCB2aWV3IGlmIG5lZWRlZC5cblxuXG5cdCAgICAgIGlmIChkYXRhLmJ1YmJsZXMgJiYgIWNhbmNlbEJ1YmJsZSkge1xuXHQgICAgICAgIGhhbmRsZWQgPSB0aGlzLl9maXJlU3luY0V2ZW50VG9QYXJlbnQodHlwZSwgZGF0YSkgfHwgaGFuZGxlZDtcblx0ICAgICAgfVxuXG5cdCAgICAgIHJldHVybiBoYW5kbGVkO1xuXHQgICAgfSxcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlXG5cdCAgfSk7XG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlci5wcm90b3R5cGUsICdlbWl0Jywge1xuXHQgICAgdmFsdWU6IGZ1bmN0aW9uICh0eXBlKSB7XG5cdCAgICAgIHZhciBoYW5kbGVkID0gZmFsc2UsXG5cdCAgICAgICAgICBkYXRhID0gYXJndW1lbnRzWzFdLFxuXHQgICAgICAgICAgaGFuZGxlcixcblx0ICAgICAgICAgIGxpc3RlbmVyczsgLy8gU2V0IHRoZSBcImJ1YmJsZXNcIiBhbmQgXCJjYW5jZWxCdWJibGVcIiBwcm9wZXJ0aWVzIGZvciBldmVudCBkYXRhLlxuXG5cdCAgICAgIGlmIChkYXRhICE9PSBudWxsICYmIHR5cGVvZiBkYXRhID09PSAnb2JqZWN0Jykge1xuXHQgICAgICAgIGRhdGEuYnViYmxlcyA9ICEhZGF0YS5idWJibGVzO1xuXHQgICAgICAgIGRhdGEuY2FuY2VsQnViYmxlID0gISFkYXRhLmNhbmNlbEJ1YmJsZTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBkYXRhID0ge1xuXHQgICAgICAgICAgYnViYmxlczogZmFsc2UsXG5cdCAgICAgICAgICBjYW5jZWxCdWJibGU6IGZhbHNlXG5cdCAgICAgICAgfTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICh0aGlzLl9oYXNKYXZhTGlzdGVuZXIpIHtcblx0ICAgICAgICB0aGlzLl9vbkV2ZW50RmlyZWQodHlwZSwgZGF0YSk7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdIHx8ICF0aGlzLmNhbGxIYW5kbGVyKSB7XG5cdCAgICAgICAgaWYgKGRhdGEuYnViYmxlcyAmJiAhZGF0YS5jYW5jZWxCdWJibGUpIHtcblx0ICAgICAgICAgIGhhbmRsZWQgPSB0aGlzLl9maXJlU3luY0V2ZW50VG9QYXJlbnQodHlwZSwgZGF0YSk7XG5cdCAgICAgICAgfVxuXG5cdCAgICAgICAgcmV0dXJuIGhhbmRsZWQ7XG5cdCAgICAgIH1cblxuXHQgICAgICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG5cdCAgICAgIGlmICh0eXBlb2YgaGFuZGxlci5saXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuXHQgICAgICAgIGhhbmRsZWQgPSB0aGlzLmNhbGxIYW5kbGVyKGhhbmRsZXIsIHR5cGUsIGRhdGEpO1xuXHQgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkoaGFuZGxlcikpIHtcblx0ICAgICAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG5cblx0ICAgICAgICBmb3IgKHZhciBpID0gMCwgbCA9IGxpc3RlbmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcblx0ICAgICAgICAgIGhhbmRsZWQgPSB0aGlzLmNhbGxIYW5kbGVyKGxpc3RlbmVyc1tpXSwgdHlwZSwgZGF0YSkgfHwgaGFuZGxlZDtcblx0ICAgICAgICB9XG5cdCAgICAgIH0gZWxzZSBpZiAoZGF0YS5idWJibGVzICYmICFkYXRhLmNhbmNlbEJ1YmJsZSkge1xuXHQgICAgICAgIGhhbmRsZWQgPSB0aGlzLl9maXJlU3luY0V2ZW50VG9QYXJlbnQodHlwZSwgZGF0YSk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gaGFuZGxlZDtcblx0ICAgIH0sXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pOyAvLyBUaXRhbml1bSBjb21wYXRpYmlsaXR5XG5cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ2ZpcmVFdmVudCcsIHtcblx0ICAgIHZhbHVlOiBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQsXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZSxcblx0ICAgIHdyaXRhYmxlOiB0cnVlXG5cdCAgfSk7XG5cdCAgT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlci5wcm90b3R5cGUsICdmaXJlU3luY0V2ZW50Jywge1xuXHQgICAgdmFsdWU6IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCxcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlXG5cdCAgfSk7IC8vIEV2ZW50RW1pdHRlciBpcyBkZWZpbmVkIGluIHNyYy9ub2RlX2V2ZW50cy5jY1xuXHQgIC8vIEV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCgpIGlzIGFsc28gZGVmaW5lZCB0aGVyZS5cblxuXHQgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIucHJvdG90eXBlLCAnYWRkTGlzdGVuZXInLCB7XG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyLCB2aWV3KSB7XG5cdCAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcblx0ICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FkZExpc3RlbmVyIG9ubHkgdGFrZXMgaW5zdGFuY2VzIG9mIEZ1bmN0aW9uLiBUaGUgbGlzdGVuZXIgZm9yIGV2ZW50IFwiJyArIHR5cGUgKyAnXCIgaXMgXCInICsgdHlwZW9mIGxpc3RlbmVyICsgJ1wiJyk7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoIXRoaXMuX2V2ZW50cykge1xuXHQgICAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXHQgICAgICB9XG5cblx0ICAgICAgdmFyIGlkOyAvLyBTZXR1cCBJRCBmaXJzdCBzbyB3ZSBjYW4gcGFzcyBjb3VudCBpbiB0byBcImxpc3RlbmVyQWRkZWRcIlxuXG5cdCAgICAgIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKSB7XG5cdCAgICAgICAgaWQgPSAwO1xuXHQgICAgICB9IGVsc2UgaWYgKGlzQXJyYXkodGhpcy5fZXZlbnRzW3R5cGVdKSkge1xuXHQgICAgICAgIGlkID0gdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aDtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgICBpZCA9IDE7XG5cdCAgICAgIH1cblxuXHQgICAgICB2YXIgbGlzdGVuZXJXcmFwcGVyID0ge307XG5cdCAgICAgIGxpc3RlbmVyV3JhcHBlci5saXN0ZW5lciA9IGxpc3RlbmVyO1xuXHQgICAgICBsaXN0ZW5lcldyYXBwZXIuc2VsZiA9IHZpZXc7XG5cblx0ICAgICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHtcblx0ICAgICAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cblx0ICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcldyYXBwZXI7XG5cdCAgICAgIH0gZWxzZSBpZiAoaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG5cdCAgICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuXHQgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyV3JhcHBlcik7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG5cdCAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJXcmFwcGVyXTtcblx0ICAgICAgfSAvLyBOb3RpZnkgdGhlIEphdmEgcHJveHkgaWYgdGhpcyBpcyB0aGUgZmlyc3QgbGlzdGVuZXIgYWRkZWQuXG5cblxuXHQgICAgICBpZiAoaWQgPT09IDApIHtcblx0ICAgICAgICB0aGlzLl9oYXNMaXN0ZW5lcnNGb3JFdmVudFR5cGUodHlwZSwgdHJ1ZSk7XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gaWQ7XG5cdCAgICB9LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTsgLy8gVGhlIEphdmFPYmplY3QgcHJvdG90eXBlIHdpbGwgcHJvdmlkZSBhIHZlcnNpb24gb2YgdGhpc1xuXHQgIC8vIHRoYXQgZGVsZWdhdGVzIGJhY2sgdG8gdGhlIEphdmEgcHJveHkuIE5vbi1KYXZhIHZlcnNpb25zXG5cdCAgLy8gb2YgRXZlbnRFbWl0dGVyIGRvbid0IGNhcmUsIHNvIHRoaXMgbm8gb3AgaXMgY2FsbGVkIGluc3RlYWQuXG5cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ19saXN0ZW5lckZvckV2ZW50Jywge1xuXHQgICAgdmFsdWU6IGZ1bmN0aW9uICgpIHt9LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTtcblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ29uJywge1xuXHQgICAgdmFsdWU6IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIsXG5cdCAgICBlbnVtZXJhYmxlOiBmYWxzZVxuXHQgIH0pOyAvLyBUaXRhbml1bSBjb21wYXRpYmlsaXR5XG5cblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ2FkZEV2ZW50TGlzdGVuZXInLCB7XG5cdCAgICB2YWx1ZTogRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcixcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlLFxuXHQgICAgd3JpdGFibGU6IHRydWVcblx0ICB9KTtcblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ29uY2UnLCB7XG5cdCAgICB2YWx1ZTogZnVuY3Rpb24gKHR5cGUsIGxpc3RlbmVyKSB7XG5cdCAgICAgIHZhciBzZWxmID0gdGhpcztcblxuXHQgICAgICBmdW5jdGlvbiBnKCkge1xuXHQgICAgICAgIHNlbGYucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cdCAgICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcblx0ICAgICAgc2VsZi5vbih0eXBlLCBnKTtcblx0ICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICB9LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTtcblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ3JlbW92ZUxpc3RlbmVyJywge1xuXHQgICAgdmFsdWU6IGZ1bmN0aW9uICh0eXBlLCBsaXN0ZW5lcikge1xuXHQgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG5cdCAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZW1vdmVMaXN0ZW5lciBvbmx5IHRha2VzIGluc3RhbmNlcyBvZiBGdW5jdGlvbicpO1xuXHQgICAgICB9IC8vIGRvZXMgbm90IHVzZSBsaXN0ZW5lcnMoKSwgc28gbm8gc2lkZSBlZmZlY3Qgb2YgY3JlYXRpbmcgX2V2ZW50c1t0eXBlXVxuXG5cblx0ICAgICAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSkge1xuXHQgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICB9XG5cblx0ICAgICAgdmFyIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cdCAgICAgIHZhciBjb3VudCA9IDA7XG5cblx0ICAgICAgaWYgKGlzQXJyYXkobGlzdCkpIHtcblx0ICAgICAgICB2YXIgcG9zaXRpb24gPSAtMTsgLy8gQWxzbyBzdXBwb3J0IGxpc3RlbmVyIGluZGV4ZXMgLyBpZHNcblxuXHQgICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgPT09ICdudW1iZXInKSB7XG5cdCAgICAgICAgICBwb3NpdGlvbiA9IGxpc3RlbmVyO1xuXG5cdCAgICAgICAgICBpZiAocG9zaXRpb24gPiBsaXN0Lmxlbmd0aCB8fCBwb3NpdGlvbiA8IDApIHtcblx0ICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgICAgICB9XG5cdCAgICAgICAgfSBlbHNlIHtcblx0ICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW5ndGggPSBsaXN0Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG5cdCAgICAgICAgICAgIGlmIChsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuXHQgICAgICAgICAgICAgIHBvc2l0aW9uID0gaTtcblx0ICAgICAgICAgICAgICBicmVhaztcblx0ICAgICAgICAgICAgfVxuXHQgICAgICAgICAgfVxuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGlmIChwb3NpdGlvbiA8IDApIHtcblx0ICAgICAgICAgIHJldHVybiB0aGlzO1xuXHQgICAgICAgIH1cblxuXHQgICAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcblxuXHQgICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuXHQgICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblx0ICAgICAgICB9XG5cblx0ICAgICAgICBjb3VudCA9IGxpc3QubGVuZ3RoO1xuXHQgICAgICB9IGVsc2UgaWYgKGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyIHx8IGxpc3RlbmVyID09IDApIHtcblx0ICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGVxZXFlcVxuXHQgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICAgIH1cblxuXHQgICAgICBpZiAoY291bnQgPT09IDApIHtcblx0ICAgICAgICB0aGlzLl9oYXNMaXN0ZW5lcnNGb3JFdmVudFR5cGUodHlwZSwgZmFsc2UpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICB9LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTtcblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ3JlbW92ZUV2ZW50TGlzdGVuZXInLCB7XG5cdCAgICB2YWx1ZTogRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcixcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlLFxuXHQgICAgd3JpdGFibGU6IHRydWVcblx0ICB9KTtcblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ3JlbW92ZUFsbExpc3RlbmVycycsIHtcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiAodHlwZSkge1xuXHQgICAgICAvLyBkb2VzIG5vdCB1c2UgbGlzdGVuZXJzKCksIHNvIG5vIHNpZGUgZWZmZWN0IG9mIGNyZWF0aW5nIF9ldmVudHNbdHlwZV1cblx0ICAgICAgaWYgKHR5cGUgJiYgdGhpcy5fZXZlbnRzICYmIHRoaXMuX2V2ZW50c1t0eXBlXSkge1xuXHQgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IG51bGw7XG5cblx0ICAgICAgICB0aGlzLl9oYXNMaXN0ZW5lcnNGb3JFdmVudFR5cGUodHlwZSwgZmFsc2UpO1xuXHQgICAgICB9XG5cblx0ICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICB9LFxuXHQgICAgZW51bWVyYWJsZTogZmFsc2Vcblx0ICB9KTtcblx0ICBPYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLnByb3RvdHlwZSwgJ2xpc3RlbmVycycsIHtcblx0ICAgIHZhbHVlOiBmdW5jdGlvbiAodHlwZSkge1xuXHQgICAgICBpZiAoIXRoaXMuX2V2ZW50cykge1xuXHQgICAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXHQgICAgICB9XG5cblx0ICAgICAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pIHtcblx0ICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbXTtcblx0ICAgICAgfVxuXG5cdCAgICAgIGlmICghaXNBcnJheSh0aGlzLl9ldmVudHNbdHlwZV0pKSB7XG5cdCAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG5cdCAgICAgIH1cblxuXHQgICAgICByZXR1cm4gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXHQgICAgfSxcblx0ICAgIGVudW1lcmFibGU6IGZhbHNlXG5cdCAgfSk7XG5cdCAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGlzIGlzIHVzZWQgYnkgQW5kcm9pZCB0byByZXF1aXJlIFwiYmFrZWQtaW5cIiBzb3VyY2UuXG5cdCAqIFNESyBhbmQgbW9kdWxlIGJ1aWxkcyB3aWxsIGJha2UgaW4gdGhlIHJhdyBzb3VyY2UgYXMgYyBzdHJpbmdzLCBhbmQgdGhpcyB3aWxsIHdyYXBcblx0ICogbG9hZGluZyB0aGF0IGNvZGUgaW4gdmlhIGtyb2xsLk5hdGl2ZU1vZHVsZS5yZXF1aXJlKDxpZD4pXG5cdCAqIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgdGhlIGJvb3RzdHJhcC5qcy5lanMgdGVtcGxhdGUuXG5cdCAqL1xuXHRmdW5jdGlvbiBOYXRpdmVNb2R1bGVCb290c3RyYXAoZ2xvYmFsLCBrcm9sbCkge1xuXHQgIGNvbnN0IFNjcmlwdCA9IGtyb2xsLmJpbmRpbmcoJ2V2YWxzJykuU2NyaXB0O1xuXHQgIGNvbnN0IHJ1bkluVGhpc0NvbnRleHQgPSBTY3JpcHQucnVuSW5UaGlzQ29udGV4dDtcblxuXHQgIGZ1bmN0aW9uIE5hdGl2ZU1vZHVsZShpZCkge1xuXHQgICAgdGhpcy5maWxlbmFtZSA9IGlkICsgJy5qcyc7XG5cdCAgICB0aGlzLmlkID0gaWQ7XG5cdCAgICB0aGlzLmV4cG9ydHMgPSB7fTtcblx0ICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XG5cdCAgfVxuXHQgIC8qKlxuXHQgICAqIFRoaXMgc2hvdWxkIGJlIGFuIG9iamVjdCB3aXRoIHN0cmluZyBrZXlzIChiYWtlZCBpbiBtb2R1bGUgaWRzKSAtPiBzdHJpbmcgdmFsdWVzIChzb3VyY2Ugb2YgdGhlIGJha2VkIGluIGpzIGNvZGUpXG5cdCAgICovXG5cblxuXHQgIE5hdGl2ZU1vZHVsZS5fc291cmNlID0ga3JvbGwuYmluZGluZygnbmF0aXZlcycpO1xuXHQgIE5hdGl2ZU1vZHVsZS5fY2FjaGUgPSB7fTtcblxuXHQgIE5hdGl2ZU1vZHVsZS5yZXF1aXJlID0gZnVuY3Rpb24gKGlkKSB7XG5cdCAgICBpZiAoaWQgPT09ICduYXRpdmVfbW9kdWxlJykge1xuXHQgICAgICByZXR1cm4gTmF0aXZlTW9kdWxlO1xuXHQgICAgfVxuXG5cdCAgICBpZiAoaWQgPT09ICdpbnZva2VyJykge1xuXHQgICAgICByZXR1cm4gaW52b2tlcjsgLy8gQW5kcm9pZCBuYXRpdmUgbW9kdWxlcyB1c2UgYSBib290c3RyYXAuanMgZmlsZSB0aGF0IGFzc3VtZXMgdGhlcmUncyBhIGJ1aWx0aW4gJ2ludm9rZXInXG5cdCAgICB9XG5cblx0ICAgIGNvbnN0IGNhY2hlZCA9IE5hdGl2ZU1vZHVsZS5nZXRDYWNoZWQoaWQpO1xuXG5cdCAgICBpZiAoY2FjaGVkKSB7XG5cdCAgICAgIHJldHVybiBjYWNoZWQuZXhwb3J0cztcblx0ICAgIH1cblxuXHQgICAgaWYgKCFOYXRpdmVNb2R1bGUuZXhpc3RzKGlkKSkge1xuXHQgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHN1Y2ggbmF0aXZlIG1vZHVsZSAnICsgaWQpO1xuXHQgICAgfVxuXG5cdCAgICBjb25zdCBuYXRpdmVNb2R1bGUgPSBuZXcgTmF0aXZlTW9kdWxlKGlkKTtcblx0ICAgIG5hdGl2ZU1vZHVsZS5jb21waWxlKCk7XG5cdCAgICBuYXRpdmVNb2R1bGUuY2FjaGUoKTtcblx0ICAgIHJldHVybiBuYXRpdmVNb2R1bGUuZXhwb3J0cztcblx0ICB9O1xuXG5cdCAgTmF0aXZlTW9kdWxlLmdldENhY2hlZCA9IGZ1bmN0aW9uIChpZCkge1xuXHQgICAgcmV0dXJuIE5hdGl2ZU1vZHVsZS5fY2FjaGVbaWRdO1xuXHQgIH07XG5cblx0ICBOYXRpdmVNb2R1bGUuZXhpc3RzID0gZnVuY3Rpb24gKGlkKSB7XG5cdCAgICByZXR1cm4gaWQgaW4gTmF0aXZlTW9kdWxlLl9zb3VyY2U7XG5cdCAgfTtcblxuXHQgIE5hdGl2ZU1vZHVsZS5nZXRTb3VyY2UgPSBmdW5jdGlvbiAoaWQpIHtcblx0ICAgIHJldHVybiBOYXRpdmVNb2R1bGUuX3NvdXJjZVtpZF07XG5cdCAgfTtcblxuXHQgIE5hdGl2ZU1vZHVsZS53cmFwID0gZnVuY3Rpb24gKHNjcmlwdCkge1xuXHQgICAgcmV0dXJuIE5hdGl2ZU1vZHVsZS53cmFwcGVyWzBdICsgc2NyaXB0ICsgTmF0aXZlTW9kdWxlLndyYXBwZXJbMV07XG5cdCAgfTtcblxuXHQgIE5hdGl2ZU1vZHVsZS53cmFwcGVyID0gWycoZnVuY3Rpb24gKGV4cG9ydHMsIHJlcXVpcmUsIG1vZHVsZSwgX19maWxlbmFtZSwgX19kaXJuYW1lLCBUaXRhbml1bSwgVGksIGdsb2JhbCwga3JvbGwpIHsnLCAnXFxufSk7J107XG5cblx0ICBOYXRpdmVNb2R1bGUucHJvdG90eXBlLmNvbXBpbGUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICBsZXQgc291cmNlID0gTmF0aXZlTW9kdWxlLmdldFNvdXJjZSh0aGlzLmlkKTtcblx0ICAgIHNvdXJjZSA9IE5hdGl2ZU1vZHVsZS53cmFwKHNvdXJjZSk7IC8vIEFsbCBuYXRpdmUgbW9kdWxlcyBoYXZlIHRoZWlyIGZpbGVuYW1lIHByZWZpeGVkIHdpdGggdGk6L1xuXG5cdCAgICBjb25zdCBmaWxlbmFtZSA9IGB0aTovJHt0aGlzLmZpbGVuYW1lfWA7XG5cdCAgICBjb25zdCBmbiA9IHJ1bkluVGhpc0NvbnRleHQoc291cmNlLCBmaWxlbmFtZSwgdHJ1ZSk7XG5cdCAgICBmbih0aGlzLmV4cG9ydHMsIE5hdGl2ZU1vZHVsZS5yZXF1aXJlLCB0aGlzLCB0aGlzLmZpbGVuYW1lLCBudWxsLCBnbG9iYWwuVGksIGdsb2JhbC5UaSwgZ2xvYmFsLCBrcm9sbCk7XG5cdCAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG5cdCAgfTtcblxuXHQgIE5hdGl2ZU1vZHVsZS5wcm90b3R5cGUuY2FjaGUgPSBmdW5jdGlvbiAoKSB7XG5cdCAgICBOYXRpdmVNb2R1bGUuX2NhY2hlW3RoaXMuaWRdID0gdGhpcztcblx0ICB9O1xuXG5cdCAgcmV0dXJuIE5hdGl2ZU1vZHVsZTtcblx0fVxuXG5cdC8vIFRoaXMgaXMgdGhlIGZpbGUgZWFjaCBwbGF0Zm9ybSBsb2FkcyBvbiBib290ICpiZWZvcmUqIHdlIGxhdW5jaCB0aS5tYWluLmpzIHRvIGluc2VydCBhbGwgb3VyIHNoaW1zL2V4dGVuc2lvbnNcblx0LyoqXG5cdCAqIG1haW4gYm9vdHN0cmFwcGluZyBmdW5jdGlvblxuXHQgKiBAcGFyYW0ge29iamVjdH0gZ2xvYmFsIHRoZSBnbG9iYWwgb2JqZWN0XG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBrcm9sbDsgdGhlIGtyb2xsIG1vZHVsZS9iaW5kaW5nXG5cdCAqIEByZXR1cm4ge3ZvaWR9ICAgICAgIFtkZXNjcmlwdGlvbl1cblx0ICovXG5cblx0ZnVuY3Rpb24gYm9vdHN0cmFwKGdsb2JhbCwga3JvbGwpIHtcblx0ICAvLyBXb3JrcyBpZGVudGljYWwgdG8gT2JqZWN0Lmhhc093blByb3BlcnR5LCBleGNlcHRcblx0ICAvLyBhbHNvIHdvcmtzIGlmIHRoZSBnaXZlbiBvYmplY3QgZG9lcyBub3QgaGF2ZSB0aGUgbWV0aG9kXG5cdCAgLy8gb24gaXRzIHByb3RvdHlwZSBvciBpdCBoYXMgYmVlbiBtYXNrZWQuXG5cdCAgZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eSkge1xuXHQgICAgcmV0dXJuIE9iamVjdC5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpO1xuXHQgIH1cblxuXHQgIGtyb2xsLmV4dGVuZCA9IGZ1bmN0aW9uICh0aGlzT2JqZWN0LCBvdGhlck9iamVjdCkge1xuXHQgICAgaWYgKCFvdGhlck9iamVjdCkge1xuXHQgICAgICAvLyBleHRlbmQgd2l0aCB3aGF0PyEgIGRlbmllZCFcblx0ICAgICAgcmV0dXJuO1xuXHQgICAgfVxuXG5cdCAgICBmb3IgKHZhciBuYW1lIGluIG90aGVyT2JqZWN0KSB7XG5cdCAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eShvdGhlck9iamVjdCwgbmFtZSkpIHtcblx0ICAgICAgICB0aGlzT2JqZWN0W25hbWVdID0gb3RoZXJPYmplY3RbbmFtZV07XG5cdCAgICAgIH1cblx0ICAgIH1cblxuXHQgICAgcmV0dXJuIHRoaXNPYmplY3Q7XG5cdCAgfTtcblx0ICAvKipcblx0ICAgKiBUaGlzIGlzIHVzZWQgdG8gc2h1dHRsZSB0aGUgc291cmNlVXJsIGFyb3VuZCB0byBBUElzIHRoYXQgbWF5IG5lZWQgdG9cblx0ICAgKiByZXNvbHZlIHJlbGF0aXZlIHBhdGhzIGJhc2VkIG9uIHRoZSBpbnZva2luZyBmaWxlLlxuXHQgICAqIChzZWUgS3JvbGxJbnZvY2F0aW9uLmphdmEgZm9yIG1vcmUpXG5cdCAgICogQHBhcmFtIHtvYmplY3R9IHZhcnMga2V5L3ZhbHVlIHBhaXJzIHRvIHN0b3JlXG5cdCAgICogQHBhcmFtIHtzdHJpbmd9IHZhcnMuc291cmNlVXJsIHRoZSBzb3VyY2UgVVJMIG9mIHRoZSBmaWxlIGNhbGxpbmcgdGhlIEFQSVxuXHQgICAqIEBjb25zdHJ1Y3RvclxuXHQgICAqIEByZXR1cm5zIHtTY29wZVZhcnN9XG5cdCAgICovXG5cblxuXHQgIGZ1bmN0aW9uIFNjb3BlVmFycyh2YXJzKSB7XG5cdCAgICBpZiAoIXZhcnMpIHtcblx0ICAgICAgcmV0dXJuIHRoaXM7XG5cdCAgICB9XG5cblx0ICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh2YXJzKTtcblx0ICAgIGNvbnN0IGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuXG5cdCAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG5cdCAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG5cdCAgICAgIHRoaXNba2V5XSA9IHZhcnNba2V5XTtcblx0ICAgIH1cblx0ICB9XG5cblx0ICBmdW5jdGlvbiBzdGFydHVwKCkge1xuXHQgICAgZ2xvYmFsLmdsb2JhbCA9IGdsb2JhbDsgLy8gaGFuZyB0aGUgZ2xvYmFsIG9iamVjdCBvZmYgaXRzZWxmXG5cblx0ICAgIGdsb2JhbC5rcm9sbCA9IGtyb2xsOyAvLyBoYW5nIG91ciBzcGVjaWFsIHVuZGVyIHRoZSBob29kIGtyb2xsIG9iamVjdCBvZmYgdGhlIGdsb2JhbFxuXG5cdCAgICB7XG5cdCAgICAgIGtyb2xsLlNjb3BlVmFycyA9IFNjb3BlVmFyczsgLy8gZXh0ZXJuYWwgbW9kdWxlIGJvb3RzdHJhcC5qcyBleHBlY3RzIHRvIGNhbGwga3JvbGwuTmF0aXZlTW9kdWxlLnJlcXVpcmUgZGlyZWN0bHkgdG8gbG9hZCBpbiB0aGVpciBvd24gc291cmNlXG5cdCAgICAgIC8vIGFuZCB0byByZWZlciB0byB0aGUgYmFrZWQgaW4gXCJib290c3RyYXAuanNcIiBmb3IgdGhlIFNESyBhbmQgXCJpbnZva2VyLmpzXCIgdG8gaGFuZyBsYXp5IEFQSXMvd3JhcCBhcGkgY2FsbHMgdG8gcGFzcyBpbiBzY29wZSB2YXJzXG5cblx0ICAgICAga3JvbGwuTmF0aXZlTW9kdWxlID0gTmF0aXZlTW9kdWxlQm9vdHN0cmFwKGdsb2JhbCwga3JvbGwpOyAvLyBBbmRyb2lkIHVzZXMgaXQncyBvd24gRXZlbnRFbWl0dGVyIGltcGwsIGFuZCBpdCdzIGJha2VkIHJpZ2h0IGludG8gdGhlIHByb3h5IGNsYXNzIGNoYWluXG5cdCAgICAgIC8vIEl0IGFzc3VtZXMgaXQgY2FuIGNhbGwgYmFjayBpbnRvIGphdmEgcHJveGllcyB0byBhbGVydCB3aGVuIGxpc3RlbmVycyBhcmUgYWRkZWQvcmVtb3ZlZFxuXHQgICAgICAvLyBGSVhNRTogR2V0IGl0IHRvIHVzZSB0aGUgZXZlbnRzLmpzIGltcGwgaW4gdGhlIG5vZGUgZXh0ZW5zaW9uLCBhbmQgZ2V0IGlPUyB0byBiYWtlIHRoYXQgaW50byBpdCdzIHByb3hpZXMgYXMgd2VsbCFcblxuXHQgICAgICBFdmVudEVtaXR0ZXJCb290c3RyYXAoZ2xvYmFsLCBrcm9sbCk7XG5cdCAgICB9XG5cblx0ICAgIGdsb2JhbC5UaSA9IGdsb2JhbC5UaXRhbml1bSA9IGJvb3RzdHJhcCQxKGdsb2JhbCwga3JvbGwpO1xuXHQgICAgZ2xvYmFsLk1vZHVsZSA9IGJvb3RzdHJhcCQyKGdsb2JhbCwga3JvbGwpO1xuXHQgIH1cblxuXHQgIHN0YXJ0dXAoKTtcblx0fVxuXG5cdHJldHVybiBib290c3RyYXA7XG5cbn0oKSk7XG4iXSwic291cmNlUm9vdCI6IkM6XFxQcm9ncmFtRGF0YVxcVGl0YW5pdW1cXG1vYmlsZXNka1xcd2luMzJcXDEwLjEuMS5HQVxcY29tbW9uXFxSZXNvdXJjZXNcXGFuZHJvaWQifQ==
