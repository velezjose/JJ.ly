const { pad } = require('./zeroPad.js');
const { RandomizedSet: RS } = require('./RandomizedSet');

const randomSet = new RS();

module.exports = {
  nextHash: (orderOfMagnitude) => pad(randomSet.getNextRandom(orderOfMagnitude)),
};
