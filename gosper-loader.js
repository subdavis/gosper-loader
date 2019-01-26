const utils = require('loader-utils');
const crypto = require('crypto');
const pug = require('pug');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const _ = require('lodash');

const CONFIG_JS_FILENAME = 'gosper.config.js';

function findConfigUpwards(rootDir) {
  let dirname = rootDir;
  while (true) {
    if (fs.existsSync(path.join(dirname, CONFIG_JS_FILENAME))) {
      return dirname;
    }
    const nextDir = path.dirname(dirname);
    if (dirname === nextDir) break;
    dirname = nextDir;
  }
  return null;
}

/**
 * Convert Strings from camelCase to kebab-case
 * @returns {string}
 * @param input
 */
function camelToKebab(input) {
  return input.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * @param {Object} obj 
 * @param {Array<String>} matches 
 * @param {Function} callback 
 * @param {String} pathname 
 */
function recurse(obj, matches, callback, pathname = '',) {
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => recurse(v, matches, callback, `${pathname}[${i}]`));
  } else if (typeof obj === 'object' && obj) {
    obj['configpath'] = pathname;
    for(const key in obj) {
      if (matches.includes(key)) {
        obj[key] = callback(key, obj, pathname);
      }
      recurse(obj[key], matches, callback, `${pathname ? pathname + '.' : ''}${key}`);
    }
  }
}

module.exports = loader;

function loader(source, map, meta) {
  // TODO: figure out the other cases involved when loading gosper config.
  const confDir = findConfigUpwards(process.cwd());
  delete require.cache[require.resolve(path.join(confDir, CONFIG_JS_FILENAME))];
  this.addDependency(path.join(confDir, CONFIG_JS_FILENAME));
  const conf = require(path.join(confDir, CONFIG_JS_FILENAME));
  // Merge layout with component declarations.
  // This is a shallow merge.  If chilwin32 posix node object traversed declares "props", for example, 
  // it will override the component-declared props, not recursively merge.
  const hash = crypto.createHash('sha1').update(JSON.stringify(conf)).digest('hex');
  recurse(conf, ['children'], (k, o, p) => o[k].map(child => ({
    kebab: camelToKebab(child.name),
    ...conf.components[child.name],
    ...child,
    path: path.join(process.cwd(), conf.components[child.name].path),
  })));

  // The configuration path of the current layout
  // should be set in resourceQuery
  let configpath = 'root';
  const qs = querystring.parse(this.resourceQuery.substring(1));
  if ('configpath' in qs) {
    configpath = qs['configpath'];
  }
  const local = _.get(conf, configpath);
  const fn = pug.compile(source, {
    filename: this.resourcePath,
  });
  const out = fn({
    ...local,
    hash: hash.substring(0,8),
  });
  this.callback(null, out)
}
