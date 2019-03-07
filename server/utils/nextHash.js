const { pad } = require('./zeroPad.js');

module.exports = {
  nextHash: () => pad(Math.floor(Math.random() * 10000)),
};
