const utils = require('loader-utils');
const pug = require('pug-loader');

module.exports = function(source, map, meta) {
  if (this.request.includes('.pug')) {
    console.log('pug');
    console.log(this.request)
  } else {
    
  }
  this.callback(null, source, map, meta)
}
